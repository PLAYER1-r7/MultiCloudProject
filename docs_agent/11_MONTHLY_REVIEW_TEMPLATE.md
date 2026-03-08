# Monthly Review Template

## Reuse Rules

- Copy the fenced template below for month-end review.
- Keep KPI values compact and comparable month to month.
- Write root causes in problem / cause / fix order.

## Copy-Ready Template

```text
Monthly Review

Summary
- Month:
- Reviewer:
- Scope:

KPI Rollup
- Delivery metrics:
- Quality metrics:
- Reliability metrics:
- Security metrics:

Root Causes
1. Problem / cause / fix
2. Problem / cause / fix
3. Problem / cause / fix

Next Month Plan
- Must:
- Should:
- Could:
```

## Short Example

```text
Monthly Review

Summary
- Month: 2026-03
- Reviewer: sns service maintainer
- Scope: sns frontend_react and sns-api staging stabilization

KPI Rollup
- Delivery metrics: 4 staging fixes and review docs updated
- Quality metrics: /sns/ route guidance and sns-api handoff steps aligned
- Reliability metrics: frontend_react and sns-api staging checks standardized
- Security metrics: sns production gate checks clarified before release

Root Causes
1. Staging /sns/ route drift / missing shared reviewer packet / fixed by aligning sns-reviewer handoff notes
2. sns-api follow-up ambiguity / workflow ownership unclear / fixed by naming sns-approval-owner in release paths
3. Cache verification delay / evidence arrived late / fixed by attaching deploy-sns-aws.yml smoke checkpoints

Next Month Plan
- Must: keep sns-reviewer and sns-approval-owner named in every release handoff
- Should: standardize deploy-sns-azure.yml and deploy-sns-gcp.yml reviewer packets
- Could: add automated reminders for sns-approval-owner approval windows
```

Copy the fenced block above to start a new review entry.
