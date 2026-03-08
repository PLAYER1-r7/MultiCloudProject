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
- [ ] OpenTofu による管理単位が環境と責務の観点で整理されている
- [ ] staging と production の分離方針が明示されている
- [ ] modules と environment 定義の役割分担が説明されている
- [ ] 出力値と環境差分の扱い方が整理されている
- [ ] 手動変更を最小化する運用ルールが含まれている
- [ ] 再現可能な構成管理として Issue 10 以降の前提に使える

## Dependencies
- Issue 4
- Issue 5
- Issue 7