## Summary

初回リリースの実装を開始するには、選定済みのフロントエンド方式に沿った portal アプリの土台が必要になる。

## Goal

portal フロントエンドの初期アプリ構成、主要ページ枠、ビルド出力の土台を実装する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-16
- タイトル: フロントエンド土台を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: local / planning
- 優先度: 高

目的
- 解決する問題: staging-first の static portal 実装を始めるための app scaffold、major route、build path、static deployment 前提の routing が揃っていないと、Issue 17 と Issue 18 へ artifact と smoke-checkable surface を渡せない
- 期待する価値: portal-web に buildable な public route surface を用意し、major page shell、static deployment routing、build output の最小基盤を固定できる

スコープ
- 含むもの: portal-web の app scaffold、major public route、delivery/operations route shell、static deployment 前提の routing、build output、smoke-checkable navigation、issue 実装記録
- 含まないもの: framework 大規模導入、backend 連携、dynamic data fetch、production hardening、CI workflow 実装、infra 実装
- 編集可能パス: apps/portal-web/, docs/portal/issues/issue-16-frontend-foundation.md
- 制限パス: infra/, .github/workflows/

受け入れ条件
- [ ] 条件 1: portal-web に buildable な public route surface があり、Home / Overview / Guidance を中心とした初期 route shell と static deployment 前提の routing が確認できる
- [ ] 条件 2: build output と VITE_BASE_PATH 前提が staging deploy へ渡せる形で整理されている

実装計画
- 変更見込みファイル: apps/portal-web/src/main.ts, apps/portal-web/src/styles.css, apps/portal-web/vite.config.ts, docs/portal/issues/issue-16-frontend-foundation.md
- アプローチ: 既存の Vite + TypeScript scaffold を維持しつつ、small route map と document-driven content shell を plain TypeScript で構成し、subpath deploy でも壊れない internal routing を優先する
- 採用しなかった代替案と理由: React や router library を直ちに導入する案は、Issue 16 の責務である初期 scaffold と static-first route shell より先に runtime dependency と構成判断を増やすため採らない

検証計画
- 実行するテスト: cd apps/portal-web && npm run build
- 確認するログ/メトリクス: Vite build 出力、dist 生成、主要 route の routing logic
- 失敗時の切り分け経路: apps/portal-web/src/main.ts、apps/portal-web/vite.config.ts、docs/portal/issues/issue-15-implementation-backlog.md を見直し、route shell、base path、build output のどこが欠けたかを分離する

