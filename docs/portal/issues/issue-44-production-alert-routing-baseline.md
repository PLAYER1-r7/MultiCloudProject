## Summary

current production monitoring baseline、rollback readiness、certificate renewal watchpoint は整理されたが、どの production failure を alert trigger として扱い、誰が一次通知 owner で、どの notification path を operator-managed route として使うかが current operations record として固定されていない。このままだと、public reachability failure、failed deploy、certificate continuity fault が起きたときに、検知から初動までの責務境界が operator memory に依存しやすい。

## Goal

production alert routing baseline を実運用レベルで固め、alert trigger set、notification owner、first-response notification path、scope boundary を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-44
- タイトル: production alert routing baseline を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production operations
- 優先度: 中
- 先行条件: Issue 12 closed, Issue 25 closed, Issue 41 closed, Issue 42 closed, Issue 43 closed

目的
- 解決する問題: current production monitoring baseline は evidence path まで固定されたが、alert trigger set、notification owner、first-response notification path が current operations wording として未固定のままだと、failed deploy、custom-domain reachability failure、certificate continuity fault に対する一次通知と escalation の責務境界が曖昧なまま残る
- 期待する価値: production alert trigger、notification owner、first-response notification path、fail-closed な scope boundary を current operations baseline として固定し、small-team phase で無人の通知先や曖昧な escalation を避けられる

スコープ
- 含むもの: production alert trigger set の記録、notification owner の明文化、first-response notification path の整理、alert scope boundary の同期、issue 記録への根拠整理
- 含まないもの: CloudWatch/SNS など provider-specific alert product 実装、24x7 on-call 体制の構築、dashboard 作成、SLO/SLI 数値確定、automatic escalation 実装
- 編集可能パス: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-44-production-alert-routing-baseline.md
- 制限パス: apps/portal-web/**, infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: production alert trigger set と notification owner が文書から一意に読める
- [ ] 条件 2: first-response notification path と escalation 境界が current production custom-domain operations に接続して読める
- [ ] 条件 3: alert product 実装や 24x7 on-call depth を混ぜず、operator-facing baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-44-production-alert-routing-baseline.md
- アプローチ: Issue 12 の monitoring policy、Issue 25 の notification ownership、Issue 41 の production monitoring baseline、Issue 42 の external DNS operations memo、Issue 43 の certificate renewal operator memo を接続し、current production failure signals に対する通知責務と一次対応経路を最小 alert routing memo として固定する
- 採用しなかった代替案と理由: CloudWatch/SNS や外部 SaaS まで同時導入する案は owner と channel の責務境界が未固定のまま blast radius を広げるため採らない。24x7 on-call や numeric SLO/SLI まで同一 issue に含める案も small-team phase の現実より重いため採らない

検証計画
- 実行するテスト: markdown review; grep for alert-routing wording drift; get_errors on edited files
- 確認するログ/メトリクス: alert trigger wording、notification owner wording、first-response notification path wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/14_MONITORING_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-25-staging-monitoring-hardening.md、docs/portal/issues/issue-41-production-monitoring-follow-up.md、docs/portal/issues/issue-42-external-dns-operations-memo.md、docs/portal/issues/issue-43-production-certificate-renewal-operator-memo.md を照合し、trigger、owner、notification path、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: alert routing baseline の記録が provider-specific tooling 実装済み、または 24x7 paging 体制が存在するかのように誤読されること
- 影響範囲: production first response、operator handoff、incident escalation quality
- 緩和策: wording を alert trigger、owner、notification path、scope boundary に限定し、tool integration と on-call depth は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は trigger set と notification owner だけを残し、product integration や 24x7 design は別 issue に切り出す
```

## Tasks

- [ ] production alert trigger set を固定する
- [ ] notification owner と first-response notification path を整理する
- [ ] escalation 境界と非対象を current production operations 文脈で明文化する
- [ ] alert routing baseline の根拠と検証方針を issue 記録へ残す

## Definition of Done

- [ ] production alert trigger set、notification owner、notification path が同じ文脈で読める
- [ ] failed deploy、custom-domain reachability failure、certificate continuity fault の一次対応経路が読める
- [ ] provider-specific tooling と 24x7 on-call depth がスコープ外として維持されている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- Issue 41 は current production monitoring baseline と first-response evidence path を固定したが、external alert tooling、24x7 on-call、CloudWatch/SNS integration、numeric SLO/SLI threshold は operator-managed follow-up として残している
- Issue 25 は staging 側で notification owner と一次対応経路の最小構成を固定しており、production alert routing は別 issue へ分離されていた
- current production failure signals の土台は `portal-production-deploy` の deploy evidence、`https://www.aws.ashnova.jp` と smoke paths の reachability、external DNS continuity、ACM certificate renewal watchpoint である

## Current Status

- OPEN

- initial task contract を起票し、production alert routing baseline の scope と dependency を固定した段階である
- implementation、formal review、close approval は未実施である

## Dependencies

- Issue 12
- Issue 25
- Issue 41
- Issue 42
- Issue 43