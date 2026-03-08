## Summary
実装物を継続的に検証して staging へ届けるには、build、validation、staging deploy の最小自動化が必要になる。

## Goal
portal 向けの CI と staging deploy の最小 workflow を実装する。

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

## Dependencies
- Issue 10
- Issue 12
- Issue 13
- Issue 15
- Issue 16
- Issue 17