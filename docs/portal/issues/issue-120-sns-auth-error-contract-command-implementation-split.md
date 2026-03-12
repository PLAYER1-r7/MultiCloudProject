## Summary

Issue 115 で contract regression command baseline は request-response compatibility と auth-error mapping に分離できたが、guest/member/operator permission mapping と write-failure error visibility を 1 つの repeatable implementation unit としてどう切るかは未固定のままである。このままだと shared auth abstraction や error mapping 変更時に auth/error evidence の実装粒度が揺れやすい。

## Goal

SNS auth-error contract command implementation split を整理し、auth-to-post permission mapping と write failure error visibility を一貫した command implementation unit として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-120
- Title: SNS auth-error contract command implementation split を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 115 (baseline; closed)

Objective
- Problem to solve: auth-error mapping grouping は fixed したが、permission boundary と write failure visibility をどの single implementation unit で実装するかが未固定である
- Expected value: shared auth / error mapping change 時に必要な auth-error contract evidence を repeatable command implementation issue へ落とせる

Scope
- In scope: auth-error command scope、target-to-command mapping、evidence shape、fallback direction、non-goals
- Out of scope: actual test code implementation、request-response command implementation、CI wiring、integration suite implementation
- Editable paths: docs/portal/issues/issue-120-sns-auth-error-contract-command-implementation-split.md, docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: auth-error command scope が読める
- [x] AC-2: guest/member/operator permission mapping と write failure visibility coverage が読める
- [x] AC-3: evidence shape と fallback direction が整理されている
- [x] AC-4: actual test implementation を含まない split issue に留まっている
```

## Implementation Unit

- one command unit covers guest/member/operator auth-to-post mapping
- the same unit covers write failure error visibility to SNS client surface

Implementation rule:

- auth boundary drift と silent failure drift を同一 evidence 系統で残せる unit とする
- shared auth abstraction or error mapping change ではこの unit を省略しない
- request/response schema compatibility は本 issue に含めない

## Evidence Shape

- command output for guest/member/operator permission mapping
- command output for write failure error visibility

## Current Codebase Fit

- current portal-web keeps repeatable CLI validation in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) and script wiring in [apps/portal-web/package.json](apps/portal-web/package.json)
- there is no dedicated auth policy or error mapping module yet, so auth/error command placement should be explicit before implementation starts
- browser verification already has a separate home in [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs), which is not the right place for permission and error contract checks

## Candidate Target Files

- primary support-module candidate: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- preferred extraction candidate once SNS auth/error contract logic exists: `apps/portal-web/src/sns-auth-error-contract.ts`
- package wiring candidate: [apps/portal-web/package.json](apps/portal-web/package.json)

Target-file rule:

- keep guest/member/operator mapping and write-failure visibility in one contract-oriented unit
- use [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) only as temporary CLI entry if a dedicated auth/error contract module is introduced
- avoid coupling auth/error contract checks to browser runtime files or public variant scripts

## Test Placement Candidates

- first-fit command entry candidate: extend [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) with a dedicated CLI flag for auth/error contract validation
- second candidate if command entry needs isolation: `apps/portal-web/src/sns-auth-error-contract-cli.ts`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-auth-error-contract`

Placement rule:

- this issue should follow the same Node CLI pattern already used by `test:routes`
- stdout evidence should remain command-oriented and not depend on browser rendering
- do not merge auth/error contract evidence into request/response command output unless a higher-level baseline issue explicitly asks for that combination

## Preferred Command Contract

- CLI flag candidate: `--validate-sns-auth-error-contract`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-auth-error-contract`
- first command shape candidate: `node --experimental-strip-types ./src/main.ts --validate-sns-auth-error-contract`

Contract rule:

- the first implementation pass should reuse the same Node invocation pattern already used by `test:routes`
- if the command body outgrows [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), move validator logic first and keep the CLI surface stable

## Expected Stdout Shape

preferred stdout shape should stay aligned with the existing route validation report style.

```text
SNS auth-error contract baseline
- Command: validate-sns-auth-error-contract
- Guest/member/operator permission mapping: passed | failed
- Write failure error visibility: passed | failed
- Result: passed | failed
- Issues: none | detailed issue list
```

Output rule:

- stdout should be short, deterministic, and readable beside the current route validation report
- failures should enumerate concrete issue lines rather than broad `auth-error contract failed` wording
- success output should still mention both covered surfaces so permission mapping and error visibility remain visibly in scope

## Exit And Failure Contract

- exit code `0` only when permission mapping and write-failure visibility both pass
- exit code `1` when guest/member/operator permission behavior or write-failure visibility fails
- partial evidence should not downgrade to warning-only success

Failure rule:

- silent write-failure handling should fail closed rather than being treated as a soft regression
- this command should not absorb request/response coverage just to avoid failure; that remains Issue 119 scope

## Recommended Implementation Sequence

1. add a stable CLI flag branch in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) that is parallel to `--validate-routes` rather than mixed into browser runtime logic
2. define a report-builder function whose output shape stays parallel to the current route validation report before extracting SNS-specific helper code
3. extract auth and error contract checks into a dedicated support module once the report shape is stable enough to preserve
4. add the package script in [apps/portal-web/package.json](apps/portal-web/package.json) only after the CLI flag and stdout contract are fixed

Sequence rule:

- first lock the command surface and report shape, then lock helper extraction
- avoid starting with package-script naming alone before the CLI branch and output contract are settled

## Cross-Issue Execution Order

overall preferred execution order across the active SNS implementation chain is:

1. Issue 119
2. Issue 120
3. Issue 122
4. Issue 121

Order meaning:

- Issue 120 is the second execution target and should reuse the CLI branch, package-script shape, and stdout contract pattern established by Issue 119
- this issue should not start before Issue 119 settles the first SNS command-entry pattern on the non-browser side
- this issue should still complete before browser suites begin, so auth/error contract drift is not hidden behind browser-only evidence
- if Issue 119 changes command-surface naming or report format, this issue should follow the stabilized pattern rather than inventing a parallel one

## Fallback Direction

- auth-error command が未整備でも request-response command へ吸収しない
- temporary broader evidence を使う場合は auth/error coverage を代替したことを明示する

## Non-Goals

- actual test code implementation
- request-response command implementation
- CI workflow integration
- integration suite implementation

## Current Status

- OPEN
- GitHub Issue: #120
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/120
- Sync Status: synced to GitHub as open issue

## Dependencies

- docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md
