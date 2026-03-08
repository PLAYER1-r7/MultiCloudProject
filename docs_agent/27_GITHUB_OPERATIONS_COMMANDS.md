# GitHub Operations Commands

## Use This When

- Use this for the shortest path to inspect GitHub auth, work items, and workflows.
- Prefer this file over inventing new `gh` commands during active incident or release work.

## Typical Sequence

1. Confirm GitHub auth.
2. Inspect the relevant issue or PR state.
3. Trigger or inspect the workflow.
4. Record the run ID before moving to runtime checks.

## Auth

```bash
gh auth login
gh auth status
```

## Issues and PRs

```bash
gh issue list --state open
gh pr list --state open
```

## Actions

```bash
gh workflow run deploy-sns-aws.yml --ref develop -f environment=staging
gh run list --workflow=deploy-sns-aws.yml --limit 5
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 27_GITHUB_OPERATIONS_COMMANDS
Scope: Issue #487 gather PR and workflow status for the sns release candidate
Outcome: Command set selected
Actions taken: chose commands for sns PR status, deploy-sns-aws.yml checks, and recent deployment history
Evidence: the sns release review needs repository state and CI results in one pass for Issue #487
Risks or blockers: stale local assumptions could mislead sns approval decisions
Next action: run the selected GitHub commands and attach outputs to the sns handoff for sns-reviewer and sns-approval-owner
```
