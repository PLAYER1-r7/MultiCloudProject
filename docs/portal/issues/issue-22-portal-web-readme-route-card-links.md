## Summary

portal-web README に現在の route cards が何を指しているかの説明がないと、実装済みの導線と文書の対応関係を後から追いにくい。

## Goal

portal-web README に current route cards の参照先を明記し、現行実装の案内導線を README から読めるようにする。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-22
- タイトル: portal-web README に route card links の説明を追加する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: repository documentation
- 優先度: 低
- 先行条件: Issue 16 closed, current route cards implemented

目的
- 解決する問題: route cards がどの repository resources を指しているか README に残っていないため、現行 UI と repository navigation の対応が把握しづらい
- 期待する価値: README から route cards の役割と current references を把握でき、portal-web 配下のドキュメントとして最低限の自己説明性を持てる

スコープ
- 含むもの: portal-web README の Notes への説明追記、route cards が参照する resource 種別の明文化、issue 記録への根拠整理
- 含まないもの: route card 実装変更、リンク先の追加変更、tsconfig formatting-only change の取り込み、他の docs cleanup
- 編集可能パス: apps/portal-web/README.md, docs/portal/issues/issue-22-portal-web-readme-route-card-links.md
- 制限パス: apps/portal-web/src/, apps/portal-web/tsconfig.json, docs/portal/15_TEST_STRATEGY_DRAFT.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md

受け入れ条件
- [ ] 条件 1: portal-web README が current route cards の参照先種別を説明している
- [ ] 条件 2: issue 記録から変更対象と非対象を追跡できる
- [ ] 条件 3: 説明追記が実装変更を伴わない documentation update として読める

実装計画
- 変更見込みファイル: apps/portal-web/README.md, docs/portal/issues/issue-22-portal-web-readme-route-card-links.md
- アプローチ: README Notes に current route cards の direct links の説明を最小差分で追記し、issue 記録では scope boundary を明確に保つ
- 採用しなかった代替案と理由: portal-web 全体の README 改稿に広げる案は、この差分の目的に対して過剰で scope が広がるため採らない

検証計画
- 実行するテスト: read-through review of README wording; get_errors on edited markdown files
- 確認するログ/メトリクス: README wording matches the current route-card references without implying new implementation
- 失敗時の切り分け経路: README wording が実装変更を示唆している場合は、resource 種別だけを残す最小表現へ戻す

リスクとロールバック
- 主なリスク: README の説明が UI 実装範囲の変更と誤読されること
- 影響範囲: portal-web documentation, implementation onboarding
- 緩和策: current route cards の参照先種別のみを説明し、実装変更や新規リンク追加を示唆しない表現に限定する
- ロールバック手順: wording が過剰なら Notes の追記を削除して issue 記録だけを残し、より狭い表現で再編集する
```

## Tasks

- [ ] portal-web README の Notes に route cards の current references を追記する
- [ ] 追記が documentation-only change であることを issue 記録に残す
- [ ] スコープ外の formatting-only changes を除外対象として明記する
- [ ] final review で見る観点を issue 記録に残す

## Definition of Done

- [ ] portal-web README から route cards の参照先種別を読める
- [ ] route card 実装変更が含まれていないことを issue 記録で説明できる
- [ ] tsconfig と portal docs の formatting-only changes がスコープ外として分離されている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Current Status

- [apps/portal-web/README.md](apps/portal-web/README.md) に current route cards の direct links 説明を追記する未コミット差分がある
- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は formatting-only change として本 issue のスコープ外に置く
- open GitHub issues は現時点で存在せず、本件は次の独立 issue 候補として扱う

## Dependencies

- Issue 16
- Issue 21