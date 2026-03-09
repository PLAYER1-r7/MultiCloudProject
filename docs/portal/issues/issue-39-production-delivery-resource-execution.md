## Summary

production rollout baseline と cutover execution baseline は揃ったが、AWS 上には production CloudFront distribution と site bucket がまだ作成されていない。この状態では `portal-production-deploy` の publish 先と `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` が未確定のままで、custom-domain cutover 前に必要な production delivery surface を実体として検証できない。

## Goal

production delivery resource execution を行い、production site bucket / CloudFront distribution を作成して、review 済み certificate ARN と aliases を含む apply evidence、output capture、GitHub environment handoff を固定する。

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
- 期待する価値: reviewed certificate ARN、approved aliases、production outputs、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` を同じ execution record に束ね、production deploy と post-deploy verification が参照する delivery surface を fail-closed に固定できる

スコープ
- 含むもの: production OpenTofu plan/apply 実行、reviewed certificate ARN と aliases を使った delivery resource 作成、production outputs の記録、`PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` の environment variable 反映、issue 記録への execution evidence 整理
- 含まないもの: `portal-production-deploy` の実行、external DNS validation 実施、custom-domain cutover 実施、automatic rollback 実装、incident runbook 全面整備
- 編集可能パス: infra/environments/production/**, docs/portal/issues/issue-39-production-delivery-resource-execution.md, .github/workflows/README.md, infra/environments/production/README.md
- 制限パス: apps/portal-web/**, closed issue records except explicit evidence references, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md

受け入れ条件
- [ ] 条件 1: production OpenTofu apply が reviewed certificate ARN と approved aliases を含む current execution path として成功し、site bucket と CloudFront distribution outputs を確認できる
- [ ] 条件 2: `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` と production output evidence が workflow / environment README / issue 記録で整合している
- [ ] 条件 3: `portal-production-deploy` 実行、external DNS validation、custom-domain cutover、自動 rollback を本 issue に混ぜず、delivery resource execution に限定できている

実装計画
- 変更見込みファイル: infra/environments/production/terraform.tfvars, infra/environments/production/README.md, .github/workflows/README.md, docs/portal/issues/issue-39-production-delivery-resource-execution.md
- アプローチ: Issue 36 と Issue 38 で固定した production rollout / cutover baseline を前提に、production entrypoint へ reviewed certificate ARN と aliases を投入して OpenTofu apply を実行し、output と environment handoff を同じ execution record に残す
- 採用しなかった代替案と理由: `portal-production-deploy` を先に実行する案は publish target が未作成のため fail-closed 条件を崩す。external DNS cutover まで一度に実施する案は operator-managed boundary を越えて scope が広すぎるため採らない

検証計画
- 実行するテスト: tofu fmt; tofu init; tofu plan; tofu apply; tofu output; AWS CloudFront / S3 existence check; get_errors on edited files
- 確認するログ/メトリクス: created bucket name、CloudFront distribution id / domain name、certificate association、GitHub environment variable 更新結果
- 失敗時の切り分け経路: infra/environments/production/terraform.tfvars、OpenTofu plan/apply output、AWS CloudFront state、GitHub environment variable state を照合し、resource creation、certificate association、handoff recording のどこで止まったかを分ける

リスクとロールバック
- 主なリスク: production resource creation を deploy や DNS cutover と同一 issue に混ぜ、operator-managed boundary を崩すこと。あるいは reviewed certificate ARN / aliases の入力不整合で apply が失敗すること
- 影響範囲: production AWS resource state、future production deploy path、custom-domain readiness evidence
- 緩和策: scope を delivery resource creation と output capture に限定し、deploy と DNS cutover は follow-up に分離する。apply 前に aliases と certificate ARN を再確認する
- ロールバック手順: apply が不正な custom-domain binding を作った場合は reviewed input を見直したうえで再 apply し、必要なら aliases / certificate ARN を外して fail-closed state に戻す
```

## Tasks

- [ ] production reviewed inputs を再確認する
- [ ] production OpenTofu apply を実行して resources を作成する
- [ ] production outputs と `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` handoff を記録する
- [ ] issue 記録へ execution evidence と非対象を残す

## Definition of Done

- [ ] production site bucket と CloudFront distribution が AWS 上で確認できる
- [ ] `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` が GitHub environment に投入され、workflow handoff と整合している
- [ ] reviewed certificate ARN と approved aliases を使った production delivery surface が記録されている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- Pending

## Current Review Notes

- Pending

## Spot Check Evidence

- Pending

## Evidence Mapping Table

Pending

## Final Review Result

- Pending

## Process Review Notes

- Pending

## Current Status

- OPEN

- production delivery resources は未作成であり、Issue 39 は production apply と output capture の execution record を残すための active intake である
- `portal-production-deploy`、external DNS validation、custom-domain cutover は後続ステップとして残る

## Dependencies

- Issue 31
- Issue 33
- Issue 34
- Issue 36
- Issue 38