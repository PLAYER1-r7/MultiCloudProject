# production environment seed

This directory is reserved for the production entrypoint of the portal delivery infrastructure.

## Expected Contents Later

- environment-level OpenTofu configuration
- production-specific provider and backend settings
- module wiring for the approved portal delivery path
- production variables and outputs

## Current Guardrail

- Production backend configuration can exist before full production rollout, but production delivery resources and deploy automation must stay blocked until the remaining production gate is closed
- Do not add production module wiring, deploy workflow definitions, or cutover scripts before the remaining production entry conditions are recorded explicitly

## Current Backend Baseline

- backend bucket: multicloudproject-tfstate-apne1
- backend key: portal/production/terraform.tfstate
- backend region: ap-northeast-1
- native S3 state locking is enabled with use_lockfile = true
- production backend configuration is present, but production delivery resources are still intentionally absent

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

## Fail-Closed Rules

- Do not add production module wiring, deploy workflow definitions, or cutover scripts unless the production footprint still fits the USD 15/month ceiling or the ceiling is explicitly revised
- Do not allow any production apply path until the remaining production entry conditions are recorded and approved, even though the backend configuration now exists
- Do not treat staging success as implicit approval to create production resources or a production GitHub Actions environment
- Do not promote a production candidate unless the rollback target artifact, its supporting release evidence, and the post-rollback verification owner are all recorded in the same operator review path
- Do not set production aliases or a production `acm_certificate_arn` until the approved custom-domain path, the reviewed us-east-1 ACM certificate ARN, and the external DNS validation record plan are all recorded
- Do not assume external DNS validation, certificate issuance, or emergency override handling are workflow-complete until operator steps are written down and approved

## Expected Operator Steps After Gate Closure

- Select the staging-validated promotion candidate explicitly before any production action starts
- Select and record the last known-good rollback target artifact from the same reviewed evidence path before promotion starts
- Record the approver, deploy operator, verification owner, and notification route for the production run
- Coordinate external DNS and certificate validation as explicit operator-managed steps
- Verify production reachability and rollback readiness evidence after promotion, using the same review discipline as staging
