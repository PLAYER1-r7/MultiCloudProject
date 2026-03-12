## Summary

Issue 61 で preview の repository-owner 集中運用は production-equivalent 条件として維持しないと整理したが、reviewer / approval owner の分離、environment protection rules、release-sensitive change ごとの承認境界は未固定である。このままだと preview で成立した single-owner path を production-equivalent に誤って持ち込みやすい。

## Goal

GCP production-equivalent approval gate と environment protection uplift を整理し、role boundary、protection rules、release gate、non-goals を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-63
- タイトル: GCP production-equivalent approval gate と environment protection uplift を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent governance
- 優先度: 中
- 先行条件: Issue 52 closed, Issue 57 closed, Issue 59 closed, Issue 61 closed

目的
- 解決する問題: preview では repository owner を一次 owner とする簡素な運用で成立したが、production-equivalent では reviewer / approval owner 分離、environment protection rules、release-sensitive gate をどこまで要求するかが未固定のため、承認責務が曖昧なまま残る
- 期待する価値: role boundary、environment protection、approval gate、evidence path を固定し、preview 運用と production-equivalent 運用の承認責務を分離できる

スコープ
- 含むもの: reviewer / approval owner boundary、environment protection rule candidates、release gate、evidence / handoff path、open questions table の作成
- 含まないもの: actual approver assignment、GitHub environment protection live 変更、organization-wide governance redesign、production deploy 実行
- 編集可能パス: docs/portal/issues/issue-63-gcp-production-equivalent-approval-gate-and-environment-protection.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: reviewer / approval owner boundary が文書から一意に読める
- [x] 条件 2: environment protection rules と release gate の責務分離が整理されている
- [x] 条件 3: preview の single-owner path をそのまま流用していない

