## Summary

formatting-only の差分が作業対象の issue と混在したままだと、意味変更の有無と close 判断の境界が読み取りにくくなる。

## Goal

残っている formatting-only 変更を独立した cleanup issue として切り出し、意味変更を伴わない整形差分として整理する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-23
- タイトル: formatting-only cleanup を独立整理する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web/docs
- 対象環境: repository documentation and config formatting
- 優先度: 低
- 先行条件: Issue 22 closed

目的
- 解決する問題: formatting-only の差分が未整理のまま残ると、意味変更を含む作業との差分境界が曖昧になる
- 期待する価値: tsconfig の配列表記整形と portal docs の末尾改行差分を独立整理し、意味変更なしの cleanup として扱える

スコープ
- 含むもの: apps/portal-web/tsconfig.json の配列表記整形、docs/portal/15_TEST_STRATEGY_DRAFT.md の末尾改行、docs/portal/16_ROLLBACK_POLICY_DRAFT.md の末尾改行、docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md の末尾改行、issue 記録への根拠整理
- 含まないもの: 設定値変更、文章内容変更、新しい docs 決定、portal-web 実装変更
- 編集可能パス: apps/portal-web/tsconfig.json, docs/portal/15_TEST_STRATEGY_DRAFT.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md, docs/portal/issues/issue-23-formatting-only-cleanup.md
- 制限パス: apps/portal-web/src/, infra/, docs/portal/issues/issue-22-portal-web-readme-route-card-links.md

受け入れ条件
- [ ] 条件 1: 対象 4 ファイルの差分が formatting-only change として説明できる
- [ ] 条件 2: issue 記録から変更対象と非対象を追跡できる
- [ ] 条件 3: 値や文章意味の変更を含まないことを review 観点として残せる

実装計画
- 変更見込みファイル: apps/portal-web/tsconfig.json, docs/portal/15_TEST_STRATEGY_DRAFT.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md, docs/portal/issues/issue-23-formatting-only-cleanup.md
- アプローチ: 既存差分を formatting-only cleanup として切り出し、tsconfig は配列表記の折り返し、portal docs は末尾改行追加として最小差分で扱う
- 採用しなかった代替案と理由: これらの差分を他 issue に吸収する案は、意味変更の review と formatting-only cleanup が混ざるため採らない

検証計画
- 実行するテスト: read-through review of diffs; get_errors on edited files
- 確認するログ/メトリクス: no semantic drift in docs wording; tsconfig values unchanged
- 失敗時の切り分け経路: 値や文章変更が見つかった場合は formatting-only cleanup から外し、別 issue として切り分ける

