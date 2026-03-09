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
  - emits `portal-web-dist` and `portal-build-evidence` artifacts with a 14-day retention baseline
- Staging deploy workflow:
  - secret `AWS_ROLE_TO_ASSUME_STAGING`
  - variable `STAGING_AWS_REGION`
  - variable `STAGING_SITE_BUCKET_NAME`
  - optional variable `STAGING_CLOUDFRONT_DISTRIBUTION_ID`
  - optional variable `STAGING_BASE_URL`
  - optional variable `STAGING_SMOKE_PATHS`
- Production deploy workflow:
  - secret `AWS_ROLE_TO_ASSUME_PRODUCTION`
  - variable `PRODUCTION_AWS_REGION`
  - variable `PRODUCTION_SITE_BUCKET_NAME`
  - optional variable `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID`
  - optional variable `PRODUCTION_BASE_URL`
  - optional variable `PRODUCTION_SMOKE_PATHS`
  - required dispatch input `source_build_run_id`
  - required dispatch input `source_build_commit_sha`
  - required dispatch input `staging_deploy_run_id`
  - required dispatch input `rollback_target_reference`
  - optional dispatch input `verification_owner`

## Production Cutover Handoff

- Keep certificate issuance execution, external DNS validation, and custom-domain cutover outside workflow automation even after the production deploy baseline exists
- Before custom-domain cutover, record the reviewed certificate ARN, production aliases, external DNS validation record plan, approver, deploy operator, verification owner, and rollback target in the same operator review path
- Set `PRODUCTION_BASE_URL` to the approved production custom-domain URL and `PRODUCTION_SMOKE_PATHS` to the release smoke list before treating custom-domain verification as complete
- Use `portal-production-deploy` to publish the selected artifact first, then run operator-managed DNS cutover and verify the custom-domain path with the same evidence discipline used for staging
- DNS provider account details, emergency override handling, and automatic rollback remain out of scope for the current workflow contract

## Post-Deploy Check Direction

- If `STAGING_BASE_URL` is set, the staging deploy workflow performs smoke checks after sync
- Default smoke paths are `/`, `/overview`, and `/guidance`
- CloudFront invalidation is optional and only runs when a distribution id is provided
- The workflow writes a `portal-staging-monitoring-record` artifact and copies the same evidence into the step summary for operator review
- Release owner defaults to the repository owner and deploy operator defaults to the triggering actor for the run
- The GitHub Actions run URL and the monitoring record artifact are the default first-response route for staging triage

## Build Artifact Retention And Release Evidence

- `portal-build` retains the deployable `portal-web-dist` artifact and the `portal-build-evidence` artifact for 14 days as the baseline review window for staging-first operations
- `portal-build-evidence` records the build run id, commit SHA, validation commands, artifact names, retention window, and run URL so the build provenance can be reviewed without opening raw logs first
- `portal-staging-deploy` copies source build provenance into the staging monitoring record so artifact handoff and post-deploy verification remain in the same operator review path
- This baseline strengthens rollback and promotion evidence, but it does not introduce a production promotion workflow or external artifact registry

## Staging Rollback Readiness

- The staging-first rollback target is the last known-good portal artifact previously produced by `portal-build` and delivered through `portal-staging-deploy`
- Operator-facing rollback evidence should stay attached to the GitHub Actions run URL, the step summary, and the `portal-staging-monitoring-record` artifact created by the current deploy flow
- The staging rollback verification checklist lives in [infra/environments/staging/README.md](../../infra/environments/staging/README.md) and should be reviewed in the same operator handoff as the deploy evidence
- This repository does not treat production DNS cutover, production rollback automation, or state-locking resolution as part of the staging rollback readiness baseline

## Production Rollback Readiness

- The current production rollback target is the artifact promoted by successful build run `22839426762`, staging verification run `22839434387`, and production deploy run `22839461795`
- Production rollback should reuse the same `portal-production-deploy` workflow with the selected known-good build and staging evidence rather than rebuilding a fresh artifact during the incident
- Operator-facing production rollback evidence should stay attached to the production deploy run URL, the step summary, the `portal-production-deployment-record` artifact, and the matching staging and build evidence runs
- Post-rollback verification must confirm `https://www.aws.ashnova.jp` reachability plus smoke paths `/`, `/overview`, and `/guidance` before service restoration is declared complete
- External DNS reversal detail, automation depth, and incident-commander process remain outside the current workflow contract

## Production Monitoring Follow-Up

- The current production first-response route is the `portal-production-deploy` run URL together with the step summary and the `portal-production-deployment-record` artifact emitted by the same run
- `portal-production-deploy` already records release owner, deploy operator, verification owner, source build run, staging verification run, rollback target reference, and route-by-route reachability results for `/`, `/overview`, and `/guidance`
- Production monitoring review should start with `https://www.aws.ashnova.jp` reachability and the recorded smoke-path results before falling back to CloudFront state or external DNS diagnostics
- CloudFront distribution status and external DNS resolution are supporting diagnostics used to split propagation delay from artifact-path failure; they are not a substitute for the reviewed custom-domain check
- External alert tooling, broader notification integrations, and 24x7 on-call process remain outside the current workflow contract until response ownership is recorded more tightly

## Production Alert Routing Baseline

