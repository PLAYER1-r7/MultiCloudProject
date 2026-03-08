# Test Execution Gate

## Use This When

- Use this after edits and before claiming the task is complete.
- Use it to decide whether validation is sufficient for handoff, PR, or deployment.

## Required Output

- Record what was run.
- Record what was skipped and why.
- Record the final pass or fail judgment.

## Gate Sequence

1. Smoke

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

2. Target tests for changed modules
3. Coverage check for changed services

```bash
cd services/<app>
pytest --cov=. --cov-report=term-missing tests/
```

Line coverage is the measurement type. Apply the reference threshold per changed service, not across the entire repository.

4. Regression sanity check
5. Provider-aware verification for the affected cloud or runtime path

## Evidence Rules

- Keep or improve the coverage level that exists at task start. The long-term target is 88%. If the starting coverage is below 88%, do not reduce it further and record the starting baseline in the evidence.
- Environment-dependent skips are acceptable only when explicitly recorded.
- Deployment-related changes require at least one health-style validation on the affected cloud path.

## Pass Condition

- No critical failures
- Main flow success
- Failures explained with impact and next action

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 32_TEST_EXECUTION_GATE
Scope: Issue #487 select required tests for sns frontend_react base-path change in staging
Outcome: Test gate defined
Actions taken: chose frontend build, /sns/ route smoke checks, and one health validation for the affected deploy-sns-aws.yml path
Evidence: code changed in services/frontend_react; deploy impact is limited to the sns frontend route in Issue #487
Risks or blockers: skipping sns runtime checks would be unsafe if the route base affects static asset loading
Next action: run the frontend_react build and the /sns/ smoke checks before handoff to sns-reviewer and final approval by sns-approval-owner for deploy-sns-aws.yml
```
