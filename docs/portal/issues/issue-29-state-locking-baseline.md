## Summary

production gate の blocker のうち monthly cost ceiling は人の判断待ちだが、state locking は backend 戦略として選定と最小実装を進められる。ここを未決のまま残すと、production apply path を止める条件は説明できても、解除条件が repo 上に存在しない。

## Goal

OpenTofu S3 backend の native lockfile を state locking baseline として選定し、staging backend に最小実装を入れつつ、production gate 文書と policy 文書をその選定に追従させる。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-29
- タイトル: state locking baseline を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first infrastructure and production gate
- 優先度: 中
- 先行条件: Issue 20 closed, Issue 28 closed

目的
- 解決する問題: state locking が未決のままだと production gate の fail-closed 条件は維持できても、解除に必要な backend strategy と implementation baseline が repo 上に固定されない
- 期待する価値: native S3 lockfile を state locking baseline として選定し、staging backend で先に使い、production gate 文書もその戦略に揃えることで、production blocker を monthly cost ceiling など残存項目へ切り分けられる

スコープ
- 含むもの: staging backend への native S3 lockfile 追加、state locking strategy の文書更新、production gate wording の更新、issue 記録への根拠整理
- 含まないもの: production backend wiring の追加、monthly cost ceiling の決定、production deploy workflow の追加、DynamoDB lock table の導入
- 編集可能パス: infra/environments/staging/versions.tf, infra/environments/staging/README.md, infra/environments/production/README.md, .github/workflows/README.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, docs/portal/issues/issue-29-state-locking-baseline.md
- 制限パス: infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: selected state locking strategy が backend 設定と文書の両方から読める
- [ ] 条件 2: production gate の blocker が state locking 未決ではなく remaining unresolved items に整理される
- [ ] 条件 3: production backend wiring や production workflow を本 issue に混ぜない

