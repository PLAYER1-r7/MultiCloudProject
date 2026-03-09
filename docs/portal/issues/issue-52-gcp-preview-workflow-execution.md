## Summary

Issue 50 で GCP preview deploy workflow baseline は fixed され、shared build artifact reuse、manual dispatch on reviewed `main` commit、preview 専用 secret scope、deploy evidence / operator handoff の contract も固まった。Issue 51 では reviewed target reference と certificate-related reference を external DNS operator へ handoff する境界も fixed された。しかし現時点では `.github/workflows/` に GCP preview deploy workflow 実装が存在せず、`portal-build` が出力する `portal-web-dist` と `portal-build-evidence` を GCP preview path に接続できない。このままだと、GCP resource execution issue や monitoring / rollback issue が参照すべき GitHub Actions run surface と evidence artifact が未実装のまま残る。

## Goal

GCP preview deploy workflow execution issue の議論たたき台を作り、workflow YAML 実装、manual dispatch input、artifact provenance check、preview deploy evidence、operator handoff、README handoff、非対象、open questions を reviewable な draft として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-52
- タイトル: GCP preview workflow execution を行う
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview workflow execution
- 優先度: 中
- 先行条件: Issue 10 closed, Issue 47 resolved, Issue 49 resolved, Issue 50 resolved, Issue 51 resolved

目的
- 解決する問題: GCP preview deploy workflow contract は fixed したが、manual dispatch、shared build artifact reuse、preview evidence、operator handoff を担う GitHub Actions workflow が未実装のままだと、GCP preview path を reviewable な運用面まで接続できない
- 期待する価値: `.github/workflows/portal-gcp-preview-deploy.yml` と関連 README を通じて、reviewed `main` commit を起点に shared artifact を再利用し、preview evidence と operator handoff を fail-closed に記録する実装単位を固定できる

