# staging environment seed

This directory is reserved for the staging entrypoint of the portal delivery infrastructure.

## Expected Contents Later

- environment-level OpenTofu configuration
- backend and provider settings
- module wiring for the portal static delivery path
- staging-specific variables and outputs

## Current Naming Direction

- Default bucket naming is computed from `project_slug`, `site_slug`, `environment_name`, and `bucket_name_suffix`
- `site_bucket_name` can still override the computed value when a fixed bucket name is required

## GitHub Environment Variables

- Required secret:
  - `AWS_ROLE_TO_ASSUME_STAGING`
- Required variable:
  - `STAGING_SITE_BUCKET_NAME`
- Recommended variable:
  - `STAGING_AWS_REGION`
- Optional variables:
  - `STAGING_CLOUDFRONT_DISTRIBUTION_ID`
  - `STAGING_BASE_URL`
  - `STAGING_SMOKE_PATHS`

## Example Computed Bucket Pattern

- `multicloudproject-portal-staging-web`
- use `site_bucket_name` only when that computed pattern is not acceptable or not globally unique

## Backend State

- backend type: S3
- backend bucket: `multicloudproject-tfstate-apne1`
- backend key: `portal/staging/terraform.tfstate`
- backend region: `ap-northeast-1`
- current backend design does not add a separate lock table; state operations should stay serialized until a stronger locking design is introduced
