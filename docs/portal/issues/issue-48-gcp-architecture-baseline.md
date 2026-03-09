## Summary

Issue 47 で GCP support の first-step scope は preview/static delivery baseline に限定し、第一候補 architecture は `Cloud Storage + global external HTTPS load balancer + Cloud CDN + Cloud Armor + Google-managed certificate` とする方向まで確定した。ただし、どの resource をどの責務単位で持ち、preview domain `preview.gcp.ashnova.jp` をどの entrypoint / certificate / WAF / origin path に接続するかという resource topology はまだ未固定である。このままだと、IaC issue や deploy workflow issue が architecture 未確定のまま先行し、責務分離と fail-closed boundary が崩れやすい。

## Goal

GCP architecture baseline を実務で使える粒度に整理し、preview static delivery の resource topology、request path、責務分離、非対象、open questions を current design record として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-48
- タイトル: GCP architecture baseline を具体化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview architecture planning
- 優先度: 中
- 先行条件: Issue 47 resolved

目的
- 解決する問題: GCP first-step の target product set は決まったが、resource topology と request path が未固定のままだと、IaC、workflow、DNS operator memo、security baseline がどの architecture を前提にすべきか曖昧なまま残る
- 期待する価値: preview static delivery path の architecture baseline を 1 案へ絞り、resource の責務、entrypoint、certificate path、WAF path、非採用 path を後続 issue が参照できる

