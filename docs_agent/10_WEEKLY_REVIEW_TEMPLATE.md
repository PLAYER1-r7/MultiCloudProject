# Weekly Review Template

## Reuse Rules

- Copy the fenced template below at the end of the week or sprint slice.
- Keep metrics numeric when possible.
- Keep `Next Week Actions` actionable enough to assign directly.

## Copy-Ready Template

```text
Weekly Review

Summary
- Week:
- Reviewer:
- Scope:

Metrics
- Tasks completed:
- PRs merged:
- Lead time:
- First pass success rate:
- Boundary violations:

What Worked
-

What Failed
-

Next Week Actions
1. Action / owner / due date
2. Action / owner / due date
```

## Short Example

```text
Weekly Review

Summary
- Week: 2026-W10
- Reviewer: exam-solver maintainer
- Scope: exam-solver staging callback and timeout workflow alignment

Metrics
- Tasks completed: 5
- PRs merged: 1
- Lead time: 1.2 days
- First pass success rate: 80%
- Boundary violations: 0

What Worked
- exam-solver-reviewer closed the callback and timeout review loop before deploy-exam-solver-aws.yml discussion

What Failed
- approval timing with exam-solver-approval-owner was delayed by missing redirect verification notes

Next Week Actions
1. Add redirect verification evidence for exam-solver-reviewer / exam-solver-approval-owner / before next staging handoff
2. Re-run the callback checklist before the next deploy-exam-solver-aws.yml review / AI agent / 2026-03-14
```

Copy the fenced block above to start a new review entry.
