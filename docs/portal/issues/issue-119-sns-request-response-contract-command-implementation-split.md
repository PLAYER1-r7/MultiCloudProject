## Summary

Issue 115 で contract regression command baseline は request-response compatibility と auth-error mapping に分離できたが、request shape、validation rejection、timeline read response shape を 1 つの repeatable implementation unit としてどう切るかは未固定のままである。このままだと shared API wrapper や response mapping 変更時に request/response evidence の実装粒度が揺れやすい。

## Goal

SNS request-response contract command implementation split を整理し、post request shape、invalid payload validation、timeline read response mapping を一貫した command implementation unit として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-119
- Title: SNS request-response contract command implementation split を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 115 (baseline; closed)

Objective
- Problem to solve: request-response compatibility grouping は fixed したが、post request shape、invalid payload validation、timeline read response mapping をどの single implementation unit で実装するかが未固定である
- Expected value: shared API / response mapping change 時に必要な request-response contract evidence を repeatable command implementation issue へ落とせる

Scope
- In scope: request-response command scope、target-to-command mapping、evidence shape、fallback direction、non-goals
- Out of scope: actual test code implementation、auth-error mapping implementation、CI wiring、integration suite implementation
- Editable paths: docs/portal/issues/issue-119-sns-request-response-contract-command-implementation-split.md, docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: request-response command scope が読める
- [x] AC-2: request shape、invalid payload validation、timeline read response mapping の coverage が読める
- [x] AC-3: evidence shape と fallback direction が整理されている
- [x] AC-4: actual test implementation を含まない split issue に留まっている
```

## Implementation Unit

- one command unit covers post request shape compatibility
- the same unit covers invalid payload rejection behavior
- the same unit covers timeline read response mapping compatibility

Implementation rule:

- request writer and read mapper evidence を 1 系統で残せる unit とする
- shared API wrapper change ではこの unit を省略しない
- auth boundary や write-failure visibility は本 issueに含めない

## Evidence Shape

- command output for request shape compatibility
- command output for invalid payload rejection
- command output for timeline read response mapping

## Current Codebase Fit

- current portal-web has no dedicated test directory and keeps the existing repeatable CLI validation in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- current command wiring is declared in [apps/portal-web/package.json](apps/portal-web/package.json) via `test:routes` and `test:baseline`
- browser-oriented verification already lives separately in [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs), so request/response contract work should stay on the non-browser CLI side first

## Candidate Target Files

- primary support-module candidate: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- preferred extraction candidate once SNS contract logic exists: `apps/portal-web/src/sns-request-response-contract.ts`
- package wiring candidate: [apps/portal-web/package.json](apps/portal-web/package.json)

Target-file rule:

- do not grow browser rendering concerns and request/response contract concerns inside one long block in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- use [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) only as temporary CLI glue if a dedicated SNS contract module is introduced
- keep package script wiring in [apps/portal-web/package.json](apps/portal-web/package.json) rather than hiding command entry behind ad hoc shell snippets

## Test Placement Candidates

- first-fit command entry candidate: extend [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) with a dedicated CLI flag that calls an extracted request/response validator
- second candidate if CLI branching in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) grows too large: `apps/portal-web/src/sns-request-response-contract-cli.ts`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-request-response-contract`

Placement rule:

- this issue should start from the existing Node plus `--experimental-strip-types` pattern before introducing a new browser runner
- stdout evidence should remain shaped like the current route validation report style so it can sit beside `test:baseline`
- do not place request/response contract evidence under `scripts/verify-public-variants.mjs`; that file is already browser-host verification specific

## Preferred Command Contract

- CLI flag candidate: `--validate-sns-request-response-contract`
- npm script candidate in [apps/portal-web/package.json](apps/portal-web/package.json): `test:sns-request-response-contract`
- first command shape candidate: `node --experimental-strip-types ./src/main.ts --validate-sns-request-response-contract`

Contract rule:

- the first implementation pass should reuse the same Node invocation pattern already used by `test:routes`
- if the command outgrows [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), move the validator body first and keep the CLI surface stable

## Expected Stdout Shape

preferred stdout shape should stay aligned with the existing route validation report style.

```text
SNS request-response contract baseline
- Command: validate-sns-request-response-contract
- Request shape compatibility: passed | failed
- Invalid payload rejection: passed | failed
- Timeline read response mapping: passed | failed
- Result: passed | failed
- Issues: none | detailed issue list
```

Output rule:

- stdout should be short, deterministic, and readable beside the current route validation report
- failures should enumerate concrete issue lines rather than broad `contract failed` wording
- success output should still mention each covered surface so request shape, invalid payload rejection, and read response mapping remain visibly in scope

## Exit And Failure Contract

- exit code `0` only when all three surfaces pass
- exit code `1` when request shape compatibility, invalid payload rejection behavior, or timeline read response mapping fails
- partial evidence should not downgrade to warning-only success

Failure rule:

- unresolved request shape or response mapping gaps should fail closed rather than emitting best-effort success
- this command should not absorb auth/error coverage just to avoid failure; that remains Issue 120 scope

## Recommended Implementation Sequence

1. add a stable CLI flag branch in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) that is parallel to `--validate-routes` rather than mixed into browser runtime logic
2. define a report-builder function that mirrors the current `buildRouteValidationReport` style before extracting SNS-specific helper code
3. extract request and response contract checks into a dedicated support module once the report shape is stable enough to preserve
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

- Issue 119 is the first execution entry point because it establishes the narrowest CLI-oriented command surface and stdout contract
- Issue 120 should follow on the same CLI path only after Issue 119 fixes the command-entry and report-shape pattern
- browser suites should not start before the contract-side command pattern is established
- this issue is not blocked by the browser-side chain and should be treated as the first active implementation target

## Fallback Direction

- request-response command が未整備でも auth-error command へ吸収しない
- temporary broader evidence を使う場合は request/response coverage を代替したことを明示する

## Non-Goals

- actual test code implementation
- auth-error mapping implementation
- CI workflow integration
- integration suite implementation

## Resolution

- Added the request-response contract validator entry on the existing Node CLI path in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) and kept the command surface fixed as `--validate-sns-request-response-contract`
- Added the dedicated validator/report module in [apps/portal-web/src/snsRequestResponseContract.ts](apps/portal-web/src/snsRequestResponseContract.ts) and shared support in [apps/portal-web/src/snsContractShared.ts](apps/portal-web/src/snsContractShared.ts)
- Added package wiring in [apps/portal-web/package.json](apps/portal-web/package.json) as `test:sns-request-response-contract`
- Validation result: `node --experimental-strip-types ./src/main.ts --validate-sns-request-response-contract` returned passed for request shape compatibility, invalid payload rejection, and timeline read response mapping

## Current Status

- CLOSED
- GitHub Issue: #119
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/119
- Sync Status: local body updated for closure sync

## Dependencies

- docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md
