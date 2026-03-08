## Summary

デプロイ後に問題を検知できない構成は、MVP であっても運用リスクが高い。

## Goal

最小限の正常性確認、ログ収集、アラート通知の方針を定義する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-12
- タイトル: 監視ポリシーの初期整理
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: planning
- 優先度: 高

目的
- 解決する問題: 初回リリース後に portal の異常を検知できないまま運用すると、到達性障害や deploy 失敗を見逃しやすくなる
- 期待する価値: Issue 10 の delivery gate と Issue 11 の security baseline を監視・通知方針へ接続し、Issue 13 と Issue 14 が参照できる最低限の monitoring baseline を定義できる

スコープ
- 含むもの: health check、deploy 後確認、logs、metrics、alerts、notification path、first-release monitoring scope の議論たたき台
- 含まないもの: 実監視ツール導入、通知連携の実装、dashboards の作成、on-call 運用手順の詳細化、SLO/SLI の数値確定
- 編集可能パス: docs/portal/issues/issue-12-monitoring-policy.md
- 制限パス: apps/, infra/, .github/workflows/

受け入れ条件
- [ ] 条件 1: 初回リリースで必須とする monitoring baseline が signal ごとに整理され、Issue 13 と Issue 14 の判断基準として参照できる状態になっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-12-monitoring-policy.md
- アプローチ: docs/portal/14_MONITORING_POLICY_DRAFT.md を基礎に、Issue 10 の CI/CD gate、Issue 11 の security と audit の確定方針、Issue 13 の test strategy draft を接続して issue ローカルの議論記録へ整理する
- 採用しなかった代替案と理由: 監視ツールや通知先の製品選定まで先に確定する案は、first-release で必要な signal と運用責任境界の整理より先に実装論へ寄りやすいため採らない

検証計画
- 実行するテスト: git status --short; GH_PAGER=cat gh issue view 12 --repo PLAYER1-r7/MultiCloudProject --json number,state,title,updatedAt,url
- 確認するログ/メトリクス: TBD
- 失敗時の切り分け経路: docs/portal/14_MONITORING_POLICY_DRAFT.md、docs/portal/issues/issue-11-security-baseline.md、docs/portal/15_TEST_STRATEGY_DRAFT.md に戻り、health check・security audit・test scope の責務境界を混同していないかを確認する

