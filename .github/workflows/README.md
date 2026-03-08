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

## Production Readiness Gate

- Production automation remains blocked until the production design gate is recorded tightly enough to fail closed instead of relying on operator memory
- The minimum preconditions for any future production promotion are: a named approver, a staging-validated promotion candidate, an explicit rollback target, artifact retention evidence, a post-deploy verification owner, external DNS and certificate coordination steps, an accepted monthly cost ceiling, and a recorded state locking strategy
- The current documented snapshot supports a single-approver model and external DNS coordination, while artifact retention and rollback evidence now exist in the staging-first workflow path, the monthly cost ceiling is fixed at USD 15/month before tax, and native S3 state locking is enabled in staging
- The selected state locking strategy is not yet wired into a production backend, so this repository must stop at staging and must not add a production deploy workflow or production apply path yet
- External DNS cutover and certificate validation remain operator-managed steps that follow approval; they are not treated as workflow-complete automation in the current phase