スコープ
- 含むもの: GCP preview deploy workflow YAML の追加方針、manual dispatch input contract、build artifact provenance check、preview 専用 environment / secret / variable naming 前提、deploy evidence / step summary / artifact handoff、README 更新方針、open questions table の作成
- 含まないもの: GCP credentials の実発行、GitHub environment / secrets / variables の実登録、GCP resource 作成、preview deploy 実行、DNS operator 実作業、certificate validation 実行、production promotion 設計
- 編集可能パス: docs/portal/issues/issue-52-gcp-preview-workflow-execution.md
- 制限パス: .github/workflows/*.yml, infra/**, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: GCP preview workflow implementation の責務と編集対象が文書から一意に読める
- [ ] 条件 2: manual dispatch input、artifact provenance check、deploy evidence、operator handoff の contract が整理されている
- [ ] 条件 3: credentials 実発行、resource execution、DNS operator 実作業など本 issue 非対象が implementation issue から切り分けられている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-52-gcp-preview-workflow-execution.md
- アプローチ: Issue 50 の workflow baseline、Issue 51 の DNS/operator boundary、既存 `.github/workflows/portal-staging-deploy.yml` と `.github/workflows/portal-production-deploy.yml` の artifact/evidence pattern を入力として、GCP preview workflow 実装 issue を input contract、provenance check、deploy evidence、operator handoff の 4 観点で整理する
- 採用しなかった代替案と理由: いきなり workflow YAML を実装する案は credential boundary と output contract を issue record に残しにくいため採らない。逆に baseline の再掲だけで済ませる案も実装対象と非対象の境界が downstream issue から参照しづらいため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: implementation scope wording、manual dispatch wording、artifact/evidence wording、non-goal wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-10-cicd-policy.md、docs/portal/issues/issue-49-gcp-iac-topology-and-state-backend-judgment.md、docs/portal/issues/issue-50-gcp-deploy-workflow-baseline.md、docs/portal/issues/issue-51-gcp-preview-domain-certificate-dns-operator-memo.md、.github/workflows/README.md を照合し、workflow contract drift と execution scope overreach のどちらが起きているかを切り分ける

リスクとロールバック
- 主なリスク: workflow execution issue の名目で credentials 実発行、resource execution、DNS operator 実作業まで scope が膨らむこと
- 影響範囲: `.github/workflows/`、GitHub environment 前提、preview evidence path、operator handoff
- 緩和策: 今回は workflow 実装対象、input contract、evidence path、README handoff の固定に留め、credentials 実登録や live deploy は separate execution step に残す
- ロールバック手順: scope が広がりすぎた場合は workflow file、input contract、evidence artifact、README handoff だけを残し、resource / credential execution は別 issue に切り出す
```

## Tasks

- [x] GCP preview workflow 実装対象と編集面を整理する
- [x] manual dispatch input と artifact provenance check を整理する
- [x] deploy evidence / operator handoff の出力を整理する
- [x] README / environment handoff の更新対象を整理する

## Definition of Done

- [x] GCP preview workflow 実装対象と責務が 1 文書で追える
- [x] manual dispatch input と build artifact provenance check の前提が読める
- [x] deploy evidence / step summary / operator handoff artifact の方向性が説明されている
- [x] credentials 実発行 / resource execution / DNS operator 実作業を本 issue 非対象として維持できている

## Initial Notes

- Issue 10 により、build と deploy は分離し、deploy workflow は reviewed artifact を入力に取る guarded path として設計する前提である
- Issue 49 により、GCP preview environment entrypoint の第一候補は `infra/environments/gcp-preview/` であり、workflow / operator 向け output は usage-oriented naming を前提にする
- Issue 50 により、GCP preview deploy の正規 trigger は reviewed `main` commit を対象にした manual dispatch であり、shared build artifact reuse と preview evidence 出力が fixed 済みである
- Issue 51 により、workflow は authoritative DNS write を行わず、reviewed target reference と certificate-related reference を operator handoff として出力する側に留まる
- 既存 workflow surface では `portal-build` が `portal-web-dist` と `portal-build-evidence` を生成し、`portal-production-deploy` は manual dispatch 入力と artifact provenance check を持っている

## Issue 52 Discussion Draft

このセクションは、GCP preview workflow execution を議論するためのたたき台である。ここで決めたいのは workflow implementation scope であり、まだ決めないのは GCP credential 発行、resource execution、DNS operator execution、preview deploy 実行である。

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `GCP preview deploy workflow contract をどの YAML / README surface に実装するか` に限定する
- live deploy success や credentials 実登録は含めない
- DNS operator step と certificate validation 実作業は別 issue に残す

### 2. workflow file の第一案

提案:

- `.github/workflows/portal-gcp-preview-deploy.yml` を新設する
- 既存 staging / production deploy workflow と同じ責務分離を守り、build workflow を再利用する
- workflow name、artifact name、step summary wording は app-facing / operator-facing naming を優先する

この方向の理由:

- `.github/workflows/README.md` の current split と整合する
- `portal-build` が既に artifact provenance を持つため GCP 側で cloud-specific build を増やさずに済む
- preview path を staging / production から独立に review できる

### 3. manual dispatch input contract の第一案

提案:

- required dispatch input は `source_build_run_id` と `source_build_commit_sha` を第一候補にする
- required dispatch input には referenced GCP resource execution record を一意に指せる `resource_execution_reference` も含める
- optional input として `verification_owner`、`reviewed_target_reference` など handoff-oriented naming を検討する
- reviewed `main` commit と artifact provenance の不一致は fail-closed に止める

### 4. provenance check と artifact reuse の第一案

提案:

- `portal-build` の successful run を参照し、`portal-web-dist` と `portal-build-evidence` を download する
- build run id と commit SHA の整合を workflow 内で検証する
- `resource_execution_reference` が指す issue record / execution evidence から selected environment entrypoint reference、preview public URL、reviewed target reference、certificate-related reference を取得できることを確認する
- resource / DNS output が未準備でも、artifact provenance mismatch は先に止める
- resource execution evidence が欠落している場合、または pending certificate / target state が operator hold 条件として記録されている場合は deploy を開始せず fail-closed に止める

### 5. preview deploy evidence の第一案

提案:

- step summary と dedicated artifact で deploy evidence を残す
- evidence には selected commit、source build run URL、preview public URL、selected environment entrypoint reference、reviewed target reference、certificate-related reference を含める
- provider resource 名より operator-facing reference を主語にする

### 6. operator handoff の第一案

提案:

- workflow は reviewed target reference と certificate-related reference を operator handoff artifact に残す
- authoritative DNS write は行わない
- preview verification owner と run URL を同じ review path に残す

### 7. README / environment handoff の第一案

提案:

- `.github/workflows/README.md` に GCP preview workflow の inputs / expected evidence / non-goals を追記する
- environment variable / secret の naming は preview 専用 scope として記録する
- actual GitHub environment registration は別 step に残す

### 8. 今回は決めないこと

- GCP credentials の実発行
- GitHub environment / secrets / variables の実登録
- GCP resource creation や `tofu apply`
- preview deploy 実行
- DNS operator sequence と certificate validation 実行

### 9. 後続 issue とどう接続するか

- GCP resource execution issue は selected environment entrypoint と usage-oriented output naming を workflow 側が受け取れる形に揃える
- monitoring / rollback issue は preview deploy evidence artifact と run URL を起点に一次確認経路を定義する
- DNS/operator follow-up は reviewed target reference と certificate-related reference を workflow artifact から受け取る

### 10. この場で確認したい論点

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                                | 判断方向（Discussion 時点の仮）                                                                   | Resolution 確定文言                                                                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCP preview deploy workflow を新規 workflow file として切り出すか   | yes。`.github/workflows/portal-gcp-preview-deploy.yml` を第一候補にする                           | `GCP preview deploy workflow は .github/workflows/portal-gcp-preview-deploy.yml を第一候補として新設する`                                                                          |
| required manual dispatch input を何に置くか                         | `source_build_run_id`、`source_build_commit_sha`、`resource_execution_reference` を第一候補にする | `GCP preview deploy workflow の required manual dispatch input は source_build_run_id、source_build_commit_sha、resource_execution_reference とする`                               |
| workflow はどの artifact を再利用するか                             | `portal-web-dist` と `portal-build-evidence` を再利用する                                         | `GCP preview deploy workflow は portal-build が出力する portal-web-dist と portal-build-evidence を再利用する`                                                                     |
| workflow は何を operator handoff として残すか                       | preview public URL、reviewed target reference、certificate-related reference、run URL を残す      | `GCP preview deploy workflow は preview public URL、reviewed target reference、certificate-related reference、run URL を operator handoff evidence として残す`                     |
| credentials 実発行や environment 実登録をこの issue に含めるか      | no。implementation prerequisite として別管理に残す                                                | `GCP credentials 実発行と GitHub environment 実登録は本 issue に含めず、implementation prerequisite として別管理に残す`                                                            |
| resource execution evidence が欠落または pending の場合にどう扱うか | deploy を開始せず operator hold として止める                                                      | `resource execution evidence が欠落している場合、または pending certificate / target state が operator hold 条件として記録されている場合は deploy を開始せず fail-closed に止める` |

## Resolution

Issue 52 の判断結果は次の通りとする。

- GCP preview deploy workflow は `.github/workflows/portal-gcp-preview-deploy.yml` を第一候補として新設する
- GCP preview deploy workflow の required manual dispatch input は `source_build_run_id`、`source_build_commit_sha`、`resource_execution_reference` とする
- GCP preview deploy workflow は `portal-build` が出力する `portal-web-dist` と `portal-build-evidence` を再利用する
- GCP preview deploy workflow は preview public URL、reviewed target reference、certificate-related reference、run URL を operator handoff evidence として残す
- GCP credentials 実発行と GitHub environment 実登録は本 issue に含めず、implementation prerequisite として別管理に残す
- resource execution evidence が欠落している場合、または pending certificate / target state が operator hold 条件として記録されている場合は deploy を開始せず fail-closed に止める

この合意で明確になること:

- GCP preview deploy は既存の build / deploy 分離を崩さず、staging / production と同じく deploy workflow を独立 file として review できる
- reviewed `main` commit を manual dispatch で指定し、build run id と commit SHA の整合を fail-closed に確認する path を前提にできる
- workflow は `resource_execution_reference` によりどの infra output surface を使うかを一意に追跡でき、stale apply や別 execution record の誤参照を避けやすい
- GCP 側で cloud-specific build を増やさず、`portal-web-dist` と `portal-build-evidence` を canonical artifact provenance として再利用できる
- operator handoff evidence は preview URL や reviewed target を主語に残るため、DNS/operator memo や monitoring / rollback issue が同じ review path を参照できる
- resource execution evidence が未確定または operator hold 状態なら deploy を開始しないため、artifact provenance と infra provenance の両方を fail-closed に揃えられる
- credentials 実発行、environment 実登録、resource execution をこの issue から外すことで、workflow implementation scope と live execution prerequisite の議論が混線しない

後続 issue への引き継ぎ事項:

- workflow implementation step では `.github/workflows/portal-gcp-preview-deploy.yml` と `.github/workflows/README.md` を更新し、manual dispatch input、artifact download、resource execution reference check、evidence artifact、step summary を実装する
- GCP resource execution issue では `infra/environments/gcp-preview/` と usage-oriented output naming を workflow が受け取れる前提で resource wiring を追加する
- monitoring / rollback issue では preview deploy evidence artifact と run URL を起点に到達性確認と known-good artifact 参照経路を整理する
- DNS/operator follow-up では reviewed target reference と certificate-related reference を workflow artifact から受け取り、external DNS operator sequence と接続する

## Process Review Notes

- Section 10 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue の judgment は workflow implementation scope の固定であり、credentials 実発行、GitHub environment 実登録、resource execution、preview deploy 実行、DNS operator execution は依然として後続 issue の対象である
- GitHub Issue #52 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- RESOLUTION FIXED
- GitHub Issue: #52
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/52
- Sync Status: local implementation updated and GitHub issue body resynced

- local issue record は未作成だったため、このファイルを GCP preview workflow execution の initial draft として追加する
- workflow implementation の論点は resource execution、credential issuance、DNS operator work から分離して扱う
- open questions は Resolution へ統合し、workflow file、manual dispatch input、artifact reuse、operator handoff evidence、non-goals の方針は固定した
- `.github/workflows/portal-gcp-preview-deploy.yml` を追加し、manual dispatch input、build provenance check、resource execution reference check、GCS sync、optional CDN invalidation、deployment record artifact、step summary を実装した
- `.github/workflows/portal-build.yml` には GCP preview workflow 変更時も build artifact を再生成できる path filter を追加し、`.github/workflows/README.md` には required input、required labels、fail-closed 条件を追記した
- 新規 workflow と関連 README / build workflow には editor diagnostics 上のエラーはなく、実装は static validation 済みである
- GitHub repository へ `gcp-preview` environment を作成し、repo から確定できる `GCP_PREVIEW_SITE_BUCKET_NAME`、`GCP_PREVIEW_BASE_URL`、`GCP_PREVIEW_SMOKE_PATHS` を先行登録した
- 再検証により、`GCP_PREVIEW_PROJECT_ID=ashnova` と `GCP_PREVIEW_SERVICE_ACCOUNT_EMAIL=github-actions-deploy@ashnova.iam.gserviceaccount.com` は `gcp-preview` environment variable として登録済みであることを確認した
- 再検証により、`GCP_PREVIEW_WORKLOAD_IDENTITY_PROVIDER=projects/899621454670/locations/global/workloadIdentityPools/github-actions/providers/github-actions` を登録し、`github-actions` pool/provider と `github-actions-deploy@ashnova.iam.gserviceaccount.com` への `roles/iam.workloadIdentityUser` binding も作成した
- optional variable `GCP_PREVIEW_URL_MAP_NAME` は CDN invalidation を使う段階での後続登録対象に残る
- `gcp-preview` environment の required variable は揃ったが、`.github/workflows/portal-gcp-preview-deploy.yml` と `resource_execution_reference` 候補ファイルはまだ `origin/main` に publish されていないため、remote live dispatch は未実施である
- preview deploy 実行の現時点の blocker は GitHub default branch 側に workflow と参照ファイルが未公開であることだけである

## Dependencies

- Issue 10
- Issue 47
- Issue 49
- Issue 50
- Issue 51
