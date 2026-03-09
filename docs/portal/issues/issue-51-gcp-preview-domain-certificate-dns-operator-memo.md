## Summary

Issue 48 で GCP preview path は external DNS -> global external HTTPS load balancer -> Cloud CDN -> Cloud Storage bucket に固定され、preview domain の第一候補も `preview.gcp.ashnova.jp` に決まった。Issue 50 では workflow が DNS operator step を完結させず、reviewed target と verification reference を handoff する側に留める方針も固定された。ただし、preview domain を external DNS 側でどの単位で扱い、certificate validation と reviewed target をどの evidence で確認し、どこまでを operator manual step として残すかは current memo として未整理である。このままだと、preview cutover や revalidation 時の責務境界が曖昧なままになる。

## Goal

GCP preview domain / certificate / DNS operator memo の議論たたき台を作り、preview subdomain の扱い、certificate validation handoff、reviewed target、manual DNS operator step、minimum evidence、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-51
- タイトル: GCP preview domain / certificate / DNS operator memo を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview domain and DNS operator planning
- 優先度: 中
- 先行条件: Issue 42 closed, Issue 46 closed, Issue 47 resolved, Issue 48 resolved, Issue 50 resolved

目的
- 解決する問題: GCP preview architecture と deploy workflow の境界は fixed したが、preview domain `preview.gcp.ashnova.jp` を external DNS source-of-truth のもとでどの sequence と evidence で扱うかが未固定のままだと、certificate validation、DNS 更新、preview verification の operator step が曖昧なまま残る
- 期待する価値: preview domain と certificate の operator memo を current DNS governance に接続し、workflow handoff と operator manual step の境界を曖昧にしない

