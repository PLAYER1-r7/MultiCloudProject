## Summary

Issue 61 から Issue 65 で production-equivalent judgment と execution boundary は閉じられたが、actual execution に使う hostname candidate、approval owner path、notification / escalation destination、rollback branches、evidence retention package はまだ一つの reviewed execution package になっていない。このままだと、live change に進む前の具体準備が issue として追えない。

## Goal

GCP production-equivalent execution package を準備し、future live change に必要な reviewed input、approval handoff、rollback / evidence retention package、non-goals を reviewable な issue として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-67
- タイトル: GCP production-equivalent execution package を準備する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent execution preparation
- 優先度: 中
- 先行条件: Issue 61 closed, Issue 62 closed, Issue 63 closed, Issue 64 closed, Issue 65 closed, Issue 66 closed

目的
- 解決する問題: production-equivalent judgment は閉じられたが、actual execution で参照する hostname candidate、approval owner path、notification / escalation destination、rollback plan、evidence retention package が reviewable な一件に束ねられていない
- 期待する価値: future live change の前に、reviewer package と approval owner handoff を支える reviewed execution package を整理できる

スコープ
- 含むもの: execution input candidate の整理、approval/handoff path の整理、rollback branches と evidence retention package の具体化、live execution issue への引き継ぎ条件の整理
- 含まないもの: live deploy 実行、DNS change 実行、environment protection live 変更、notification routing live 変更、destructive rollback 実施
- 編集可能パス: docs/portal/issues/issue-67-gcp-production-equivalent-execution-preparation.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: execution package が参照すべき hostname / DNS、approval、notification、rollback / evidence retention input が文書から読める
- [x] 条件 2: reviewer package と approval owner handoff の境界が整理されている
- [x] 条件 3: live change を含めず execution preparation に限定されている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-67-gcp-production-equivalent-execution-preparation.md
- アプローチ: Issue 61 から Issue 65 と Issue 66 summary handoff を入力に、future execution に必要な concrete input と handoff package を preparation issue として整理する
- 採用しなかった代替案と理由: 事前 package を作らずに live cutover issue を直接起こす案は approval、rollback、evidence retention の責務を曖昧にするため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: execution-package wording、approval handoff wording、rollback/evidence wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-62-gcp-production-equivalent-hostname-dns-governance-judgment.md、docs/portal/issues/issue-63-gcp-production-equivalent-approval-gate-and-environment-protection.md、docs/portal/issues/issue-64-gcp-production-equivalent-security-monitoring-and-rollback-uplift.md、docs/portal/issues/issue-65-gcp-production-cutover-and-same-hostname-migration-execution-boundary.md、docs/portal/issues/issue-66-gcp-production-equivalent-judgment-summary-and-execution-handoff.md を照合し、execution input と handoff package の欠落箇所を分ける