リスクとロールバック
- 主なリスク: route shell が planning 決定より先に特定の infra や domain 前提へ寄り、後続 Issue 17 と 18 の設計自由度を狭めること
- 影響範囲: staging deploy、smoke check、artifact handoff、route naming
- 緩和策: current planning に沿う public-first / static-first route set を保ち、domain や workflow の深い実装判断は後続 issue に委ねる
- ロールバック手順: route 構成や build path が過剰と判明した場合は、Home / Overview / Guidance を中心とした最小 route set へ戻し、supporting route は shell に留める
```

## Tasks

- [x] portal フロントエンドの配置先を作成する
- [x] 初期アプリ構成を作成する
- [x] MVP の主要ページ枠を作成する
- [x] 静的配信前提のルーティング方針を反映する
- [x] ビルド出力と環境変数の基本方針を反映する
- [x] 初期 smoke check 対象となる導線を整える

## Definition of Done

- [x] portal フロントエンドの初期構成がリポジトリ上に存在する
- [x] MVP で必要な主要ページまたはその枠組みが実装されている
- [x] 静的配信前提の build が通る
- [x] S3 と CloudFront 配備を前提にした出力先または build artifact の形が整理されている
- [x] 初期 smoke check で確認する最低限の導線が存在する
- [x] 後続の CI と staging deploy に渡せる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- portal-web は Vite + TypeScript の static-first scaffold として構成されている
- Home、Overview、Guidance を中心に、Platform、Delivery、Operations の supporting route shell まで含む小さな route map を持つ
- internal navigation は document-driven な plain TypeScript 実装で構成し、route shell と smoke-checkable navigation を同時に満たす
- build output は dist に生成され、VITE_BASE_PATH を通じて static hosting 配下の subpath deploy を扱える前提を持つ

## Current Review Notes

- static deployment 前提の routing は、BASE_URL を読まずに absolute path を使うと subpath deploy で壊れるため、Issue 16 では internal link と current route 判定の双方で base path を扱う必要がある
- platform route の説明は current planning と整合している必要があり、external DNS または CloudFront domain 前提へ寄せ、Route 53 固定のような表現は避ける
- Issue 16 の本文は final review や issue close 承認ではなく、実装の作業記録と検証観点を残す目的で更新する

## Spot Check Evidence

Issue 16 の final review 前に、実装済み frontend foundation が最低限の成立条件を満たしているかを spot check した結果を残す。

- build verification: `cd apps/portal-web && npm run build` は 2026-03-08 セッションで成功し、`dist/` に production build output を生成できることを確認した
- route surface: `apps/portal-web/src/main.ts` には `/`、`/overview`、`/guidance`、`/platform`、`/delivery`、`/operations` の route definition と internal navigation が存在し、Issue 15 で定義した first executable slice の route shell を満たしている
- subpath routing: `apps/portal-web/vite.config.ts` は `VITE_BASE_PATH` を `base` へ反映し、`apps/portal-web/src/main.ts` は `import.meta.env.BASE_URL` から internal link と current route 判定を組み立てるため、subpath deploy 前提の routing を保てる
- static hosting fallback: `infra/modules/portal-static-site/main.tf` では CloudFront の `default_root_object = "index.html"` に加え、403/404 を `/index.html` へ戻す custom error response を持ち、deep link 直接アクセス時の SPA fallback 前提が staging delivery foundation 側にもある
- diagnostics check: `apps/portal-web/src/main.ts`、`apps/portal-web/src/styles.css`、`apps/portal-web/vite.config.ts` に editor diagnostics はなく、frontend foundation の主要構成要素に即時エラーは出ていない

## Process Review Notes

- Issue 16 は frontend foundation の実装記録、spot check、evidence mapping、final review result を段階的に追記し、close 判断前に root evidence と GitHub Issue 本文の同期状態を再確認した。
- final checkbox review は [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)、[apps/portal-web/src/styles.css](apps/portal-web/src/styles.css)、[apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts)、[apps/portal-web/README.md](apps/portal-web/README.md)、[infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) を根拠に完了している。
- 承認形式: (b) 連続処理一括承認。
- 一括承認根拠: ユーザー発言「Issue16の合意が取れたので、過程と内容に問題ないか確認してください。」（2026-03-08 セッション）
- Issue 16 close 実行承認: ユーザー発言「CloudeSonnetとのレビューで問題ないことが確認できたので、Closeに向けて作業を続けてください。」（2026-03-08 セッション）

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 16 final review, the local issue record is the primary evidence source. [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), [apps/portal-web/src/styles.css](apps/portal-web/src/styles.css), and [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts) are the primary implementation artifacts, while [apps/portal-web/README.md](apps/portal-web/README.md) and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) provide supporting evidence for static deployment assumptions and fallback behavior.

### Task Mapping

| Checklist item                             | Primary evidence section                                                                                                                                                                                                                      | Why this is the evidence                                                                                                         | Review state              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `portal フロントエンドの配置先を作成する`  | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/README.md](apps/portal-web/README.md), and [apps/portal-web/package.json](apps/portal-web/package.json)                                                                       | These sources show that `apps/portal-web/` exists as the implementation target with runnable scripts and documented scope.       | Accepted for final review |
| `初期アプリ構成を作成する`                 | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), [apps/portal-web/src/styles.css](apps/portal-web/src/styles.css), and [apps/portal-web/package.json](apps/portal-web/package.json) | These sources show the Vite + TypeScript scaffold, application entrypoint, styling layer, and build/typecheck scripts.           | Accepted for final review |
| `MVP の主要ページ枠を作成する`             | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                                                                 | These sources show the Home, Overview, Guidance routes and supporting route shells required for the MVP page surface.            | Accepted for final review |
| `静的配信前提のルーティング方針を反映する` | `Current Review Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts)                                                               | These sources show base-path-aware internal navigation, route normalization, and Vite base configuration for subpath deployment. | Accepted for final review |
| `ビルド出力と環境変数の基本方針を反映する` | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts), and [apps/portal-web/README.md](apps/portal-web/README.md)                                                                   | These sources show the `dist` build output and the `VITE_BASE_PATH` contract for deployment environments.                        | Accepted for final review |
| `初期 smoke check 対象となる導線を整える`  | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                                                                 | These sources show public route shells, navigation links, and route-specific smoke-check baseline content.                       | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                      | Primary evidence section                                                                                                                                                                                                                                          | Why this is the evidence                                                                                                                      | Review state              |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `portal フロントエンドの初期構成がリポジトリ上に存在する`                           | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/package.json](apps/portal-web/package.json), and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                       | These sources confirm the frontend scaffold exists in the repository and is executable as a standalone app surface.                           | Accepted for final review |
| `MVP で必要な主要ページまたはその枠組みが実装されている`                            | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                                                                                     | These sources confirm the MVP route shells and content framing are implemented.                                                               | Accepted for final review |
| `静的配信前提の build が通る`                                                       | `Spot Check Evidence` and [apps/portal-web/package.json](apps/portal-web/package.json)                                                                                                                                                                            | These sources confirm the production build command exists and succeeded during review.                                                        | Accepted for final review |
| `S3 と CloudFront 配備を前提にした出力先または build artifact の形が整理されている` | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts), [apps/portal-web/README.md](apps/portal-web/README.md), and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) | These sources confirm the `dist` output contract, subpath deployment handling, and CloudFront fallback behavior expected by staging delivery. | Accepted for final review |
| `初期 smoke check で確認する最低限の導線が存在する`                                 | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts)                                                                                                                                                     | These sources confirm that navigation and route-level smoke-check baselines exist for the first public routes.                                | Accepted for final review |
| `後続の CI と staging deploy に渡せる状態になっている`                              | `Implementation Notes`, `Spot Check Evidence`, `Current Status`, [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts), and [apps/portal-web/README.md](apps/portal-web/README.md)                                                                     | These sources confirm that the frontend artifact, base-path contract, and route surface are ready to hand off to Issues 17 and 18.            | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-16-frontend-foundation.md](docs/portal/issues/issue-16-frontend-foundation.md), with [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), [apps/portal-web/src/styles.css](apps/portal-web/src/styles.css), and [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts) used as the primary implementation evidence. [apps/portal-web/README.md](apps/portal-web/README.md) and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) were used as supporting evidence for deployment contract and fallback behavior. Explicit issue close approval is recorded in Process Review Notes.

