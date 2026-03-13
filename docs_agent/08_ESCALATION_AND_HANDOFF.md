# Escalation and Handoff Guide

## Reuse Rules

- Copy the shared payload block first, then set `Outcome` to the correct state.
- Use `Outcome: Escalation requested` for blocked work and `Outcome: Handoff ready` for completed work that needs review or transfer.
- Keep the field order unchanged so downstream parsing stays stable.

## Canonical Execution Record Format

Use this as the single shared record shape for docs 08 and 14-32.

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome:
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Shared Payload Format

Use the canonical execution record format above.

## Escalate Immediately When

- Required credentials are unavailable.
- Production risk is likely.
- Security posture would be weakened.
- Architecture conflict blocks safe implementation.

## Escalation Payload

Use the canonical execution record format and set `Outcome: Escalation requested`.

## Escalation Field Rules

- Put the current blocker and impact in `Risks or blockers`.
- Put the decision you need from the reviewer or operator in `Next action`.
- Keep `Actions taken` limited to what was already checked before escalation.

## Handoff Package

Use the canonical execution record format and set `Outcome: Handoff ready`.

## Handoff Field Rules

- Put the updated task contract and change summary in `Actions taken`.
- Put validation and rollback evidence in `Evidence`.
- Put residual risks in `Risks or blockers`.
- If the work closes or refuses to extend an issue chain, record the stop-condition basis in `Closure rationale`.
- Put reviewer focus or the next owner action in `Next action`.

## Copy-Ready Handoff Template

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Handoff ready
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

