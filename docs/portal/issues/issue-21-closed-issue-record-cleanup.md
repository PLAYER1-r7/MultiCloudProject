## Summary

closed 済み issue の周辺文書に open 状態を前提にした文言や表記ゆれが残ると、監査経路と downstream reference の読み取りがぶれる。

## Goal

closed issue records と supporting docs の状態表記を現行状態に揃え、review table の可読性を整える。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-21
- タイトル: closed issue の状態表記を整合し review tables を整える
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal docs
- 対象環境: repository documentation
- 優先度: 中
- 先行条件: Issue 1 closed, Issue 12 closed, Issue 20 closed

目的
- 解決する問題: closed 済み issue の周辺文書に open 前提の文言や review table の読みにくさが残ると、完了済み判断と根拠参照が不安定になる
- 期待する価値: closed issue records と supporting docs を現行状態へ揃えることで、後続 issue が参照する evidence baseline を安定させる

スコープ
- 含むもの: Issue 1 関連文言の close 後整合、Issue 12 review table の可読性整理、closed issue state wording の是正
- 含まないもの: Issue 1 / 12 の結論変更、未完了 issue の再レビュー、新しい policy 決定の追加
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/issues/issue-01-product-definition.md, docs/portal/issues/issue-12-monitoring-policy.md, docs/portal/issues/issue-21-closed-issue-record-cleanup.md
- 制限パス: apps/, infra/, closed issue 以外の implementation records

受け入れ条件
- [ ] 条件 1: Issue 1 関連文書が closed 済み状態に合う文言へ更新されている
- [ ] 条件 2: Issue 12 の review table が意味変更なしに読みやすい表記へ整形されている
- [ ] 条件 3: local issue record で変更対象、根拠、review 方針を追跡できる

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/issues/issue-01-product-definition.md, docs/portal/issues/issue-12-monitoring-policy.md, docs/portal/issues/issue-21-closed-issue-record-cleanup.md
- アプローチ: close 済み issue の周辺文書に残る open 前提表現を実際の完了状態へ合わせ、Issue 12 は review table の幅と整列のみを調整して意味変更を避ける
- 採用しなかった代替案と理由: formatting-only changes と wording updates を分離する案は、いずれも closed issue record cleanup という単一目的に対して分割コストが高いため採らない

検証計画
- 実行するテスト: read-through review of edited docs; get_errors on edited markdown files
- 確認するログ/メトリクス: wording consistency between Issue 1 supporting doc and issue record; no semantic drift in Issue 12 review tables
- 失敗時の切り分け経路: Issue 1 は docs/portal/03_PRODUCT_DEFINITION_DRAFT.md を primary evidence として照合し、Issue 12 は table formatting が内容変更を含んでいないか diff で見直す

