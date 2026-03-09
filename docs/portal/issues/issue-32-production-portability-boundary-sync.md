## Summary

Issue 8 と multicloud constraints draft では portability boundary が既に決まっているが、production gate 側の文書では未決事項のように読める箇所が残っている。このままだと production blocker の実体がずれ、remaining gate が certificate / external DNS なのか portability boundary なのかを文書から一貫して読めない。

## Goal

accepted portability boundary を production gate / policy / workflow / environment 文書へ同期し、AWS-specific delivery choices と cloud-neutral product constraints の境界を current production baseline として明示する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-32
- タイトル: accepted portability boundary を production gate に同期する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production gate documentation
- 優先度: 中
- 先行条件: Issue 8 closed, Issue 31 closed

目的
- 解決する問題: multicloud portability boundary は既に別 issue で決まっているのに、production gate 文書に未決事項のような wording が残ると remaining blocker の実体がぶれ、production deferred state の説明が不正確になる
- 期待する価値: AWS-specific delivery choices を infrastructure / workflow internals に閉じ込め、cloud-neutral contract を product / app-facing layer に固定する境界を production gate 文書から一貫して読める

スコープ
- 含むもの: production gate / policy / workflow / environment README wording の同期、issue 記録への根拠整理
- 含まないもの: production resources の追加、production deploy workflow の追加、certificate sourcing の最終決定、external DNS cutover 手順の実装、frontend code の機能変更
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-32-production-portability-boundary-sync.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production gate 文書で portability boundary が未決事項ではなく current decision として読める
- [x] 条件 2: AWS-specific delivery choices と cloud-neutral contract の境界が product / policy / workflow / environment 文書で整合している
- [x] 条件 3: remaining production blockers が portability boundary 以外の未決事項に整理されている

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-32-production-portability-boundary-sync.md
- アプローチ: Issue 8 と docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md の accepted boundary wording を production gate 文書へ写像し、未決事項ではなく current baseline として再記述する
- 採用しなかった代替案と理由: certificate sourcing や production resource wiring を同時に進める案は、別の未決事項を混ぜて scope を曖昧にするため採らない

