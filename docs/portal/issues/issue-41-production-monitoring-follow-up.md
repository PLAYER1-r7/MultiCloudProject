## Summary

production release と rollback readiness は成立したが、初回 production 運用でどの signal を first-response の起点とし、どの evidence path を一次確認とし、どこまでを monitoring baseline として扱うかが current operations として固定されていない。このままだと、public reachability failure や smoke failure が起きたときに、production deploy evidence、supporting diagnostics、rollback escalation の境界が operator memory 依存で揺れやすい。

## Goal

production monitoring の first-response baseline を実運用レベルで固め、current production signal、operator triage path、verification checklist、scope boundary を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-41
- タイトル: production monitoring follow-up を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production operations
- 優先度: 中
- 先行条件: Issue 12 closed, Issue 25 closed, Issue 38 closed, Issue 40 closed

目的
- 解決する問題: current production release 後の monitoring baseline が planning wording と staging hardening の延長に留まると、public reachability failure、smoke failure、failed production deploy に対してどの evidence path を first-response の正規経路とするかが曖昧なまま残る
- 期待する価値: production deploy run、custom-domain reachability、route health、supporting diagnostics の責務境界を current operations baseline として固定し、small-team phase の first response と escalation を迷わず実行できる

スコープ
- 含むもの: current production monitoring baseline の記録、first-response triage path の明文化、production verification checklist の具体化、monitoring scope boundary の同期、issue 記録への根拠整理
- 含まないもの: external alert product 導入、24x7 on-call 体制の構築、CloudWatch/SNS 実装、dashboard 作成、SLO/SLI 数値確定、DNS provider automation
- 編集可能パス: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-41-production-monitoring-follow-up.md
- 制限パス: apps/portal-web/**, infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: current production monitoring signal と first-response evidence path が文書から一意に読める
- [ ] 条件 2: operator triage path と verification checklist が custom-domain 運用前提で読める
- [ ] 条件 3: alert tooling や on-call depth を本 issue に混ぜず、operator-facing monitoring baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-41-production-monitoring-follow-up.md
- アプローチ: Issue 12 の monitoring baseline、Issue 25 の staging monitoring hardening、Issue 38 の production cutover evidence、Issue 40 の rollback readiness を接続し、既存の `portal-production-deploy` evidence path を current production monitoring baseline として固定する
- 採用しなかった代替案と理由: production workflow に新しい alert integration を追加する案は response ownership と運用チャネルが未固定のまま blast radius を広げるため採らない。CloudFront/DNS diagnostics を primary health signal にする案も user-facing reachability よりインフラ都合へ寄りすぎるため採らない

検証計画
- 実行するテスト: markdown review; grep for monitoring wording drift; get_errors on edited files
- 確認するログ/メトリクス: production monitoring baseline wording、first-response triage wording、verification checklist wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/14_MONITORING_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-25-staging-monitoring-hardening.md、docs/portal/issues/issue-38-production-cutover-execution-baseline.md、docs/portal/issues/issue-40-production-rollback-readiness-operations.md を照合し、signal、evidence path、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: monitoring baseline の記録が alert tooling 実装済み、または 24x7 対応前提と誤読されること
- 影響範囲: production first response、operator handoff、follow-up alert design
- 緩和策: wording を deploy evidence、custom-domain check、smoke-path verification、supporting diagnostics に限定し、alert product と on-call depth は follow-up として残す
- ロールバック手順: scope が広がりすぎた場合は first-response evidence path と verification checklist だけを残し、alerting integration の議論は別 issue に切り出す
```

## Tasks

- [x] current production monitoring signal と evidence path を固定する
- [x] operator first-response triage path を production custom-domain 前提で整理する
- [x] production monitoring verification checklist を具体化する
- [x] monitoring baseline の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] current production monitoring baseline と参照 evidence が同じ文脈で読める
- [x] production monitoring verification checklist が custom-domain reachability を含んでいる
- [x] operator-facing monitoring baseline と alerting / on-call 未決事項が分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- current production release evidence は build run `22839426762`、staging verification run `22839434387`、production deploy run `22839461795`、custom-domain `https://www.aws.ashnova.jp` verification によって成立している
- `portal-production-deploy` は既に `portal-production-deployment-record` artifact と step summary に production reachability result、owner fields、linked build/staging evidence を残す
- Issue 25 は staging monitoring hardening を閉じているため、本 issue ではその production follow-up として first-response baseline だけを固める

## Implementation Notes

- [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) に current production monitoring baseline と first-response triage direction を追加し、user-facing reachability を primary signal、CloudFront / DNS diagnostics を supporting signal として固定した
- [.github/workflows/README.md](.github/workflows/README.md) に Production Monitoring Follow-Up section を追加し、`portal-production-deploy` の step summary と `portal-production-deployment-record` artifact を一次確認経路として整理した
- [infra/environments/production/README.md](infra/environments/production/README.md) に current monitoring snapshot、first-response sequence、verification checklist、scope boundary を追加し、production custom-domain `https://www.aws.ashnova.jp` 前提の operator path を明文化した

## Current Review Notes

- current monitoring baseline は新しい alert product を導入したという意味ではなく、既存の production deploy evidence path を first-response の正規経路として固定したという意味に限定している
- first response は custom-domain reachability と smoke-path result を primary signal とし、CloudFront state や external DNS resolution は supporting diagnostics としてのみ扱う
- 24x7 on-call、dashboard depth、CloudWatch/SNS integration、SLO/SLI 数値は本 issue に含めず、operator-facing monitoring baseline の最小構成に限定している

## Spot Check Evidence

- monitoring policy wording: [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) は current production monitoring baseline、first-response triage、scope boundary を planning wording から current operations wording へ接続している
- workflow guidance wording: [.github/workflows/README.md](.github/workflows/README.md) は `portal-production-deployment-record` artifact、step summary、custom-domain first-response check を production monitoring follow-up として保持している
- operator guidance wording: [infra/environments/production/README.md](infra/environments/production/README.md) は current monitoring snapshot、first-response sequence、verification checklist を同じ operator context で保持している
- workflow implementation basis: [.github/workflows/portal-production-deploy.yml](.github/workflows/portal-production-deploy.yml) は `portal-production-deployment-record` artifact、verification owner、linked build/staging evidence、route-by-route reachability result を既に出力している

## Current Status

- OPEN

- implementation sync は完了しており、formal review は未実施である
- current production release の monitoring baseline は deploy evidence path と custom-domain verification path に接続済みである