| Checklist area               | Final judgment | Evidence basis                                                                                                                                                                                                                                              |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend scaffold presence   | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [apps/portal-web/package.json](apps/portal-web/package.json), and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) confirm the Vite + TypeScript frontend scaffold exists and is runnable.         |
| MVP route surface            | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts) confirm the required Home, Overview, Guidance, and supporting route shells are implemented.                                                   |
| Static routing contract      | Satisfied      | `Current Review Notes`, `Spot Check Evidence`, [apps/portal-web/src/main.ts](apps/portal-web/src/main.ts), and [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts) confirm base-path-aware internal routing for subpath deployment.            |
| Build and artifact readiness | Satisfied      | `Spot Check Evidence`, [apps/portal-web/package.json](apps/portal-web/package.json), and [apps/portal-web/vite.config.ts](apps/portal-web/vite.config.ts) confirm successful build and artifact output assumptions.                                         |
| Static hosting handoff       | Satisfied      | `Spot Check Evidence`, [apps/portal-web/README.md](apps/portal-web/README.md), and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) confirm the deployment-facing output contract and CloudFront fallback expectations. |
| Handoff to Issues 17 and 18  | Satisfied      | `Current Status`, `Spot Check Evidence`, and `Implementation Notes` confirm the frontend surface can now be consumed by staging delivery and CI/deploy work.                                                                                                |

## Current Status

- portal-web は buildable な static frontend scaffold として存在している
- public route shell と smoke-checkable navigation は実装済みで、Issue 17 と 18 が参照できる frontend surface を持つ
- VITE_BASE_PATH を考慮した internal routing と current planning に沿う platform wording は final review 時点で妥当と確認した
- build、route surface、subpath routing、static hosting fallback、主要 frontend diagnostics を根拠として final checkbox review を完了した
- Issue close 承認は Process Review Notes に記録済みであり、現時点では close 実行可能な状態として扱う

## Dependencies

- Issue 5
- Issue 6
- Issue 15
