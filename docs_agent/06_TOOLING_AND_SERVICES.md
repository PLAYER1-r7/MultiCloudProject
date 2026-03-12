# Tooling and Services Baseline

## Required Tooling

- Git
- Python
- Node.js and npm
- Docker
- DNS query utilities (`dnsutils`, including `dig`)
- AWS CLI
- Azure CLI
- gcloud CLI
- Pulumi CLI
- GitHub CLI (`gh`)
- Project validation scripts: `./scripts/test-endpoints.sh` and `./scripts/test-e2e.sh`

## Required Platform Services

- GitHub Issues / PRs / Actions
- Branch protection and environment gates
- Cloud-native logs and monitoring
- Cloud-native identity services: Cognito, Azure AD, Firebase Auth

## Reference Priority

1. Pulumi outputs and deployed resource state
2. Workflow execution results and runtime logs
3. Existing scripts and validated runbooks
4. Narrative documentation

## Operating Rules

- Do not invent config values.
- Prefer existing scripts over manual sequences.
- Keep manual operations limited and reversible.

## Placement Rules

- Put cloud authentication architecture and operator auth expectations in `17_AUTH_REQUEST_PLAYBOOK.md`.
- Put app-specific operational tuning decisions, such as timeout increases, in `20_MANUAL_DEPLOY_DECISION_CRITERIA.md`.
- Put Issue label selection and normalization rules in `27_GITHUB_OPERATIONS_COMMANDS.md` rather than redefining them in task-specific notes.
- Keep product implementation details in `docs/`; only import stable decision rules or operating baselines here.

## PR Creation Helper

Use `scripts/create-pr.sh` as a thin wrapper around `gh pr create`.

- Prepare the PR body first using `05_PR_TASK_CONTRACT_TEMPLATE.md` or `docs_agent_ja/05_PR_TASK_CONTRACT_TEMPLATE.md`.
- Confirm the pre-PR checks in `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` or `docs_agent_ja/07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`.
- Store the final PR body in a temporary file such as `/tmp/pr-body.md`.
- Run `scripts/create-pr.sh --title "<title>" --body-file /tmp/pr-body.md`.
- This helper does not generate PR content, run tests, infer issue state, or replace the PR checklist. It only validates required inputs and forwards them to `gh pr create`.

## AI-Assisted PR Execution

Use AI assistance for PR preparation and execution when the work is primarily about scoping, summarizing, validating, or submitting already-reviewed changes.

- The agent may inspect diffs, summarize scope, prepare PR titles and bodies, create a branch, stage only intended files, create commits, push the branch, and open the PR.
- The agent may also prepare self-review notes, validation comments, merge-readiness checklists, and follow-up issue candidates.
- Final scope approval, merge decisions, review-feedback acceptance, production-risk judgment, and sufficiency of validation evidence remain human-owned decisions.
- If scope is clear and no destructive action is required, the agent should proceed through PR creation autonomously.
- If scope is ambiguous, if unrelated changes are mixed in, or if merge safety depends on a judgment call, the agent should stop and ask for confirmation.
- Expected PR output remains `Summary`, `What Changed`, and `Validation`.
- Non-goals: auto-merging without human approval, inventing validation that was not run, broadening PR scope without explicit approval, and replacing human judgment on release or operational risk.

## PR Review Remediation Loop

Use a fixed review-remediation loop when the agent is responding to PR comments.

- Re-fetch the latest PR reviews and inline review comments before each remediation pass; do not assume an earlier no-new-comments review is still current if a later review exists.
- If the current workspace branch is serving other work, prefer an isolated worktree under `/tmp/` for PR review remediation so fixes can be committed and pushed without mixing in unrelated changes.
- After each remediation pass, rerun the relevant validation, push the fixes first, and then add a PR comment that lists what was addressed and which checks were rerun.
- Request a fresh Copilot review only after the fix commit is published and the validation summary comment is posted.
- If the PR also changes issue records or status-tracking docs, re-check predecessor wording, closed/open labels, and status summaries against the current GitHub state before requesting re-review.

## Stacked PR Rule

When a docs-only or follow-up PR depends on unmerged changes from another branch, prefer a stacked PR over forcing a mixed or misleading diff against `main`.

- Keep the stacked PR base on the parent branch until the parent PR merges.
- Record the retarget condition in the PR notes, including when the base should be switched back to `main`.
- Do not restate the stacked PR as independent from `main` if the effective diff still depends on unmerged parent-branch file history.

## Quick Verification

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
dig -v | head -n 1
```
