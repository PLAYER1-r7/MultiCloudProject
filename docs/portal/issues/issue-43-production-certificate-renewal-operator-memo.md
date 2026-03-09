## Summary

production custom-domain path と external DNS operating model は成立したが、ACM certificate renewal を operator がどの evidence で監視し、validation CNAME をどの条件で保持確認し、どこで custom-domain incident と切り分けるかが current operations memo として固定されていない。このままだと、certificate expiration の監視、renewal eligibility の確認、validation CNAME の保持、renewal failure 時の escalation が operator memory に依存しやすい。

## Goal

production certificate renewal operator memo を実運用レベルで固め、ACM renewal evidence、validation CNAME retention check、expiration watchpoint、incident separation を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-43
- タイトル: production certificate renewal operator memo を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production certificate renewal operations
- 優先度: 中
- 先行条件: Issue 33 closed, Issue 38 closed, Issue 41 closed, Issue 42 closed

目的
- 解決する問題: production custom-domain path の certificate sourcing と external DNS cutover は整理済みだが、ACM certificate renewal evidence、validation CNAME retention check、expiration watchpoint、renewal failure 時の operator sequence が current memo として固定されていないと、certificate incident と delivery incident の切り分けが曖昧なまま残る
- 期待する価値: ACM renewal eligibility、NotAfter watchpoint、validation CNAME retention、renewal failure の escalation path を current operations baseline として固定し、small-team phase で再確認可能な運用メモを持てる

