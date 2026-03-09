## Summary

production rollback target baseline と cutover execution evidence は揃ったが、初回 production release 後の current rollback target、operator restore sequence、post-rollback verification、evidence synchronization が実運用レベルで固定されていない。このままだと、次回 production incident や failed release 時に、どの artifact を戻し先とみなし、どの run evidence を参照し、どの確認が終われば service restoration と判断できるかが fail-closed に読めない。

## Goal

production rollback readiness を実運用レベルで固め、current rollback target artifact、operator restore sequence、post-rollback verification checklist、rollback evidence synchronization を current operations baseline として記録する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-40
- タイトル: production rollback readiness を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production operations
- 優先度: 中
- 先行条件: Issue 26 closed, Issue 35 closed, Issue 38 closed, Issue 39 closed

目的
- 解決する問題: production release 後の rollback target と recovery evidence path が planning baseline のままだと、incident 時にどの artifact を復旧対象とみなし、どの workflow run と verification を service restoration evidence として扱うかが曖昧なまま残る
- 期待する価値: current production release を起点に last known-good artifact と rollback evidence path を実運用レベルで固定し、次回 release や incident 時に small-team で迷わず復旧判断できる

スコープ
- 含むもの: current production rollback target の記録、operator restore sequence の明文化、post-rollback verification checklist の production 向け具体化、rollback evidence synchronization、issue 記録への根拠整理
- 含まないもの: automatic rollback 実装、DNS provider 操作の自動化、incident runbook 全面整備、application code の機能変更、OpenTofu module 変更
- 編集可能パス: docs/portal/16_ROLLBACK_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-40-production-rollback-readiness-operations.md
- 制限パス: apps/portal-web/**, infra/environments/production/main.tf, infra/environments/production/variables.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: current production rollback target artifact とその evidence path が文書から一意に読める
- [ ] 条件 2: operator restore sequence と post-rollback verification checklist が production custom-domain 運用を前提に読める
- [ ] 条件 3: DNS reversal detail や automation 実装を本 issue に混ぜず、operator-facing rollback readiness に限定できている

実装計画
- 変更見込みファイル: docs/portal/16_ROLLBACK_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-40-production-rollback-readiness-operations.md
- アプローチ: Issue 35 の rollback target baseline と、Issue 38 / Issue 39 で確定した production deploy / cutover evidence を接続し、current production release を起点にした operator rollback path を文書へ同期する
- 採用しなかった代替案と理由: rollback automation を先に入れる案は現状の operator-managed boundary と scope を崩すため採らない。DNS reversal detail まで同時に書く案も external DNS provider detail に踏み込みすぎるため採らない

検証計画
- 実行するテスト: markdown review; grep for rollback wording drift; get_errors on edited files
- 確認するログ/メトリクス: current rollback target wording、production deploy evidence wording、post-rollback verification wording、custom-domain reachability wording の整合
- 失敗時の切り分け経路: docs/portal/16_ROLLBACK_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-35-production-rollback-target-baseline.md、docs/portal/issues/issue-38-production-cutover-execution-baseline.md、docs/portal/issues/issue-39-production-delivery-resource-execution.md を照合し、rollback target, operator sequence, evidence path のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: current rollback target の記録が「rollback 実施済み」と誤読されること、または DNS reversal と automation detail まで repo が保証すると読まれること
- 影響範囲: production recovery planning、operator handoff、next release approval quality
- 緩和策: wording を current rollback target、restore sequence、verification checklist、evidence path に限定し、DNS reversal detail と automation depth は follow-up に残す
- ロールバック手順: scope が過大になった場合は current rollback target と verification checklist だけを残し、深い incident response detail は別 issue に切り出す
```

## Tasks

- [ ] current production rollback target artifact と evidence path を固定する
- [ ] operator restore sequence を production custom-domain 運用前提で整理する
- [ ] post-rollback verification checklist を production 向けに具体化する
- [ ] rollback readiness の根拠と非対象を issue 記録へ残す

## Definition of Done

- [ ] current production rollback target と参照 evidence が同じ文脈で読める
- [ ] production rollback verification checklist が custom-domain reachability を含んでいる
- [ ] operator-facing rollback readiness と DNS / automation 未決事項が分離されている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- current production release evidence は build run `22839426762`、staging verification run `22839434387`、production deploy run `22839461795`、custom-domain `https://www.aws.ashnova.jp` browser verification で成立している
- production distribution は `E34CI3F0M5904O`、bucket は `multicloudproject-portal-production-web`、current custom-domain alias は `www.aws.ashnova.jp` である
- Issue 35 は rollback target baseline を current decision として固定済みだが、実運用に使う rollback target record と verification checklist の current snapshot はこの follow-up で明示する

## Current Status

- OPEN

- production rollback readiness を実運用レベルへ進める follow-up issue として起票した
- current production release が確定したため、rollback target artifact と operator verification を production record に接続する段階へ入った