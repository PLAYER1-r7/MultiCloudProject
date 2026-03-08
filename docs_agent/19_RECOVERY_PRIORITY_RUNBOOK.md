# Recovery Priority Runbook

## Use This When

- Use this after triage when more than one broken thing competes for attention.
- Use it to justify why one recovery step is happening before another.

## Recovery Ordering Rule

1. Restore safety and trust boundaries first.
2. Restore the main production flow next.
3. Repair secondary degradation only after user-critical paths are stable.

## Priority Order

1. Security and auth integrity
2. Production user flow recovery
3. Data integrity
4. Availability
5. Performance tuning

## Severity Guide

- P0: major production outage or security risk
- P1: major degradation with workaround
- P2: staging or non-critical issue
- P3: cosmetic or non-blocking issue

## Recovery Validation

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 19_RECOVERY_PRIORITY_RUNBOOK
Scope: Issue #487 prioritize recovery for sns login failure in staging
Outcome: Recovery order selected
Actions taken: ranked sns user sign-in restoration above dashboard polish and secondary admin flows after the last deploy-sns-aws.yml run
Evidence: sns primary sign-in path is blocked while non-critical pages remain reachable in Issue #487
Risks or blockers: restoring sns auth first may delay lower-priority observability cleanup
Next action: recover the sns sign-in path before working secondary issues, then update sns-reviewer and sns-approval-owner with the recovery order
```
