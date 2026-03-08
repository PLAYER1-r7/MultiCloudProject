# production environment seed

This directory is reserved for the production entrypoint of the portal delivery infrastructure.

## Expected Contents Later

- environment-level OpenTofu configuration
- production-specific provider and backend settings
- module wiring for the approved portal delivery path
- production variables and outputs

## Current Guardrail

- Keep this directory as a placeholder until the production design gate is closed
- Do not add partial production wiring before domain ownership, certificate sourcing, approval ownership, rollback target, and state locking are decided

## Production Readiness Gate Snapshot

- Custom domain and DNS operating model: use a production custom domain with DNS managed outside AWS
- Production approver model: the repository owner can approve production promotion alone in the current phase
- Promotion candidate rule: promote only a staging-validated `main` commit with reviewable build and deploy evidence
- Rollback target baseline: use the last known-good artifact previously validated through the staging delivery path
- Artifact evidence baseline: rely on `portal-build-evidence` and `portal-staging-monitoring-record` as the minimum promotion traceability set
- Monthly cost ceiling: USD 15/month before tax for the first public release while the footprint remains a small static site centered on S3 + CloudFront
- State locking strategy: use native S3 locking via `use_lockfile = true`; production backend wiring for that strategy is still deferred until the remaining gate is closed

## Fail-Closed Rules

- Do not add production OpenTofu wiring, backend settings, deploy workflow definitions, or cutover scripts unless the production footprint still fits the USD 15/month ceiling or the ceiling is explicitly revised
- Do not allow any production apply path until the selected native S3 locking strategy is wired into the production backend configuration
- Do not treat staging success as implicit approval to create production resources or a production GitHub Actions environment
- Do not assume external DNS validation, certificate issuance, or emergency override handling are workflow-complete until operator steps are written down and approved

## Expected Operator Steps After Gate Closure

- Select the staging-validated promotion candidate explicitly before any production action starts
- Record the approver, deploy operator, verification owner, and notification route for the production run
- Coordinate external DNS and certificate validation as explicit operator-managed steps
- Verify production reachability and rollback readiness evidence after promotion, using the same review discipline as staging
