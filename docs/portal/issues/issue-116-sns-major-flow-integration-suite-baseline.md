## Summary

Issue 113 で SNS automated regression gate の integration test target は fixed できたが、signed-out blocked post、signed-in post success、post failure visibility、readback consistency、surface mount reachability をどの major-flow suite unit で repeatable に実装へ落とすかは未分解のままである。このままだと shared route / layout / state / auth 変更時に integration evidence の範囲が issue ごとに揺れ、SNS protection gate が一貫しにくい。

## Goal

SNS major-flow integration suite baseline を整理し、shared-layer change 時に最低限要求する integration-oriented suite grouping、state coverage、evidence path、fallback direction を reviewable な implementation-preparation issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-116
- Title: SNS major-flow integration suite baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 113 open

Objective
- Problem to solve: integration test targets は fixed したが、major flow をどの suite unit と state coverage で実装へ落とすかが未固定のため、shared route / auth / layout / state changes に対する automated evidence が安定しない
- Expected value: SNS major-flow integration gate を suite-oriented な最小 implementation unit に分解し、後続 issue が flow coverage と evidence path を再議論せずに進められる

Scope
- In scope: integration-oriented suite grouping、minimum state coverage、evidence path、fallback direction、non-goals
- Out of scope: actual test code implementation、specific framework adoption、CI workflow wiring、contract command implementation、manual check procedure
- Editable paths: docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md, docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: integration regression を要求する minimum suite grouping が読める
- [x] AC-2: signed-out blocked、post success、post failure、readback、surface mount の state coverage が読める
- [x] AC-3: evidence path と fallback direction が整理されている
- [x] AC-4: actual test implementation や CI wiring を含まない preparation issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md, docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Approach: Issue 113 の integration test targets を、auth/post/readback flow と surface-mount reachability flow の suite-oriented baseline に切り分ける
- Alternative rejected and why: route / layout reachability を contract issue に吸収する案は user-visible major flow と API-facing contract の責務が混ざり、shared UI/state change 時の最低 gate が曖昧になるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-116-sns-major-flow-integration-suite-baseline.md and docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
- Expected results: markdown diagnostics がなく、suite grouping、state coverage、evidence path が読み取れる
- Failure triage path: Issue 113 の integration targets と照合し、signed-out/post success/post failure/readback/mount coverage のどこが suite grouping から漏れているかを切り分ける

Risk and Rollback
- Risks: integration baseline が広がりすぎて broad E2E suite に寄るか、逆に narrow すぎて shared route/layout/state regression を止められないこと
- Impact area: SNS UX stability, shared-layer safety, test runtime cost
- Mitigation: auth/post/readback major flow と surface reachability flow の 2 系統に絞り、minimum repeatable gate として固定する
- Rollback: scope が広がりすぎた場合は auth/post/readback flow だけを残し、surface mount reachability は follow-up issue へ分離する
```

## Tasks

- [x] integration-oriented suite grouping を固定する
- [x] minimum state coverage を固定する
- [x] evidence path と fallback direction を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] integration regression suite grouping が 1 文書で読める
- [x] signed-out / success / failure / readback / mount coverage が読める
- [x] evidence path と fallback direction が読める
- [x] actual test implementation や CI wiring を本 issue の外に維持している

## Recommended Suite Grouping

minimum integration regression suite grouping は次の 2 系統とする。

1. auth-post-readback major-flow suite
2. surface-mount and CTA reachability suite

Grouping rule:

- shared auth, state, submit-state change では auth-post-readback major-flow suite を省略しない
- route registration, layout shell, shared loading change では surface-mount and CTA reachability suite を省略しない
- one change が両方に跨る場合は suite evidence を分けて残せるようにする

## Minimum State Coverage

### 1. Auth-Post-Readback Major-Flow Suite

- signed-out user cannot complete post flow
- signed-in member can open posting form and submit a valid message
- successful post reaches expected readback path
- failed post shows expected error state and does not silently disappear

### 2. Surface-Mount And CTA Reachability Suite

- route / layout / shared loading change does not break SNS surface mount
- posting CTA remains reachable from intended entry surface
- shared shell changes do not hide or misroute SNS entry surface

Coverage rule:

- auth state transition、post pending、post success、post failure の少なくとも 4 状態を evidence に残す
- success-only suite や mount-only suite で broad unaffected を主張しない
- readback consistency は post success の付随確認ではなく独立 target として残す

## Evidence Path Baseline

- suite-level output for auth-post-readback major flow
- suite-level output for surface mount and CTA reachability
- issue-local impact statement linking shared-layer change to executed suite grouping

Evidence rule:

- `tests not needed` を使う場合は Issue 113 baseline と同等の説明責任を課す
- one suite grouping の evidence が欠ける場合、該当 flow surface の unaffected 判定を確定しない

## Fallback Direction

- integration suite grouping が未整備の change は Issue 113 baseline の automated gate 未整備として扱い、manual fallback を恒久解にしない
- temporary に narrower evidence を使う場合でも、どの state coverage を落としたかを明示する
- same fallback が繰り返される場合は integration suite implementation follow-up を優先する

## Recommended Split Toward Implementation

- future implementation issue should turn auth-post-readback grouping into repeatable suite command(s)
- future implementation issue should turn surface-mount and CTA reachability grouping into repeatable suite command(s)
- contract-oriented command coverage remains tracked outside this issue

## Next Split

- Issue 121: SNS auth-post-readback suite implementation split
- Issue 122: SNS surface reachability suite implementation split

## Current Codebase Fit

- current browser-oriented verification already runs from [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs), so SNS integration suites should follow that script-based browser pattern instead of growing out of the CLI path in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- current [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) still owns route shell rendering, metadata sync, and internal navigation, which means browser-side SNS work should request only stable hooks or selectors from that file
- current [apps/portal-web/package.json](apps/portal-web/package.json) already has one browser verification script entry, so this issue can extend the same package-script shape without introducing a broader test framework first

Fit rule:

- integration suites should stay script-based and browser-oriented in the current repository shape
- browser-side SNS work should avoid mixing full suite orchestration back into the render runtime block in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)

## Recommended Implementation Order

1. add only the minimum stable SNS route, surface, or CTA hooks required for browser verification on the render side of [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
2. implement Issue 122 before Issue 121, because surface reachability and CTA visibility are the lighter browser gate and reduce selector or mount ambiguity first
3. implement Issue 121 after reachability is stable, because auth-post-readback flow depends on entry visibility, mount stability, auth state handling, and readback behavior all being available in one suite
4. keep full auth-post-readback evidence separate from host-variant verification so [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs) does not turn into a broad mixed-purpose script

Order rule:

- preferred flow for this issue is surface reachability first and full major-flow second
- browser hooks should stay minimal until the lighter suite has proven the SNS entry surface is stable

## Non-Goals

- actual test code implementation
- contract command implementation
- CI workflow integration
- broad E2E suite adoption
- manual major-flow check definition

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #116
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/116
- Sync Status: synced to GitHub as closed issue

- auth-post-readback suite implementation split landed as closed child issue Issue 121 with local Playwright validation and local preview runner wiring
- surface reachability suite implementation split landed as closed child issue Issue 122 with dedicated SNS surface hooks and local Playwright validation
- parent integration-suite baseline role is complete and the browser-side child implementation chain is now complete

## Dependencies

- docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md
