## Summary

Issue 118 で incomplete fallback の基本 rule は fixed したが、required inputs missing、section order 崩れ、same issue path mismatch をどう fallback result と validation result に落とすかは未固定のままである。このままだと manual fallback failure の扱いが issue ごとに揺れやすい。

## Goal

SNS incomplete manual check fallback implementation split を整理し、incomplete fallback conditions と resulting validation behavior を一つの implementation-preparation unit として固定する。

## Scope

- In scope: incomplete fallback conditions、result behavior、same issue path mismatch handling、non-goals
- Out of scope: completed draft definition、template section definition、actual manual execution、app changes

## Implementation Unit

- one implementation unit defines incomplete fallback conditions and result behavior
- fallback remains separate from completed draft content

## Fallback Rule

- missing required inputs, broken section order, or issue path mismatch all return incomplete fallback
- incomplete fallback never upgrades to pass by summary-only wording

## Current Codebase Fit

- incomplete fallback behavior in this branch is review-record logic rather than app-runtime logic
- current repository keeps such review-record logic under [docs/portal/issues](docs/portal/issues), not in application code or package scripts
- there is no existing fallback-rule library, so first placement should stay inside the issue chain that owns the manual fallback path

## Candidate Target Files

- primary source-of-truth candidate: [docs/portal/issues/issue-126-sns-incomplete-manual-check-fallback-implementation-split.md](docs/portal/issues/issue-126-sns-incomplete-manual-check-fallback-implementation-split.md)
- downstream consumer candidate: [docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md](docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md)
- future extracted fallback fragment candidate if reuse grows: `docs/portal/issues/templates/sns-incomplete-manual-check-fallback.md`

Target-file rule:

- keep incomplete fallback conditions owned by docs until repeated execution issues need the same fallback wording and result mapping
- do not move fallback behavior into app code or automation scripts, because this branch is about human-reviewed issue-path discipline
- introduce a shared fallback fragment only after the same incomplete rule is reused across multiple execution-shaped issues

## Placement Candidates

- first-fit placement candidate: keep fallback behavior in the dry-run issue chain under [docs/portal/issues](docs/portal/issues)
- second candidate if repeated reuse appears: extract a fallback fragment under `docs/portal/issues/templates/`
- no app-side or package-script placement candidate is needed at this layer

Placement rule:

- this issue should remain docs-first and fallback-rule oriented
- fallback ownership and completed draft ownership should stay separate so execution issues can combine them without collapsing responsibilities
- no browser or Node CLI entry candidate is needed at this layer

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #126
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/126
- Sync Status: synced to GitHub as closed issue

## Dependencies

- docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md
