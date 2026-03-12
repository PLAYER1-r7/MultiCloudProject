# GitHub Issue Workflow In Devcontainer

## Purpose

This document defines the standard GitHub CLI workflow for creating and managing portal planning issues from inside the devcontainer.

## Prerequisites

- The workspace is opened in the devcontainer
- GitHub CLI is installed in the container
- The repository is available locally
- The user has permission to create issues in the target repository

## 1. Verify GitHub authentication

Run the following first.

```bash
gh auth status
```

If not authenticated, log in.

```bash
gh auth login
```

Recommended choices:

- GitHub.com
- HTTPS
- Login with a browser

## 2. Confirm the repository target

Check which repository gh will use.

```bash
gh repo view
```

If needed, explicitly set the target repository for later commands.

```bash
gh repo set-default <owner>/<repo>
```

Expected result:

- issue creation commands run against the intended repository

## 3. Create issues from prepared text

The safest pattern is to prepare the issue body in a markdown file and pass it to gh.

Preferred repository wrapper:

```bash
scripts/create-github-issue.sh \
  --title "新規ポータルのプロダクト定義を確定する" \
  --body-file docs/portal/issues/issue-01-product-definition.md \
  --label planning \
  --label portal
```

Example:

```bash
gh issue create \
  --title "新規ポータルのプロダクト定義を確定する" \
  --body-file docs/portal/issues/issue-01-product-definition.md
```

Advantages:

- the issue text is reviewable before submission
- the same content can be reused later
- large issue bodies are easier to edit in files than on the command line

## 4. Recommended local issue file layout

Use this directory structure when you begin creating issue body files.

```text
docs/
  portal/
    issues/
      issue-01-product-definition.md
      issue-02-mvp-scope.md
      issue-03-auth-decision.md
```

## 5. Create all planning issues in order

Recommended order:

1. product definition
2. MVP scope
3. auth decision
4. AWS architecture
5. app boundary
6. frontend technical choice
7. backend and persistence decision
8. multi-cloud design constraints
9. IaC policy
10. CI/CD policy
11. security baseline
12. monitoring policy
13. test strategy
14. rollback policy
15. implementation backlog

## 6. Labels are required during creation in this repository

Use the repository wrapper when possible so creation and label verification stay in one command.

Example:

```bash
scripts/create-github-issue.sh \
  --title "MVP スコープを確定する" \
  --body-file docs/portal/issues/issue-02-mvp-scope.md \
  --label planning \
  --label portal
```

Only use labels that actually exist in the repository.

Check available labels if needed.

```bash
gh label list
```

Immediately verify the created issue has labels.

```bash
gh issue view <issue-number> --json number,title,labels
```

If labels are missing, fix them immediately instead of leaving a follow-up.

```bash
gh issue edit <issue-number> --add-label planning --add-label portal
```

Repository rule:

- do not leave a newly created issue unlabeled, even temporarily
- the issue body file and the label set should be treated as part of the same creation step
- if label selection is unclear, stop and resolve it before moving to the next issue

## 7. Link issues after creation

After creating issues, inspect the list and capture issue numbers.

```bash
gh issue list --limit 30
```

Then update dependent issues with references in the body or comments.

```bash
gh issue comment <issue-number> --body "Depends on #<other-issue-number>."
```

## 8. View issue details

Use these commands during planning work.

```bash
gh issue view <issue-number>
gh issue list --state open --limit 30
```

## 9. Update issue body after creation

If the issue body needs revision, the repository copy under `docs/portal/issues/` remains the source of truth and GitHub should be synchronized from that file.

Example:

```bash
gh issue edit <issue-number> --body-file docs/portal/issues/issue-XX-example.md
```

Use comments only for progress notes or supplemental discussion that should not replace the canonical checklist body.

## 10. Close issue only after checklist sync

Use this closure sequence whenever an issue uses Tasks or Definition of Done checklists.

1. update the decision draft or implementation artifact that proves completion
2. update the matching file under `docs/portal/issues/`
3. verify every required checkbox in that local issue file is checked
4. sync the GitHub Issue body from the local file with `gh issue edit --body-file ...`
5. verify the GitHub Issue body now shows the checked boxes
6. close the GitHub Issue

Required rule:

- do not close a GitHub Issue while its GitHub checklist body still shows unchecked items that are meant to be complete
- comments are not a substitute for synchronized checklist state
- if closure depends on a separate draft document, add a short `Resolution` section in the issue body that points to the deciding file

Example:

```bash
gh issue edit 1 \
  --repo <owner>/<repo> \
  --body-file docs/portal/issues/issue-01-product-definition.md

gh issue view 1 --repo <owner>/<repo>

gh issue close 1 --repo <owner>/<repo>
```

## 11. Minimum workflow for this repository

Use this sequence as the default path.

1. run GitHub authentication check
2. confirm the target repository
3. prepare issue body files under docs/portal/issues
4. create issues in the agreed order with required labels
5. verify each created issue has labels before moving on
6. list created issues and record their numbers
7. keep the local issue file updated as the canonical checklist copy
8. sync the GitHub Issue body before closing any checklist-driven issue
9. add dependency comments where helpful

Recommended no-label sweep command:

```bash
gh issue list --state all --json number,title,labels \
  | jq -r '.[] | select((.labels | length) == 0) | [.number, .title] | @tsv'
```

## Example Session

```bash
gh auth status
gh repo view
mkdir -p docs/portal/issues
scripts/create-github-issue.sh \
  --title "新規ポータルのプロダクト定義を確定する" \
  --body-file docs/portal/issues/issue-01-product-definition.md \
  --label planning \
  --label portal
gh issue list --limit 30
```

## Notes

- Keep issue text in files when possible
- Create planning issues before implementation issues
- Prefer explicit titles over short ambiguous names
- Do not assume labels, projects, or milestones already exist