検証計画
- 実行するテスト: markdown review; grep for portability wording drift; get_errors on edited files
- 確認するログ/メトリクス: unresolved portability wording の消失、current decision wording の整合、remaining blocker wording の整合
- 失敗時の切り分け経路: docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md、docs/portal/issues/issue-08-multicloud-design-constraints.md、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md を照合し、accepted boundary と production gate wording のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: accepted boundary の再記述で scope が広がり、certificate や production rollout 実装まで決まったように読めること
- 影響範囲: production gate wording、future production planning、multi-cloud constraint interpretation
- 緩和策: wording を boundary synchronization に限定し、implementation scope は制限パスに残す
- ロールバック手順: boundary wording が Issue 8 の accepted decision とずれる場合は current decision 表現を戻し、source issue を primary evidence として再同期する
```

## Tasks

- [x] accepted portability boundary を production gate 文書へ同期する
- [x] product / policy / workflow / environment wording の境界を揃える
- [x] remaining production blocker wording を portability boundary 以外へ整理する
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] portability boundary が未決事項ではなく current decision として読める
- [x] AWS-specific delivery choices と cloud-neutral contract の境界が複数文書で整合している
- [x] production rollout blocker が portability boundary ではなく remaining operator / certificate conditions へ整理されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は portability boundary を未決事項から current decision へ更新し、design gate の remaining decision から切り離した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) は provider-specific IaC / workflow internals と cloud-neutral app-facing contract の境界を current decision status に追加した
- [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は workflow / production gate の観点で同じ portability boundary を補足した

## Current Review Notes

- portability boundary 自体の意思決定は Issue 8 と [docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md](docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md) が primary evidence であり、本 issue はその accepted decision を production gate 文書へ同期する追従作業である
- provider-specific 実装を許容する範囲は infrastructure backend、module wiring、workflow command、secret handling の内部に限定し、user-facing route、frontend configuration contract、frontend architecture、monitoring wording には漏らさない
- certificate sourcing、external DNS coordination、production deploy workflow、production resource wiring は本 issue に含めていないため、production rollout の fail-closed 方針は維持される

## Spot Check Evidence

- source decision: [docs/portal/issues/issue-08-multicloud-design-constraints.md](docs/portal/issues/issue-08-multicloud-design-constraints.md) と [docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md](docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md) は AWS-specific deployment を許容しつつ app-facing contract を cloud-neutral に保つ accepted boundary を示す
- product wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は portability boundary を current decision snapshot と design gate の既決事項として読める
- policy and workflow wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は provider-specific internals と cloud-neutral review surface の境界を同じ方向で説明している
- diagnostics: edited files に editor diagnostics は発生していないことを確認する

## Evidence Mapping Table

For Issue 32 final review, the local issue record is the primary evidence source. [docs/portal/issues/issue-08-multicloud-design-constraints.md](docs/portal/issues/issue-08-multicloud-design-constraints.md) and [docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md](docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md) provide the source decision, while [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the synchronized production gate wording.

### Task Mapping

| Checklist item                                                              | Primary evidence section                                                                                                                                                                                                                                                                              | Why this is the evidence                                                                                                     | Review state              |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| accepted portability boundary を production gate 文書へ同期する             | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                               | These sources show the already-accepted boundary is now restated in the production gate documents as a current decision.     | Accepted for final review |
| product / policy / workflow / environment wording の境界を揃える            | Implementation Notes, Spot Check Evidence, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                             | These sources show the same portability boundary is explained consistently across workflow and environment-facing documents. | Accepted for final review |
| remaining production blocker wording を portability boundary 以外へ整理する | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) | These sources show the blocker is no longer described as an unresolved portability decision.                                 | Accepted for final review |
| issue 記録へ根拠と非対象を残す                                              | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-32-production-portability-boundary-sync.md](docs/portal/issues/issue-32-production-portability-boundary-sync.md)                                                                        | These sections preserve the accepted boundary source, the synchronized files, and the excluded rollout work in one record.   | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                                           | Primary evidence section                                                                                                                                                                                                                                                                                                                                                  | Why this is the evidence                                                                                                                      | Review state              |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| portability boundary が未決事項ではなく current decision として読める                                                    | Implementation Notes, Spot Check Evidence, and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)                                                                                                                                                                                                                                   | These sources show the unresolved wording was replaced with an explicit current decision statement.                                           | Accepted for final review |
| AWS-specific delivery choices と cloud-neutral contract の境界が複数文書で整合している                                   | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the same boundary is described consistently across product, policy, workflow, and environment contexts.                    | Accepted for final review |
| production rollout blocker が portability boundary ではなく remaining operator / certificate conditions へ整理されている | Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md)                                                                                           | These sources show portability boundary is no longer treated as a pending blocker, while operator-managed production conditions still remain. | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                                        | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-32-production-portability-boundary-sync.md](docs/portal/issues/issue-32-production-portability-boundary-sync.md)                                                                                                                                        | These sections preserve the file scope, validation path, and source decision mapping for this synchronization work.                           | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-32-production-portability-boundary-sync.md](docs/portal/issues/issue-32-production-portability-boundary-sync.md), with [docs/portal/issues/issue-08-multicloud-design-constraints.md](docs/portal/issues/issue-08-multicloud-design-constraints.md) and [docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md](docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md) used as the primary source decision evidence and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) used as the synchronized production gate wording evidence.

| Checklist area | Final judgment | Evidence basis |
| --- | --- | --- |
| Boundary synchronization | Satisfied | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/issues/issue-08-multicloud-design-constraints.md](docs/portal/issues/issue-08-multicloud-design-constraints.md), [docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md](docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md), and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) confirm the already-accepted portability boundary is now restated as a current production decision. |
| Cross-document consistency | Satisfied | Implementation Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm the same AWS-specific versus cloud-neutral boundary is described consistently. |
| Remaining blocker clarity | Satisfied | Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) confirm portability boundary is no longer treated as a pending blocker while certificate and operator conditions remain deferred. |
| Traceability | Satisfied | Task Contract, Implementation Notes, Spot Check Evidence, Evidence Mapping Table, and [docs/portal/issues/issue-32-production-portability-boundary-sync.md](docs/portal/issues/issue-32-production-portability-boundary-sync.md) preserve scope, evidence, and excluded rollout work in one record. |

## Process Review Notes

- Cloud Sonnet review では軽微修正のみ必要で blocking issue はないという結論を確認した。
- 軽微修正として Task Contract の受け入れ条件を完了状態へ同期し、final review result を issue record に追記した。
- repository owner から close approval を受領したため、本 issue を closed へ移行する。

## Current Status

- CLOSED

- portability boundary の source decision は Issue 8 と multicloud constraints draft にある
- production gate 文書はその accepted boundary を current decision として同期済みである
- certificate sourcing、external DNS coordination、production rollout implementation は後続 issue の対象に残る
- 2026-03-09: Cloud Sonnet review の軽微修正を反映し、close approval を受領して GitHub Issue 32 を CLOSED に移行する

## Dependencies

- Issue 8
- Issue 31
