#!/bin/bash
# RSS Feed Deployment Script for ConsciusCMS
# This script deploys the RSS-only template with the required parameters

set -e

# Configuration
STACK_NAME="ConsciusCMS-RSS-${ENVIRONMENT:-dev}"
TEMPLATE_FILE="rss-only-template.yml"
REGION=${AWS_REGION:-us-east-1}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 ConsciusCMS RSS Feed Deployment${NC}"
echo "=================================="

# Check if required parameters are set
if [ -z "$ENVIRONMENT" ]; then
    echo -e "${YELLOW}⚠️  ENVIRONMENT not set, using 'dev'${NC}"
    export ENVIRONMENT="dev"
fi

if [ -z "$WEB_DOMAIN" ]; then
    echo -e "${RED}❌ WEB_DOMAIN environment variable is required${NC}"
    echo "   export WEB_DOMAIN=yourdomain.com"
    exit 1
fi

if [ -z "$EXISTING_API_GATEWAY_ID" ]; then
    echo -e "${RED}❌ EXISTING_API_GATEWAY_ID environment variable is required${NC}"
    echo "   export EXISTING_API_GATEWAY_ID=your-api-gateway-id"
    exit 1
fi

if [ -z "$EXISTING_PAGES_TABLE" ]; then
    echo -e "${RED}❌ EXISTING_PAGES_TABLE environment variable is required${NC}"
    echo "   export EXISTING_PAGES_TABLE=Pages-dev"
    exit 1
fi

if [ -z "$EXISTING_MICROSERVICE_ROLE" ]; then
    echo -e "${RED}❌ EXISTING_MICROSERVICE_ROLE environment variable is required${NC}"
    echo "   export EXISTING_MICROSERVICE_ROLE=arn:aws:iam::123456789012:role/MicroserviceExecutionRole"
    exit 1
fi

if [ -z "$EXISTING_API_GATEWAY_ROOT_ID" ]; then
    echo -e "${RED}❌ EXISTING_API_GATEWAY_ROOT_ID environment variable is required${NC}"
    echo "   export EXISTING_API_GATEWAY_ROOT_ID=your-root-resource-id"
    exit 1
fi

echo -e "${GREEN}✅ Configuration:${NC}"
echo "   Environment: $ENVIRONMENT"
echo "   Domain: $WEB_DOMAIN"
echo "   Stack Name: $STACK_NAME"
echo "   Region: $REGION"
echo "   API Gateway ID: $EXISTING_API_GATEWAY_ID"
echo "   Pages Table: $EXISTING_PAGES_TABLE"
echo "   Root Resource ID: $EXISTING_API_GATEWAY_ROOT_ID"
echo ""

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${RED}❌ Template file $TEMPLATE_FILE not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Validating CloudFormation template...${NC}"
aws cloudformation validate-template --template-body file://$TEMPLATE_FILE --region $REGION

echo -e "${YELLOW}🔨 Deploying RSS Feed stack...${NC}"
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --region $REGION \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
        WebDomain=$WEB_DOMAIN \
        ExistingApiGatewayId=$EXISTING_API_GATEWAY_ID \
        ExistingPagesTable=$EXISTING_PAGES_TABLE \
        ExistingMicroserviceRole=$EXISTING_MICROSERVICE_ROLE \
        ExistingApiGatewayRootId=$EXISTING_API_GATEWAY_ROOT_ID \
    --no-fail-on-empty-changeset

echo -e "${GREEN}✅ RSS Feed deployment completed!${NC}"
echo ""
echo -e "${GREEN}📡 Your RSS feeds are now available at:${NC}"
echo "   📰 Main feed: https://$WEB_DOMAIN/rss.xml"
echo "   🏷️  Tag feeds: https://$WEB_DOMAIN/tags/{tagname}/rss.xml"
echo ""
echo -e "${YELLOW}🧪 Test your RSS feeds:${NC}"
echo "   curl -I https://$WEB_DOMAIN/rss.xml"
echo "   curl https://$WEB_DOMAIN/rss.xml"
echo ""
echo -e "${GREEN}🎉 RSS deployment successful!${NC}"
