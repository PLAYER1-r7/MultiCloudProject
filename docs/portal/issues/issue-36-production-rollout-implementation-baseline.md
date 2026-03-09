## Summary

production gate の current decision は backend wiring、certificate sourcing、domain ownership、rollback target まで揃ったが、production resources と approval-gated deploy path 自体は repo に存在しないままである。このままだと stop-at-staging の解除条件は文書で読めても、どの implementation surface をもって production rollout を開始できるかが fail-closed に固定されない。

## Goal

production rollout implementation baseline を定義し、production resource wiring、approval-gated deploy workflow、promotion evidence path、post-deploy verification handoff を最小の実装面として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-36
- タイトル: production rollout implementation baseline を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production rollout implementation
- 優先度: 中
- 先行条件: Issue 20 closed, Issue 28 closed, Issue 31 closed, Issue 33 closed, Issue 34 closed, Issue 35 closed

目的
- 解決する問題: production resources と approval-gated deploy path が repo に存在しないままだと、production gate の current decision が揃っていても、どの implementation surface を approval 後に実行するのか、どこまでが workflow responsibility でどこからが operator-managed handoff なのかを fail-closed に読めない
- 期待する価値: production rollout の最小 implementation baseline を repo 上に固定し、staging-validated promotion candidate、reviewed certificate ARN、approved custom-domain path、last known-good rollback target を production execution path に接続できる