リスクとロールバック
- 主なリスク: execution preparation issue の名目で live change や destructive step まで scope が膨らむこと
- 影響範囲: release preparation traceability、approval latency、rollback readiness
- 緩和策: reviewed execution package preparation に限定し、live change は後続 issue に残す
- ロールバック手順: scope が広がりすぎた場合は execution input と evidence retention package だけを残し、live sequence は別 issue に切り出す
```

## Tasks

- [x] hostname / DNS execution input を整理する
- [x] reviewer package と approval owner handoff を整理する
- [x] notification / rollback / evidence retention package を整理する
- [x] live execution issue へ引き継ぐ条件を整理する

## Definition of Done

- [x] execution input と handoff package が読める
- [x] rollback / evidence retention / approval boundary が読める
- [x] live change を含めない execution preparation issue に留まっている

## Initial Notes

- Issue 62 は dedicated hostname candidate、external DNS source-of-truth、operator-managed DNS write を前提にしている
- Issue 63 は reviewer / approval owner 分離と evidence-linked approval path を前提にしている
- Issue 64 は external destination、Cloud Armor tuning、credential governance、rollback drill uplift を前提にしている
- Issue 65 は actual execution issue に必要な rollback / evidence retention boundary を前提にしている

## Issue 67 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `future live change の前に何を reviewed execution package として揃えるか` に限定する
- live deploy、DNS change、destructive rollback は扱わない
- actual execution issue の入力を準備することに集中する

### 2. execution input の第一案

提案:

- hostname candidate、DNS source-of-truth、authoritative write owner、reviewed target reference を一つの input set として整理する
- release-sensitive action ごとの approval owner path と reviewer package を紐づける
- external notification / escalation destination と Cloud Armor / credential governance の uplift candidate も input set に含める

### 3. rollback / evidence package の第一案

提案:

- same-evidence redeploy、resource correction、hostname / DNS rollback の分岐を execution package に明示する
- build / deploy evidence、resource outputs、monitoring state、closed judgments を retention set に含める
- abort / rollback / safe-stop でも同一 package を更新する前提にする

### 4. live execution handoff の第一案

提案:

- reviewed execution package が揃ったら、live change は別 execution issue に切り出す
- live issue には go/no-go 条件、operator step、reviewer package link、approval owner handoff を添える
- destructive action は live issue でも separate approval target に留める

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                   | 判断方向（Discussion 時点の仮）                                    | Resolution 確定文言                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| execution input set を何に置くか                       | hostname / DNS、approval、notification、rollback/evidence を含める | `execution input set は dedicated hostname candidate、external DNS source-of-truth、operator-managed DNS write owner、reviewed target reference、certificate-related reference、reviewer package、approval owner path、reviewed external notification / escalation destination、Cloud Armor / credential governance uplift candidate、rollback branches、evidence retention checklist を含む` |
| reviewer と approval owner の handoff をどう構成するか | evidence-linked package と approval comment path を使う            | `reviewer は technical completeness と evidence quality を確認した reviewed execution package を固定し、approval owner は同一 package と evidence-linked approval comment path を前提に release-sensitive action の go / no-go を判断する`                                                                                                                                                    |
| rollback/evidence package をどこまで具体化するか       | artifact/resource/hostname-DNS branches を含める                   | `rollback / evidence package は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐と、build / deploy evidence、resource outputs、monitoring state、closed judgment references、abort / safe-stop record を同一 retention set に含める`                                                                                                                               |
| live issue への引き継ぎ条件を何に置くか                | reviewed package 完了を前提にする                                  | `live execution issue への引き継ぎ条件は reviewed execution package が completed 状態で揃い、hostname / DNS、approval path、notification / escalation destination、rollback branches、evidence retention path が reviewable に固定されていることに置く`                                                                                                                                       |
| non-goals をどこまで明示するか                         | live deploy、DNS change、destructive rollback を除外する           | `Issue 67 は live deploy、authoritative DNS change、environment protection live change、notification routing live change、destructive rollback / live destroy を含めず、execution preparation と handoff package 固定に限定する`                                                                                                                                                              |

## Resolution

Issue 67 の execution preparation judgment は次の通りとする。

- execution input set は dedicated hostname candidate、external DNS source-of-truth、operator-managed DNS write owner、reviewed target reference、certificate-related reference、reviewer package、approval owner path、reviewed external notification / escalation destination、Cloud Armor / credential governance uplift candidate、rollback branches、evidence retention checklist を含む
- reviewer は technical completeness と evidence quality を確認した reviewed execution package を固定し、approval owner は同一 package と evidence-linked approval comment path を前提に release-sensitive action の go / no-go を判断する
- rollback / evidence package は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐と、build / deploy evidence、resource outputs、monitoring state、closed judgment references、abort / safe-stop record を同一 retention set に含める
- live execution issue への引き継ぎ条件は reviewed execution package が completed 状態で揃い、hostname / DNS、approval path、notification / escalation destination、rollback branches、evidence retention path が reviewable に固定されていることに置く
- Issue 67 は live deploy、authoritative DNS change、environment protection live change、notification routing live change、destructive rollback / live destroy を含めず、execution preparation と handoff package 固定に限定する

この execution preparation で明確になること:

- hostname / DNS judgment、approval gate judgment、security / monitoring / rollback uplift judgment、execution boundary judgment は、live issue 起票前に一つの reviewed execution package として束ねる必要がある
- reviewer package と approval owner handoff は別経路ではなく同一 evidence path を共有し、parallel な shortcut approval を許可しない
- rollback は artifact / resource / hostname-DNS の分岐を package 内で先に固定し、cutover 成功時だけでなく abort / safe-stop でも同じ retention set を更新する前提を持つ
- live change は Issue 67 の完了を入口条件とし、準備不足の execution issue を先に起票しない

## Reviewed Execution Package Checklist

- dedicated hostname candidate、external DNS source-of-truth、authoritative DNS write owner、reviewed target reference、certificate-related reference が Issue 62 の judgment と矛盾なく参照できる
- reviewer package、approval owner path、release-sensitive action ごとの approval comment path が Issue 63 の judgment と矛盾なく参照できる
- reviewed external notification / escalation destination、Cloud Armor rule-depth candidate、credential rotation / owner review candidate、rollback drill expectation が Issue 64 の judgment と矛盾なく参照できる
- same-evidence redeploy、resource correction、hostname / DNS rollback branches、evidence retention checklist、abort / safe-stop record path が Issue 65 の boundary と矛盾なく参照できる
- live issue が destructive rollback、live destroy、credential cleanup を implicit fallback として扱わない

## Live Execution Handoff Gate

- reviewed execution package の各入力が埋まり、open question が残っていない
- reviewer package の evidence path と approval owner handoff path が同一 record 上で参照できる
- rollback branches と evidence retention checklist が go / no-go 前に review 済みである
- live deploy や DNS change を行う separate execution issue に、Issue 67 の package link を前提条件として渡せる

## Process Review Notes

- This issue is created as the follow-up execution preparation issue after the production-equivalent judgment set was closed.
- Resolution、reviewed execution package checklist、live execution handoff gate は Issue 62 から Issue 66 の closed judgment / handoff record を根拠に埋め、new live judgment は追加していない。
- CloudSonnet review で確認された prerequisite mismatch と stale sync wording を修正し、execution preparation record として close 可能な状態に整えた。

## Current Status

- CLOSED
- GitHub Issue: #67
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/67
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- hostname / DNS、approval、notification / escalation、rollback / evidence retention を reviewed execution package として束ねた
- reviewer package と approval owner handoff を同一 evidence path に固定し、shortcut approval を許可しない前提を明文化した
- live execution issue の起票条件を package completion と reviewable handoff に限定した

## Dependencies

- Issue 61
- Issue 62
- Issue 63
- Issue 64
- Issue 65
- Issue 66
