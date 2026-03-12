# Root Troubleshooting Top Issues

## Use This When

- Use this when you need a fast symptom-to-mitigation map before deep investigation.
- Use it after triage and before cloud-specific deep dives.

## Execution Pattern

1. Start from the observed symptom.
2. Run the first confirmation step.
3. Apply the smallest safe mitigation.
4. Re-check health before trying a second mitigation.

## High-Frequency Problems

1. Azure partial-success deployments with healthy runtime
2. AWS Lambda update conflicts
3. tofu workspace/state not found
4. GitHub Actions YAML syntax failures
5. CORS misconfiguration across API and storage layers
6. GCP managed certificate stuck in `PROVISIONING` after hostname expansion

## Symptom to First Safe Action

| Symptom                                                                                               | First confirmation                                                                                         | Safe mitigation                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azure deployment says partial success                                                                 | Verify the health endpoint before treating it as failed                                                    | If runtime is healthy, treat the deploy as successful and continue with health-based validation                                                                                                                       |
| AWS `ResourceConflictException` during Lambda update                                                  | Check whether the function is still updating                                                               | Wait for the function to return to `Active`, then retry once                                                                                                                                                          |
| `tofu` reports no workspace or state found                                                            | Confirm the target environment directory and the state/workspace selection                                 | Move to the matching `infra/environments/<env>/` directory and rerun the appropriate `tofu` commands for that environment so state is managed from the correct IaC entrypoint                                         |
| GitHub Actions shows YAML parse or scanner errors                                                     | Inspect the exact heredoc or multiline block that changed                                                  | Replace fragile heredoc usage with safer quoting or simpler echo-based generation                                                                                                                                     |
| Browser shows preflight or CORS failures                                                              | Check both API-layer CORS and storage-layer CORS                                                           | Fix the missing layer and keep production origins restricted to real domains                                                                                                                                          |
| GCP managed certificate remains `PROVISIONING` or serves only the old SAN set after adding a hostname | Check certificate `domainStatus` for every included hostname and verify public DNS visibility for each one | Treat the change as blocked until every included hostname is publicly visible and `ACTIVE`; if IaC replacement failed on a fixed certificate name, rotate with a unique certificate name plus `create_before_destroy` |

## Rule

Start with symptoms, confirm with logs, then apply the smallest safe mitigation.

When more than one mitigation appears equally small, prefer them in this order:

1. The mitigation that affects the fewest system components.
2. The mitigation that is fully reversible without a deploy.
3. The mitigation that does not require production approval.

If no clear winner exists after applying the tiebreaker, escalate rather than guess.

For GCP hostname-expansion work, do not assume one `ACTIVE` hostname is enough. A shared Google-managed certificate stays blocked until every included hostname becomes publicly visible and reaches `ACTIVE`.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 30_ROOT_TROUBLESHOOTING_TOP_ISSUES
Scope: Issue #487 sns release where frontend_react build passes but sns-api staging health check fails
Outcome: Root issue shortlist created
Actions taken: compared the sns failure against known patterns for config drift, auth mismatch, and endpoint misrouting after deploy-sns-aws.yml
Evidence: frontend_react build artifacts are healthy while the sns-api health endpoint returns failure in Issue #487
Risks or blockers: chasing frontend-only fixes may miss sns-api or config causes
Next action: test the highest-likelihood sns root causes in order and send the shortlist to sns-reviewer before sns-approval-owner chooses the next rollout step
```
