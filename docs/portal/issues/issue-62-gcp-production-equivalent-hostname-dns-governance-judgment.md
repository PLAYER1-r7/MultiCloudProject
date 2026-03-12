## Summary

Issue 61 で production-equivalent promotion judgment の下書きは固まったが、production-equivalent hostname を何に置くか、external DNS を source-of-truth のまま維持するか、Cloud DNS を採るか、approval 境界をどこに置くかは未判断である。このままだと preview hostname の成功をそのまま promotion path に流用しやすい。

## Goal

GCP production-equivalent hostname / DNS governance judgment を整理し、hostname candidates、DNS source-of-truth、approval boundary、non-goals を reviewable な draft として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-62
- タイトル: GCP production-equivalent hostname / DNS governance judgment を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent hostname / DNS planning
- 優先度: 中
- 先行条件: Issue 51 closed, Issue 53 closed, Issue 57 closed, Issue 61 closed

目的
- 解決する問題: preview hostname `preview.gcp.ashnova.jp` は proof として成立したが、production-equivalent hostname をどれに置くか、DNS source-of-truth をどこに置くか、approval gate をどう接続するかが未固定のため、release-sensitive hostname change の判断が曖昧なまま残る
- 期待する価値: hostname 候補、DNS governance、approval 境界、execution split を明文化し、preview 専用 hostname と production-equivalent hostname を混同せずに次段判断できる

スコープ
- 含むもの: hostname candidate comparison、DNS source-of-truth comparison、approval boundary、evidence path、open questions table の作成
- 含まないもの: Cloud DNS migration 実行、same-hostname cutover 実行、public DNS record 変更の live 実施、production cutover 実行
- 編集可能パス: docs/portal/issues/issue-62-gcp-production-equivalent-hostname-dns-governance-judgment.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production-equivalent hostname 候補と DNS source-of-truth の比較軸が文書から一意に読める
- [x] 条件 2: approval boundary と execution split が整理されている
- [x] 条件 3: preview hostname proof と production-equivalent hostname judgment を混同していない

