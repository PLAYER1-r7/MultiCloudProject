## Summary

staging-first の rollback readiness と artifact retention evidence は揃ってきたが、production promotion 時にどの状態を rollback target として採用するかが current decision として固定されていないままだと、production gate の remaining blocker が rollback 側で曖昧なまま残る。

## Goal

production rollback target baseline を明文化し、last known-good artifact、staging-validated promotion candidate、artifact evidence path、post-rollback verification boundary を current decision として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-35
- タイトル: production rollback target baseline を明文化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production rollout planning
- 優先度: 中
- 先行条件: Issue 14 closed, Issue 20 closed, Issue 26 closed, Issue 27 closed, Issue 28 closed, Issue 33 closed, Issue 34 closed

目的
- 解決する問題: production promotion 前に rollback target が current decision として固定されていないと、artifact retention と release evidence が揃っていても、どの build を復旧対象とみなすか、どこまでを rollback baseline として fail-closed に扱うかが文書から読めない
- 期待する価値: production rollback target を staging delivery path で検証済みの last known-good artifact に固定し、artifact evidence と post-rollback verification の責務境界を production gate 文書へ同期できる

スコープ
- 含むもの: product / architecture / IaC / CI/CD / production README wording の同期、issue 記録への根拠整理
- 含まないもの: production deploy workflow 追加、artifact restore automation 実装、DNS cutover rollback 手順の詳細化、production apply 実行、incident runbook の全面実装
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-35-production-rollback-target-baseline.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/variables.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production rollback target baseline が staging-validated last known-good artifact を current decision として含めて読める
- [x] 条件 2: artifact evidence path と post-rollback verification boundary が product / policy / workflow / environment 文書で整合している
- [x] 条件 3: DNS cutover rollback や automation 実装を本 issue に混ぜず、production rollback target baseline だけにスコープを限定できている

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-35-production-rollback-target-baseline.md
- アプローチ: Issue 14 の rollback policy、Issue 26 の staging rollback readiness、Issue 27 の artifact retention / release evidence、Issue 28 の production gate baseline を接続し、production rollback target を staging-validated artifact baseline として固定する
- 採用しなかった代替案と理由: production DNS rollback や automatic rollback を同時に詳細化する案は、cutover execution details と production rollout implementation を混在させて scope を広げるため採らない

