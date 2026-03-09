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
- custom-domain incident は artifact restore や DNS reversal へ直行せず、certificate state、eligibility、validation retention を先に確認する triage に統一した

## Spot Check Evidence

- workflow handoff wording: [.github/workflows/README.md](.github/workflows/README.md) は current certificate ARN、`NotAfter`、`RenewalEligibility`、validation CNAME retention、workflow contract 外の境界を operator memo として保持している
- operator memo wording: [infra/environments/production/README.md](infra/environments/production/README.md) は current certificate snapshot、validation CNAME retention、renewal failure 時の operator sequence を production operator context で保持している
- monitoring wording: [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) は unexpected custom-domain HTTPS failure を certificate watchpoint として扱い、artifact / DNS との切り分けを明示している
- rollback wording: [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) は certificate incident を artifact rollback と DNS reversal の前段で切り分ける recovery direction を明示している
- live state basis: ACM describe-certificate は certificate ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` について `Status=ISSUED`、`RenewalEligibility=ELIGIBLE`、`NotAfter=2026-09-06T23:59:59+00:00`、`InUseBy=arn:aws:cloudfront::278280499340:distribution/E34CI3F0M5904O`、validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp -> _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws`、`ValidationStatus=SUCCESS` を返している

## Current Status

- OPEN

- implementation sync は完了しており、formal review は未実施である
- current production certificate renewal baseline の live state は issue record と operator memo に反映済みである
