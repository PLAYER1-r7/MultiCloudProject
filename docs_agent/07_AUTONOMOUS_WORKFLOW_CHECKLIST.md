# Autonomous Workflow Checklist

## Before Intake (Pre-Task Gate)

If a preceding issue exists, `gh issue view <N> --json state` must return `"state": "CLOSED"` before this Intake is accepted.

- [ ] No preceding issue exists for this task, OR the preceding issue is confirmed closed via `gh issue view <N> --json state`.
- [ ] If close approval for the preceding issue has not been received, stopped here and requested human review before proceeding.

## Before Coding

If blocked: auth -> `17_AUTH_REQUEST_PLAYBOOK.md`; contract or scope -> `03_TASK_CONTRACT_TEMPLATE.md`; boundary -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`.

- [ ] Target app declared.
- [ ] Target environment declared.
- [ ] Task contract completed.
- [ ] If some task details are still unknown, a minimum starter contract was still written before the first edit and unknown fields are marked as `TBD`.
- [ ] If this is a review-remediation or document-only correction pass, a dedicated task contract exists for that remediation scope.
- [ ] Scope and acceptance criteria fixed.
- [ ] Required authentication confirmed.

## During Coding

If blocked: boundary violation -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`; hard stop condition -> `14_CRITICAL_GUARDRAILS_EXTRACT.md`.

- [ ] Changes are small and reversible.
- [ ] No unrelated paths are touched.
- [ ] Boundary check remains clean.
- [ ] Rollback path remains available.

## Before Writing Resolution

If blocked: question disposition -> `02_AUTONOMOUS_DEV_PROTOCOL.md` Step 2 (Contract).

- [ ] If the discussion draft has an open-questions table, every row has the `Resolution confirmed wording` column filled, and the third column is no longer left as draft-only candidate wording such as `Candidate wording for confirmation`.
- [ ] If questions were resolved by direct decision without individual written answers, that fact is recorded in Process Review Notes with the label `direct-decision`.

## Before Handoff

If blocked: test gate -> `32_TEST_EXECUTION_GATE.md`; DoD gate -> `04_DEFINITION_OF_DONE.md`; PR packaging -> `05_PR_TASK_CONTRACT_TEMPLATE.md`.

- [ ] Tests recorded.
- [ ] DoD mandatory gates passed.
- [ ] Unrelated uncommitted changes are not being mixed into the issue close or handoff flow.
- [ ] Local source document, remote issue or PR body, and status wording are aligned.
- [ ] Review-state sections inside the source document are aligned and do not point to different stages.
- [ ] External review targets the latest published state, or local-only drift is explicitly disclosed.
- [ ] Remote issue or PR body was not updated with new Final Review Result or equivalent completion wording before the matching commit was published.
- [ ] If the source document changed after the last remote sync, the remote issue or PR body was synced again before close or handoff.
- [ ] If the remote body is derived from a repository file, the final sync used a body-file path from that file instead of a manually reconstructed body payload.
- [ ] After the final sync, the published GitHub body was spot-checked for Markdown-sensitive drift such as broken `<...>` literals, malformed tables, or damaged code fences.
- [ ] Human re-agreement, if obtained, is recorded separately from agent validation and does not imply close approval.
- [ ] Explicit human approval recorded before issue close or equivalent final-state transition.
- [ ] PR template completed.
- [ ] Remaining risks and follow-up work logged.
