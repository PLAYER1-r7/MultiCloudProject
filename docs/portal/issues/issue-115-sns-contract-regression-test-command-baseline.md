## Summary

Issue 113 で SNS automated regression gate の contract test target は fixed できたが、post request shape、timeline read response shape、auth-to-post permission mapping、write failure error mapping をどの command unit と evidence shape で repeatable に実装へ落とすかは未分解のままである。このままだと shared auth / API wrapper 変更時に contract coverage の実装粒度が issue ごとに揺れ、automated gate の最小 command が固定されにくい。

## Goal

SNS contract regression test command baseline を整理し、shared-layer change 時に最低限要求する contract-oriented test command、target grouping、evidence path、fallback direction を reviewable な implementation-preparation issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-115
- Title: SNS contract regression test command baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 113 open

Objective
- Problem to solve: contract test target は fixed したが、API request/response、auth-to-post mapping、error mapping をどの repeatable command unit で実装へ落とすかが未固定のため、shared-layer change 時の automated evidence が安定しない
- Expected value: SNS contract regression gate を command-oriented な最小 implementation unit に分解し、後続 issue が test target と evidence path を再議論せずに進められる

Scope
- In scope: contract-oriented command grouping、minimum target mapping、evidence path、fallback direction、non-goals
- Out of scope: actual test code implementation、specific framework adoption、CI workflow wiring、integration suite implementation、manual check procedure
- Editable paths: docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md, docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: contract regression を要求する minimum command grouping が読める
- [x] AC-2: request shape、response shape、permission mapping、error mapping の target coverage が読める
- [x] AC-3: evidence path と fallback direction が整理されている
- [x] AC-4: actual test implementation や CI wiring を含まない preparation issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md, docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Approach: Issue 113 の contract test targets を、request/response compatibility と auth/error mapping の command-oriented baseline に切り分ける
- Alternative rejected and why: contract target を integration suite に吸収する案は schema drift と major-flow drift の責務が混ざり、shared API/auth 変更時の最低 gate が曖昧になるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-115-sns-contract-regression-test-command-baseline.md and docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Expected results: markdown diagnostics がなく、command grouping、target mapping、evidence path が読み取れる
- Failure triage path: Issue 113 の contract test targets と照合し、request/response/auth/error mapping のどこが command grouping から漏れているかを切り分ける

Risk and Rollback
- Risks: contract baseline が細かすぎて command 分割コストだけ増えるか、逆に broad すぎて schema drift を pinpoint できないこと
- Impact area: SNS API stability, auth boundary stability, test maintenance cost
- Mitigation: request/response contract と auth/error contract の 2 系統に絞り、minimum repeatable gate として固定する
- Rollback: scope が広がりすぎた場合は request/response compatibility と auth-to-post mapping だけを残し、error mapping は follow-up issue へ分離する
```

## Tasks

- [x] contract-oriented command grouping を固定する
- [x] minimum target mapping を固定する
- [x] evidence path と fallback direction を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] contract regression command grouping が 1 文書で読める
- [x] request / response / auth / error mapping coverage が読める
- [x] evidence path と fallback direction が読める
- [x] actual test implementation や CI wiring を本 issue の外に維持している

## Recommended Command Grouping

minimum contract regression command grouping は次の 2 系統とする。

1. request-response compatibility command
2. auth-error mapping command

Grouping rule:

- shared API wrapper change では request-response compatibility command を省略しない
- shared auth abstraction や permission mapping change では auth-error mapping command を省略しない
- same change が両方に跨る場合は one command へ無理に統合せず、2 系統 evidence を残す

## Minimum Target Mapping

### 1. Request-Response Compatibility Command

- post message request shape remains compatible
- post message validation rejects invalid payloads as expected
- timeline read response shape remains compatible with SNS read model

### 2. Auth-Error Mapping Command

- auth-to-post permission mapping remains compatible with guest / member / operator boundary
- error mapping for write failure remains visible to SNS client surface

Target rule:

- request / response shape drift と auth/error drift を別 evidence として残せるようにする
- backend implementation detail ではなく app-facing contract を守るための target に限定する
- silent failure を許す broad success-only evidence は採らない

## Evidence Path Baseline

- command-level output for request / response compatibility
- command-level output for auth / error mapping compatibility
- issue-local impact statement linking shared-layer change to executed command grouping

Evidence rule:

- `tests not needed` を使う場合は Issue 113 baseline と同等の説明責任を課す
- one grouping の evidence が欠ける場合、該当 contract surface の unaffected 判定を確定しない

## Fallback Direction

- contract-oriented command grouping が未整備の change は Issue 113 baseline の automated gate 未整備として扱い、manual fallback へ丸めない
- temporary に broader automated evidence を使う場合でも、request-response compatibility と auth-error mapping のどちらを代替したかを明示する
- same fallback が繰り返される場合は command implementation follow-up を優先する

## Recommended Split Toward Implementation

- future implementation issue should turn request-response compatibility grouping into repeatable test command(s)
- future implementation issue should turn auth-error mapping grouping into repeatable test command(s)
- integration-major-flow coverage remains tracked outside this issue

## Next Split

- Issue 119: SNS request-response contract command implementation split
- Issue 120: SNS auth-error contract command implementation split

## Current Codebase Fit

- current [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) already provides the existing Node-oriented validation entry through `buildRouteValidationReport` and `runRouteValidationCli`, so contract-side SNS work should land on that CLI path before any browser-suite expansion
- current [apps/portal-web/package.json](apps/portal-web/package.json) already exposes `test:routes` and `test:baseline`, which makes package-script growth on the contract side cheaper than inventing a parallel test runner first
- browser automation already has its own home in [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs), so this issue should stay explicitly on the non-browser side

Fit rule:

- contract regression work should extend the current CLI entry shape before any new browser-facing SNS regression path is introduced
- if preparatory extraction happens first, it should isolate CLI-facing contract helpers from the rest of [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)

## Recommended Implementation Order

1. keep the first implementation pass on the existing CLI path in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) and [apps/portal-web/package.json](apps/portal-web/package.json) rather than creating a new test tree first
2. implement Issue 119 before Issue 120, because request and response compatibility is the narrower surface and gives the cleanest first command boundary
3. implement Issue 120 after Issue 119 on the same CLI-oriented command surface so auth and error evidence does not invent a second command pattern too early
4. extract dedicated SNS contract helper modules only after both command groupings have a stable output shape worth preserving

Order rule:

- preferred flow for this issue is request-response first and auth-error second
- the first extraction priority is command-surface clarity, not framework expansion

## Non-Goals

- actual test code implementation
- integration suite implementation
- CI workflow integration
- visual regression adoption
- manual major-flow check definition

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #115
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/115
- Sync Status: synced to GitHub as closed issue

- request-response implementation split landed as closed child issue Issue 119 with local CLI command and package-script wiring
- auth-error implementation split landed as closed child issue Issue 120 with local CLI command and package-script wiring
- parent contract-command baseline role is complete and the contract-side child implementation chain is now complete

## Dependencies

- docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
