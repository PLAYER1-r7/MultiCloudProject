## Summary

Issue 47 で GCP support の first step は preview/static delivery proof として固定され、Issue 50 から Issue 53 で preview deploy workflow、operator handoff、resource output surface の contract も整理された。しかし現時点では、`preview.gcp.ashnova.jp` の first-response signal、どの evidence path を一次確認の正規経路とするか、誰が notification owner で、どこまでを GCP preview monitoring / alert routing baseline として扱うかが current issue chain として固定されていない。このままだと、failed preview deploy、route reachability failure、pending certificate / target state、operator hold 条件に対する初動が operator memory に依存しやすい。

## Goal

GCP monitoring / alert routing baseline の議論たたき台を作り、preview path の user-facing signal、operator-facing evidence、notification owner、first-response path、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-55
- タイトル: GCP monitoring / alert routing baseline を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP preview operations planning
- 優先度: 中
- 先行条件: Issue 12 closed, Issue 47 resolved, Issue 48 resolved, Issue 49 resolved, Issue 50 resolved, Issue 51 resolved, Issue 52 resolved, Issue 53 resolved

目的
- 解決する問題: GCP preview deploy と resource execution の contract は fixed したが、preview path の current monitoring signal、first-response evidence path、notification owner、alert routing boundary が未固定のままだと、preview failure が起きた際の初動と escalation の責務境界が曖昧なまま残る
- 期待する価値: `preview.gcp.ashnova.jp` を主語にした user-facing signal、workflow / resource execution evidence、notification owner、first-response path を minimum monitoring / alert routing baseline として整理し、Issue 52 / 53 implementation と DNS/operator handoff が参照できる current wording を作れる

