# Quarterly Review Template

## Reuse Rules

- Copy the fenced template below for quarter-end review.
- Keep governance decisions short enough to compare against the previous quarter.
- Put only commitment-level roadmap items in `Must`.

## Copy-Ready Template

```text
Quarterly Review

Summary
- Quarter:
- Reviewer:
- Strategy outcome:

KPI Rollup
- Delivery:
- Quality:
- Security:
- Operations:

Governance Decisions
- Keep:
- Change:
- Remove:
- Add:

Next Quarter Roadmap
- Must:
- Should:
- Could:
```

## Short Example

```text
Quarterly Review

Summary
- Quarter: 2026-Q1
- Reviewer: platform lead
- Strategy outcome: exam-solver and sns release workflows became reusable and reviewable

KPI Rollup
- Delivery: reusable templates added across exam-solver and sns operating docs
- Quality: EN/JA parity improved for both app workflows
- Security: production gate language tightened for exam-solver and sns release paths
- Operations: escalation and handoff payload unified across both apps

Governance Decisions
- Keep: exam-solver-reviewer and sns-reviewer named directly in handoff examples
- Change: require exam-solver-approval-owner and sns-approval-owner in release-sensitive examples
- Remove: anonymous handoff phrasing that hides the approval path
- Add: workflow-specific reviewer packets for deploy-exam-solver-aws.yml and deploy-sns-aws.yml

Next Quarter Roadmap
- Must: keep reviewer and approval owner naming aligned in EN/JA for both app tracks
- Should: extend the same naming discipline to deploy-exam-solver-gcp.yml and deploy-sns-azure.yml examples
- Could: add platform-reviewer spot checks for mixed governance docs
```

Copy the fenced block above to start a new review entry.
