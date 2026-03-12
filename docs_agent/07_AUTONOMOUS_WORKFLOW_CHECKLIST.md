# Autonomous Workflow Checklist

## Before Intake (Pre-Task Gate)

If a preceding issue exists, `gh issue view <N> --json state` must return `"state": "CLOSED"` before this Intake is accepted.

- [ ] No preceding issue exists for this task, OR the preceding issue is confirmed closed via `gh issue view <N> --json state`.
- [ ] If close approval for the preceding issue has not been received, stopped here and requested human review before proceeding.
- [ ] If the user asked for remaining tasks or next tasks without an explicit scope, anchored the request to the most recent active task contract, issue chain, or current app context instead of assuming project-wide scope.
- [ ] If more than one plausible scope exists for an ambiguous task-list request, stopped and asked the user which scope to use before expanding the inventory.
- [ ] Before producing a repository-wide remaining-task list, explicit wording such as project-wide or whole-repo was present.
- [ ] The first response to an ambiguous task-list request stated the scope the agent was using.
- [ ] If this Intake proposes a child or follow-up issue, wrote the parent issue terminal condition first.
- [ ] If this Intake proposes a child or follow-up issue, confirmed that the new issue adds at least one of: new evidence collection, a new fixed judgment, or a new execution boundary.
- [ ] Confirmed the proposed issue is not packaging-only rewording or restatement of the parent scope.
- [ ] If 2 consecutive issues in the same chain failed to add new evidence, a new fixed judgment, or a new execution boundary, stopped decomposition and reviewed whether the chain should be closed instead.
- [ ] If the proposed issue would become the 4th issue in the same chain, explicit human confirmation was recorded before accepting the Intake.

### 30-Second Child-Issue Check

Use this exact prompt before accepting a proposed child or follow-up issue.

```text
30-second child-issue check

1. What new evidence would this issue add?
2. What new fixed judgment would this issue add?
3. What new execution boundary would this issue add?
4. What is the parent issue terminal condition?
5. If this issue is not created, can the work be closed or resolved in place instead?

If answers 1-3 are all "none", do not create the issue.
If answer 4 is missing, stop and write the terminal condition first.
If answer 5 is "yes", prefer close or in-place resolution over a new child issue.
```

### 30-Second Ambiguous Task-List Check

Use this exact prompt before answering a vague request such as remaining tasks or next tasks.

```text
30-second ambiguous task-list check

1. What is the narrowest active scope in the current chat?
2. Is the user asking about that scope, the current app, the current issue chain, or the whole project?
3. What exact words justify expanding to repository-wide scope?
4. If no exact words justify expansion, can I answer within the current active scope instead?

If 2 is unclear, ask before listing tasks.
If 3 is "none", do not expand to whole-project scope.
If 4 is "yes", answer inside the current active scope and state that scope explicitly.
```

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
- [ ] If leftover diffs separate into semantic work and formatting-only cleanup, they were split into distinct task scopes before review or close.
- [ ] Boundary check remains clean.
- [ ] Rollback path remains available.

## Before Writing Resolution

If blocked: question disposition -> `02_AUTONOMOUS_DEV_PROTOCOL.md` Step 2 (Contract).

- [ ] If the discussion draft has an open-questions table, every row has the `Resolution confirmed wording` column filled, and the third column is no longer left as draft-only candidate wording such as `Candidate wording for confirmation`.
- [ ] If questions were resolved by direct decision without individual written answers, that fact is recorded in Process Review Notes with the label `direct-decision`.

## Before Handoff

If blocked: test gate -> `32_TEST_EXECUTION_GATE.md`; DoD gate -> `04_DEFINITION_OF_DONE.md`; PR packaging -> `05_PR_TASK_CONTRACT_TEMPLATE.md`.

## Before Creating A PR

- [ ] Before creating the PR, confirmed the implementation, required tests, related document updates, and issue-state synchronization for the target scope are complete.
- [ ] Confirmed the PR is not reopening a closed chain for packaging-only continuation, and instead represents either a completed active scope or a fresh-record follow-up.
- [ ] If the PR is being prepared with AI assistance, confirmed the staged files are limited to the intended scope and unrelated local changes are excluded.
- [ ] If the PR title, body, or self-review notes were prepared with AI assistance, a human still confirmed scope, validation evidence, and merge risk before final submission or merge.
- [ ] If scope is ambiguous, unrelated changes are mixed in, or merge safety depends on judgment, stopped autonomous PR execution and requested confirmation before creating the PR.
- [ ] The PR title states what was completed or added, and does not collapse mixed code-and-doc synchronization work into a vague label.
- [ ] The PR body includes Summary, What Changed, and Validation as the minimum fixed sections.
- [ ] The What Changed section distinguishes implementation changes, validation additions, and issue or document synchronization instead of blending them together.
- [ ] The Validation section lists only checks that were actually run, or explicitly states when a relevant check was not run.
- [ ] If child issues were closed as part of the work, the corresponding parent baseline or summary record was also updated to reflect completion.
- [ ] If a higher-level summary document exists for the scope, it was updated after the implementation chain completed.
- [ ] Reviewer focus notes were reduced to 2 or 3 concrete review points.
- [ ] The PR body wording was checked against the local diff, issue states, and summary documents for consistency.
- [ ] If the PR includes historical issue records or other documents that describe closed or historical states, such as decision records or postmortems, predecessor wording and current-status wording were rechecked against the current GitHub issue state.

## After Review Comments

- [ ] Before starting a review-remediation pass, the latest PR reviews and inline comments were fetched again instead of relying on an earlier review snapshot.
- [ ] If the current branch contained unrelated work, the remediation was isolated in a separate worktree or equivalent clean branch context.
- [ ] After the remediation patch, the relevant validation was rerun on the final fix state before pushing or publishing the fix commit, or before requesting re-review.
- [ ] After publishing the validated fix commit, a PR comment was added summarizing the addressed comments and the validation that was rerun.
- [ ] A fresh Copilot review was requested only after the new fix commit and PR comment were both published.
- [ ] If a follow-up docs PR depends on an unmerged implementation PR, a stacked PR was used and the future retarget condition was documented.

## Finalization

- [ ] Tests recorded.
- [ ] DoD mandatory gates passed.
- [ ] Unrelated uncommitted changes are not being mixed into the issue close or handoff flow.
- [ ] Local source document, remote issue or PR body, and status wording are aligned.
- [ ] Review-state sections inside the source document are aligned and do not point to different stages.
- [ ] If the source document may have changed since the last review pass, approval exchange, or tool warning, the current file was reread before adding Process Review Notes, close approval records, or other final-state edits.
- [ ] External review targets the latest published state, or local-only drift is explicitly disclosed.
- [ ] Remote issue or PR body was not updated with new Final Review Result or equivalent completion wording before the matching commit was published.
- [ ] If the source document changed after the last remote sync, the remote issue or PR body was synced again before close or handoff.
- [ ] If the remote body is derived from a repository file, the final sync used a body-file path from that file instead of a manually reconstructed body payload.
- [ ] After the final sync, the published GitHub body was spot-checked for Markdown-sensitive drift such as broken `<...>` literals, malformed tables, or damaged code fences.
- [ ] Human re-agreement, if obtained, is recorded separately from agent validation and does not imply close approval.
- [ ] Explicit human approval recorded before issue close or equivalent final-state transition: the approval form (single-issue or sequential-batch), and the verbatim quote or conversation reference that constitutes the approval, are written in Process Review Notes.
- [ ] PR template completed.
- [ ] Remaining risks and follow-up work logged.
