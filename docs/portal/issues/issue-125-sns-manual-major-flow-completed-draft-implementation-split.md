## Summary

Issue 118 で single current-issue paste-back dry-run の全体 shapeは fixed したが、completed manual major-flow draft 自体を comment-ready text block としてどう切り出すかは未固定のままである。このままだと completed draft の sample を実装着手単位として再利用しにくい。

## Goal

SNS manual major-flow completed draft implementation split を整理し、same issue path に貼り戻す completed draft text block を一つの implementation-preparation unit として固定する。

## Scope

- In scope: completed draft text block、same issue path rule、output completion rule、non-goals
- Out of scope: validation comment shape、incomplete fallback rule、actual manual execution、app changes

## Implementation Unit

- one implementation unit defines the completed manual major-flow draft text block
- completed draft remains separate from validation comment shape

## Completion Rule

- completed draft は same issue path を対象にした named results を含む
- one section でも欠ければ completed 扱いにしない

## Current Codebase Fit

- completed draft ownership in this branch belongs to the issue path itself rather than the app runtime
- current repository already uses [docs/portal/issues](docs/portal/issues) as the place where review-ready execution records and examples live
- there is no reusable template directory yet, so the first implementation-ready placement should remain adjacent to the dry-run issue chain

## Candidate Target Files

- primary source-of-truth candidate: [docs/portal/issues/issue-125-sns-manual-major-flow-completed-draft-implementation-split.md](docs/portal/issues/issue-125-sns-manual-major-flow-completed-draft-implementation-split.md)
- downstream consumer candidate: [docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md](docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md)
- future extracted completed-draft fragment candidate if reuse grows: `docs/portal/issues/templates/sns-manual-major-flow-completed-draft.md`

Target-file rule:

- keep completed draft text block owned by docs until there is repeated operator reuse across multiple execution issues
- do not move completed draft wording into app code or scripts, because it is review evidence rather than runtime behavior
- introduce a shared completed-draft fragment only after the same same-issue-path draft shape is reused more than once

## Placement Candidates

- first-fit placement candidate: keep completed draft example in the dry-run issue chain under [docs/portal/issues](docs/portal/issues)
- second candidate if repeated reuse appears: extract a completed-draft fragment under `docs/portal/issues/templates/`
- no package script candidate is needed at this layer

Placement rule:

- this issue should remain issue-record first, not app-runtime first
- completed draft ownership and fallback behavior ownership should remain separate so later execution issues can compose them independently
- no browser or Node CLI entry candidate is needed at this layer

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #125
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/125
- Sync Status: synced to GitHub as closed issue

## Dependencies

- docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md