検証計画
- 実行するテスト: markdown review; grep for rollback target wording drift; get_errors on edited files
- 確認するログ/メトリクス: last known-good artifact wording、staging-validated promotion candidate wording、artifact evidence path wording、post-rollback verification wording の整合
- 失敗時の切り分け経路: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md を照合し、rollback target baseline と operator boundary のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: rollback target baseline の明文化が production DNS rollback や full incident runbook まで確定したように読まれること
- 影響範囲: production gate wording、promotion approval expectation、future rollout / recovery planning
- 緩和策: wording を last known-good artifact、artifact evidence path、post-rollback verification boundary に限定し、DNS reversal と automation detail は operator-managed follow-up として残す
- ロールバック手順: rollback target baseline が current artifact retention / evidence path と衝突すると判明した場合は current decision wording を deferred state に戻し、別 issue で再整理する
```

## Tasks

- [x] production rollback target baseline を production gate 文書へ同期する
- [x] artifact evidence path と post-rollback verification boundary を揃える
- [x] staging-validated promotion candidate と rollback target の関係を production 文脈で明記する
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] rollback target baseline が staging-validated last known-good artifact を current decision として読める
- [x] artifact evidence path と post-rollback verification boundary が複数文書で整合している
- [x] production rollback target baseline が DNS cutover rollback や automation detail と分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は production rollback target baseline を current decision snapshot に追加し、last known-good artifact と operator-reviewed evidence path を product decision として読めるようにした
- [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は production rollback target model を staging-validated artifact baseline として追加し、fresh rebuild を recovery target にしない理由を architecture 側で明示した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は rollback target baseline、artifact evidence path、post-rollback verification boundary を production gate wording に同期した

## Current Review Notes

- rollback target baseline は last known-good artifact とその evidence path に限定し、production DNS rollback、automatic rollback、incident runbook 全体は本 issue に含めていない
- staging で成立している rollback readiness と artifact evidence path を production promotion 文脈へ接続することで、未検証 build の再生成を recovery target に混ぜない方針を維持している
- post-rollback verification は workflow automation 完結ではなく operator-reviewed discipline として残し、production rollout implementation と混線しないようにしている

## Spot Check Evidence

- product wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は production rollback target baseline を current decision snapshot として保持している
- architecture wording: [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は last known-good artifact を recovery target とし、fresh rebuild を recovery target にしない理由を説明している
- policy and workflow wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md) は rollback target baseline、artifact evidence path、post-rollback verification boundary を整合して説明している
- environment wording: [infra/environments/production/README.md](infra/environments/production/README.md) は rollback target artifact、evidence path、verification owner を fail-closed rule と operator step から読める

## Evidence Mapping Table

For Issue 35 final review, the local issue record is the primary evidence source. [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) provides the product baseline, while [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the synchronized production rollback target baseline.

### Task Mapping

| Checklist item                                                                              | Primary evidence section                                                                                                                                                                                                                                                                                                                            | Why this is the evidence                                                                                                           | Review state |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| production rollback target baseline を production gate 文書へ同期する                       | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                                                 | These sources show the rollback target baseline is now restated as a current production decision rather than a README-only note.   | Accepted for final review |
| artifact evidence path と post-rollback verification boundary を揃える                      | Implementation Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the same evidence path and verification discipline are carried through the production rollback baseline.        | Accepted for final review |
| staging-validated promotion candidate と rollback target の関係を production 文脈で明記する | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                     | These sources show promotion candidate selection and rollback target recording stay in the same operator-reviewed production path. | Accepted for final review |
| issue 記録へ根拠と非対象を残す                                                              | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-35-production-rollback-target-baseline.md](docs/portal/issues/issue-35-production-rollback-target-baseline.md)                                                                                                                        | These sections preserve the scope, evidence, and excluded production recovery detail in one record.                                | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                          | Primary evidence section                                                                                                                                                                                                                                                                                                                            | Why this is the evidence                                                                                                                | Review state |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| rollback target baseline が staging-validated last known-good artifact を current decision として読める | Implementation Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                   | These sources show the baseline now names the staging-validated last known-good artifact as the recovery target in production planning. | Accepted for final review |
| artifact evidence path と post-rollback verification boundary が複数文書で整合している                  | Current Review Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the evidence path and verification discipline stay aligned after the rollback target decision.                       | Accepted for final review |
| production rollback target baseline が DNS cutover rollback や automation detail と分離されている       | Current Review Notes, Spot Check Evidence, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                 | These sources show DNS reversal detail and automation depth remain outside this issue's scope.                                          | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                       | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-35-production-rollback-target-baseline.md](docs/portal/issues/issue-35-production-rollback-target-baseline.md)                                                                                                                    | These sections preserve the file scope, validation path, and evidence basis for this rollback-target work.                              | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-35-production-rollback-target-baseline.md](docs/portal/issues/issue-35-production-rollback-target-baseline.md), with [infra/environments/production/README.md](infra/environments/production/README.md) used as the primary production rollback baseline evidence and [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) used as synchronized supporting evidence.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Rollback target baseline | Satisfied | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm the production rollback target is the staging-validated last known-good artifact. |
| Evidence path and verification boundary | Satisfied | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm the same release evidence path and post-rollback verification boundary remain aligned. |
| Scope control | Satisfied | `Task Contract`, `Current Review Notes`, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm DNS reversal detail, automation depth, and production rollout implementation remain out of scope. |
| Traceability | Satisfied | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and the `Evidence Mapping Table` in [docs/portal/issues/issue-35-production-rollback-target-baseline.md](docs/portal/issues/issue-35-production-rollback-target-baseline.md) confirm the issue record still tracks file scope, validation path, and review basis. |

## Process Review Notes

- Issue 35 は Issue 14、Issue 26、Issue 27、Issue 28 の rollback / evidence / production gate baseline を接続し、production promotion 前に復旧対象 artifact を fail-closed に固定する documentation work として整理した。
- 2026-03-09 時点で、review evidence を含む最新文言は commit 796404b として公開済みであり、formal review に使う根拠は GitHub 上の公開状態と一致している。
- repository owner から review preparation に関する再合意を受けたが、これは close approval ではない。close は別途 explicit approval を受領するまで実施しない。

## Current Status

- OPEN

- production rollback target baseline は staging-validated last known-good artifact、artifact evidence path、post-rollback verification boundary を含む current decision として同期済みである
- implementation sync は完了しており、formal review ready だが close 判定は未実施である
- production DNS rollback detail、automatic rollback、production rollout implementation、cutover execution details は後続 issue の対象に残る

## Dependencies

- Issue 14
- Issue 20
- Issue 26
- Issue 27
- Issue 28
- Issue 33
- Issue 34
