## Summary

Issue 47 で GCP support の first step は preview/static delivery proof に限定され、Issue 52 と Issue 53 で preview deploy と resource execution の fail-closed contract も fixed された。しかし現時点では、failed preview deploy、wrong reviewed target、pending certificate / target state、preview route failure が起きた際に、何を rollback unit として扱い、どの evidence path を見て、どこまでを restore 完了と判断するかが current issue chain として固定されていない。このままだと、preview path の recovery が ad hoc operator judgment に寄り、artifact restore、resource correction、DNS/operator step rollback の境界が曖昧なまま残る。

## Goal

GCP preview rollback and recovery memo の議論たたき台を作り、preview path の rollback unit、trigger、operator restore sequence、post-recovery verification、non-goals、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-56
- タイトル: GCP preview rollback and recovery memo を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP preview recovery planning
- 優先度: 中
- 先行条件: Issue 14 closed, Issue 47 resolved, Issue 49 resolved, Issue 50 resolved, Issue 51 resolved, Issue 52 resolved, Issue 53 resolved

目的
- 解決する問題: GCP preview deploy と resource execution の実装単位は見えたが、preview failure や operator hold 条件が起きた際に何を rollback unit とみなし、どの evidence を見て、何をもって recovery 完了とするかが未固定のままだと、preview proof の失敗時に restore judgment が場当たり化しやすい
- 期待する価値: GCP preview path の artifact rollback、resource correction、DNS/operator rollback boundary、post-recovery verification を small-team で実行できる memo として整理し、Issue 52 / 53 implementation の stop condition と recovery path を接続できる

