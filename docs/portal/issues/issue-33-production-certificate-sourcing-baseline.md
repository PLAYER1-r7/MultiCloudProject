## Summary

production custom domain path では ACM が必要だが、certificate sourcing と external DNS validation flow が未決のままだと、production gate の remaining blocker が domain/certificate 側で止まり続け、production configuration に渡す `acm_certificate_arn` の責務境界も曖昧なまま残る。

## Goal

production custom-domain path の certificate sourcing baseline を明文化し、AWS-managed ACM public certificate、CloudFront 用 us-east-1 制約、external DNS validation records、reviewed ARN の受け渡し責務を current decision として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-33
- タイトル: production certificate sourcing baseline を明文化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production custom-domain planning
- 優先度: 中
- 先行条件: Issue 4 closed, Issue 31 closed, Issue 32 closed

目的
- 解決する問題: production custom-domain path に必要な certificate sourcing が未決のままだと、external DNS validation flow と production configuration の責務境界が曖昧で、remaining production blocker が実装可能な baseline に落ちない
- 期待する価値: AWS-managed ACM public certificate を CloudFront 用 us-east-1 で扱い、external DNS validation records は operator-managed とし、production configuration には reviewed certificate ARN のみ渡すという baseline を文書と configuration surface に固定できる

スコープ
- 含むもの: product / architecture / IaC / CI/CD / production README wording の同期、shared infra / module README wording と variable description の同期、staging / production variable description と tfvars example の更新、issue 記録への根拠整理
- 含まないもの: production resources の追加、production deploy workflow の追加、ACM certificate 実発行、external DNS cutover 実施、production aliases の実設定
- 編集可能パス: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/README.md, infra/modules/portal-static-site/README.md, infra/modules/portal-static-site/variables.tf, infra/environments/staging/variables.tf, infra/environments/production/README.md, infra/environments/production/variables.tf, infra/environments/production/terraform.tfvars.example, docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: certificate sourcing baseline が AWS-managed ACM public certificate と CloudFront 用 us-east-1 制約を含めて current decision として読める
- [x] 条件 2: external DNS validation records と cutover timing が operator-managed step であることを product / policy / workflow / environment 文書が整合して説明している
- [x] 条件 3: production configuration に渡す `acm_certificate_arn` の責務境界が文書と variable description から読める

実装計画
- 変更見込みファイル: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/README.md, infra/modules/portal-static-site/README.md, infra/modules/portal-static-site/variables.tf, infra/environments/staging/variables.tf, infra/environments/production/README.md, infra/environments/production/variables.tf, infra/environments/production/terraform.tfvars.example, docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md
- アプローチ: ACM が CloudFront custom-domain path に必要という既存 architecture decision を引き継ぎつつ、certificate sourcing baseline を us-east-1 ACM public certificate + external DNS validation + reviewed ARN handoff として production gate 文書へ同期する
- 採用しなかった代替案と理由: Route 53 前提へ寄せる案や workflow で certificate issuance まで自動化する案は、current external DNS operating model と fail-closed 方針を崩すため採らない

