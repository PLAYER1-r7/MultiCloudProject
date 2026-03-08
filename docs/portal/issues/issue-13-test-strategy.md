## Summary

何をもって MVP が成立したとみなすかを先に決めておかないと、実装後の品質判断が曖昧になる。

## Goal

smoke test、主要導線確認、モジュールテスト、デプロイ後確認の基準を定義する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-13
- タイトル: テスト戦略を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: planning
- 優先度: 高

目的
- 解決する問題: 何を満たせば staging 合格と判断できるかが曖昧なままだと、build 成功後の release 判定、Issue 12 の monitoring signal 解釈、Issue 18 の workflow 実装が場当たり化する
- 期待する価値: first-release で必須とする smoke test、major flow check、module-level validation、post-deploy verification、staging acceptance rule を 1 つの test baseline として固定できる

スコープ
- 含むもの: smoke test scope、major public route checks、module-level test priority、post-deploy verification、staging acceptance rule、test evidence の議論たたき台
- 含まないもの: 実 test 実装、CI workflow 作成、production release 承認、monitoring/alert tool 導入、rollback 実行手順の詳細化
- 編集可能パス: docs/portal/issues/issue-13-test-strategy.md
- 制限パス: apps/, infra/, .github/workflows/

受け入れ条件
- [ ] 条件 1: first-release test baseline が smoke / major flow / module / post-deploy / staging acceptance の層で整理され、Issue 18 と Issue 14 が参照できる状態になっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-13-test-strategy.md
- アプローチ: docs/portal/15_TEST_STRATEGY_DRAFT.md を基礎に、Issue 10 の validation/deploy 分離、Issue 12 の monitoring baseline、Issue 1 と Issue 2 の MVP route 前提を接続して issue ローカルの議論記録へ整理する
- 採用しなかった代替案と理由: 先に test framework や E2E 製品選定まで固定する案は、first-release で何を必須合格条件とするかより先に実装詳細へ寄りやすいため採らない

検証計画
- 実行するテスト: git status --short; GH_PAGER=cat gh issue view 13 --repo PLAYER1-r7/MultiCloudProject --json number,state,title,updatedAt,url
- 確認するログ/メトリクス: TBD
- 失敗時の切り分け経路: docs/portal/15_TEST_STRATEGY_DRAFT.md、docs/portal/issues/issue-10-cicd-policy.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md に戻り、test scope・monitoring scope・route scope の責務境界を混同していないかを確認する

