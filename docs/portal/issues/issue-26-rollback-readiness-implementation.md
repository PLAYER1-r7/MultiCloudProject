## Summary

rollback baseline は planning として整理済みだが、deployable staging path 完成後の second wave として artifact restore、operator verification、rollback evidence を実装タスクへ落とし込まないと、復旧判断の準備が計画止まりになる。

## Goal

artifact rollback target、operator verification checklist、rollback evidence path の最小実装を issue として固定し、Issue 14 と Issue 18 の接続を実作業単位へ進める。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-26
- タイトル: rollback readiness を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first operations
- 優先度: 中
- 先行条件: Issue 18 closed, Issue 23 closed

目的
- 解決する問題: rollback baseline が planning issue のままだと、artifact restore target、operator verification、recovery evidence の扱いが実行時に曖昧になる
- 期待する価値: Issue 14 の rollback policy を、artifact handoff と post-deploy verification を持つ現在の staging path に接続した実装単位として管理できる

スコープ
- 含むもの: last known-good artifact の扱い整理、rollback verification checklist の明文化、operator-facing rollback evidence path の整理、issue 記録への根拠整理
- 含まないもの: production DNS cutover rollback の実運用、自動 rollback 実装、state locking 未決を伴う production apply path の解消
- 編集可能パス: .github/workflows/README.md, infra/environments/staging/README.md, docs/portal/issues/issue-26-rollback-readiness-implementation.md
- 制限パス: infra/environments/production/, closed issue records except explicit evidence references, apps/portal-web/src/

受け入れ条件
- [ ] 条件 1: artifact rollback target と verification checklist の最小単位が文書から読める
- [ ] 条件 2: rollback evidence path と operator action が無理なく追跡できる
- [ ] 条件 3: production-specific rollback 未決事項を本 issue に混ぜない

実装計画
- 変更見込みファイル: .github/workflows/README.md, infra/environments/staging/README.md, docs/portal/issues/issue-26-rollback-readiness-implementation.md
- アプローチ: Issue 14 の rollback baseline と Issue 18 の artifact handoff を接続し、small-team で実行可能な rollback readiness を最小差分で整理する
- 採用しなかった代替案と理由: production rollback runbook を同時に詳細化する案は、state locking や external DNS の未決事項と衝突するため採らない

