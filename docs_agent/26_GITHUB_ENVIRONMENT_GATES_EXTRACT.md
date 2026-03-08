# GitHub Environment Gates Extract

## Use This When

- Use this before triggering or approving any deployment workflow.
- Use it when a branch, environment, or approval mismatch is suspected.

## Decision Pattern

1. Identify the target environment.
2. Map it back to the allowed branch.
3. Check whether approval is required.
4. Treat pending approval as incomplete deployment state.

## Environment Rules

- production: `main` branch, approval required
- staging: `develop` branch, no approval by default
- development: broad testing scope

## Branch Strategy

- `feature/*`, `fix/*`, `docs/*`, and `chore/*` branches start from `develop` and return to `develop`.
- `hotfix/*` branches start from `main` only for emergency production correction.
- Do not merge ordinary feature work directly into `main`.
- A pending environment approval means the deployment is not complete.

## Agent Rule

Treat production as approval-gated work at all times.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 26_GITHUB_ENVIRONMENT_GATES_EXTRACT
Scope: Issue #487 sns production deployment workflow waiting on environment gate
Outcome: Gate status understood
Actions taken: checked pending approval, required secrets, and environment-specific restrictions for deploy-sns-aws.yml
Evidence: deploy-sns-aws.yml is paused at the production environment approval step for Issue #487
Risks or blockers: the sns deploy cannot continue until approver and secrets state are confirmed
Next action: notify sns-approval-owner with the required evidence package and copy sns-reviewer before release continues
```