検証計画
- 実行するテスト: markdown review; grep for certificate sourcing wording drift; get_errors on edited files
- 確認するログ/メトリクス: us-east-1 wording、external DNS validation wording、reviewed ARN handoff wording の整合
- 失敗時の切り分け経路: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/README.md、infra/modules/portal-static-site/README.md、infra/modules/portal-static-site/variables.tf、infra/environments/staging/variables.tf、infra/environments/production/README.md、infra/environments/production/variables.tf、infra/environments/production/terraform.tfvars.example を照合し、certificate sourcing baseline と operator boundary のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: certificate sourcing baseline の明文化が certificate issuance 実施や production cutover 承認まで決まったように読まれること
- 影響範囲: production gate wording、future production rollout planning、custom-domain handoff expectations
- 緩和策: wording を certificate sourcing baseline と reviewed ARN handoff に限定し、issuance execution と cutover approval は operator-managed step として残す
- ロールバック手順: certificate sourcing baseline が external DNS operating model と衝突すると判明した場合は current decision wording を deferred state に戻し、別 issue で再整理する
```

## Tasks

- [x] certificate sourcing baseline を production gate 文書へ同期する
- [x] external DNS validation records と cutover timing の operator-managed boundary を揃える
- [x] production configuration に渡す reviewed certificate ARN の責務境界を明記する
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] certificate sourcing baseline が us-east-1 ACM public certificate を含む current decision として読める
- [x] external DNS validation と cutover timing が workflow 完結ではなく operator-managed step として複数文書で整合している
- [x] `acm_certificate_arn` の責務境界が production README と variable description から読める
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は ACM responsibility boundary を us-east-1 ACM public certificate と external DNS validation / cutover の分離として更新した
- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は certificate sourcing baseline を current decision として同期した
- [infra/README.md](infra/README.md)、[infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md)、[infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf) は `acm_certificate_arn` の説明を reviewed us-east-1 ACM certificate 前提へ更新し、shared IaC surface でも同じ境界を読めるようにした
- [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf)、[infra/environments/production/variables.tf](infra/environments/production/variables.tf)、[infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) は environment entrypoint でも reviewed us-east-1 ACM certificate ARN の handoff を前提にすることを明記した

## Current Review Notes

- certificate issuance の実行、DNS validation record の投入、custom domain cutover は本 issue に含めず、operator-managed production step として残している
- reviewed certificate ARN を production configuration に渡す責務境界だけを先に固定することで、future production resource wiring が speculative な certificate handling を抱え込まないようにした
- Route 53 を authoritative DNS に戻す変更や workflow 完結の certificate automation は current operating model に含めていない
- review で見つかった README と variable description の wording drift は、本 issue 内で shared / environment IaC surface まで揃えて解消した

## Spot Check Evidence

- architecture decision: [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は ACM が CloudFront custom-domain path に必要であり、certificate sourcing baseline を us-east-1 ACM public certificate と external DNS validation boundary で説明している
- product and policy wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) と [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) は certificate sourcing baseline を current decision status として読める
- workflow and environment wording: [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は DNS validation と cutover timing を operator-managed step として維持している
- shared IaC wording: [infra/README.md](infra/README.md)、[infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md)、[infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf) は CloudFront custom-domain 向け `acm_certificate_arn` が reviewed us-east-1 ACM certificate である前提を共有している
- configuration surface: [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf)、[infra/environments/production/variables.tf](infra/environments/production/variables.tf)、[infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) は reviewed us-east-1 ACM certificate ARN の handoff を明記している

## Evidence Mapping Table

For Issue 33 final review, the local issue record is the primary evidence source. [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) provides the architecture baseline, while [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), [infra/README.md](infra/README.md), [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/production/README.md](infra/environments/production/README.md), [infra/environments/production/variables.tf](infra/environments/production/variables.tf), and [infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) provide the synchronized certificate sourcing baseline.

### Task Mapping

| Checklist item                                                                          | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Why this is the evidence                                                                                                                                                              | Review state              |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| certificate sourcing baseline を production gate 文書へ同期する                         | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                                                                                                                                                                                               | These sources show the certificate sourcing baseline is now restated as a current production decision.                                                                                | Accepted for final review |
| external DNS validation records と cutover timing の operator-managed boundary を揃える | Implementation Notes, Spot Check Evidence, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                                                                                                                                                                                                                   | These sources show DNS validation and cutover remain explicit operator-managed steps outside workflow automation.                                                                     | Accepted for final review |
| production configuration に渡す reviewed certificate ARN の責務境界を明記する           | Implementation Notes, Spot Check Evidence, [infra/README.md](infra/README.md), [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/production/variables.tf](infra/environments/production/variables.tf), and [infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) | These sources show both the shared IaC surface and the environment configuration surface expect a reviewed us-east-1 ACM certificate ARN rather than hidden certificate provisioning. | Accepted for final review |
| issue 記録へ根拠と非対象を残す                                                          | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md](docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md)                                                                                                                                                                                                                                                                                                                                      | These sections preserve the scope, evidence, and excluded rollout work in one record.                                                                                                 | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                                        | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Why this is the evidence                                                                                                                       | Review state              |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| certificate sourcing baseline が us-east-1 ACM public certificate を含む current decision として読める                | Implementation Notes, Spot Check Evidence, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)                                                                                                                                                                                                                                                                                                                                                                                                                                   | These sources show the baseline now includes the CloudFront-compatible ACM region requirement and certificate ownership boundary.              | Accepted for final review |
| external DNS validation と cutover timing が workflow 完結ではなく operator-managed step として複数文書で整合している | Current Review Notes, Spot Check Evidence, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                                                                                                                                                                                                                                                                                                       | These sources show the operator-managed boundary remains intact after the certificate sourcing decision.                                       | Accepted for final review |
| `acm_certificate_arn` の責務境界が README と variable description から読める                                          | Implementation Notes, Spot Check Evidence, [infra/README.md](infra/README.md), [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/production/README.md](infra/environments/production/README.md), [infra/environments/production/variables.tf](infra/environments/production/variables.tf), and [infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) | These sources show both shared and environment-specific documentation now expect an explicitly reviewed us-east-1 ACM certificate ARN handoff. | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                                     | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md](docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md)                                                                                                                                                                                                                                                                                                                                                                                                                      | These sections preserve the file scope, validation path, and evidence basis for this certificate sourcing work.                                | Accepted for final review |

## Current Status

- OPEN

- certificate sourcing baseline は us-east-1 ACM public certificate と external DNS validation boundary を current decision として同期済みである
- reviewed certificate ARN を production configuration に渡す責務境界は明記済みである
- domain ownership、rollback target、production rollout implementation は後続 issue の対象に残る

## Dependencies

- Issue 4
- Issue 31
- Issue 32
