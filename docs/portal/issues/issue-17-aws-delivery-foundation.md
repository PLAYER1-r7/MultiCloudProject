## Summary

portal を AWS 上で公開するには、静的配信と HTTPS を担う最小の delivery 基盤を実装する必要がある。

## Goal

S3、CloudFront、ACM を中心とした初期 AWS 静的配信基盤を実装する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-17
- タイトル: AWS 静的配信基盤を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first
- 優先度: 高

目的
- 解決する問題: frontend build artifact を受け取り、HTTPS 付きの static delivery path へ載せる IaC 基盤がないと、Issue 18 の staging deploy workflow が接続できない
- 期待する価値: staging entrypoint と reusable module を通じて、S3、CloudFront、ACM 前提の最小 AWS static delivery foundation を code-first に管理できる

スコープ
- 含むもの: staging OpenTofu entrypoint、portal-static-site module、S3 bucket、CloudFront distribution、certificate integration point、environment outputs、baseline delivery control、issue 実装記録
- 含まないもの: production wiring、external DNS cutover、本番証明書発行運用、application deploy workflow、monitoring/alert integration
- 編集可能パス: infra/, docs/portal/issues/issue-17-aws-delivery-foundation.md
- 制限パス: apps/, .github/workflows/

受け入れ条件
- [ ] 条件 1: staging を想定した S3 + CloudFront の静的配信基盤が IaC として存在し、frontend build artifact の受け渡し先を説明できる
- [ ] 条件 2: HTTPS と baseline delivery control の適用箇所が module レベルで整理されている

実装計画
- 変更見込みファイル: infra/modules/portal-static-site/*, infra/environments/staging/*, docs/portal/issues/issue-17-aws-delivery-foundation.md
- アプローチ: staging-first の reusable module 構成を維持しつつ、CloudFront response headers policy を module に含め、environment README と outputs で deploy workflow 接続点を明確にする
- 採用しなかった代替案と理由: environment ごとに直接 resource を書く案は、Issue 9 の reusable module 方針と矛盾し、後続 production entrypoint でも重複が増えるため採らない

検証計画
- 実行するテスト: cd infra/environments/staging && tofu fmt -check && tofu validate
- 確認するログ/メトリクス: OpenTofu validate 結果、module output、staging README の handoff 記述
- 失敗時の切り分け経路: infra/modules/portal-static-site/main.tf、infra/environments/staging/main.tf、docs/portal/11_IAC_POLICY_DRAFT.md を見直し、module wiring、provider requirement、delivery control のどこで崩れているかを分離する

リスクとロールバック
- 主なリスク: staging foundation の段階で production-specific decision を入れ込みすぎて、external DNS や state locking の未決事項と衝突すること
- 影響範囲: staging deploy、future production entrypoint、certificate handling、artifact handoff
- 緩和策: custom alias と ACM ARN は optional のままに保ち、default CloudFront certificate で staging path を成立させる
- ロールバック手順: delivery control や certificate integration が過剰と判明した場合は、S3 + CloudFront + optional ACM の最小構成へ戻し、extra behavior は follow-on issue に分離する
```

## Tasks

- [ ] portal 配信基盤の IaC 雛形を作成する
- [ ] static asset 配信先を定義する
- [ ] CloudFront 配信設定を定義する
- [ ] HTTPS 証明書と関連設定を定義する
- [ ] 環境差分と出力値の扱いを整理する
- [ ] 初期セキュリティヘッダまたは配信制御の適用箇所を整理する

## Definition of Done

- [ ] 初期 AWS 静的配信基盤の実装ファイルが存在する
- [ ] staging を想定した最低限の配信経路が定義されている
- [ ] HTTPS 配信に必要な設定方針が実装へ反映されている
- [ ] 環境ごとの差分管理と出力値の扱いが実装単位で整理されている
- [ ] フロントエンド build artifact を受け取る前提条件が説明できる
- [ ] 後続の deploy workflow 実装に渡せる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- reusable module として `infra/modules/portal-static-site` が存在し、S3 bucket、CloudFront distribution、Origin Access Control を管理している
- staging entrypoint は `infra/environments/staging` に分離され、backend、provider、locals、variables、outputs を environment 単位で持つ
- custom alias と ACM certificate ARN は optional とし、staging は default CloudFront certificate でも成立する
- baseline delivery control として CloudFront response headers policy を module に追加し、HTTPS redirect と合わせて初期 security header 適用箇所を固定した

## Current Review Notes

- Issue 17 の責務は production cutover ではなく staging-first の delivery foundation なので、external DNS と custom domain は integration point の記録に留める
- frontend build artifact handoff は Issue 18 実装対象だが、Issue 17 側で bucket output と distribution output の接続点を説明できる必要がある
- security header は full edge hardening ではなく baseline control として扱い、後続 issue で追加 behavior を足せる形に保つ

## Current Status

- staging entrypoint と reusable module は配置済みで、portal static delivery foundation の code-first path を持つ
- S3、CloudFront、optional ACM integration point、environment outputs は実装済み
- response headers policy と artifact handoff expectation を加え、Issue 18 が参照する delivery 接続点を明確化した
- Tasks と Definition of Done の checkbox 判定は final review 未実施のため未完了のまま維持する

## Dependencies

- Issue 4
- Issue 9
- Issue 11
- Issue 15
- Issue 16
