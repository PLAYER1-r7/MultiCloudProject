# GCP Preview Recovery Walkthrough Record Template

Use this template to record the minimum operator-reviewed recovery walkthrough required before 2026-03-31.

- Do not treat this walkthrough as authorization for destructive DNS reversal, live destroy, or automatic rollback.
- Keep all evidence references on the same operator review path as the latest reviewed deploy evidence.
- If monitoring scope, security hardening scope, or delivery resource topology changes materially, record an additional walkthrough using a fresh copy of this template.

## Walkthrough Metadata

- Walkthrough date:
- Walkthrough owner:
- Additional participants:
- Trigger class exercised: artifact-path failure / resource-path failure / DNS-operator-path failure / blocked pending state safe-stop
- Reason this path was selected:

## Evidence Path

- Latest reviewed `portal-gcp-preview-deploy` run URL:
- Step summary reference:
- `portal-gcp-preview-deployment-record` artifact reference:
- `resource_execution_reference`:
- Monitoring state reference:
- Reviewed target reference:
- Certificate-related reference:
- Selected known-good build reference:

## Walkthrough Sequence Notes

- Trigger classification result:
- First-response check result:
- Safe-stop judgment:
- Artifact-path recovery decision:
- Resource-path recovery decision:
- DNS/operator-path recovery decision:
- Supporting diagnostics consulted, if any:

## Verification Checklist

- [ ] Confirm the walkthrough started from the latest reviewed deploy run URL rather than provider dashboards or DNS tools
- [ ] Confirm the step summary and `portal-gcp-preview-deployment-record` artifact were reviewed on the same evidence path
- [ ] Confirm `resource_execution_reference`, reviewed target reference, and certificate-related reference were checked together
- [ ] Confirm the chosen recovery path stayed within the non-destructive Issue 59 boundary
- [ ] Confirm `/`, `/overview`, `/guidance`, and `/status` were included in the recovery verification plan
- [ ] Confirm monitoring state was treated as part of the same operator review path
- [ ] Confirm any follow-up action is recorded separately from the walkthrough itself

## Outcome

- Walkthrough verdict: accepted / follow-up required
- Follow-up actions:
- Recommended due date for follow-up:
- Review sign-off note:
