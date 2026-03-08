## Summary
build、test、deploy の流れを事前に設計しないと、後から品質と承認フローを組み込むのが難しくなる。

## Goal
GitHub Actions を前提にした最小の CI/CD フローを定義する。

## Tasks
- [ ] build フローを定義する
- [ ] test フローを定義する
- [ ] staging deploy フローを定義する
- [ ] production deploy フローを定義する
- [ ] branch 起点を整理する
- [ ] approval gate を整理する
- [ ] workflow 設計メモを作成する

## Definition of Done
- [ ] build と test の最小実行フローが分離して説明されている
- [ ] staging deploy の起動条件と対象ブランチ方針が整理されている
- [ ] production deploy に承認ゲートがあることが明示されている
- [ ] validation と deploy の workflow 役割分担が説明されている
- [ ] GitHub Actions を前提にした運用フローが 1 本の流れとして説明できる
- [ ] Issue 11 と Issue 12 の前提条件として参照できる

## Dependencies
- Issue 6
- Issue 7
- Issue 9