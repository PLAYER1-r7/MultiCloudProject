## Summary

staging delivery path は成立したが、deployable staging path 完成後の second wave として予定されていた monitoring hardening が未起票のままだと、reachability 異常、smoke failure、運用通知経路の改善を継続作業として追跡しづらい。

## Goal

staging reachability automation、operator-facing execution record、notification ownership の最小実装を issue として固定し、Issue 12 と Issue 18 の方針を実装レベルへ落とし込む。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-25
- タイトル: staging monitoring hardening を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging
- 優先度: 中
- 先行条件: Issue 18 closed, Issue 23 closed

目的
- 解決する問題: staging deploy 後の監視強化が issue として切り出されていないと、reachability automation、notification ownership、operator record の改善が backlog 上で宙に浮く
- 期待する価値: deployable staging path 完成後の second-wave monitoring work を、Issue 12 の monitoring baseline と Issue 18 の workflow 実装に接続した実行単位として管理できる

スコープ
- 含むもの: staging reachability check の自動化強化、operator-facing execution record の明文化、notification owner と一次対応経路の実装整理、issue 記録への根拠整理
- 含まないもの: production alert tool 本導入、24x7 on-call 体制の構築、SLO/SLI 数値確定、production release gate の変更
- 編集可能パス: .github/workflows/portal-staging-deploy.yml, .github/workflows/README.md, docs/portal/issues/issue-25-staging-monitoring-hardening.md
- 制限パス: infra/environments/production/, apps/portal-web/src/, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: staging deploy 後の reachability と primary route health を repeatable に確認する仕組みが改善されている
- [ ] 条件 2: operator-facing execution record または notification ownership の扱いが workflow と補助文書から追跡できる
- [ ] 条件 3: 本 issue ファイルから monitoring hardening の対象、根拠、非対象が追跡できる

実装計画
- 変更見込みファイル: .github/workflows/portal-staging-deploy.yml, .github/workflows/README.md, docs/portal/issues/issue-25-staging-monitoring-hardening.md
- アプローチ: Issue 12 の monitoring baseline と Issue 18 の staging deploy path を起点に、staging reachability と operator-facing evidence を small executable unit として実装する
- 採用しなかった代替案と理由: production alert routing まで同一 issue に含める案は、staging-first の second-wave scope を超えて blast radius が広がるため採らない

検証計画
- 実行するテスト: workflow diagnostics review; staging reachability check review; get_errors on edited files
- 確認するログ/メトリクス: workflow step definition、operator-facing evidence path、notification ownership wording
- 失敗時の切り分け経路: .github/workflows/portal-staging-deploy.yml、.github/workflows/README.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-18-ci-staging-foundation.md を照合し、monitoring signal と workflow responsibility のどこが崩れているかを分ける