リスクとロールバック
- 主なリスク: 初回リリースに対して過剰な major flow automation や module test を要求し、実装開始前の判断を不必要に重くすること
- 影響範囲: staging acceptance、Issue 18 workflow design、Issue 12 alert interpretation、Issue 14 rollback trigger judgment
- 緩和策: public-first portal の MVP route と release-critical signal に絞り、deep test pyramid は later-phase enhancement として分ける
- ロールバック手順: test baseline が広すぎる、または staging acceptance と monitoring boundary が混ざっていると判明した場合は、smoke / major flow / module / post-deploy / acceptance を再分離して整理し直す
```

## Tasks

- [x] smoke test 対象を定義する
- [x] 主要導線確認の対象を定義する
- [x] モジュール単位テストの対象を定義する
- [x] デプロイ後確認項目を定義する
- [x] staging 合格条件を定義する
- [x] テスト計画を作成する

## Definition of Done

- [x] 初回リリースで必須とする smoke test 対象がページと資産の粒度で整理されている
- [x] MVP 価値を支える主要導線の確認対象が明示されている
- [x] モジュール単位で優先して検証すべき対象と方針が整理されている
- [x] デプロイ後確認項目が staging 確認フローに接続して説明されている
- [x] staging 合格条件と production へ進めない条件が明示されている
- [x] 実装開始後にテスト項目へ落とし込める判断材料として参照できる

## Issue 13 Discussion Draft

このセクションは、Issue 13 の議論を始めるためのたたき台である。Issue 10 により、validation workflow と deploy workflow は分離し、staging は main 上の review 済み commit から進め、production は explicit approval を前提にすることが整理された。Issue 12 では public reachability、deploy verification、auditability、actionable alerting を monitoring baseline とし、staging smoke check failure の release blocker 判定そのものは Issue 13 の staging acceptance rule に委ねることが確定した。したがって Issue 13 の主題は「最初から網羅的な test suite を作ること」ではなく、「first-release の public-first portal に対して、何が通れば staging 合格と判断できるか」を test layer ごとに固定することである。

### 1. 現時点の前提整理

- 初回リリースは public-first、static-first portal であり、custom API、login-required route、application persistence は前提にしない
- MVP の primary public route set は Home、Overview、Guidance であり、visitor が portal の目的を理解し、主要情報へ辿り着き、次 action を判断できることが最小価値である
- Issue 10 により、build と validation は deploy と分離され、staging acceptance は production approval の代替にはならない
- Issue 12 により、top page、主要 route、主要 static asset を含む reachability baseline と、staging smoke check failure を primary alert signal とする monitoring baseline が確定している
- Issue 13 は monitoring signal を定義するのではなく、どの check が release candidate の pass/fail を決めるかを主責務とする
- よって first-release test strategy は full E2E coverage よりも、small mandatory smoke coverage、major flow confirmation、limited module validation、repeatable post-deploy verification を優先して整理する必要がある

### 2. 今回まず固定したい test baseline の分離軸

提案:

- smoke test と major flow check を分ける
- module-level validation と page-level verification を分ける
- pre-deploy validation と post-deploy verification を分ける
- staging acceptance と production promotion を同じ判断として扱わない

この切り分けを採る理由:

- smoke test は release candidate が最低限立ち上がるかを素早く見る責務であり、major flow check や module test と同じ重さで扱うと実行コストが増えやすい
- static-first portal では UI copy や route 配置の破綻が主要 failure になるため、page-level check と module-level logic test の優先順位を意識的に分ける方がよい
- Issue 12 の monitoring baseline は failure 検知と通知経路を扱うが、Issue 13 はその signal を release blocker とみなす判断基準を定義する側である

### 3. smoke test 方針のたたき台

提案:

- smoke test は every release candidate で必須実行する最小の fast check とする
- first-release では top page、主要 route、主要 static asset、主要 navigation visibility を最小範囲とする
- smoke test は route の意味的正しさを深掘りするのではなく、明らかな壊れ方を素早く止める役割に絞る

現時点の第一案:

- `/`、`/overview`、`/guidance` の 3 route が build 後および staging deploy 後に到達可能であることを必須確認対象とする
- main navigation から Overview と Guidance へ辿れることを smoke coverage に含める
- 主要 static asset は missing / broken reference がないことを最低条件とし、critical asset failure は smoke failure として扱う
- login、form submission、backend-dependent interaction は first-release smoke test の前提に置かない

### 4. major flow check のたたき台

提案:

- major flow check は MVP 価値を支える visitor journey に絞る
- first-release では public informational flow の確認を主目的とし、認証や transaction を伴う flow は対象外とする
- major flow は page reachability の次に、「何を理解できるか」「どこへ進めるか」を確認する

現時点の第一案:

- Home で portal の目的と primary path が読み取れることを確認対象にする
- Overview で対象ユーザー、MVP scope、提供価値の要約が破綻なく参照できることを確認対象にする
- Guidance で next action、support path、operational notice の置き場が機能していることを確認対象にする
- major flow check は page text の完全一致ではなく、visitor が次 action を判断できる構造が保たれているかを優先して見る

### 5. module-level test 方針のたたき台

提案:

- module test は full UI snapshot を増やすのではなく、個別に壊れやすい logic や config を優先する
- rendering helper、route metadata、navigation data、environment-based public config のように再利用される単位を優先する
- static copy そのものを大量に固定するより、壊れたときに release impact が大きい構造に絞る

現時点の第一案:

- route registry や navigation link definition の整合性を module-level test 候補とする
- page section data や card/list rendering で route path、label、required metadata が欠けた場合に検出できる単位を優先する
- browser-safe public config や base path handling がある場合は module-level validation の対象に含める
- CSS や copy 全面の snapshot 固定は initial baseline では必須にしない

### 6. post-deploy verification のたたき台

提案:

- post-deploy verification は staging deploy 後に repeatable に実施できる短い checklist とする
- pre-deploy validation で見えない routing, asset delivery, environment path 問題を補足する
- post-deploy verification は参考情報ではなく、staging acceptance に接続する必須確認として扱う
- Issue 12 の monitoring evidence と矛盾しない形で verification 記録を残す

現時点の第一案:

- staging URL で `/`、`/overview`、`/guidance` の reachability を再確認する
- major static asset の読み込み失敗、broken navigation、base path mismatch がないことを確認する
- smoke check の実行結果は GitHub Actions history または deploy execution record から追跡できる形にする
- post-deploy verification failure は monitoring 上の primary alert signal であると同時に、Issue 13 上では staging acceptance を止める判断材料として扱う

### 7. staging acceptance rule のたたき台

提案:

- staging acceptance は build success、essential validation、smoke pass、post-deploy verification pass、major flow confirmation、blocking defect の有無で判断する
- acceptance は production deploy 許可そのものではなく、production 候補に進めるための前提確認とする
- release blocker は monitoring signal の存在だけでなく、test baseline への照合結果で定義する

現時点の第一案:

- build が成功していること
- pre-deploy validation が成功していること
- staging smoke test が成功していること
- staging deploy 後の post-deploy verification が成功していること
- Home、Overview、Guidance の major flow が期待どおり機能していること
- blocking defect が未解決で残っていないこと
- 上記いずれかを満たさない場合は staging acceptance 不合格とし、production promotion 候補に進めない

### 8. test evidence と運用記録のたたき台

提案:

- first-release では sophisticated dashboard よりも、reviewable な execution record を優先する
- test run 結果は build / validation / deploy の文脈で追跡できることを最低条件にする
- human confirmation が必要な項目は最小にしつつ、manual check が残る場合は owner を明記する

現時点の第一案:

- build / validation job history を pre-deploy test evidence として扱う
- staging deploy 後の smoke and verification result を deploy execution record に残す
- automated smoke / verification result は deploy execution record に残し、manual major flow confirmation が残る場合は release owner または deploy operator の確認記録を別途残す
- screenshot は必須証跡にせず、failed case の補助資料として扱う

### 9. Issue 10 / 12 / 14 / 18 への接続観点

- Issue 10 の validation/deploy 分離を前提に、Issue 13 は validation pass と staging acceptance rule の内容を具体化する
- Issue 12 は smoke failure を primary alert signal として扱うが、Issue 13 はそれが release blocker かどうかを判定する test rule を持つ
- Issue 14 は rollback 開始条件を定義するため、Issue 13 の acceptance failure と production へ進めない条件を参照できる必要がある
- Issue 18 は workflow 実装時に build、validation、staging smoke、post-deploy verification の最小 sequence をこの Issue 13 から参照できる必要がある

### 10. この場で確認したい論点

`Resolution 確定文言` 列が埋まっていない行がある場合は Resolution セクションを書いてはならない。

| 論点                                                     | 判断方向（Discussion 時点の仮）                                                                                                                                                                              | Resolution 確定文言                                                                                                                                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| first-release smoke test の必須対象をどこまでに絞るか    | every release candidate で `/`、`/overview`、`/guidance`、主要 navigation visibility、主要 static asset の配信正常性を最低範囲として必須確認する                                                             | `first-release smoke test は every release candidate で `/`、`/overview`、`/guidance`、主要 navigation visibility、主要 static asset の配信正常性を最低範囲として必須確認する`                              |
| major flow check は UI 文言の完全一致まで求めるか        | 文言の完全一致ではなく、Home で目的と primary path が読めること、Overview で scope/value が読めること、Guidance で next action と support path が辿れることを優先する                                        | `major flow check は UI 文言の完全一致ではなく、Home で portal の目的と primary path が読めること、Overview で scope と value が読めること、Guidance で next action と support path が辿れることを優先する` |
| module-level test はどの単位から始めるか                 | route registry、navigation data、render helper、public config/base path handling のように、壊れると複数ページへ波及する再利用単位を優先する                                                                  | `module-level test は route registry、navigation data、render helper、public config/base path handling のように、壊れると複数ページへ波及する再利用単位を優先する`                                          |
| staging acceptance の release blocker を何で決めるか     | build、pre-deploy validation、staging smoke、post-deploy verification、major flow confirmation のいずれか failure、または blocking defect 未解決を不合格条件とする                                           | `staging acceptance は build、pre-deploy validation、staging smoke、post-deploy verification、major flow confirmation のいずれか failure、または blocking defect 未解決を不合格条件とする`                  |
| post-deploy verification の owner と記録形式をどう置くか | automated smoke / verification result は GitHub Actions history と deploy execution record を正規証跡にし、manual major flow check が残る場合は release owner または deploy operator を owner として明記する | `post-deploy verification の正規証跡は GitHub Actions history と deploy execution record とし、manual major flow check が残る場合は release owner または deploy operator を owner として明記する`           |

## Working Direction

この段階での整理案は次の通り。

- first-release test strategy は small mandatory smoke coverage、major public flow confirmation、limited module-level validation、repeatable post-deploy verification を中心に整理する
- smoke test は `/`、`/overview`、`/guidance`、主要 navigation、主要 static asset を最低限の必須対象とする
- major flow check は visitor が portal の目的を理解し、主要情報へ辿り着き、next action を判断できる構造が保たれていることを確認対象とする
- module-level test は route registry、navigation data、render helper、public config のような壊れやすい再利用単位を優先し、snapshot の大量固定は初期必須にしない
- post-deploy verification は staging deploy 後に reachability、route behavior、asset delivery を確認する repeatable checklist とする
- staging acceptance は build success、essential validation pass、staging smoke pass、post-deploy verification pass、major flow confirmation、blocking defect 解消を必須条件とする
- test evidence は build/validation history、deploy execution record、必要最小限の manual confirmation record を組み合わせて reviewable に保つ

この整理案で議論しやすくなること:

- Issue 10 の validation/deploy 分離に沿って、どの check を pre-deploy に置き、どの check を post-deploy に置くかを固定できる
- Issue 12 の monitoring signal と、Issue 13 の release blocker judgment の責務境界を分けて扱える
- Issue 14 は acceptance failure と rollback trigger の関係を整理しやすくなる
- Issue 18 は workflow 実装時に build、validation、staging smoke、post-deploy verification の最小 sequence を具体化しやすくなる

## Resolution

Issue 13 の判断結果は次の通りとする。

- first-release smoke test は every release candidate で `/`、`/overview`、`/guidance`、主要 navigation visibility、主要 static asset の配信正常性を最低範囲として必須確認する
- major flow check は UI 文言の完全一致ではなく、Home で portal の目的と primary path が読めること、Overview で scope と value が読めること、Guidance で next action と support path が辿れることを優先する
- module-level test は route registry、navigation data、render helper、public config/base path handling のように、壊れると複数ページへ波及する再利用単位を優先する
- post-deploy verification は staging deploy 後の必須確認とし、reachability、route behavior、asset delivery を repeatable checklist で確認する
- staging acceptance は build、pre-deploy validation、staging smoke、post-deploy verification、major flow confirmation のいずれか failure、または blocking defect 未解決を不合格条件とする
- post-deploy verification の正規証跡は GitHub Actions history と deploy execution record とし、manual major flow check が残る場合は release owner または deploy operator を owner として明記する

この合意で明確になること:

- Issue 12 は smoke failure や verification failure を primary alert signal として扱いつつ、release blocker 判定そのものは Issue 13 の acceptance rule に委ねられる
- Issue 14 は acceptance failure と rollback trigger の接続を、test baseline を前提に整理できる
- Issue 18 は build、validation、staging smoke、post-deploy verification の最小 workflow sequence をこの Resolution に沿って実装できる

## Process Review Notes

- direct-decision: Section 10 の論点は個別の逐次回答ログではなく、requester が first-release test baseline の方向性に合意した後に Resolution へ統合する形で確定した。
- Section 10 の論点テーブルは open question と final wording の対応を後から追跡できるように維持し、3 列目は candidate wording ではなく Resolution に反映された確定文言として扱う。
- Resolution 追加時点では planning / draft 段階として扱い、test baseline の方針合意記録と final checkbox review を分離して管理した。その後、Issue 18 の workflow 実装まで含めた downstream 参照可能性を再確認し、明示的な close 承認に基づいて final review を完了した。

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 13 final review, the local issue record is the primary evidence source. [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md) is synchronized supporting background, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirms that the minimum workflow sequence was implemented against this baseline.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `smoke test 対象を定義する` | `3. smoke test 方針のたたき台`, `7. staging acceptance rule のたたき台`, and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections define the mandatory first-release smoke surface, including routes, navigation visibility, and critical static assets. | Accepted for final review |
| `主要導線確認の対象を定義する` | `4. major flow check のたたき台` and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections define the visitor-facing value checks for Home, Overview, and Guidance without overfitting to exact copy. | Accepted for final review |
| `モジュール単位テストの対象を定義する` | `5. module-level test 方針のたたき台` and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections identify the reusable logic units that deserve first priority in module-level validation. | Accepted for final review |
| `デプロイ後確認項目を定義する` | `6. post-deploy verification のたたき台`, `8. test evidence と運用記録のたたき台`, and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections define the repeatable post-deploy verification checklist and the required evidence path after staging deploy. | Accepted for final review |
| `staging 合格条件を定義する` | `7. staging acceptance rule のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) | These sections define the pass/fail rule and show that Issue 18 implemented the workflow sequence against that rule. | Accepted for final review |
| `テスト計画を作成する` | `2. 今回まず固定したい test baseline の分離軸`, `8. test evidence と運用記録のたたき台`, `9. Issue 10 / 12 / 14 / 18 への接続観点`, and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections organize the first-release baseline into a reusable plan that downstream CI/CD and rollback planning can consume. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `初回リリースで必須とする smoke test 対象がページと資産の粒度で整理されている` | `3. smoke test 方針のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) | These sections define the minimum route and asset surface and show that the implemented workflow uses the same first-release smoke targets. | Accepted for final review |
| `MVP 価値を支える主要導線の確認対象が明示されている` | `4. major flow check のたたき台` and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections define the user-visible guidance and value checks that make the MVP meaningful. | Accepted for final review |
| `モジュール単位で優先して検証すべき対象と方針が整理されている` | `5. module-level test 方針のたたき台` and `Resolution` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections scope module validation to the highest-impact reusable logic and configuration units. | Accepted for final review |
| `デプロイ後確認項目が staging 確認フローに接続して説明されている` | `6. post-deploy verification のたたき台`, `8. test evidence と運用記録のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) | These sections connect the verification baseline to staging workflow evidence and to the implemented post-deploy smoke path. | Accepted for final review |
| `staging 合格条件と production へ進めない条件が明示されている` | `7. staging acceptance rule のたたき台`, `Resolution`, and `9. Issue 10 / 12 / 14 / 18 への接続観点` in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sections define the explicit blocker conditions and separate staging acceptance from production promotion. | Accepted for final review |
| `実装開始後にテスト項目へ落とし込める判断材料として参照できる` | `2. 今回まず固定したい test baseline の分離軸`, `8. test evidence と運用記録のたたき台`, `9. Issue 10 / 12 / 14 / 18 への接続観点`, `Resolution`, and [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md) | These sections give downstream issues a concrete baseline for workflow implementation, monitoring coordination, and rollback judgment. | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md), with [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md) used as synchronized supporting background and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) used to confirm downstream implementation alignment. Explicit human close approval is recorded separately.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Smoke-test baseline | Satisfied | `3. smoke test 方針のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirm the minimum route, navigation, and asset checks used for first-release verification. |
| Major flow confirmation | Satisfied | `4. major flow check のたたき台` and `Resolution` confirm the visitor-facing flow checks for Home, Overview, and Guidance. |
| Module-level validation priority | Satisfied | `5. module-level test 方針のたたき台` and `Resolution` confirm the reusable logic units that deserve first validation priority. |
| Post-deploy verification path | Satisfied | `6. post-deploy verification のたたき台`, `8. test evidence と運用記録のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirm the repeatable staging verification path and evidence route. |
| Staging acceptance rule | Satisfied | `7. staging acceptance rule のたたき台`, `Resolution`, and `9. Issue 10 / 12 / 14 / 18 への接続観点` confirm the blocker conditions and keep staging acceptance separate from production promotion. |
| Downstream planning readiness | Satisfied | `8. test evidence と運用記録のたたき台`, `9. Issue 10 / 12 / 14 / 18 への接続観点`, [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirm the baseline was concrete enough to drive workflow implementation and rollback planning. |

## Current Status

- [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md) を test judgment の同期先として扱う
- local issue file には task contract、discussion draft、resolution、evidence mapping、final review result を追加済み
- Section 10 の open questions は Resolution 確定文言列で final wording と対応付けた
- smoke test、major flow check、module-level test、post-deploy verification、staging acceptance の境界は [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) が参照・実装できる粒度で固定した
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- 明示的な close 承認に基づき、GitHub Issue 13 は close 対象として扱う

## Dependencies

- Issue 1
- Issue 2
- Issue 6
- Issue 7
- Issue 10
- Issue 12
