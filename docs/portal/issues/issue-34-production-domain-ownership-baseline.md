## Summary

production custom-domain path は external DNS operating model と ACM baseline まで整理されたが、どの production custom domain を承認済みの対象として扱い、誰の approval の下で DNS record change を進めるかが未固定のままだと、production gate の remaining blocker が domain ownership 側で曖昧なまま残る。

## Goal

production domain ownership baseline を明文化し、approved custom-domain path、external ownership boundary、repository owner approval、operator-managed DNS record changes を current decision として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-34
- タイトル: production domain ownership baseline を明文化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production custom-domain planning
- 優先度: 中
- 先行条件: Issue 4 closed, Issue 31 closed, Issue 32 closed, Issue 33 closed

目的
- 解決する問題: production custom domain の ownership boundary が未固定のままだと、external DNS operating model と certificate baseline が揃っていても、どの domain path を production aliases に使ってよいか、誰の approval で DNS record changes を進めるかが fail-closed に読めない
- 期待する価値: approved production custom-domain path を external ownership のまま扱い、repository owner approval と operator-managed DNS record changes の境界を current decision として文書へ固定できる

スコープ
- 含むもの: product / architecture / IaC / CI/CD / production README wording の同期、issue 記録への根拠整理
- 含まないもの: production aliases の実設定、DNS provider account 変更、Route 53 採用、certificate 実発行、cutover 実施、production deploy workflow 追加
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-34-production-domain-ownership-baseline.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/variables.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: production domain ownership baseline が approved custom-domain path と external ownership boundary を含めて current decision として読める
- [x] 条件 2: repository owner approval と operator-managed DNS record changes の境界が product / architecture / policy / workflow / environment 文書で整合している
- [x] 条件 3: production aliases を設定できる前提が approved custom-domain path の記録に依存することを environment 文書から読める

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-34-production-domain-ownership-baseline.md
- アプローチ: external DNS operating model、repository owner approval model、certificate sourcing baseline の既存決定を前提に、approved custom-domain path と DNS record change boundary を production gate 文書へ同期する
- 採用しなかった代替案と理由: Route 53 ownership へ寄せる案や DNS record changes を workflow automation に含める案は、current external DNS operating model と fail-closed 方針を崩すため採らない