リスクとロールバック
- 主なリスク: cleanup の範囲で意味変更まで混入し、closed issue の確定内容を意図せず書き換えること
- 影響範囲: downstream issue references, issue audit trail, documentation readability
- 緩和策: wording updates は closed state への整合に限定し、Issue 12 は formatting-only の確認を明示する
- ロールバック手順: semantic drift が見つかった場合は cleanup 変更を戻し、closed issue record の最終確定文言に合わせて最小差分で再編集する
```

## Tasks

- [x] Issue 1 supporting doc の close 後文言を整える
- [x] Issue 1 issue record の current status を closed 状態に揃える
- [x] Issue 12 review tables を意味変更なしに整形する
- [x] cleanup 対象と非対象を issue 記録に残す
- [x] closed issue records の参照根拠を明示する
- [x] final review に使う確認観点を issue 記録へ残す

## Definition of Done

- [x] Issue 1 関連文書が closed 済み状態として読める
- [x] Issue 12 の table 整形が意味変更を含んでいない
- [x] cleanup 対象外のファイルがスコープから除外されている
- [x] local issue record が evidence source を示している
- [x] final review で使う確認観点が issue 記録に残っている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) では、Issue 1 の supporting doc に残っていた open 前提の文言を close 済み状態へ合わせ、accepted evidence baseline と completed final checkbox review の表現に更新した
- [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) の Current Status は、GitHub Issue 1 が close 済みである現行状態を直接示す文言へ更新した
- [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) では Task Mapping、Definition Of Done Mapping、Final Review Result の各 table を整形し、列幅を揃えて可読性を上げた
- cleanup の対象外として、[apps/portal-web/README.md](apps/portal-web/README.md)、[apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は本 issue のスコープから除外した

## Current Review Notes

- Issue 1 側の変更は closed 後の state alignment に限定しており、product definition の内容決定そのものは変更していない
- Issue 12 側の変更は table の桁揃えと折り返し調整が中心で、evidence source、review state、final judgment の意味内容は維持されている
- スコープ外の変更を明示的に除外したため、closed issue record cleanup と unrelated formatting changes が混ざらない状態を保てている

## Spot Check Evidence

Issue 21 の final review 前に、closed issue cleanup が想定どおり揃っているかを spot check した結果を残す。

- issue 1 supporting doc wording: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は accepted evidence baseline、completed final checkbox review、external visitor wording を現行状態に合わせている
- issue 1 current status: [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) は GitHub Issue 1 が close 済みであることを Current Status に明示している
- issue 12 task mapping readability: [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) の Task Mapping table は列幅が揃っており、各 evidence source と review state を追いやすい
- issue 12 dod mapping readability: [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) の Definition Of Done Mapping table も同じ形式に揃っている
- issue 12 final review readability: [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) の Final Review Result table は意味変更なしに読みやすく整形されている
- diagnostics: [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md)、[docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md)、[docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md)、[docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 21 final review, the local issue record is the primary evidence source. [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) and [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) provide the closed-state wording evidence for Issue 1, while [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) provides the table readability evidence for Issue 12.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `Issue 1 supporting doc の close 後文言を整える` | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) | These sources show the supporting product definition now describes Issue 1 as an accepted and completed baseline. | Accepted for final review |
| `Issue 1 issue record の current status を closed 状態に揃える` | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) | These sources show the issue record status wording now matches the already-closed GitHub issue. | Accepted for final review |
| `Issue 12 review tables を意味変更なしに整形する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sources show the tables were reformatted for readability without changing their evidence or judgments. | Accepted for final review |
| `cleanup 対象と非対象を issue 記録に残す` | `Implementation Notes` and [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections explicitly list both in-scope cleanup files and excluded unrelated files. | Accepted for final review |
| `closed issue records の参照根拠を明示する` | `Current Review Notes`, `Spot Check Evidence`, `Evidence Mapping Table`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md), and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sources establish the supporting docs and issue records used as final review evidence. | Accepted for final review |
| `final review に使う確認観点を issue 記録へ残す` | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections preserve the verification focus for state alignment and semantic-drift-free formatting. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `Issue 1 関連文書が closed 済み状態として読める` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md), and [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) | These sources confirm both the supporting doc and issue record now read as closed-state documentation. | Accepted for final review |
| `Issue 12 の table 整形が意味変更を含んでいない` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sources confirm the Issue 12 edits are readability-focused and preserve the original review meaning. | Accepted for final review |
| `cleanup 対象外のファイルがスコープから除外されている` | `Implementation Notes` and [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections explicitly exclude unrelated app and formatting-only files from this cleanup task. | Accepted for final review |
| `local issue record が evidence source を示している` | `Spot Check Evidence`, `Evidence Mapping Table`, and [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections identify the supporting docs and issue records used to validate the cleanup. | Accepted for final review |
| `final review で使う確認観点が issue 記録に残っている` | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections preserve the state-alignment and readability review criteria. | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている` | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) | These sections keep the cleanup scope, exclusions, and validation plan inside the issue record. | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md), with [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) and [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) used as the closed-state wording evidence for Issue 1, and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) used as the review-table readability evidence for Issue 12.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Issue 1 supporting doc alignment | Satisfied | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) confirm the supporting document now reflects closed-state wording. |
| Issue 1 issue record status alignment | Satisfied | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) confirm the current status wording now matches the closed GitHub issue. |
| Issue 12 table readability | Satisfied | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) confirm readability improvements without semantic drift. |
| Scope control | Satisfied | `Implementation Notes` in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) confirm unrelated app and formatting-only files remain excluded from this cleanup issue. |
| Evidence traceability | Satisfied | `Spot Check Evidence`, `Evidence Mapping Table`, and [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) confirm the evidence sources and review rationale are preserved. |
| Final review readiness | Satisfied | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-21-closed-issue-record-cleanup.md](docs/portal/issues/issue-21-closed-issue-record-cleanup.md) confirm the issue record now contains the required review checkpoints. |

## Current Status

- [docs/portal/03_PRODUCT_DEFINITION_DRAFT.md](docs/portal/03_PRODUCT_DEFINITION_DRAFT.md) は Issue 1 supporting doc の closed-state wording に揃っている
- [docs/portal/issues/issue-01-product-definition.md](docs/portal/issues/issue-01-product-definition.md) は GitHub Issue 1 の closed 状態を current status に反映している
- [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) は review tables の可読性を改善した表記に整っている
- [apps/portal-web/README.md](apps/portal-web/README.md)、[apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は本 issue のスコープ外として残している
- 対象 4 ファイルに editor diagnostics は発生していない
- explicit close approval はまだ記録していないため、現時点の状態は review-complete であり close-ready ではない

## Dependencies

- Issue 1
- Issue 12
- Issue 20
