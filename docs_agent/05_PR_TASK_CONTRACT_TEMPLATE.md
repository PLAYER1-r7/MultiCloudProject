# PR Task Contract Template

Use this template when packaging implementation into a PR or handoff review unit.

## Reuse Rules

- Copy the fenced template below when preparing a PR description, handoff review note, or merge summary.
- Keep `Planned scope` and `Actual scope` short and comparable.
- Record missing validation explicitly instead of hiding it in prose.
- If the example includes reviewer or approval-owner actions, keep their boundary aligned with `ROLE_HANDOFF_OWNERSHIP.md` instead of redefining it in the PR note.

## Copy-Ready Template

```text
PR Task Contract

Summary
- Task ID:
- Target App:
- Related Issue:

Contract Alignment
- Planned scope:
- Actual scope:
- Scope delta:

Validation
- Commands run:
- Results:
- Not run and why:

Risk
- Impact area:
- Mitigation:
- Rollback:

Reviewer Notes
- Review first:
- Reproduction steps:
- Open questions:
```

Copy the block above exactly; do not reformat it into Markdown headers.

## Short Example

```text
PR Task Contract

Summary
- Task ID: AGENT-118
- Target App: sns
- Related Issue: #487

Contract Alignment
- Planned scope: fix the frontend_react /sns/ base path and handoff notes for staging
- Actual scope: updated the /sns/ base path guidance, handoff notes, and deploy review points
- Scope delta: added one reviewer note for static asset cache verification

Validation
- Commands run: npm run build, staging /sns/ smoke checklist review
- Results: build passed and review points are ready for staging verification
- Not run and why: production deploy was not run because the change is staging-scoped

Risk
- Impact area: sns staging /sns/ route and static asset cache behavior
- Mitigation: sns-reviewer verifies /sns/ asset loading before merge
- Rollback: sns-approval-owner can stop deploy-sns-aws.yml and restore the previous asset bundle

Reviewer Notes
- Review first: sns-reviewer checks /sns/ cache invalidation and handoff notes
- Reproduction steps: open staging /sns/ after build output is prepared for deploy-sns-aws.yml
- Open questions: does sns-approval-owner require a separate production approval window
```

## Connection to Shared Record Format

This PR contract is the review-ready projection of the shared execution record.

- `Summary` and `Contract Alignment` should define the final `Scope` and `Outcome`.
- `Validation` should map directly to `Evidence`.
- `Risk` should map directly to `Risks or blockers`.
- `Reviewer Notes` should become the reviewer-facing part of `Next action`.

## Packaging Rule

Before opening or handing off a PR, make sure the final state can be expressed using the canonical execution record format in `08_ESCALATION_AND_HANDOFF.md`.

When packaging a PR or handoff, reuse that format and set `Outcome: Handoff ready`.
