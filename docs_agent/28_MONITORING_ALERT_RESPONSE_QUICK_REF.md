# Monitoring Alert Response Quick Reference

## Use This When

- Use this when an alert arrives before a human-readable incident summary exists.
- Use it for the first monitoring-driven response, then hand off to docs 18, 21, 22, 23, or 29 as needed.

## Required Outcome

- End with a scoped incident statement, current severity, and next mitigation owner.

## Initial Response

1. Lock scope: app, environment, cloud.
2. Run health checks.
3. Classify severity and start mitigation.

If the failing cloud is not yet certain, use `24_CROSS_CLOUD_INCIDENT_MATRIX.md` to narrow down the domain before switching to a provider-specific playbook.

## Cloud Checks

- AWS: CloudWatch alarms + Lambda logs
- Azure: Monitor metrics + Function status
- GCP: Monitoring policies + Run or Functions status

## Done Criteria

- Core endpoint health restored
- Alert storm stopped
- Follow-up prevention task recorded

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 28_MONITORING_ALERT_RESPONSE_QUICK_REF
Scope: Issue #451 latency alert on exam-solver-api staging
Outcome: Alert response started
Actions taken: checked the exam-solver alert source, compared latency trend, and confirmed the affected endpoint set after deploy-exam-solver-aws.yml
Evidence: sustained exam-solver latency increase started after the Issue #451 config deployment
Risks or blockers: noisy alerts may hide the primary exam-solver degradation signal
Next action: correlate the exam-solver latency spike with deploy and runtime logs, then send the summary to exam-solver-reviewer and exam-solver-approval-owner
```
