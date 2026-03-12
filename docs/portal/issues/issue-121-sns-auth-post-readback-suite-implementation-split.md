## Summary

Issue 116 で integration suite baseline は auth-post-readback major flow と surface reachability に分離できたが、signed-out blocked、signed-in valid post、success readback、failure visibility の 4 状態をどの repeatable suite implementation unit として切るかは未固定のままである。このままだと shared auth/state/submit-state change 時の integration evidence が揺れやすい。

## Goal

SNS auth-post-readback suite implementation split を整理し、SNS major flow の 4 状態を一貫した suite implementation unit として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-121
- Title: SNS auth-post-readback suite implementation split を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 116 (closed baseline reference)

Objective
- Problem to solve: auth-post-readback grouping は fixed したが、signed-out blocked、signed-in post success、failure visibility、readback consistency をどの single suite implementation unit で実装するかが未固定である
- Expected value: shared auth / state / submit-state change 時に必要な major-flow evidence を repeatable suite implementation issue へ落とせる

Scope
- In scope: auth-post-readback suite scope、state coverage mapping、evidence shape、fallback direction、non-goals
- Out of scope: actual test code implementation、surface reachability suite implementation、CI wiring、contract command implementation
- Editable paths: docs/portal/issues/issue-121-sns-auth-post-readback-suite-implementation-split.md, docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: auth-post-readback suite scope が読める
- [x] AC-2: blocked/success/failure/readback coverage が読める
- [x] AC-3: evidence shape と fallback direction が整理されている
- [x] AC-4: actual test implementation を含まない split issue に留まっている
```

## Implementation Unit

- one suite unit covers signed-out blocked post flow
- the same unit covers signed-in valid post flow
- the same unit covers success readback and failure visibility

Implementation rule:

- auth state transition、post success、post failure、readback consistency を同一 major-flow evidence 系統で残せる unit とする
- shared auth/state/submit-state change ではこの unit を省略しない
- surface mount and CTA reachability は本 issue に含めない

## Evidence Shape

- suite output for signed-out blocked flow
- suite output for signed-in success flow
- suite output for failure visibility and readback consistency

## Current Codebase Fit

- current portal-web already carries a browser automation dependency through Playwright in [apps/portal-web/package.json](apps/portal-web/package.json)
- the existing browser-oriented verification path lives in [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs)
- current app rendering and route metadata still live primarily in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and the SNS browser flow now uses dedicated `data-sns-*` hooks on the `/status` route instead of generic route metadata only

## Implementation Snapshot

- implemented suite driver now exists at `apps/portal-web/scripts/verify-sns-auth-post-readback.mjs`
- local preview runner now exists at `apps/portal-web/scripts/run-sns-auth-post-readback.mjs`
- npm entrypoint now exists in [apps/portal-web/package.json](apps/portal-web/package.json) as `test:sns-auth-post-readback`
- the `/status` route now exposes a local interactive SNS demo surface in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) covering signed-out blocked, signed-in success, failure visibility, and readback consistency
- the first implementation pass remains local-preview-scoped and review-only for browser flow evidence; it does not introduce real SNS backend integration, persistent auth, or production write execution

## Candidate Target Files

- primary suite driver candidate: `apps/portal-web/scripts/verify-sns-auth-post-readback.mjs`
- optional shared helper candidate if selector logic grows: `apps/portal-web/scripts/lib/sns-auth-post-readback-helpers.mjs`
- app-side stable hook candidate for future selectors: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- package wiring candidate: [apps/portal-web/package.json](apps/portal-web/package.json)

Target-file rule:

- keep browser flow orchestration in `apps/portal-web/scripts/` where browser verification already exists
- touch [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) only to add stable, implementation-owned data hooks when SNS surfaces are introduced
- avoid placing major-flow browser logic inside Node CLI validation paths that currently serve route metadata checks

## Test Placement Candidates

- first-fit suite placement candidate: standalone Playwright-backed script under `apps/portal-web/scripts/`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-auth-post-readback`
- evidence output candidate: stdout summary block aligned with the current `verify-public-variants.mjs` markdown-table style, but scoped to SNS flow states

