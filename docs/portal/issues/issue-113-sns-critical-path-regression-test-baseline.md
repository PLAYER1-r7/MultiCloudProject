## Summary

Issue 112 で SNS implementation protection and change-isolation baseline は fixed できたが、shared-layer change 時に要求する regression evidence はまだ abstract なままである。このままだと auth abstraction、API client、form primitive、state management の変更で何を automated regression target にすべきかが issue ごとに揺れ、SNS protection gate が manual judgment 依存になりやすい。

## Goal

SNS critical-path regression gate のうち automated test 側の baseline を整理し、shared-layer change 時に最低限要求する contract test と integration test の対象、trigger class、evidence path を 1 issue で読めるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-113
- Title: SNS critical-path regression test baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 112 open

Objective
- Problem to solve: SNS protection gate は fixed したが、route、auth、post、readback、API mapping に対する automated regression target が issue 単位で未分解のため、shared-layer change 時に何を test evidence として要求するかが曖昧である
- Expected value: contract test と integration test の最小 target set、trigger condition、evidence path を固定し、後続 feature が shared layer を触る際の SNS regression gate を repeatable にできる

Scope
- In scope: automated regression trigger classes、contract test target、integration test target、evidence path、fallback direction、non-goals
- Out of scope: actual test code implementation、test framework selection execution、CI wiring implementation、visual regression platform adoption、manual check procedure full definition
- Editable paths: docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md, docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: shared-layer change 時に automated SNS regression gate を要求する trigger class が読める
- [x] AC-2: contract test と integration test に分けた concrete regression target が読める
- [x] AC-3: evidence path と fallback direction が整理されている
- [x] AC-4: actual test implementation や CI wiring を含まない baseline issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md, docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Approach: Issue 112 の regression target matrix を automated test 観点に切り出し、contract test と integration test の 2 層で minimum repeatable baseline を固定する
- Alternative rejected and why: manual check と test baseline を同じ issue に混ぜる案は、shared-layer change 時の automated gate と human review gate の責務が曖昧になるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-113-sns-critical-path-regression-test-baseline.md and docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Expected results: markdown diagnostics がなく、trigger classes、test targets、evidence path が読み取れる
- Failure triage path: Issue 112 の change classes と regression target matrix を再照合し、automated target が route / auth / API / readback のどこで不足しているかを切り分ける