検証計画
- 実行するテスト: markdown review of rollback steps; get_errors on edited files
- 確認するログ/メトリクス: rollback target wording、operator verification checklist、artifact evidence path
- 失敗時の切り分け経路: .github/workflows/README.md、infra/environments/staging/README.md、docs/portal/issues/issue-14-rollback-policy.md、docs/portal/issues/issue-18-ci-staging-foundation.md を照合し、artifact rollback と operator evidence のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: rollback readiness の名目で production 固有の未決事項や自動 rollback 前提を混入させること
- 影響範囲: staging operations、release evidence、future production gate
- 緩和策: last known-good artifact、verification checklist、operator evidence path の最小構成に限定する
- ロールバック手順: scope が過大になった場合は artifact rollback target と verification checklist だけを残し、残りは別 issue に切り出す
```

## Tasks

- [x] last known-good artifact の扱いを staging operations 文脈で整理する
- [x] rollback verification checklist の最小項目を整理する
- [x] rollback evidence path と operator action を文書へ反映する
- [x] rollback readiness の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] artifact rollback target と verification checklist が同じ文脈で参照できる
- [x] operator-facing rollback evidence path が説明されている
- [x] staging-first の rollback readiness と production-specific rollback 未決事項が分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [/.github/workflows/README.md](.github/workflows/README.md) に staging-first rollback target、rollback evidence path、staging rollback baseline の責務境界を追記し、production-specific rollback 未決事項を本 issue のスコープ外として明示した
- [infra/environments/staging/README.md](infra/environments/staging/README.md) に last known-good artifact の扱い、operator-driven restore path、step summary と `portal-staging-monitoring-record` artifact を中心にした evidence path を追記した
- [infra/environments/staging/README.md](infra/environments/staging/README.md) に `/`、`/overview`、`/guidance` を使う rollback verification checklist を追加し、Issue 18 と Issue 25 の staging verification path を rollback readiness に接続した

## Current Review Notes

- rollback readiness は automation 追加ではなく operator-facing documentation の整備に絞り、Issue 14 で整理した artifact rollback unit と post-rollback verification を staging-first の現在地へ接続している
- rollback target は new build 再生成ではなく last known-good artifact に固定し、incident 時に未検証 build を混ぜない方針を保っている
- rollback evidence path は GitHub Actions run URL、step summary、`portal-staging-monitoring-record` artifact の 3 点に揃え、deploy と rollback のレビュー経路を分断しないようにした
- production DNS cutover rollback、自動 rollback、state locking 未決の解消は本 issue に入れず、staging-first rollback readiness の最小構成に留めている

## Spot Check Evidence

Issue 26 の final review 前に、rollback readiness が想定どおり整理されているかを spot check した結果を残す。

- rollback target wording: [/.github/workflows/README.md](.github/workflows/README.md) は staging-first rollback target を `portal-build` 由来の last known-good artifact として説明している
- checklist co-location: [infra/environments/staging/README.md](infra/environments/staging/README.md) は rollback target、restore path、evidence path、verification checklist を同じ section に保持している
- operator evidence path: [infra/environments/staging/README.md](infra/environments/staging/README.md) と [/.github/workflows/README.md](.github/workflows/README.md) は GitHub Actions run URL、step summary、`portal-staging-monitoring-record` artifact を rollback evidence の参照経路として揃えている
- staging-first scope control: [/.github/workflows/README.md](.github/workflows/README.md) は production DNS rollback、production rollback automation、state-locking resolution を staging rollback readiness baseline から外している
- diagnostics: [/.github/workflows/README.md](.github/workflows/README.md)、[infra/environments/staging/README.md](infra/environments/staging/README.md)、[docs/portal/issues/issue-26-rollback-readiness-implementation.md](docs/portal/issues/issue-26-rollback-readiness-implementation.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 26 final review, the local issue record is the primary evidence source. [/.github/workflows/README.md](.github/workflows/README.md) provides workflow-facing rollback boundary and evidence wording, while [infra/environments/staging/README.md](infra/environments/staging/README.md) provides the staging operator checklist and artifact restore context.

### Task Mapping

| Checklist item                                                        | Primary evidence section                                                                                                                                                                                                         | Why this is the evidence                                                                                                | Review state              |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `last known-good artifact の扱いを staging operations 文脈で整理する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                                          | These sources show the rollback target is the previously validated staging artifact rather than a fresh rebuild.        | Accepted for final review |
| `rollback verification checklist の最小項目を整理する`                | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                                                                  | These sources show the checklist items for bucket sync, optional invalidation, route verification, and evidence review. | Accepted for final review |
| `rollback evidence path と operator action を文書へ反映する`          | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/staging/README.md](infra/environments/staging/README.md)             | These sources show the operator-facing rollback path and the evidence sources attached to a rollback run.               | Accepted for final review |
| `rollback readiness の根拠と非対象を issue 記録へ残す`                | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-26-rollback-readiness-implementation.md](docs/portal/issues/issue-26-rollback-readiness-implementation.md) | These sections keep both the staging rollback baseline and the excluded production-specific topics in one issue record. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                 | Primary evidence section                                                                                                                                                                                                             | Why this is the evidence                                                                                                          | Review state              |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `artifact rollback target と verification checklist が同じ文脈で参照できる`                    | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                                                                      | These sources show the rollback target, restore path, and verification checklist are documented together for operators.           | Accepted for final review |
| `operator-facing rollback evidence path が説明されている`                                      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/staging/README.md](infra/environments/staging/README.md)                 | These sources show operators should use the Actions run URL, step summary, and monitoring artifact as the rollback evidence path. | Accepted for final review |
| `staging-first の rollback readiness と production-specific rollback 未決事項が分離されている` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md)                                                                                               | These sources keep production DNS rollback, automation depth, and state-locking concerns outside this issue's scope.              | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                            | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-26-rollback-readiness-implementation.md](docs/portal/issues/issue-26-rollback-readiness-implementation.md) | These sections preserve the scope, validation path, and evidence basis for the rollback readiness work.                           | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-26-rollback-readiness-implementation.md](docs/portal/issues/issue-26-rollback-readiness-implementation.md), with [infra/environments/staging/README.md](infra/environments/staging/README.md) used as the primary operator-facing implementation evidence and [/.github/workflows/README.md](.github/workflows/README.md) used as supporting evidence for workflow boundary and rollback evidence wording.

| Checklist area           | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                               |
| ------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artifact rollback target | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm the rollback unit is the last known-good staging artifact.                                                                                                   |
| Verification checklist   | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm operators have a minimum rollback verification checklist tied to the restore path.                                                                                                   |
| Operator evidence path   | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/README.md](.github/workflows/README.md), and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm rollback evidence stays attached to the Actions run URL, step summary, and monitoring artifact. |
| Scope control            | Satisfied      | `Task Contract`, `Current Review Notes`, and [/.github/workflows/README.md](.github/workflows/README.md) confirm production rollback-specific unresolved topics remain excluded.                                                                                                                                             |
| Traceability             | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-26-rollback-readiness-implementation.md](docs/portal/issues/issue-26-rollback-readiness-implementation.md) confirm the issue record tracks edited files and validation basis.                      |

## Process Review Notes

- Issue 26 は Issue 14 の rollback baseline を、Issue 18 と Issue 25 でできた staging artifact handoff と monitoring evidence に接続し、small-team で実行可能な rollback readiness の最小単位として整理した。
- CloudSonnet review 完了と repository owner の close approval を受領したため、本 issue を closed へ移行する。

## Current Status

- [/.github/workflows/README.md](.github/workflows/README.md) は staging rollback target、rollback evidence path、production-specific rollback 非対象を説明する状態へ更新された
- [infra/environments/staging/README.md](infra/environments/staging/README.md) は last known-good artifact、verification checklist、operator action 境界を含む
- 対象 3 ファイルに editor diagnostics は発生していない
- CloudSonnet review と close approval 反映により、現時点の状態は closed である

## Dependencies

- Issue 14
- Issue 15
- Issue 18
- Issue 23
