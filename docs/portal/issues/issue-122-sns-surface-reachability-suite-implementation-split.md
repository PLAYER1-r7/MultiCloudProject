## Summary

Issue 116 で integration suite baseline は auth-post-readback major flow と surface reachability に分離できたが、SNS surface mount、entry link integrity、posting CTA reachability をどの repeatable suite implementation unit として切るかは未固定のままである。このままだと shared route/layout/loading change 時の reachability evidence が揺れやすい。

## Goal

SNS surface reachability suite implementation split を整理し、surface mount と CTA reachability を一貫した suite implementation unit として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-122
- Title: SNS surface reachability suite implementation split を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 116 (SNS major flow integration suite baseline)

Objective
- Problem to solve: surface reachability grouping は fixed したが、SNS surface mount、entry link integrity、posting CTA reachability をどの single suite implementation unit で実装するかが未固定である
- Expected value: shared route / layout / loading change 時に必要な reachability evidence を repeatable suite implementation issue へ落とせる

Scope
- In scope: surface reachability suite scope、coverage mapping、evidence shape、fallback direction、non-goals
- Out of scope: actual test code implementation、auth-post-readback suite implementation、CI wiring、contract command implementation
- Editable paths: docs/portal/issues/issue-122-sns-surface-reachability-suite-implementation-split.md, docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: surface reachability suite scope が読める
- [x] AC-2: surface mount、entry link integrity、CTA reachability coverage が読める
- [x] AC-3: evidence shape と fallback direction が整理されている
- [x] AC-4: actual test implementation を含まない split issue に留まっている
```

## Implementation Unit

- one suite unit covers SNS surface mount reachability
- the same unit covers entry link integrity and posting CTA reachability

Implementation rule:

- route registration、layout shell、shared loading 変更時に visibility/reachability evidence を同一系統で残せる unit とする
- shared route/layout/loading change ではこの unit を省略しない
- auth-post-readback major flow は本 issue に含めない

## Evidence Shape

- suite output for SNS surface mount reachability
- suite output for entry link integrity
- suite output for posting CTA reachability

## Current Codebase Fit

- current browser verification already runs from [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs) with Playwright declared in [apps/portal-web/package.json](apps/portal-web/package.json)
- current route and shell rendering are concentrated in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and the SNS browser path now uses dedicated `data-sns-surface`, `data-sns-entry-link`, `data-sns-posting-cta`, and `data-sns-posting-target` hooks on the `/status` route
- there is no dedicated UI integration suite directory yet, so first placement should match the existing script-based browser verification shape

## Implementation Snapshot

- implemented suite driver now exists at `apps/portal-web/scripts/verify-sns-surface-reachability.mjs`
- local preview runner now exists at `apps/portal-web/scripts/run-sns-surface-reachability.mjs`
- npm entrypoint now exists in [apps/portal-web/package.json](apps/portal-web/package.json) as `test:sns-surface-reachability`
- the root route now exposes an SNS entry link to `/status#sns-request-response-surface`, and the `/status` route now exposes a dedicated SNS surface plus posting CTA target in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- the first implementation pass now validates the dedicated SNS surface locally through build plus vite preview, rather than waiting for deployed hosts to pick up new selectors

## Candidate Target Files

- primary suite driver candidate: `apps/portal-web/scripts/verify-sns-surface-reachability.mjs`
- optional shared helper candidate if route/CTA selectors need reuse: `apps/portal-web/scripts/lib/sns-surface-reachability-helpers.mjs`
- app-side stable hook candidate for future selectors: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- package wiring candidate: [apps/portal-web/package.json](apps/portal-web/package.json)

Target-file rule:

- keep surface reachability orchestration in `apps/portal-web/scripts/` beside existing browser verification
- use [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) only for stable route-path, entry-link, or CTA markers when SNS surfaces exist
- do not merge SNS surface reachability into route metadata CLI output, because mount/reachability is a browser-facing concern

## Test Placement Candidates

