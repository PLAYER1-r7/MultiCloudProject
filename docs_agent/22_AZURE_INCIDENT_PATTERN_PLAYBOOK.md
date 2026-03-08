# Azure Incident Pattern Playbook

## Use This When

- Use this after triage identifies Azure as the likely failure domain.
- Use it when Azure-specific routing, identity, or CORS behavior may be the true cause.

## First Action Order

1. Match the symptom to the closest pattern.
2. Check resource status and CORS or routing configuration.
3. Confirm whether the problem is platform behavior or config drift.
4. Apply the least risky Azure-specific fix first.

## Common Patterns

- CORS failure: configure Function App CORS and Blob CORS separately.
- API 404: verify `host.json` route prefix is empty.
- Front Door 502: validate origin health and routing rules.
- Login redirect issues: check Azure AD redirect URI configuration.

## Core Commands

```bash
az functionapp show --name multicloud-auto-deploy-staging-func --resource-group multicloud-auto-deploy-staging-rg
az functionapp cors show --name multicloud-auto-deploy-staging-func --resource-group multicloud-auto-deploy-staging-rg
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 22_AZURE_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #487 Azure staging sns-api Function App returning 500 after settings change
Outcome: Azure pattern matched
Actions taken: compared recent sns-api app settings, identity access, and storage connectivity assumptions after deploy-sns-azure.yml
Evidence: sns-api failure begins after config update; deploy-sns-azure.yml succeeded but runtime health failed for Issue #487
Risks or blockers: partial mitigation may hide the real sns-api settings drift
Next action: inspect sns-api app settings and managed identity permissions, share findings with sns-reviewer, and wait for sns-approval-owner before redeploy
```
