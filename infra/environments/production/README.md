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

## External DNS Automation Judgment Snapshot

- Current authoritative DNS source of truth: external DNS remains authoritative for `www.aws.ashnova.jp`; Route 53 is not adopted for the current production path
- Current allowed automation boundary: helper automation may collect the reviewed CloudFront target, certificate references, TTL records, and public-resolution evidence, but it may not execute authoritative DNS writes on the live production name
- Current disallowed automation boundary: Route 53 hosted-zone adoption, workflow-complete DNS record writes, and automatic cutover or reversal against the live domain remain outside the current production baseline
- Current migration judgment: reconsider Route 53 only if ownership transfer, credential model, rollback sequence, and operator review path are redesigned together under a separate decision record

## External DNS Automation Operator Direction

- Use automation only to reduce transcription and evidence drift; do not let helper scripts or generated change plans become the approval boundary for live DNS changes
- Keep the final DNS write under explicit human review with the same pre-change record, approver, and post-change verification path already required by the cutover memo
- If any helper output conflicts with the reviewed production evidence path, treat the helper as stale and fall back to the manually reviewed values already recorded in the operator path
- Do not treat Route 53 migration as an emergency shortcut during incidents; incident handling should continue on the current external DNS path unless a separate approved migration plan already exists

## Production Certificate Renewal Snapshot

- Current production certificate ARN: `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487`
- Current certificate domain and type: `www.aws.ashnova.jp`, `AMAZON_ISSUED`
- Current certificate status: `ISSUED`
- Current certificate renewal eligibility: `ELIGIBLE`
- Current certificate `NotAfter`: `2026-09-06T23:59:59+00:00`
- Current certificate in-use path: CloudFront distribution `E34CI3F0M5904O`
- Current validation CNAME: `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp` -> `_490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws`

## Production Certificate Renewal Operator Memo

- Record the certificate ARN, `NotAfter`, `RenewalEligibility`, validation CNAME, check timestamp, and operator name before any certificate-related escalation so the team is not reconstructing renewal state mid-incident
- Treat the validation CNAME as retained production configuration; do not remove or repoint it unless a reviewed replacement certificate path and rollback plan are recorded together
- Re-check ACM describe-certificate state when custom-domain HTTPS fails unexpectedly, before any DNS reversal, and whenever the team is reviewing the current production baseline close to the recorded `NotAfter`
- If ACM no longer reports `ISSUED`, `ELIGIBLE`, or `ValidationStatus=SUCCESS`, treat that as a certificate incident first and confirm certificate state plus that the validation CNAME still matches the reviewed `acm-validations.aws` target before changing artifact or DNS state
- Keep notification tooling, renewal automation, and provider account execution detail outside this memo; this section only fixes the minimum operator sequence and evidence path for certificate continuity

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

## Production Alert Routing Snapshot

- Current alert trigger set: failed `portal-production-deploy`, custom-domain reachability failure on `https://www.aws.ashnova.jp`, smoke-path failure on `/`, `/overview`, or `/guidance`, and certificate continuity faults where ACM state or validation retention no longer matches the reviewed baseline
- Current notification owner baseline: release owner is the repository owner, deploy operator is the triggering actor on the latest reviewed production deploy run, and verification owner is the recorded dispatch input or repository owner default on that run
- Current first-response notification path: the latest reviewed `portal-production-deploy` run URL, its step summary, and the `portal-production-deployment-record` artifact
- Current supporting diagnostics path: CloudFront distribution state, Google Public DNS resolution, and ACM describe-certificate output recorded in the same operator review path after the primary deploy evidence is checked

## Production Alert Routing Operator Direction

- Open the latest reviewed production deploy run first when an alert trigger fires; do not begin from provider dashboards or raw DNS tools unless the reviewed deploy evidence path is unavailable
- Keep first response inside the recorded owner path: deploy operator starts the check, release owner is the default escalation target, and verification owner confirms restoration when the incident is closing
- If the trigger is certificate continuity related, keep the same owner and notification path while switching the diagnostic sequence to ACM certificate state and validation CNAME retention before artifact rollback or DNS reversal is considered
- Do not treat external chat integrations, paging products, or 24x7 staffing as implicitly available; if they are not explicitly recorded for the current incident path, the run URL and deployment record remain the only approved first-response notification route

## Production Alert Delivery Snapshot

- Current approved delivery baseline: the reviewed `portal-production-deploy` run URL, its step summary, and the `portal-production-deployment-record` artifact remain the canonical delivery path for every production alert trigger
- Current optional external delivery allowance: at most one explicitly recorded owner-bound pointer destination may be used, but only if it directs responders back to the same reviewed production deploy evidence path
- Current delivery owner baseline: repository owner approves any external delivery destination, deploy operator owns the initial send or incident-start path, and verification owner closes the same incident path after restoration evidence is reviewed
- Current delivery failure fallback: if the optional external destination does not deliver, is stale, or cannot be verified as owned, responders fall back immediately to the deploy run URL and deployment record without assuming any broader paging layer exists

## Production Alert Delivery Operator Direction

- Treat any external delivery destination as advisory only; open the latest reviewed `portal-production-deploy` run first even when a chat or provider-native delivery message exists
- Record the exact external destination, owner, timestamp, and reason in the same operator review path if the team uses one, so delivery drift is visible during follow-up and incident review
- If delivery through the optional external destination fails, do not wait for retry loops or alternate tools before starting response; continue on the Issue 44 first-response path and keep escalation inside deploy operator to release owner unless a tighter owner path has been explicitly recorded
- Do not enable mailbox-style destinations, broad chat rooms without named owners, automatic remediation hooks, or 24x7 paging assumptions under this baseline

## Monitoring Scope Boundary

- This repository does not yet treat external alert products, 24x7 on-call staffing, dashboard depth, or numeric SLO/SLI thresholds as part of the first production monitoring baseline
- The current production monitoring baseline is limited to operator-facing deploy evidence, custom-domain reachability, smoke-path verification, and supporting distribution or DNS diagnostics