スコープ
- 含むもの: preview rollback unit の整理、rollback trigger 候補、operator restore / recovery sequence、post-recovery verification、evidence synchronization、open questions table の作成
- 含まないもの: automatic rollback 実装、Cloud DNS / DNS provider automation、production cutover rollback、incident command 体制、runtime app state recovery、OpenTofu module 実装変更
- 編集可能パス: docs/portal/issues/issue-56-gcp-preview-rollback-and-recovery-memo.md
- 制限パス: apps/portal-web/**, infra/**, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview rollback unit と restore sequence が文書から一意に読める
- [ ] 条件 2: artifact rollback、resource correction、DNS/operator rollback boundary の責務分離が整理されている
- [ ] 条件 3: automatic rollback や production recovery depth を混ぜず、preview recovery memo に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-56-gcp-preview-rollback-and-recovery-memo.md
- アプローチ: Issue 14 の rollback policy、Issue 47 の preview proof judgment、Issue 49 の IaC contract、Issue 50 から Issue 53 の workflow/resource execution contract を接続し、GCP preview rollback and recovery memo を rollback unit、restore sequence、verification の 3 観点で整理する
- 採用しなかった代替案と理由: failure 発生後に都度 rollback 手順を決める案は preview proof の stop condition を弱めるため採らない。逆に production-grade runbook や automation depth まで同一 issue に含める案も first-step preview recovery memo としては重すぎるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: rollback unit wording、restore sequence wording、verification wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-14-rollback-policy.md、docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md、docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md、docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md を照合し、rollback unit、trigger、verification、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: recovery memo の記録が automatic rollback 実装済み、または preview ではなく production 相当の recovery guarantee を repo が持つかのように誤読されること
- 影響範囲: preview failure containment、operator restore judgment、DNS/operator handoff quality
- 緩和策: wording を rollback unit、restore sequence、post-recovery verification、evidence path に限定し、automation depth と production recovery path は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は artifact rollback と verification checklist だけを残し、deep incident response や automation design は別 issue に切り出す
```

## Tasks

- [x] GCP preview rollback unit を整理する
- [x] rollback trigger と operator restore sequence を整理する
- [x] post-recovery verification と evidence path を整理する
- [x] rollback / recovery memo の非対象と open questions を整理する

## Definition of Done

- [x] artifact rollback、resource correction、DNS/operator rollback boundary が読める
- [x] rollback trigger と operator restore / hold 条件が読める
- [x] post-recovery verification と evidence synchronization が読める
- [x] automatic rollback と production recovery depth が本 issue 非対象として維持されている

## Initial Notes

- Issue 14 は artifact / infrastructure / DNS / access / verification の rollback unit を分ける baseline を固定している
- Issue 47 は first GCP step の成功条件を architecture proof と preview delivery proof に置き、rollback は provider product 名より user-facing availability と reviewable evidence を主語にする judgment を fixed している
- Issue 49 は OpenTofu backend judgment と environment separation を fixed しており、resource correction は IaC contract に戻す前提で考える必要がある
- Issue 50 は preview deploy baseline として shared build artifact reuse、manual dispatch、preview evidence path を固定している
- Issue 51 は external DNS authoritative write を operator manual step に残し、reviewed target reference と certificate-related reference を handoff する boundary を fixed している
- Issue 52 は artifact provenance mismatch、resource execution evidence 欠落、pending certificate / target hold 条件では deploy を開始せず fail-closed に止める contract を fixed している
- Issue 53 は blocked pending state を execution completed と扱わず、operator/workflow handoff へ渡す contract を fixed している

## Issue 56 Discussion Draft

このセクションは、GCP preview rollback and recovery memo を議論するためのたたき台である。ここで決めたいのは preview path の restore / recovery baseline であり、まだ決めないのは automatic rollback、production cutover recovery、incident command、provider-specific tooling automation である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview path の failure をどの rollback unit で containment / restore するか` に限定する
- artifact rollback、resource correction、DNS/operator rollback を分ける
- blocked pending state と execution completed failure を分ける

### 2. rollback unit の第一案

提案:

- application rollback unit は last known-good static artifact または reviewed build artifact reference とする
- resource rollback unit は `infra/environments/gcp-preview/` の reviewed state と usage-oriented outputs を基準にする
- DNS/operator rollback unit は reviewed target reference と operator-applied change record を基準にする

### 3. rollback trigger と hold condition の第一案

提案:

- artifact provenance mismatch、preview public URL unreachable、major route failure、wrong reviewed target、certificate-related hold condition を rollback / recovery 開始候補にする
- blocked pending state は即 destroy ではなく operator hold と recovery planning の起点として扱う
- first apply / first deploy で preview live state が未成立なら、restore より `safe stop + no DNS progression` を優先する

### 4. operator restore sequence の第一案

提案:

- まず preview failure の種別を artifact、resource、DNS/operator handoff のどこに属するか判定する
- artifact 問題なら last known-good artifact reference を使って preview deploy evidence path から restore を検討する
- resource 問題なら reviewed OpenTofu state と output surface を再確認し、ad hoc console fix を正規経路にしない
- DNS/operator 問題なら external DNS manual step の reversal と certificate-related reference の再確認を operator path に残す

### 5. post-recovery verification の第一案

提案:

- recovery 後は preview public URL、major route `/`、`/overview`、`/guidance`、主要 static asset load success を確認する
- reviewed target reference、certificate-related reference、selected commit / artifact reference が一致していることを確認する
- recovery signal は provider resource 名より user-facing availability と reviewable evidence を主語に残す

### 6. evidence synchronization の第一案

提案:

- rollback / recovery 判断は deploy run URL、step summary、deployment evidence artifact、resource_execution_reference を同じ review path に残す
- blocked pending state から recovery へ移る場合も state transition を reviewable に記録する
- preview path に last known-good live state がまだ存在しない段階では `no previous live baseline` を明示した evidence を残す

### 7. 今回は決めないこと

- automatic rollback / remediation 実装
- production cutover rollback や same-hostname rollback
- DNS provider automation
- incident command / 24x7 response
- runtime data recovery や application auth recovery

### 8. 後続 issue とどう接続するか

- workflow implementation step は deploy evidence artifact と selected artifact reference を recovery 起点として出力する
- resource execution step は selected environment entrypoint reference、reviewed target reference、certificate-related reference を recovery evidence に接続する
- monitoring / alert routing follow-up は rollback trigger を first-response signal として使う

### 9. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                             | 判断方向（Discussion 時点の仮）                                                     | Resolution 確定文言                                                                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GCP preview rollback unit を何に分けるか                         | artifact、resource、DNS/operator rollback に分ける                                  | `GCP preview rollback unit は artifact rollback、resource correction、DNS/operator rollback に分ける`                      |
| blocked pending state をどう扱うか                               | execution completed failure と分け、operator hold と recovery planning の起点にする | `blocked pending state は execution completed failure と分け、operator hold と recovery planning の起点として扱う`         |
| first deploy / first apply で live baseline がない場合どうするか | safe stop と no DNS progression を優先する                                          | `first deploy / first apply で live baseline がない場合は restore より safe stop と no DNS progression を優先する`         |
| resource rollback の正規経路を何に置くか                         | reviewed OpenTofu state と output surface に戻す                                    | `resource rollback の正規経路は reviewed OpenTofu state と usage-oriented output surface に戻すことに置く`                 |
| post-recovery verification を何に置くか                          | preview public URL、major route、asset load、reference 整合を第一候補にする         | `post-recovery verification は preview public URL、major route、static asset load success、reference 整合を第一候補にする` |
| automatic rollback を今回含めるか                                | no。operator-facing recovery memo に留める                                          | `automatic rollback は本 issue に含めず、operator-facing recovery memo に留める`                                           |

## Resolution

Issue 56 の判断結果は次の通りとする。

- GCP preview rollback unit は artifact rollback、resource correction、DNS/operator rollback に分ける
- blocked pending state は execution completed failure と分け、operator hold と recovery planning の起点として扱う
- first deploy / first apply で live baseline がない場合は restore より safe stop と no DNS progression を優先する
- resource rollback の正規経路は reviewed OpenTofu state と output surface に戻すことに置く
- post-recovery verification は preview public URL、major route、static asset load success、reference 整合を第一候補にする
- automatic rollback は本 issue に含めず、operator-facing recovery memo に留める

この合意で明確になること:

- GCP preview path の recovery は artifact、resource、DNS/operator handoff を同じ rollback とみなさず、failure の層ごとに containment / restore を選べる
- blocked pending state は即時 rollback 完了や destroy と誤読せず、operator hold と recovery planning の reviewable state transition として扱える
- first deploy / first apply で live baseline がない場合も、safe stop と no DNS progression を優先するため、未成立の preview path を無理に previous live state 扱いしない
- resource correction は reviewed OpenTofu state と usage-oriented output surface に戻すことを正規経路にするため、ad hoc console fix を steady state の基準にしない
- post-recovery verification は user-facing availability と reference 整合を主語に残るため、Issue 47 の reviewable evidence 主語と整合する

後続 issue への引き継ぎ事項:

- workflow implementation step では selected artifact reference、deploy evidence artifact、run URL を recovery 起点として出力する
- resource execution step では selected environment entrypoint reference、reviewed target reference、certificate-related reference、blocked pending state を recovery evidence に接続する
- monitoring / alert routing baseline では rollback trigger を first-response signal として扱い、restore / revalidation の開始条件を揃える
- security baseline では security blocker や pending certificate / target state の safe stop 条件を継続管理する

## Process Review Notes

- Section 9 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は preview rollback and recovery memo の固定であり、automatic rollback、production cutover rollback、DNS provider automation、incident command は依然として後続 issue の対象である
- GitHub Issue #56 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED
- GitHub Issue: #56
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/56
- Sync Status: local resolution updated and GitHub issue body resynced

- local issue record として GCP preview rollback and recovery memo の議論たたき台を追加した
- rollback unit、restore sequence、post-recovery verification、safe stop 条件を Resolution として固定した
- implementation work は未実施であり、次段は workflow / resource execution 実装と monitoring path との接続である

## Dependencies

- Issue 14
- Issue 47
- Issue 49
- Issue 50
- Issue 51
- Issue 52
- Issue 53
