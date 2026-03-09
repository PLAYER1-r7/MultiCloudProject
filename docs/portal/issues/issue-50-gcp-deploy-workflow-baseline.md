## Summary

Issue 47 で GCP support の first step は preview/static delivery proof に限定され、Issue 49 で GCP preview path の IaC topology と backend 方針も固定された。ただし、shared build artifact をどこで確定し、どの trigger と approval 境界で GCP preview deploy を起動し、deploy 後の verification をどの証跡として残すかという workflow baseline はまだ未整理である。このままだと、resource execution issue と DNS operator memo issue が、どの GitHub Actions path と output contract を前提に進めるべきか曖昧なままになる。

## Goal

GCP preview deploy workflow baseline の議論たたき台を作り、artifact reuse、trigger、environment gate、deploy/verification evidence、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-50
- タイトル: GCP deploy workflow baseline を整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview workflow planning
- 優先度: 中
- 先行条件: Issue 10 closed, Issue 47 resolved, Issue 48 resolved, Issue 49 resolved

目的
- 解決する問題: GCP preview path の architecture と IaC contract は fixed したが、shared build artifact をどう流用し、どの trigger と environment 境界で preview deploy を起動し、どの verification evidence を残すかが未固定のままだと workflow 実装の責務分離が崩れやすい
- 期待する価値: GCP preview deploy の workflow baseline を build / deploy / verification / operator handoff の単位で整理し、実装前に stop condition と非対象を明示できる

