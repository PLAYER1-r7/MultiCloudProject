## Summary

Issue 47 から Issue 60 の流れで GCP preview path の設計、実装、運用基盤、継続判断までは切り出せるが、GCP を production-equivalent path へ拡張するかどうか、その場合に hostname、DNS governance、approval gate、security / monitoring / rollback depth をどこまで引き上げるかは未判断である。このままだと、preview 成功をそのまま production readiness と誤読しやすい。

## Goal

GCP production-equivalent promotion judgment を整理し、promotion prerequisites、hostname / DNS strategy、approval / security / monitoring / rollback uplift、non-goals を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-61
- タイトル: GCP production-equivalent promotion judgment を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent planning
- 優先度: 中
- 先行条件: Issue 47 closed, Issue 48 closed, Issue 49 closed, Issue 50 closed, Issue 51 closed, Issue 52 closed, Issue 53 closed, Issue 54 closed, Issue 55 closed, Issue 56 closed, Issue 57 closed, Issue 58 closed, Issue 59 closed, Issue 60 closed

目的
- 解決する問題: preview path は成立したが、production-equivalent へ進む前提条件、hostname / DNS governance、approval gate、security / monitoring / rollback uplift が未固定のままだと、preview success をそのまま production readiness と誤読しやすい
- 期待する価値: production-equivalent へ進む条件と非条件を明文化し、preview scope と production scope の境界を保ったまま次段判断を行える

