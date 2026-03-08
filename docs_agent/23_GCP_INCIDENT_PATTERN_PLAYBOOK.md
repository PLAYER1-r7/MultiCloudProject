# GCP Incident Pattern Playbook

## Use This When

- Use this after triage identifies GCP as the likely failure domain.
- Use it when deploy artifacts, Cloud Run revisions, or Firebase integration look suspicious.

## First Action Order

1. Match the symptom to the closest pattern.
2. Check service or function inventory.
3. Inspect revision or deployment evidence.
4. Apply the smallest GCP-specific mitigation and re-check health.

## Common Patterns

- Deploy fails with `missing main.py`: include `main.py` in the deployment artifact.
- Signed URL private-key error: pass service account email and access token.
- Firebase popup instability: verify COOP header and authorized domains.
- Cloud Run 5xx: inspect revision logs and environment diff.

## Core Commands

```bash
gcloud run services list --region asia-northeast1 --project ashnova
gcloud functions list --regions asia-northeast1 --project ashnova
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 23_GCP_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #451 GCP production exam-solver auth callback failures after domain update
Outcome: GCP pattern matched
Actions taken: checked exam-solver ingress, auth redirect, and service configuration alignment after deploy-exam-solver-gcp.yml
Evidence: exam-solver callback route fails only on GCP; recent deploy-exam-solver-gcp.yml domain change confirmed for Issue #451
Risks or blockers: exam-solver login remains degraded until redirect mismatch is corrected
Next action: verify exam-solver redirect configuration and affected service revision with exam-solver-reviewer before exam-solver-approval-owner approves the fix
```