スコープ
- 含むもの: shared build artifact reuse 方針、GCP preview deploy trigger 候補、workflow responsibility boundary、environment / secret gate の考え方、deploy evidence と verification handoff、open questions table の作成
- 含まないもの: GitHub Actions YAML 実装、GitHub environment / secrets / variables の実登録、GCP credential 発行、preview deploy 実行、DNS operator 実作業、production promotion 設計
- 編集可能パス: docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md
- 制限パス: .github/workflows/*.yml, infra/**, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview deploy workflow の責務分離と trigger 候補が文書から一意に読める
- [ ] 条件 2: build artifact reuse と deploy evidence / verification evidence の流れが整理されている
- [ ] 条件 3: secrets 実登録、resource execution、DNS operator step など本 issue 非対象が workflow planning から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md
- アプローチ: Issue 10 の CI/CD policy と Issue 49 の IaC contract を入力として、GCP preview path の workflow baseline を trigger、artifact handoff、environment gate、verification evidence、operator handoff の 5 観点で整理する
- 採用しなかった代替案と理由: いきなり workflow YAML を書く案は trigger や evidence contract をコードに埋め込みやすいため採らない。逆に CI/CD policy の再掲だけで済ませる案も GCP preview 固有の deploy path を downstream issue が参照しづらいため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: scope boundary wording、trigger wording、artifact/evidence wording、open question coverage の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-10-cicd-policy.md、docs/portal/issues/issue-47-gcp-baseline-design.md、docs/portal/issues/issue-48-gcp-architecture-baseline.md、docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md を照合し、workflow scope drift と implementation overreach のどちらが起きているかを切り分ける

リスクとロールバック
- 主なリスク: workflow planning issue の名目で GitHub environment 設定、credential 作成、preview deploy 実行まで scope が膨らむこと
- 影響範囲: .github/workflows 設計、GitHub environment 前提、preview smoke / verification flow、DNS operator handoff
- 緩和策: 今回は trigger と evidence contract の整理に留め、workflow 実装、credential 登録、deploy 実行は follow-up execution issue に分離する
- ロールバック手順: scope が広がりすぎた場合は trigger、artifact handoff、verification handoff だけを残し、implementation detail は別 issue に切り出す
```

## Tasks

- [x] shared build artifact reuse の候補を整理する
- [x] GCP preview deploy trigger と responsibility boundary を整理する
- [x] deploy evidence / verification handoff を整理する
- [x] follow-up execution issue へ渡す workflow memo を作成する

## Definition of Done

- [x] GCP preview deploy workflow の trigger と責務分離が 1 文書で追える
- [x] artifact reuse と deploy evidence の流れが読める
- [x] verification handoff と operator handoff の境界が説明されている
- [x] workflow 実装 / secrets 実登録 / DNS operator 実作業を本 issue 非対象として維持できている

## Initial Notes

- Issue 10 により、validation と deploy は分離し、staging 相当の deploy は review 済み main commit を起点にした guarded path として設計する前提である
- Issue 47 により、GCP deploy workflow は first step では preview 相当までに留め、build artifact は AWS / GCP で共通化する方向が fixed 済みである
- Issue 48 により、GCP preview path は external DNS -> global external HTTPS load balancer -> Cloud CDN -> Cloud Storage bucket を前提にする
- Issue 49 により、GCP preview environment entrypoint は `infra/environments/gcp-preview/` が第一候補であり、workflow / operator 向け output は usage-oriented name に変換して受け渡す前提である

## Issue 50 Discussion Draft

このセクションは、GCP preview deploy workflow baseline を議論するためのたたき台である。ここで決めたいのは workflow contract であり、まだ決めないのは workflow 実装、credential 登録、preview deploy 実行、DNS operator execution である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview deploy をどの workflow contract で起動し、何を evidence として残すか` に限定する
- build workflow 自体の再設計や multi-cloud production promotion は扱わない
- DNS operator step と certificate validation 実作業は別 issue に分ける

### 2. shared build artifact reuse の第一案

提案:

- `portal-web` の build artifact は cloud 共通の deploy candidate として 1 回だけ確定する
- GCP preview deploy workflow はその artifact を再利用し、cloud-specific build を追加しない
- artifact identity は main 上の review 済み commit と結び付けて扱う

この方向の理由:

- Issue 10 の build / deploy 分離を維持しやすい
- GCP 導入で build pipeline 自体を増やさずに済む
- rollback や evidence tracking を commit 単位で揃えやすい

### 3. trigger と起動境界の第一案

候補:

- main 上の review 済み commit を対象にした manual dispatch
- successful validation / artifact publish 後の段階的な workflow chaining

現時点の provisional direction:

- first-step の正規経路は main 上の review 済み commit を対象にした manual dispatch とする
- 自動連結は preview workflow behavior と environment gate の確認後に段階導入する

### 4. environment gate と secret boundary のたたき台

提案:

- GCP preview deploy workflow は cloud-specific credential と deploy 権限を持つが、reviewer approval gate までは initial requirement に置かない
- ただし workflow が参照する secret / variable は preview 専用 scope に分ける
- production 向け gate や named approver の議論はこの issue に持ち込まない

### 5. deploy evidence と verification handoff のたたき台

提案:

- deploy workflow は artifact identifier、target environment、selected commit、主要 output reference を evidence として残す
- verification 自体は workflow 完結に限定せず、smoke / reachability confirmation へ handoff できる形にする
- evidence wording は provider resource 名ではなく preview URL、reviewed target、artifact identity を主語にする

候補 evidence 例:

- deployed commit SHA
- reused artifact identifier
- preview public URL
- reviewed preview hostname target reference
- selected environment entrypoint reference

### 6. operator handoff のたたき台

提案:

- workflow は DNS operator step を完結させる責務を持たず、必要な reviewed target と verification reference を出力する側に留める
- DNS operator memo issue は workflow が残す evidence を前提に operator sequence を定義する
- certificate validation 実作業も workflow 完結を前提にしない

### 7. 今回は決めないこと

- `.github/workflows/*.yml` の実装
- GitHub environment / secrets / variables の実登録
- OIDC や service account credential の具体設定
- preview deploy 実行
- DNS operator sequence と certificate validation 実作業

### 8. 後続 issue とどう接続するか

- resource execution issue は selected commit と artifact handoff を前提に OpenTofu 実装を呼び出す側を設計する
- DNS operator memo issue は workflow evidence と reviewed target を受け取る
- monitoring / rollback issue は deploy evidence と verification evidence を前提に一次確認経路を定義する

### 9. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                           | 判断方向（Discussion 時点の仮）                                            | Resolution 確定文言                                                                                                                                                                                |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCP preview deploy は shared build artifact を再利用してよいか | yes。cloud-specific build は増やさない                                     | `GCP preview deploy は shared build artifact を再利用し、cloud-specific build は追加しない`                                                                                                        |
| GCP preview deploy の正規 trigger を何に置くか                 | main 上の review 済み commit を対象にした manual dispatch を第一候補にする | `GCP preview deploy の正規 trigger は main 上の review 済み commit を対象にした manual dispatch とする`                                                                                            |
| preview deploy に reviewer approval gate を置くか              | no。initial step では secret / deploy 権限制御で足りる                     | `GCP preview deploy には reviewer approval gate を置かず、preview 専用 secret scope と deploy 権限の制御で安全性を担保する`                                                                        |
| workflow は何を deploy evidence として残すか                   | commit、artifact、preview URL、reviewed target reference を残す            | `deploy workflow は selected commit、reused artifact identifier、preview public URL、reviewed preview hostname target reference、selected environment entrypoint reference を evidence として残す` |
| DNS operator step を workflow に含めるか                       | no。workflow は handoff evidence を出す側に留める                          | `DNS operator step は workflow に含めず、workflow は operator handoff に必要な reviewed target と verification reference を出力する側に留める`                                                     |

## Resolution

Issue 50 の判断結果は次の通りとする。

- GCP preview deploy は shared build artifact を再利用し、cloud-specific build は追加しない
- GCP preview deploy の正規 trigger は main 上の review 済み commit を対象にした manual dispatch とする
- GCP preview deploy には reviewer approval gate を置かず、preview 専用 secret scope と deploy 権限の制御で安全性を担保する
- deploy workflow は selected commit、reused artifact identifier、preview public URL、reviewed preview hostname target reference、selected environment entrypoint reference を evidence として残す
- DNS operator step は workflow に含めず、workflow は operator handoff に必要な reviewed target と verification reference を出力する側に留める

この合意で明確になること:

- GCP preview workflow は Issue 10 の build / deploy 分離を維持しつつ、cloud 固有 build を増やさずに shared artifact を再利用する
- 正規経路は manual dispatch のままに留まり、preview workflow behavior と environment gate の確認が済むまでは自動 chaining を要求しない
- preview step では production 相当の reviewer approval gate を持ち込まず、権限と secret scope の制御で blast radius を抑える
- deploy evidence は preview URL や reviewed target を主語に残るため、DNS operator memo や monitoring / rollback issue が同じ証跡を参照できる
- workflow は DNS cutover や certificate validation 実作業を内包せず、operator handoff を前提に責務を分離できる

後続 issue への引き継ぎ事項:

- workflow execution issue では main commit 指定、artifact 参照、preview 専用 secret scope を前提に `.github/workflows` 実装を追加する
- DNS operator memo issue では reviewed preview hostname target reference と verification reference を受け取り、operator sequence を具体化する
- monitoring / rollback issue では deploy evidence を起点に preview 到達性確認と known-good artifact 参照経路を整理する
- workflow chaining を段階導入する場合は、preview deploy 成功条件と default-branch 制約を別 issue で比較する

## Process Review Notes

- Section 9 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は workflow contract の固定であり、workflow YAML 実装、credential 登録、preview deploy 実行、DNS operator execution は依然として後続 issue の対象である
- GitHub Issue #50 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED

- local issue record は未作成だったため、このファイルを GCP deploy workflow baseline の initial draft として追加する
- workflow planning の論点は IaC / architecture / DNS operator work から分離して扱う
- open questions は Resolution へ統合し、artifact reuse、trigger、evidence、operator handoff の方針は固定した
- 実装作業は未実施であり、次段は workflow execution issue か DNS operator memo issue への分割である
- GitHub Issue #50 は local issue record の最新版へ再同期済みである

## Dependencies

- Issue 10
- Issue 47
- Issue 48
- Issue 49
