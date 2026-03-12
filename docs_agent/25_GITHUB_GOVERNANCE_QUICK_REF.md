# GitHub Governance Quick Reference

## Use This When

- Use this before changing branch protection expectations, merge flow, or enforcement assumptions.
- Use it when a deployment behaves differently from what branch policy should allow.
- If the task also includes normalizing Issue labels, use `27_GITHUB_OPERATIONS_COMMANDS.md` for the label baseline and `gh issue edit` command pattern.

## Execution Pattern

1. Confirm the target branch.
2. Verify the expected protection baseline.
3. Run the verification command before concluding governance drift exists.

## Branch Protection Baseline

- `main`: PR required, approval required, force push blocked.
- `develop`: PR required, force push blocked.

## Verification

```bash
curl -s -H "Authorization: token $(gh auth token)" \
  "https://api.github.com/repos/PLAYER1-r7/multicloud-auto-deploy/branches/main/protection" | jq .
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 25_GITHUB_GOVERNANCE_QUICK_REF
Scope: Issue #487 check governance path for sns production hotfix PR
Outcome: Governance path confirmed
Actions taken: verified branch protection, reviewer expectations, and required approval flow for the sns release PR tied to deploy-sns-aws.yml
Evidence: target branch is protected and sns production environment approval is required for Issue #487
Risks or blockers: the sns merge remains blocked until required reviewers respond
Next action: request the correct sns reviewers and confirm sns-approval-owner before attempting release
```
