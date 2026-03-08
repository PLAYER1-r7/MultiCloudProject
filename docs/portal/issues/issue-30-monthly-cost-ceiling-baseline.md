## Summary

production gate の blocker のうち monthly cost ceiling は最後まで人の判断待ちだったが、金額が固定されないままだと production へ進む条件が repo 上に残らず、production backend wiring や deploy gate の設計も fail-closed のまま前進できない。

## Goal

first public release の monthly cost ceiling を USD 15/month before tax として固定し、その根拠と適用範囲を production gate 文書へ反映する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-30
- タイトル: monthly cost ceiling baseline を決定する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production design gate
- 優先度: 中
- 先行条件: Issue 28 closed, Issue 29 closed

目的
- 解決する問題: monthly cost ceiling が未記録のままだと、production rollout の開始条件が曖昧なまま残り、production gate が fail-closed のままでも解除条件が repo 上に固定されない
- 期待する価値: first public release の cost guardrail を USD 15/month before tax として固定し、production の次段階を monthly cost 未決ではなく backend wiring と残存 operator 条件へ切り分けられる

スコープ
- 含むもの: monthly cost ceiling の決定記録、small static site footprint に対する適用範囲の明文化、production gate / policy / product 文書への反映、issue 記録への根拠整理
- 含まないもの: production backend wiring の追加、AWS Budgets action の自動化、WAF や synthetic monitoring の常時導入、cost overrun 対応 runbook の実装
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md
- 制限パス: infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: monthly cost ceiling が current production gate 文書から参照できる
- [ ] 条件 2: ceiling の適用範囲が current small static-site footprint に限定されていることが読める
- [ ] 条件 3: production backend wiring や deploy workflow 実装を本 issue に混ぜない

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md
- アプローチ: current infrastructure footprint が small static site centered on S3 + CloudFront である点を根拠に、first public release の guardrail として USD 15/month before tax を production gate 文書へ反映する
- 採用しなかった代替案と理由: 未確定の traffic 前提や broader observability stack を含む高めの ceiling を先に置く案は、first-release の fail-closed gate としては緩すぎるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: cost ceiling wording、scope wording、remaining production blocker wording
- 失敗時の切り分け経路: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-28-production-readiness-gate-baseline.md、docs/portal/issues/issue-29-state-locking-baseline.md を照合し、cost guardrail と remaining blockers のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: small static-site baseline を超える production footprint なのに ceiling だけを固定して、後続 implementation が guardrail を誤読すること
- 影響範囲: production gate wording、policy wording、future production wiring scope
- 緩和策: USD 15/month before tax は current S3 + CloudFront centered footprint に限定することを明記し、footprint 変更時は ceiling を明示的に見直す
- ロールバック手順: ceiling が不適切と判明した場合は current docs の cost wording を revised ceiling に更新し、必要なら separate issue で rationale を再整理する
```

## Tasks

- [x] monthly cost ceiling を first public release の guardrail として固定する
- [x] current small static-site footprint への適用範囲を整理する
- [x] production gate と policy 文書の cost wording を更新する
- [x] monthly cost ceiling baseline の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] monthly cost ceiling が product / policy / production gate 文書から参照できる
- [x] ceiling の適用範囲が current small static-site footprint に限定されている
- [x] production backend wiring と deploy workflow 実装を本 issue のスコープ外として維持できている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は current decision snapshot に USD 15/month before tax の monthly cost ceiling を追加し、production gate の remaining blockers を cost 未決から remaining entry conditions 側へ更新した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は current production cost guardrail を selected baseline として扱い、pipeline / IaC がなお staging で止まる理由を production backend wiring と remaining entry conditions に揃えた
- [/.github/workflows/README.md](.github/workflows/README.md) と [infra/environments/production/README.md](infra/environments/production/README.md) は production readiness gate snapshot に USD 15/month before tax を反映し、ceiling の適用対象を current S3 + CloudFront centered small static-site footprint と明示した

## Current Review Notes

- current infrastructure baseline は S3 + CloudFront centered の small static site であり、WAF 常時運用、synthetic monitoring 常時運用、production-specific logging expansion は current ceiling の前提に含めていない
- AWS Budgets の監視通知自体は無料で使えるため、ceiling 記録そのものに追加課金前提はない
- monthly cost ceiling を固定しても production backend wiring、自動 deploy workflow、operator cutover step は未実装のままであり、production gate の fail-closed 方針は維持される
- footprint が current baseline を超える場合は、ceiling を implicit に破るのではなく、別 issue で明示的に見直すべきである

## Spot Check Evidence

Issue 30 の final review 前に、monthly cost ceiling baseline が想定どおり整理されているかを spot check した結果を残す。

- product decision wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は USD 15/month before tax を current production decision snapshot として記録する
- policy wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は monthly cost guardrail を unresolved ではなく selected baseline として扱う
- production gate wording: [/.github/workflows/README.md](.github/workflows/README.md) と [infra/environments/production/README.md](infra/environments/production/README.md) は current static-site footprint に対する USD 15/month ceiling を記録し、remaining blocker を production backend wiring と operator conditions に整理する
- infrastructure baseline fit: [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) は S3 bucket と CloudFront distribution を中心とした static delivery footprint を示し、current ceiling rationale の主要根拠になる

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 30 final review, the local issue record is the primary evidence source. [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) provides the top-level decision wording, while [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide policy and gate wording evidence.

### Task Mapping

| Checklist item                                                             | Primary evidence section                                                                                                                                                                                                                                                                                                                                 | Why this is the evidence                                                                                                  | Review state              |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `monthly cost ceiling を first public release の guardrail として固定する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                  | These sources show the cost ceiling is explicitly named and attached to the production decision snapshot.                 | Accepted for final review |
| `current small static-site footprint への適用範囲を整理する`               | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/production/README.md](infra/environments/production/README.md), and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf)                                                                                                      | These sources show the ceiling is scoped to the current S3 + CloudFront centered static-site baseline.                    | Accepted for final review |
| `production gate と policy 文書の cost wording を更新する`                 | `Implementation Notes`, `Spot Check Evidence`, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the unresolved-cost wording is replaced by a selected baseline and updated blocker wording.            | Accepted for final review |
| `monthly cost ceiling baseline の根拠と非対象を issue 記録へ残す`          | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md)                                                                                                                                 | These sections keep both the cost baseline rationale and the excluded production implementation work in one issue record. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                 | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                                                                           | Why this is the evidence                                                                                                       | Review state              |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `monthly cost ceiling が product / policy / production gate 文書から参照できる`                | `Implementation Notes`, `Spot Check Evidence`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show the same ceiling is present across the current decision, policy, and gate surfaces.                         | Accepted for final review |
| `ceiling の適用範囲が current small static-site footprint に限定されている`                    | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/production/README.md](infra/environments/production/README.md), and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf)                                                                                                                                                                                                | These sources show the ceiling is tied to the current static delivery footprint rather than a broader future production shape. | Accepted for final review |
| `production backend wiring と deploy workflow 実装を本 issue のスコープ外として維持できている` | `Task Contract`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md)                                                                                                                                                                                                                                                   | These sections keep production implementation work out of scope.                                                               | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                            | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md)                                                                                                                                                                                                                       | These sections preserve the scope, validation path, and evidence basis for the cost guardrail work.                            | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md), with [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) used as the primary top-level decision evidence and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) used as supporting evidence for policy and production gate wording.

