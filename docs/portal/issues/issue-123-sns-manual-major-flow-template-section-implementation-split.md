## Summary

Issue 117 で operator-facing single-record template の全体 shape は fixed したが、Change Context から Overall Judgment までの fixed section order を実装着手可能な section-definition unit としてどう切るかは未固定のままである。このままだと route/auth/post/readback/shared primitive の section wording が将来の execution issue ごとに揺れやすい。

## Goal

SNS manual major-flow template section implementation split を整理し、fixed section order と required section content を一つの implementation-preparation unit として固定する。

## Scope

- In scope: fixed section order、required section content、section completion rule、non-goals
- Out of scope: validation comment shape、completed dry-run drafting、actual manual execution、app changes

## Implementation Unit

- one implementation unit defines Change Context through Overall Judgment
- route/auth/post/readback/shared primitive sections remain in one ordered template set

## Section Completion Rule

- one section でも unnamed result があれば complete 扱いにしない
- broad summary だけで section を置き換えない

## Current Codebase Fit

- current portal-web application logic is concentrated in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), but this issue is about operator-facing record structure rather than browser execution
- current repository already keeps operational review records under [docs/portal/issues](docs/portal/issues), so section-definition ownership should stay in docs first
- no dedicated checklist or template directory exists yet, so the first implementation-ready placement should remain close to the issue chain that consumes it

## Candidate Target Files

- primary source-of-truth candidate: [docs/portal/issues/issue-123-sns-manual-major-flow-template-section-implementation-split.md](docs/portal/issues/issue-123-sns-manual-major-flow-template-section-implementation-split.md)
- downstream consumer candidate: [docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md](docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md)
- future extracted template fragment candidate if reuse grows: `docs/portal/issues/templates/sns-manual-major-flow-template.md`
- app-side stable hook candidate only when SNS UI exists: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)

Target-file rule:

- keep section wording owned by docs until there is an actual SNS UI surface that needs stable selectors or route markers
- do not move section definition into app code just because future manual checks may reference UI elements
- introduce a shared template fragment file only after at least two execution-shaped issues need the same fixed section order

## Placement Candidates

- first-fit placement candidate: keep fixed section order in the issue chain under [docs/portal/issues](docs/portal/issues)
- second candidate if section reuse grows: add a dedicated template fragment under `docs/portal/issues/templates/`
- future app-touch candidate: add stable data markers in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) only when SNS surfaces exist and manual checks need selector stability

Placement rule:

- this issue should stay docs-first and not create app-side implementation pressure before SNS UI exists
- section-definition ownership and browser-facing selector ownership should remain separate concerns
- no package script or browser runner candidate is needed at this layer

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #123
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/123
- Sync Status: synced to GitHub as closed issue

## Dependencies

- docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md