スコープ
- 含むもの: promotion prerequisites、hostname / DNS strategy、approval gate uplift、security / monitoring / rollback uplift、open questions table の作成
- 含まないもの: production cutover 実行、same-hostname migration 実行、Cloud DNS migration 実行、organization-wide platform redesign
- 編集可能パス: docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production-equivalent promotion の前提条件と非条件が文書から一意に読める
- [x] 条件 2: hostname / DNS、approval gate、security / monitoring / rollback uplift の責務分離が整理されている
- [x] 条件 3: preview success と production readiness を混同せず、judgment issue に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md
- アプローチ: Issue 47 から Issue 56 の fixed baseline と、Issue 57 から Issue 60 の closed judgment / operations evidence を入力に、production-equivalent judgment を prerequisites / hostname / governance / uplift の 4 観点で整理する
- 採用しなかった代替案と理由: preview success をもって production readiness とみなす案は prerequisite が欠落するため採らない。逆に即座に production cutover implementation へ進む案も governance judgment を欠くため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: prerequisite wording、hostname strategy wording、approval / security / monitoring / rollback uplift wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md、docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、docs/portal/issues/issue-54-gcp-security-baseline.md、docs/portal/issues/issue-55-gcp-monitoring-alert-routing-baseline.md、docs/portal/issues/issue-56-gcp-preview-rollback-and-recovery-memo.md、docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md、docs/portal/issues/issue-58-gcp-preview-monitoring-alert-implementation.md、docs/portal/issues/issue-59-gcp-preview-recovery-runbook-and-drill-baseline.md、docs/portal/issues/issue-60-gcp-preview-security-hardening-implementation.md を照合し、promotion prerequisites と uplift scope のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: production-equivalent judgment issue の名目で cutover 実行や platform redesign まで scope が膨らむこと
- 影響範囲: hostname strategy、DNS governance、approval policy、security / monitoring / rollback expectation
- 緩和策: judgment と uplift scope に限定し、execution は follow-up issue に残す
- ロールバック手順: scope が広がりすぎた場合は promotion prerequisites と hostname strategy だけを残し、実行計画は別 issue に切り出す
```

## Tasks

- [x] production-equivalent promotion prerequisites を整理する
- [x] hostname / DNS strategy と approval uplift を整理する
- [x] security / monitoring / rollback uplift を整理する
- [x] execution issue へ分割すべき粒度を整理する

## Definition of Done

- [x] production-equivalent promotion の prerequisites と non-goals が読める
- [x] hostname / DNS、approval、security / monitoring / rollback uplift が読める
- [x] preview success と production readiness を混同しない wording が維持されている

## Initial Notes

- Issue 47 は first GCP step の成功条件を architecture proof と preview delivery proof に限定している
- Issue 52 / 53 は preview path の live validation まで完了しているが、production-equivalent 条件は扱っていない
- Issue 57 から Issue 60 は preview 継続運用と運用実装の前提整理として必要になる

## Issue 61 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `preview path から production-equivalent へ進む判断条件を何に置くか` に限定する
- production cutover 実行は扱わない
- same-hostname migration 実装は扱わない

### 2. promotion prerequisites の第一案

提案:

- continuation judgment が retained preview 継続を選び、shutdown trigger が未発火であること
- monitoring implementation、recovery runbook、security hardening が closed issue と live evidence で追えること
- owner、cost、approval gate、rollback readiness が preview 暫定運用ではなく production-equivalent の期待値で再定義されていること

### 3. hostname / DNS strategy の第一案

提案:

- preview dedicated hostname をそのまま使い続けるのではなく、production-equivalent 用 hostname と DNS governance を再判断する
- same-hostname cutover は separate execution path として扱う
- external DNS source-of-truth を維持するか、Cloud DNS 採用判断を行うかを別比較軸として整理する

### 4. uplift boundary の第一案

提案:

- approval gate、security controls、monitoring coverage、rollback drill は preview baseline から uplift する
- preview で許容した owner concentration や暫定運用は production-equivalent では前提にしない
- preview の単一 owner first-response を、reviewer / approval owner 分離と複数人 reviewable evidence path に引き上げる

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                 | 判断方向（Discussion 時点の仮）                                                                 | Resolution 確定文言                                                                                                                                                                                |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| production-equivalent へ進む前提条件を何に置くか     | retained preview judgment と preview operations baseline が closed で揃っていることを前提にする | `production-equivalent promotion の前提条件は Issue 57 から Issue 60 が closed で揃い、retained preview の owner / monitoring / recovery / security evidence path が reviewable であることに置く`  |
| hostname / DNS をどう扱うか                          | dedicated preview hostname とは別に production-equivalent hostname と governance を再判断する   | `hostname / DNS strategy は preview 専用 hostname をそのまま流用前提にせず、production-equivalent hostname、DNS source-of-truth、approval gate を別 judgment として再整理する`                     |
| approval gate をどこまで引き上げるか                 | preview の単一 owner 依存を維持せず、reviewer / approval owner 分離を要求する                   | `approval gate は preview の repository-owner 集中運用を維持せず、reviewer / approval owner 分離と release-sensitive change ごとの承認境界を production-equivalent 条件として要求する`             |
| security / monitoring / rollback uplift を何に置くか | preview baseline を起点に coverage と drill depth を引き上げる                                  | `security / monitoring / rollback uplift は preview baseline を流用するだけでなく、notification destination、rollback drill depth、credential governance、Cloud Armor tuning の追加判断を要求する` |
| preview success を production readiness とみなすか   | no。明確に分離する                                                                              | `preview success は production readiness と同一視せず、production-equivalent は別 judgment と追加 uplift の完了を前提にする`                                                                       |
| cutover 実行をこの issue に含めるか                  | no。別 execution issue に切り出す                                                               | `production cutover、same-hostname migration、Cloud DNS migration の実行は本 issue に含めず、必要時は separate execution issue に切り出す`                                                         |

## Resolution

Issue 61 の draft judgment は次の通りとする。

- production-equivalent promotion の前提条件は Issue 57 から Issue 60 が closed で揃い、retained preview の owner / monitoring / recovery / security evidence path が reviewable であることに置く
- hostname / DNS strategy は preview 専用 hostname をそのまま流用前提にせず、production-equivalent hostname、DNS source-of-truth、approval gate を別 judgment として再整理する
- approval gate は preview の repository-owner 集中運用を維持せず、reviewer / approval owner 分離と release-sensitive change ごとの承認境界を production-equivalent 条件として要求する
- security / monitoring / rollback uplift は preview baseline を流用するだけでなく、notification destination、rollback drill depth、credential governance、Cloud Armor tuning の追加判断を要求する
- preview success は production readiness と同一視せず、production-equivalent は別 judgment と追加 uplift の完了を前提にする
- production cutover、same-hostname migration、Cloud DNS migration の実行は本 issue に含めず、必要時は separate execution issue に切り出す

この draft で明確になること:

- retained preview は production-equivalent の入力条件ではあるが、単独では promotion 根拠にならない
- preview で成立した deploy evidence path、monitoring state、walkthrough record は production-equivalent judgment の材料として再利用できる
- hostname / DNS / approval / rollback を同時に uplift しない限り、preview success をそのまま external release path へ昇格させない
- Issue 61 は cutover 実行計画ではなく、execution issue を切る前提条件の整理に留まる

後続 issue への引き継ぎ事項:

- Issue 62 として production-equivalent hostname と DNS governance を比較する separate judgment issue を切り出した
- Issue 63 として reviewer / approval owner 分離、environment protection rules、release gate を整理する separate governance issue を切り出した
- Issue 64 として notification destination、Cloud Armor tuning、credential rotation、rollback drill uplift を扱う follow-up issue を切り出した
- Issue 65 として production cutover や same-hostname migration の rollback plan / evidence retention boundary を扱う separate execution-boundary issue を切り出した

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- Issue 57 から Issue 60 の closed state と retained preview evidence path を前提に、production-equivalent judgment の draft を具体化した
- 本 issue は judgment draft の固定であり、production cutover、DNS migration、approval gate 実装、security / monitoring uplift 実装そのものは後続 issue の対象である
- CloudSonnet review で確認された stale resync wording を解消し、local issue record と GitHub closed state の整合を維持した

## Current Status

- CLOSED
- GitHub Issue: #61
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/61
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- local issue record として production-equivalent promotion judgment draft を追加した
- prerequisites、hostname / DNS strategy、approval / security / monitoring / rollback uplift を論点として切り出した
- Issue 57 から Issue 60 の closed state を前提にする draft judgment と、execution issue へ分割すべき follow-up 粒度を追記した
- follow-up split として Issue 62 から Issue 65 を作成し、hostname / DNS、approval gate、security / monitoring / rollback uplift、execution boundary を個別 issue に分離した
- acceptance criteria、Tasks、Definition of Done は draft judgment と follow-up split の完了状態に合わせて更新した

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
- Issue 57
- Issue 58
- Issue 59
- Issue 60
