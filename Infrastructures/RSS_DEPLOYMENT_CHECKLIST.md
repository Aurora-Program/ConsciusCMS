# RSS Feed Deployment Checklist

## Pre-Deployment Checklist

- [ ] **Backup Created**: Confirm backup of mainTemplate.yml is in `/backups/` directory
- [ ] **Review Changes**: Verify all RSS-related resources are properly configured
- [ ] **Environment Variables**: Confirm `SITE_URL` matches your actual domain
- [ ] **Feed Metadata**: Update `FEED_TITLE` and `FEED_DESC` if needed

## New Resources Added

### Lambda Functions
- [ ] **GenerateRssFunction**: RSS feed generation Lambda

### API Gateway Resources  
- [ ] **ApiGatewayRssXmlResource**: `/rss.xml` endpoint
- [ ] **ApiGatewayTagsResource**: `/tags` endpoint
- [ ] **ApiGatewayTagValueResource**: `/tags/{tag}` endpoint  
- [ ] **ApiGatewayTagRssXmlResource**: `/tags/{tag}/rss.xml` endpoint

### API Gateway Methods
- [ ] **ApiGatewayRssXmlGetMethod**: GET method for main RSS feed
- [ ] **ApiGatewayTagRssXmlGetMethod**: GET method for tag-specific feeds

### Lambda Permissions
- [ ] **GenerateRssLambdaInvokePermission**: Main RSS endpoint permission
- [ ] **GenerateRssTagLambdaInvokePermission**: Tag RSS endpoints permission

### CloudFront Cache Behaviors
- [ ] **RSS Feed Caching**: Cache behavior for `/rss.xml`
- [ ] **Tag RSS Caching**: Cache behavior for `/tags/*/rss.xml`

## Deployment Steps

1. **Update CloudFormation Stack**
   ```bash
   aws cloudformation update-stack \
     --stack-name YourStackName \
     --template-body file://mainTemplate.yml \
     --parameters ParameterKey=Environment,ParameterValue=prod \
                  ParameterKey=WebDomain,ParameterValue=yourdomain.com \
     --capabilities CAPABILITY_NAMED_IAM
   ```

2. **Monitor Deployment**
   - Watch CloudFormation events in AWS Console
   - Verify all new resources are created successfully
   - Check for any rollback conditions

3. **Test RSS Endpoints** (after deployment completes)
   ```bash
   # Test main RSS feed
   curl -I https://yourdomain.com/rss.xml
   
   # Test tag-specific feed
   curl -I https://yourdomain.com/tags/example/rss.xml
   
   # Full RSS content test
   curl https://yourdomain.com/rss.xml
   ```

## Post-Deployment Verification

### 1. Lambda Function Verification
- [ ] GenerateRssFunction exists and is properly configured
- [ ] Environment variables are correctly set
- [ ] Function has proper IAM permissions to read DynamoDB

### 2. API Gateway Verification  
- [ ] `/rss.xml` endpoint responds (even if empty)
- [ ] `/tags/{tag}/rss.xml` endpoint responds
- [ ] Proper CORS headers are included
- [ ] No authentication required for RSS endpoints

### 3. CloudFront Verification
- [ ] RSS requests are being cached
- [ ] Cache-Control headers are proper
- [ ] RSS content is properly compressed

### 4. Content Verification
- [ ] RSS XML is well-formed and valid
- [ ] RSS items include all expected fields
- [ ] Tag filtering works correctly
- [ ] Content is properly escaped

## Troubleshooting

### Common Issues

**RSS feed returns empty**
- Check DynamoDB table has data
- Verify Lambda environment variables
- Check CloudWatch logs for errors

**RSS XML is malformed**
- Content may contain unescaped characters
- Check the `xmlEscape` function
- Review RSS item construction

**Caching not working**
- Verify CloudFront cache behaviors
- Check Cache-Control headers in Lambda response
- Monitor CloudFront cache hit rates

**Lambda timeout errors**
- Increase timeout in CloudFormation template
- Optimize DynamoDB queries
- Consider pagination for large datasets

### Debugging Commands

```bash
# Check Lambda logs
aws logs tail /aws/lambda/GenerateRss-{Environment} --follow

# Test API Gateway directly
curl -v https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/rss.xml

# Validate RSS XML
xmllint --format rss_output.xml
```

## Rollback Plan

If issues occur:

1. **Quick Rollback**
   - Revert to previous CloudFormation template
   - Remove RSS-related dependencies from ApiGatewayDeployment

2. **Partial Rollback**
   - Comment out RSS cache behaviors in CloudFront
   - Keep Lambda function but remove API Gateway routes

3. **Full Restoration**
   - Use backup template from `/backups/` directory
   - Restore previous known-good configuration

## Performance Monitoring

After deployment, monitor:
- **Lambda Duration**: Should be under 5 seconds typically  
- **API Gateway Latency**: Should benefit from CloudFront caching
- **CloudFront Cache Hit Ratio**: Should be high for RSS feeds
- **DynamoDB Read Capacity**: Monitor for any capacity issues

## Success Criteria

✅ **Deployment Successful When:**
- CloudFormation stack update completes without errors
- RSS feeds return valid XML content
- Tag-based filtering works correctly
- CloudFront caching is active
- No impact on existing functionality
- RSS feeds validate with standard RSS validators