リスクとロールバック
- 主なリスク: 初回リリースに対して過剰な observability 要件を入れ、実装着手前の意思決定を不必要に重くすること
- 影響範囲: staging deploy verification、alert routing、Issue 13 の test 範囲、Issue 14 の recovery signal 定義
- 緩和策: user-facing health と operator-facing evidence を優先し、later-phase observability は tracked gap として分ける
- ロールバック手順: monitoring baseline が広すぎる、または不足していると判明した場合は、first-release 必須 signal と later-phase enhancement を再分離して整理し直す
```

## Tasks

- [x] ヘルスチェック方法を定義する
- [x] 収集すべきログを定義する
- [x] 必要なメトリクスを定義する
- [x] アラート条件を定義する
- [x] 通知先を整理する
- [x] 監視対象一覧を作成する

## Definition of Done

- [x] 公開ポータルの到達性を確認するヘルスチェック方法が明示されている
- [x] デプロイ後確認でトップページと主要静的アセットを検証する方針が整理されている
- [x] 初回リリースで確認すべきログの参照元と見方が説明されている
- [x] 可用性と配信正常性を中心にした最小メトリクス方針が整理されている
- [x] サイト到達不可、デプロイ失敗、主要導線障害に対するアラート条件が明示されている
- [x] 通知先と一次対応者の経路が整理されている
- [x] MVP の監視対象一覧として参照できる状態になっている

## Issue 12 Discussion Draft

このセクションは、Issue 12 の議論を始めるためのたたき台である。Issue 10 により、staging は main 起点の review 済み commit から進め、production は explicit approval と operator-managed cutover を前提にすることが整理された。Issue 11 では HTTPS、security headers、managed secrets、auditability を first-release security baseline とする方針が確定した。したがって Issue 12 の論点は「最初から完全な observability stack を入れること」ではなく、「初回リリースで異常を見逃さないための health・deploy・audit signal を、運用責任と通知経路に沿って固定すること」である。

### 1. 現時点の前提整理

- 初回リリースは public-first、static-first portal であり、custom API と application persistence は前提にしない
- user-facing failure の中心は、site unreachable、broken route、missing asset、failed deployment、misconfigured delivery path である
- Issue 10 により、staging deploy の自動化経路と production gate の分離を前提に monitoring を考える必要がある
- Issue 11 により、workflow history と cloud-native audit log は first-release の最低 audit evidence として参照可能である必要がある
- Issue 13 は executable な smoke test と staging 合格条件を扱うため、Issue 12 では monitoring signal、owner、notification path の定義を主責務とする
- よって first-release monitoring baseline は application telemetry よりも、reachability、deploy verification、auditability、alert routing を優先して整理する必要がある

### 2. 今回まず固定したい monitoring baseline の分離軸

提案:

- user-facing health signal と operator-facing audit signal を分ける
- first-release で必須の monitoring と later-phase observability enhancement を分ける
- staging の deploy verification と production の alert routing を分ける
- continuous metrics と event-driven alerts を分ける

この切り分けを採る理由:

- static-first portal では deep application metrics よりも、到達性、主要 route、asset 配信、deploy 成否の方が即時の判断材料として有効である
- security と recovery の観点では audit log と notification path が重要だが、すべてを常時監視対象に広げると初期運用が重くなりやすい

### 3. ヘルスチェック方針のたたき台

提案:

- first-release では public portal の reachability を最優先 health signal とする
- health check は infrastructure status だけでなく、user が見る主要 route と主要静的 asset の応答確認を含める
- deploy 後確認は staging workflow の正規経路に組み込める粒度から始める

現時点の第一案:

- 最低限の確認対象は top page、主要 route、主要静的 asset とする
- staging deploy 後に smoke check を実行し、失敗時は delivery path の異常として扱う
- production でも同じ health baseline を目標にし、手動 cutover が入る場合は operator step の確認結果を別途残す

### 4. ログ方針のたたき台

提案:

- first-release で reviewable にすべき log は workflow history、deploy execution record、cloud-native delivery log、audit log を中心にする
- static portal に存在しないアプリケーション層の log を前提にせず、実際に異常切り分けで使う log に絞る
- log retention と参照経路は recovery 判断に使える範囲を最低限確保する

現時点の第一案:

- deploy success/failure は GitHub Actions history を正規証跡とする
- delivery path の異常切り分けには cloud-native access log または provider-native request/error visibility を使う
- security-relevant change と operator step の追跡には audit log を使い、Issue 11 の audit baseline と接続する

### 5. メトリクス方針のたたき台

提案:

- first-release の metrics は availability と delivery health に絞る
- deep business metric や detailed tracing は後段で再評価する
- alert と直接結び付く metric を優先し、誰も見ない metric を増やさない

現時点の第一案:

- 基本指標は reachability、HTTP error 傾向、deploy success/failure、主要 route の応答可否とする
- latency は参照できるなら保持するが、初回は hard threshold の先行確定までは求めない
- 4xx/5xx の扱いは static delivery で実際に異常切り分けに使う粒度までに留める

### 6. アラート条件のたたき台

提案:

- alert は actionability を基準に絞る
- site unreachable、failed deploy、major route failure、operator action が必要な delivery path 異常を first-release の中心 alert とする
- noise が多い condition は初回から mandatory にしない

現時点の第一案:

- staging では failed deploy と smoke check failure を primary alert signal として扱い、release blocker 判定そのものは Issue 13 の staging acceptance rule へ委ねる
- production では public reachability failure と operator-managed cutover 後の異常を即応対象とする
- 低優先度の performance degradation は first-release では paging 条件に含めず、記録対象または later-phase enhancement として扱う

### 7. 通知先と一次対応経路のたたき台

提案:

- notification path は release と recovery の責任者が実際に見る経路に限定する
- owner が未定の通知先は enable しない
- human approval と production operator step を監視記録と分けて整理する

現時点の第一案:

- staging failure 通知は deploy operator と release owner が追える経路を優先する
- production alert は operator-managed action に結び付く通知先のみを first-release 対象とする
- current small-team phase では repository owner が release owner を兼ねる前提で一次通知 owner を担い、deploy operator と production operator を必要に応じて同報対象にする
- notification channel の製品選定は後続 issue で具体化しても、owner と一次対応経路は Issue 12 で先に明記する

### 8. first-release monitoring checklist のたたき台

初回リリース前に最低限確認したい項目:

- 最新 deploy の success/failure を workflow history から確認できる
- top page、主要 route、主要静的 asset の post-deploy 確認方法がある
- delivery path の異常切り分けに使う log または visibility の参照先がある
- security-relevant change と operator step を audit log または execution record で追跡できる
- site unreachable、failed deploy、major route failure の alert 条件が定義されている
- 通知先と一次対応経路が owner 付きで整理されている

### 9. Issue 10 / 11 / 13 / 14 への接続観点

- Issue 10 の staging deploy path と production gate を monitoring evidence と alert routing の前提にする
- Issue 11 の auditability と security-relevant failure を monitoring policy に接続する
- Issue 13 では smoke test、post-deploy verification、staging acceptance の具体的な test case と pass/fail rule を定義し、Issue 12 ではそれらが返す monitoring signal、alert 条件、notification 接続を扱う
- Issue 14 では site unreachable、deploy failure、DNS/certificate 問題、security-relevant change の検知経路を rollback 判断へ接続する

### 10. この場で確認したい論点

`Resolution 確定文言` 列が埋まっていない行がある場合は Resolution セクションを書いてはならない。

| 論点                                                        | 判断方向（Discussion 時点の仮）                                                | Resolution 確定文言                                                                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| first-release で常時監視の中心に置く signal は何か          | reachability、deploy success/failure、major route health を優先する            | `first-release monitoring の中心 signal は public reachability、deploy success/failure、major route health とし、deep application telemetry は後段で再評価する`          |
| static-first portal で最低限 reviewable にすべき log は何か | workflow history、delivery log、audit log を優先する                           | `first-release で最低限 reviewable にすべき log は GitHub workflow history、cloud-native delivery visibility、audit log とし、存在しない application log を前提にしない` |
| staging と production で alert 条件をどこまで揃えるか       | baseline は揃えつつ、production では operator-managed cutover 異常を追加で扱う | `staging と production は同じ health baseline を目標とするが、production では operator-managed cutover 後の異常も alert 対象に含める`                                    |
| notification path は製品選定より先に何を決めるべきか        | owner と一次対応経路を先に決める                                               | `notification path はツール選定より先に owner と一次対応経路を固定し、無人の通知先は enable しない`                                                                      |
| performance degradation を初回から paging 対象に含めるか    | 初回は記録対象に留め、即応が必要な failure を優先する                          | `first-release では site unreachable、failed deploy、major route failure を alert の中心とし、performance degradation は paging 条件として先行確定しない`                |

## Working Direction

この段階での整理案は次の通り。

- first-release monitoring baseline は public-first static portal に対して、reachability、deploy verification、auditability、actionable alerting を必須 signal として整理する
- health check は top page、主要 route、主要 asset を含む user-facing reachability を正規経路とする
- deploy 成否の正規証跡は workflow history とし、post-deploy smoke check は staging delivery path の異常検知に接続する
- first-release で reviewable にすべき log は workflow history、cloud-native delivery visibility、audit log を中心にする
- metrics は availability と delivery health を中心にし、deep application telemetry や高粒度 tracing は後段の enhancement として扱う
- alert は site unreachable、failed deploy、major route failure、production cutover 後の operator action 必要イベントを優先し、release blocker 判定は test strategy 側の acceptance rule と接続する
- notification path はツール選定より先に role-based owner と一次対応経路を固定し、current small-team phase では repository owner が release owner を兼ねる前提で無人の通知先を enable しない

この整理案で議論しやすくなること:

- Issue 10 の CI/CD gate と staging deploy verification を monitoring の正規証跡へ接続できる
- Issue 11 の auditability と security-relevant failure を observability の必須範囲へ落とし込める
- Issue 13 は test と post-deploy verification の境界を整理しやすくなる
- Issue 14 は rollback を開始すべき signal と証跡を明示しやすくなる

## Resolution

Issue 12 の判断結果は次の通りとする。

- first-release monitoring baseline は public-first static portal に対して、public reachability、deploy verification、auditability、actionable alerting を必須 signal とする
- health check baseline は top page、主要 route、主要 static asset を含む user-facing reachability を正規経路とする
- deploy 成否の正規証跡は GitHub Actions workflow history とし、staging deploy 後の smoke check failure は delivery path 異常の primary alert signal として扱う
- first-release で reviewable にすべき log は GitHub workflow history、cloud-native delivery visibility、audit log を中心とし、存在しない application log を前提にしない
- first-release の metrics は availability と delivery health を中心とし、deep application telemetry や高粒度 tracing は後段の enhancement として扱う
- alert は site unreachable、failed deploy、major route failure、production cutover 後の operator action 必要イベントを優先し、staging smoke check failure の release blocker 判定そのものは Issue 13 の staging acceptance rule に委ねる
- notification path はツール選定より先に role-based owner と一次対応経路を固定し、current small-team phase では repository owner が release owner を兼ねる前提で、deploy operator と production operator を必要に応じて同報対象にする
- performance degradation は first-release では paging 条件として先行確定せず、記録対象または later-phase enhancement として扱う

この合意で明確になること:

- Issue 10 の workflow boundary に沿って、monitoring evidence と notification path を固定できる
- Issue 13 は smoke test、post-deploy verification、staging acceptance の pass/fail rule を、Issue 12 から切り分けて具体化できる
- Issue 14 は rollback を開始すべき signal、証跡、通知経路をこの Resolution を前提に整理できる

## Process Review Notes

- direct-decision: Section 10 の論点は個別の逐次回答ログを積み上げる形ではなく、requester が monitoring baseline の方向性に合意した後に Resolution へ統合する形で確定した。
- Section 10 の論点テーブルは open question と final wording の対応を後から追跡できるように維持し、3 列目は candidate wording ではなく Resolution に反映された確定文言として扱う。
- Resolution 追加時点では planning / draft 段階として扱い、方針合意の記録と final checkbox review を分離して管理した。その後、再レビュー収束と明示的な close 承認を受けて final review を完了した。

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 12 final review, the local issue record is the primary evidence source. [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) is supporting background and synchronized policy text, not the sole proof of checklist completion.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `ヘルスチェック方法を定義する` | `3. ヘルスチェック方針のたたき台`, `8. first-release monitoring checklist のたたき台`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define the minimum health path, post-deploy checks, and the required user-facing reachability baseline. | Accepted for final review |
| `収集すべきログを定義する` | `4. ログ方針のたたき台`, `Resolution`, and [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) | These sections define the reviewable evidence sources and keep logging scoped to actual first-release triage needs. | Accepted for final review |
| `必要なメトリクスを定義する` | `5. メトリクス方針のたたき台` and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define the minimum metrics focus on availability and delivery health while deferring deep telemetry. | Accepted for final review |
| `アラート条件を定義する` | `6. アラート条件のたたき台`, `10. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define actionable alert conditions, including unreachable site, failed deploy, major route failure, and operator-managed cutover anomalies. | Accepted for final review |
| `通知先を整理する` | `7. 通知先と一次対応経路のたたき台`, `Resolution`, and [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) | These sections define owner-first routing and prohibit enabling unowned notification paths. | Accepted for final review |
| `監視対象一覧を作成する` | `8. first-release monitoring checklist のたたき台`, `9. Issue 10 / 11 / 13 / 14 への接続観点`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections collect the baseline monitoring targets into a reusable first-release list and connect them to downstream issues. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `公開ポータルの到達性を確認するヘルスチェック方法が明示されている` | `3. ヘルスチェック方針のたたき台`, `8. first-release monitoring checklist のたたき台`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define public reachability as a mandatory signal and describe the minimum health-check targets. | Accepted for final review |
| `デプロイ後確認でトップページと主要静的アセットを検証する方針が整理されている` | `3. ヘルスチェック方針のたたき台`, `6. アラート条件のたたき台`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define staging smoke checks and connect post-deploy verification to monitoring and alerting. | Accepted for final review |
| `初回リリースで確認すべきログの参照元と見方が説明されている` | `4. ログ方針のたたき台`, `Resolution`, and [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) | These sections define GitHub workflow history, cloud-native delivery visibility, and audit log as the reviewable evidence sources. | Accepted for final review |
| `可用性と配信正常性を中心にした最小メトリクス方針が整理されている` | `5. メトリクス方針のたたき台` and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections focus metrics on availability and delivery health while deferring nonessential telemetry. | Accepted for final review |
| `サイト到達不可、デプロイ失敗、主要導線障害に対するアラート条件が明示されている` | `6. アラート条件のたたき台`, `10. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define the actionable first-release alert set and keep low-signal noise out of paging. | Accepted for final review |
| `通知先と一次対応者の経路が整理されている` | `7. 通知先と一次対応経路のたたき台` and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections define role-based ownership and the minimum notification routing for staging and production signals. | Accepted for final review |
| `MVP の監視対象一覧として参照できる状態になっている` | `8. first-release monitoring checklist のたたき台`, `9. Issue 10 / 11 / 13 / 14 への接続観点`, and `Resolution` in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sections organize the baseline into a reusable monitoring checklist that downstream issues can reference. | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md), with [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) used as synchronized supporting policy text. The table below records the document-level validation judgment. Explicit human close approval is recorded separately.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Health-check baseline | Satisfied | `3. ヘルスチェック方針のたたき台`, `8. first-release monitoring checklist のたたき台`, and `Resolution` confirm the public reachability path and required targets. |
| Reviewable log sources | Satisfied | `4. ログ方針のたたき台`, `Resolution`, and [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) confirm the minimum evidence sources for deploy, delivery, and audit review. |
| Minimal metrics posture | Satisfied | `5. メトリクス方針のたたき台` and `Resolution` confirm that availability and delivery health are the first-release metric priorities. |
| Actionable alert policy | Satisfied | `6. アラート条件のたたき台`, `10. この場で確認したい論点`, and `Resolution` confirm the required alert signals and preserve operator actionability. |
| Notification ownership | Satisfied | `7. 通知先と一次対応経路のたたき台` and `Resolution` confirm owner-first routing and the no-unowned-notification rule. |
| First-release monitoring checklist | Satisfied | `8. first-release monitoring checklist のたたき台`, `Resolution`, and [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) confirm that the baseline is reusable as a concrete first-release checklist. |
| Downstream planning readiness | Satisfied | `9. Issue 10 / 11 / 13 / 14 への接続観点` and `Resolution` confirm that CI/CD, security, test, and rollback planning can build on this monitoring baseline. |

## Current Status

- [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) を monitoring judgment の同期先として扱う
- local issue file には task contract、discussion draft、resolution、evidence mapping、final review result を追加済み
- first-release monitoring baseline は public reachability、deploy verification、auditability、actionable alerting を必須 signal として確定した
- reviewable log source は GitHub workflow history、cloud-native delivery visibility、audit log を中心とする方針で確定した
- alert は site unreachable、failed deploy、major route failure、production cutover 後の operator action 必要イベントを優先し、performance degradation は first-release paging 条件に含めない方針で確定した
- notification path は role-based owner と一次対応経路を先に固定し、無人の通知先は enable しない方針で確定した
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- GitHub Issue 12 は明示的な close 承認に基づいて close し、Issue 12 は完了と判断する

## Dependencies

- Issue 4
- Issue 7
- Issue 10
- Issue 11
