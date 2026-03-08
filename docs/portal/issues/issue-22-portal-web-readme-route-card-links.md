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

- [x] portal-web README の Notes に route cards の current references を追記する
- [x] 追記が documentation-only change であることを issue 記録に残す
- [x] スコープ外の formatting-only changes を除外対象として明記する
- [x] final review で見る観点を issue 記録に残す

## Definition of Done

- [x] portal-web README から route cards の参照先種別を読める
- [x] route card 実装変更が含まれていないことを issue 記録で説明できる
- [x] tsconfig と portal docs の formatting-only changes がスコープ外として分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [apps/portal-web/README.md](apps/portal-web/README.md) の Notes に、current route cards が active GitHub project、issues、docs、workflow definitions への direct links を持つことを追記した
- README の追記は route cards 実装そのものを変更せず、既存 UI 導線が何を参照しているかを補足する documentation-only change に限定した
- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は formatting-only change のため、本 issue のスコープ外として維持した

## Current Review Notes

- README の新規文言は route cards の参照先種別だけを説明しており、新しい route 追加やリンク先変更を示していない
- portal-web 配下の README だけを編集対象に絞ったため、implementation change と documentation clarification が混ざらない
- formatting-only change を明示的に除外しているため、本 issue は README 説明更新の audit trail として読める

## Spot Check Evidence

Issue 22 の final review 前に、README wording とスコープ境界が想定どおりかを spot check した結果を残す。

- route card reference wording: [apps/portal-web/README.md](apps/portal-web/README.md) は current route cards が active GitHub project、issues、docs、workflow definitions を直接参照すると説明している
- documentation-only scope: [apps/portal-web/README.md](apps/portal-web/README.md) の差分は Notes の 1 行追加に留まり、route seed や commands を変更していない
- excluded formatting changes: [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は本 issue の対象外として維持している
- diagnostics: [apps/portal-web/README.md](apps/portal-web/README.md) と [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 22 final review, the local issue record is the primary evidence source. [apps/portal-web/README.md](apps/portal-web/README.md) provides the route-card reference wording evidence.

### Task Mapping

| Checklist item                                                               | Primary evidence section                                                                                                                                                                                           | Why this is the evidence                                                                                      | Review state              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `portal-web README の Notes に route cards の current references を追記する` | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/README.md](apps/portal-web/README.md)                                                                                                          | These sources show the README Notes now describe the resource categories targeted by the current route cards. | Accepted for final review |
| `追記が documentation-only change であることを issue 記録に残す`             | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md)  | These sections explain that the change documents existing navigation and does not alter implementation.       | Accepted for final review |
| `スコープ外の formatting-only changes を除外対象として明記する`              | `Implementation Notes`, `Current Status`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md)                               | These sections explicitly keep the unrelated formatting-only files out of scope.                              | Accepted for final review |
| `final review で見る観点を issue 記録に残す`                                 | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) | These sections preserve the review focus on wording scope and non-implementation drift.                       | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                        | Primary evidence section                                                                                                                                                                                                               | Why this is the evidence                                                                               | Review state              |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------- |
| `portal-web README から route cards の参照先種別を読める`                             | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/README.md](apps/portal-web/README.md)                                                                                                                              | These sources confirm the README now states what resource categories the current route cards point to. | Accepted for final review |
| `route card 実装変更が含まれていないことを issue 記録で説明できる`                    | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md)                      | These sections explain that the change is documentation-only and does not modify route-card behavior.  | Accepted for final review |
| `tsconfig と portal docs の formatting-only changes がスコープ外として分離されている` | `Implementation Notes`, `Current Status`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md)                                                   | These sections show the unrelated formatting changes are explicitly excluded from this issue.          | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                   | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) | These sections keep the README scope, exclusions, and validation basis inside the issue record.        | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md), with [apps/portal-web/README.md](apps/portal-web/README.md) used as the route-card reference wording evidence.

| Checklist area               | Final judgment | Evidence basis                                                                                                                                                                                                                                                                            |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route-card reference wording | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/README.md](apps/portal-web/README.md) confirm the README now describes the resource categories linked from current route cards.                                                                                       |
| Documentation-only scope     | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) confirm no implementation change is included.                           |
| Scope exclusion clarity      | Satisfied      | `Implementation Notes`, `Current Status`, and [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) confirm unrelated formatting-only files remain excluded.                                             |
| Final review readiness       | Satisfied      | `Current Review Notes`, `Spot Check Evidence`, and `Final Review Result` in [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) confirm the issue record now contains the required review checkpoints. |

## Process Review Notes

- 2026-03-08: repository owner から「CloudeSonnetで問題ないとかくにできたのでクローズしてください。」という明示承認を受領した
- close 判断の根拠は `Final Review Result`、`Spot Check Evidence`、および [apps/portal-web/README.md](apps/portal-web/README.md) の wording 確認に置く

## Current Status

- [apps/portal-web/README.md](apps/portal-web/README.md) に current route cards の direct links 説明を追記済みである
- [apps/portal-web/tsconfig.json](apps/portal-web/tsconfig.json)、[docs/portal/15_TEST_STRATEGY_DRAFT.md](docs/portal/15_TEST_STRATEGY_DRAFT.md)、[docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md)、[docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md](docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md) は formatting-only change として本 issue のスコープ外に置く
- [apps/portal-web/README.md](apps/portal-web/README.md) と [docs/portal/issues/issue-22-portal-web-readme-route-card-links.md](docs/portal/issues/issue-22-portal-web-readme-route-card-links.md) に editor diagnostics は発生していない
- explicit close approval を記録済みのため、現時点の状態は review-complete かつ close-ready である

## Dependencies

- Issue 16
- Issue 21
