# Role Handoff Ownership

## Purpose

Define only the operational boundary between `reviewer` and `approval owner` so examples across the docset stay consistent.

## Role Summary

| Role             | Main responsibility                                                           | Must decide                                                             | Must not do by default                                         |
| ---------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| `reviewer`       | Check correctness, evidence quality, scope match, and handoff completeness    | whether the package is technically reviewable and what needs correction | grant release approval or silently widen scope                 |
| `approval owner` | Decide whether release-sensitive work may proceed after the evidence is ready | whether deploy, production change, auth change, or rollback may proceed | redo detailed reviewer verification or accept missing evidence |

## Reviewer Responsibilities

- Check that scope, issue number, workflow name, and environment match the task.
- Check that evidence is readable, reproducible, and attached to the handoff.
- Ask for correction when test coverage, rollback notes, or risk statements are missing.
- Keep feedback inside the existing handoff fields such as `Reviewer Notes` or `Next action`.

## Approval Owner Responsibilities

- Decide on release, production, auth, rollback, or freeze actions after the reviewer package is complete.
- Reject or delay approval when evidence is incomplete, scope changed, or operator prerequisites are missing.
- Record the exact approval target such as `deploy-sns-aws.yml` or `deploy-exam-solver-aws.yml`.
- Keep the decision tied to the existing handoff record instead of creating a parallel ad-hoc approval path.

Use these default wait limits when approval is still missing:

- Non-production work: re-escalate after 24 hours with `Outcome: Re-escalation requested - approval not received`.
- Production incident: re-escalate after 2 hours.
- Reuse the original execution record or handoff payload when re-escalating.

## Handoff Boundary

1. Agent prepares the task output and evidence.
2. `reviewer` checks technical completeness and asks for fixes if needed.
3. `approval owner` decides whether the sensitive action may proceed.

## Example Writing Rule

- Use role names directly in examples, for example `sns-reviewer` or `exam-solver-approval-owner`.
- Put the reviewer step before the approval owner step when the action is release-sensitive.
- Do not redefine these responsibilities in every template; link back to this file when needed.
