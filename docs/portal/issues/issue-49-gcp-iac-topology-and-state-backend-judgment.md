## Summary

Issue 48 で GCP preview architecture baseline は `Cloud Storage + global external HTTPS load balancer + Cloud CDN + Cloud Armor + Google-managed certificate` に固定されたが、この構成を OpenTofu でどの module / environment / backend 境界に落とし込むかはまだ未整理である。このままだと、preview deploy workflow issue や DNS operator memo issue が、どの state backend と directory topology を前提にすべきか曖昧なまま先行し、Issue 9 で固定した environment isolation と output contract の原則を崩しやすい。

## Goal

GCP preview path の IaC topology と state backend judgment の論点を small-scope で切り出し、module boundary、environment entrypoint、output contract、backend strategy、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-49
- タイトル: GCP IaC topology と state backend judgment を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview IaC planning
- 優先度: 中
- 先行条件: Issue 9 closed, Issue 29 closed, Issue 47 resolved, Issue 48 resolved

目的
- 解決する問題: GCP preview architecture は fixed したが、OpenTofu 上の module / environment / backend 境界が未固定のままだと、deploy workflow、DNS operator memo、security baseline が参照すべき infra contract が曖昧なまま残る
- 期待する価値: GCP preview path をどの IaC topology で表現し、state backend をどこへ置き、どこまでを provider-specific 実装として閉じ込めるかを論点分離して判断できる