実装計画
- 変更見込みファイル: docs/portal/issues/issue-62-gcp-production-equivalent-hostname-dns-governance-judgment.md
- アプローチ: Issue 51、Issue 53、Issue 61 を入力に、hostname / DNS governance judgment を candidate / source-of-truth / approval / execution split の 4 観点で整理する
- 採用しなかった代替案と理由: preview hostname をそのまま production-equivalent 前提にする案は governance judgment を飛ばすため採らない。逆に即座に DNS migration 実装へ進む案も比較軸が不足するため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: hostname wording、DNS governance wording、approval boundary wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md、docs/portal/issues/issue-61-gcp-production-equivalent-promotion-judgment.md を照合し、hostname proof / governance / execution split のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: hostname judgment issue の名目で live DNS change や production cutover まで scope が膨らむこと
- 影響範囲: hostname strategy、DNS governance、approval expectation
- 緩和策: comparison と judgment に限定し、live execution は follow-up issue に残す
- ロールバック手順: scope が広がりすぎた場合は hostname 候補比較と DNS source-of-truth 比較だけを残し、execution plan は別 issue に切り出す
```

## Tasks

- [x] production-equivalent hostname candidates を整理する
- [x] DNS source-of-truth と governance 境界を整理する
- [x] approval boundary と evidence path を整理する
- [x] execution issue へ分割すべき粒度を整理する

## Definition of Done

- [x] hostname 候補、DNS governance、approval boundary が読める
- [x] preview hostname proof と production-equivalent hostname judgment の境界が明示されている
- [x] live DNS change を含めない draft に留まっている

## Initial Notes

- Issue 51 は preview hostname / certificate / DNS operator memo を固定している
- Issue 53 は `preview.gcp.ashnova.jp` が `34.128.181.172` を向き、managed certificate が `ACTIVE` になった live evidence を残している
- Issue 61 は hostname / DNS strategy を separate judgment として再整理する前提を固定した

## Issue 62 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `production-equivalent hostname と DNS governance を何に置くか` に限定する
- live DNS change や same-hostname cutover 実行は扱わない
- Cloud DNS migration 実装は扱わない

### 2. hostname candidate の第一案

提案:

- preview hostname `preview.gcp.ashnova.jp` は preview proof 専用のまま維持する
- production-equivalent は preview hostname を流用せず、現在の AWS production custom-domain `www.aws.ashnova.jp` とも衝突しない dedicated hostname candidate を別 judgment として扱う
- same-hostname migration は execution boundary を別 issue に切り分ける

### 3. DNS source-of-truth の第一案

提案:

- current phase では external DNS source-of-truth を維持する
- Cloud DNS adoption は comparison 対象に留め、live migration 前提にしない
- authoritative DNS write は引き続き operator-managed step と approval boundary を通す

### 4. approval boundary の第一案

提案:

- hostname candidate の採否と authoritative DNS 変更判断は reviewer package と approval owner judgment を分離する
- workflow / IaC は reviewed target candidate と evidence path を surfacing する側に留める
- DNS provider 固有手順や credentials は repo 標準 contract に含めない

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                          | 判断方向（Discussion 時点の仮）                                                                                      | Resolution 確定文言                                                                                                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| production-equivalent hostname を何に置くか   | preview hostname を流用せず、current production custom-domain と衝突しない dedicated hostname candidate を前提にする | `production-equivalent hostname は preview.gcp.ashnova.jp を流用せず、www.aws.ashnova.jp と衝突しない dedicated hostname candidate を別 judgment として扱う`                         |
| external DNS と Cloud DNS をどう扱うか        | current phase では external DNS source-of-truth を維持し、Cloud DNS は comparison 対象に留める                       | `DNS source-of-truth は current phase では external DNS を維持し、Cloud DNS adoption は live migration 前提ではなく separate comparison judgment に留める`                           |
| authoritative DNS write をどこに置くか        | workflow / IaC に含めず operator-managed step に留める                                                               | `authoritative DNS write は workflow / IaC に含めず、reviewed target と evidence path を前提にした operator-managed step として扱う`                                                 |
| approval boundary をどう置くか                | reviewer package と approval owner judgment を分ける                                                                 | `hostname candidate の採否と authoritative DNS change judgment は reviewer package と approval owner judgment を分離し、single-owner shortcut を production-equivalent 前提にしない` |
| same-hostname cutover をこの issue に含めるか | no。execution boundary issue に切り出す                                                                              | `same-hostname cutover、public DNS record live change、Cloud DNS migration execution は本 issue に含めず、必要時は separate execution issue に切り出す`                              |

## Resolution

Issue 62 の draft judgment は次の通りとする。

- production-equivalent hostname は `preview.gcp.ashnova.jp` を流用せず、`www.aws.ashnova.jp` と衝突しない dedicated hostname candidate を別 judgment として扱う
- DNS source-of-truth は current phase では external DNS を維持し、Cloud DNS adoption は live migration 前提ではなく separate comparison judgment に留める
- authoritative DNS write は workflow / IaC に含めず、reviewed target と evidence path を前提にした operator-managed step として扱う
- hostname candidate の採否と authoritative DNS change judgment は reviewer package と approval owner judgment を分離し、single-owner shortcut を production-equivalent 前提にしない
- same-hostname cutover、public DNS record live change、Cloud DNS migration execution は本 issue に含めず、必要時は separate execution issue に切り出す

この draft で明確になること:

- preview hostname の live proof は production-equivalent hostname 決定そのものではなく、別 candidate judgment の入力に留まる
- current production custom-domain `www.aws.ashnova.jp` と GCP candidate hostname の責務を分けるため、same-hostname migration を shortcut として採らない
- DNS source-of-truth は current phase では external DNS 維持が基準となり、Cloud DNS adoption は移行実装ではなく比較判断として扱う
- hostname と DNS governance の判断は reviewer / approval owner 境界を持ち、workflow や IaC が authoritative write を肩代わりしない

後続 issue への引き継ぎ事項:

- Issue 63 では reviewer / approval owner 分離と environment protection rules を production-equivalent release gate として具体化する
- Issue 65 では same-hostname cutover や public DNS record live change を含む execution boundary を別 issue として扱う
- production-equivalent hostname candidate の naming と public exposure strategy が必要になった場合は、current judgment を壊さず separate execution / comparison issue を追加する

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- Issue 51 の preview hostname operator memo、Issue 53 の live target / certificate evidence、Issue 61 の hostname / DNS split judgment を入力にして draft を具体化した
- 本 issue は hostname / DNS governance judgment の固定であり、live DNS change、Cloud DNS migration、same-hostname cutover 実行は依然として後続 issue の対象である
- CloudSonnet review で確認された prerequisite wording と stale resync wording を修正し、closed record として整合を維持した

## Current Status

- CLOSED
- GitHub Issue: #62
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/62
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- local issue record として hostname / DNS governance judgment draft を追加した
- preview hostname proof、current production custom-domain、external DNS source-of-truth を分けた production-equivalent hostname / DNS governance draft を追記した

## Dependencies

- Issue 51
- Issue 53
- Issue 57
- Issue 61
