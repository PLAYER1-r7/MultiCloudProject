## Summary

Issue 61 で production cutover、same-hostname migration、Cloud DNS migration の実行は judgment issue に含めないと固定したが、実際に execution issue を切るなら、rollback plan、evidence retention、approval gate、destructive boundary をどこまで含めるかを先に整理する必要がある。このままだと execution issue の粒度が曖昧なまま残る。

## Goal

GCP production cutover と same-hostname migration execution boundary を整理し、execution prerequisites、rollback / evidence retention、destructive boundary、non-goals を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-65
- タイトル: GCP production cutover と same-hostname migration execution boundary を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent execution planning
- 優先度: 中
- 先行条件: Issue 61 closed, Issue 62 closed, Issue 63 closed, Issue 64 closed

目的
- 解決する問題: production cutover や same-hostname migration を別 execution issue に切り出す方針は固まったが、rollback plan、evidence retention、approval gate、destructive boundary をどこまで execution issue に含めるかが未固定のため、後続実装 issue の粒度が曖昧である
- 期待する価値: execution issue の prerequisites、rollback / evidence retention、destructive boundary を先に明文化し、judgment issue と live execution issue を混同せずに分割できる

スコープ
- 含むもの: execution prerequisites、rollback plan boundary、evidence retention checklist、destructive boundary、open questions table の作成
- 含まないもの: production cutover 実行、same-hostname migration 実行、DNS migration 実行、live destroy / rollback 実施
- 編集可能パス: docs/portal/issues/issue-65-gcp-production-cutover-and-same-hostname-migration-execution-boundary.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: execution issue に含める prerequisites と destructive boundary が文書から一意に読める
- [x] 条件 2: rollback / evidence retention / approval gate の責務分離が整理されている
- [x] 条件 3: live cutover や migration 実行を含めない draft に留まっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-65-gcp-production-cutover-and-same-hostname-migration-execution-boundary.md
- アプローチ: Issue 61 と分割した follow-up issue を入力に、execution boundary を prerequisites / rollback / evidence retention / destructive actions の 4 観点で整理する
- 採用しなかった代替案と理由: execution boundary を固めずに cutover issue を起こす案は rollback と evidence retention の責務を曖昧にするため採らない。逆に live migration 実施へ直行する案も approval と rollback boundary が不足するため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: execution wording、rollback wording、evidence retention wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md、docs/portal/issues/issue-62-gcp-production-equivalent-hostname-dns-governance-judgment.md、docs/portal/issues/issue-63-gcp-production-equivalent-approval-gate-and-environment-protection.md、docs/portal/issues/issue-64-gcp-production-equivalent-security-monitoring-and-rollback-uplift.md を照合し、execution prerequisites / rollback / evidence retention のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: boundary issue の名目で live cutover 手順や destructive rollback 実行まで scope が膨らむこと
- 影響範囲: release safety、rollback readiness、evidence retention
- 緩和策: execution boundary に限定し、live 実施は別 execution issue に残す
- ロールバック手順: scope が広がりすぎた場合は execution prerequisites と evidence retention checklist だけを残し、live 手順は別 issue に切り出す
```

## Tasks

- [x] execution prerequisites を整理する
- [x] rollback plan と destructive boundary を整理する
- [x] evidence retention checklist を整理する
- [x] live execution issue へ分割すべき粒度を整理する

## Definition of Done

- [x] execution prerequisites と destructive boundary が読める
- [x] rollback / evidence retention / approval gate の分離が読める
- [x] live cutover を含めない draft に留まっている

## Initial Notes

- Issue 61 は production cutover と same-hostname migration を separate execution issue として扱う boundary を固定した
- Issue 57 は preview shutdown や cleanup でも evidence retention を先に分ける考え方を固定している
- Issue 59 は non-destructive recovery walkthrough を完了しており、production cutover では別の rollback depth が必要になる

## Issue 65 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `production cutover / same-hostname migration execution issue に何を必須で含めるか` に限定する
- live cutover 実行、live rollback 実行、DNS migration 実行は扱わない
- implementation 手順の細部より prerequisites と boundary を優先する

### 2. execution prerequisites の第一案

提案:

- Issue 61 から Issue 64 の judgment が揃い、hostname / DNS、approval gate、security / monitoring / rollback uplift の前提が reviewable であることを execution issue の入口条件にする
- reviewer package と approval owner judgment が揃ってから live cutover / migration issue に進む
- known-good evidence、rollback target、evidence retention path が事前に固定されていない execution issue は起こさない

### 3. rollback boundary の第一案

提案:

- rollback plan は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐を execution issue 内で明示する
- destructive rollback と live destroy は別承認対象として扱い、暗黙の fallback にしない
- rollback 実行可否は reviewer ではなく approval owner judgment に結びつける

### 4. evidence retention の第一案

提案:

- live change 前に build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、monitoring state、closed judgment records を保持する checklist を要求する
- execution issue は cutover success だけでなく、abort / rollback / safe-stop でも同一 evidence path を残すことを要求する
- cleanup や credential removal は evidence retention 完了後の別 step として分ける

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                      | 判断方向（Discussion 時点の仮）                                                                            | Resolution 確定文言                                                                                                                                                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| execution issue の前提条件を何に置くか    | Issue 61-64 の judgment 完了と reviewable evidence を前提にする                                            | `production cutover / same-hostname migration execution issue の前提条件は Issue 61 から Issue 64 の judgment が揃い、hostname / DNS、approval gate、security / monitoring / rollback uplift の evidence path が reviewable であることに置く` |
| rollback plan を何に含めるか              | redeploy、resource correction、hostname / DNS rollback の分岐を明示する                                    | `execution issue は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐を rollback plan として明示し、implicit fallback を許可しない`                                                                                 |
| destructive action をどう扱うか           | separate approval target として分ける                                                                      | `destructive rollback、live destroy、credential cleanup は暗黙の付随作業にせず、separate approval target と evidence retention 完了後の step として扱う`                                                                                      |
| evidence retention checklist を何に置くか | build/deploy evidence、resource outputs、target/certificate、monitoring state、judgment records を保持する | `evidence retention checklist は build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、monitoring state、closed judgment records を live change 前に保持することを要求する`                    |
| live cutover 実行をこの issue に含めるか  | no。実 execution issue に残す                                                                              | `production cutover 実行、same-hostname migration 実行、DNS migration 実行、live rollback 実行は本 issue に含めず、必要時は separate execution issue として起票する`                                                                          |

## Resolution

Issue 65 の draft judgment は次の通りとする。

- production cutover / same-hostname migration execution issue の前提条件は Issue 61 から Issue 64 の judgment が揃い、hostname / DNS、approval gate、security / monitoring / rollback uplift の evidence path が reviewable であることに置く
- execution issue は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐を rollback plan として明示し、implicit fallback を許可しない
- destructive rollback、live destroy、credential cleanup は暗黙の付随作業にせず、separate approval target と evidence retention 完了後の step として扱う
- evidence retention checklist は build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、monitoring state、closed judgment records を live change 前に保持することを要求する
- production cutover 実行、same-hostname migration 実行、DNS migration 実行、live rollback 実行は本 issue に含めず、必要時は separate execution issue として起票する

この draft で明確になること:

- execution issue は judgment issue の延長ではなく、必須前提と rollback/evidence retention を備えた別パッケージとして起こす必要がある
- rollback は単一の曖昧な fallback ではなく、artifact/resource/hostname-DNS の分岐ごとに明示される
- cleanup や credential removal を cutover 成功の陰で同時実行させず、evidence retention 後の別承認対象として分離できる
- live change の成否に関係なく、abort / rollback / safe-stop でも同じ review path に証跡を残す前提が固定される

後続 issue への引き継ぎ事項:

- Issue 62 の hostname / DNS governance judgment を execution prerequisites に接続する
- Issue 63 の reviewer / approval owner 分離を execution approval path に接続する
- Issue 64 の notification / Cloud Armor / credential / rollback uplift を rollback plan と evidence retention checklist に接続する
- 実際の live cutover や same-hostname migration が必要になった時点で、本 boundary を土台に separate execution issue を起票する

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- Issue 57 の evidence retention boundary、Issue 59 の walkthrough baseline、Issue 61 から Issue 64 の split judgment を入力にして execution boundary draft を具体化した
- 本 issue は execution boundary judgment の固定であり、live cutover、same-hostname migration、DNS migration、live rollback の実行そのものは依然として後続 issue の対象である
- CloudSonnet review で確認された prerequisite wording と stale resync wording を修正し、closed record として整合を維持した

## Current Status

- CLOSED
- GitHub Issue: #65
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/65
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- local issue record として cutover / same-hostname migration execution boundary draft を追加した
- execution prerequisites、rollback branching、destructive boundary、evidence retention checklist を production-equivalent execution boundary として追記した

## Dependencies

- Issue 57
- Issue 59
- Issue 61
- Issue 62
- Issue 63
- Issue 64
