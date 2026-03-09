## Summary

production cutover と monitoring / rollback baseline は成立したが、external DNS の cutover と reversal を operator がどの順序で進め、どの evidence を残し、どこで artifact restore と切り分けるかが current operations memo として固定されていない。このままだと、次回 cutover や DNS 起因インシデント時に CNAME の解放順序、CloudFront alias の再適用順序、TTL の扱い、reversal 判断が operator memory に依存しやすい。

## Goal

external DNS operations memo を実運用レベルで固め、cutover sequence、reversal decision path、minimum evidence、scope boundary を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-42
- タイトル: external DNS operations memo を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production external DNS operations
- 優先度: 中
- 先行条件: Issue 34 closed, Issue 38 closed, Issue 40 closed, Issue 41 closed

目的
- 解決する問題: external DNS operating model は承認済みだが、cutover と reversal の operator sequence が current memo として固定されていないと、CloudFront alias の再適用順序、CNAME の解放順序、TTL の扱い、DNS reversal の判断条件が曖昧なまま残る
- 期待する価値: external DNS cutover と reversal の最小 operator sequence、evidence path、artifact restore との責務境界を current operations baseline として固定し、small-team phase で再実行可能な運用メモを持てる

スコープ
- 含むもの: external DNS cutover memo、DNS reversal decision memo、minimum evidence path、TTL 記録方針、issue 記録への根拠整理
- 含まないもの: DNS provider account 詳細、DNS automation 実装、Route 53 移行、provider credential 管理、automatic rollback 実装、incident runbook 全面整備
- 編集可能パス: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/issues/issue-42-external-dns-operations-memo.md
- 制限パス: .github/workflows/*.yml, infra/environments/production/*.tf, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: external DNS cutover sequence と minimum evidence path が文書から一意に読める
- [ ] 条件 2: DNS reversal decision path が artifact restore と分離され、custom-domain verification 前提で読める
- [ ] 条件 3: provider account detail や DNS automation を本 issue に混ぜず、operator-facing memo に限定できている

実装計画
- 変更見込みファイル: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/issues/issue-42-external-dns-operations-memo.md
- アプローチ: Issue 34 の domain ownership baseline、Issue 38 の cutover execution evidence、Issue 40 の rollback readiness、Issue 41 の monitoring follow-up を接続し、2026-03-09 の production cutover で確認した external DNS 実運用パターンを最小メモとして固定する
- 採用しなかった代替案と理由: external DNS provider 固有の画面操作まで文書化する案は repo の責務境界を超えるため採らない。DNS automation や Route 53 への移行を先に混ぜる案も現在の external DNS operating model を崩すため採らない

検証計画
- 実行するテスト: markdown review; grep for DNS wording drift; get_errors on edited files
- 確認するログ/メトリクス: external DNS cutover wording、reversal decision wording、TTL/evidence wording、scope boundary wording の整合
- 失敗時の切り分け経路: .github/workflows/README.md、infra/environments/production/README.md、docs/portal/16_ROLLBACK_POLICY_DRAFT.md、docs/portal/issues/issue-34-production-domain-ownership-baseline.md、docs/portal/issues/issue-38-production-cutover-execution-baseline.md、docs/portal/issues/issue-40-production-rollback-readiness-operations.md、docs/portal/issues/issue-41-production-monitoring-follow-up.md を照合し、sequence、evidence、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: DNS operations memo の記録が provider account detail や DNS automation 実装まで repo で保証するように誤読されること
- 影響範囲: production cutover repetition、DNS incident response、rollback escalation
- 緩和策: wording を operator sequence、TTL 記録、evidence path、artifact restore との分離に限定し、provider account detail と automation depth は follow-up に残す
- ロールバック手順: memo scope が広がりすぎた場合は cutover sequence と reversal decision path だけを残し、provider-specific detail は別 issue に切り出す
```

## Tasks

- [x] external DNS cutover sequence と evidence path を固定する
- [x] DNS reversal decision path を artifact restore と分離して整理する
- [x] TTL と before/after target の記録方針を明文化する
- [x] DNS operations memo の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] external DNS cutover memo が current production custom-domain path を前提に読める
- [x] DNS reversal decision が artifact rollback と別判断として整理されている
- [x] provider account detail と DNS automation がスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- current production custom-domain は `www.aws.ashnova.jp`、CloudFront target は `d168agpgcuvdqq.cloudfront.net`、production distribution は `E34CI3F0M5904O` である
- 2026-03-09 の cutover evidence では Google Public DNS が TTL 3600 で `www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net` を返した
- 同日の post-close evidence では、旧 CNAME path の解放後に production distribution へ alias と reviewed certificate ARN を再適用したことが記録されている

## Implementation Notes

- [.github/workflows/README.md](.github/workflows/README.md) に External DNS Operations Memo section を追加し、cutover 前記録、alias 再適用前の CNAME 解放、post-change evidence、DNS reversal 境界を workflow handoff として整理した
- [infra/environments/production/README.md](infra/environments/production/README.md) に External DNS Cutover Operator Memo と External DNS Reversal Decision Memo を追加し、current target、TTL baseline、before/after target 記録、verification sequence を production operator path として明文化した
- [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) に Current External DNS Reversal Direction を追加し、artifact restore と DNS reversal の分離、reversal 後 verification を rollback policy wording に接続した

## Current Review Notes

- DNS operations memo は provider 固有手順ではなく、repo が保証すべき operator sequence と evidence path の最小構成に限定している
- DNS reversal は first rollback action ではなく、artifact restore と propagation wait の後に検討する別判断として固定している
- TTL と before/after target の記録を先に要求することで、incident 中に reversal path を推測で扱わないようにしている

## Spot Check Evidence

- workflow handoff wording: [.github/workflows/README.md](.github/workflows/README.md) は external DNS cutover を workflow-complete automation から分離し、minimum evidence と reversal boundary を operator memo として保持している
- operator memo wording: [infra/environments/production/README.md](infra/environments/production/README.md) は current target、TTL baseline、cutover evidence、reversal decision path を同じ operator context で保持している
- rollback wording: [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) は DNS reversal を artifact restore と別判断として扱い、reversal 後 verification を明示している
- evidence basis: [docs/portal/issues/issue-38-production-cutover-execution-baseline.md](docs/portal/issues/issue-38-production-cutover-execution-baseline.md) の post-close operational evidence は旧 CNAME path の解放、alias 再適用、Google Public DNS、custom-domain verification を current memo の根拠として残している

## Final Review Result

- PASS: external DNS cutover sequence、DNS reversal decision path、minimum evidence、scope boundary が workflow README、production README、rollback policy、issue record で整合しており、Issue 42 の scope では blocking finding はない
- NOTE: provider account detail、DNS automation、Route 53 migration、automatic rollback、incident runbook depth は本 issue では扱わず、operator-managed follow-up として残している

## Process Review Notes

- 2026-03-09 に Issue 42 を follow-up として起票し、initial task contract を GitHub Issue #42 へ同期した
- 同日、workflow README、production README、rollback policy を同期し、external DNS cutover sequence、DNS reversal decision path、TTL 記録方針、minimum evidence を current operations memo として整理した
- 2026-03-09 formal review では build run `22839426762`、staging verification run `22839434387`、production deploy run `22839461795` がすべて success で同一 commit `f9b395393a1bacd221541c5437e60fe23a2da0c2` を指していること、CloudFront `E34CI3F0M5904O` が `Deployed` かつ alias `www.aws.ashnova.jp` と reviewed ACM certificate ARN を保持していること、Google Public DNS が `www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net` を TTL 2204 で返すこと、custom-domain 相当の HTTPS 応答が 200 と SPA shell を返すこと、production deploy run に `portal-production-deployment-record` artifact が存在することを live state で再確認した
- 2026-03-09 に CloudeSonnet との再レビューで問題なしの合意を確認し、repository owner の close approval を受領した

## Current Status

- CLOSED

- implementation sync、formal review、close approval は完了している
- external DNS cutover と reversal の最小 operator memo は production current path に接続済みである
