# production environment seed

This directory is reserved for the production entrypoint of the portal delivery infrastructure.

## Expected Contents Later

- environment-level OpenTofu configuration
- production-specific provider and backend settings
- module wiring for the approved portal delivery path
- production variables and outputs

## Current Guardrail

- Production rollout baseline can exist before operator-managed cutover execution is fully written down, but external DNS cutover, certificate issuance execution, and emergency rollback detail must stay outside workflow-complete automation
- Do not execute production apply, production deploy, or cutover scripts unless the recorded production gate inputs are present and the production environment approval boundary is satisfied

## Current Backend Baseline

- backend bucket: multicloudproject-tfstate-apne1
- backend key: portal/production/terraform.tfstate
- backend region: ap-northeast-1
- native S3 state locking is enabled with use_lockfile = true
- production backend configuration and delivery resource wiring are present as the current rollout baseline

## GitHub Environment Variables

- Required secret:
  - `AWS_ROLE_TO_ASSUME_PRODUCTION`
- Required variable:
  - `PRODUCTION_SITE_BUCKET_NAME`
- Recommended variable:
  - `PRODUCTION_AWS_REGION`
- Optional variables:
  - `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID`
  - `PRODUCTION_BASE_URL`
  - `PRODUCTION_SMOKE_PATHS`
- Required dispatch inputs for `portal-production-deploy`:
  - `source_build_run_id`
  - `source_build_commit_sha`
  - `staging_deploy_run_id`
  - `rollback_target_reference`
- Optional dispatch input for `portal-production-deploy`:
  - `verification_owner`

## Production Readiness Gate Snapshot

- Custom domain ownership and DNS operating model: use an approved production custom-domain path owned outside AWS, keep DNS managed outside AWS, and coordinate DNS record changes as operator-managed steps
- Certificate sourcing baseline: use an AWS-managed ACM public certificate in us-east-1 for the approved custom-domain path, keep DNS validation records in the external DNS operating model, and pass only the reviewed certificate ARN into production configuration
- Production approver model: the repository owner can approve production promotion alone in the current phase
- Promotion candidate rule: promote only a staging-validated `main` commit with reviewable build and deploy evidence
- Rollback target baseline: use the last known-good artifact previously validated through the staging delivery path, rather than rebuilding a new recovery candidate during the incident
- Artifact evidence baseline: rely on the GitHub Actions run URL, step summary, `portal-build-evidence`, and `portal-staging-monitoring-record` as the minimum promotion and rollback traceability set
- Monthly cost ceiling: USD 15/month before tax for the first public release while the footprint remains a small static site centered on S3 + CloudFront
- State locking strategy: use native S3 locking via `use_lockfile = true`; production backend configuration now preserves that strategy through the dedicated production state key
- Portability boundary: keep provider-specific delivery choices inside infrastructure and workflow internals, while product structure, routes, frontend configuration contracts, frontend architecture, and monitoring wording remain cloud-neutral
- Rollout implementation baseline: use dedicated production module wiring plus the approval-gated `portal-production-deploy` workflow to promote the staging-validated artifact, while keeping external DNS cutover and certificate validation execution as operator-managed steps

## Fail-Closed Rules

- Do not execute a production apply path or `portal-production-deploy` run unless the production footprint still fits the USD 15/month ceiling or the ceiling is explicitly revised
- Do not execute a production apply path or `portal-production-deploy` run unless the production gate inputs are recorded and the production environment approval boundary is satisfied
- Do not treat staging success as implicit approval to create production resources or a production GitHub Actions environment
- Do not promote a production candidate unless the rollback target artifact, its supporting release evidence, and the post-rollback verification owner are all recorded in the same operator review path
- Do not set production aliases or a production `acm_certificate_arn` until the approved custom-domain path, the reviewed us-east-1 ACM certificate ARN, and the external DNS validation record plan are all recorded
- Do not treat production custom-domain verification as complete until `PRODUCTION_BASE_URL` and `PRODUCTION_SMOKE_PATHS` are both recorded for the selected cutover path
- Do not assume external DNS validation, certificate issuance, or emergency override handling are workflow-complete until operator steps are written down and approved

## Expected Operator Steps After Gate Closure

- Select the staging-validated promotion candidate explicitly before any production action starts
- Select and record the last known-good rollback target artifact from the same reviewed evidence path before promotion starts
- Prepare the reviewed us-east-1 ACM certificate ARN, the external DNS validation record plan, and the approved production aliases before any custom-domain apply or cutover starts
- Dispatch `portal-production-deploy` with the selected source build run id, staging verification run id, rollback target reference, and verification owner after approval is granted
- Record the approver, deploy operator, verification owner, notification route, production aliases, and reviewed certificate ARN in the same production review path
- Set `PRODUCTION_BASE_URL` to the approved production custom-domain URL and `PRODUCTION_SMOKE_PATHS` to the release smoke list before custom-domain verification starts
- Coordinate external DNS validation and custom-domain cutover as explicit operator-managed steps after the production artifact is published
- Verify the production custom-domain reachability, smoke paths, and rollback readiness evidence after cutover, using the same review discipline as staging

## External DNS Cutover Operator Memo

