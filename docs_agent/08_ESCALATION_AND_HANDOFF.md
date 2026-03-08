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
