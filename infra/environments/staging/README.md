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

## Build Artifact Handoff Expectation

- Issue 18 should upload the portal frontend build artifact from `apps/portal-web/dist`
- staging deploy is expected to sync that artifact into the bucket exposed by `site_bucket_name`
- optional CloudFront invalidation should target the `distribution_id` output when a deploy updates already-cached assets

## Staging Rollback Readiness

- Last known-good rollback target: the most recent validated `portal-build` artifact that was successfully delivered to staging before the failing change
- Preferred restore path: re-run `portal-staging-deploy` against that known-good artifact context instead of rebuilding an unverified replacement under incident pressure
- Primary rollback evidence path: the GitHub Actions run URL, the step summary for the rollback run, and the `portal-staging-monitoring-record` artifact retained from deploy verification
- Operator action boundary: staging rollback is an operator-driven restore and verification flow; it is not automatic rollback and it does not authorize production-specific DNS or state interventions

### Verification Checklist

- Confirm which artifact is the last known-good target before starting the restore action
- Confirm the staging bucket sync points to the expected artifact contents for that target
- If CloudFront invalidation is used, record whether it was triggered for the rollback run
- Verify `/`, `/overview`, and `/guidance` return expected content markers after rollback completion
- Review the rollback run step summary and `portal-staging-monitoring-record` artifact as the minimum recovery evidence set
- Escalate separately if the incident requires production DNS rollback, production state correction, or credential rotation beyond staging restore scope

## Current Delivery Controls

- S3 public access is blocked and CloudFront reads through Origin Access Control
- CloudFront redirects viewers to HTTPS
- the shared module attaches a baseline response headers policy for content type, frame, referrer, and HSTS controls

## Example Computed Bucket Pattern

- `multicloudproject-portal-staging-web`
- use `site_bucket_name` only when that computed pattern is not acceptable or not globally unique

## Backend State

- backend type: S3
- backend bucket: `multicloudproject-tfstate-apne1`
- backend key: `portal/staging/terraform.tfstate`
- backend region: `ap-northeast-1`
- native S3 state locking is enabled with `use_lockfile = true`
- current backend design does not add a separate DynamoDB lock table; the selected locking baseline is S3-native locking in the same backend bucket
- bucket versioning should remain enabled on the backend bucket so state recovery and lockfile churn stay reviewable