検証計画
- 実行するテスト: markdown review; grep for domain ownership wording drift; get_errors on edited files
- 確認するログ/メトリクス: approved custom-domain wording、external ownership wording、repository owner approval wording、operator-managed DNS change wording の整合
- 失敗時の切り分け経路: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md を照合し、domain ownership baseline と operator boundary のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: domain ownership baseline の明文化が DNS provider account ownership や cutover execution まで確定したように読まれること
- 影響範囲: production gate wording、custom-domain approval expectations、future production rollout planning
- 緩和策: wording を approved custom-domain path、repository owner approval、operator-managed DNS record changes に限定し、provider account details と cutover execution は operator-managed step として残す
- ロールバック手順: domain ownership baseline が現実の external DNS operating model と衝突すると判明した場合は current decision wording を deferred state に戻し、別 issue で再整理する
```

## Tasks

- [x] production domain ownership baseline を production gate 文書へ同期する
- [x] repository owner approval と operator-managed DNS record change boundary を揃える
- [x] approved custom-domain path を前提にした fail-closed wording を environment 文書へ反映する
- [x] issue 記録へ根拠と非対象を残す

## Definition of Done

- [x] domain ownership baseline が approved custom-domain path と external ownership boundary を含む current decision として読める
- [x] repository owner approval と operator-managed DNS change boundary が複数文書で整合している
- [x] approved custom-domain path の記録が production aliases 前提として environment 文書から読める
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は production domain ownership and DNS operating model を approved externally owned custom-domain path、repository owner approval、operator-managed DNS changes を含む current decision に更新した
- [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は production custom-domain model を approved domain path 前提へ更新し、downstream implication から domain ownership 未決の表現を外した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/production/README.md](infra/environments/production/README.md) は approved custom-domain path、repository owner approval、operator-managed DNS changes の境界を production gate wording に同期した

## Current Review Notes

- DNS provider account ownership、DNS record の実投入、certificate validation 実行、custom domain cutover は本 issue に含めず、operator-managed production step として残している
- repository owner approval はどの custom-domain path を production aliases 対象として認めるかの境界に限定し、DNS provider 側の account ownership までは repo で表現しない
- Route 53 ownership への移行や workflow 完結の DNS automation は current operating model に含めていない

## Spot Check Evidence

- product wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は approved production custom-domain path、external ownership boundary、repository owner approval を current decision snapshot として読める
- architecture wording: [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は approved production custom-domain path を external DNS operating model で CloudFront に接続する前提を保持している
- policy and workflow wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)、[.github/workflows/README.md](.github/workflows/README.md) は repository owner approval と operator-managed DNS change boundary を整合して説明している
- environment wording: [infra/environments/production/README.md](infra/environments/production/README.md) は approved custom-domain path が production aliases と certificate wiring 前提であることを fail-closed rule から読める

## Evidence Mapping Table

For Issue 34 initial review, the local issue record is the primary evidence source. [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) provides the product baseline, while [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide the synchronized domain ownership baseline.

### Task Mapping

| Checklist item                                                                             | Primary evidence section                                                                                                                                                                                                                                        | Why this is the evidence                                                                                                                                | Review state |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| production domain ownership baseline を production gate 文書へ同期する                     | Implementation Notes, Current Review Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)             | These sources show the approved custom-domain path and external ownership boundary are now restated as a current production decision.                   | Accepted for final review |
| repository owner approval と operator-managed DNS record change boundary を揃える          | Implementation Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) | These sources show approval and DNS record changes remain separated between repository-level approval and operator-managed execution.                   | Accepted for final review |
| approved custom-domain path を前提にした fail-closed wording を environment 文書へ反映する | Implementation Notes, Spot Check Evidence, and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                                               | This source shows production aliases and certificate wiring still stay blocked until the approved custom-domain path and related DNS plan are recorded. | Accepted for final review |
| issue 記録へ根拠と非対象を残す                                                             | Task Contract, Implementation Notes, Current Review Notes, Spot Check Evidence, and [docs/portal/issues/issue-34-production-domain-ownership-baseline.md](docs/portal/issues/issue-34-production-domain-ownership-baseline.md)                                  | These sections preserve the scope, evidence, and excluded operator work in one record.                                                                  | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                                               | Primary evidence section                                                                                                                                                                                                                                        | Why this is the evidence                                                                                                            | Review state |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| domain ownership baseline が approved custom-domain path と external ownership boundary を含む current decision として読める | Implementation Notes, Spot Check Evidence, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                   | These sources show the baseline now includes the approved custom-domain path and the fact that ownership stays outside AWS.         | Accepted for final review |
| repository owner approval と operator-managed DNS change boundary が複数文書で整合している                                   | Current Review Notes, Spot Check Evidence, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), and [.github/workflows/README.md](.github/workflows/README.md) | These sources show the approval boundary and DNS execution boundary remain aligned after the domain ownership decision.             | Accepted for final review |
| approved custom-domain path の記録が production aliases 前提として environment 文書から読める                                | Implementation Notes, Spot Check Evidence, and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                                               | This source shows aliases and certificate wiring still remain blocked until the approved custom-domain path is explicitly recorded. | Accepted for final review |
| 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている                                                            | Task Contract, Implementation Notes, Spot Check Evidence, and Evidence Mapping Table in [docs/portal/issues/issue-34-production-domain-ownership-baseline.md](docs/portal/issues/issue-34-production-domain-ownership-baseline.md)                              | These sections preserve the file scope, validation path, and evidence basis for this domain ownership work.                         | Accepted for final review |

## Final Review Result

- Final review conclusion: accepted for close
- Review basis: local review and CloudSonnet follow-up review found no remaining blocking issue after the custom-domain wording was aligned to approved custom-domain path
- Residual follow-up kept out of scope: rollback target、production rollout implementation、cutover execution details

## Current Status

- CLOSED

- production domain ownership baseline は approved custom-domain path と external ownership boundary を current decision として同期済みである
- repository owner approval と operator-managed DNS record changes の責務境界は明記済みである
- rollback target、production rollout implementation、cutover execution details は後続 issue の対象に残る
- Closed on 2026-03-09 after final review and CloudSonnet follow-up confirmation.

## Dependencies

- Issue 4
- Issue 31
- Issue 32
- Issue 33