- Treat failed `portal-production-deploy`, custom-domain reachability failure, route-level smoke failure on `/`, `/overview`, or `/guidance`, and certificate continuity faults as the minimum production alert trigger set for the current phase
- The notification owner baseline remains the same reviewed operator path already emitted by `portal-production-deploy`: release owner is the repository owner, deploy operator is the triggering actor, and verification owner is the dispatch input or repository owner default recorded on the run
- The first-response notification path is the reviewed production deploy run URL plus the step summary and `portal-production-deployment-record` artifact; this is the operator-managed route to open first before any external notification product is assumed
- CloudFront state, external DNS resolution, and ACM certificate state are supporting diagnostics that belong in the same review path, but they do not replace the recorded deploy evidence as the default notification route
- Provider-specific alert delivery, automatic escalation, and 24x7 paging remain outside the current workflow contract until the small-team response owner and channel are tightened further

## Production Alert Delivery Baseline

- If the team enables an external delivery destination for a production alert, it must be an explicitly recorded owner-bound destination that points back to the reviewed `portal-production-deploy` run URL, step summary, and `portal-production-deployment-record` artifact
- The external destination is optional and secondary: delivery success there does not replace the workflow run as the canonical incident path, and delivery failure there must not block first response on the reviewed deploy evidence route
- Repository owner remains the approver for any external destination, deploy operator remains the sender or incident-start owner for the active path, and verification owner remains the named closer recorded on the same production deploy evidence
- If an external channel is stale, unavailable, or no longer clearly owned, operators must treat it as disabled and continue from the workflow evidence path without assuming chat fan-out, paging coverage, or provider-native acknowledgement tracking exists
- Automatic fan-out, 24x7 paging rotation, and remediation hooks remain outside the current workflow contract even if a pointer-style external delivery destination is later documented

## External DNS Operations Memo

- External DNS cutover remains operator-managed and must stay outside workflow-complete automation even after `portal-production-deploy` succeeds
- Before applying or re-applying production aliases on CloudFront, record the current external DNS CNAME target, TTL, reviewed certificate ARN, and the intended production CloudFront domain in the same operator review path
- If CloudFront alias attachment is blocked by an existing external DNS binding, release the old CNAME path first, wait for the alias to be attachable on the target distribution, and only then re-apply the reviewed alias plus certificate on the production distribution
- Treat Google Public DNS resolution and custom-domain HTTPS verification as the minimum post-change evidence for external DNS operations; do not declare cutover complete from control-plane changes alone
- DNS reversal remains a separate operator decision from artifact rollback and should only be used when the current production distribution path cannot recover service through artifact restore or normal propagation wait

## External DNS Automation Judgment

- Workflow support for DNS in the current phase is limited to operator-assist output: reviewed targets, evidence capture, handoff notes, and verification guidance may be emitted, but authoritative DNS writes must not be executed from the workflow contract
- Route 53 is not a current workflow target for the production domain; the workflow should assume the source of truth remains external and that any migration would require a separate ownership and rollback redesign
- If a future helper script or workflow step prepares DNS change material, it must point operators back to the same reviewed production evidence path and must not be treated as approval to execute live record changes automatically
- Automatic DNS cutover, automatic reversal, and provider-credential-driven change batches remain outside the current workflow contract even if they would appear to reduce manual steps

## Production Certificate Renewal Memo

- Production certificate renewal remains ACM-managed, but the operator must still record the reviewed certificate ARN, current `NotAfter`, `RenewalEligibility`, and DNS validation CNAME on the same review path as the custom-domain record
- The current production certificate baseline is ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487`, domain `www.aws.ashnova.jp`, `ISSUED`, `ELIGIBLE`, attached to distribution `E34CI3F0M5904O`, with `NotAfter=2026-09-06T23:59:59+00:00`
- Treat the ACM DNS validation CNAME as retained production state rather than one-time setup; do not remove or overwrite `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp -> _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws` unless a reviewed replacement certificate path is ready
- If custom-domain HTTPS fails while CloudFront deployment and artifact evidence still look healthy, check ACM certificate state and whether the validation CNAME still matches the reviewed `acm-validations.aws` target before treating the event as an artifact rollback or DNS reversal incident
- Renewal automation, notification routing, and certificate reissuance playbooks remain outside the current workflow contract; this memo only fixes the minimum evidence path and incident split

## Production Readiness Gate

- Production automation remains blocked until the production design gate is recorded tightly enough to fail closed instead of relying on operator memory
- The minimum preconditions for any future production promotion are: a named approver, a staging-validated promotion candidate, an explicit rollback target, artifact retention evidence, a post-deploy verification owner, external DNS and certificate coordination steps, an accepted monthly cost ceiling, and a recorded state locking strategy
- The current documented snapshot supports a single-approver model, an approved externally owned custom-domain path, an explicit last known-good artifact rollback target, and external DNS coordination, while artifact retention and rollback evidence now exist in the staging-first workflow path, the monthly cost ceiling is fixed at USD 15/month before tax, and native S3 state locking is enabled in both the staging and production backend configurations
- The certificate sourcing baseline is an AWS-managed ACM public certificate in us-east-1, but DNS validation records and cutover timing still remain explicit operator-managed steps outside workflow automation
- The rollback target baseline reuses the staging-first evidence path: operators should identify the last known-good artifact through the run URL, step summary, `portal-build-evidence`, and `portal-staging-monitoring-record`, then apply the same verification discipline after recovery
- The accepted portability boundary keeps provider-specific commands and secrets inside workflow internals, while smoke paths, release evidence, and release-check wording stay app-level and cloud-neutral
- The selected state locking strategy is now wired into a production backend configuration, and this repository now includes an approval-gated `portal-production-deploy` baseline that promotes a staging-validated artifact together with its build, staging, and rollback evidence references
- External DNS cutover and certificate validation remain operator-managed steps that follow approval; the repository now records their execution order and environment-variable handoff, but they are not treated as workflow-complete automation in the current phase
