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

- [ ] portal フロントエンドの配置先を作成する
- [ ] 初期アプリ構成を作成する
- [ ] MVP の主要ページ枠を作成する
- [ ] 静的配信前提のルーティング方針を反映する
- [ ] ビルド出力と環境変数の基本方針を反映する
- [ ] 初期 smoke check 対象となる導線を整える

## Definition of Done

- [ ] portal フロントエンドの初期構成がリポジトリ上に存在する
- [ ] MVP で必要な主要ページまたはその枠組みが実装されている
- [ ] 静的配信前提の build が通る
- [ ] S3 と CloudFront 配備を前提にした出力先または build artifact の形が整理されている
- [ ] 初期 smoke check で確認する最低限の導線が存在する
- [ ] 後続の CI と staging deploy に渡せる状態になっている

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

## Current Status

- portal-web は buildable な static frontend scaffold として存在している
- public route shell と smoke-checkable navigation は実装済みで、Issue 17 と 18 が参照できる frontend surface を持つ
- VITE_BASE_PATH を考慮した internal routing と current planning に沿う platform wording をこの issue の調整対象として扱う
- Tasks と Definition of Done の checkbox 判定は final review 未実施のため未完了のまま維持する

## Dependencies

- Issue 5
- Issue 6
- Issue 15
