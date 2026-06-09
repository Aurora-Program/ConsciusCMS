# Helper script to get the required parameters for RSS deployment
# Run this script to extract the values you need for the RSS deployment

Write-Host "🔍 ConsciusCMS RSS Deployment Parameter Helper" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$Environment = Read-Host "Enter environment (dev/prod/test)"
if ([string]::IsNullOrEmpty($Environment)) {
    $Environment = "dev"
    Write-Host "Using default environment: dev" -ForegroundColor Yellow
}

Write-Host "`n📋 Gathering required parameters..." -ForegroundColor Yellow

try {
    # Get API Gateway information
    Write-Host "`n🔍 Finding API Gateway..." -ForegroundColor Cyan
    $apiGateways = aws apigateway get-rest-apis --query "items[?name=='ConsciusCMSApi-$Environment']" --output json | ConvertFrom-Json
    
    if ($apiGateways.Count -eq 0) {
        Write-Host "❌ No API Gateway found with name 'ConsciusCMSApi-$Environment'" -ForegroundColor Red
        Write-Host "   Available APIs:" -ForegroundColor Yellow
        aws apigateway get-rest-apis --query "items[].{Name:name,Id:id}" --output table
    } else {
        $apiGatewayId = $apiGateways[0].id
        Write-Host "✅ Found API Gateway: $apiGatewayId" -ForegroundColor Green
        
        # Get root resource ID
        $resources = aws apigateway get-resources --rest-api-id $apiGatewayId --query "items[?path=='/']" --output json | ConvertFrom-Json
        if ($resources.Count -gt 0) {
            $rootResourceId = $resources[0].id
            Write-Host "✅ Found Root Resource: $rootResourceId" -ForegroundColor Green
        } else {
            Write-Host "❌ Could not find root resource for API Gateway" -ForegroundColor Red
            $rootResourceId = "MANUAL_ENTRY_REQUIRED"
        }
    }
    
    # Get DynamoDB Tables
    Write-Host "`n🔍 Finding DynamoDB Tables..." -ForegroundColor Cyan
    $pagesTable = "Pages-$Environment"
    $tables = aws dynamodb list-tables --query "TableNames" --output json | ConvertFrom-Json
    if ($tables -contains $pagesTable) {
        Write-Host "✅ Found Pages Table: $pagesTable" -ForegroundColor Green
    } else {
        Write-Host "❌ Pages table '$pagesTable' not found" -ForegroundColor Red
        Write-Host "   Available tables:" -ForegroundColor Yellow
        $tables | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
        $pagesTable = "MANUAL_ENTRY_REQUIRED"
    }
    
    # Get IAM Roles
    Write-Host "`n🔍 Finding IAM Roles..." -ForegroundColor Cyan
    $roleName = "MicroserviceapExecutionLamda1Role-$Environment"
    try {
        $role = aws iam get-role --role-name $roleName --query "Role.Arn" --output text 2>$null
        if ($role -and $role -ne "None") {
            Write-Host "✅ Found Microservice Role: $role" -ForegroundColor Green
            $microserviceRole = $role
        } else {
            throw "Role not found"
        }
    } catch {
        Write-Host "❌ Role '$roleName' not found" -ForegroundColor Red
        Write-Host "   Looking for similar roles..." -ForegroundColor Yellow
        aws iam list-roles --query "Roles[?contains(RoleName, 'Microservice')].{Name:RoleName,Arn:Arn}" --output table
        $microserviceRole = "MANUAL_ENTRY_REQUIRED"
    }
    
} catch {
    Write-Host "❌ Error gathering parameters: $_" -ForegroundColor Red
    Write-Host "   Make sure AWS CLI is configured and you have the necessary permissions" -ForegroundColor Yellow
}

Write-Host "`n" + "="*50 -ForegroundColor Green
Write-Host "📋 DEPLOYMENT PARAMETERS" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Green

Write-Host "`n🔧 PowerShell Command:" -ForegroundColor Cyan
Write-Host ".\deploy-rss.ps1 ``" -ForegroundColor White
Write-Host "    -Environment `"$Environment`" ``" -ForegroundColor White
Write-Host "    -WebDomain `"your-domain.com`" ``" -ForegroundColor White
Write-Host "    -ExistingApiGatewayId `"$apiGatewayId`" ``" -ForegroundColor White
Write-Host "    -ExistingPagesTable `"$pagesTable`" ``" -ForegroundColor White
Write-Host "    -ExistingMicroserviceRole `"$microserviceRole`" ``" -ForegroundColor White
Write-Host "    -ExistingApiGatewayRootId `"$rootResourceId`"" -ForegroundColor White

Write-Host "`n🔧 Bash Command:" -ForegroundColor Cyan
Write-Host "export ENVIRONMENT=`"$Environment`"" -ForegroundColor White
Write-Host "export WEB_DOMAIN=`"your-domain.com`"" -ForegroundColor White
Write-Host "export EXISTING_API_GATEWAY_ID=`"$apiGatewayId`"" -ForegroundColor White
Write-Host "export EXISTING_PAGES_TABLE=`"$pagesTable`"" -ForegroundColor White
Write-Host "export EXISTING_MICROSERVICE_ROLE=`"$microserviceRole`"" -ForegroundColor White
Write-Host "export EXISTING_API_GATEWAY_ROOT_ID=`"$rootResourceId`"" -ForegroundColor White
Write-Host "./deploy-rss.sh" -ForegroundColor White

Write-Host "`n📝 Manual Parameter Values:" -ForegroundColor Cyan
Write-Host "Environment: $Environment"
Write-Host "WebDomain: your-domain.com (CHANGE THIS)"
Write-Host "ExistingApiGatewayId: $apiGatewayId"
Write-Host "ExistingPagesTable: $pagesTable"
Write-Host "ExistingMicroserviceRole: $microserviceRole"
Write-Host "ExistingApiGatewayRootId: $rootResourceId"

Write-Host "`n⚠️  Notes:" -ForegroundColor Yellow
Write-Host "- Replace 'your-domain.com' with your actual domain"
Write-Host "- If any parameter shows 'MANUAL_ENTRY_REQUIRED', you'll need to find the correct value manually"
Write-Host "- Make sure all resources exist before running the deployment"

Write-Host "`n🎯 Next Steps:" -ForegroundColor Green
Write-Host "1. Update your domain in the command above"
Write-Host "2. Verify all parameter values are correct"
Write-Host "3. Run the deployment script"
Write-Host "4. Test your RSS feeds at https://your-domain.com/rss.xml"