- Current production custom-domain: `www.aws.ashnova.jp`
- Current production CloudFront target: `d168agpgcuvdqq.cloudfront.net`
- Current observed public DNS TTL baseline: 3600 seconds from Google Public DNS during the 2026-03-09 cutover evidence check
- Record the pre-change CNAME target, intended target, TTL, change operator, and timestamp before any external DNS edit so reversal has a concrete reference
- If the reviewed alias cannot be attached to the target CloudFront distribution because it is still bound elsewhere, release the previous external CNAME path first, then retry alias attachment on the reviewed production distribution before publishing the new CNAME target
- After alias attachment and certificate wiring are confirmed on the production distribution, update the external DNS CNAME to the reviewed CloudFront domain and wait for public resolution to show the new target before declaring cutover complete
- Post-cutover minimum evidence is Google Public DNS showing `www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net`, custom-domain HTTPS returning HTTP 200, and `/`, `/overview`, `/guidance` returning the SPA shell markers

## External DNS Reversal Decision Memo

- Do not treat DNS reversal as the first rollback action; try artifact restore on the current production distribution path first unless the issue is clearly caused by external DNS state
- Use DNS reversal only when the current production distribution path cannot recover service through artifact restore or normal propagation wait and the previous DNS target is still known-good
- Before reversing DNS, record the current target, previous target, TTL, reason for reversal, approver, and expected verification owner in the same operator review path
- After reversal, verify public DNS resolution, custom-domain HTTPS, and the route smoke paths again before declaring user-facing recovery complete
- Keep emergency override detail, provider account internals, and any DNS automation outside this memo; this section only fixes the minimum operator sequence and evidence path

## Current Production Rollback Snapshot

- Current last known-good artifact: build run `22839426762` for commit `f9b395393a1bacd221541c5437e60fe23a2da0c2`
- Matching staging verification: run `22839434387`
- Matching production deploy: run `22839461795`
- Current custom-domain URL: `https://www.aws.ashnova.jp`
- Current production bucket and distribution: `multicloudproject-portal-production-web` and `E34CI3F0M5904O`
- Current rollback evidence path: build run URL, staging run URL, production deploy run URL, `portal-production-deployment-record` artifact, and repository owner browser verification note

## Production Rollback Operator Sequence

- Confirm the incident really requires artifact restore rather than DNS propagation wait, CloudFront propagation wait, or a smaller infrastructure correction
- Select the last known-good build run id and matching staging verification run id from the current rollback snapshot or the latest verified production record
- Re-dispatch `portal-production-deploy` with the selected known-good build run id, matching staging verification run id, and a rollback target reference that points to the same reviewed evidence path
- Wait for production bucket sync and CloudFront invalidation to finish on the workflow path before checking the custom domain
- Record the rollback operator, verification owner, run URL, and recovery reason in the same operator review path used for forward promotion

## Production Post-Rollback Verification Checklist

- Confirm `https://www.aws.ashnova.jp` returns HTTP 200
- Confirm `/`, `/overview`, and `/guidance` return the SPA shell successfully
- Confirm the current custom-domain certificate is still valid for `www.aws.ashnova.jp`
- Confirm the production deploy run summary and `portal-production-deployment-record` artifact are attached to the rollback evidence path
- Confirm the selected rollback target artifact, staging verification run, and production restore run are all recorded together before closing the incident

## Current Production Monitoring Snapshot

- Current custom-domain monitoring target: `https://www.aws.ashnova.jp`
- Current primary monitoring evidence path: production deploy run `22839461795`, its step summary, and the `portal-production-deployment-record` artifact
- Current supporting promotion evidence path: build run `22839426762`, staging verification run `22839434387`, and the linked `portal-build-evidence` plus `portal-staging-monitoring-record` artifacts
- Current route health baseline: `/`, `/overview`, and `/guidance` must return the SPA shell markers on the custom-domain path
- Current owner baseline: release owner is the repository owner, deploy operator is the triggering actor, and verification owner is the dispatch input or repository owner default recorded on the deploy run

## Production Monitoring First-Response Sequence

- Confirm whether the signal is a failed production deploy run, a custom-domain reachability failure, or a route-level smoke failure recorded on the production deployment record
- Open the latest reviewed `portal-production-deploy` run first and inspect the step summary plus `portal-production-deployment-record` before using secondary diagnostics
- Compare the production record with the linked build and staging evidence to decide whether the issue started during promotion or after the artifact was already known-good
- Use CloudFront distribution state and external DNS resolution only to distinguish propagation or edge-state delay from artifact-path failure on the custom domain
- Escalate to rollback readiness only after the first-response evidence shows the current production artifact path is not recovering through normal propagation windows

## Production Monitoring Verification Checklist

- Confirm the latest reviewed `portal-production-deploy` run URL is recorded in the operator path for the incident or follow-up
- Confirm `portal-production-deployment-record` exists and includes reachability results for `/`, `/overview`, and `/guidance`
- Confirm `https://www.aws.ashnova.jp` returns HTTP 200 and the SPA shell for the current incident check
- Confirm the verification owner and notification route on the production deploy record are still the intended first-response path
- Confirm any use of CloudFront state or external DNS diagnostics is recorded as supporting evidence rather than the sole declaration of service health

## Monitoring Scope Boundary

- This repository does not yet treat external alert products, 24x7 on-call staffing, dashboard depth, or numeric SLO/SLI thresholds as part of the first production monitoring baseline
- The current production monitoring baseline is limited to operator-facing deploy evidence, custom-domain reachability, smoke-path verification, and supporting distribution or DNS diagnostics
