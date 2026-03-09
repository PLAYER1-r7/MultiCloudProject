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
Next action:
```

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Shared Payload Format

Use the canonical execution record format above.

## Escalate Immediately When

- Production risk is likely.
- Required credentials are unavailable.
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
- Put reviewer focus or the next owner action in `Next action`.

## Copy-Ready Handoff Template

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Handoff ready
Actions taken:
Evidence:
Risks or blockers:
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
Next action: sns-reviewer checks the /sns/ route behavior and handoff package before sns-approval-owner decides on deploy-sns-aws.yml
```

## Current Project Handoff Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject portal governance checkpoint after closing Issues 45 and 46
Outcome: Handoff ready
Actions taken: closed Issue 45 for the production alert delivery baseline and Issue 46 for the external DNS automation / Route 53 migration judgment; synchronized the local issue records, shared governance docs, and GitHub Issue bodies; fixed the current production governance wording around external DNS source of truth, Route 53 non-adoption in the current phase, and operator-assist-only DNS automation
Evidence: local issue records for Issues 45 and 46 are marked CLOSED; GitHub Issues 45 and 46 are closed; architecture, IaC, workflow README, and production README contain the synchronized governance wording added by Issue 46
Risks or blockers: GCP baseline design, deeper incident runbook follow-up, and alert product implementation remain intentionally out of scope and should not be mixed into the completed DNS governance decision
Next action: start the next chat from a fresh task contract, read the latest records under docs/portal/issues/, and treat GCP baseline design as a separate follow-up scope rather than reopening the closed DNS governance work
```
