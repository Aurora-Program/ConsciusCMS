#!/usr/bin/env pwsh
# RSS Feed Deployment Helper Script
# Este script obtiene los valores necesarios del stack principal y despliega el RSS template

param(
    [Parameter(Mandatory=$true)]
    [string]$MainStackName,
    
    [Parameter(Mandatory=$true)]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$WebDomain,
    
    [string]$RssStackName = "ConsciusCMS-RSS-$Environment"
)

Write-Host "🔍 Obteniendo información del stack principal: $MainStackName" -ForegroundColor Yellow

try {
    # Obtener outputs del stack principal
    $mainStack = aws cloudformation describe-stacks --stack-name $MainStackName --query "Stacks[0].Outputs" --output json | ConvertFrom-Json
    
    if (-not $mainStack) {
        Write-Error "No se pudo obtener información del stack principal: $MainStackName"
        exit 1
    }

    # Buscar los valores necesarios en los outputs
    $apiGatewayId = ($mainStack | Where-Object { $_.OutputKey -eq "ApiGatewayId" }).OutputValue
    $pagesTable = ($mainStack | Where-Object { $_.OutputKey -eq "PagesTableName" }).OutputValue
    $lambdaRole = ($mainStack | Where-Object { $_.OutputKey -eq "MicroserviceRoleArn" }).OutputValue
    
    # Si no están en outputs, buscar en los recursos del stack
    if (-not $apiGatewayId) {
        Write-Host "🔍 Buscando API Gateway ID en los recursos del stack..." -ForegroundColor Cyan
        $apiGatewayId = aws cloudformation list-stack-resources --stack-name $MainStackName --query "StackResourceSummaries[?ResourceType=='AWS::ApiGateway::RestApi'].PhysicalResourceId" --output text
    }
    
    if (-not $pagesTable) {
        Write-Host "🔍 Buscando Pages Table en los recursos del stack..." -ForegroundColor Cyan
        $pagesTable = aws cloudformation list-stack-resources --stack-name $MainStackName --query "StackResourceSummaries[?contains(LogicalResourceId, 'Pages') && ResourceType=='AWS::DynamoDB::Table'].PhysicalResourceId" --output text
    }
    
    if (-not $lambdaRole) {
        Write-Host "🔍 Buscando Lambda Role ARN en los recursos del stack..." -ForegroundColor Cyan
        $roleId = aws cloudformation list-stack-resources --stack-name $MainStackName --query "StackResourceSummaries[?contains(LogicalResourceId, 'MicroserviceExecutionRole') && ResourceType=='AWS::IAM::Role'].PhysicalResourceId" --output text
        if ($roleId) {
            $lambdaRole = aws iam get-role --role-name $roleId --query "Role.Arn" --output text
        }
    }
    
    # Obtener Root Resource ID del API Gateway
    $rootResourceId = ""
    if ($apiGatewayId) {
        Write-Host "🔍 Obteniendo Root Resource ID del API Gateway..." -ForegroundColor Cyan
        $rootResourceId = aws apigateway get-resources --rest-api-id $apiGatewayId --query "items[?path=='/'].id" --output text
    }

    # Verificar que tenemos todos los valores necesarios
    $missingValues = @()
    if (-not $apiGatewayId) { $missingValues += "API Gateway ID" }
    if (-not $pagesTable) { $missingValues += "Pages Table Name" }
    if (-not $lambdaRole) { $missingValues += "Lambda Role ARN" }
    if (-not $rootResourceId) { $missingValues += "Root Resource ID" }
    
    if ($missingValues.Count -gt 0) {
        Write-Error "❌ No se pudieron obtener los siguientes valores: $($missingValues -join ', ')"
        Write-Host "📋 Valores obtenidos:" -ForegroundColor Blue
        Write-Host "  API Gateway ID: $apiGatewayId" -ForegroundColor Gray
        Write-Host "  Pages Table: $pagesTable" -ForegroundColor Gray  
        Write-Host "  Lambda Role: $lambdaRole" -ForegroundColor Gray
        Write-Host "  Root Resource ID: $rootResourceId" -ForegroundColor Gray
        exit 1
    }

    Write-Host "✅ Todos los valores obtenidos exitosamente:" -ForegroundColor Green
    Write-Host "  API Gateway ID: $apiGatewayId" -ForegroundColor Gray
    Write-Host "  Pages Table: $pagesTable" -ForegroundColor Gray
    Write-Host "  Lambda Role: $lambdaRole" -ForegroundColor Gray
    Write-Host "  Root Resource ID: $rootResourceId" -ForegroundColor Gray

    # Construir comando de deployment
    $deployCommand = @(
        "aws cloudformation deploy",
        "--template-file rss-only-template.yml",
        "--stack-name $RssStackName",
        "--parameter-overrides",
        "Environment=$Environment",
        "WebDomain=$WebDomain",
        "ExistingApiGatewayId=$apiGatewayId",
        "ExistingPagesTable=$pagesTable",
        "ExistingMicroserviceRole=$lambdaRole",
        "ExistingApiGatewayRootId=$rootResourceId",
        "--capabilities CAPABILITY_IAM"
    ) -join " "

    Write-Host "🚀 Ejecutando deployment del stack RSS..." -ForegroundColor Yellow
    Write-Host $deployCommand -ForegroundColor Cyan

    # Ejecutar el comando
    Invoke-Expression $deployCommand

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ¡RSS Stack desplegado exitosamente!" -ForegroundColor Green
        Write-Host "📡 Los RSS feeds estarán disponibles en:" -ForegroundColor Blue
        Write-Host "  Main Feed: https://$WebDomain/rss.xml" -ForegroundColor Gray
        Write-Host "  Tag Feeds: https://$WebDomain/tags/{tag}/rss.xml" -ForegroundColor Gray
        
        Write-Host "🧪 Para probar:" -ForegroundColor Blue
        Write-Host "  curl -I https://$WebDomain/rss.xml" -ForegroundColor Gray
        Write-Host "  curl https://$WebDomain/rss.xml" -ForegroundColor Gray
    } else {
        Write-Error "❌ Error en el deployment. Revisa los logs arriba."
        exit 1
    }

} catch {
    Write-Error "❌ Error: $($_.Exception.Message)"
    exit 1
}
