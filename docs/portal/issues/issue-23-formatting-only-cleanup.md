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

- [ ] apps/portal-web/tsconfig.json の差分が formatting-only であることを確認する
- [ ] docs/portal 3 ファイルの差分が末尾改行のみであることを確認する
- [ ] 対象 4 ファイルを cleanup scope として issue 記録に残す
- [ ] final review で使う確認観点を issue 記録に残す

## Definition of Done

- [ ] apps/portal-web/tsconfig.json の値変更が含まれていない
- [ ] docs/portal 3 ファイルに文章内容変更が含まれていない
- [ ] 本 issue ファイルが対象 4 ファイルと検証方針を追跡できる状態になっている
- [ ] formatting-only cleanup を他 issue から独立して読める

## Current Status

- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json) は配列表記の折り返しと末尾改行追加のみの未コミット差分がある
- [docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は末尾改行追加のみの未コミット差分がある
- open GitHub issues は現時点で存在せず、本件は formatting-only cleanup の独立 issue 候補である

## Dependencies

- Issue 22