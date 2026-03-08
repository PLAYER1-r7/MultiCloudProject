## Summary

staging-first の delivery path と release evidence は揃ってきたが、production 側は未決の monthly cost ceiling と state locking を抱えたままであり、この状態で production workflow や OpenTofu wiring を足すと fail-closed ではなく曖昧な運用依存になる。

## Goal

production readiness gate の前提、stop condition、operator-managed step を最小限の文書として固定し、Issue 10 と Issue 15 が求める production-specific approval gate の入口を repo 上で追跡可能にする。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-28
- タイトル: production readiness gate baseline を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production design gate
- 優先度: 中
- 先行条件: Issue 10 closed, Issue 15 closed, Issue 27 closed

目的
- 解決する問題: production promotion に必要な前提と stop condition が repo 内で十分に固定されていないと、production 実装の開始条件が曖昧になり、state locking や cost guardrail が未決のまま speculative な workflow や infra wiring が入りやすい
- 期待する価値: production readiness gate の required inputs、fail-closed 条件、operator-managed step を文書から追えるようにし、staging から production へ進めるかどうかの判断基準を明示できる

スコープ
- 含むもの: production gate snapshot の明文化、fail-closed rule の追記、operator-managed production step の整理、issue 記録への根拠整理
- 含まないもの: production deploy workflow の追加、production OpenTofu wiring の追加、state locking 未決の解消、monthly cost ceiling の決定
- 編集可能パス: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-28-production-readiness-gate-baseline.md
- 制限パス: infra/environments/production/*.tf, apps/portal-web/src/, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: production readiness gate の required inputs と blocked condition が文書から読める
- [ ] 条件 2: operator-managed production step と workflow 非対象の境界が追跡できる
- [ ] 条件 3: production workflow や infra wiring を本 issue に混ぜない

実装計画
- 変更見込みファイル: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-28-production-readiness-gate-baseline.md
- アプローチ: Issue 10、Issue 11、Issue 15、Issue 27 の決定事項から production 前提だけを抽出し、workflow と production environment seed に fail-closed な gate baseline を追加する
- 採用しなかった代替案と理由: 先に production workflow skeleton や OpenTofu wiring を作る案は、未決事項をコードに埋め込みやすく stop condition を弱めるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: required input wording、blocked condition wording、operator-managed step wording
- 失敗時の切り分け経路: .github/workflows/README.md、infra/environments/production/README.md、docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、docs/portal/issues/issue-10-cicd-policy.md を照合し、production gate と current decision snapshot のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: production readiness gate の名目で production 実装や未決事項の擬似解決まで同一 issue に入れてしまうこと
- 影響範囲: production planning boundary、future deploy workflow design、operator handoff
- 緩和策: required inputs、fail-closed rule、operator-managed step の 3 点に限定する
- ロールバック手順: scope が広がった場合は gate snapshot と blocked condition だけを残し、implementation detail は follow-on issue へ分離する
```

## Tasks

- [x] production readiness gate の required inputs を固定する
- [x] fail-closed condition を workflow と production seed に反映する
- [x] operator-managed production step の境界を整理する
- [x] production gate baseline の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] production readiness gate の required inputs と blocked condition が repeatable に参照できる
- [x] operator-managed step と workflow 非対象の境界が説明されている
- [x] production workflow や production infra wiring を本 issue のスコープ外として維持できている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [/.github/workflows/README.md](.github/workflows/README.md) に production readiness gate section を追加し、production promotion 前提、未解決 blocker、operator-managed external DNS / certificate step を workflow documentation から読めるようにした
- [infra/environments/production/README.md](infra/environments/production/README.md) に gate snapshot、fail-closed rule、gate closure 後に期待される operator step を追加し、production seed directory の役割を placeholder のまま明確化した
- [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) に required inputs、blocked condition、非対象を記録し、production-specific approval gate の baseline issue として残した

## Current Review Notes

- production gate baseline は production workflow 実装ではなく documentation hardening に限定しており、state locking と monthly cost ceiling が未決の間は repo が staging で止まる方針を維持している
- required inputs は Issue 10 の production promotion preconditions と、Issue 27 までで整えた artifact retention / rollback evidence を接続する最小セットに留めている
- external DNS cutover と certificate validation は workflow 完結ではなく operator-managed step として明示し、production の責務境界を曖昧にしないようにした
- production deploy workflow、production OpenTofu wiring、cost ceiling の決定、state locking 方式の決定は本 issue に含めていない

## Spot Check Evidence

Issue 28 の final review 前に、production readiness gate baseline が想定どおり整理されているかを spot check した結果を残す。

- workflow gate wording: [/.github/workflows/README.md](.github/workflows/README.md) は required preconditions、current unresolved blockers、operator-managed cutover boundary を production readiness gate section として保持する
- production seed guardrail: [infra/environments/production/README.md](infra/environments/production/README.md) は gate snapshot、fail-closed rule、expected operator step を一か所で説明する
- blocked condition clarity: [infra/environments/production/README.md](infra/environments/production/README.md) は monthly cost ceiling と state locking が未解決の間は production wiring と workflow を追加しないことを明示する
- scope control: [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) は production workflow と production infra wiring を非対象として維持する

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 28 final review, the local issue record is the primary evidence source. [/.github/workflows/README.md](.github/workflows/README.md) provides the workflow-facing gate wording, while [infra/environments/production/README.md](infra/environments/production/README.md) provides the production seed guardrail and operator-step wording.

### Task Mapping

| Checklist item                                                    | Primary evidence section                                                                                                                                                                                                           | Why this is the evidence                                                                                                             | Review state              |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `production readiness gate の required inputs を固定する`         | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)         | These sources show the minimum production preconditions and current decision snapshot are now documented together.                   | Accepted for final review |
| `fail-closed condition を workflow と production seed に反映する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)         | These sources show unresolved cost ceiling and state locking keep the repository blocked from production automation and wiring.      | Accepted for final review |
| `operator-managed production step の境界を整理する`               | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)         | These sources show DNS, certificate, approval, and verification remain explicit operator-managed work rather than hidden automation. | Accepted for final review |
| `production gate baseline の根拠と非対象を issue 記録へ残す`      | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) | These sections keep both the gate baseline and the excluded production implementation work in one issue record.                      | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                 | Primary evidence section                                                                                                                                                                                                               | Why this is the evidence                                                                                             | Review state              |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `production readiness gate の required inputs と blocked condition が repeatable に参照できる` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)             | These sources show the required inputs and current blockers are documented in both workflow and production contexts. | Accepted for final review |
| `operator-managed step と workflow 非対象の境界が説明されている`                               | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md)             | These sources show which production actions remain manual and why they are outside current workflow automation.      | Accepted for final review |
| `production workflow や production infra wiring を本 issue のスコープ外として維持できている`   | `Task Contract`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md)                             | These sections keep implementation work out of scope while preserving the gate baseline.                             | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                            | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) | These sections preserve the scope, validation path, and evidence basis for the production gate work.                 | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md), with [infra/environments/production/README.md](infra/environments/production/README.md) used as the primary production guardrail evidence and [/.github/workflows/README.md](.github/workflows/README.md) used as supporting evidence for workflow-facing gate wording.

| Checklist area              | Final judgment | Evidence basis                                                                                                                                                                                                                                                                |
| --------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required inputs             | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm the production gate inputs are documented. |
| Fail-closed blocker clarity | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [infra/environments/production/README.md](infra/environments/production/README.md) confirm unresolved cost ceiling and state locking keep production blocked.                                      |
| Operator step boundary      | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm operator-managed steps remain explicit.    |
| Scope control               | Satisfied      | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) confirm production implementation stays out of scope.                                     |
| Traceability                | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-28-production-readiness-gate-baseline.md](docs/portal/issues/issue-28-production-readiness-gate-baseline.md) confirm the issue record tracks scope. |

## Process Review Notes

- Issue 28 は Issue 10 の production precondition と Issue 15 の第五段階 backlog を接続し、production 実装開始条件を fail-closed に保つための documentation baseline として整理した。
- explicit close approval は未受領であるため、本 issue は implementation complete かつ review-ready だが close は未実施である。
- 2026-03-08: repository owner より explicit close approval を受領。問題なしと合意。CLOSED に移行した。

## Current Status

- [/.github/workflows/README.md](.github/workflows/README.md) は production readiness gate の前提と blocker を説明する
- [infra/environments/production/README.md](infra/environments/production/README.md) は production seed directory の fail-closed rule と operator step を説明する
- **CLOSED** — 2026-03-08 に repository owner の close approval を受領し、クローズ済み

## Dependencies

- Issue 10
- Issue 15
- Issue 27