スコープ
- 含むもの: OpenTofu module boundary、environment entrypoint naming、preview 用 state backend 候補、backend bootstrap responsibility、output contract、state isolation rule、open questions table の作成
- 含まないもの: GCP resource 作成、backend bucket 実作成、tofu init/apply、deploy workflow 実装、GitHub secrets / variables の実登録、DNS operator 実作業、preview smoke 実行
- 編集可能パス: docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md
- 制限パス: infra/**, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: GCP preview path を OpenTofu で表現する責務単位と environment isolation の論点が文書から一意に読める
- [x] 条件 2: state backend の候補と判断軸が AWS 現行方針との関係を含めて整理されている
- [x] 条件 3: deploy workflow、DNS operator step、resource execution など本 issue 非対象が IaC planning から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md
- アプローチ: Issue 9 の IaC policy、Issue 29 の state locking baseline、Issue 47 と Issue 48 の GCP judgment を入力として、GCP preview path の IaC contract を module boundary、environment entrypoint、backend strategy、output translation の 4 観点で整理する
- 採用しなかった代替案と理由: いきなり infra 実装へ進む案は backend judgment や naming rule を code に埋め込みやすいため採らない。逆に architecture issue の再掲だけで済ませる案も downstream issue が参照できる IaC contract にならないため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: scope boundary wording、backend strategy wording、module / environment responsibility wording、open question coverage の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-09-iac-policy.md、docs/portal/issues/issue-29-state-locking-baseline.md、docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-48-gcp-architecture-baseline.md を照合し、IaC policy drift と GCP-specific overreach のどちらが起きているかを切り分ける

リスクとロールバック
- 主なリスク: IaC planning issue の名目で backend 実装、resource execution、workflow 実装まで scope が膨らむこと
- 影響範囲: infra directory layout、state backend strategy、deploy workflow 前提、DNS operator memo 前提
- 緩和策: 今回は topology と judgment の整理に留め、backend 実装、resource 作成、workflow wiring は follow-up execution issue に分離する
- ロールバック手順: scope が広がりすぎた場合は module boundary、environment naming、backend choice の判断軸だけを残し、implementation detail は別 issue へ切り出す
```

## Tasks

- [x] GCP preview path の module boundary 候補を整理する
- [x] environment entrypoint と naming の候補を整理する
- [x] state backend strategy の候補と判断軸を整理する
- [x] output contract と follow-up issue への引き継ぎ事項を整理する

## Definition of Done

- [x] GCP preview path の IaC topology 候補が 1 文書で追える
- [x] backend choice の比較軸と provisional direction が読める
- [x] app-facing contract と provider-specific output の境界が説明されている
- [x] resource execution / workflow 実装 / DNS operator 実作業を本 issue 非対象として維持できている

## Initial Notes

- Issue 9 により、IaC は OpenTofu を標準とし、`infra/modules/` と `infra/environments/<env>/` の二層構造、environment isolation、controlled output を維持する前提である
- Issue 29 により、AWS staging / production path は S3 backend と native lockfile を前提に整理済みであるが、GCP preview path を同じ backend family に残すか、GCS backend に分けるかは未決である
- Issue 47 により、GCP backend 方針は resource topology と切り分けた後続 issue で判断すると固定済みである
- Issue 48 により、GCP preview request path は external DNS -> global external HTTPS load balancer -> Cloud CDN -> Cloud Storage bucket に固定済みである

## Issue 49 Discussion Draft

このセクションは、GCP preview path を OpenTofu でどう表現するかを議論するためのたたき台である。ここで決めたいのは IaC contract であり、まだ決めないのは resource creation、workflow wiring、credential 登録、DNS operator execution である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview architecture をどの IaC topology で表現するか` に限定する
- 実際の bucket、load balancer、certificate、Cloud Armor policy の resource creation は別 issue に分ける
- backend bootstrap resource の実作成も本 issue では扱わない

この切り分けを採る理由:

- state backend judgment は resource execution より先に固定した方が fail-closed である
- module / environment naming が未決のまま code を足すと後で directory と state key の修正コストが高くなる
- deploy workflow issue が参照すべき output contract を先に揃えられる

### 2. module boundary の第一案

候補 A:

- `infra/modules/portal-gcp-static-delivery/` のように、GCP preview delivery を 1 つの責務単位 module として表現する
- environment 側は provider 設定、variable binding、backend、naming suffix を持つ

候補 B:

- Cloud Storage、load balancer、certificate などを service ごとに細かく module 分割する

現時点の provisional direction:

- first-step は候補 A を第一候補とし、Issue 9 の `delivery core を review しやすい最小単位でまとめる` 原則を GCP 側にも適用する方が自然である
- service ごとの細分化は preview proof の段階では review surface を増やしやすいため後回しにする

### 3. environment entrypoint の第一案

候補:

- `infra/environments/gcp-preview/`
- `infra/environments/preview-gcp/`
- `infra/environments/preview/` 配下へ cloud variant を混在させる案

現時点の provisional direction:

- `infra/environments/gcp-preview/` を第一候補にする
- 理由は、cloud と environment purpose が path から一意に読め、既存 AWS staging / production と衝突しにくく、将来 `azure-preview` のような naming へも横展開しやすいためである

### 4. state backend strategy のたたき台

ここで最初に確認したいこと:

- GCP preview の remote state backend を GCS に分けるか
- それとも current repo の backend family に寄せて、当面は AWS 側 backend を継続利用するか

候補 A: GCS backend を第一候補にする

- GCP 側 operator responsibility と provider 境界を揃えやすい
- 将来 GCP preview が単独で bootstrap / recovery される場合の説明がしやすい
- 一方で backend bootstrap と credential path が増え、preview proof の初期負荷が上がる

候補 B: current backend family を暫定継続する

- 既存 OpenTofu 運用と locking strategy を流用しやすい
- preview proof の初期 friction を減らせる
- 一方で provider-specific infra を別 cloud の backend に載せる説明が必要になり、long-term separation が弱くなりうる

現時点の provisional direction:

- architecture と同様に first-step success condition が preview proof であることを踏まえると、実装初手は候補 B の方が friction は低い
- ただし long-term の cloud separation と operator clarity を重視するなら候補 A に寄せる余地があるため、この issue では比較軸を明文化してから judgment を行うのが妥当である

### 5. backend bootstrap responsibility のたたき台

提案:

- Issue 9 の原則どおり、state backend bootstrap resource は保護対象 stack の外に置く
- GCS を選ぶ場合でも backend bucket 作成と preview delivery resource 作成は同一 stack に混ぜない
- operator-owned bootstrap step が必要なら、それ自体を separate execution memo に切る

### 6. output contract のたたき台

提案:

- OpenTofu output は infra-facing truth として保持する
- workflow や DNS operator memo が利用する値は usage-oriented name に変換する
- provider-specific 名称は output source に残してよいが、app-facing / workflow-facing contract は cloud-neutral 寄りに保つ

候補 output 例:

- reviewed preview hostname target
- preview certificate validation status reference
- preview asset origin identifier
- preview public url

### 7. 今回は決めないこと

- OpenTofu 実装ファイルの追加
- backend bucket や lock 用 resource の実作成
- preview deploy workflow の trigger と permissions
- DNS operator sequence と certificate validation 実作業
- smoke test の実装やしきい値

### 8. 後続 issue とどう接続するか

- deploy workflow issue は selected environment entrypoint と output contract を参照する
- DNS operator memo issue は reviewed target output と certificate-related output を参照する
- security / monitoring / rollback issue は backend choice と resource boundary を前提にする
- resource execution issue は selected module topology と backend judgment を前提に実装する

### 9. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                                                        | 判断方向（Discussion 時点の仮）                                        | Resolution 確定文言                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCP preview delivery を 1 つの責務単位 module で始めてよいか                                | yes。first-step は review しやすい最小単位を優先する                   | `GCP preview delivery は first-step では 1 つの責務単位 module として表現し、service ごとの細分化は validated requirement が出るまで後続 issue に分離する`                                  |
| environment entrypoint の第一候補を何に置くか                                               | `infra/environments/gcp-preview/` を第一候補にする                     | `GCP preview environment entrypoint の第一候補は infra/environments/gcp-preview/ とする`                                                                                                    |
| state backend を GCS に分けるか、current backend family を当面継続するか                    | preview friction と long-term separation の比較で判断する              | `first-step の GCP preview IaC backend は current backend family を暫定継続し、GCS backend への分離は operator separation や recovery 要件が validated になった時点の後続 issue で判断する` |
| backend bootstrap resource を delivery stack の外に置くか                                   | yes。Issue 9 の原則を維持する                                          | `state backend bootstrap resource は GCP preview delivery stack の外に置く`                                                                                                                 |
| workflow / operator 向け output は provider-neutral 寄りの usage-oriented name に変換するか | yes。app-facing contract と同じく raw provider detail を直接露出しない | `workflow / operator 向け output は raw provider-specific detail を直接露出せず、usage-oriented name に変換して受け渡す`                                                                    |

## Resolution

Issue 49 の判断結果は次の通りとする。

- GCP preview delivery は first-step では 1 つの責務単位 module として表現し、service ごとの細分化は validated requirement が出るまで後続 issue に分離する
- GCP preview environment entrypoint の第一候補は `infra/environments/gcp-preview/` とする
- first-step の GCP preview IaC backend は current backend family を暫定継続し、GCS backend への分離は operator separation や recovery 要件が validated になった時点の後続 issue で判断する
- state backend bootstrap resource は GCP preview delivery stack の外に置く
- workflow / operator 向け output は raw provider-specific detail を直接露出せず、usage-oriented name に変換して受け渡す

この合意で明確になること:

- GCP preview path の IaC は、Issue 9 の `delivery core を最小責務単位でまとめる` 原則を継承し、初手から service 単位の細分化へ進まない
- directory topology は `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を第一候補として downstream issue が参照できる
- backend は preview proof の初期 friction を下げるため current backend family を暫定継続しつつ、長期的な cloud separation を否定せず follow-up judgment へ残す
- backend bootstrap と delivery resource creation を分離するため、state backend 自体の bootstrap は保護対象 stack の外に残る
- deploy workflow や DNS operator memo が利用する値は usage-oriented output contract を前提にでき、raw provider detail を直接前提にしなくてよい

後続 issue への引き継ぎ事項:

- resource execution issue では `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を前提に OpenTofu 実装を追加する
- deploy workflow issue では selected environment entrypoint と usage-oriented outputs を参照し、preview deploy path を定義する
- DNS operator memo issue では reviewed preview hostname target や certificate-related output を参照して operator step を整理する
- backend separation follow-up が必要になった場合は、GCS backend 採用時の bootstrap path、credential path、locking strategy を独立 issue で比較する

## Process Review Notes

- Section 9 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は implementation ではなく IaC contract の固定であり、backend 実装、resource 作成、workflow wiring、DNS operator execution は依然として後続 issue の対象である
- GitHub Issue #49 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- ISSUE CLOSED
- GitHub Issue: #49
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/49
- Sync Status: local close note updated and GitHub issue body resynced before closing
- Close Status: GitHub issue closed; local record retained as final reference

- local issue record は未作成だったため、このファイルを GCP IaC topology と state backend judgment の initial draft として追加する
- architecture baseline は Issue 48 を前提にし、IaC planning の論点だけを分離する
- open questions は Resolution へ統合し、module boundary、environment entrypoint、backend 方針、output contract は固定した
- follow-up issue として deploy workflow、DNS/operator、security、monitoring、rollback、execution issue まで整備済みであり、Issue 52 / 53 の implementation と validation も完了している
- GitHub Issue #49 は local issue record の最新版へ再同期済みである

## Dependencies

- Issue 9
- Issue 29
- Issue 47
- Issue 48