## Short Example

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue #487 handoff for sns frontend_react /sns/ base-path fix in staging
Outcome: Handoff ready
Actions taken: aligned the frontend_react change summary, handoff notes, and deploy-sns-aws.yml review points
Evidence: markdown review completed; /sns/ staging smoke checklist recorded for Issue #487
Risks or blockers: staging /sns/ smoke validation still needs confirmation from the handoff owner
Closure rationale: no issue-chain closure decision was made in this handoff; delivery moves to reviewer validation only
Next action: sns-reviewer checks the /sns/ route behavior and handoff package before sns-approval-owner decides on deploy-sns-aws.yml
```

## Current Project Handoff Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject GitHub Issue 136-138 review follow-up after ClaudeSonnet comments
Outcome: Handoff ready
Actions taken: reviewed GitHub Issues 136 through 138 against the local source records and resolved the two concrete follow-ups raised in review; added an explicit parent-contract sentence to docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md so Issue 136 reads clearly as the GitHub-tracked parent planning contract when viewed in isolation; synchronized that updated body to GitHub Issue 136; added the planning label to GitHub Issue 138 so planning and execution-planning filters stay aligned with Issue 136
Evidence: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md now states that approved child splits must inherit the parent contract entry condition; markdown diagnostics passed for the updated local issue record; GitHub Issue 136 body now contains the parent-contract wording; GitHub Issue 138 labels now include planning, portal, aws, infrastructure, cicd, and sns
Risks or blockers: no blocking review issue remains in GitHub Issues 136 through 138; later follow-up should avoid drifting Issue 138 beyond the pre-deploy promotion boundary or treating unpublished local drafts as accepted child issues
Closure rationale: the ClaudeSonnet follow-up was limited to the two reviewable defects found in the GitHub issue presentation layer, so the fix stopped after parent-contract readability and label-filter consistency were restored without expanding execution scope
Next action: continue using Issue 136 as the GitHub-tracked parent planning contract and Issue 138 as its only approved child execution issue; keep Issues 155 and 156 local-only until a later review explicitly approves another distinct child boundary
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject SNS production-hardening child-split review after creating Issue 138 under Issue 136
Outcome: Handoff ready
Actions taken: reviewed whether the local SNS child drafts under Issue 136 added distinct execution boundaries; approved only the pre-deploy promotion gate draft as the first narrow child split; created GitHub Issue 138 from docs/portal/issues/issue-154-sns-production-promotion-execution.md with the required production-delivery labels; synchronized the local SNS planning records and portal status summaries so they now treat Issue 138 as the only published child issue while keeping Issues 155 through 156 unpublished
Evidence: GitHub Issue 138 is open with the expected labels; docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md records Issue 138 as the first published child split under Issue 136; docs/portal/issues/issue-154-sns-production-promotion-execution.md now reflects the open GitHub issue state; markdown diagnostics passed for the updated local summaries and handoff files
Risks or blockers: Issues 155 and 156 still have no GitHub issue records and must not be treated as accepted execution issues until a later review confirms they add distinct follow-on boundaries; production-hardening work can now leave Issue 136 only through Issue 138, not through the remaining unpublished drafts
Closure rationale: only Issue 154 was published because it adds the distinct pre-deploy promotion execution boundary that Issue 136 intentionally left abstract; Issues 155 and 156 were not published because they remain downstream post-deploy boundaries that are not yet justified as immediate child issues
Next action: use Issue 138 as the only GitHub-tracked child issue under Issue 136 for SNS production promotion preparation; keep Issues 155 and 156 local-only until post-deploy review shows that public verification or rollback hardening needs a separate approved execution issue
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject post-staging SNS and Azure planning queue normalization after creating Issues 136 and 137
Outcome: Handoff ready
Actions taken: reviewed the docs_agent issue-decomposition guardrails against the local SNS and Azure planning drafts; created GitHub Issue 136 for the SNS production-hardening contract and GitHub Issue 137 for the March Azure planning-only batch with the required labels; synchronized the local planning records and portal status summaries to those GitHub-tracked issues; kept the deeper SNS production child drafts for Issues 154 through 156 unpublished pending explicit human confirmation
Evidence: GitHub Issues 136 and 137 are open with the expected labels; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md and docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md now point to Issues 136 and 137 as the active follow-up queue; docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md and docs/portal/issues/issue-153-azure-planning-only-batch-contract.md are aligned to the open GitHub issue state; markdown diagnostics passed for the updated local records
Risks or blockers: the local SNS child drafts for Issues 154 through 156 still do not have explicit human approval or GitHub issue records, so they must not be treated as accepted execution issues; production-hardening work must stay inside Issue 136 until a narrower child issue is justified by a distinct execution boundary
Closure rationale: no additional GitHub child issues were created beyond Issues 136 and 137 because the current planning boundary is already captured there, and publishing Issues 154 through 156 now would extend the chain before explicit approval that the split adds a distinct execution boundary
Next action: use Issue 136 as the only GitHub-tracked entry point for SNS production-hardening planning until a reviewer explicitly approves a narrower child split; use Issue 137 as the Azure planning-only queue and keep live Azure execution deferred until the April reopen gate is intentionally approved
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject repository cleanup checkpoint after SNS issue closure and safety-branch dismantling
Outcome: Handoff ready
Actions taken: verified that Issues 119 and 120 were already implemented in portal-web, ran the SNS contract validators, synchronized the local issue records and GitHub issue bodies, and closed both issues; dismantled the retained safety snapshot by auditing every remaining bucket, cherry-picked the forward docset and portal-doc updates into main, pushed main, and deleted the temporary re-home branches, worktrees, and final safety snapshot branch
Evidence: GitHub has no open issues and no open pull requests; main contains the integrated docset and portal-doc updates; all temporary safety/rehome branches and the final safety snapshot branch have been removed; the repository working tree is clean
Risks or blockers: future work must start from the current main state rather than reviving any deleted safety snapshot content; any new portal, cloud, or process follow-up requires a fresh task contract and should be treated as new scope, not continuation of the dismantled safety branch
Closure rationale: the retained safety snapshot was kept only until every remaining diff was either integrated into main or intentionally discarded after audit; that condition is now satisfied, so the snapshot and its re-home branches were deleted
Next action: start the next chat from a fresh task contract, read docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md and the latest current project handoff records in this file first, and treat any further work as new scope on top of clean main
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject GCP hardening checkpoint after closing Issues 80 through 91
Outcome: Handoff ready
Actions taken: completed the horizontal review for Issues 80 through 91; fixed local canonical issue-record inconsistencies before closure; converted the GCP parent map and cloud summary from active execution-entry wording to a closed reference chain; resynchronized GitHub Issue bodies for Issues 80 through 91 and closed them after CloudSonnet review confirmation
Evidence: GitHub Issues 80 through 91 are closed; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md describes the GCP chain as a closed reference chain
Risks or blockers: future GCP work must not reopen or silently extend the closed 80 through 91 chain; any new retained-preview, notification, Cloud Armor, credential-rotation, or destructive-rollback work requires a fresh task contract and a new follow-up issue chain
Closure rationale: the chain was closed because the latest issues added the required execution evidence and no further child issue was needed to add a new fixed judgment or execution boundary
Next action: start the next chat from a fresh task contract, read docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md first, and treat any further GCP work as new follow-up scope rather than reopening the closed reference chain
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject AWS DNS verification checkpoint after closing Issues 92 through 95
Outcome: Handoff ready
Actions taken: reviewed the DNS verification chain from Issue 92 through Issue 95; aligned local issue records and GitHub issue bodies; converted the AWS DNS verification flow to a closed reference chain in the cloud status summary; closed GitHub Issues 92 through 95 after confirming no additional DNS verification follow-up remained in the current phase
Evidence: GitHub Issues 92 through 95 are closed; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md records the DNS verification chain as a closed reference chain with a short retrospective
Risks or blockers: future AWS DNS work must not silently extend the closed 92 through 95 chain; provider credentials, provider API integration, and Route 53 migration remain separate governance or implementation tracks
Closure rationale: the chain was closed because Issue 95 already provided the terminal dry-run draft and no further child issue would add new evidence, a new fixed judgment, or a new execution boundary
Next action: start any future AWS DNS-related work from a fresh task contract, keep the closed 92 through 95 chain as reference only, and reject packaging-only child issues unless a human explicitly approves a new distinct scope
```
