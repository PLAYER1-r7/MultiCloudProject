# Task Contract Template

Use this template before implementation starts.

## Reuse Rules

- Copy the fenced template below into the task record before editing starts.
- Replace every placeholder on the same line; delete lines that are truly not needed.
- Keep acceptance criteria and validation commands concrete enough that another agent can continue without re-interpreting intent.
- If several references can be checked independently, record the read-only context gathering in one short line instead of scattering it across the contract.
- If a file may have changed before editing, reread it and reflect the final edit target in the contract rather than relying on stale notes.
- If the task changes browser-facing portal copy or another public-facing text surface, state whether the scope is `local-only` or includes live reflection.
- If the task may create or continue a follow-up issue chain, fill `Terminal condition` before creating the next issue.
- If reviewer and approval owner boundaries matter for the task, follow `ROLE_HANDOFF_OWNERSHIP.md` while filling `Requester`, `Expected value`, and handoff-related scope notes.
- Use this template for review-remediation, document-only correction, and final-review packaging passes as well as normal implementation work.

## Minimum Start Rule

- If work must start before every detail is known, still create a task contract before the first edit.
- At minimum, fill `Title`, `Requester`, `Target App`, `Environment`, `Problem to solve`, `In scope`, `Out of scope`, one acceptance criterion, and one validation command.
- If read-only context gathering was parallelized, note that briefly in `Approach`.
- If the task changes browser-facing portal copy or another public-facing text surface, also state whether live reflection is in scope and what evidence will prove it.
- If the work may branch into follow-up issues, also fill `Terminal condition` before the first child is created.
- Leave unknown values as explicit `TBD` markers rather than skipping the contract.
- Expand the contract before handoff if the work grows beyond the initial narrow scope.

## Minimum Starter Block

Use this only when speed matters and the full template would delay safe task startup.

```text
Task Contract

Metadata
- Task ID: TBD
- Title:
- Requester:
- Target App:
- Environment:
- Priority: TBD
- Predecessor: (Issue # that must be CLOSED before this contract is activated, or "none")

Objective
- Problem to solve:
- Expected value: TBD
- Terminal condition: TBD

Scope
- In scope:
- Out of scope:
- Editable paths: TBD
- Restricted paths: TBD

Acceptance Criteria
- [ ] AC-1:

Implementation Plan
- Files likely to change: TBD
- Approach: TBD
- File reread trigger before edit: TBD
- Alternative rejected and why: TBD

Validation Plan
- Commands to run:
- Expected results: TBD
- Not run and why: TBD
- Failure triage path: TBD

Risk and Rollback
- Risks: TBD
- Impact area: TBD
- Mitigation: TBD
- Rollback: TBD
```

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
- Predecessor:

Objective
- Problem to solve:
- Expected value:
- Terminal condition:

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
- File reread trigger before edit:
- Alternative rejected and why:

Validation Plan
- Commands to run:
- Expected results:
- Not run and why:
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
- Terminal condition: contract wording is fixed in one source document and no additional child issue is needed to complete the callback and timeout guidance update

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
- `Evidence` should be filled from the Validation Plan, actual validation results, and any explicitly unrun checks.
- `Risks or blockers` should come from Risk and Rollback plus any new blockers discovered during work.
- `Next action` should state completion, escalation, handoff, or the next planned implementation step.

## Completion Hand-off Rule

When implementation starts from this contract, close the task using the canonical Execution Record format in `08_ESCALATION_AND_HANDOFF.md`.
