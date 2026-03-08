# Task Contract Template

Use this template before implementation starts.

## Reuse Rules

- Copy the fenced template below into the task record before editing starts.
- Replace every placeholder on the same line; delete lines that are truly not needed.
- Keep acceptance criteria and validation commands concrete enough that another agent can continue without re-interpreting intent.
- If reviewer and approval owner boundaries matter for the task, follow `ROLE_HANDOFF_OWNERSHIP.md` while filling `Requester`, `Expected value`, and handoff-related scope notes.
- Use this template for review-remediation, document-only correction, and final-review packaging passes as well as normal implementation work.

## Copy-Ready Template

```text
Task Contract

Metadata
- Task ID:
- Title:
- Requester:
- Target App:
- Environment:
- Priority:

Objective
- Problem to solve:
- Expected value:

Scope
- In scope:
- Out of scope:
- Editable paths:
- Restricted paths:

Acceptance Criteria
- [ ] AC-1:
- [ ] AC-2:
- [ ] AC-3:

Implementation Plan
- Files likely to change:
- Approach:
- Alternative rejected and why:

Validation Plan
- Commands to run:
- Expected results:
- Failure triage path:

Risk and Rollback
- Risks:
- Impact area:
- Mitigation:
- Rollback:
```

Copy the block above exactly; do not reformat it into Markdown headers.

## Short Example

```text
Task Contract

Metadata
- Task ID: AGENT-104
- Title: Issue #451 exam-solver staging callback and timeout contract update
- Requester: exam-solver-reviewer
- Target App: exam-solver
- Environment: staging
- Priority: high

Objective
- Problem to solve: callback and timeout guidance are inconsistent across exam-solver frontend and API work
- Expected value: agents can update exam-solver staging behavior safely before handing off to exam-solver-reviewer and requesting approval from exam-solver-approval-owner for deploy-exam-solver-aws.yml

Scope
- In scope: docs_agent callback and timeout guidance, validation wording, and handoff notes for Issue #451 to exam-solver-reviewer
- Out of scope: runtime code changes
- Editable paths: docs_agent/20_MANUAL_DEPLOY_DECISION_CRITERIA.md
- Restricted paths: services/, infrastructure/
```

## Connection to Execution Record

Use this contract as the source document for the shared execution record used in docs 08 and 14-32.

- `Scope` in the execution record should come from Objective plus Scope.
- `Actions taken` should reflect the final Implementation Plan that was actually executed.
- `Evidence` should be filled from the Validation Plan and actual validation results.
- `Risks or blockers` should come from Risk and Rollback plus any new blockers discovered during work.
- `Next action` should state completion, escalation, handoff, or the next planned implementation step.

## Completion Hand-off Rule

When implementation starts from this contract, close the task using the canonical Execution Record format in `08_ESCALATION_AND_HANDOFF.md`.
