# GitHub Operations Commands

## Use This When

- Use this for the shortest path to inspect GitHub auth, work items, and workflows.
- Prefer this file over inventing new `gh` commands during active incident or release work.
- Use this when you need to add or normalize Issue labels without inventing ad hoc label rules.

## Typical Sequence

1. Confirm GitHub auth.
2. Inspect the relevant issue or PR state.
3. Confirm the label baseline before editing Issue metadata.
4. Trigger or inspect the workflow.
5. Record the run ID before moving to runtime checks.

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

## Issue Labeling Baseline

- Apply `portal` to portal-web implementation, portal docs, and portal governance Issues unless the scope is clearly outside the portal track.
- Apply `sns` to SNS-specific planning, implementation, regression, and operations Issues. Do not keep `portal` as the only app label when the issue is primarily about the SNS track.
- Apply `planning` to judgment, baseline, gate, decision, preparation, handoff, and memo Issues that fix scope, prerequisites, or non-goals.
- Apply `infrastructure` to IaC, resource execution, backend wiring, deploy surface, rollback implementation, recovery operations, and delivery-path Issues.
- Apply `cicd` to workflow, build, artifact, deploy automation, provenance, and release-evidence Issues.
- Apply `testing` to validation, reachability, alerting, monitoring checks, drill, and verification Issues when no dedicated monitoring label exists.
- Apply `security` to auth, certificate, WAF or Cloud Armor, credential governance, rotation, and security-baseline Issues.
- Apply `architecture` to architecture, topology, boundary, and design-structure Issues.
- Apply `documentation` to docs-only, process, summary, sync, cleanup, and operator-memo Issues.
- Apply `aws` only when the issue is specifically about the AWS path or AWS production governance. There is no dedicated GCP label, so label GCP Issues by function instead.
- Use only labels that are directly supported by the title, body, or canonical issue record. Do not add speculative labels just because adjacent Issues used them.

## Issue Labeling Commands

```bash
gh issue list --limit 100 --state all --json number,title,labels
gh issue create --title "..." --body-file docs/portal/issues/issue-XX.md --label planning --label portal
gh issue view <N> --json number,title,labels
gh issue edit <N> --add-label "portal" --add-label "planning"
gh issue edit <N> --remove-label "documentation"
```

## Issue Label Verification Rule

- Treat labels as part of Issue creation, not optional cleanup.
- After creating an Issue, verify its labels before moving to the next Issue.
- If an Issue is created without labels, correct it immediately instead of carrying unlabeled debt forward.
- If the current branch already contains `scripts/create-github-issue.sh`, you may use it to couple issue creation and label verification in one command. Otherwise, use `gh issue create` and verify labels immediately after creation.

```bash
gh issue view <N> --json number,title,labels
gh issue list --limit 200 --state all --json number,title,labels --jq '.[] | select((.labels | length) == 0) | [.number, .title] | @tsv'
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
