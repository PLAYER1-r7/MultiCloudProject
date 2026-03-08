## Summary
portal を AWS 上で公開するには、静的配信と HTTPS を担う最小の delivery 基盤を実装する必要がある。

## Goal
S3、CloudFront、ACM を中心とした初期 AWS 静的配信基盤を実装する。

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

## Dependencies
- Issue 4
- Issue 9
- Issue 11
- Issue 15
- Issue 16