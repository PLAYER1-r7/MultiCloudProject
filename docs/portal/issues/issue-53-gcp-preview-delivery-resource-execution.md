## Summary

Issue 48 で GCP preview architecture は `Cloud Storage + global external HTTPS load balancer + Cloud CDN + Cloud Armor + Google-managed certificate` に固定され、Issue 49 で `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を第一候補にする IaC contract も fixed された。Issue 51 では external DNS operator へ handoff すべき reviewed target reference と certificate-related reference が整理され、Issue 52 では workflow がそれらを evidence として扱う前提も固まった。しかし現時点では GCP preview resource を作成する OpenTofu 実装が repo に存在せず、workflow や operator memo が参照すべき actual output surface が未作成のままである。このままだと、GCP preview deploy path は contract だけが先行し、resource wiring と output naming を live state で検証できない。

## Goal

GCP preview delivery resource execution issue の議論たたき台を作り、OpenTofu module / environment 実装、reviewed input、plan/apply evidence、usage-oriented outputs、README handoff、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-53
- タイトル: GCP preview delivery resource execution を行う
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview delivery resources
- 優先度: 中
- 先行条件: Issue 48 resolved, Issue 49 resolved, Issue 50 resolved, Issue 51 resolved, Issue 52 resolved

目的
- 解決する問題: GCP preview architecture、IaC contract、workflow handoff、DNS/operator boundary は fixed したが、実際の GCP preview delivery resource が未作成だと preview public URL、reviewed target reference、certificate-related reference、workflow-facing outputs を実体として確認できない
- 期待する価値: `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を通じて GCP preview delivery resource を fail-closed に作成し、workflow と DNS/operator handoff が参照できる output surface を execution record に固定できる

