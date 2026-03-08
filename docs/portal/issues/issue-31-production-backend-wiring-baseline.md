## Summary

monthly cost ceiling と state locking strategy は確定したが、production backend configuration 自体が repo に存在しないままだと、selected state locking strategy が production でどう保持されるかがコードから読めず、production gate の解除条件も文書依存のまま残る。

## Goal

production OpenTofu backend configuration を dedicated state key と native S3 lockfile 付きで追加し、production backend wiring は完了した状態へ進めつつ、production resources と production deploy workflow は fail-closed のまま維持する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-31
- タイトル: production backend wiring baseline を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production backend configuration
- 優先度: 中
- 先行条件: Issue 28 closed, Issue 29 closed, Issue 30 closed

目的
- 解決する問題: production backend wiring が repo に存在しないと、selected state locking strategy が production でどう適用されるかをコードで確認できず、production gate の blocker が implementation baseline を欠いたまま残る
- 期待する価値: production backend bucket/key/region/use_lockfile を repo に固定し、remaining production blockers を backend wiring 以外の entry conditions へ切り分けられる

スコープ
- 含むもの: production backend configuration の追加、production tfvars example の追加、production gate / policy / product 文書の wording 更新、issue 記録への根拠整理
- 含まないもの: production delivery resources の追加、production deploy workflow の追加、external DNS cutover 実装、certificate validation 実装、portability boundary の最終決定
- 編集可能パス: infra/environments/production/README.md, infra/environments/production/versions.tf, infra/environments/production/providers.tf, infra/environments/production/variables.tf, infra/environments/production/terraform.tfvars.example, infra/README.md, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, docs/portal/issues/issue-31-production-backend-wiring-baseline.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: production backend configuration が dedicated state key と native S3 lockfile を持つ
- [ ] 条件 2: production backend wiring が完了した一方で production resources と deploy workflow は未追加のままである
- [ ] 条件 3: product / policy / gate 文書から remaining blocker が backend wiring 以外へ更新されたことが読める

実装計画
- 変更見込みファイル: infra/environments/production/README.md, infra/environments/production/versions.tf, infra/environments/production/providers.tf, infra/environments/production/variables.tf, infra/environments/production/terraform.tfvars.example, infra/README.md, docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, docs/portal/issues/issue-31-production-backend-wiring-baseline.md
- アプローチ: staging backend structure を production 用 state key に移植し、provider と variable surface を先に固定するが、resource wiring と workflow automation は後続 issue に残す
- 採用しなかった代替案と理由: production resource module wiring まで同時に追加する案は、certificate と portability boundary が未確定のため speculative implementation になりやすく採らない