実装計画
- 変更見込みファイル: docs/portal/issues/issue-63-gcp-production-equivalent-approval-gate-and-environment-protection.md
- アプローチ: docs_agent の reviewer / approval owner guidance、Issue 52 の workflow evidence path、Issue 57 / 59 / 61 の owner judgment を入力に、approval gate uplift を roles / protection / handoff / execution split の 4 観点で整理する
- 採用しなかった代替案と理由: repository owner 集中運用をそのまま維持する案は production-equivalent の release-sensitive boundary を曖昧にするため採らない。逆に live environment protection を先に変更する案は approval design が不足するため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: role wording、protection wording、approval gate wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md、docs/portal/issues/issue-59-gcp-preview-recovery-runbook-and-drill-baseline.md、docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md、docs_agent/ROLE_HANDOFF_OWNERSHIP.md を照合し、role boundary / environment protection / handoff のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: approval gate uplift issue の名目で organization-wide governance redesign まで scope が膨らむこと
- 影響範囲: reviewer burden、approval latency、release governance
- 緩和策: production-equivalent の role / protection / gate に限定し、広域ガバナンス設計は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は reviewer / approval owner boundary と protection rule candidates だけを残し、live implementation は別 issue に切り出す
```

## Tasks

- [x] reviewer / approval owner boundary を整理する
- [x] environment protection rule candidates を整理する
- [x] release gate と evidence handoff path を整理する
- [x] live implementation を切り出す粒度を整理する

## Definition of Done

- [x] reviewer / approval owner boundary が読める
- [x] environment protection と release gate の分離が読める
- [x] live environment change を含めない draft に留まっている

## Initial Notes

- Issue 52 は `portal-gcp-preview-deploy` workflow と deployment evidence path を固定している
- Issue 57 と Issue 59 は preview の owner / recovery handoff を repository owner 中心で固定している
- Issue 61 は production-equivalent では reviewer / approval owner 分離を要求すると整理した

## Issue 63 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `production-equivalent で approval gate と environment protection を何に置くか` に限定する
- actual approver assignment や live environment protection 変更は扱わない
- production deploy 実行は扱わない

### 2. role boundary の第一案

提案:

- `reviewer` は technical completeness、evidence quality、scope match、handoff completeness を確認する役割に留める
- `approval owner` は release-sensitive action を進めてよいかどうかを判断する役割に留める
- preview で成立した repository owner 集中 path は production-equivalent 条件として維持しない

### 3. environment protection rule candidates の第一案

提案:

- production-equivalent environment は manual dispatch 可能であっても reviewer package 完了前には sensitive action を進めない rule を前提にする
- required reviewer 相当の protection、environment-scoped variables / secrets、evidence-linked approval comment を rule candidate にする
- workflow は approval を代行せず、deploy run URL、step summary、deployment record artifact を reviewer / approval owner handoff の起点に留める

### 4. release gate の第一案

提案:

- hostname / DNS change、production-equivalent deploy、rollback、external notification destination change は approval owner judgment が必要な release-sensitive action として扱う
- reviewer package は Issue 52 で固定した deploy evidence path と、Issue 59 walkthrough で確認した recovery evidence path を再利用できる形にする
- approval owner は不足 evidence がある場合、parallel な ad hoc approval path を作らず既存 handoff record 上で差し戻す

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                | 判断方向（Discussion 時点の仮）                                                            | Resolution 確定文言                                                                                                                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reviewer / approval owner の境界を何に置くか        | docs_agent の role handoff guidance を production-equivalent に適用する                    | `reviewer は technical completeness と evidence quality を確認し、approval owner は release-sensitive action の可否を決めるという docs_agent の役割境界を production-equivalent 条件として適用する` |
| preview の single-owner path をどう扱うか           | production-equivalent 条件としては維持しない                                               | `preview の repository-owner 集中運用は retained preview 限定の暫定 path とし、production-equivalent では reviewer / approval owner 分離を要求する`                                                 |
| environment protection rule candidates を何に置くか | required reviewer 相当、environment-scoped secrets、evidence-linked approval を候補にする  | `environment protection rule candidates は required reviewer 相当の保護、environment-scoped secrets / variables、deploy evidence に結びついた approval comment を第一候補にする`                    |
| release-sensitive action を何に置くか               | deploy、hostname / DNS change、rollback、external notification destination change を含める | `release-sensitive action は production-equivalent deploy、hostname / DNS change、rollback、external notification destination change を含み、approval owner judgment を必要とする`                  |
| live protection change をこの issue に含めるか      | no。implementation issue に切り出す                                                        | `GitHub environment protection の live 変更、actual approver assignment、production deploy 実行は本 issue に含めず、必要時は separate implementation issue に切り出す`                              |

## Resolution

Issue 63 の draft judgment は次の通りとする。

- `reviewer` は technical completeness と evidence quality を確認し、`approval owner` は release-sensitive action の可否を決めるという docs_agent の役割境界を production-equivalent 条件として適用する
- preview の repository-owner 集中運用は retained preview 限定の暫定 path とし、production-equivalent では reviewer / approval owner 分離を要求する
- environment protection rule candidates は required reviewer 相当の保護、environment-scoped secrets / variables、deploy evidence に結びついた approval comment を第一候補にする
- release-sensitive action は production-equivalent deploy、hostname / DNS change、rollback、external notification destination change を含み、approval owner judgment を必要とする
- GitHub environment protection の live 変更、actual approver assignment、production deploy 実行は本 issue に含めず、必要時は separate implementation issue に切り出す

この draft で明確になること:

- preview で成立した deploy run URL、step summary、deployment record artifact は、production-equivalent でも reviewer package の核として再利用できる
- approval owner は reviewer の代わりに technical review をやり直すのではなく、review 済み package を前提に release-sensitive action を判断する
- environment protection は単なる UI 設定ではなく、evidence-linked approval path を強制する release gate として扱う
- single-owner shortcut を禁止することで、preview success をそのまま production-equivalent 操作権限へ昇格させない

後続 issue への引き継ぎ事項:

- Issue 62 の hostname / DNS governance judgment と接続し、hostname / DNS change を approval owner judgment 対象として扱う
- Issue 64 では external notification destination change や rollback drill uplift を release-sensitive action として接続する
- live environment protection の実装が必要になった場合は、required reviewers、approval comment、handoff payload を含む separate implementation issue に切り出す

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- docs_agent の role handoff guidance、Issue 52 の workflow evidence path、Issue 57 / 59 の preview owner baseline、Issue 61 の promotion judgment を入力にして draft を具体化した
- 本 issue は approval gate / environment protection judgment の固定であり、live environment protection 変更、actual approver assignment、production deploy 実行は依然として後続 issue の対象である
- CloudSonnet review で確認された prerequisite wording と stale resync wording を修正し、closed record として整合を維持した

## Current Status

- CLOSED
- GitHub Issue: #63
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/63
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- local issue record として approval gate / environment protection uplift draft を追加した
- reviewer / approval owner 分離、release-sensitive action、environment protection rule candidates を production-equivalent judgment として追記した

## Dependencies

- Issue 52
- Issue 57
- Issue 59
- Issue 61
