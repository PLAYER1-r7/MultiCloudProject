# workflow seed

This directory is reserved for Issue 18 and later GitHub Actions workflow implementation.

## Expected Workflow Areas Later

- frontend build validation
- essential test or smoke validation
- staging deployment
- production approval-gated promotion

## Current Constraint

- Keep workflow responsibilities split between validation and deployment
- Do not embed secrets in workflow files

## Current Workflow Inputs

- Build workflow:
  - no deployment secrets required
- Staging deploy workflow:
  - secret `AWS_ROLE_TO_ASSUME_STAGING`
  - variable `STAGING_AWS_REGION`
  - variable `STAGING_SITE_BUCKET_NAME`
  - optional variable `STAGING_CLOUDFRONT_DISTRIBUTION_ID`
  - optional variable `STAGING_BASE_URL`
  - optional variable `STAGING_SMOKE_PATHS`

## Post-Deploy Check Direction

- If `STAGING_BASE_URL` is set, the staging deploy workflow performs smoke checks after sync
- Default smoke paths are `/`, `/overview`, and `/guidance`
- CloudFront invalidation is optional and only runs when a distribution id is provided