Placement rule:

- keep auth-post-readback suite separate from `verify-public-variants.mjs` so host-variant checks and SNS major-flow checks do not drift into one broad script
- signed-out, signed-in success, failure, and readback evidence should remain in one suite output even if helper modules are split
- do not require a new test directory before the first browser suite lands; current `scripts/` placement is the most repository-consistent entry point

## Preferred Suite Contract

- script file candidate: `apps/portal-web/scripts/verify-sns-auth-post-readback.mjs`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-auth-post-readback`
- first command shape candidate: `node ./scripts/verify-sns-auth-post-readback.mjs`

Contract rule:

- the first implementation pass should reuse the same script-based Playwright pattern already used by `test:public-variants`
- if helper complexity grows, extract helper code before changing the visible command surface

## Expected Stdout Shape

preferred stdout shape should stay aligned with the current browser-verification markdown-table pattern.

```text
SNS auth-post-readback verification

| Flow State | Result | Note |
| --- | --- | --- |
| signed-out blocked | passed | expected block preserved |
| signed-in post success | passed | submit path completed |
| failure visibility | passed | error state visible |
| readback consistency | passed | expected readback reached |
```

Output rule:

- stdout should stay short, deterministic, and suite-specific
- failures should identify whether the break is blocked flow, success flow, failure visibility, or readback consistency rather than collapsing into one generic suite failure
- success output should still list all four states so this suite remains visibly broader than Issue 122 but narrower than any future broad E2E pack

## Exit And Failure Contract

- exit code `0` only when blocked flow, success flow, failure visibility, and readback consistency all pass
- exit code `1` when any one of those four states fails
- partial evidence should not downgrade to warning-only success

Failure rule:

- if the suite can mount SNS but cannot complete one of the four states, it should still fail closed
- this suite should not absorb surface reachability coverage just to avoid failure; that remains Issue 122 scope

## Recommended Implementation Sequence

1. rely on the stable route, surface, and CTA hooks proven by the lighter reachability path before adding full auth-post-readback orchestration
2. add only the minimum additional SNS selectors or state markers needed on the render side of [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
3. create the standalone script entry under `apps/portal-web/scripts/` so it stays parallel to [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs) and separate from Issue 122 scope
4. lock the markdown-table style stdout contract before extracting any shared helper file
5. add the package script in [apps/portal-web/package.json](apps/portal-web/package.json) only after the script path and output contract are fixed

Sequence rule:

- first depend on stable reachability hooks, then add full major-flow assertions
- avoid merging auth-post-readback flow into either the public-variants script or the lighter surface reachability script just to move faster

## Cross-Issue Execution Order

overall preferred execution order across the active SNS implementation chain is:

1. Issue 119
2. Issue 120
3. Issue 122
4. Issue 121

Order meaning:

- Issue 121 is the last execution target in the current chain
- this issue should start only after Issue 122 proves that the SNS surface mount, entry path, and CTA reachability are stable enough for broader browser flow assertions
- this issue also benefits from contract-side command work in Issue 119 and Issue 120 already fixing request/response and auth/error baseline expectations
- if browser-side selectors or route hooks are still shifting during Issue 122, this issue should wait rather than becoming the place where reachability and major-flow breakage are debugged together

## Fallback Direction

- auth-post-readback suite が未整備でも surface reachability suite へ吸収しない
- temporary narrower evidence を使う場合は落とした state coverage を明示する

## Non-Goals

- actual test code implementation
- surface reachability suite implementation
- CI workflow integration
- contract command implementation

## Current Status

- CLOSED
- GitHub Issue: #121
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/121
- Sync Status: synced to GitHub after local implementation snapshot refresh; closed after local browser-suite validation

- implemented in portal-web as a local Playwright-backed suite and local SNS demo surface
- validated locally with `npm run test:sns-auth-post-readback`, `npm run test:sns-surface-reachability`, `npm run test:routes`, and `npm run typecheck`
- local browser-suite implementation, validation, and GitHub body sync are complete; this issue is retained as the closed implementation reference

## Dependencies

- docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md
