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
  Use `27_GITHUB_OPERATIONS_COMMANDS.md` when the task includes Issue label normalization or label selection.
- Incident and monitoring response: `18_INCIDENT_TRIAGE_RUNBOOK.md` to `29_ONCALL_MONITORING_ONEPAGE.md`
- Release and test decisions: `31_PRODUCTION_READINESS_GATE.md`, `32_TEST_EXECUTION_GATE.md`
- Review templates: `10_WEEKLY_REVIEW_TEMPLATE.md` to `13_ANNUAL_REVIEW_TEMPLATE.md`

## Fast Routing Table

| If the task is mainly about       | Read first                                                                                                         | Then use                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Starting autonomous work safely   | `02_AUTONOMOUS_DEV_PROTOCOL.md`                                                                                    | `03_TASK_CONTRACT_TEMPLATE.md`, `04_DEFINITION_OF_DONE.md`                   |
| Escalation or handoff             | `08_ESCALATION_AND_HANDOFF.md`                                                                                     | `05_PR_TASK_CONTRACT_TEMPLATE.md`                                            |
| App boundaries or workflow scope  | `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`                                                                          | `26_GITHUB_ENVIRONMENT_GATES_EXTRACT.md`                                     |
| GitHub Issue operations or labels | `27_GITHUB_OPERATIONS_COMMANDS.md`                                                                                 | `25_GITHUB_GOVERNANCE_QUICK_REF.md`                                          |
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

- Do not treat this file as the authoritative current project state checkpoint.
- The current authoritative checkpoint lives in `08_ESCALATION_AND_HANDOFF.md`, which now tracks the active handoff chain beyond the earlier GitHub Issues 45-46 baseline. The later 80-91 and 92-95 ranges referenced there are GitHub Issue ranges, not a promise that matching local `docs/portal/issues/issue-*.md` files exist for every number.
- The historical GitHub Issues 45-46 close state remains part of the repository history, but newer follow-up chains and handoff records supersede it as the current project checkpoint.
- Current production governance baseline remains fixed around external DNS source of truth, Route 53 non-adoption in the current phase, and operator-assist-only DNS automation unless a newer handoff record says otherwise.
- Before starting the next follow-up, read `08_ESCALATION_AND_HANDOFF.md` for the current project handoff record and then inspect the current canonical repo artifacts that actually exist, such as `docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md` and the latest files under `docs/portal/issues/`.
