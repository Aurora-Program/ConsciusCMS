# RSS Feed Implementation Guide

## Overview

The ConsciusCMS now includes automatic RSS feed generation for your content. RSS feeds are dynamically generated from your DynamoDB Pages table and cached at CloudFront for optimal performance.

## Available RSS Feeds

### 1. Site-wide RSS Feed
**URL**: `https://yourdomain.com/rss.xml`
- Contains all published pages from your site
- Sorted by publication date (newest first)
- Limited to 50 most recent items
- Cached for 10 minutes

### 2. Tag-specific RSS Feed
**URL**: `https://yourdomain.com/tags/{tagname}/rss.xml`
- Contains only pages tagged with the specified tag
- Example: `https://yourdomain.com/tags/news/rss.xml`
- Same sorting and limits as site-wide feed

## Implementation Details

### Lambda Function: GenerateRssFunction
- **Runtime**: Node.js 20.x
- **Memory**: 256 MB
- **Timeout**: 10 seconds
- **Environment Variables**:
  - `PAGES_TABLE`: DynamoDB table name
  - `SITE_URL`: Your canonical site URL
  - `FEED_TITLE`: RSS feed title
  - `FEED_DESC`: RSS feed description

### RSS Item Structure
Each RSS item includes:
- **Title**: From `title` or `Title` field, falls back to page slug
- **Link**: `${SITE_URL}/${slug}`
- **GUID**: Unique identifier for the item
- **Publication Date**: From `publishedAt`, `PublishedAt`, `updatedAt`, or `UpdatedAt`
- **Description**: From `summary`, `Summary`, or `description` field
- **Categories**: From `tags` or `Tags` array

### API Gateway Routes
- `GET /rss.xml` → GenerateRssFunction
- `GET /tags/{tag}/rss.xml` → GenerateRssFunction

### CloudFront Caching
- RSS feeds cached for 10 minutes
- Compressed and optimized for delivery
- Separate cache behaviors for main feed and tag feeds

## Database Schema Expectations

The RSS generator expects your DynamoDB Pages table to have items with these fields:
- `Page` or `slug`: Page identifier/URL slug
- `title` or `Title`: Page title
- `summary`, `Summary`, or `description`: Brief description
- `publishedAt`, `PublishedAt`, `updatedAt`, or `UpdatedAt`: Timestamps
- `tags` or `Tags`: Array of tag strings
- Optional: `published` and `visibility` for filtering

## Customization

### Filtering Published Content
Currently, the RSS generator fetches all pages. To filter for published/public content, uncomment and adjust these lines in the Lambda function:

```javascript
FilterExpression: "#pub = :true AND #vis = :public",
ExpressionAttributeNames: { "#pub":"published", "#vis":"visibility" },
ExpressionAttributeValues: { ":true": true, ":public": "public" }
```

### Feed Metadata
Update environment variables in the CloudFormation template:
- `FEED_TITLE`: Your site's RSS feed title
- `FEED_DESC`: Brief description of your feed

### Cache Duration
To change RSS cache duration, modify the `Cache-Control` header in the Lambda response:
```javascript
'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400'
```
- `s-maxage=600`: Cache for 10 minutes (600 seconds)
- `stale-while-revalidate=86400`: Serve stale content while revalidating for 1 day

## Testing

1. **Deploy the updated CloudFormation template**
2. **Test the main feed**: `curl https://yourdomain.com/rss.xml`
3. **Test tag feeds**: `curl https://yourdomain.com/tags/news/rss.xml`
4. **Validate XML**: Use an RSS validator tool
5. **Test caching**: Make multiple requests and check response headers

## Troubleshooting

### Empty Feeds
- Check if your DynamoDB table has data
- Verify the table name in the Lambda environment variable
- Check CloudWatch logs for the GenerateRssFunction

### Invalid XML
- Ensure content doesn't contain unescaped XML characters
- Check the `xmlEscape` function is properly escaping content

### Caching Issues
- RSS feeds are cached for 10 minutes
- To see immediate changes, add a cache-busting query parameter: `?v=123`

### Performance
- The Lambda function scans up to 200 items and returns 50
- For better performance with large datasets, consider adding a GSI for published content

## Security

- RSS feeds are publicly accessible (no authentication required)
- Content is filtered to ensure only intended public content is exposed
- Consider implementing additional filtering based on your security requirements

## Monitoring

Monitor RSS feed performance through:
- **CloudWatch Logs**: GenerateRssFunction execution logs
- **API Gateway Metrics**: Request count and latency
- **CloudFront Metrics**: Cache hit ratio and viewer requests

## Future Enhancements

Consider these improvements:
- Author-specific feeds: `/authors/{id}/rss.xml`
- Category-specific feeds beyond tags
- Enhanced content filtering
- Image support in RSS descriptions
- Podcast RSS support for audio content
