## Summary

Issue 18 で最小 smoke path は実装されたが、second wave として予定されていた test hardening を未起票のままにすると、route metadata validation、major flow automation、evidence collection の拡張が backlog 上で管理されない。

## Goal

route metadata validation、major flow test hardening、test evidence collection の最小実装を issue として固定し、Issue 13 と Issue 18 の境界を実装レベルで前進させる。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-24
- タイトル: test hardening baseline を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: local and staging validation
- 優先度: 中
- 先行条件: Issue 18 closed, Issue 23 closed

目的
- 解決する問題: current workflow には最低限の smoke path しかなく、route metadata validation や major flow confirmation の拡張が実装 issue として固定されていない
- 期待する価値: Issue 13 の test baseline を、route metadata、major flow、evidence collection を含む second-wave hardening として実装管理できる

スコープ
- 含むもの: route metadata validation の追加方針、major flow check の自動化拡張、test evidence collection の定型化、issue 記録への根拠整理
- 含まないもの: full E2E suite 導入、visual regression platform 導入、production promotion gate の変更
- 編集可能パス: apps/portal-web/package.json, apps/portal-web/src/main.ts, docs/portal/issues/issue-24-test-hardening-baseline.md
- 制限パス: infra/, closed issue records except explicit evidence references, production workflow design

受け入れ条件
- [ ] 条件 1: route metadata validation または major flow hardening の追加対象が明確化されている
- [ ] 条件 2: test evidence collection の保存先または参照経路が整理されている
- [ ] 条件 3: full E2E や production promotion depth を本 issue のスコープ外として維持できる

実装計画
- 変更見込みファイル: apps/portal-web/package.json, apps/portal-web/src/main.ts, docs/portal/issues/issue-24-test-hardening-baseline.md
- アプローチ: Issue 13 の test baseline と Issue 18 の smoke implementation を起点に、route metadata と major flow を small executable unit として拡張する
- 採用しなかった代替案と理由: E2E 製品選定や broad snapshot coverage を同時に進める案は、first-release hardening の粒度を超えて重くなるため採らない

検証計画
- 実行するテスト: targeted test command review; get_errors on edited files; local validation command selection
- 確認するログ/メトリクス: test command shape、route metadata coverage、major flow evidence path
- 失敗時の切り分け経路: apps/portal-web/package.json、apps/portal-web/src/main.ts、docs/portal/issues/issue-13-test-strategy.md、docs/portal/issues/issue-18-ci-staging-foundation.md を照合し、test baseline と current smoke path のどこが不足しているかを分ける

