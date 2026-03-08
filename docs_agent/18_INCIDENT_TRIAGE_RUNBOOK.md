# Incident Triage Runbook

## Use This When

- Use this for the first pass on an outage, degradation, alert spike, or suspicious deploy result.
- Use it before selecting a cloud-specific incident playbook.

## Required Output

- Produce one filled triage summary before changing mitigation direction.
- Update the summary again if severity or suspected layer changes.

## First 15 Minutes

1. Lock scope: app, environment, cloud.
2. Run quick health checks.
3. Classify severity (P0/P1/P2/P3).
4. Capture evidence (logs, failing endpoints, last deploy).
5. Decide escalation or immediate mitigation.

Use this severity guide during the first classification:

- P0: major production outage or active security breach. Escalate immediately; do not wait for full triage.
- P1: major degradation with a known workaround.
- P2: staging or non-critical path failure.
- P3: cosmetic or non-blocking issue.

## Quick Commands

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 18_INCIDENT_TRIAGE_RUNBOOK
Scope: Issue #451 P2 staging outage for exam-solver-api after config update
Outcome: Initial triage complete
Actions taken: confirmed the exam-solver app and staging environment, ran health checks, and reviewed the latest deploy-exam-solver-aws.yml config change
Evidence: exam-solver health endpoint failing; last deploy-exam-solver-aws.yml timestamp matches alert start for Issue #451
Risks or blockers: root cause remains unclear between callback config and API startup
Next action: escalate to the cloud-specific playbook based on exam-solver API failure signs and notify exam-solver-reviewer; page exam-solver-approval-owner if a deploy freeze is needed
```
