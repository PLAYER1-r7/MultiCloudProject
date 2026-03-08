## Summary

実装物を継続的に検証して staging へ届けるには、build、validation、staging deploy の最小自動化が必要になる。

## Goal

portal 向けの CI と staging deploy の最小 workflow を実装する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-18
- タイトル: CI と staging deploy の最小 workflow を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first
- 優先度: 高

目的
- 解決する問題: build artifact、validation、staging deploy、post-deploy verification が分離されていないと、staging 到達判断と後続 production gate の責務が曖昧になる
- 期待する価値: portal-build と portal-staging-deploy の 2 workflow を通じて、artifact handoff、staging sync、post-deploy smoke、production 分離前提を持つ最小 delivery path を固定できる

スコープ
- 含むもの: build workflow、minimal validation、artifact upload/download、staging deploy workflow、environment variable contract、post-deploy smoke、workflow 実装記録
- 含まないもの: production deploy workflow、本番 approval automation、deep test suite、alert integration、本番 cutover
- 編集可能パス: .github/workflows/, docs/portal/issues/issue-18-ci-staging-foundation.md
- 制限パス: infra production wiring, apps/ business logic

受け入れ条件
- [ ] 条件 1: build と validation の最小 workflow が存在し、portal-web の artifact を生成できる
- [ ] 条件 2: staging deploy workflow が artifact を受け取り、bucket sync と optional invalidation、post-deploy smoke を実行できる
- [ ] 条件 3: production workflow と責務を分離する前提が README と workflow 構成で維持されている

実装計画
- 変更見込みファイル: .github/workflows/portal-build.yml, .github/workflows/portal-staging-deploy.yml, .github/workflows/README.md, docs/portal/issues/issue-18-ci-staging-foundation.md
- アプローチ: Issue 10 の validation/deploy 分離をそのまま workflow に写し、build workflow は typecheck と build と artifact upload、staging deploy workflow は artifact consume と smoke verification に責務を絞る
- 採用しなかった代替案と理由: build と staging deploy を単一 workflow にまとめる案は、artifact handoff と environment responsibility の境界が曖昧になり、Issue 10 の方針とずれるため採らない

検証計画
- 実行するテスト: get_errors on workflow files; cd apps/portal-web && npm run build
- 確認するログ/メトリクス: workflow YAML diagnostics、Vite build 出力、staging smoke step definition
- 失敗時の切り分け経路: .github/workflows/portal-build.yml、.github/workflows/portal-staging-deploy.yml、docs/portal/issues/issue-10-cicd-policy.md、docs/portal/issues/issue-13-test-strategy.md を見直し、artifact handoff、deploy gating、smoke definition のどこが崩れているかを分ける

