# Escalation and Handoff Guide

## Reuse Rules

- Copy the shared payload block first, then set `Outcome` to the correct state.
- Use `Outcome: Escalation requested` for blocked work and `Outcome: Handoff ready` for completed work that needs review or transfer.
- Keep the field order unchanged so downstream parsing stays stable.

## Canonical Execution Record Format

Use this as the single shared record shape for docs 08 and 14-32.

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome:
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Shared Payload Format

Use the canonical execution record format above.

## Escalate Immediately When

- Required credentials are unavailable.
- Production risk is likely.
- Security posture would be weakened.
- Architecture conflict blocks safe implementation.

## Escalation Payload

Use the canonical execution record format and set `Outcome: Escalation requested`.

## Escalation Field Rules

- Put the current blocker and impact in `Risks or blockers`.
- Put the decision you need from the reviewer or operator in `Next action`.
- Keep `Actions taken` limited to what was already checked before escalation.

## Handoff Package

Use the canonical execution record format and set `Outcome: Handoff ready`.

## Handoff Field Rules

- Put the updated task contract and change summary in `Actions taken`.
- Put validation and rollback evidence in `Evidence`.
- Put residual risks in `Risks or blockers`.
- If the work closes or refuses to extend an issue chain, record the stop-condition basis in `Closure rationale`.
- Put reviewer focus or the next owner action in `Next action`.

## Copy-Ready Handoff Template

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Handoff ready
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

## Short Example

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue #487 handoff for sns frontend_react /sns/ base-path fix in staging
Outcome: Handoff ready
Actions taken: aligned the frontend_react change summary, handoff notes, and deploy-sns-aws.yml review points
Evidence: markdown review completed; /sns/ staging smoke checklist recorded for Issue #487
Risks or blockers: staging /sns/ smoke validation still needs confirmation from the handoff owner
Closure rationale: no issue-chain closure decision was made in this handoff; delivery moves to reviewer validation only
Next action: sns-reviewer checks the /sns/ route behavior and handoff package before sns-approval-owner decides on deploy-sns-aws.yml
```

## Current Project Handoff Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject GCP hardening checkpoint after closing Issues 80 through 91
Outcome: Handoff ready
Actions taken: completed the horizontal review for Issues 80 through 91; fixed local canonical issue-record inconsistencies before closure; converted the GCP parent map and cloud summary from active execution-entry wording to a closed reference chain; resynchronized GitHub Issue bodies for Issues 80 through 91 and closed them after CloudSonnet review confirmation
Evidence: local issue records for Issues 80 through 91 are marked CLOSED; GitHub Issues 80 through 91 are closed; docs/portal/issues/issue-91-gcp-hardening-batch-follow-up-map.md and docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md now describe the GCP chain as a closed reference chain
Risks or blockers: future GCP work must not reopen or silently extend the closed 80 through 91 chain; any new retained-preview, notification, Cloud Armor, credential-rotation, or destructive-rollback work requires a fresh task contract and a new follow-up issue chain
Closure rationale: the chain was closed because the latest issues added the required execution evidence and no further child issue was needed to add a new fixed judgment or execution boundary
Next action: start the next chat from a fresh task contract, read docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md and docs/portal/issues/issue-91-gcp-hardening-batch-follow-up-map.md first, and treat any further GCP work as new follow-up scope rather than reopening the closed reference chain
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject AWS DNS verification checkpoint after closing Issues 92 through 95
Outcome: Handoff ready
Actions taken: reviewed the DNS verification chain from Issue 92 through Issue 95; aligned local issue records and GitHub issue bodies; converted the AWS DNS verification flow to a closed reference chain in the cloud status summary; closed GitHub Issues 92 through 95 after confirming no additional DNS verification follow-up remained in the current phase
Evidence: local issue records for Issues 92 through 95 are marked CLOSED; GitHub Issues 92 through 95 are closed; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md records the DNS verification chain as a closed reference chain with a short retrospective
Risks or blockers: future AWS DNS work must not silently extend the closed 92 through 95 chain; provider credentials, provider API integration, and Route 53 migration remain separate governance or implementation tracks
Closure rationale: the chain was closed because Issue 95 already provided the terminal dry-run draft and no further child issue would add new evidence, a new fixed judgment, or a new execution boundary
Next action: start any future AWS DNS-related work from a fresh task contract, keep the closed 92 through 95 chain as reference only, and reject packaging-only child issues unless a human explicitly approves a new distinct scope
```
