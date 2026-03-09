# Docs Agent Start Here

## Purpose

`docs_agent/` is the agent-first operating manual for this repository.
An autonomous coding agent should be able to read this folder, understand the rules, execute work safely, validate results, and hand off cleanly.

Use this folder for agent workflow, execution control, handoff, and operational decision support.
Use `docs/` for product implementation details.
Use `.github/` for GitHub workflow and repository operations.

## Reading Order

1. `02_AUTONOMOUS_DEV_PROTOCOL.md`
2. `03_TASK_CONTRACT_TEMPLATE.md`
3. `04_DEFINITION_OF_DONE.md`
4. `08_ESCALATION_AND_HANDOFF.md`
5. `09_DOCSET_SYNC_RULES.md`
6. `14_CRITICAL_GUARDRAILS_EXTRACT.md`
7. `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`
8. `16_TEST_AND_DEPLOY_QUICK_REF.md`

## Reference Map

Use these documents as needed after the core reading set:

- Tooling, auth checks, and service baseline: `06_TOOLING_AND_SERVICES.md`, `17_AUTH_REQUEST_PLAYBOOK.md`
- Self-check before and after coding: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- Canonical execution record and handoff format: `08_ESCALATION_AND_HANDOFF.md`
- Reviewer and approval owner role boundaries: `ROLE_HANDOFF_OWNERSHIP.md`
- App-specific operational decisions such as runtime timeout changes: `20_MANUAL_DEPLOY_DECISION_CRITERIA.md`
- GitHub operations: `25_GITHUB_GOVERNANCE_QUICK_REF.md` to `27_GITHUB_OPERATIONS_COMMANDS.md`
- Incident and monitoring response: `18_INCIDENT_TRIAGE_RUNBOOK.md` to `29_ONCALL_MONITORING_ONEPAGE.md`
- Release and test decisions: `31_PRODUCTION_READINESS_GATE.md`, `32_TEST_EXECUTION_GATE.md`
- Review templates: `10_WEEKLY_REVIEW_TEMPLATE.md` to `13_ANNUAL_REVIEW_TEMPLATE.md`

## Fast Routing Table

| If the task is mainly about       | Read first                                                                                                         | Then use                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Starting autonomous work safely   | `02_AUTONOMOUS_DEV_PROTOCOL.md`                                                                                    | `03_TASK_CONTRACT_TEMPLATE.md`, `04_DEFINITION_OF_DONE.md`                   |
| Escalation or handoff             | `08_ESCALATION_AND_HANDOFF.md`                                                                                     | `05_PR_TASK_CONTRACT_TEMPLATE.md`                                            |
| App boundaries or workflow scope  | `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`                                                                          | `26_GITHUB_ENVIRONMENT_GATES_EXTRACT.md`                                     |
| Auth, secrets, or operator access | `17_AUTH_REQUEST_PLAYBOOK.md`                                                                                      | `14_CRITICAL_GUARDRAILS_EXTRACT.md`                                          |
| Incident response                 | `29_ONCALL_MONITORING_ONEPAGE.md`, `18_INCIDENT_TRIAGE_RUNBOOK.md`, or `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` | `21_AWS_INCIDENT_PATTERN_PLAYBOOK.md` to `24_CROSS_CLOUD_INCIDENT_MATRIX.md` |
| Production release judgment       | `31_PRODUCTION_READINESS_GATE.md`                                                                                  | `32_TEST_EXECUTION_GATE.md`, `08_ESCALATION_AND_HANDOFF.md`                  |

Use this incident entry rule when choosing the first document:

- Alert active for less than 5 minutes with no identified symptom: start with `29_ONCALL_MONITORING_ONEPAGE.md`.
- Active incident with an identified symptom: start with `18_INCIDENT_TRIAGE_RUNBOOK.md`.
- Alert storm with no single clear cause: start with `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`.

## Operating Rules

- Always define a task contract before editing.
- Never continue risky work without approval.
- Use the canonical execution record in `08_ESCALATION_AND_HANDOFF.md` for docs 14-32 and PR handoff packaging.
- Treat tests, rollback, and handoff as part of delivery.
- Keep `docs_agent/` and `docs_agent_ja/` synchronized.

## Current Repository Checkpoint

- Completed through Issue 46 as of 2026-03-09.
- Issues 45 and 46 are closed and synchronized to local issue records plus GitHub Issues.
- Current production governance baseline is fixed around external DNS source of truth, Route 53 non-adoption in the current phase, and operator-assist-only DNS automation.
- The next candidate scope is GCP baseline design, but it should start in a separate chat with a new task contract.
- Before starting the next follow-up, read `08_ESCALATION_AND_HANDOFF.md` for the current project handoff record and then inspect the latest issue records under `docs/portal/issues/`.