リスクとロールバック
- 主なリスク: test hardening に full E2E や snapshot 固定を混在させ、small executable unit ではなくなること
- 影響範囲: portal-web validation、release evidence、workflow runtime
- 緩和策: route metadata validation、major flow hardening、evidence collection の最小構成に限定する
- ロールバック手順: scope が広がった場合は route metadata validation を最優先に残し、他の拡張は follow-on issue へ再分離する
```

## Tasks

- [x] route metadata validation の対象を固定する
- [x] major flow hardening の追加対象を整理する
- [x] test evidence collection の定型化方針を整理する
- [x] test hardening の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] route metadata validation または equivalent structure check の対象が明示されている
- [x] major flow hardening の追加範囲が current smoke path と分離して説明されている
- [x] test evidence collection の参照経路が整理されている
- [x] full E2E や production promotion gate を本 issue のスコープ外として維持できている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [apps/portal-web/package.json](apps/portal-web/package.json) に `test:routes` と `test:baseline` を追加し、typecheck と route metadata validation を一つの repeatable baseline command として実行できるようにした
- [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) は route registry、navigation group、action link、BASE_URL round-trip を検証する `validateRouteMetadata` と `buildRouteValidationReport` を持つようにし、Node CLI から証跡を出せるようにした
- [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) は browser bootstrap を分離し、route metadata validation を browser 非依存で実行できる構造へ整理した

## Current Review Notes

- route metadata validation は full E2E ではなく、Issue 13 で優先対象とされた route registry、navigation data、public config/base path handling を small executable unit として切り出している
- major flow hardening は current smoke path の reachability 自体を置き換えず、Home、Overview、Guidance の metadata completeness と next-route integrity を pre-deploy 側で追加確認する形に留めている
- evidence path は `npm run test:baseline` の標準出力と build history に揃え、deploy execution record と分離した pre-deploy test evidence として扱えるようにした
- full E2E suite、visual regression、production promotion gate は本 issue に含めず、test baseline hardening の最小構成に留めている

## Spot Check Evidence

Issue 24 の final review 前に、test hardening baseline が想定どおり整理されているかを spot check した結果を残す。

- baseline command shape: [apps/portal-web/package.json](apps/portal-web/package.json) は `test:baseline` で `typecheck` と `test:routes` を連続実行し、pre-deploy validation の定型入口を提供している
- route validation report: `npm run test:baseline` は `Route validation baseline`、`Base path: /`、`Route definitions: 6`、`Required major-flow routes: /, /overview, /guidance`、`Result: passed`、`Issues: none` を出力した
- metadata coverage: [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) は required major-flow routes、navigation group membership、action link destination、BASE_URL round trip を検証対象にしている
- build compatibility: `npm run build` は 2026-03-08 セッションで成功し、validation 追加後も Vite build path が維持されている
- diagnostics: [apps/portal-web/package.json](apps/portal-web/package.json)、[apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)、[docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 24 final review, the local issue record is the primary evidence source. [apps/portal-web/package.json](apps/portal-web/package.json) provides the repeatable validation entrypoint, while [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) provides the route metadata validation implementation and browser/base-path compatibility handling.

### Task Mapping

| Checklist item                                     | Primary evidence section                                                                                                                                                                                                            | Why this is the evidence                                                                                                               | Review state              |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `route metadata validation の対象を固定する`       | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                               | These sources show the validation covers route registry, navigation links, action links, and base-path round-trip behavior.            | Accepted for final review |
| `major flow hardening の追加対象を整理する`        | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sources show major-flow hardening is focused on Home, Overview, and Guidance structure rather than deep end-to-end interaction.  | Accepted for final review |
| `test evidence collection の定型化方針を整理する`  | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/package.json](apps/portal-web/package.json)                                                                                             | These sources show `npm run test:baseline` is the repeatable evidence path for pre-deploy validation output.                           | Accepted for final review |
| `test hardening の根拠と非対象を issue 記録へ残す` | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md)                        | These sections keep both the selected baseline hardening work and the excluded full-E2E and promotion-gate topics in one issue record. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                       | Primary evidence section                                                                                                                                                                                                            | Why this is the evidence                                                                                           | Review state              |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `route metadata validation または equivalent structure check の対象が明示されている` | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                                                       | These sources show the concrete route metadata and structure checks included in the baseline.                      | Accepted for final review |
| `major flow hardening の追加範囲が current smoke path と分離して説明されている`      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) | These sources show major-flow structure validation supplements current smoke checks rather than replacing them.    | Accepted for final review |
| `test evidence collection の参照経路が整理されている`                                | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/package.json](apps/portal-web/package.json)                                                                                             | These sources show `npm run test:baseline` is the operator-facing command for collecting pre-deploy test evidence. | Accepted for final review |
| `full E2E や production promotion gate を本 issue のスコープ外として維持できている`  | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md)                                                                       | These sections keep deep E2E and promotion policy work outside this issue's scope.                                 | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                  | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md)                    | These sections preserve the scope, validation path, and evidence basis for the test hardening work.                | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md), with [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) used as the primary implementation evidence and [apps/portal-web/package.json](apps/portal-web/package.json) used as supporting evidence for the repeatable validation command.

| Checklist area             | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                        |
| -------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route metadata validation  | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) confirm the route registry, navigation, action link, and base-path checks are implemented.                                                                                      |
| Major flow hardening scope | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and [docs/portal/issues/issue-13-test-strategy.md](docs/portal/issues/issue-13-test-strategy.md) confirm Home, Overview, and Guidance structure are the targeted major-flow layer. |
| Evidence collection path   | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [apps/portal-web/package.json](apps/portal-web/package.json) confirm `npm run test:baseline` is the repeatable pre-deploy evidence path.                                                                                                   |
| Scope control              | Satisfied      | `Task Contract`, `Current Review Notes`, and [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md) confirm full E2E and production promotion concerns remain excluded.                                                                                     |
| Traceability               | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-24-test-hardening-baseline.md](docs/portal/issues/issue-24-test-hardening-baseline.md) confirm the issue record tracks the edited files and review basis.                                   |

## Process Review Notes

- Issue 24 は Issue 13 の test baseline を、Issue 18 の staging smoke path と両立する pre-deploy validation layer として実装し、route metadata と base-path handling を small-team 向けの最小 hardening 単位に整理した。
- CloudSonnet review 完了と repository owner の close approval を受領したため、本 issue を closed へ移行する。

## Current Status

- [apps/portal-web/package.json](apps/portal-web/package.json) は `test:routes` と `test:baseline` を持つ
- [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) は browser-safe bootstrap と route metadata validation CLI を持つ
- `npm run test:baseline` と `npm run build` は 2026-03-08 セッションで成功した
- CloudSonnet review と close approval 反映により、現時点の状態は closed である

## Dependencies

- Issue 13
- Issue 15
- Issue 18
- Issue 23
