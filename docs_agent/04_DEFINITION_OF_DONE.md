# Definition of Done

## Mandatory Gates

- [ ] App boundary respected. Check `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`.
- [ ] Acceptance criteria satisfied. Confirm against the task contract in `03_TASK_CONTRACT_TEMPLATE.md`.
- [ ] Required tests passed or explicitly explained. Use `32_TEST_EXECUTION_GATE.md`.
- [ ] No security regression introduced. Check stop conditions in `14_CRITICAL_GUARDRAILS_EXTRACT.md`.
- [ ] Rollback path documented. Satisfy the Minimum Rollback Content section below.

## Delivery Gates

- [ ] Change summary is clear. Follow the packaging rule in `05_PR_TASK_CONTRACT_TEMPLATE.md`.
- [ ] Risks and trade-offs are explicit. Record them in the Risk and Rollback section of `03_TASK_CONTRACT_TEMPLATE.md`.
- [ ] Reviewer instructions are included. Follow the Reviewer Notes format in `05_PR_TASK_CONTRACT_TEMPLATE.md`.
- [ ] Follow-up work is logged if needed. Record it in `Next action` of the canonical execution record in `08_ESCALATION_AND_HANDOFF.md`.
- [ ] If the task closed an issue chain or refused a proposed child issue, the stop-condition basis is recorded in `Closure rationale` of the canonical execution record in `08_ESCALATION_AND_HANDOFF.md`.
- [ ] If the task changed browser-facing portal copy or another public-facing text surface, live reflection was verified, or the work is explicitly recorded as deploy-ready/local-only with the reason and handoff owner.
- [ ] Issue close confirmed: ran `gh issue close <N>` with prior human approval (approval form and verbatim quote or reference recorded in Process Review Notes), then verified closed state with `gh issue view <N> --json state`. Do not begin the next Intake until this step is complete.

## Minimum Rollback Content

A documented rollback path must include at least:

1. The exact revert command or step sequence.
2. The expected recovery time.
3. The validation command that confirms the rollback succeeded.

## Rule

If any mandatory gate is not satisfied, the work is not Done.