リスクとロールバック
- 主なリスク: workflow に production 前提や deep validation を詰め込みすぎ、staging-first の最小 delivery path が重くなること
- 影響範囲: GitHub Actions complexity、environment settings、staging deploy reliability
- 緩和策: build と deploy を分離し、smoke check は `/`、`/overview`、`/guidance` の最小集合に留め、production gate は README と issue 記録に分離する
- ロールバック手順: workflow が過剰と判明した場合は artifact handoff と staging sync の最小 path を残し、追加 verification は follow-on issue に戻す
```

## Tasks

- [x] frontend build の workflow を実装する
- [x] 最小 validation または test 実行を組み込む
- [x] staging deploy workflow を実装する
- [x] artifact の受け渡し方針を定義する
- [x] deploy 後の最低限の確認手順を workflow と接続する
- [x] production 承認ゲートへつながる分離方針を残す

## Definition of Done

- [x] build と validation の最小 workflow が実装されている
- [x] staging deploy を実行する workflow が存在する
- [x] frontend artifact を staging 配信へ渡す手順が整理されている
- [x] staging deploy 後の最低限の確認観点が定義されている
- [x] production workflow と責務を分離できる前提が残されている
- [x] 後続の監視とテスト強化に接続できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- `portal-build.yml` は pull_request と main push を起点に、portal-web の dependency install、typecheck、build、artifact upload を担当する
- `portal-staging-deploy.yml` は manual dispatch と build 成功後の workflow_run を起点に、artifact download または local build、AWS credential 設定、bucket sync、optional CloudFront invalidation、post-deploy smoke を担当する
- staging deploy workflow は `AWS_ROLE_TO_ASSUME_STAGING`、`STAGING_SITE_BUCKET_NAME`、`STAGING_AWS_REGION` などの environment contract を前提にし、Issue 17 の outputs と接続できる
- post-deploy smoke は `/`、`/overview`、`/guidance` を既定対象とし、path ごとに期待タイトルを確認する最小 verification として定義した

## Current Review Notes

- build workflow は validation と artifact production に責務を限定し、deploy 実行を持たないことで Issue 10 の分離方針を保つ
- staging deploy workflow は production promotion を含まず、production gate は separate responsibility として README と issue で明示的に残す
- smoke verification は full E2E ではなく、Issue 13 で定義した first-release minimum path を repeatable に確認する範囲へ留める

## Spot Check Evidence

Issue 18 の final review 前に、実装済み CI と staging deploy foundation が最低限の成立条件を満たしているかを spot check した結果を残す。

- build verification: `cd apps/portal-web && npm run build` は 2026-03-08 セッションで成功し、build workflow が前提とする production build path が成立していることを確認した
- workflow diagnostics: [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml)、[/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)、[/.github/workflows/README.md](.github/workflows/README.md) に editor diagnostics は出ていない
- build workflow scope: [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) は pull_request と main push を起点に、checkout、Node setup、`npm ci`、`npm run typecheck`、`npm run build`、artifact upload を担当し、validation と artifact production に責務を限定している
- staging deploy flow: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は manual dispatch と successful `workflow_run` を起点に、artifact download または local build、AWS credential 設定、bucket sync、optional invalidation、post-deploy smoke を実装している
- environment contract: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) と [/.github/workflows/README.md](.github/workflows/README.md) は `AWS_ROLE_TO_ASSUME_STAGING`、`STAGING_SITE_BUCKET_NAME`、`STAGING_AWS_REGION` を必須入力として扱い、`STAGING_CLOUDFRONT_DISTRIBUTION_ID`、`STAGING_BASE_URL`、`STAGING_SMOKE_PATHS` を optional input として整理している
- smoke verification posture: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は `/`、`/overview`、`/guidance` を既定 smoke path とし、path ごとの expected title を grep で確認する最小 post-deploy verification を定義している
- production separation: [/.github/workflows/README.md](.github/workflows/README.md) では build validation、staging deployment、production approval-gated promotion を別責務として記録し、production workflow をまだ追加していない状態を明示している

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 18 final review, the local issue record is the primary evidence source. [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) are the primary implementation artifacts, while [apps/portal-web/package.json](apps/portal-web/package.json) and [docs/portal/issues/issue-17-aws-delivery-foundation.md](docs/portal/issues/issue-17-aws-delivery-foundation.md) provide supporting evidence for build commands and staging delivery handoff expectations.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `frontend build の workflow を実装する` | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) | These sources show the dedicated workflow for checkout, dependency install, typecheck, build, and artifact upload. | Accepted for final review |
| `最小 validation または test 実行を組み込む` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [apps/portal-web/package.json](apps/portal-web/package.json) | These sources show the typecheck and build validation steps wired into the build workflow. | Accepted for final review |
| `staging deploy workflow を実装する` | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) | These sources show the dedicated staging deploy workflow and its deploy-specific responsibilities. | Accepted for final review |
| `artifact の受け渡し方針を定義する` | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) | These sources show upload, download, and manual-build fallback behavior for the portal artifact handoff. | Accepted for final review |
| `deploy 後の最低限の確認手順を workflow と接続する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) | These sources show the smoke-check path definitions and post-deploy verification steps in the staging workflow. | Accepted for final review |
| `production 承認ゲートへつながる分離方針を残す` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md) | These sources show that production promotion remains separate and is documented as a later responsibility. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `build と validation の最小 workflow が実装されている` | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [apps/portal-web/package.json](apps/portal-web/package.json) | These sources confirm the build workflow exists and executes the minimum validation and build steps. | Accepted for final review |
| `staging deploy を実行する workflow が存在する` | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) | These sources confirm the staging deploy workflow exists with dispatch and workflow-run entrypoints. | Accepted for final review |
| `frontend artifact を staging 配信へ渡す手順が整理されている` | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) | These sources confirm artifact upload, download, manual fallback, and deploy input documentation for staging delivery. | Accepted for final review |
| `staging deploy 後の最低限の確認観点が定義されている` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) | These sources confirm the smoke-check path set and expected-title verification after deploy. | Accepted for final review |
| `production workflow と責務を分離できる前提が残されている` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md) | These sources confirm production promotion remains separate from the staging-first workflows. | Accepted for final review |
| `後続の監視とテスト強化に接続できる状態になっている` | `Implementation Notes`, `Current Status`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), [/.github/workflows/README.md](.github/workflows/README.md), and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) | These sources confirm the current workflows leave room for later monitoring and test-hardening layers while already exposing repeatable deploy signals. | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md), with [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) used as the primary implementation evidence. [/.github/workflows/README.md](.github/workflows/README.md) was used as supporting evidence for workflow boundary and input documentation, while [apps/portal-web/package.json](apps/portal-web/package.json) and [docs/portal/issues/issue-17-aws-delivery-foundation.md](docs/portal/issues/issue-17-aws-delivery-foundation.md) were used as supporting evidence for build command validity and staging-delivery handoff assumptions. Explicit issue close approval is not yet recorded.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Build workflow presence | Satisfied | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [apps/portal-web/package.json](apps/portal-web/package.json) confirm the build and validation workflow exists and maps to actual project commands. |
| Staging deploy workflow | Satisfied | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) confirm the deploy workflow consumes artifacts, configures AWS, syncs staging content, and supports optional invalidation. |
| Artifact handoff contract | Satisfied | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [/.github/workflows/README.md](.github/workflows/README.md) confirm the artifact handoff path and operator-visible inputs. |
| Post-deploy verification | Satisfied | `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) confirm the minimum smoke verification path after deploy. |
| Production separation | Satisfied | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md) confirm production promotion remains separate from the staging-first workflow set. |
| Follow-on hardening readiness | Satisfied | `Current Status`, `Spot Check Evidence`, [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml), and [docs/portal/issues/issue-12-monitoring-policy.md](docs/portal/issues/issue-12-monitoring-policy.md) confirm the current workflow baseline can hand off to later monitoring and test hardening work. |

## Current Status

- build workflow と staging deploy workflow は実装済みで、artifact handoff と staging verification の最小 path を持つ
- workflow README は build input、staging input、post-deploy check direction を記録している
- production workflow はまだ追加しておらず、responsibility separation を保ったまま後続 hardening へ進める状態である
- workflow diagnostics、local build verification、workflow file review、README input review を根拠として final checkbox review を完了した
- Issue close 承認はまだ記録していないため、現時点では close-ready の review state として扱う

## Dependencies

- Issue 10
- Issue 12
- Issue 13
- Issue 15
- Issue 16
- Issue 17
