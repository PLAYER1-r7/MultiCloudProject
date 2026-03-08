# portal-static-site module

Reusable OpenTofu module for the portal static delivery baseline.

## Current Responsibilities

- create the private S3 bucket used for portal static assets
- create the CloudFront distribution that fronts the S3 origin through Origin Access Control
- support either the default CloudFront certificate or a supplied ACM certificate ARN
- attach a baseline CloudFront response headers policy for security-sensitive headers
- expose outputs needed by environment entrypoints and later deploy workflows

## Current Outputs

- site bucket name
- CloudFront distribution id
- CloudFront distribution domain name
- response headers policy id

## Notes

- this module is intentionally static-site only and does not create backend runtime resources
- custom aliases remain optional so staging can start with the default CloudFront domain
- more advanced delivery behavior should be added only when a later issue needs it
