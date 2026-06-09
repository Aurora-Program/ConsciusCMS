# Deployment de RSS - Solo Recursos Nuevos

## Opción 1: Script Automático (Recomendado)

```powershell
# Ejecutar el script helper que obtiene automáticamente todos los valores
.\deploy-rss.ps1 -MainStackName "ConsciusCMS-prod" -Environment "prod" -WebDomain "tudominio.com"
```

## Opción 2: Manual con Template Standalone

1. **Obtener valores del stack principal:**

```bash
# API Gateway ID
aws cloudformation list-stack-resources --stack-name ConsciusCMS-prod \
  --query "StackResourceSummaries[?ResourceType=='AWS::ApiGateway::RestApi'].PhysicalResourceId" \
  --output text

# Pages Table Name  
aws cloudformation list-stack-resources --stack-name ConsciusCMS-prod \
  --query "StackResourceSummaries[?contains(LogicalResourceId, 'Pages') && ResourceType=='AWS::DynamoDB::Table'].PhysicalResourceId" \
  --output text

# Lambda Role ARN
ROLE_NAME=$(aws cloudformation list-stack-resources --stack-name ConsciusCMS-prod \
  --query "StackResourceSummaries[?contains(LogicalResourceId, 'MicroserviceExecutionRole')].PhysicalResourceId" \
  --output text)
aws iam get-role --role-name $ROLE_NAME --query "Role.Arn" --output text

# Root Resource ID (necesitas el API Gateway ID de arriba)
aws apigateway get-resources --rest-api-id <API_GATEWAY_ID> \
  --query "items[?path=='/'].id" --output text
```

2. **Desplegar el stack RSS:**

```bash
aws cloudformation deploy \
  --template-file rss-standalone-template.yml \
  --stack-name ConsciusCMS-RSS-prod \
  --parameter-overrides \
    Environment=prod \
    WebDomain=tudominio.com \
    ExistingApiGatewayId=<API_GATEWAY_ID> \
    ExistingPagesTable=<PAGES_TABLE_NAME> \
    ExistingMicroserviceRole=<LAMBDA_ROLE_ARN> \
    ExistingApiGatewayRootId=<ROOT_RESOURCE_ID> \
  --capabilities CAPABILITY_IAM
```

## Opción 3: Manual Paso a Paso

Si prefieres hacerlo paso a paso sin script:

1. **Obtener API Gateway ID:**
```bash
aws cloudformation describe-stacks --stack-name ConsciusCMS-prod \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayId'].OutputValue" --output text
```

2. **Si no está en outputs, buscar en recursos:**
```bash
aws cloudformation list-stack-resources --stack-name ConsciusCMS-prod \
  --query "StackResourceSummaries[?ResourceType=='AWS::ApiGateway::RestApi']"
```

3. **Obtener otros valores necesarios y usar el comando de deploy de arriba**

## Verificación Post-Deployment

1. **Verificar que el stack se creó:**
```bash
aws cloudformation describe-stacks --stack-name ConsciusCMS-RSS-prod
```

2. **Probar los endpoints RSS:**
```bash
# Feed principal
curl -I https://tudominio.com/rss.xml

# Feed por tag
curl -I https://tudominio.com/tags/news/rss.xml

# Ver contenido completo
curl https://tudominio.com/rss.xml
```

3. **Ver logs de la Lambda:**
```bash
aws logs tail /aws/lambda/GenerateRss-prod --follow
```

## Troubleshooting

**Error: Parameters cannot be found**
- Usa el script `deploy-rss.ps1` que obtiene automáticamente todos los valores
- O verifica manualmente que todos los parámetros están correctos

**Error: Invalid API Gateway ID**
- Verifica que el stack principal existe y está desplegado
- Usa el comando correcto para obtener el API Gateway ID

**RSS feed vacío**
- Verifica que la tabla DynamoDB tiene datos
- Revisa los logs de CloudWatch de la Lambda GenerateRss

**Error 403/404 en RSS endpoints**
- Verifica que el deployment del API Gateway se completó
- Puede tomar unos minutos en estar disponible

## Limpieza

Para eliminar solo los recursos RSS:
```bash
aws cloudformation delete-stack --stack-name ConsciusCMS-RSS-prod
```

Esto NO afectará tu stack principal de ConsciusCMS.