リスクとロールバック
- 主なリスク: monitoring hardening に production-specific alerting や未決の owner model を持ち込み、staging-first scope が崩れること
- 影響範囲: staging deploy workflow、release evidence、operator handoff
- 緩和策: reachability automation、execution record、notification ownership の最小構成に絞り、production alerting depth は別 issue に送る
- ロールバック手順: scope が広がりすぎた場合は reachability automation と evidence path だけを残し、通知統合は follow-on issue へ再分離する
```

## Tasks

- [x] staging reachability automation の改善対象を固定する
- [x] operator-facing execution record の扱いを workflow と文書へ反映する
- [x] notification owner と一次対応経路の表現を揃える
- [x] monitoring hardening の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] staging deploy 後の reachability と primary route health を確認する repeatable path が整理されている
- [x] operator-facing execution record の保存先または参照経路が説明されている
- [x] notification owner と一次対応経路が無人前提になっていない
- [x] production-specific alerting depth を本 issue のスコープ外として維持できている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は release owner を repository owner、deploy operator を triggering actor、notification route を Actions run URL から導出し、staging deploy 実行時に owner 情報を summary と monitoring record へ残せるようにした
- [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は `staging-monitoring-record.md` を毎回生成し、route ごとの HTTP status、expected marker、passed/failed 判定を `portal-staging-monitoring-record` artifact と step summary の両方へ出力するようにした
- [/.github/workflows/README.md](.github/workflows/README.md) には monitoring record artifact と、owner/notification route を built-in GitHub context から導出する運用前提を追記した

## Current Review Notes

- reachability hardening は既存 smoke path を置き換えるのではなく、HTTP status と expected marker を記録する evidence layer を足す形に限定しているため、Issue 18 の staging-first scope を壊していない
- operator-facing execution record は `GITHUB_STEP_SUMMARY` だけに依存せず artifact にも保存されるため、deploy 後レビューと後追い確認の両方に使える
- owner 情報は GitHub built-in context から導出し、record 上に default owner note を残すことで unattended triage を避ける運用前提を明示している
- production alerting depth や on-call 体制は本 issue に含めず、staging monitoring hardening の最小構成に留めている

## Spot Check Evidence

Issue 25 の final review 前に、staging monitoring hardening が想定どおり整理されているかを spot check した結果を残す。

- monitoring record artifact: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は `staging-monitoring-record.md` を生成し、`portal-staging-monitoring-record` artifact と step summary へ反映する
- primary route health record: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は `/`、`/overview`、`/guidance` の route ごとに HTTP status、expected marker、passed/failed 判定を表形式で記録する
- owner path wording: [/.github/workflows/README.md](.github/workflows/README.md) は release owner、deploy operator、notification route が GitHub context と run URL から導出されることを説明し、一次対応経路を workflow evidence と結び付けている
- unattended triage note: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は default owner note を monitoring record へ残し、一次対応経路の基準がこの run に紐付くことを evidence 上に見える化する
- diagnostics: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)、[/.github/workflows/README.md](.github/workflows/README.md)、[docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 25 final review, the local issue record is the primary evidence source. [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) provides the monitoring record implementation evidence, while [/.github/workflows/README.md](.github/workflows/README.md) provides the operator-facing input and handoff wording.

### Task Mapping

| Checklist item                                                        | Primary evidence section                                                                                                                                                                                                            | Why this is the evidence                                                                                                                                  | Review state              |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `staging reachability automation の改善対象を固定する`                | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)                                                              | These sources show the workflow now records route-by-route reachability and primary route health evidence instead of only performing silent smoke checks. | Accepted for final review |
| `operator-facing execution record の扱いを workflow と文書へ反映する` | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md)                         | These sources show the monitoring record artifact and README wording that explain where operators can find the execution evidence.                        | Accepted for final review |
| `notification owner と一次対応経路の表現を揃える`                     | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) | These sources show the derived owner fields, run URL notification route, and the note that keeps first response from becoming unowned.                    | Accepted for final review |
| `monitoring hardening の根拠と非対象を issue 記録へ残す`              | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md)              | These sections keep both the in-scope hardening work and the excluded production alerting depth in one issue record.                                      | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                         | Primary evidence section                                                                                                                                                                                                   | Why this is the evidence                                                                                         | Review state              |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `staging deploy 後の reachability と primary route health を確認する repeatable path が整理されている` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)                                                     | These sources show a repeatable monitoring record for the staging routes with explicit status and marker checks. | Accepted for final review |
| `operator-facing execution record の保存先または参照経路が説明されている`                              | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md)                | These sources show the execution record is stored as both a workflow artifact and a step summary entry.          | Accepted for final review |
| `notification owner と一次対応経路が無人前提になっていない`                                            | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md)                                                                                     | These sources show owner and notification route fields are surfaced explicitly instead of being left implicit.   | Accepted for final review |
| `production-specific alerting depth を本 issue のスコープ外として維持できている`                       | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md)                                                    | These sections keep production alert tooling and on-call depth out of scope for this second-wave staging issue.  | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                                    | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md) | These sections preserve the scope, validation path, and evidence basis for the hardening work.                   | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md), with [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) used as the primary implementation evidence and [/.github/workflows/README.md](.github/workflows/README.md) used as supporting evidence for operator-facing inputs and handoff wording.

| Checklist area                   | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                |
| -------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reachability evidence path       | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) confirm the workflow now records route-by-route reachability and primary route health.                                 |
| Operator-facing execution record | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) confirm the monitoring record is emitted as both artifact and summary.            |
| Owner and notification clarity   | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md) confirm owner and first response route fields are now explicit.                                                                                        |
| Scope control                    | Satisfied      | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md) confirm production alerting depth remains excluded.                                                                   |
| Traceability                     | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-25-staging-monitoring-hardening.md](docs/portal/issues/issue-25-staging-monitoring-hardening.md) confirm the issue record tracks the edited files and review basis. |

## Process Review Notes

- Issue 25 は Issue 12 の monitoring baseline と Issue 18 の staging deploy workflow を接続し、reachability evidence、operator-facing execution record、owner wording を second-wave hardening の最小単位として整理した。
- repository owner から close approval を受領し、CloudSonnet とのレビューでも blocking issue がないことを確認したため、本 issue を closed へ移行する。

## Current Status

- [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は monitoring record artifact、step summary、derived owner fields を持つ staging monitoring hardening state へ更新された
- [/.github/workflows/README.md](.github/workflows/README.md) は monitoring record artifact と owner / notification route input の説明を含む
- 対象 3 ファイルに editor diagnostics は発生していない
- CloudSonnet review と repository owner の close approval を踏まえ、現時点の状態は closed である

## Dependencies

- Issue 12
- Issue 15
- Issue 18
- Issue 23
