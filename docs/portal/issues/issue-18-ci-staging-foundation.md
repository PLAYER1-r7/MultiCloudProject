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

- [ ] frontend build の workflow を実装する
- [ ] 最小 validation または test 実行を組み込む
- [ ] staging deploy workflow を実装する
- [ ] artifact の受け渡し方針を定義する
- [ ] deploy 後の最低限の確認手順を workflow と接続する
- [ ] production 承認ゲートへつながる分離方針を残す

## Definition of Done

- [ ] build と validation の最小 workflow が実装されている
- [ ] staging deploy を実行する workflow が存在する
- [ ] frontend artifact を staging 配信へ渡す手順が整理されている
- [ ] staging deploy 後の最低限の確認観点が定義されている
- [ ] production workflow と責務を分離できる前提が残されている
- [ ] 後続の監視とテスト強化に接続できる状態になっている

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

## Current Status

- build workflow と staging deploy workflow は実装済みで、artifact handoff と staging verification の最小 path を持つ
- workflow README は build input、staging input、post-deploy check direction を記録している
- production workflow はまだ追加しておらず、responsibility separation を保ったまま後続 hardening へ進める状態である
- Tasks と Definition of Done の checkbox 判定は final review 未実施のため未完了のまま維持する

## Dependencies

- Issue 10
- Issue 12
- Issue 13
- Issue 15
- Issue 16
- Issue 17
