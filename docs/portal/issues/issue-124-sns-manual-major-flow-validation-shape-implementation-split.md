## Summary

Issue 117 で operator-facing template に対応する validation shape は fixed したが、Reviewed Inputs Ready、Fixed Section Order Preserved、Single Issue Path Preserved などの validation fields を独立した implementation-preparation unit としてどう扱うかは未固定のままである。このままだと template 本体と validation comment の責務が将来の issue で混ざりやすい。

## Goal

SNS manual major-flow validation shape implementation split を整理し、validation fields と result labels を一つの implementation-preparation unit として固定する。

## Scope

- In scope: validation fields、result labels、validation rule、non-goals
- Out of scope: template section definition、completed dry-run drafting、actual manual execution、app changes

## Implementation Unit

- one implementation unit defines validation fields and result labels
- validation remains separate from the operator template body

## Validation Rule

- `pass` は required inputs and fixed section order が揃う場合だけ使う
- incomplete evidence は `fallback-to-incomplete-manual-check` へ戻す

## Current Codebase Fit

- validation shape in this branch is issue-comment oriented rather than app-runtime oriented
- current repository stores reviewable operational records under [docs/portal/issues](docs/portal/issues), so validation field ownership should stay in docs first
- there is no existing comment-template library, so the first implementation-ready placement should remain local to the issue chain that consumes it

## Candidate Target Files

- primary source-of-truth candidate: [docs/portal/issues/issue-124-sns-manual-major-flow-validation-shape-implementation-split.md](docs/portal/issues/issue-124-sns-manual-major-flow-validation-shape-implementation-split.md)
- downstream consumer candidate: [docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md](docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md)
- future extracted validation fragment candidate if reuse grows: `docs/portal/issues/templates/sns-manual-major-flow-validation-comment.md`

Target-file rule:

- keep validation field names and result labels owned by docs until a real execution issue needs a reusable comment fragment
- do not place validation shape into app code or package scripts because it is not a runtime concern
- introduce a shared validation fragment only after repeated execution-shaped issues need the same comment body structure

## Placement Candidates

- first-fit placement candidate: keep validation fields in the issue chain under [docs/portal/issues](docs/portal/issues)
- second candidate if comment reuse grows: extract a validation fragment under `docs/portal/issues/templates/`
- no app-side placement candidate is required at this layer

Placement rule:

- this issue should stay docs-first and comment-shape oriented
- validation shape and completed draft content should remain separate ownership units
- no package script or browser runner candidate is needed at this layer

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #124
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/124
- Sync Status: synced to GitHub as closed issue

## Dependencies

- docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md
