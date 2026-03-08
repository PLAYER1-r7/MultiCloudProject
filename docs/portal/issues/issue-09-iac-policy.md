## Summary
インフラを手作業で構築すると再現性が低くなり、後続の Azure と GCP 展開にも不利になる。

## Goal
OpenTofu を前提にしたインフラ管理方針を定義し、環境差分を管理可能にする。

## Tasks
- [ ] OpenTofu の管理単位を決定する
- [ ] stack 分離方針を決定する
- [ ] staging と production の分離方針を決定する
- [ ] 出力値管理方針を決定する
- [ ] 環境差分の扱いを定義する
- [ ] IaC 設計メモを作成する

## Definition of Done
- [ ] IaC の管理単位が決定している
- [ ] 環境分離方針が決定している
- [ ] 出力値の扱いが決定している
- [ ] 再現可能な構成管理の方針が明文化されている

## Dependencies
- Issue 4
- Issue 5
- Issue 7