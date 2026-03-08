# Autonomous Workflow Checklist

## Before Coding

If blocked: auth -> `17_AUTH_REQUEST_PLAYBOOK.md`; contract or scope -> `03_TASK_CONTRACT_TEMPLATE.md`; boundary -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`.

- [ ] Target app declared.
- [ ] Target environment declared.
- [ ] Task contract completed.
- [ ] Scope and acceptance criteria fixed.
- [ ] Required authentication confirmed.

## During Coding

If blocked: boundary violation -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`; hard stop condition -> `14_CRITICAL_GUARDRAILS_EXTRACT.md`.

- [ ] Changes are small and reversible.
- [ ] No unrelated paths are touched.
- [ ] Boundary check remains clean.
- [ ] Rollback path remains available.

## Before Handoff

If blocked: test gate -> `32_TEST_EXECUTION_GATE.md`; DoD gate -> `04_DEFINITION_OF_DONE.md`; PR packaging -> `05_PR_TASK_CONTRACT_TEMPLATE.md`.

- [ ] Tests recorded.
- [ ] DoD mandatory gates passed.
- [ ] Unrelated uncommitted changes are not being mixed into the issue close or handoff flow.
- [ ] Local source document, remote issue or PR body, and status wording are aligned.
- [ ] Review-state sections inside the source document are aligned and do not point to different stages.
- [ ] External review targets the latest published state, or local-only drift is explicitly disclosed.
- [ ] If the source document changed after the last remote sync, the remote issue or PR body was synced again before close or handoff.
- [ ] Explicit human approval recorded before issue close or equivalent final-state transition.
- [ ] PR template completed.
- [ ] Remaining risks and follow-up work logged.
