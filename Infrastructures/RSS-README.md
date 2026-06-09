# RSS-Only Template - Deployment Guide

This standalone template adds RSS feed functionality to your existing ConsciusCMS infrastructure.

## 🎯 What This Template Does

- ✅ **Creates RSS Lambda Function**: Generates RSS feeds from your DynamoDB Pages table
- ✅ **Adds API Gateway Routes**: `/rss.xml` and `/tags/{tag}/rss.xml`
- ✅ **Creates SSM Parameters**: Stores configuration for future reference
- ✅ **Sets Up Permissions**: Lambda invoke permissions for API Gateway

## 📋 Prerequisites

Before deploying this template, you need:

1. **Existing ConsciusCMS Infrastructure**:
   - API Gateway REST API
   - DynamoDB Pages table  
   - Lambda execution role
   - Working domain/CloudFront distribution

2. **Required Parameter Values**:
   - API Gateway REST API ID
   - API Gateway Root Resource ID
   - DynamoDB Pages table name
   - Lambda execution role ARN
   - Your website domain

## 🔍 Getting Parameter Values

### Option 1: Automated Helper (Recommended)
```powershell
.\get-rss-params.ps1
```
This script will automatically find most parameter values and generate the deployment command.

### Option 2: Manual Collection

#### API Gateway ID
```bash
aws apigateway get-rest-apis --query "items[?name=='ConsciusCMSApi-dev'].id" --output text
```

#### API Gateway Root Resource ID
```bash
# Replace YOUR_API_ID with the API Gateway ID from above
aws apigateway get-resources --rest-api-id YOUR_API_ID --query "items[?path=='/'].id" --output text
```

#### DynamoDB Pages Table
```bash
aws dynamodb list-tables --query "TableNames[?starts_with(@, 'Pages-')]" --output text
```

#### Lambda Execution Role
```bash
aws iam list-roles --query "Roles[?contains(RoleName, 'MicroserviceapExecutionLamda1Role')].Arn" --output text
```

## 🚀 Deployment Options

### Option 1: PowerShell (Windows)
```powershell
.\deploy-rss.ps1 `
    -Environment "dev" `
    -WebDomain "yourdomain.com" `
    -ExistingApiGatewayId "your-api-gateway-id" `
    -ExistingPagesTable "Pages-dev" `
    -ExistingMicroserviceRole "arn:aws:iam::123456789012:role/MicroserviceRole" `
    -ExistingApiGatewayRootId "your-root-resource-id"
```

### Option 2: Bash (Linux/Mac)
```bash
export ENVIRONMENT="dev"
export WEB_DOMAIN="yourdomain.com"
export EXISTING_API_GATEWAY_ID="your-api-gateway-id"
export EXISTING_PAGES_TABLE="Pages-dev"
export EXISTING_MICROSERVICE_ROLE="arn:aws:iam::123456789012:role/MicroserviceRole"
export EXISTING_API_GATEWAY_ROOT_ID="your-root-resource-id"
./deploy-rss.sh
```

### Option 3: Direct AWS CLI
```bash
aws cloudformation deploy \
    --template-file rss-only-template.yml \
    --stack-name ConsciusCMS-RSS-dev \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment=dev \
        WebDomain=yourdomain.com \
        ExistingApiGatewayId=your-api-gateway-id \
        ExistingPagesTable=Pages-dev \
        ExistingMicroserviceRole=arn:aws:iam::123456789012:role/MicroserviceRole \
        ExistingApiGatewayRootId=your-root-resource-id
```

## 🧪 Testing Your RSS Feeds

After deployment, test your RSS feeds:

### Check Feed Availability
```bash
# Test main RSS feed
curl -I https://yourdomain.com/rss.xml

# Test tag-specific feed
curl -I https://yourdomain.com/tags/news/rss.xml
```

### View RSS Content
```bash
# View main RSS feed
curl https://yourdomain.com/rss.xml

# View tag-specific feed  
curl https://yourdomain.com/tags/news/rss.xml
```