検証計画
- 実行するテスト: tofu fmt; tofu init -backend=false; tofu validate; markdown review; get_errors on edited files
- 確認するログ/メトリクス: backend bucket/key wording、use_lockfile wiring、remaining production blocker wording
- 失敗時の切り分け経路: infra/environments/staging/versions.tf、infra/environments/production/versions.tf、infra/environments/production/README.md、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md を照合し、backend config と gate wording のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: backend wiring baseline の名目で production resources や deploy workflow まで混入させ、remaining production gate を曖昧にすること
- 影響範囲: production environment seed、policy wording、future production implementation scope
- 緩和策: backend configuration と doc alignment に限定し、resource wiring と workflow automation は制限パスに残す
- ロールバック手順: production backend key や locking baseline が不適切と判明した場合は production backend block を更新し、doc wording を deferred state に戻して別 issue で再整理する
```

## Tasks

- [x] production backend configuration を dedicated state key で追加する
- [x] native S3 lockfile を production backend にも反映する
- [x] remaining production blocker wording を backend wiring 完了後の状態へ更新する
- [x] production backend wiring baseline の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] production backend configuration が bucket、key、region、use_lockfile を持つ
- [x] production resources と deploy workflow は未追加のままである
- [x] product / policy / gate 文書が backend wiring 完了と remaining blockers を区別している
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [infra/environments/production/versions.tf](infra/environments/production/versions.tf) に production state key と native S3 lockfile を持つ backend block を追加した
- [infra/environments/production/providers.tf](infra/environments/production/providers.tf)、[infra/environments/production/variables.tf](infra/environments/production/variables.tf)、[infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) に production backend entrypoint の最小 surface を追加した
- [infra/environments/production/README.md](infra/environments/production/README.md) と [infra/README.md](infra/README.md) に production backend key と current fail-closed boundary を追記した
- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md) は backend wiring deferred wording を、backend wiring 完了かつ remaining blockers 継続の wording に更新した

## Current Review Notes

- production backend wiring は backend configuration の追加に限定しており、production site resources、production apply path、production deploy workflow はまだ追加していない
- production backend key は staging key と分離した portal/production/terraform.tfstate を使い、same backend bucket 上で environment state separation を維持する
- native S3 locking baseline は staging と production backend の両方で use_lockfile を使う形に揃えた
- custom domain、certificate sourcing、multi-cloud portability boundary、operator-managed cutover steps は本 issue に含めていないため、production rollout の fail-closed 方針は維持される

## Spot Check Evidence

Issue 31 の final review 前に、production backend wiring baseline が想定どおり整理されているかを spot check した結果を残す。

- backend configuration: [infra/environments/production/versions.tf](infra/environments/production/versions.tf) は bucket multicloudproject-tfstate-apne1、key portal/production/terraform.tfstate、region ap-northeast-1、use_lockfile true を持つ
- environment entrypoint surface: [infra/environments/production/providers.tf](infra/environments/production/providers.tf)、[infra/environments/production/variables.tf](infra/environments/production/variables.tf)、[infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) は production backend entrypoint の最小設定面を固定する
- gate wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は backend wiring 完了後も remaining blockers により stop-at-staging を維持する
- diagnostics and validation: tofu init -backend=false と tofu validate は production environment directory で成功し、対象ファイルに editor diagnostics は発生していない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 31 final review, the local issue record is the primary evidence source. [infra/environments/production/versions.tf](infra/environments/production/versions.tf) provides the backend implementation evidence, while [infra/environments/production/README.md](infra/environments/production/README.md), [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) provide the remaining blocker wording.

### Task Mapping

| Checklist item                                                                | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                  | Why this is the evidence                                                                                                           | Review state              |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| production backend configuration を dedicated state key で追加する            | Implementation Notes, Current Review Notes, Spot Check Evidence, [infra/environments/production/versions.tf](infra/environments/production/versions.tf), and [infra/README.md](infra/README.md)                                                                                                                                                                                           | These sources show the production backend block now exists and uses its own state key.                                             | Accepted for final review |
| native S3 lockfile を production backend にも反映する                         | Implementation Notes, Spot Check Evidence, [infra/environments/production/versions.tf](infra/environments/production/versions.tf), and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                                                                                                                           | These sources show use_lockfile is wired into the production backend and reflected in policy wording.                              | Accepted for final review |
| remaining production blocker wording を backend wiring 完了後の状態へ更新する | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show backend wiring is no longer the blocker while stop-at-staging remains for the unresolved production conditions. | Accepted for final review |
| production backend wiring baseline の根拠と非対象を issue 記録へ残す          | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-31-production-backend-wiring-baseline.md](docs/portal/issues/issue-31-production-backend-wiring-baseline.md)                                                                                                                                                                | These sections keep the backend configuration baseline and the excluded production rollout work in one issue record.               | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                         | Primary evidence section                                                                                                                                                                                                                                                                                                                                                        | Why this is the evidence                                                                                                  | Review state              |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| production backend configuration が bucket、key、region、use_lockfile を持つ           | Implementation Notes, Spot Check Evidence, and [infra/environments/production/versions.tf](infra/environments/production/versions.tf)                                                                                                                                                                                                                                           | These sources show the exact backend configuration fields now exist in code.                                              | Accepted for final review |
| production resources と deploy workflow は未追加のままである                           | Task Contract, Current Review Notes, [infra/environments/production/README.md](infra/environments/production/README.md), and [.github/workflows/README.md](.github/workflows/README.md)                                                                                                                                                                                         | These sources keep production resources and workflow automation explicitly out of scope.                                  | Accepted for final review |
| product / policy / gate 文書が backend wiring 完了と remaining blockers を区別している | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) | These sources show backend wiring is complete but production rollout still waits on the unresolved production conditions. | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                      | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-31-production-backend-wiring-baseline.md](docs/portal/issues/issue-31-production-backend-wiring-baseline.md)                                                                                                                                                  | These sections preserve the scope, validation path, and evidence basis for this backend wiring work.                      | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-31-production-backend-wiring-baseline.md](docs/portal/issues/issue-31-production-backend-wiring-baseline.md), with [infra/environments/production/versions.tf](infra/environments/production/versions.tf) used as the primary backend implementation evidence and [infra/environments/production/README.md](infra/environments/production/README.md), [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) used as supporting evidence for the remaining gate wording.

| Checklist area        | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend configuration | Satisfied      | Implementation Notes, Current Review Notes, Spot Check Evidence, and [infra/environments/production/versions.tf](infra/environments/production/versions.tf) confirm the production backend block now exists with a dedicated state key and native S3 locking.                                                                                                                                                                                                                                                                       |
| Scope control         | Satisfied      | Task Contract, Current Review Notes, [infra/environments/production/README.md](infra/environments/production/README.md), and [.github/workflows/README.md](.github/workflows/README.md) confirm production resources and deploy workflow automation remain excluded.                                                                                                                                                                                                                                                                |
| Gate wording          | Satisfied      | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm backend wiring is complete while other blockers remain. |
| Traceability          | Satisfied      | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-31-production-backend-wiring-baseline.md](docs/portal/issues/issue-31-production-backend-wiring-baseline.md) confirm the issue record tracks the edited files and validation basis.                                                                                                                                                                                                                               |

## Process Review Notes

- Issue 31 は Issue 29 で選定した native S3 locking baseline を production backend configuration へ接続する follow-on work として整理した。
- repository owner から close approval を受領し、follow-up review でも blocking issue がないことを確認したため、本 issue を closed へ移行する。

## Current Status

- CLOSED

- [infra/environments/production/versions.tf](infra/environments/production/versions.tf) は production backend key と native S3 locking baseline を持つ
- [infra/environments/production/providers.tf](infra/environments/production/providers.tf)、[infra/environments/production/variables.tf](infra/environments/production/variables.tf)、[infra/environments/production/terraform.tfvars.example](infra/environments/production/terraform.tfvars.example) は backend entrypoint の最小 surface を持つ
- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は backend wiring 完了と remaining blockers を区別する
- 2026-03-08: close approval を受領し、GitHub Issue 31 を CLOSED に移行した

## Dependencies

- Issue 28
- Issue 29
- Issue 30
