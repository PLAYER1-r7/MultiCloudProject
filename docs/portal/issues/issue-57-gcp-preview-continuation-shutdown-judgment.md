## Summary

Issue 47 から Issue 56 で GCP preview の design、resource、workflow、security、monitoring、rollback baseline は一通り揃い、`preview.gcp.ashnova.jp` も live validation まで完了した。一方で、preview 環境をこのまま継続運用するのか、一定期間後に停止するのか、停止する場合の証跡保持と cleanup boundary をどこに置くのかは未判断である。このままだと、cost、owner、monitoring expectation、credential lifetime、environment retention が曖昧なままになる。

## Goal

GCP preview 環境の continuation / shutdown judgment を整理し、継続条件、停止条件、owner、retention、cleanup boundary、証跡保持を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-57
- タイトル: GCP preview continuation / shutdown judgment を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview operations judgment
- 優先度: 中
- 先行条件: Issue 47 closed, Issue 48 closed, Issue 49 closed, Issue 50 closed, Issue 51 closed, Issue 52 closed, Issue 53 closed, Issue 54 closed, Issue 55 closed, Issue 56 closed

目的
- 解決する問題: GCP preview path は live validation まで到達したが、この preview 環境を継続運用するのか、検証完了後に停止するのか、停止時にどの evidence と resource を残すのかが未固定のため、cost / owner / retention / cleanup boundary が曖昧なまま残る
- 期待する価値: continuation 条件、shutdown trigger、retention 期間、owner、cleanup 非対象、evidence preservation を固定し、preview 環境を意図どおりに維持または停止できる