スコープ
- 含むもの: preview domain の扱い、reviewed target wording、certificate validation handoff、external DNS operator sequence、minimum evidence path、open questions table の作成
- 含まないもの: DNS provider account detail、DNS automation 実装、Cloud DNS adoption、certificate 発行実行、preview deploy 実行、workflow YAML 実装、production cutover 設計
- 編集可能パス: docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md
- 制限パス: infra/**, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview domain の operator sequence と minimum evidence path が文書から一意に読める
- [ ] 条件 2: certificate validation handoff と manual DNS operator step の境界が整理されている
- [ ] 条件 3: DNS automation、Cloud DNS adoption、provider account detail など本 issue 非対象が operator memo から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md
- アプローチ: Issue 42 の external DNS operations memo、Issue 46 の DNS governance judgment、Issue 48 の GCP architecture baseline、Issue 50 の workflow evidence / operator handoff を入力として、preview domain operator memo を sequence、evidence、handoff boundary、non-goals の 4 観点で整理する
- 採用しなかった代替案と理由: いきなり DNS 実作業や certificate 発行実行へ進む案は operator boundary を曖昧にしやすいため採らない。逆に architecture issue の一部として扱い続ける案も downstream issue が参照しづらいため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: scope boundary wording、reviewed target wording、certificate handoff wording、operator sequence wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-42-external-dns-operations-memo.md、docs/portal/issues/issue-46-external-dns-automation-route53-judgment.md、docs/portal/issues/issue-48-gcp-architecture-baseline.md、docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md を照合し、DNS governance drift と workflow/operator 責務混線のどちらが起きているかを切り分ける

リスクとロールバック
- 主なリスク: operator memo issue の名目で DNS automation 実装、provider account 手順、certificate 発行実作業まで scope が膨らむこと
- 影響範囲: external DNS governance、preview verification path、workflow handoff boundary
- 緩和策: 今回は reviewed target、certificate validation handoff、manual DNS step、minimum evidence に限定し、implementation depth は follow-up execution issue に残す
- ロールバック手順: scope が広がりすぎた場合は preview domain operator sequence と evidence path だけを残し、provider-specific detail は別 issue に切り出す
```

## Tasks

- [x] preview domain operator sequence を整理する
- [x] certificate validation handoff と reviewed target wording を整理する
- [x] minimum evidence と verification path を整理する
- [x] follow-up execution issue へ渡す operator memo を作成する

## Definition of Done

- [x] preview domain operator sequence が 1 文書で追える
- [x] certificate validation handoff と DNS operator step の境界が説明されている
- [x] minimum evidence と verification path が読める
- [x] DNS automation / Cloud DNS adoption / provider account detail を本 issue 非対象として維持できている

## Initial Notes

- Issue 42 により、authoritative DNS は external DNS source-of-truth のもとで operator-managed step として扱い、minimum evidence と reversal boundary を残す前提である
- Issue 46 により、current phase では Cloud DNS adoption や authoritative DNS write automation は採らず、operator-assist only の fail-closed boundary を維持する前提である
- Issue 48 により、preview domain の第一候補は `preview.gcp.ashnova.jp` であり、GCP 側は reviewed target の consumer として扱う前提である
- Issue 50 により、workflow は reviewed preview hostname target reference と verification reference を operator へ handoff する側に留まる前提である

## Issue 51 Discussion Draft

このセクションは、GCP preview domain / certificate / DNS operator memo を議論するためのたたき台である。ここで決めたいのは operator memo であり、まだ決めないのは DNS automation 実装、certificate 発行実行、preview deploy 実行である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `preview.gcp.ashnova.jp を external DNS source-of-truth のもとでどの sequence と evidence で扱うか` に限定する
- DNS provider 固有の画面手順や credential 管理は扱わない
- Cloud DNS adoption や authoritative write automation の再判断は扱わない

### 2. preview domain の第一案

提案:

- first-step の preview domain は `preview.gcp.ashnova.jp` を維持する
- same-hostname cutover や production subdomain と競合する path は持ち込まない
- external DNS 側には reviewed target value を operator が反映する

この方向の理由:

- non-production path であることが hostname から一意に読める
- Issue 46 の external DNS governance judgment と衝突しない
- AWS production hostname と責務を混線させずに preview proof を進められる

### 3. certificate validation handoff の第一案

提案:

- workflow / IaC は certificate-related reference と reviewed target を出力する側に留める
- actual DNS validation / record update は operator manual step として残す
- operator memo は validation 前後で何を確認するかを最小限に固定する

候補 evidence 例:

- reviewed preview hostname target reference
- certificate validation reference
- preview public URL
- selected commit / artifact reference

### 4. external DNS operator sequence の第一案

提案:

- pre-change で current record、target value、TTL baseline を記録する
- reviewed target を external DNS へ反映する
- propagation と certificate state を確認する
- preview URL と reviewed hostname の reachability を確認する

この sequence で避けたいこと:

- workflow が authoritative DNS write を完結すること
- provider account 固有手順を repo 標準として固定すること
- certificate validation と preview verification を未記録のまま終えること

### 5. minimum evidence path のたたき台

提案:

- before/after の target value
- TTL baseline
- reviewed hostname reachability result
- certificate-related confirmation reference
- selected commit / artifact reference

### 6. 今回は決めないこと

- DNS provider account detail
- authoritative DNS write automation
- Cloud DNS hosted zone や GCP DNS 移行
- certificate 発行実作業
- preview deploy 実行

### 7. 後続 issue とどう接続するか

- workflow execution issue は reviewed target reference を出力する
- monitoring / rollback issue は reviewed hostname reachability evidence を前提にする
- resource execution issue は load balancer / certificate wiring の output を operator memo に渡す

### 8. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                         | 判断方向（Discussion 時点の仮）                                                          | Resolution 確定文言 |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------- |
| first-step の preview domain を何に置くか                    | `preview.gcp.ashnova.jp` を維持する                                                      |                     |
| authoritative DNS write を workflow / IaC に含めるか         | no。operator manual step に留める                                                        |                     |
| workflow / IaC は何を operator へ handoff するか             | reviewed target reference と certificate-related reference を渡す                        |                     |
| operator は何を minimum evidence として残すか                | target value、TTL、reachability、certificate reference、artifact/commit reference を残す |                     |
| Cloud DNS adoption や Route 53 再判断をこの issue に含めるか | no。current governance judgment を維持する                                               |                     |

## Resolution

Issue 51 の判断結果は次の通りとする。

- first-step の preview domain は `preview.gcp.ashnova.jp` を維持する
- authoritative DNS write は workflow / IaC に含めず、external DNS source-of-truth のもとで operator manual step として扱う
- workflow / IaC は operator handoff に必要な reviewed target reference と certificate-related reference を出力する側に留める
- operator は minimum evidence として before/after の target value、TTL baseline、reviewed hostname reachability result、certificate-related confirmation reference、selected commit / artifact reference を残す
- Cloud DNS adoption や Route 53 再判断は本 issue に含めず、current governance judgment を維持する

この合意で明確になること:

- GCP preview hostname は non-production preview path として `preview.gcp.ashnova.jp` に固定され、production hostname や same-hostname cutover を前提にしない
- authoritative DNS write の責務は workflow や IaC に吸収されず、Issue 46 の fail-closed boundary を維持したまま operator-managed step に残る
- workflow execution や resource execution は DNS record 自体を書き換える代わりに、reviewed target と certificate-related reference を operator へ handoff する contract を前提にできる
- operator memo は target value、TTL、reachability、certificate reference、artifact/commit reference という最低限の証跡を要求するため、preview verification と revalidation の追跡がしやすくなる
- Cloud DNS adoption や provider account detail をこの issue から外すことで、preview domain operator sequence の判断と platform migration の議論が混線しない

後続 issue への引き継ぎ事項:

- workflow execution issue では reviewed target reference、certificate-related reference、selected commit / artifact reference を出力する実装へ落とし込む
- resource execution issue では load balancer / certificate wiring の output を operator handoff で参照できる naming に揃える
- monitoring / rollback issue では reviewed hostname reachability evidence と selected artifact reference を前提に確認経路を整理する
- DNS provider 固有手順や account 権限設計が必要になった場合は、current operator memo を壊さずに separate execution memo として切り出す

## Process Review Notes

- Section 8 の open questions は Resolution 確定文言として本 Resolution に統合した
- 本 issue の judgment は operator memo の固定であり、DNS automation 実装、provider account 手順、certificate 発行実行、preview deploy 実行は依然として後続 issue の対象である
- GitHub Issue #51 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED
- GitHub Issue: #51
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/51
- Sync Status: local resolution updated and GitHub issue body resynced

- local issue record は未作成だったため、このファイルを GCP preview domain / certificate / DNS operator memo の initial draft として追加する
- operator memo の論点は architecture、workflow、automation judgment から分離して扱う
- open questions は Resolution へ統合し、preview domain、operator boundary、handoff evidence、minimum evidence、non-goals の方針は固定した
- 実装作業は未実施であり、次段は workflow execution issue か monitoring / rollback issue への分割である

## Dependencies

- Issue 42
- Issue 46
- Issue 47
- Issue 48
- Issue 50
