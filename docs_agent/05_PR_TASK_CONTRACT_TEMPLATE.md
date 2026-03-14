# PR Task Contract Template

Use this template when packaging implementation into a PR or handoff review unit.

## Reuse Rules

- Copy the fenced template below when preparing a PR description, handoff review note, or merge summary.
- Keep `Planned scope` and `Actual scope` short and comparable.
- Keep `Summary`, `What Changed`, and `Validation` as the minimum fixed PR-facing sections even when the package is short.
- Record missing validation explicitly instead of hiding it in prose.
- If read-only context gathering or file rereads materially shaped the diff, summarize that briefly in `What Changed` or `Reviewer Notes`.
- In `What Changed`, separate implementation changes, validation additions, and issue or document synchronization instead of collapsing them into one vague bullet.
- If the task closed an issue chain or refused a proposed child issue, carry the stop-condition basis into `Closure rationale` so the PR package matches the shared execution record.
- If the example includes reviewer or approval-owner actions, keep their boundary aligned with `ROLE_HANDOFF_OWNERSHIP.md` instead of redefining it in the PR note.
- If the PR is stacked on top of another unmerged branch, note the temporary base branch and retarget condition in `Reviewer Notes` or `Closure rationale`.
- Do not package a PR as effectively complete if implementation or validation is still pending and no real blocker exists.

## Copy-Ready Template

```text
PR Task Contract

Summary
- Task ID:
- Target App:
- Related Issue:

What Changed
- Implementation:
- Validation additions:
- Issue or document sync:

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
- Closure rationale:

Reviewer Notes
- Review first:
- Reproduction steps:
- Reread or context notes:
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

What Changed
- Implementation: updated the /sns/ base path guidance used by the staging path
- Validation additions: added staging smoke review points for /sns/ asset loading
- Issue or document sync: updated the handoff notes to match the staging review path

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
- Closure rationale: no issue-chain closure decision was made in this PR package; closure remains outside the current staging scope

Reviewer Notes
- Review first: sns-reviewer checks /sns/ cache invalidation and handoff notes
- Reproduction steps: open staging /sns/ after build output is prepared for deploy-sns-aws.yml
- Reread or context notes: staging handoff notes were reread before packaging and the smoke checklist remains the current source of truth
- Open questions: does sns-approval-owner require a separate production approval window
```

## Connection to Shared Record Format

This PR contract is the review-ready projection of the shared execution record.

- `Summary` and `Contract Alignment` should define the final `Scope` and `Outcome`.
- `What Changed` should make the implementation, validation additions, and issue or document synchronization legible without rereading the full diff.
- `Validation` should map directly to `Evidence`.
- `Risk` should map directly to `Risks or blockers`.
- `Closure rationale` should map directly to `Closure rationale` when the task closed an issue chain or refused to create a child issue.
- `Reviewer Notes` should become the reviewer-facing part of `Next action`, including any context-reread note that matters for review safety.

## Packaging Rule

Before opening or handing off a PR, make sure the final state can be expressed using the canonical execution record format in `08_ESCALATION_AND_HANDOFF.md`.

When packaging a PR or handoff, reuse that format and set `Outcome: Handoff ready`.
