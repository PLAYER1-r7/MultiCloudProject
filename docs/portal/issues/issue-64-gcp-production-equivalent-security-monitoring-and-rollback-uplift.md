## Summary

Issue 58 から Issue 60 で retained preview の monitoring、recovery、security hardening は成立したが、production-equivalent へ進むには notification destination、Cloud Armor tuning、credential rotation、rollback drill depth をどこまで引き上げるかが未固定である。このままだと preview baseline をそのまま production-equivalent に誤用しやすい。

## Goal

GCP production-equivalent security / monitoring / rollback uplift を整理し、uplift targets、owner、evidence、non-goals を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-64
- タイトル: GCP production-equivalent security / monitoring / rollback uplift を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent operations uplift
- 優先度: 中
- 先行条件: Issue 58 closed, Issue 59 closed, Issue 60 closed, Issue 61 closed

目的
- 解決する問題: retained preview の monitoring / recovery / security baseline は成立したが、notification destination、Cloud Armor tuning、credential rotation、rollback drill depth を production-equivalent 期待値までどう引き上げるかが未固定のため、運用 readiness を誤読しやすい
- 期待する価値: uplift target、owner、evidence path、execution split を明文化し、preview baseline と production-equivalent uplift の差分を保ったまま次段判断できる

スコープ
- 含むもの: notification destination uplift、Cloud Armor tuning candidate、credential rotation / governance uplift、rollback drill depth、open questions table の作成
- 含まないもの: live notification routing change、Cloud Armor deep tuning 実行、credential rotation 実行、destructive rollback 実装
- 編集可能パス: docs/portal/issues/issue-64-gcp-production-equivalent-security-monitoring-and-rollback-uplift.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: preview baseline と production-equivalent uplift の差分が文書から一意に読める
- [x] 条件 2: monitoring、security、rollback uplift の責務分離が整理されている
- [x] 条件 3: live hardening / rollback execution を含めない draft に留まっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-64-gcp-production-equivalent-security-monitoring-and-rollback-uplift.md
- アプローチ: Issue 58、Issue 59、Issue 60、Issue 61 を入力に、production-equivalent uplift を monitoring / security / rollback / governance の 4 観点で整理する
- 採用しなかった代替案と理由: preview baseline をそのまま production-equivalent readiness とみなす案は uplift gap を隠すため採らない。逆に live tuning や live routing 変更へ直行する案は judgment が不足するため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: uplift wording、owner wording、evidence wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-58-gcp-preview-monitoring-alert-implementation.md、docs/portal/issues/issue-59-gcp-preview-recovery-runbook-and-drill-baseline.md、docs/portal/issues/issue-60-gcp-preview-security-hardening-implementation.md、docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md を照合し、monitoring / security / rollback uplift のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: uplift issue の名目で production security program や 24x7 on-call 体制まで scope が膨らむこと
- 影響範囲: security posture、alert routing、rollback expectation、operator burden
- 緩和策: production-equivalent uplift target に限定し、live execution と広域プログラムは follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は monitoring notification、credential rotation、rollback drill depth の比較に絞り、live 実装は別 issue に切り出す
```

## Tasks

- [x] monitoring notification uplift を整理する
- [x] Cloud Armor と credential governance uplift を整理する
- [x] rollback drill depth と evidence path uplift を整理する
- [x] live implementation を切り出す粒度を整理する

## Definition of Done

- [x] preview baseline と production-equivalent uplift の差分が読める
- [x] monitoring / security / rollback uplift の分離が読める
- [x] live execution を含めない draft に留まっている

## Initial Notes

- Issue 58 は preview route `/`, `/overview`, `/guidance` に対する uptime checks と alert policies を live 適用した
- Issue 59 は operator-reviewed walkthrough を 2026-03-09 に実施し、artifact-path failure 起点の非破壊 recovery path を確認した
- Issue 60 は response header hardening と preview credential / audit governance を fixed した
- Issue 61 は notification destination、Cloud Armor tuning、credential governance、rollback drill uplift を separate follow-up として切り出した

## Issue 64 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `production-equivalent 向けに security / monitoring / rollback をどこまで uplift するか` に限定する
- live notification routing change、Cloud Armor deep tuning 実行、credential rotation 実行は扱わない
- destructive rollback 実装は扱わない

### 2. monitoring uplift の第一案

提案:

- preview の canonical first-response path は維持しつつ、production-equivalent では owner-bound optional email より強い reviewed external notification destination を別判断対象にする
- monitored paths は `/`, `/overview`, `/guidance` の preview baseline を入力にするが、それだけで production-equivalent coverage 完了とはみなさない
- acknowledgment と escalation も reviewer / approval owner path に紐づく evidence として残す

### 3. security uplift の第一案

提案:

- current response header hardening を minimum baseline とし、Cloud Armor rule-depth と credential rotation cadence を追加判断対象にする
- preview の environment-scoped credential governance は維持しつつ、rotation と ownership review を production-equivalent 条件として要求する
- audit evidence path は deploy evidence、resource evidence、monitoring state を同一 review path に残す前提を維持する

### 4. rollback uplift の第一案

提案:

- Issue 59 の walkthrough 1 回完了を baseline とし、production-equivalent では rollback drill depth を non-destructive tabletop 以上へ引き上げる判断を要求する
- rollback plan は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐を reviewer package 上で追えることを要求する
- destructive rollback や live destroy は execution boundary issue へ残す

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                   | 判断方向（Discussion 時点の仮）                                                       | Resolution 確定文言                                                                                                                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| notification destination uplift を何に置くか           | deploy evidence path を維持しつつ、reviewed external destination を別 judgment にする | `notification destination uplift は preview の deploy evidence path を維持しつつ、owner-bound optional email だけで完結させず、reviewed external destination と escalation path を別 judgment として要求する`      |
| Cloud Armor tuning をどう扱うか                        | reviewed attachment 維持に加え、rule-depth を追加判断対象にする                       | `Cloud Armor は reviewed attachment 維持だけでは production-equivalent 完了とせず、rule-depth tuning と false-positive / fail-closed boundary を separate uplift judgment として要求する`                          |
| credential governance uplift を何に置くか              | environment scope を維持しつつ rotation と ownership review を追加する                | `credential governance uplift は environment-scoped secret/variable boundary を維持しつつ、rotation cadence、owner review、cleanup trigger を production-equivalent 条件として追加する`                            |
| rollback drill depth を何に置くか                      | walkthrough 1 回完了を超える drill 深度を要求する                                     | `rollback uplift は Issue 59 の walkthrough 1 回完了を baseline とし、production-equivalent では same-evidence redeploy、resource correction、hostname / DNS rollback 分岐を含む drill depth の追加判断を要求する` |
| live tuning / live routing 変更をこの issue に含めるか | no。implementation issue に切り出す                                                   | `live notification routing change、Cloud Armor deep tuning 実行、credential rotation 実行、destructive rollback 実装は本 issue に含めず、必要時は separate implementation issue に切り出す`                        |

## Resolution

Issue 64 の draft judgment は次の通りとする。

- notification destination uplift は preview の deploy evidence path を維持しつつ、owner-bound optional email だけで完結させず、reviewed external destination と escalation path を別 judgment として要求する
- Cloud Armor は reviewed attachment 維持だけでは production-equivalent 完了とせず、rule-depth tuning と false-positive / fail-closed boundary を separate uplift judgment として要求する
- credential governance uplift は environment-scoped secret/variable boundary を維持しつつ、rotation cadence、owner review、cleanup trigger を production-equivalent 条件として追加する
- rollback uplift は Issue 59 の walkthrough 1 回完了を baseline とし、production-equivalent では same-evidence redeploy、resource correction、hostname / DNS rollback 分岐を含む drill depth の追加判断を要求する
- live notification routing change、Cloud Armor deep tuning 実行、credential rotation 実行、destructive rollback 実装は本 issue に含めず、必要時は separate implementation issue に切り出す

この draft で明確になること:

- preview で十分だった deploy evidence path 中心の first-response は、production-equivalent では escalation destination と owner review を追加した運用に引き上げる必要がある
- response header hardening と Cloud Armor attachment は minimum baseline に留まり、rule-depth と credential rotation が未判断のままでは readiness 完了とみなさない
- Issue 59 walkthrough は有効な基礎証跡だが、production-equivalent rollback では分岐ごとの drill 深度を追加で要求する
- live hardening や live routing 変更をこの issue から外すことで、judgment と implementation を混線させない

後続 issue への引き継ぎ事項:

- Issue 63 の approval gate と接続し、external destination change と rollback judgment を approval owner 対象として扱う
- Issue 65 では hostname / DNS rollback を含む execution boundary と evidence retention を別 issue として扱う
- live notification routing change、Cloud Armor tuning、credential rotation 実行が必要になった場合は、current uplift judgment を壊さず separate implementation issue を切り出す

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- Issue 58 の monitoring live state、Issue 59 の walkthrough record、Issue 60 の hardening baseline、Issue 61 の uplift split を入力にして draft を具体化した
- 本 issue は security / monitoring / rollback uplift judgment の固定であり、live notification routing change、Cloud Armor deep tuning、credential rotation 実行、destructive rollback 実装は依然として後続 issue の対象である
- CloudSonnet review で確認された prerequisite wording と stale resync wording を修正し、closed record として整合を維持した

## Current Status

- CLOSED
- GitHub Issue: #64
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/64
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- local issue record として security / monitoring / rollback uplift draft を追加した
- preview baseline と production-equivalent uplift の差分として notification destination、Cloud Armor tuning、credential rotation、rollback drill depth を追記した

## Dependencies

- Issue 58
- Issue 59
- Issue 60
- Issue 61