スコープ
- 含むもの: production resource wiring の最小実装、approval-gated production deploy workflow baseline、promotion evidence / verification handoff wording の同期、issue 記録への根拠整理
- 含まないもの: external DNS cutover 実施、ACM certificate issuance 実行、自動 rollback 実装、incident runbook 全面整備、multi-region / multi-account 拡張
- 編集可能パス: infra/environments/production/main.tf, infra/environments/production/outputs.tf, infra/environments/production/README.md, .github/workflows/README.md, .github/workflows/*.yml, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, docs/portal/issues/issue-36-production-rollout-implementation-baseline.md
- 制限パス: apps/portal-web/**, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production rollout implementation baseline が production resource wiring と approval-gated deploy workflow を含む current execution path として読める
- [x] 条件 2: production promotion evidence、post-deploy verification、rollback target recording の handoff が workflow / environment / policy 文書で整合している
- [x] 条件 3: external DNS cutover 実行 detail、certificate issuance 実行、自動 rollback は本 issue に混ぜず、operator-managed follow-up として分離されている

実装計画
- 変更見込みファイル: infra/environments/production/main.tf, infra/environments/production/outputs.tf, infra/environments/production/README.md, .github/workflows/README.md, .github/workflows/*.yml, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, docs/portal/issues/issue-36-production-rollout-implementation-baseline.md
- アプローチ: Issue 31, 33, 34, 35 で固定した production gate decisions を前提に、production resource wiring と approval-gated deploy workflow を最小構成で接続し、workflow responsibility と operator-managed handoff の境界を同時に文書へ同期する
- 採用しなかった代替案と理由: external DNS cutover 実施や emergency rollback automation を同時に実装する案は、operator-managed execution detail と baseline rollout path を混在させて scope を広げるため採らない

検証計画
- 実行するテスト: tofu fmt; tofu init -backend=false; tofu validate; workflow review; markdown review; get_errors on edited files
- 確認するログ/メトリクス: production resource wiring の存在、approval gate wording、promotion evidence path、post-deploy verification handoff、rollback target recording wording の整合
- 失敗時の切り分け経路: infra/environments/production/main.tf、infra/environments/production/outputs.tf、infra/environments/production/README.md、.github/workflows/README.md、.github/workflows/*.yml、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md を照合し、implementation surface と gate wording のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: rollout implementation baseline の名目で external DNS cutover や certificate issuance 実行まで workflow responsibility に混ぜ、operator-managed boundary を崩すこと
- 影響範囲: production environment wiring、workflow automation、promotion approval expectations、future incident handling
- 緩和策: production execution path は resource wiring と approval-gated deploy baseline に限定し、external DNS / certificate / emergency rollback detail は follow-up issue に残す
- ロールバック手順: production rollout implementation が current gate decisions と衝突すると判明した場合は workflow と resource wiring を fail-closed state に戻し、文書 wording を deferred state へ戻して別 issue で再整理する
```

## Tasks

- [x] production rollout implementation baseline を repo に追加する
- [x] approval-gated production deploy workflow と promotion evidence path を整理する
- [x] post-deploy verification と rollback target recording の handoff を揃える
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] production rollout implementation baseline が production resource wiring と approval-gated deploy workflow を current execution path として示している
- [x] promotion evidence、post-deploy verification、rollback target recording の handoff が複数文書で整合している
- [x] external DNS cutover、certificate issuance、自動 rollback が本 issue のスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [infra/environments/production/main.tf](infra/environments/production/main.tf) と [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf) は production 用の portal static site wiring と output surface を追加し、staging と同じ delivery model を production entrypoint でも再利用できるようにした
- [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml) は approval-gated manual dispatch baseline を追加し、source build run id、staging verification run id、rollback target reference、verification owner を持つ production promotion evidence path を固定したうえで、successful `portal-build` / `portal-staging-deploy` runs on `main` だけを promotion source として受け付ける validation を加えた
- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は rollout baseline を current execution path として同期しつつ、external DNS cutover と certificate execution を operator-managed follow-up に残した

## Current Review Notes

- production rollout baseline は dedicated production module wiring と manual approval-gated workflow に限定し、external DNS cutover 実施、certificate issuance 実行、自動 rollback は本 issue に含めていない
- production promotion evidence は source build evidence、staging verification evidence、rollback target reference、post-deploy verification owner を同じ production deployment record に集約する形で整理し、失敗した staging run や commit 不一致の build/staging run を promotion source として使えないようにした
- provider-specific 実装は Terraform entrypoint と workflow internals に閉じ込め、release evidence、smoke paths、verification handoff wording は app-level review surface として維持している
- GitHub production environment には required variable の `PRODUCTION_AWS_REGION` と `PRODUCTION_SITE_BUCKET_NAME`、required secret の `AWS_ROLE_TO_ASSUME_PRODUCTION` を投入済みであり、workflow の必須 environment contract は充足している

## Spot Check Evidence

- production wiring: [infra/environments/production/main.tf](infra/environments/production/main.tf) は module `portal_static_site` を production entrypoint に接続し、[infra/environments/production/outputs.tf](infra/environments/production/outputs.tf) は bucket と CloudFront outputs を公開している
- workflow baseline: [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml) は `workflow_dispatch` のみで起動し、production environment approval と build/staging/rollback evidence の入力を要求し、successful `portal-build` / `portal-staging-deploy` runs on `main` だけを promotion source として許可している
- policy and gate wording: [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は approval-gated production deploy path と operator-managed cutover boundary を整合して説明している
- validation: `tofu fmt`、`tofu init -backend=false`、`tofu validate` は [infra/environments/production](infra/environments/production) で成功し、edited files に editor diagnostics は発生していない

## Evidence Mapping Table

For Issue 36 final review, the local issue record is the primary evidence source. [infra/environments/production/main.tf](infra/environments/production/main.tf), [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf), and [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml) provide the implementation baseline, while [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the synchronized rollout wording.

### Task Mapping

| Checklist item                                                                  | Primary evidence section                                                                                                                                                                                                                                                                                                                    | Why this is the evidence                                                                                                                                | Review state                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| production rollout implementation baseline を repo に追加する                   | Implementation Notes, Current Review Notes, Spot Check Evidence, [infra/environments/production/main.tf](infra/environments/production/main.tf), [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf), and [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml) | These sources show both the production resource wiring and the approval-gated workflow baseline now exist in the repo.                                  | Accepted for final review   |
| approval-gated production deploy workflow と promotion evidence path を整理する | Implementation Notes, Spot Check Evidence, [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml), [.github/workflows/README.md](.github/workflows/README.md), and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                                                     | These sources show the production deploy path requires explicit inputs for source build, staging verification, rollback target, and verification owner. | Accepted for final review   |
| post-deploy verification と rollback target recording の handoff を揃える       | Implementation Notes, Current Review Notes, Spot Check Evidence, [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                   | These sources show post-deploy verification and rollback target recording stay in the same operator-reviewed production record.                         | Accepted for final review   |
| issue 記録へ根拠と非対象を残す                                                  | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-36-production-rollout-implementation-baseline.md](docs/portal/issues/issue-36-production-rollout-implementation-baseline.md)                                                                                                  | These sections preserve the implementation scope, evidence, and excluded operator-run execution detail in one record.                                   | Accepted for final review   |

### Definition Of Done Mapping

| Checklist item                                                                                                                                        | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                                  | Why this is the evidence                                                                                                          | Review state                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| production rollout implementation baseline が production resource wiring と approval-gated deploy workflow を current execution path として示している | Implementation Notes, Spot Check Evidence, [infra/environments/production/main.tf](infra/environments/production/main.tf), [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf), [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the repo now contains both the Terraform wiring and the workflow execution path for production rollout.        | Accepted for final review   |
| promotion evidence、post-deploy verification、rollback target recording の handoff が複数文書で整合している                                           | Current Review Notes, Spot Check Evidence, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), [infra/environments/production/README.md](infra/environments/production/README.md), and [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml)                               | These sources show the same handoff data is required in workflow inputs, policy wording, and operator-facing production guidance. | Accepted for final review   |
| external DNS cutover、certificate issuance、自動 rollback が本 issue のスコープ外として維持されている                                                 | Task Contract, Current Review Notes, Spot Check Evidence, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                                                                                    | These sources keep operator-managed execution detail separate from the rollout implementation baseline.                           | Accepted for final review   |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                                                                     | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-36-production-rollout-implementation-baseline.md](docs/portal/issues/issue-36-production-rollout-implementation-baseline.md)                                                                                                                                                            | These sections preserve the file scope, validation path, and evidence basis for this rollout work.                                | Accepted for final review   |

## Final Review Result

- PASS: production rollout implementation baseline は production resource wiring、approval-gated workflow、promotion evidence path、post-deploy verification handoff を repo 上で一貫して示しており、formal review 時点で blocking finding はない
- NOTE: formal review 時点で残っていた GitHub environment secret `AWS_ROLE_TO_ASSUME_PRODUCTION` は review 後フォローアップで投入済みであり、production workflow の必須実行前提は満たされている

## Process Review Notes

- 2026-03-09 formal review では [infra/environments/production/main.tf](infra/environments/production/main.tf)、[infra/environments/production/outputs.tf](infra/environments/production/outputs.tf)、[.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml)、[infra/environments/production/README.md](infra/environments/production/README.md) を再確認し、production rollout baseline が Issue 36 の scope どおりに固定されていることを確認した
- GitHub 側では `production` environment を作成し、`PRODUCTION_AWS_REGION=ap-northeast-1`、`PRODUCTION_SITE_BUCKET_NAME=multicloudproject-portal-production-web`、`AWS_ROLE_TO_ASSUME_PRODUCTION=arn:aws:iam::278280499340:role/GitHubActionsMultiCloudProjectProductionDeploy` を投入済みである。role trust policy は `repo:PLAYER1-r7/MultiCloudProject:environment:production` に限定し、inline policy は production bucket と CloudFront invalidation に必要な最小権限へ絞っている
- Published evidence commit は `2887c0e` であり、formal review 記録の更新と issue body sync はこの review state を明示するための追補である

## Current Status

- OPEN

- production rollout implementation baseline は production resource wiring、approval-gated deploy workflow、promotion evidence path、post-deploy verification handoff を含む current execution path として同期済みである
- implementation sync、formal review、production workflow の必須 environment contract 投入は完了しており、close 判定のみ未実施である
- external DNS cutover execution、certificate issuance execution、自動 rollback、incident runbook 全面整備 は後続 issue の対象に残る

## Dependencies

- Issue 20
- Issue 28
- Issue 31
- Issue 33
- Issue 34
- Issue 35