スコープ
- 含むもの: preview reachability signal、major route / static asset verification の前提、workflow / resource execution evidence path、notification owner baseline、first-response alert routing、supporting diagnostics、open questions table の作成
- 含まないもの: provider-specific alert product 実装、external delivery channel 実装、24x7 on-call 体制、dashboard 作成、SLO/SLI 数値確定、automatic escalation 実装
- 編集可能パス: docs/portal/issues/issue-55-gcp-monitoring-alert-routing-baseline.md
- 制限パス: apps/portal-web/**, infra/**, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview monitoring signal と first-response path が文書から一意に読める
- [ ] 条件 2: notification owner、operator handoff、supporting diagnostics の責務分離が整理されている
- [ ] 条件 3: alert tooling 実装や 24x7 on-call depth を混ぜず、preview operations baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-55-gcp-monitoring-alert-routing-baseline.md
- アプローチ: Issue 12 の monitoring policy、Issue 47 の observability judgment、Issue 50 から Issue 53 の workflow/resource evidence contract、Issue 51 の operator memo を接続し、GCP preview monitoring / alert routing baseline を signal、owner、evidence path の 3 観点で整理する
- 採用しなかった代替案と理由: Cloud Monitoring / Pub/Sub / chat integration まで同時に決める案は owner と fail-closed boundary が未固定のまま実装論へ寄りやすいため採らない。逆に monitoring を workflow success/failure のみで済ませる案も user-facing availability を主語にする Issue 47 judgment とずれるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: monitoring signal wording、notification owner wording、first-response path wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md、docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md を照合し、signal、owner、evidence path、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: monitoring / alert routing baseline の記録が provider-specific alert tooling 実装済み、または 24x7 対応前提と誤読されること
- 影響範囲: GCP preview first response、operator handoff、DNS/certificate incident triage quality
- 緩和策: wording を preview public URL、major route verification、artifact / resource evidence、notification owner、supporting diagnostics に限定し、alert delivery tooling と staffing depth は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は signal set と first-response path だけを残し、tooling integration や external delivery channel は別 issue に切り出す
```

## Tasks

- [x] GCP preview monitoring signal を整理する
- [x] notification owner と first-response path を整理する
- [x] supporting diagnostics と operator handoff を整理する
- [x] monitoring / alert routing の非対象と open questions を整理する

## Definition of Done

- [x] preview public URL、major route、static asset を主語にした signal set が読める
- [x] notification owner と first-response evidence path が読める
- [x] supporting diagnostics と operator hold 条件の扱いが読める
- [x] provider-specific alert tooling と staffing depth が本 issue 非対象として維持されている

## Initial Notes

- Issue 12 は first-release monitoring baseline として user-facing health、deploy verification、auditability、notification path を優先する方針を置いている
- Issue 47 は GCP 側の security / observability baseline でも provider resource 名ではなく user-facing availability と reviewable evidence path を主語にする judgment を fixed している
- Issue 50 は preview deploy baseline として shared build artifact reuse、manual dispatch、preview evidence 出力を固定している
- Issue 51 は reviewed target reference と certificate-related reference を external DNS operator へ handoff する boundary を fixed している
- Issue 52 は preview public URL、reviewed target reference、certificate-related reference、run URL を operator handoff evidence として残す contract を fixed している
- Issue 53 は preview public URL、reviewed target reference、certificate-related reference、selected environment entrypoint reference を resource execution output として残す contract を fixed している

## Issue 55 Discussion Draft

このセクションは、GCP monitoring / alert routing baseline を議論するためのたたき台である。ここで決めたいのは preview path の first-response baseline であり、まだ決めないのは provider-specific alert tooling、external delivery channel、24x7 on-call、automatic escalation である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `preview.gcp.ashnova.jp の異常を何の signal で捉え、どの evidence path と owner で一次対応するか` に限定する
- user-facing signal と operator-facing evidence を分ける
- first-response path と later-phase alert delivery を分ける

### 2. monitoring signal の第一案

提案:

- primary signal は preview public URL の reachability と major route `/`、`/overview`、`/guidance` の応答確認に置く
- static asset load success と selected commit / artifact 整合も reviewable signal に含める
- provider control-plane status は primary signal ではなく supporting diagnostics とする

### 3. first-response evidence path の第一案

提案:

- `portal-gcp-preview-deploy` run URL、step summary、deploy evidence artifact を first-response の正規経路にする
- `resource_execution_reference` と selected environment entrypoint reference を supporting evidence に含める
- reviewed target reference と certificate-related reference は DNS/operator triage の supporting path として扱う

### 4. notification owner と alert routing の第一案

提案:

- current small-team phase では repository owner を一次 notification owner の第一候補にする
- deploy operator と DNS/operator reviewer は preview failure の種別に応じて同じ review path に接続する
- owner 未定の notification destination は enable 前提にしない

### 5. supporting diagnostics と operator hold 条件の第一案

提案:

- pending certificate / target state、reviewed target mismatch、resource execution evidence 欠落は operator hold 条件として明示する
- DNS resolution、certificate provisioning state、load balancer / CDN wiring は supporting diagnostics として整理する
- monitoring wording は provider metric 名ではなく user-facing availability failure を主語にする

### 6. alert scope boundary の第一案

提案:

- failed preview deploy、major route failure、preview public URL unreachable、certificate / target hold condition を first-step の中心 signal にする
- performance degradation や broad telemetry fan-out は first-step paging 条件に含めない
- preview proof の段階では production-grade 24x7 alerting を求めない

### 7. 今回は決めないこと

- Cloud Monitoring / alert policy 実装
- Pub/Sub、mail、chat など external delivery channel 実装
- 24x7 on-call と numeric SLO / SLI
- dashboard 作成と broad telemetry expansion
- automatic remediation / escalation

### 8. 後続 issue とどう接続するか

- workflow implementation step は preview deploy evidence を first-response path として出力する
- resource execution step は selected environment entrypoint reference と blocked pending state を monitoring triage に引き渡す
- rollback follow-up は同じ signal と evidence path を起点に restore / revalidation を定義する

### 9. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                     | 判断方向（Discussion 時点の仮）                                                              | Resolution 確定文言                                                                                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| GCP preview monitoring の primary signal を何に置くか    | preview public URL と major route reachability を第一候補にする                              | `GCP preview monitoring の primary signal は preview public URL と major route `/`、`/overview`、`/guidance` の reachability を第一候補にする` |
| first-response evidence path を何に置くか                | preview deploy run URL、step summary、deploy evidence artifact を正規経路にする              | `first-response evidence path は preview deploy run URL、step summary、deploy evidence artifact を正規経路とする`                              |
| notification owner を誰に置くか                          | repository owner を一次 owner の第一候補にし、deploy/DNS operator を supporting owner とする | `notification owner は repository owner を一次 owner の第一候補にし、deploy operator と DNS/operator reviewer を supporting owner とする`      |
| provider control-plane state をどう扱うか                | supporting diagnostics として扱い、primary signal にはしない                                 | `provider control-plane state は supporting diagnostics として扱い、primary signal にはしない`                                                 |
| pending certificate / target state をどう扱うか          | operator hold 条件として明示し、triage path に接続する                                       | `pending certificate / target state は operator hold 条件として明示し、first-response triage path に接続する`                                  |
| alert tooling / external delivery channel を今回含めるか | no。owner と first-response path の固定に留める                                              | `provider-specific alert tooling と external delivery channel 実装は本 issue に含めず、owner と first-response path の固定に留める`            |

## Resolution

Issue 55 の判断結果は次の通りとする。

- GCP preview monitoring の primary signal は preview public URL と major route `/`、`/overview`、`/guidance` の reachability を第一候補にする
- first-response evidence path は preview deploy run URL、step summary、deploy evidence artifact を正規経路とする
- notification owner は repository owner を一次 owner の第一候補にし、deploy operator と DNS/operator reviewer を supporting owner とする
- provider control-plane state は supporting diagnostics として扱い、primary signal にはしない
- pending certificate / target state は operator hold 条件として明示し、first-response triage path に接続する
- provider-specific alert tooling と external delivery channel 実装は本 issue に含めず、owner と first-response path の固定に留める

この合意で明確になること:

- GCP preview monitoring の主語は workflow success/failure 単体ではなく、preview public URL と major route の user-facing availability に置かれる
- first-response 時は preview deploy evidence と resource execution reference を同じ review path でたどれるため、build / deploy / infra / DNS のどこで止まっているかを切り分けやすくなる
- notification owner と supporting owner を先に固定することで、owner 未定の通知先や broad fan-out を前提にしない fail-closed な alert routing baseline を維持できる
- pending certificate / target hold condition は monitoring 上も明示的に扱われるため、blocked pending state と handoff-possible state を operator が区別しやすくなる
- provider control-plane state は supporting diagnostics に留めるため、Issue 47 の user-facing availability 主語を崩さずに triage を組み立てられる

後続 issue への引き継ぎ事項:

- workflow implementation step では preview deploy run URL、step summary、deploy evidence artifact を first-response path として出力する
- resource execution step では selected environment entrypoint reference、reviewed target reference、certificate-related reference、blocked pending state を monitoring triage に接続する
- security baseline では release blocker と operator hold 条件の security side を継続管理する
- rollback and recovery memo では同じ signal set と evidence path を restore / revalidation の起点として扱う

## Process Review Notes

- Section 9 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は preview monitoring / alert routing baseline の固定であり、Cloud Monitoring、external delivery channel、24x7 on-call、automatic escalation は依然として後続 issue の対象である
- GitHub Issue #55 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED
- GitHub Issue: #55
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/55
- Sync Status: local resolution updated and GitHub issue body resynced

- local issue record として GCP monitoring / alert routing baseline の議論たたき台を追加した
- preview failure signal、notification owner、first-response path、operator hold 条件を Resolution として固定した
- implementation work は未実施であり、次段は workflow / resource execution evidence の実装と rollback path への接続である

## Dependencies

- Issue 12
- Issue 47
- Issue 48
- Issue 49
- Issue 50
- Issue 51
- Issue 52
- Issue 53