スコープ
- 含むもの: GCP preview entrypoint、origin、edge cache、certificate path、WAF path、request path、resource responsibility boundary、非採用 architecture の理由、open questions table
- 含まないもの: GCP resource 作成、OpenTofu backend 決定、deploy workflow 実装、GitHub environment 追加、DNS operator 実作業、preview smoke 実行、cost ceiling 最終決定
- 編集可能パス: docs/portal/issues/issue-48-gcp-architecture-baseline.md
- 制限パス: infra/**, apps/portal-web/**, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview static delivery の request path と resource topology が文書から一意に読める
- [ ] 条件 2: Cloud Storage、load balancer、Cloud CDN、Cloud Armor、certificate の責務分離が明示されている
- [ ] 条件 3: IaC backend、workflow、DNS operator step など本 issue 非対象が architecture baseline から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-48-gcp-architecture-baseline.md
- アプローチ: Issue 47 の Resolution を入力として、AWS architecture baseline issue の粒度を参考にしつつ、GCP preview path を request path、service decision、responsibility boundary、change trigger の 4 つの観点で整理する
- 採用しなかった代替案と理由: IaC backend や deploy workflow まで同時に決める案は architecture issue の責務を超えるため採らない。逆に product set だけを再掲して topology を曖昧に残す案も downstream issue が参照しづらいため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: request path wording、service responsibility wording、scope boundary wording、open questions coverage の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-04-aws-architecture.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md を照合し、architecture scope と downstream scope の混線有無を確認する

リスクとロールバック
- 主なリスク: architecture baseline issue が deploy 手順や IaC backend、DNS execution まで抱え込み、後続 issue と責務が重複すること
- 影響範囲: GCP IaC topology、deploy workflow、preview domain operator path、security baseline
- 緩和策: resource topology と request path に論点を限定し、backend、workflow、operator step、cost ceiling は明示的に follow-up へ残す
- ロールバック手順: scope が広がりすぎた場合は request path、service decision、non-goals だけを残し、implementation-oriented detail は別 issue に切り出す
```

## Tasks

- [x] preview request path を 1 案に整理する
- [x] service decision と責務分離を整理する
- [x] non-goals と change triggers を整理する
- [x] follow-up issue が参照できる architecture memo にする

## Definition of Done

- [x] GCP preview architecture が 1 案に絞られ、主要 request path を説明できる
- [x] 採用 service と非採用 path が理由付きで整理されている
- [x] certificate、WAF、origin、edge の責務境界が読める
- [x] IaC backend / workflow / DNS operator step を本 issue 非対象として維持できている

## Initial Notes

- Issue 47 により、preview domain は `preview.gcp.ashnova.jp`、第一候補 architecture は `Cloud Storage + global external HTTPS load balancer + Cloud CDN + Cloud Armor + Google-managed certificate` と固定済みである
- current production は `www.aws.ashnova.jp` を external DNS source-of-truth で運用しているため、GCP architecture baseline でも same hostname reuse は前提にしない
- first-step の成功条件は production parity ではなく preview delivery proof であるため、architecture baseline も preview path を中心に整理する必要がある

## Issue 48 Discussion Draft

このセクションは、GCP architecture baseline を具体化するためのたたき台である。ここで決めたいのは resource topology と request path であり、まだ決めないのは backend、deploy workflow、DNS operator execution、preview deploy 実行である。

### 1. 推奨 request path の第一案

```text
User
  -> external DNS for preview.gcp.ashnova.jp
  -> global external HTTPS load balancer
  -> Cloud CDN
  -> backend bucket backed by Cloud Storage
```

提案:

- public entrypoint は global external HTTPS load balancer に置く
- static asset origin は Cloud Storage bucket に置く
- edge cache は Cloud CDN に担わせる
- preview custom-domain HTTPS termination は Google-managed certificate を第一候補にする
- WAF / edge protection は Cloud Armor policy を load balancer path に接続する

### 2. service decision のたたき台

- Cloud Storage: adopt
  - reason: static-first origin として最小であり、portal-web の build artifact をそのまま配信対象にしやすい
- Global external HTTPS load balancer: adopt
  - reason: preview custom domain、HTTPS entrypoint、Cloud Armor 接続点として必要
- Cloud CDN: adopt
  - reason: edge cache を load balancer path に統合し、public delivery behavior を安定させる
- Cloud Armor: adopt
  - reason: current security baseline の GCP 側 WAF posture を先に architecture に組み込むため
- Google-managed certificate: adopt as first choice
  - reason: preview domain の初期 HTTPS path を最小実装で成立させやすい
- Certificate Manager advanced pattern: do not adopt in this baseline
  - reason: first step では product comparison より preview path 成立を優先する
- Cloud DNS: do not adopt in this baseline
  - reason: authoritative DNS は current phase では external DNS に残すため
- Cloud Run: do not adopt in this baseline
  - reason: static-first portal では compute path を増やす合理性が薄い
- Firebase Hosting: do not adopt in this baseline
  - reason: first-step architecture は Issue 47 で fixed した resource family に揃える

### 3. 責務分離のたたき台

- load balancer は public entrypoint、HTTPS termination、Cloud Armor attach point を担当する
- Cloud CDN は cache behavior と edge delivery performance を担当する
- Cloud Storage は static artifact origin を担当する
- certificate path は preview domain の HTTPS 成立に限定し、DNS validation や operator step は別 issue に残す
- external DNS は reviewed target を向ける authoritative source of truth として残し、GCP 側はその target を受ける consumer として扱う

### 4. 今回は決めないこと

- OpenTofu backend を GCS に置くかどうか
- preview deploy workflow の trigger と GitHub environment variable
- DNS operator sequence と certificate validation 実作業
- monitoring signal の閾値や alert routing owner
- rollback 実行手順の詳細

### 5. change triggers のたたき台

- authenticated path が必要になった場合
- dynamic backend または API requirement が validated になった場合
- authoritative DNS を GCP 側へ移す requirement が生じた場合
- preview ではなく production-equivalent topology が必要になった場合
- Google-managed certificate では不足する certificate requirement が出た場合

### 6. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                   | 判断方向（Discussion 時点の仮）                                 | Resolution 確定文言                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| preview entrypoint をどこに置くか                      | global external HTTPS load balancer を public entrypoint にする | `preview entrypoint は global external HTTPS load balancer とする`                           |
| static artifact origin をどこに置くか                  | Cloud Storage bucket を origin にする                           | `static artifact origin は Cloud Storage bucket とする`                                      |
| WAF / edge protection をどこで受けるか                 | Cloud Armor を load balancer path に attach する                | `WAF / edge protection baseline は Cloud Armor を load balancer path に attach して実現する` |
| preview certificate の第一候補を何にするか             | Google-managed certificate を第一候補にする                     | `preview certificate の第一候補は Google-managed certificate とする`                         |
| Cloud DNS を architecture baseline に含めるか          | no。external DNS source-of-truth を維持する                     | `Cloud DNS は architecture baseline に含めず、authoritative DNS は external DNS に残す`      |
| Cloud Run や Firebase Hosting を first-step に含めるか | no。static-first baseline では採らない                          | `Cloud Run と Firebase Hosting は first-step architecture baseline では採らない`             |

## Resolution

Issue 48 の判断結果は次の通りとする。

- preview entrypoint は global external HTTPS load balancer とする
- static artifact origin は Cloud Storage bucket とする
- WAF / edge protection baseline は Cloud Armor を load balancer path に attach して実現する
- preview certificate の第一候補は Google-managed certificate とする
- Cloud DNS は architecture baseline に含めず、authoritative DNS は external DNS に残す
- Cloud Run と Firebase Hosting は first-step architecture baseline では採らない

この判断を反映した preview request path は次の通りとする。

```text
User
  -> external DNS for preview.gcp.ashnova.jp
  -> global external HTTPS load balancer
  -> Cloud CDN
  -> Cloud Storage bucket
```

この合意で明確になること:

- preview domain `preview.gcp.ashnova.jp` の public entry は load balancer に固定され、Cloud Storage は origin に限定される
- edge cache、HTTPS termination、WAF attach point、origin path の責務が分離されるため、IaC issue は resource topology を前提にできる
- external DNS source-of-truth judgment を維持したまま、GCP architecture は preview target consumer として扱える
- Cloud Run、Firebase Hosting、Cloud DNS などの代替 path を first-step から外すことで、architecture baseline を 1 案に絞れる

後続 issue への引き継ぎ事項:

- GCP IaC topology issue では load balancer、Cloud CDN、Cloud Armor、Cloud Storage、certificate wiring をどの module / environment entrypoint で表現するかを整理する
- GCP deploy workflow issue ではこの request path を前提に preview artifact upload、cache invalidation 相当、smoke verification を設計する
- GCP preview domain / certificate / DNS operator memo issue では `preview.gcp.ashnova.jp` 向けの reviewed target、certificate validation、operator-owned DNS step を定義する
- GCP security / monitoring / rollback issue では Cloud Armor policy depth、Cloud Audit Logs、artifact restore、DNS rollback をこの architecture boundary に接続する

## Process Review Notes

- Section 6 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- この記録は implementation issue ではなく architecture baseline の確定記録であり、resource creation、backend、workflow、DNS operator execution は依然として後続 issue の対象である
- GitHub Issue #48 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED

- local issue record は未作成だったため、このファイルを GCP architecture baseline の initial draft として追加した
- preview request path と service decision は Resolution へ統合し、architecture baseline は 1 案に固定した
- implementation work は未実施であり、次段は IaC topology、deploy workflow、DNS operator memo への分割である
- GitHub Issue #48 は local issue record の最新版へ再同期済みである

## Dependencies

- Issue 47
