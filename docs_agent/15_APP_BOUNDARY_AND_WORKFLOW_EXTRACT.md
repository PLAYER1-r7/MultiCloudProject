# App Boundary and Workflow Extract

## Use This When

- Use this before touching app code, deploy workflows, or cloud configuration.
- Reuse it whenever a task might affect both `sns` and `exam-solver`.

## Execution Sequence

1. Name the target app.
2. Confirm editable directories.
3. Confirm matching workflow files.
4. Run the boundary guard command before edits.
5. Run the same guard again after edits.

## exam-solver

- Editable: `services/exam-solver-api/`, `services/frontend_exam/`
- Workflows: `deploy-exam-solver-*.yml`

## sns

- Editable: `services/sns-api/`, `services/frontend_react/`
- Workflows: `deploy-sns-*.yml`

## shared infrastructure

- Paths: `infrastructure/`, `scripts/`, and `.github/workflows/` outside app-specific deploy files
- Review roles: `platform-reviewer` and `platform-approval-owner`
- Rule: edits here require an explicit cross-app coordination contract before implementation starts

## Guard Command

```bash
./scripts/check-app-boundary.sh exam-solver
```

Run before and after edits.

## Workflow Boundary Rules

- `exam-solver` changes must stay within `services/exam-solver-api/`, `services/frontend_exam/`, and matching deploy workflows.
- `sns` changes must stay within `services/sns-api/`, `services/frontend_react/`, and matching deploy workflows.
- Shared infrastructure changes require a separate cross-app contract and must use the platform reviewer and approval-owner roles.
- Before debugging or deploying, confirm the target entrypoint, route family, and workflow set match the intended app.
- If a change appears to require both apps, stop and split the work into separate contracts unless the task explicitly requires cross-app coordination.

## Fallback Manual Boundary Check

If `./scripts/check-app-boundary.sh` is unavailable or fails to run, use a manual boundary check instead.

```bash
# For exam-solver: confirm no sns paths were touched
git diff --name-only | grep -E "sns-api|frontend_react"

# For sns: confirm no exam-solver paths were touched
git diff --name-only | grep -E "exam-solver-api|frontend_exam"
```

If either command returns results, stop and split the work. Record `manual boundary check used` in the evidence field.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT
Scope: Issue #451 exam-solver frontend timeout fix in services/frontend_exam
Outcome: Boundary confirmed
Actions taken: limited edits to services/frontend_exam and checked matching deploy-exam-solver-aws.yml scope
Evidence: services/exam-solver-api and sns paths remained untouched while preparing Issue #451
Risks or blockers: backend timeout behavior still needs separate validation if API limits also change
Next action: run exam-solver boundary guard again after the Issue #451 frontend patch, then hand the result to exam-solver-reviewer before deploy-exam-solver-aws.yml
```