リスクとロールバック
- 主なリスク: formatting-only と見なした差分に意味変更が混入していること
- 影響範囲: review readability, audit trail, config diff interpretation
- 緩和策: 差分の説明を配列表記整形と末尾改行追加に限定し、意味変更の有無を final review で明示確認する
- ロールバック手順: semantic drift が見つかった場合は該当ファイルを cleanup から外し、残りのみで再整理する
```

## Tasks

- [x] apps/portal-web/tsconfig.json の差分が formatting-only であることを確認する
- [x] docs/portal 3 ファイルの差分が末尾改行のみであることを確認する
- [x] 対象 4 ファイルを cleanup scope として issue 記録に残す
- [x] final review で使う確認観点を issue 記録に残す

## Definition of Done

- [x] apps/portal-web/tsconfig.json の値変更が含まれていない
- [x] docs/portal 3 ファイルに文章内容変更が含まれていない
- [x] 本 issue ファイルが対象 4 ファイルと検証方針を追跡できる状態になっている
- [x] formatting-only cleanup を他 issue から独立して読める

## Implementation Notes

現時点の実装記録は次の通り。

- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) は `lib`、`types`、`include` の配列表記を複数行へ折り返しただけで、値そのものは変更していない
- [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) はいずれも末尾改行追加のみで、Decision Statement の文章内容は変更していない
- 本 issue 記録では対象 4 ファイルを formatting-only cleanup scope として固定し、意味変更のない差分として扱えるようにした

## Current Review Notes

- tsconfig 側の差分は JSON 配列の折り返しだけで、target、module、types、include paths などの設定値に semantic change はない
- portal docs 側の差分は各ファイル末尾の newline 追加のみで、Decision Statement 本文の語句変更は入っていない
- formatting-only cleanup を独立 issue に切り出したため、意味変更のある作業との差分境界を明確に保てている

## Spot Check Evidence

Issue 23 の final review 前に、対象差分が formatting-only に留まっているかを spot check した結果を残す。

- tsconfig formatting: [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) は `lib`、`types`、`include` の配列表示を折り返しただけで、要素内容は元と同一である
- test strategy newline only: [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md) は末尾改行追加のみで、Decision Statement の文章内容は不変である
- rollback policy newline only: [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) は末尾改行追加のみで、Decision Statement の文章内容は不変である
- implementation backlog newline only: [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は末尾改行追加のみで、Decision Statement の文章内容は不変である
- diagnostics: [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md)、[docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 23 final review, the local issue record is the primary evidence source. [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) provides the config-formatting evidence, and [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md), and [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) provide the newline-only evidence.

### Task Mapping

| Checklist item                                                                | Primary evidence section                                                                                                                                                                                                                                                                                                                        | Why this is the evidence                                                                                | Review state              |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------- |
| `apps/portal-web/tsconfig.json の差分が formatting-only であることを確認する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)                                                                                                                                                                                                       | These sources show the tsconfig diff only reflows array formatting and preserves all existing values.   | Accepted for final review |
| `docs/portal 3 ファイルの差分が末尾改行のみであることを確認する`              | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md), and [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) | These sources show the three portal docs only gained a trailing newline and did not change any wording. | Accepted for final review |
| `対象 4 ファイルを cleanup scope として issue 記録に残す`                     | `Implementation Notes`, `Current Status`, and [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md)                                                                                                                                                                                  | These sections explicitly fix the cleanup scope to the four formatting-only files.                      | Accepted for final review |
| `final review で使う確認観点を issue 記録に残す`                              | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md)                                                                                                                                                    | These sections preserve the semantic-drift check and formatting-only review criteria.                   | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                             | Primary evidence section                                                                                                                                                                                                                                                                                                                        | Why this is the evidence                                                                                     | Review state              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `apps/portal-web/tsconfig.json の値変更が含まれていない`                   | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)                                                                                                                                                                                                       | These sources confirm the tsconfig values are unchanged and only the presentation of arrays was reformatted. | Accepted for final review |
| `docs/portal 3 ファイルに文章内容変更が含まれていない`                     | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md), and [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) | These sources confirm each portal doc change is newline-only and leaves the decision text untouched.         | Accepted for final review |
| `本 issue ファイルが対象 4 ファイルと検証方針を追跡できる状態になっている` | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md)                                                                                                                                | These sections keep the cleanup scope and validation basis in a single issue record.                         | Accepted for final review |
| `formatting-only cleanup を他 issue から独立して読める`                    | `Task Contract`, `Current Review Notes`, `Current Status`, and [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md)                                                                                                                                                                 | These sections isolate the cleanup from implementation or policy changes handled in other issues.            | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md), with [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) used as the config-formatting evidence and [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md), and [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) used as the newline-only evidence.

| Checklist area          | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| tsconfig formatting     | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) confirm the diff only reformats arrays and preserves the existing values.                                                                                                                                                                        |
| Docs newline-only scope | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md), [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md), and [docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) confirm the docs changes are newline-only. |
| Scope control           | Satisfied      | `Implementation Notes`, `Current Status`, and [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md) confirm the cleanup is limited to the four formatting-only files.                                                                                                                                                           |
| Final review readiness  | Satisfied      | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-23-formatting-only-cleanup.md](docs/portal/issues/issue-23-formatting-only-cleanup.md) confirm the issue record now contains the required review checkpoints.                                                                                                                        |

## Process Review Notes

- 2026-03-08: repository owner から「CloudeSonnetとのレビューで問題ないことが確認できたのでクローズしてください。」という明示承認を受領した
- 2026-03-08: close 判断の根拠は `Final Review Result`、`Spot Check Evidence`、および [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) の formatting-only 確認に置く

## Current Status

- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) は配列表記の折り返しと末尾改行追加のみで、設定値変更を含まない
- [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は末尾改行追加のみで、文章内容変更を含まない
- 対象 5 ファイルに editor diagnostics は発生していない
- explicit close approval を記録済みであり、現時点の状態は close-ready である

## Dependencies

- Issue 22