| Checklist area         | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cost ceiling selection | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm USD 15/month before tax is the selected baseline.                                                                                           |
| Scope fit              | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/production/README.md](infra/environments/production/README.md), and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) confirm the ceiling is tied to the current static footprint.                                                                                            |
| Gate wording           | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm unresolved-cost wording has been replaced. |
| Scope control          | Satisfied      | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md) confirm production backend wiring and deploy workflow work remain excluded.                                                                                                                                                       |
| Traceability           | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md](docs/portal/issues/issue-30-monthly-cost-ceiling-baseline.md) confirm the issue record tracks scope and evidence.                                                                                                                            |

## Process Review Notes

- Issue 30 は Issue 28 と Issue 29 のあとに残った monthly cost blocker を、repository owner の explicit decision に基づく production gate baseline として記録する作業として整理した。
- repository owner から close approval を受領し、CloudSonnet review でも blocking issue がないことを確認したため、本 issue を closed へ移行する。

## Current Status

- CLOSED

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は USD 15/month before tax の monthly cost ceiling を current decision snapshot として扱う
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は cost guardrail を selected baseline として扱う
- [infra/environments/production/README.md](infra/environments/production/README.md) と [/.github/workflows/README.md](.github/workflows/README.md) は current static-site footprint に対する monthly cost ceiling を production gate wording へ反映する
- 2026-03-08: close approval を受領し、GitHub Issue 30 を CLOSED に移行した

## Dependencies

- Issue 15
- Issue 28
- Issue 29
