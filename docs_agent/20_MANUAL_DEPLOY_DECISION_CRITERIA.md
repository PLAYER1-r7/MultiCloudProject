# Manual Deploy Decision Criteria

## Use This When

- Use this when CI/CD is blocked, a release is approval-gated, or a runtime tuning change looks operational rather than product-level.
- Use it before any manual deploy or runtime-parameter override.

## Decision Procedure

1. Confirm why automation is insufficient.
2. Check whether rollback and approvals are ready.
3. Confirm the issue is operational, not architectural.
4. Record the manual step or runtime override before execution.

## Default

Use CI/CD automation by default.

## Manual Deploy Allowed Only If

- CI is blocked or emergency recovery is required.
- Scope is limited.
- Rollback is ready.
- Required approvals and authentication are available.

For emergency recovery, manual deploy is allowed only when the failure origin is already scoped to a specific layer such as configuration, deploy artifact, or environment variable. If the failure origin cannot be narrowed to a specific layer, classify it as root cause unknown and apply the hard stop rule instead.

## Never Manual Deploy When

- Root cause is unknown.
- Production impact is unmanaged.
- Rollback is unclear.
- Boundary violations are present.

## App-Specific Runtime Decision Rule

Use this document for app-specific operational tuning decisions when the choice affects runtime behavior but is not a product design change.

### exam-solver Timeout Baseline

- Current reference baseline: `120s` backend timeout and `120s` frontend timeout.
- This baseline exists because OCR plus multi-stage inference can legitimately take about `60-90s`.
- Apply timeout increases stepwise: `120s` -> `150s` -> `180s`.
- Increase timeout only after confirming the issue is timeout-related rather than a logic, auth, or infrastructure failure.

### Decision Gate

- Prefer measuring actual latency and error logs before changing timeout values.
- If a timeout change is needed, keep backend and frontend expectations aligned.
- If `180s` is still insufficient, stop treating the problem as a timeout-only issue and escalate as an optimization or architecture task.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 20_MANUAL_DEPLOY_DECISION_CRITERIA
Scope: Issue #487 decide whether to use manual deploy for sns frontend_react staging hotfix
Outcome: Manual deploy approved
Actions taken: confirmed the sns CI path is unavailable, rollback exists, and the change is limited to frontend_react assets in deploy-sns-aws.yml
Evidence: deploy-sns-aws.yml blocked by runner issue; frontend_react artifact built successfully for Issue #487
Risks or blockers: the manual sns path must stay limited to staging until CI recovers
Next action: run the documented staging-only manual deploy steps for sns, send the result to sns-reviewer, and get sns-approval-owner sign-off in place of deploy-sns-aws.yml
```
