# Test and Deploy Quick Reference

## Use This When

- Use this after a small code change when you need the shortest safe path to validation and deployment.
- If the task is larger, use docs 31 and 32 as the authority and use this file only as a launch shortcut.

## Authority

- Use `32_TEST_EXECUTION_GATE.md` as the authority for evidence rules, coverage expectations, pass conditions, and validation sufficiency.
- Use `31_PRODUCTION_READINESS_GATE.md` as the authority for release-sensitive GO or NO-GO decisions.

## Quick Start Sequence

1. Run smoke checks.
2. Run the smallest target tests for the changed module.
3. Open `32_TEST_EXECUTION_GATE.md` and confirm the evidence you still need.
4. Trigger or inspect the deployment workflow only after the test result and evidence plan are clear.
5. Watch the workflow until success, approval hold, or failure is explicit.

## Test First

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## Target Tests

```bash
cd services/sns-api
pytest tests/ -v
```

Replace the service path and test command as needed for the changed surface.

## Manual Workflow Trigger

```bash
gh workflow run deploy-sns-aws.yml --ref develop -f environment=staging
gh run list --workflow=deploy-sns-aws.yml --limit 5
gh run watch <run-id>
```

Use manual deploy only when justified.

For detailed gate logic, do not extend this document. Return to `32_TEST_EXECUTION_GATE.md`.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 16_TEST_AND_DEPLOY_QUICK_REF
Scope: Issue #487 staging validation path for sns frontend_react base-path fix
Outcome: Validation path selected
Actions taken: selected smoke checks, target tests, and doc 32 as the authority before deploy-sns-aws.yml
Evidence: affected surface is services/frontend_react and deploy-sns-aws.yml only for Issue #487
Risks or blockers: validation remains incomplete until the doc 32 evidence requirements are satisfied
Next action: run the selected commands, complete the evidence required by doc 32, and then hand results to sns-reviewer before sns-approval-owner decides on deploy-sns-aws.yml
```
