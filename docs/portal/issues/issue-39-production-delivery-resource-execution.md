## Summary

production rollout baseline と cutover execution baseline は揃ったが、AWS 上には production CloudFront distribution と site bucket がまだ作成されていない。この状態では `portal-production-deploy` の publish 先と `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` が未確定のままで、custom-domain cutover 前に必要な production delivery surface を実体として検証できない。

## Goal

production delivery resource execution を行い、production site bucket / CloudFront distribution を作成して、review 済み certificate ARN と aliases の適用可否を fail-closed に確認しつつ、apply evidence、output capture、GitHub environment handoff を固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-39
- タイトル: production delivery resource execution を行う
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production delivery resources
- 優先度: 中
- 先行条件: Issue 31 closed, Issue 33 closed, Issue 34 closed, Issue 36 closed, Issue 38 closed

目的
- 解決する問題: production wiring と cutover handoff が repo に存在しても、実際の production site bucket / CloudFront distribution が未作成だと `portal-production-deploy` の publish surface と invalidation target が未確定のままで、custom-domain cutover 前の execution path を実体で検証できない
- 期待する価値: reviewed certificate ARN、approved aliases、production outputs、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` を同じ execution record に束ね、custom-domain binding がその場で成立しない場合も fail-closed に止めながら、production deploy と post-deploy verification が参照する delivery surface を固定できる

スコープ
- 含むもの: production OpenTofu plan/apply 実行、reviewed certificate ARN と aliases の適用試行、delivery resource 作成、production outputs の記録、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` の environment variable 反映、issue 記録への execution evidence 整理
- 含まないもの: `portal-production-deploy` の実行、external DNS validation 実施、custom-domain cutover 実施、automatic rollback 実装、incident runbook 全面整備
- 編集可能パス: infra/environments/production/**, docs/portal/issues/issue-39-production-delivery-resource-execution.md, .github/workflows/README.md, infra/environments/production/README.md
- 制限パス: apps/portal-web/**, closed issue records except explicit evidence references, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md

受け入れ条件
- [ ] 条件 1: production OpenTofu apply により site bucket と CloudFront distribution outputs を確認でき、reviewed certificate ARN / approved aliases の適用可否も同じ execution record で fail-closed に確認できる
- [ ] 条件 2: `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` と production output evidence が workflow / environment README / issue 記録で整合している
- [ ] 条件 3: `portal-production-deploy` 実行、external DNS validation、custom-domain cutover、自動 rollback を本 issue に混ぜず、delivery resource execution に限定できている

実装計画
- 変更見込みファイル: infra/environments/production/terraform.tfvars, infra/environments/production/README.md, .github/workflows/README.md, docs/portal/issues/issue-39-production-delivery-resource-execution.md
- アプローチ: Issue 36 と Issue 38 で固定した production rollout / cutover baseline を前提に、production entrypoint へ reviewed certificate ARN と aliases を投入して OpenTofu apply を試行し、CloudFront alias ownership conflict が起きる場合は default certificate の distribution へ fail-closed で切り替えて、output と environment handoff を同じ execution record に残す
- 採用しなかった代替案と理由: `portal-production-deploy` を先に実行する案は publish target が未作成のため fail-closed 条件を崩す。external DNS cutover まで一度に実施する案は operator-managed boundary を越えて scope が広すぎるため採らない。CloudFront alias ownership conflict を無視して custom-domain bind を強行する案も、existing distribution ownership の解消前に進めると fail-closed にならないため採らない

検証計画
- 実行するテスト: tofu fmt; tofu init; tofu plan; tofu apply; tofu output; AWS CloudFront / S3 existence check; get_errors on edited files
- 確認するログ/メトリクス: created bucket name、CloudFront distribution id / domain name、certificate association、GitHub environment variable 更新結果
- 失敗時の切り分け経路: infra/environments/production/terraform.tfvars、OpenTofu plan/apply output、AWS CloudFront state、GitHub environment variable state を照合し、resource creation、certificate association、handoff recording のどこで止まったかを分ける

リスクとロールバック
- 主なリスク: production resource creation を deploy や DNS cutover と同一 issue に混ぜ、operator-managed boundary を崩すこと。あるいは reviewed certificate ARN / aliases の入力不整合や CloudFront alias ownership conflict で apply が失敗すること
- 影響範囲: production AWS resource state、future production deploy path、custom-domain readiness evidence
- 緩和策: scope を delivery resource creation と output capture に限定し、deploy と DNS cutover は follow-up に分離する。apply 前に aliases と certificate ARN を再確認し、CloudFront alias bind が失敗する場合は default certificate distribution で delivery surface だけを確定する
- ロールバック手順: apply が不正な custom-domain binding を作った場合は reviewed input を見直したうえで再 apply し、必要なら aliases / certificate ARN を外して fail-closed state に戻す。alias ownership conflict の場合は custom-domain bind を行わず distribution domain のみを active delivery surface とする
```

## Tasks

- [x] production reviewed inputs を再確認する
- [x] production OpenTofu apply を実行して resources を作成する
- [x] production outputs と `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` handoff を記録する
- [x] issue 記録へ execution evidence と非対象を残す

## Definition of Done

- [x] production site bucket と CloudFront distribution が AWS 上で確認できる
- [x] `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` が GitHub environment に投入され、workflow handoff と整合している
- [x] reviewed certificate ARN と approved aliases の適用試行結果を含む production delivery surface が記録されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- production backend は preinstalled `tofu v1.8.8` では `use_lockfile = true` を backend で解釈できず `tofu init -reconfigure` が失敗したため、official release の `OpenTofu v1.11.0` をローカル展開して execution binary として使用した
- reviewed input として `aliases=["www.aws.ashnova.jp"]`、`acm_certificate_arn=arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` を指定して plan/apply を試行したが、CloudFront `CreateDistributionWithTags` は `CNAMEAlreadyExists` で失敗した
- fail-closed fallback として aliases / certificate ARN を外した plan/apply を実行し、production site bucket `multicloudproject-portal-production-web`、CloudFront distribution `E34CI3F0M5904O`、distribution domain `d168agpgcuvdqq.cloudfront.net` を作成した
- GitHub production environment へ `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID=E34CI3F0M5904O` を投入し、production workflow handoff を update した

## Current Review Notes

- production delivery surface 自体は AWS 上に作成できており、`portal-production-deploy` が参照する bucket / distribution id handoff は成立している
- reviewed certificate ARN と approved alias `www.aws.ashnova.jp` の attach 試行は CloudFront `CNAMEAlreadyExists` により fail-closed で停止しており、custom-domain ownership conflict の解消前に alias bind を進めていない
- custom-domain bind は Issue 38 で分離した operator-managed cutover 境界の範囲に残しつつ、Issue 39 では production deploy target を先に固定する形で scope を維持している

## Spot Check Evidence

- OpenTofu execution: `OpenTofu v1.11.0` による `tofu init -reconfigure` と `tofu validate` は [infra/environments/production/versions.tf](infra/environments/production/versions.tf) の backend 設定で成功した
- reviewed alias attempt: reviewed input を与えた `tofu apply` は `CNAMEAlreadyExists` で停止し、existing CloudFront alias ownership conflict があることを確認した
- fallback apply: aliases / certificate ARN を外した `tofu apply` は成功し、`distribution_id = E34CI3F0M5904O`、`distribution_domain_name = d168agpgcuvdqq.cloudfront.net`、`site_bucket_name = multicloudproject-portal-production-web` を出力した
- AWS / GitHub handoff: `aws cloudfront get-distribution --id E34CI3F0M5904O` は `Status = Deployed`、`Aliases = null`、`CloudFrontDefaultCertificate = true` を返し、`gh variable list --env production` は `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID=E34CI3F0M5904O` を確認できた

## Evidence Mapping Table

For Issue 39 implementation progress, the local issue record is the primary evidence source. [infra/environments/production/main.tf](infra/environments/production/main.tf), [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the execution surface, while this issue record captures the reviewed-input attempt, fallback apply, and workflow handoff results.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| --- | --- | --- | --- |
| production reviewed inputs を再確認する | Implementation Notes, Current Review Notes | These sections record the reviewed alias and ACM certificate ARN that were used for the first apply attempt. | Accepted for final review |
| production OpenTofu apply を実行して resources を作成する | Implementation Notes, Spot Check Evidence, [infra/environments/production/main.tf](infra/environments/production/main.tf), [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf) | These sources show both the failed reviewed-input attempt and the successful fallback apply that created the production delivery resources. | Accepted for final review |
| production outputs と `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` handoff を記録する | Implementation Notes, Spot Check Evidence, [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the created distribution id, domain name, bucket name, and GitHub environment variable handoff. | Accepted for final review |
| issue 記録へ execution evidence と非対象を残す | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence | These sections preserve execution evidence, fallback reasoning, and the excluded DNS / deploy scope in one record. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| --- | --- | --- | --- |
| production site bucket と CloudFront distribution が AWS 上で確認できる | Implementation Notes, Spot Check Evidence, [infra/environments/production/outputs.tf](infra/environments/production/outputs.tf) | These sources show the created bucket and deployed CloudFront distribution with concrete output values. | Accepted for final review |
| `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` が GitHub environment に投入され、workflow handoff と整合している | Implementation Notes, Spot Check Evidence, [infra/environments/production/README.md](infra/environments/production/README.md), [.github/workflows/README.md](.github/workflows/README.md) | These sources show the workflow contract expects the variable and the execution record confirms it is now set. | Accepted for final review |
| reviewed certificate ARN と approved aliases の適用試行結果を含む production delivery surface が記録されている | Implementation Notes, Current Review Notes, Spot Check Evidence | These sections show the reviewed-input apply failed closed on alias ownership conflict and the fallback delivery surface that was actually created. | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている | Task Contract, Implementation Notes, Spot Check Evidence, Evidence Mapping Table | These sections preserve the file scope, validation path, and execution evidence basis for this work. | Accepted for final review |

## Final Review Result

- PASS: production delivery resources は AWS 上に作成済みであり、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` を含む workflow handoff も GitHub environment に反映されているため、Issue 39 の scope では blocking finding はない
- NOTE: reviewed alias `www.aws.ashnova.jp` と ACM certificate ARN の attach 試行は `CNAMEAlreadyExists` により fail-closed で停止しているが、これは custom-domain ownership conflict を未解消のまま進めないための期待どおりの停止であり、Issue 39 の delivery resource execution scope からは外れない

## Process Review Notes

- 2026-03-09 に production reviewed input として alias `www.aws.ashnova.jp` および ACM certificate ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` を使った apply を試行したが、CloudFront `CNAMEAlreadyExists` で停止した
- 同日、fail-closed fallback として alias / certificate ARN を外した apply を実行し、production site bucket `multicloudproject-portal-production-web` と CloudFront distribution `E34CI3F0M5904O` を作成した
- 同日、GitHub production environment へ `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID=E34CI3F0M5904O` を投入し、Issue 39 record と GitHub issue body へ execution evidence を同期する
- 2026-03-09 formal review では production bucket、CloudFront distribution、GitHub production environment variables を live state で再確認し、issue 記録どおり `multicloudproject-portal-production-web`、`E34CI3F0M5904O`、`d168agpgcuvdqq.cloudfront.net`、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID=E34CI3F0M5904O` が成立していることを確認した

## Current Status

- OPEN

- production site bucket と CloudFront distribution は作成済みであり、implementation sync と formal review は完了している
- `portal-production-deploy`、external DNS validation、custom-domain cutover は後続ステップとして残る
- reviewed alias / certificate ARN の attach は `CNAMEAlreadyExists` により fail-closed で停止しており、custom-domain ownership conflict の解消が別途必要である
- Issue 39 は close 判定のみ未実施である

## Dependencies

- Issue 31
- Issue 33
- Issue 34
- Issue 36
- Issue 38
