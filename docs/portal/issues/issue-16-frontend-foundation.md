## Summary
初回リリースの実装を開始するには、選定済みのフロントエンド方式に沿った portal アプリの土台が必要になる。

## Goal
portal フロントエンドの初期アプリ構成、主要ページ枠、ビルド出力の土台を実装する。

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

## Dependencies
- Issue 5
- Issue 6
- Issue 15