- first-fit suite placement candidate: standalone Playwright-backed script under `apps/portal-web/scripts/`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-surface-reachability`
- evidence output candidate: stdout summary block that records mount reachability, entry-link integrity, and CTA visibility separately

Placement rule:

- keep this suite separate from `verify-public-variants.mjs` so host/variant verification and SNS surface reachability remain independently reviewable
- route mount, entry link, and CTA reachability should stay in one suite output even if helper files are introduced
- do not force a new browser test directory before the first SNS surface suite lands; current script placement is already consistent with the repository

## Preferred Suite Contract

- script file candidate: `apps/portal-web/scripts/verify-sns-surface-reachability.mjs`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-surface-reachability`
- first command shape candidate: `node ./scripts/verify-sns-surface-reachability.mjs`

Contract rule:

- the first implementation pass should reuse the same script-based Playwright pattern already used by `test:public-variants`
- if selector helpers grow, extract helper code before changing the visible command surface

## Expected Stdout Shape

preferred stdout shape should stay aligned with the current browser-verification markdown-table pattern.

```text
SNS surface reachability verification

| Target | Surface Mount | Entry Link | CTA Reachability | Result |
| --- | --- | --- | --- | --- |
| sns-entry | passed | passed | passed | passed |
```

Output rule:

- stdout should stay short, deterministic, and browser-suite specific
- failures should identify whether the break is mount, entry-link, or CTA reachability rather than collapsing into one generic failure line
- success output should still name each covered surface so this suite remains visibly narrower than the full auth-post-readback flow

## Exit And Failure Contract

- exit code `0` only when surface mount, entry-link integrity, and CTA reachability all pass
- exit code `1` when any one of those three surfaces fails
- partial evidence should not downgrade to warning-only success

Failure rule:

- a missing mount or unreachable CTA should fail closed even if the page shell still renders
- this suite should not absorb auth-post-readback coverage just to avoid failure; that remains Issue 121 scope

## Recommended Implementation Sequence

1. add only the minimum stable route-path, entry-link, or CTA markers needed on the render side of [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
2. create the standalone script entry under `apps/portal-web/scripts/` so it stays parallel to [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs)
3. lock the markdown-table style stdout contract before extracting any shared helper file
4. add the package script in [apps/portal-web/package.json](apps/portal-web/package.json) only after the script path and output contract are fixed

Sequence rule:

- first lock stable hooks and suite output, then lock helper extraction
- avoid merging surface reachability checks into the existing public-variants script just to get a script running faster

## Cross-Issue Execution Order

overall preferred execution order across the active SNS implementation chain is:

1. Issue 119
2. Issue 120
3. Issue 122
4. Issue 121

Order meaning:

- Issue 122 is the first browser-side execution target in the current chain
- this issue should start only after the contract-side command pattern is settled by Issue 119 and Issue 120, so browser evidence does not become the first place where contract drift is diagnosed
- this issue should complete before Issue 121 so selector stability, surface mount, and CTA reachability are proven in a narrower suite first
- if minimal SNS hooks are still unstable on the render side, this issue should resolve that narrower instability before full auth-post-readback flow work begins

## Fallback Direction

- surface reachability suite が未整備でも auth-post-readback suite へ吸収しない
- temporary narrower evidence を使う場合は落とした reachability coverage を明示する

## Non-Goals

- actual test code implementation
- auth-post-readback suite implementation
- CI workflow integration
- contract command implementation

## Current Status

- CLOSED
- GitHub Issue: #122
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/122
- Sync Status: synced to GitHub after local implementation snapshot refresh; closed after local browser-suite validation

- implemented in portal-web as a dedicated SNS surface reachability path with stable browser selectors
- validated locally with `npm run test:sns-surface-reachability`, `npm run test:routes`, and `npm run typecheck`
- local browser-suite implementation, validation, and GitHub body sync are complete; this issue is retained as the closed implementation reference

## Dependencies

- docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md
