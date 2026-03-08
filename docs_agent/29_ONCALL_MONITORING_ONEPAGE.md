# On-Call Monitoring One-Page

## Use This When

- Use this for the first 5 minutes of on-call response.
- Treat it as a timer-based prompt, not as a full incident handbook.

## Escalate Immediately If

- Production-wide impact is visible.
- Auth, data integrity, or security boundaries are at risk.
- The affected owner or cloud cannot be identified quickly.

## 0-5 Minute Flow

- Identify app, environment, and cloud.
- Run `test-endpoints` and `test-e2e`.
- Confirm severity and ownership.

## Fast Commands

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

Escalate immediately for production-wide impact.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 29_ONCALL_MONITORING_ONEPAGE
Scope: Issue #487 first-response check for after-hours sns staging alert burst
Outcome: On-call snapshot prepared
Actions taken: confirmed who is on point, identified sns-api and frontend_react as the affected services, and captured the top dashboards to watch after deploy-sns-aws.yml
Evidence: sns alert channel, dashboard links, and current health summary are available for Issue #487
Risks or blockers: missing sns ownership could slow escalation if severity rises
Next action: keep the sns snapshot updated until the incident is handed off to sns-reviewer or resolved with sns-approval-owner awareness
```
