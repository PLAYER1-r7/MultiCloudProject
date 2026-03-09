# portal-static-site module

Reusable OpenTofu module for the portal static delivery baseline.

## Current Responsibilities

- create the private S3 bucket used for portal static assets
- create the CloudFront distribution that fronts the S3 origin through Origin Access Control
- support either the default CloudFront certificate or a supplied us-east-1 ACM certificate ARN for CloudFront custom domains
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
- any custom-domain certificate ARN passed to this module should already be reviewed and CloudFront-compatible, rather than requested implicitly inside the module
- more advanced delivery behavior should be added only when a later issue needs it