実装計画
- 変更見込みファイル: infra/environments/staging/versions.tf, infra/environments/staging/README.md, infra/environments/production/README.md, .github/workflows/README.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, docs/portal/issues/issue-29-state-locking-baseline.md
- アプローチ: OpenTofu S3 backend の native lockfile を使い、DynamoDB を追加せずに current AWS baseline と整合する state locking strategy を最小差分で固定する
- 採用しなかった代替案と理由: DynamoDB lock table を同時導入する案は current AWS baseline の非採用判断と scope を広げるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: backend block wording、state locking strategy wording、production gate blocker wording
- 失敗時の切り分け経路: infra/environments/staging/versions.tf、infra/environments/staging/README.md、infra/environments/production/README.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、docs/portal/issues/issue-20-production-entry-guardrails.md、docs/portal/issues/issue-28-production-readiness-gate-baseline.md を照合し、state locking selection と gate wording のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: state locking baseline の名目で production backend wiring や DynamoDB 導入まで scope が膨らむこと
- 影響範囲: staging backend behavior、production gate wording、IaC policy wording
- 緩和策: native S3 lockfile selection と staging backend 反映に限定し、production wiring は deferred のまま保つ
- ロールバック手順: もし lock strategy が不適切と判明した場合は backend block から `use_lockfile` を外し、文書を unresolved state に戻して別 strategy issue に分離する
```

## Tasks

- [x] native S3 lockfile を state locking baseline として固定する
- [x] staging backend に state locking baseline を反映する
- [x] production gate と policy 文書の blocker wording を更新する
- [x] state locking baseline の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] selected state locking strategy が backend 設定と補助文書の両方から参照できる
- [x] production gate の blocked condition が remaining unresolved items に整理されている
- [x] production backend wiring と production workflow を本 issue のスコープ外として維持できている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf) に `use_lockfile = true` を追加し、staging backend で native S3 locking を有効化した
- [infra/environments/staging/README.md](infra/environments/staging/README.md) に selected locking baseline を追記し、DynamoDB lock table を追加しない current design と bucket versioning expectation を説明した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は state locking を未決事項ではなく selected strategy として更新し、production 側の remaining blockers を monthly cost guardrail などへ切り分けた
- [/.github/workflows/README.md](.github/workflows/README.md) と [infra/environments/production/README.md](infra/environments/production/README.md) は production gate wording を更新し、selected strategy はあるが production backend wiring は未実装であることを明示した

## Current Review Notes

- native S3 lockfile は current S3 backend に最小差分で入れられ、Issue 4 と Issue 7 で current baseline に含めていない DynamoDB を持ち込まない
- state locking の未決状態を解除しても production backend wiring 自体は追加していないため、production gate の fail-closed 方針は維持される
- remaining production blocker は monthly cost ceiling と production backend wiring / operator step 完了側に整理され、state locking decision の空白だけが埋まった構成になっている
- production backend settings、production workflow、monthly cost ceiling の決定は本 issue に含めていない

## Spot Check Evidence

Issue 29 の final review 前に、state locking baseline が想定どおり整理されているかを spot check した結果を残す。

- backend selection: [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf) は S3 backend に `use_lockfile = true` を持つ
- staging backend wording: [infra/environments/staging/README.md](infra/environments/staging/README.md) は native S3 state locking と versioning expectation を説明する
- policy wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は state locking を selected strategy として扱う
- production gate wording: [/.github/workflows/README.md](.github/workflows/README.md) と [infra/environments/production/README.md](infra/environments/production/README.md) は state locking 未決ではなく production wiring 未実装と monthly cost guardrail を blocker として扱う

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 29 final review, the local issue record is the primary evidence source. [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf) provides the backend implementation evidence, while [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) provide policy and gate wording evidence.

### Task Mapping

| Checklist item                                                | Primary evidence section                                                                                                                                                                                                                                                                               | Why this is the evidence                                                                                            | Review state              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `native S3 lockfile を state locking baseline として固定する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf), and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                  | These sources show the selected locking strategy is explicitly named and reflected in configuration.                | Accepted for final review |
| `staging backend に state locking baseline を反映する`        | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                                                      | These sources show staging now enables native S3 locking and documents how it is expected to behave.                | Accepted for final review |
| `production gate と policy 文書の blocker wording を更新する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show blockers now focus on remaining unresolved items rather than an undefined locking strategy.      | Accepted for final review |
| `state locking baseline の根拠と非対象を issue 記録へ残す`    | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md)                                                                                             | These sections keep both the selected baseline and the excluded production implementation work in one issue record. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                 | Primary evidence section                                                                                                                                                                                                                                                                               | Why this is the evidence                                                                                                            | Review state              |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `selected state locking strategy が backend 設定と補助文書の両方から参照できる`                | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                              | These sources show the strategy is implemented in backend config and documented in operator-facing text.                            | Accepted for final review |
| `production gate の blocked condition が remaining unresolved items に整理されている`          | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources show remaining blockers are now monthly cost guardrails and deferred production wiring rather than no locking choice. | Accepted for final review |
| `production backend wiring と production workflow を本 issue のスコープ外として維持できている` | `Task Contract`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md)                                                                                                                     | These sections keep production implementation work out of scope.                                                                    | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                            | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md)                                                                                         | These sections preserve the scope, validation path, and evidence basis for the locking work.                                        | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md), with [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf) used as the primary backend implementation evidence and [infra/environments/production/README.md](infra/environments/production/README.md) plus [/.github/workflows/README.md](.github/workflows/README.md) used as supporting evidence for production gate wording.

| Checklist area             | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locking strategy selection | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf), and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm native S3 lockfile is the selected baseline.                                                                              |
| Backend baseline           | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm staging backend uses and documents the selected locking baseline.                                                                             |
| Production gate wording    | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md), [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/production/README.md](infra/environments/production/README.md) confirm blockers are reframed around remaining unresolved items. |
| Scope control              | Satisfied      | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md) confirm production backend wiring and workflow work remain excluded.                                                                                                                                        |
| Traceability               | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-29-state-locking-baseline.md](docs/portal/issues/issue-29-state-locking-baseline.md) confirm the issue record tracks scope and evidence.                                                                                                      |

## Process Review Notes

- Issue 29 は Issue 20 と Issue 28 で残していた state locking blocker を、current S3 backend に沿った最小戦略として具体化する作業として整理した。
- 2026-03-08: repository owner によるレビューで問題なしの合意が得られたため、close approval を受領した。本 issue は CLOSED とする。

## Current Status

CLOSED

- [infra/environments/staging/versions.tf](infra/environments/staging/versions.tf) は native S3 locking baseline を有効化する
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) と [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) は state locking を selected strategy として扱う
- [infra/environments/production/README.md](infra/environments/production/README.md) と [/.github/workflows/README.md](.github/workflows/README.md) は remaining blockers を monthly cost ceiling と deferred production wiring へ整理する
- 2026-03-08: close approval 受領、CLOSED

## Dependencies

- Issue 20
- Issue 28