スコープ
- 含むもの: OpenTofu module / environment 実装方針、reviewed input の確認、GCP preview resource の plan/apply 実行方針、Cloud Storage / global external HTTPS load balancer / Cloud CDN / Cloud Armor / Google-managed certificate wiring、usage-oriented output capture、environment README / issue record への evidence 整理、open questions table の作成
- 含まないもの: GCP preview deploy workflow 実装、GitHub environment / secrets / variables の実登録、preview artifact upload、preview deploy 実行、external DNS change 実施、certificate validation 実作業、monitoring / rollback 実装
- 編集可能パス: docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md
- 制限パス: apps/portal-web/**, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview delivery resource execution の責務と編集対象が文書から一意に読める
- [ ] 条件 2: reviewed input、plan/apply evidence、usage-oriented outputs、operator/workflow handoff の contract が整理されている
- [ ] 条件 3: workflow 実装、DNS operator 実作業、preview deploy 実行など本 issue 非対象が execution issue から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md
- アプローチ: Issue 48 の architecture baseline、Issue 49 の IaC topology judgment、Issue 51 の operator memo、Issue 52 の workflow execution scope を入力として、GCP preview resource execution issue を module / environment 実装、reviewed input、plan/apply evidence、usage-oriented outputs の 4 観点で整理する
- 採用しなかった代替案と理由: workflow 実装を先に進める案は actual output surface が未作成のため handoff 先が曖昧になる。逆に architecture / IaC judgment の再掲だけで済ませる案も execution に必要な reviewed input と evidence path が downstream issue から参照しづらいため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: execution scope wording、reviewed input wording、resource wiring wording、output / evidence wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-48-gcp-architecture-baseline.md、docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md、docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、infra/environments/staging/**、infra/modules/portal-static-site/** を照合し、resource boundary drift と execution scope overreach のどちらが起きているかを切り分ける

リスクとロールバック
- 主なリスク: resource execution issue の名目で workflow 実装、DNS operator 実作業、preview deploy 実行まで scope が膨らむこと
- 影響範囲: infra/modules/**、infra/environments/**、preview output handoff、operator review path
- 緩和策: 今回は resource creation と output capture に限定し、workflow implementation、DNS operator execution、artifact upload は follow-up step に残す
- ロールバック手順: scope が広がりすぎた場合は module / environment 実装、reviewed input、output capture だけを残し、workflow / DNS / deploy execution は別 issue に切り出す
```

## Tasks

- [x] GCP preview module / environment 実装対象と編集面を整理する
- [x] reviewed input と plan/apply evidence を整理する
- [x] usage-oriented outputs と workflow / operator handoff を整理する
- [x] README / execution record 更新対象を整理する

## Definition of Done

- [x] GCP preview resource execution 対象と責務が 1 文書で追える
- [x] reviewed input と plan/apply evidence の前提が読める
- [x] usage-oriented outputs と workflow / operator handoff の方向性が説明されている
- [x] workflow 実装 / DNS operator 実作業 / preview deploy 実行を本 issue 非対象として維持できている

## Initial Notes

- Issue 48 により、GCP preview request path は `external DNS -> global external HTTPS load balancer -> Cloud CDN -> Cloud Storage bucket` を前提にし、Cloud Armor と Google-managed certificate を attach する baseline である
- Issue 49 により、first-step の GCP preview IaC は `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を第一候補にし、workflow / operator 向け output は usage-oriented name に変換して受け渡す前提である
- Issue 51 により、external DNS authoritative write は operator manual step に残し、resource execution は reviewed target reference と certificate-related reference を handoff する側に留まる
- Issue 52 により、workflow は `portal-web-dist` と `portal-build-evidence` を再利用し、preview public URL、reviewed target reference、certificate-related reference、run URL を operator handoff evidence として残す前提である
- current repo には `infra/environments/gcp-preview/` と `infra/modules/portal-gcp-static-delivery/` は未作成であり、既存 OpenTofu 実装は AWS staging / production と `infra/modules/portal-static-site/` に限定されている

## Issue 53 Discussion Draft

このセクションは、GCP preview delivery resource execution を議論するためのたたき台である。ここで決めたいのは resource execution scope であり、まだ決めないのは workflow implementation、preview artifact upload、DNS operator execution、preview deploy 実行である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview delivery resource をどの OpenTofu surface で作成し、何を output/evidence として残すか` に限定する
- GitHub workflow 実装や artifact upload は含めない
- external DNS change と certificate validation 実作業は別 issue に残す

### 2. module / environment 実装の第一案

提案:

- `infra/modules/portal-gcp-static-delivery/` を新設する
- `infra/environments/gcp-preview/` を新設し、provider 設定、backend、variable binding、output translation を持たせる
- first-step は 1 つの責務単位 module を維持し、service ごとの細分化は行わない

この方向の理由:

- Issue 49 の IaC contract と整合する
- GCP preview path の review surface を小さく保てる
- workflow と operator memo が参照する usage-oriented output を environment 側で束ねやすい

### 3. reviewed input の第一案

提案:

- reviewed input として preview hostname `preview.gcp.ashnova.jp`、environment 名、project / region 相当、resource naming suffix、certificate / target handoff に必要な値を確認する
- backend は current backend family のまま fail-closed に扱う
- reviewed input には backend config source、state key / workspace identity、bootstrap 済み前提の確認結果も含める
- authoritative DNS write や provider account detail は reviewed input に含めない

### 4. resource wiring と plan/apply evidence の第一案

提案:

- Cloud Storage bucket、global external HTTPS load balancer、Cloud CDN、Cloud Armor、Google-managed certificate の wiring を 1 execution record に残す
- plan/apply は reviewed input と output capture を同じ issue record に束ねる
- certificate / target 関連で pending state が残る場合も fail-closed に記録する
- pending state が operator hold 条件に当たる場合は execution completed と扱わず、workflow / operator handoff は `blocked pending state` として残す

### 5. usage-oriented outputs の第一案

提案:

- raw provider id のみを渡さず、workflow / operator が直接使う naming を output に含める
- 候補 output は preview public URL、reviewed target reference、certificate-related reference、preview asset origin identifier、selected environment entrypoint reference とする
- output source に raw provider-specific detail を残しても、handoff は usage-oriented naming を主語にする

### 6. README / execution record handoff の第一案

提案:

- `infra/environments/gcp-preview/README.md` を追加し、apply 前提、required reviewed input、output meaning、operator/workflow handoff を整理する
- issue record には reviewed input、plan/apply evidence、created outputs、非対象を残す
- `.github/workflows/README.md` の更新は workflow implementation issue 側に残す

### 7. 今回は決めないこと

- `.github/workflows/portal-gcp-preview-deploy.yml` の実装
- GitHub environment / secrets / variables の実登録
- preview artifact upload や preview deploy 実行
- external DNS change 実施
- certificate validation 実作業と monitoring / rollback 実装

### 8. 後続 issue とどう接続するか

- workflow implementation step は usage-oriented outputs を入力として preview deploy evidence と operator handoff artifact を実装する
- DNS/operator follow-up は reviewed target reference と certificate-related reference を受け取り、external DNS operator sequence と接続する
- monitoring / rollback issue は preview public URL と selected artifact/reference の組を起点に確認経路を定義する

### 9. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                                   | 判断方向（Discussion 時点の仮）                                                                                      | Resolution 確定文言                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCP preview delivery resource をどの module / environment で実装するか | `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を第一候補にする                    | `GCP preview delivery resource は infra/modules/portal-gcp-static-delivery/ と infra/environments/gcp-preview/ を第一候補として実装する`                                                                                                                |
| reviewed input に何を含めるか                                          | preview hostname、project / region 相当、naming suffix、target/certificate handoff に必要な値を第一候補にする        | `GCP preview resource execution の reviewed input は preview hostname、project / region 相当、resource naming suffix、target/certificate handoff に必要な値、backend config source、state key / workspace identity、bootstrap 済み前提の確認結果を含む` |
| resource execution は何を output として残すか                          | preview public URL、reviewed target reference、certificate-related reference、preview asset origin identifier を残す | `GCP preview resource execution は preview public URL、reviewed target reference、certificate-related reference、preview asset origin identifier、selected environment entrypoint reference を output として残す`                                       |
| workflow 実装や DNS operator 実作業をこの issue に含めるか             | no。resource creation と output capture に限定する                                                                   | `workflow 実装、DNS operator 実作業、preview deploy 実行は本 issue に含めず、resource creation と output capture に限定する`                                                                                                                            |
| pending certificate / target state が残る場合にどう扱うか              | fail-closed に記録し、operator/workflow handoff へ渡す                                                               | `pending certificate / target state が残る場合は fail-closed に記録し、operator hold 条件に当たる間は execution completed と扱わず、operator/workflow handoff へ blocked pending state として渡す`                                                      |

## Resolution

Issue 53 の判断結果は次の通りとする。

- GCP preview delivery resource は `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を第一候補として実装する
- GCP preview resource execution の reviewed input は preview hostname、project / region 相当、resource naming suffix、target/certificate handoff に必要な値、backend config source、state key / workspace identity、bootstrap 済み前提の確認結果を含む
- GCP preview resource execution は preview public URL、reviewed target reference、certificate-related reference、preview asset origin identifier、selected environment entrypoint reference を output として残す
- workflow 実装、DNS operator 実作業、preview deploy 実行は本 issue に含めず、resource creation と output capture に限定する
- pending certificate / target state が残る場合は fail-closed に記録し、operator hold 条件に当たる間は execution completed と扱わず、operator/workflow handoff へ blocked pending state として渡す

この合意で明確になること:

- GCP preview path の resource execution は Issue 49 の IaC contract をそのまま実装面へ落とし込み、module と environment の責務境界を崩さない
- reviewed input には preview hostname と target/certificate handoff に必要な値に加えて backend identity と bootstrap 前提を含めるため、Issue 49 で固定した current backend family 継続と stack 外 bootstrap を実装時にも再確認できる
- workflow と operator memo が参照する output は raw provider id だけでなく usage-oriented naming を含むため、preview public URL や reviewed target を review path の主語にできる
- workflow 実装、artifact upload、preview deploy 実行、external DNS change をこの issue から外すことで、resource creation と execution evidence の判断が live deploy path と混線しない
- certificate や target の control-plane state が即時に整わない場合でも、operator hold 条件かどうかを execution record 上で判別できるため、workflow / operator 側は blocked pending state と handoff 可能 pending state を区別できる

後続 issue への引き継ぎ事項:

- 実装フェーズでは `infra/modules/portal-gcp-static-delivery/`、`infra/environments/gcp-preview/`、`infra/environments/gcp-preview/README.md` を追加し、backend identity を含む reviewed input、plan/apply evidence、output capture を issue record へ残す
- workflow implementation step では preview public URL、reviewed target reference、certificate-related reference、selected environment entrypoint reference を deploy evidence と operator handoff artifact に取り込む
- DNS/operator follow-up では reviewed target reference と certificate-related reference を参照し、external DNS operator sequence と validation/revalidation path を具体化する
- monitoring / rollback issue では preview public URL と selected artifact/reference の組を起点に到達性確認と known-good state 参照経路を整理する

## Process Review Notes

- Section 9 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は resource execution scope の固定であり、workflow 実装、GitHub environment 実登録、artifact upload、preview deploy 実行、DNS operator execution は依然として後続 issue の対象である
- GitHub Issue #53 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED
- GitHub Issue: #53
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/53
- Sync Status: local implementation updated and GitHub issue body resynced

- local issue record は未作成だったため、このファイルを GCP preview delivery resource execution の initial draft として追加する
- resource execution の論点は workflow implementation、artifact upload、DNS operator work から分離して扱う
- open questions は Resolution へ統合し、module/environment、reviewed input、usage-oriented outputs、pending state、non-goals の方針は固定した
- `infra/modules/portal-gcp-static-delivery/` と `infra/environments/gcp-preview/` を追加し、Cloud Storage、global external HTTPS load balancer、Cloud CDN、Cloud Armor、Google-managed certificate、HTTP redirect をまとめた first-step OpenTofu surface を実装した
- `infra/environments/gcp-preview/README.md` と `terraform.tfvars.example` を追加し、reviewed input、usage-oriented output contract、resource execution record template、fail-closed rules を environment handoff として明文化した
- 新規 OpenTofu module / environment ファイルには editor diagnostics 上のエラーはなく、対象ディレクトリに対して `tofu fmt` を実行済みである
- preinstalled `tofu v1.8.8` では fresh backend init が `use_lockfile = true` を解釈できず停止したため、production execution precedent と同様に local execution binary として `OpenTofu v1.11.0` を配置し、[infra/environments/gcp-preview/versions.tf](infra/environments/gcp-preview/versions.tf) の S3 backend で `init -reconfigure` と `validate` が成功することを確認した
- 再検証により、current devcontainer では Google Application Default Credentials が存在するため、`OpenTofu v1.11.0` による `plan` は dummy `project_id` 指定で 12 resource の create plan まで到達することを確認した
- Resource execution status: blocked pending state
- Preview public URL: https://preview.gcp.ashnova.jp
- Reviewed target reference: pending live apply for `global_ip_address` output from `infra/environments/gcp-preview`
- Certificate-related reference: pending live apply for managed certificate output from `infra/environments/gcp-preview`
- Selected environment entrypoint reference: infra/environments/gcp-preview
- `tofu apply`、external DNS change、certificate validation 実作業は未実施であり、残存 blocker は operator-side execution と live GCP project / DNS 側の実施判断である

## Dependencies

- Issue 48
- Issue 49
- Issue 50
- Issue 51
- Issue 52
