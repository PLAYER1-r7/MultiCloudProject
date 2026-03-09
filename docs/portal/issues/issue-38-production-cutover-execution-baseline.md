## Summary

production rollout baseline までは repo に固定されたが、external DNS validation、ACM certificate issuance execution、custom-domain cutover、production smoke URL handoff が operator-managed step のまま散在している。このままだと初回 production apply と cutover をどの順序で実行し、どの evidence を残し、どこで fail-closed に止めるかが一つの execution baseline として読めない。

## Goal

production cutover execution baseline を定義し、external DNS validation、reviewed certificate ARN handoff、production aliases / base URL / smoke path の設定、custom-domain cutover、post-cutover verification を operator-managed execution path として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-38
- タイトル: production cutover execution baseline を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production custom-domain cutover execution
- 優先度: 中
- 先行条件: Issue 33 closed, Issue 34 closed, Issue 35 closed, Issue 36 closed

目的
- 解決する問題: production rollout baseline が存在しても、external DNS validation、certificate issuance execution、production aliases / base URL / smoke path 設定、custom-domain cutover の operator 手順が未固定だと、初回 production cutover の責務境界と fail-closed 条件が実行面で曖昧なまま残る
- 期待する価値: production custom-domain cutover を workflow-complete automation にせず operator-managed execution path として整理し、どの入力が揃えば production apply / deploy / verification を進めてよいかを一つの baseline に固定できる