Risk and Rollback
- Risks: automated regression baseline が広がりすぎて every-change full-suite を要求するか、逆に narrow すぎて shared-layer regression を止められないこと
- Impact area: future feature velocity, SNS stability, test maintenance cost
- Mitigation: contract test と integration test を minimum gate として分け、visual / broad E2E は非対象に残す
- Rollback: scope が広がりすぎた場合は auth / post / readback major flow に直結する minimum target だけを残し、deeper coverage は follow-up issue へ分離する
```

## Tasks

- [x] automated regression trigger classes を固定する
- [x] contract test targets を固定する
- [x] integration test targets を固定する
- [x] evidence path と fallback direction を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] automated SNS regression gate の trigger class が読める
- [x] contract test と integration test の minimum target が読める
- [x] evidence path が repeatable baseline として読める
- [x] actual test implementation や CI wiring を本 issue の外に維持している

## Automated Trigger Classes

次の change class は automated SNS regression gate を必須にする。

1. auth abstraction or session state logic change
2. route registration or route guard change
3. API client / fetch wrapper / response mapping change
4. posting form validation helper or submit-state logic change
5. state container / query cache behavior change

Trigger rule:

- shared-layer change が上記 class に該当する場合、manual check only では閉じない
- route / auth / API / post / readback のどれかに transitive impact がある場合も trigger class 該当とみなす

## Contract Test Targets

minimum contract test targets は次の通りとする。

- post message request shape remains compatible
- post message validation rejects invalid payloads as expected
- timeline read response shape remains compatible with SNS read model
- auth-to-post permission mapping remains compatible with guest / member / operator boundary
- error mapping for write failure remains visible to SNS client surface

Contract test rule:

- request / response schema drift を unrelated feature 変更で silent に通さない
- contract test は backend implementation detail ではなく app-facing contract を守るために使う
- auth or API wrapper change では contract test を省略しない

## Integration Test Targets

minimum integration test targets は次の通りとする。

- signed-out user cannot complete post flow
- signed-in member can open posting form and submit a valid message
- successful post reaches expected readback path
- failed post shows expected error state and does not silently disappear
- route / layout / shared loading change does not break SNS surface mount or posting CTA reachability

Integration test rule:

- one full broad suite ではなく、SNS major flow を守る small set を minimum gate とする
- auth state transition、post pending、post success、post failure の少なくとも 4 状態を evidence に残す

## Evidence Path Baseline

- contract test output for request / response compatibility
- integration test output for sign-in to post to readback major flow
- issue-local impact statement linking the change class to executed test targets

Evidence rule:

- `tests not needed` を使う場合は Issue 112 exception rule と同等の説明責任を課す
- evidence が incomplete の場合は `SNS unaffected` 判定を確定しない

## Fallback Direction

- automated regression target が未整備の shared-layer change は manual major-flow check issue へフォールバックする
- fallback は automated gate 不要を意味せず、temporary bridge として扱う
- same trigger class が繰り返し manual fallback へ逃げる場合は implementation follow-up を優先起票する

## Recommended Split Toward Implementation

- future implementation issue should turn contract test targets into repeatable test command(s)
- future implementation issue should turn integration test targets into a stable SNS major-flow suite
- manual-only fallback remains separate and is tracked outside this issue

## Next Split

- Issue 115: SNS contract regression test command baseline
- Issue 116: SNS major-flow integration suite baseline

## Current Codebase Structure Fit

- current [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) already mixes three concerns that future SNS regression work would otherwise expand further: route and variant content, route-validation CLI entrypoints, and browser-render runtime
- current [apps/portal-web/package.json](apps/portal-web/package.json) already exposes a small Node-oriented validation path through `test:routes` and `test:baseline`, which is the most natural first landing zone for contract-oriented SNS regression commands
- current browser verification already lives separately in [apps/portal-web/scripts/verify-public-variants.mjs](apps/portal-web/scripts/verify-public-variants.mjs), so browser-facing SNS suites should follow that split instead of expanding the CLI side into one broad runner

Fit rule:

- automated SNS regression should reuse the existing CLI versus browser split before introducing a new top-level test structure
- future SNS implementation should avoid adding new regression entrypoints directly inside the longest browser-render block in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)

## main.ts Split Candidates Before SNS Growth

1. route and variant content block
2. route-validation CLI block
3. browser-render runtime block

Candidate detail:

- route and variant content block currently centers on `routeDefinitions`, `portalVariantRouteOverrides`, `navGroups`, and variant metadata declarations inside [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- route-validation CLI block currently centers on `validateRouteMetadataForVariant`, `validateRouteMetadata`, `buildRouteValidationReport`, and `runRouteValidationCli` inside [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)
- browser-render runtime block currently centers on metadata sync helpers, `renderRoute`, and `bootstrapBrowserApplication` inside [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)

Split rule:

- SNS contract commands should attach to the route-validation CLI side, not to the browser-render runtime side
- SNS browser suites should require only stable data hooks from the browser-render runtime side, not mixed-in command logic
- if one preparatory refactor is made before SNS implementation starts, the CLI block should be isolated first because it unlocks Issue 119 and Issue 120 without forcing browser-runtime changes

## Recommended Implementation Order

1. isolate the current CLI-oriented validation entry from the browser-render runtime in [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) so new SNS contract commands can plug into the existing Node pattern without expanding the render path
2. implement Issue 119 first, because request and response compatibility can follow the existing non-browser validation style and gives the narrowest repeatable gate
3. implement Issue 120 next, because auth and error contract evidence should share the same CLI-oriented command surface before browser suites start depending on it
4. add only the minimum stable SNS surface hooks needed on the browser-render side after the contract commands exist
5. implement Issue 122 before Issue 121, because surface reachability and CTA visibility are the lighter browser entry gate and de-risk selector or mount regressions before full auth-post-readback flow coverage
6. implement Issue 121 last, because it depends most on stable SNS UI hooks, auth state handling, and readback behavior already being exposed in a browser-testable shape

Order rule:

- preferred implementation flow is contract-first and browser-second
- within the browser side, reachability-first and full major-flow-second is the lower-risk order for the current compact codebase

## Non-Goals

- actual test code implementation
- CI workflow integration
- full E2E suite adoption
- visual regression platform adoption
- manual major-flow check definition

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #113
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/113
- Sync Status: synced to GitHub as closed issue

- contract-oriented implementation-preparation split was finalized through Issue 115 and implemented through closed child issues Issue 119 and Issue 120
- integration-oriented implementation-preparation split was finalized through Issue 116 and implemented through closed child issues Issue 121 and Issue 122
- current portal-web implementation now provides local command evidence for request-response and auth-error coverage plus local browser-suite evidence for surface reachability and auth-post-readback flow
- parent baseline role is complete and the planned child implementation chain from Issue 119 through Issue 122 is now complete

## Dependencies

- docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