スコープ
- 含むもの: ACM renewal evidence memo、validation CNAME retention check、expiration watchpoint、renewal failure と custom-domain incident の切り分け、issue 記録への根拠整理
- 含まないもの: ACM renewal automation 実装、EventBridge や通知連携、DNS provider credential 管理、certificate 再発行の全面自動化、incident runbook 全面整備
- 編集可能パス: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/14_MONITORING_POLICY_DRAFT.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/issues/issue-43-production-certificate-renewal-operator-memo.md
- 制限パス: .github/workflows/*.yml, infra/environments/production/*.tf, apps/portal-web/**, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: current production certificate renewal evidence と watchpoint が文書から一意に読める
- [ ] 条件 2: validation CNAME retention check と renewal failure 時の operator sequence が current production custom-domain path に接続して読める
- [ ] 条件 3: renewal automation や通知実装を混ぜず、operator-facing memo に限定できている

実装計画
- 変更見込みファイル: .github/workflows/README.md, infra/environments/production/README.md, docs/portal/14_MONITORING_POLICY_DRAFT.md, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, docs/portal/issues/issue-43-production-certificate-renewal-operator-memo.md
- アプローチ: Issue 33 の certificate sourcing baseline、Issue 38 の production cutover evidence、Issue 41 の monitoring follow-up、Issue 42 の external DNS operations memo を接続し、current ACM certificate の renewal state と DNS validation CNAME retention を最小 operator memo として固定する
- 採用しなかった代替案と理由: renewal automation や通知実装まで本 issue へ含める案は current small-team phase の責務境界を超えるため採らない。certificate 再発行を前提にした playbook へ広げる案も、まず renewal baseline と retention check を固定すべきため採らない

検証計画
- 実行するテスト: markdown review; grep for renewal wording drift; get_errors on edited files
- 確認するログ/メトリクス: ACM NotAfter、RenewalEligibility、DomainValidationOptions.ResourceRecord、custom-domain HTTPS 応答、CloudFront alias/certificate attach state の整合
- 失敗時の切り分け経路: infra/environments/production/README.md、docs/portal/14_MONITORING_POLICY_DRAFT.md、docs/portal/16_ROLLBACK_POLICY_DRAFT.md、.github/workflows/README.md、docs/portal/issues/issue-33-production-certificate-sourcing-baseline.md、docs/portal/issues/issue-38-production-cutover-execution-baseline.md、docs/portal/issues/issue-41-production-monitoring-follow-up.md、docs/portal/issues/issue-42-external-dns-operations-memo.md を照合し、renewal evidence、validation retention、incident separation のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: renewal memo の記録が certificate renewal automation や 24x7 alerting まで repo で保証するように誤読されること
- 影響範囲: production custom-domain continuity、operator monitoring、certificate incident triage
- 緩和策: wording を renewal evidence、validation CNAME retention、expiration watchpoint、incident separation に限定し、automation と notification routing は follow-up に残す
- ロールバック手順: memo scope が広がりすぎた場合は renewal evidence と validation retention だけを残し、automation / notification detail は別 issue に切り出す
```

## Tasks

- [x] current production certificate renewal evidence と watchpoint を固定する
- [x] validation CNAME retention check と renewal failure operator sequence を整理する
- [x] custom-domain incident と certificate renewal incident の切り分けを明文化する
- [x] renewal memo の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] renewal operator memo が current production certificate 状態を前提に読める
- [x] validation CNAME retention と renewal failure 時の確認順序が読める
- [x] automation / notification implementation がスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- current production certificate ARN は `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` で、`www.aws.ashnova.jp` に対する `AMAZON_ISSUED` certificate として `ISSUED` 状態である
- ACM describe-certificate の live state では `RenewalEligibility=ELIGIBLE`、`NotAfter=2026-09-06T23:59:59+00:00`、`InUseBy=arn:aws:cloudfront::278280499340:distribution/E34CI3F0M5904O` を返している
- current validation CNAME は `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp` -> `_490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws` で、`ValidationStatus=SUCCESS` を返している

## Implementation Notes

- [.github/workflows/README.md](.github/workflows/README.md) に Production Certificate Renewal Memo を追加し、current certificate baseline、validation CNAME retention、custom-domain incident との切り分け、workflow contract 外の範囲を handoff wording として固定した
- [infra/environments/production/README.md](infra/environments/production/README.md) に Production Certificate Renewal Snapshot と Production Certificate Renewal Operator Memo を追加し、current certificate state、watchpoint、validation CNAME retention、renewal failure 時の operator sequence を production operator path として明文化した
- [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) に certificate renewal watchpoint を追加し、unexpected HTTPS failure 時に ACM state と validation CNAME retention を first-response triage に含めるよう整理した
- [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) に certificate incident separation wording を追加し、artifact rollback / DNS reversal より前に certificate continuity を切り分ける recovery direction を固定した

## Current Review Notes

- renewal memo は ACM renewal automation や notification routing を実装するものではなく、current production certificate continuity を小規模運用で見失わないための operator evidence path に限定している
- validation CNAME は issuance 時だけの一時レコードではなく、renewal continuity に必要な retained production state として扱う wording に揃えた
- custom-domain incident は artifact restore や DNS reversal へ直行せず、certificate state、eligibility、validation CNAME が reviewed `acm-validations.aws` target を保っているかを先に確認する triage に統一した

## Spot Check Evidence

- workflow handoff wording: [.github/workflows/README.md](.github/workflows/README.md) は current certificate ARN、`NotAfter`、`RenewalEligibility`、validation CNAME retention、workflow contract 外の境界を operator memo として保持している
- operator memo wording: [infra/environments/production/README.md](infra/environments/production/README.md) は current certificate snapshot、validation CNAME retention、renewal failure 時の operator sequence を production operator context で保持している
- monitoring wording: [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) は unexpected custom-domain HTTPS failure を certificate watchpoint として扱い、artifact / DNS との切り分けを明示している
- rollback wording: [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) は certificate incident を artifact rollback と DNS reversal の前段で切り分ける recovery direction を明示している
- live state basis: ACM describe-certificate は certificate ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` について `Status=ISSUED`、`RenewalEligibility=ELIGIBLE`、`NotAfter=2026-09-06T23:59:59+00:00`、`InUseBy=arn:aws:cloudfront::278280499340:distribution/E34CI3F0M5904O`、validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp -> _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws`、`ValidationStatus=SUCCESS` を返している

## Final Review Result

- PASS: workflow README、production README、monitoring policy、rollback policy、issue record の wording sync は整合しており、ACM renewal state、validation CNAME、CloudFront certificate attachment、custom-domain HTTPS、deployment artifact の live state も current operator memo と矛盾しない
- NOTE: validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp` は再チェック時点で `dns.google` と `cloudflare-dns.com` の通常問い合わせから `_490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws` を返しており、blocking finding だった public re-resolution mismatch は解消した

## Process Review Notes

- 2026-03-09 に implementation sync 後の wording を再確認し、validation CNAME drift 判定を `reviewed acm-validations.aws target` 基準に揃える微調整を追加した
- formal review では ACM describe-certificate が certificate ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` について `Status=ISSUED`、`RenewalEligibility=ELIGIBLE`、`NotAfter=2026-09-06T23:59:59+00:00`、`ValidationStatus=SUCCESS`、`InUseBy=arn:aws:cloudfront::278280499340:distribution/E34CI3F0M5904O` を返すこと、CloudFront `E34CI3F0M5904O` が alias `www.aws.ashnova.jp` と同一 ACM certificate ARN を保持すること、`https://www.aws.ashnova.jp` が HTTP 200 を返し、`/guidance` が SPA shell を返すこと、production deploy run `22839461795` に `portal-production-deployment-record` artifact が存在することを live state で再確認した
- 同 review で validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp` の public DNS 再確認を行ったところ、`https://dns.google/resolve?...` と `https://cloudflare-dns.com/dns-query?...` の双方が `Status=3` を返し、issue と operator memo が retained state として前提にしている validation CNAME を public resolver から確認できなかった
- repository owner による external DNS provider での CNAME 登録後に再確認したが、`dns.google` と `cloudflare-dns.com` はなお同じ validation CNAME に対して `Status=3` を返し、公開 DNS からは反映を確認できていない。`www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net` の production CNAME は引き続き正常である
- 追加の再確認では `cloudflare-dns.com` と `dns.google` の `cd=1` で validation CNAME が `_490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws` を返した一方、通常の `dns.google` は同じ名前に対してなお `Status=3` を返したため、完全な未反映ではなく resolver validation 差分が残っている状態と判断した
- その後の再チェックでは `dns.google` と `cloudflare-dns.com` の通常問い合わせがともに validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp -> _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws` を返し、ACM describe-certificate も `Status=ISSUED`、`RenewalEligibility=ELIGIBLE`、`ValidationStatus=SUCCESS` を維持し、`www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net`、custom-domain HTTPS 200、`/guidance` の SPA shell を再確認できたため、blocking finding を解消して formal review を PASS へ更新した
- 2026-03-09 に repository owner から close approval を受領し、CloudSonnet review の指摘を踏まえて stale な open/action-needed wording を解消したため、本 issue を CLOSED として確定し、GitHub Issue #43 とローカル記録を同期する

## External DNS Recovery Record

- authoritative NS for `ashnova.jp` are `01.dnsv.jp`, `02.dnsv.jp`, `03.dnsv.jp`, and `04.dnsv.jp`, and the validation record that required recovery was `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp CNAME _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws`
- repository owner による external DNS provider 側の反映後、`dns.google` と `cloudflare-dns.com` の通常問い合わせで同 validation CNAME を再確認でき、public re-resolution mismatch は解消した
- current production custom-domain CNAME `www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net` は再確認期間を通して正常であり、Issue 43 の external DNS 対応は ACM validation CNAME の復旧確認として完了した

## Current Status

- CLOSED

- implementation sync、formal review、close approval が完了している
- current production certificate renewal baseline の live state は issue record と operator memo に反映済みである
- external DNS recovery record は historical evidence として保持し、追加の action-needed state は残っていない