スコープ
- 含むもの: production cutover operator steps の明文化、external DNS validation / certificate issuance execution / custom-domain cutover / post-cutover verification の順序整理、production aliases / base URL / smoke path handoff wording の同期、issue 記録への根拠整理
- 含まないもの: DNS provider account 実運用変更、ACM certificate 自動発行 workflow、Route 53 採用、automatic rollback 実装、incident runbook 全面整備
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-38-production-cutover-execution-baseline.md
- 制限パス: .github/workflows/*.yml, infra/environments/production/main.tf, infra/environments/production/outputs.tf, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: production cutover execution baseline が external DNS validation、certificate issuance execution、custom-domain cutover、post-cutover verification の順序を fail-closed に読める
- [ ] 条件 2: production aliases、reviewed certificate ARN、PRODUCTION_BASE_URL、PRODUCTION_SMOKE_PATHS の handoff boundary が docs / workflow README / production README で整合している
- [ ] 条件 3: DNS provider account 操作や automatic rollback 実装を本 issue に混ぜず、operator-managed execution baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-38-production-cutover-execution-baseline.md
- アプローチ: Issue 33, 34, 35, 36 で固定した domain / certificate / rollback / rollout baseline を前提に、operator が production custom-domain cutover を実行するための順序、入力、evidence、fail-closed 条件を文書へ同期する
- 採用しなかった代替案と理由: DNS provider や ACM issuance を workflow automation に寄せる案は external DNS operating model と operator-managed boundary を崩すため採らない

検証計画
- 実行するテスト: markdown review; grep for cutover wording drift; get_errors on edited files
- 確認するログ/メトリクス: external DNS validation wording、certificate issuance execution wording、production base URL / smoke path handoff wording、post-cutover verification wording の整合
- 失敗時の切り分け経路: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md を照合し、operator step と fail-closed wording のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: cutover execution baseline の明文化が DNS provider account 操作や automatic rollback 実装まで repo で保証するように読まれること
- 影響範囲: production cutover expectations、operator handoff、first production release evidence
- 緩和策: wording を operator-managed execution baseline に限定し、provider account details と automation depth は follow-up に残す
- ロールバック手順: cutover execution baseline が現実の external DNS operating model と衝突すると判明した場合は execution wording を deferred state に戻し、別 issue で再整理する
```

## Tasks

- [x] production cutover execution baseline を文書へ同期する
- [x] production aliases / base URL / smoke path handoff boundary を整理する
- [x] post-cutover verification と rollback evidence の operator handoff を揃える
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] production cutover execution baseline が operator-managed step と fail-closed 条件を current path として示している
- [x] production aliases、reviewed certificate ARN、PRODUCTION_BASE_URL、PRODUCTION_SMOKE_PATHS の handoff boundary が複数文書で整合している
- [x] DNS provider account 操作や automatic rollback 実装が本 issue のスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は production cutover execution baseline を current decision として同期し、operator-managed sequence と fail-closed boundary を明文化した
- [.github/workflows/README.md](.github/workflows/README.md) は production deploy baseline の外側にある cutover handoff を、reviewed certificate ARN、production aliases、`PRODUCTION_BASE_URL`、`PRODUCTION_SMOKE_PATHS`、rollback evidence を含む operator review path として整理した
- [infra/environments/production/README.md](infra/environments/production/README.md) は production custom-domain verification を complete と見なす前提条件と、gate closure 後の operator steps を cutover 順序つきで更新した

## Current Review Notes

- cutover execution baseline は workflow-complete automation ではなく operator-managed sequence に限定し、DNS provider account detail、automatic rollback、emergency override depth は本 issue に含めていない
- production aliases、reviewed certificate ARN、`PRODUCTION_BASE_URL`、`PRODUCTION_SMOKE_PATHS` は同じ production review path で記録される handoff input として整理し、custom-domain verification の開始条件にした
- post-cutover verification は custom-domain reachability と rollback evidence を同じ operator review path に残す形で整理し、staging-first evidence discipline と矛盾しないようにした
- route baseline と staging verification posture から `PRODUCTION_SMOKE_PATHS=/,/overview,/guidance` は確定できるため GitHub environment variable へ投入済みである。さらに、us-east-1 の唯一の ISSUED ACM certificate が `www.aws.ashnova.jp` を対象にしていることを確認し、`PRODUCTION_BASE_URL=https://www.aws.ashnova.jp` を production environment variable へ投入済みである

## Spot Check Evidence

- product and architecture wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) と [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は certificate issuance execution、custom-domain cutover、post-cutover verification の順序を current decision として読める
- policy wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は production aliases、reviewed certificate ARN、`PRODUCTION_BASE_URL`、`PRODUCTION_SMOKE_PATHS` を fail-closed handoff input として扱っている
- workflow and environment wording: [.github/workflows/README.md](.github/workflows/README.md) と [infra/environments/production/README.md](infra/environments/production/README.md) は production deploy 後の operator-managed cutover と custom-domain verification を同じ evidence path で整理している

## Evidence Mapping Table

For Issue 38 implementation sync, the local issue record is the primary evidence source. [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the synchronized cutover execution baseline.

### Task Mapping

| Checklist item                                                              | Primary evidence section                                                                                                                                                                                                                                                                                                  | Why this is the evidence                                                                                                               | Review state              |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| production cutover execution baseline を文書へ同期する                      | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) | These sources show the operator-managed cutover sequence is now recorded as a current production baseline.                             | Accepted for final review |
| production aliases / base URL / smoke path handoff boundary を整理する      | Implementation Notes, Current Review Notes, Spot Check Evidence, [.github/workflows/README.md](.github/workflows/README.md), [infra/environments/production/README.md](infra/environments/production/README.md), and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                           | These sources show aliases, base URL, and smoke paths are treated as explicit handoff inputs before custom-domain verification starts. | Accepted for final review |
| post-cutover verification と rollback evidence の operator handoff を揃える | Implementation Notes, Current Review Notes, Spot Check Evidence, [.github/workflows/README.md](.github/workflows/README.md), [infra/environments/production/README.md](infra/environments/production/README.md), and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)             | These sources show post-cutover verification and rollback evidence remain in the same operator review path.                            | Accepted for final review |
| issue 記録へ根拠と非対象を残す                                              | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-38-production-cutover-execution-baseline.md](docs/portal/issues/issue-38-production-cutover-execution-baseline.md)                                                                                          | These sections preserve the scope, evidence, and excluded automation depth in one record.                                              | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                                                         | Primary evidence section                                                                                                                                                                                                                                                                                                                            | Why this is the evidence                                                                                                    | Review state              |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| production cutover execution baseline が operator-managed step と fail-closed 条件を current path として示している                     | Implementation Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [infra/environments/production/README.md](infra/environments/production/README.md)                                       | These sources show the cutover sequence and stop conditions are now documented as the current operator baseline.            | Accepted for final review |
| production aliases、reviewed certificate ARN、PRODUCTION_BASE_URL、PRODUCTION_SMOKE_PATHS の handoff boundary が複数文書で整合している | Current Review Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the same handoff inputs are required across policy, workflow guidance, and production operator guidance. | Accepted for final review |
| DNS provider account 操作や automatic rollback 実装が本 issue のスコープ外として維持されている                                         | Task Contract, Current Review Notes, Spot Check Evidence, [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md)                                                                                                                                      | These sources keep provider account detail and automation depth out of the cutover execution baseline.                      | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                                                      | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-38-production-cutover-execution-baseline.md](docs/portal/issues/issue-38-production-cutover-execution-baseline.md)                                                                                                                | These sections preserve the file scope, validation path, and evidence basis for this cutover baseline work.                 | Accepted for final review |

## Final Review Result

- PASS: production cutover execution baseline は operator-managed cutover sequence、handoff input、post-cutover verification、rollback evidence path を repo 上で一貫して示しており、formal review 時点で blocking finding はない
- NOTE: `PRODUCTION_SMOKE_PATHS=/,/overview,/guidance` と `PRODUCTION_BASE_URL=https://www.aws.ashnova.jp` は GitHub environment へ投入済みであり、cutover verification に必要な環境値は記録完了した

## Process Review Notes

- 2026-03-09 formal review では [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)、[docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) を再確認し、cutover sequence と fail-closed boundary が Issue 38 の scope どおりに同期されていることを確認した
- route baseline と staging verification posture から `PRODUCTION_SMOKE_PATHS=/,/overview,/guidance` は確定できたため GitHub environment variable へ投入済みである。さらに、us-east-1 の唯一の ISSUED ACM certificate `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` が `www.aws.ashnova.jp` を対象としていることを確認し、`PRODUCTION_BASE_URL=https://www.aws.ashnova.jp` を production environment variable へ投入済みである
- Published evidence commit は `0310b60` であり、formal review 記録は cutover execution baseline の受理と、環境値の確定状況を追補するものである
- 2026-03-09 に明示的な close 承認を受け、local issue record と GitHub Issue #38 を close 状態へ同期する

## Current Status

- CLOSED

- production cutover execution baseline は operator-managed sequence、handoff input、post-cutover verification を含む current path として同期済みである
- implementation sync、formal review、`PRODUCTION_BASE_URL` / `PRODUCTION_SMOKE_PATHS` の環境投入、Issue 38 close は完了している
- DNS provider account detail、automatic rollback、emergency override depth は後続 issue の対象に残る

## Dependencies

- Issue 33
- Issue 34
- Issue 35
- Issue 36
