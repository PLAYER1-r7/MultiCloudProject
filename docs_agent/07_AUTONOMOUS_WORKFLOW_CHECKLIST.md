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
- [ ] PR template completed.
- [ ] Remaining risks and follow-up work logged.
