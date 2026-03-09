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

- [x] current production rollback target artifact と evidence path を固定する
- [x] operator restore sequence を production custom-domain 運用前提で整理する
- [x] post-rollback verification checklist を production 向けに具体化する
- [x] rollback readiness の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] current production rollback target と参照 evidence が同じ文脈で読める
- [x] production rollback verification checklist が custom-domain reachability を含んでいる
- [x] operator-facing rollback readiness と DNS / automation 未決事項が分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- current production release evidence は build run `22839426762`、staging verification run `22839434387`、production deploy run `22839461795`、custom-domain `https://www.aws.ashnova.jp` browser verification で成立している
- production distribution は `E34CI3F0M5904O`、bucket は `multicloudproject-portal-production-web`、current custom-domain alias は `www.aws.ashnova.jp` である
- Issue 35 は rollback target baseline を current decision として固定済みだが、実運用に使う rollback target record と verification checklist の current snapshot はこの follow-up で明示する

## Implementation Notes

- [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) に current production operations snapshot と recovery direction を追加し、current last known-good artifact、custom-domain path、restore sequence を policy wording として固定した
- [.github/workflows/README.md](.github/workflows/README.md) に production rollback readiness section を追加し、production rollback target run ids、evidence path、post-rollback verification boundary を workflow-facing guidance として整理した
- [infra/environments/production/README.md](infra/environments/production/README.md) に current production rollback snapshot、operator restore sequence、post-rollback verification checklist を追加し、custom-domain `https://www.aws.ashnova.jp` 前提の operator path を明文化した

## Current Review Notes

- current rollback target は「現在の本番が正常稼働しているので、次回変更に対する last known-good artifact が固定できた」という意味に限定し、rollback 実施済みであるとは扱っていない
- rollback restore は fresh build 再生成ではなく、build run `22839426762`、staging run `22839434387`、production run `22839461795` を起点に同じ audited workflow path を再利用する方針へ固定した
- DNS reversal detail、automatic rollback、incident command detail は本 issue に含めず、operator-facing rollback readiness の最小構成に限定している

## Spot Check Evidence

- policy wording: [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) は current production release と recovery direction を rollback policy の current snapshot として読める
- workflow wording: [.github/workflows/README.md](.github/workflows/README.md) は production rollback target、run evidence path、custom-domain verification boundary を workflow guidance として保持している
- environment wording: [infra/environments/production/README.md](infra/environments/production/README.md) は current rollback target、restore sequence、post-rollback verification checklist を同じ operator context で保持している
- live evidence basis: build run `22839426762`、staging run `22839434387`、production run `22839461795`、current custom-domain `https://www.aws.ashnova.jp` browser verification が current rollback target record の根拠である

## Final Review Result

- PASS: current production rollback target artifact、operator restore sequence、post-rollback verification checklist、rollback evidence path が docs と operator README で整合しており、Issue 40 の scope では blocking finding はない
- NOTE: DNS reversal detail、automatic rollback、incident runbook 全面整備はこの issue では扱わず、operator-managed follow-up として残している

## Process Review Notes

- 2026-03-09 に Issue 40 を follow-up として起票し、initial task contract を GitHub Issue #40 へ同期した
- 同日、current production release evidence として build run `22839426762`、staging verification run `22839434387`、production deploy run `22839461795`、custom-domain browser verification を確認し、これを current last known-good artifact record として docs へ固定した
- 同日、rollback policy、workflow README、production README を同期し、operator restore sequence と production post-rollback verification checklist を current operations baseline として整理した

## Current Status

- OPEN

- implementation sync は完了しており、formal review と close approval は未実施である
- current production release が確定したため、rollback target artifact と operator verification は production record に接続済みである