スコープ
- 含むもの: preview continuation criteria、shutdown trigger、resource retention、evidence retention、owner、cleanup boundary、open questions table の作成
- 含まないもの: live cleanup 実行、resource destroy 実行、credential rotation 実行、monitoring 実装、production promotion 実行
- 編集可能パス: docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md
- 制限パス: apps/portal-web/**, infra/**, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: preview continuation と shutdown の判断条件が文書から一意に読める
- [x] 条件 2: owner、retention、cleanup boundary、evidence preservation の責務分離が整理されている
- [x] 条件 3: 実 destroy や live cleanup を混ぜず、judgment issue に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md
- アプローチ: Issue 52 と Issue 53 の live validation 結果、Issue 54 から Issue 56 の運用 baseline、現在の `gcp-preview` environment と preview URL の live state を入力に、継続条件と停止条件を owner / cost / evidence / cleanup の 4 観点で整理する
- 採用しなかった代替案と理由: preview を放置する案は ownership と cost が曖昧になるため採らない。逆に即時 destroy を前提にする案も再検証・handoff の余地を失うため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: continuation criteria wording、shutdown trigger wording、owner / retention wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md、docs/portal/issues/issue-54-gcp-security-baseline.md、docs/portal/issues/issue-55-gcp-monitoring-alert-routing-baseline.md、docs/portal/issues/issue-56-gcp-preview-rollback-and-recovery-memo.md を照合し、live-state retention と next-step judgment のどちらが欠けているかを分ける

リスクとロールバック
- 主なリスク: continuation / shutdown judgment が未固定のまま残り、preview 環境が owner 不明・期限不明・cleanup 不明の状態で放置されること
- 影響範囲: GCP cost、GitHub environment retention、preview URL availability expectation、evidence traceability
- 緩和策: judgment を continuation criteria、shutdown trigger、evidence preservation、cleanup boundary に分け、destroy 実行は follow-up issue に残す
- ロールバック手順: scope が広がりすぎた場合は continuation criteria、shutdown trigger、owner だけを残し、destroy 実行計画は別 issue に切り出す
```

## Tasks

- [x] preview continuation criteria を整理する
- [x] shutdown trigger と retention boundary を整理する
- [x] owner と evidence preservation path を整理する
- [x] cleanup を別 issue 化すべき粒度を整理する

## Definition of Done

- [x] preview continuation / shutdown の判断条件が 1 文書で追える
- [x] owner、retention、evidence preservation、cleanup boundary が読める
- [x] live cleanup 実行を本 issue 非対象として維持できている
- [x] follow-up issue へ分割しやすい open questions table が用意されている

## Initial Notes

- Issue 52 と Issue 53 により、preview deploy と preview infra は live validation まで到達している
- Issue 54 から Issue 56 により、security、monitoring、rollback の baseline は fixed 済みだが、実装や継続可否までは固定していない
- `gcp-preview` GitHub environment と GCP preview resource は live state を持つため、維持か停止かの判断を後回しにすると ownership が曖昧になる

## Issue 57 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview 環境を継続運用するか、停止するか、その判断基準を何に置くか` に限定する
- live destroy や credential cleanup は扱わない
- production promotion の可否判断は別 issue に分離する

### 2. continuation criteria の第一案

提案:

- 継続条件は、再検証需要、運用 owner、cost ceiling、security baseline 維持、monitoring 実装計画の有無で判断する
- 一時検証用として役割を終えた場合は shutdown 候補にする
- owner と retention 期限が未設定なら indefinite continuation を許可しない

### 3. shutdown trigger と retention の第一案

提案:

- shutdown trigger は preview purpose 完了、owner 不在、cost ceiling 超過、security / monitoring baseline 未実装の長期化を候補にする
- shutdown 前に artifact / deploy evidence / resource output / DNS target reference を保存する
- retention 期間は preview 継続判断と同時に固定する

### 4. cleanup boundary の第一案

提案:

- cleanup は resource destroy、GitHub environment secret / variable 整理、operator handoff evidence 保持の 3 単位に分ける
- live cleanup 実行は別 execution issue として扱う
- closed issue record と deployment evidence artifact は cleanup 対象に含めない

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                 | 判断方向（Discussion 時点の仮）                                                              | Resolution 確定文言                                                                                                                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| preview を継続運用するか             | yes。ただし indefinite continuation ではなく timeboxed retained preview とする               | `GCP preview 環境は即時 shutdown せず、Issue 58 から Issue 60 の first-pass judgment / implementation を進めるための retained preview として 2026-03-31 まで継続する`                |
| continuation 条件を何に置くか        | owner、timebox、cost ceiling、follow-up issue の進捗を前提にする                             | `preview continuation の条件は repository owner を一次 owner とし、2026-03-31 の retention deadline、cost anomaly がないこと、Issue 58 から Issue 60 に着手していることを前提にする` |
| shutdown trigger を何に置くか        | purpose 完了、deadline 到来、owner 不在、cost / security 異常を候補にする                    | `shutdown trigger は preview purpose 完了、2026-03-31 の retention deadline 到来、owner 不在、cost anomaly、security blocker、monitoring 未整備の長期化とする`                       |
| evidence retention は何を残すか      | build / deploy evidence、resource outputs、DNS / certificate reference、issue records を残す | `shutdown 前に build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、closed issue records を保持する`                                 |
| live cleanup をこの issue に含めるか | no。cleanup execution は別 issue に分ける                                                    | `live cleanup、resource destroy、GitHub environment credential cleanup は本 issue に含めず、必要時は separate execution issue に切り出す`                                            |

## Resolution

Issue 57 の判断結果は次の通りとする。

- GCP preview 環境は即時 shutdown せず、Issue 58 から Issue 60 の first-pass judgment / implementation を進めるための retained preview として 2026-03-31 まで継続する
- preview continuation の条件は repository owner を一次 owner とし、2026-03-31 の retention deadline、cost anomaly がないこと、Issue 58 から Issue 60 に着手していることを前提にする
- shutdown trigger は preview purpose 完了、2026-03-31 の retention deadline 到来、owner 不在、cost anomaly、security blocker、monitoring 未整備の長期化とする
- shutdown 前に build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、closed issue records を保持する
- live cleanup、resource destroy、GitHub environment credential cleanup は本 issue に含めず、必要時は separate execution issue に切り出す

この合意で明確になること:

- 現在の GCP preview は indefinite に放置せず、follow-up issue を前に進めるための retained preview として timebox 付きで保持される
- preview の owner は repository owner に固定され、owner 不在のまま継続する状態を許可しない
- retention deadline と shutdown trigger が明示されたため、monitoring / security / recovery follow-up が停滞した場合の停止判断を曖昧にしない
- cleanup は destroy 実行と証跡保持を分けて扱うため、evidence を消した後に原因追跡できなくなる状態を避けられる
- production promotion judgment は継続運用と切り分けられ、preview success をそのまま production readiness と誤読しない

後続 issue への引き継ぎ事項:

- Issue 58 では retained preview を前提に monitoring / alert implementation を live path へ接続する
- Issue 59 では retained preview 期間中に参照すべき recovery runbook と drill cadence を固定する
- Issue 60 では retained preview の security hardening scope と credential / evidence governance を固定する
- 2026-03-31 までに preview shutdown が必要になった場合は、resource destroy、GitHub environment cleanup、evidence retention checklist を separate execution issue として切り出す
- Issue 61 は preview retained state を前提に production-equivalent promotion の prerequisites を別 judgment として扱う

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は continuation / shutdown の条件固定であり、live cleanup 実行、resource destroy、credential cleanup、production promotion は依然として後続 issue の対象である
- GitHub Issue #57 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- ISSUE CLOSED
- GitHub Issue: #57
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/57
- Sync Status: local close note updated and GitHub issue body resynced before closing
- Close Status: GitHub issue closed; local record retained as final reference

- local issue record として continuation / shutdown judgment を固定した
- retained preview としての継続判断、retention deadline、shutdown trigger、owner、evidence preservation を Resolution として固定した
- live cleanup 実行は別 execution issue に切り分ける boundary を維持した

## Dependencies

- Issue 47
- Issue 48
- Issue 49
- Issue 50
- Issue 51
- Issue 52
- Issue 53
- Issue 54
- Issue 55
- Issue 56