### Validate RSS XML
```bash
# Save and validate RSS
curl https://yourdomain.com/rss.xml > rss_feed.xml
xmllint --format rss_feed.xml
```

## 🔧 Configuration

### Environment Variables (Lambda Function)
- `PAGES_TABLE`: DynamoDB table name
- `SITE_URL`: Your canonical site URL
- `FEED_TITLE`: RSS feed title
- `FEED_DESC`: RSS feed description

### Feed URLs
- **Main feed**: `https://yourdomain.com/rss.xml`
- **Tag feeds**: `https://yourdomain.com/tags/{tagname}/rss.xml`

## 🗂️ Resources Created

This template creates:

### Lambda Function
- **GenerateRssFunction**: RSS feed generation (Node.js 20)

### SSM Parameters
- `/consciuscms/api-gateway-root-id`: Root resource ID
- `/consciuscms/api-gateway-rest-api-id`: API Gateway ID  
- `/consciuscms/pages-table-name`: Pages table name

### API Gateway Resources
- **ApiGatewayRssXmlResource**: `/rss.xml` endpoint
- **ApiGatewayTagsResource**: `/tags` endpoint
- **ApiGatewayTagValueResource**: `/tags/{tag}` endpoint
- **ApiGatewayTagRssXmlResource**: `/tags/{tag}/rss.xml` endpoint

### API Gateway Methods
- **ApiGatewayRssXmlGetMethod**: GET method for main RSS
- **ApiGatewayTagRssXmlGetMethod**: GET method for tag RSS

### Lambda Permissions
- **GenerateRssLambdaInvokePermission**: Main RSS permission
- **GenerateRssTagLambdaInvokePermission**: Tag RSS permission

## 🛠️ Troubleshooting

### Common Issues

**"Parameters cannot be found"**
- Run `get-rss-params.ps1` to verify parameter values
- Ensure all resources exist before deployment
- Check AWS CLI credentials and permissions

**"RSS feed returns empty"**
- Verify DynamoDB table has data
- Check Lambda function logs in CloudWatch
- Ensure Lambda has DynamoDB read permissions

**"RSS XML is malformed"**
- Check content for unescaped XML characters
- Review Lambda function logs for errors
- Validate RSS with online RSS validators

**"Permission denied"**
- Verify Lambda execution role has DynamoDB permissions
- Check API Gateway invoke permissions
- Ensure proper CloudFormation capabilities

### Debug Commands

```bash
# Check Lambda logs
aws logs tail /aws/lambda/GenerateRss-dev --follow

# Test API Gateway directly
curl -v https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev/rss.xml

# Check stack events
aws cloudformation describe-stack-events --stack-name ConsciusCMS-RSS-dev
```

## 🔄 Updates and Rollback

### Update Template
```bash
# Update existing stack
aws cloudformation deploy \
    --template-file rss-only-template.yml \
    --stack-name ConsciusCMS-RSS-dev \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides (same parameters as initial deploy)
```

### Rollback
```bash
# Delete RSS stack
aws cloudformation delete-stack --stack-name ConsciusCMS-RSS-dev
```

## 📊 Performance & Monitoring

- **Lambda Duration**: Typically < 5 seconds
- **Memory Usage**: 256 MB allocated  
- **Timeout**: 10 seconds
- **Concurrent Executions**: Scales automatically
- **Cost**: Pay-per-request, very low cost for RSS usage

Monitor through:
- CloudWatch Logs: Lambda execution logs
- CloudWatch Metrics: Duration, errors, invocations
- API Gateway Metrics: Request count and latency

## 🔐 Security Notes

- RSS feeds are publicly accessible (no authentication)
- Content is filtered through Lambda function
- Consider implementing additional filtering for sensitive content
- Monitor for unusual traffic patterns

## 🎉 Success Criteria

✅ **Deployment successful when:**
- CloudFormation stack completes without errors
- RSS feeds return valid XML
- Tag filtering works correctly  
- No impact on existing functionality
- RSS validates with standard RSS validators
