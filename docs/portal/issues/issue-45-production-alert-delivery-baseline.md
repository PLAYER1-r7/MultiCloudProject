## Summary

Issue 44 で production alert trigger、notification owner、first-response notification path は固定できたが、provider-specific alert delivery をどこまで current operations baseline として許可するかは未決定のままである。このままだと、run URL と artifact を一次経路として持ちながらも、外部 channel を導入する条件、delivery failure をどう扱うか、どの endpoint が owner 付き notification destination として許されるかが operator memory に依存しやすい。

## Goal

production alert delivery baseline を実運用レベルで固め、external delivery channel の最小許可範囲、delivery owner、delivery failure の扱い、scope boundary を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-45
- タイトル: production alert delivery baseline を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production operations
- 優先度: 中
- 先行条件: Issue 12 closed, Issue 41 closed, Issue 42 closed, Issue 43 closed, Issue 44 closed

目的
- 解決する問題: current production alert routing baseline は owner と first-response path まで固定したが、provider-specific alert delivery の enable 条件、owned destination、delivery failure handling が current wording として未固定のままだと、run URL 以外の channel を追加した瞬間に責務境界と fail-closed rule が崩れやすい
- 期待する価値: current phase で許可する external delivery channel の最小範囲、delivery owner、fallback path、scope boundary を固定し、無人の通知先や delivery-only automation を避けた alert delivery baseline を持てる

スコープ
- 含むもの: external delivery channel の許可条件、delivery owner baseline、delivery failure fallback、alert delivery scope boundary、issue 記録への根拠整理
- 含まないもの: 24x7 on-call 体制の構築、dashboard 作成、SLO/SLI 数値確定、automatic remediation 実装、incident commander 体制、DNS automation
- 編集可能パス: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-45-production-alert-delivery-baseline.md
- 制限パス: apps/portal-web/**, infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: current phase で許可する production alert delivery channel と owner が文書から一意に読める
- [ ] 条件 2: delivery failure 時の fallback が Issue 44 の first-response notification path と接続して読める
- [ ] 条件 3: 24x7 paging、automatic remediation、broad chat integration を混ぜず、small-team operator-facing baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/14_MONITORING_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-45-production-alert-delivery-baseline.md
- アプローチ: Issue 12 の owner-first notification 原則、Issue 41 の production monitoring baseline、Issue 44 の alert routing baseline を接続し、current small-team phase で有効化してよい external delivery channel と fallback path を最小 memo として固定する
- 採用しなかった代替案と理由: 24x7 paging や automatic escalation まで同時に扱う案は owner と staffing の前提が不足しているため採らない。CloudWatch/SNS や外部 SaaS の実装まで同一 issue に含める案も、まず許可範囲と fail-closed rule を固定すべきため採らない

検証計画
- 実行するテスト: markdown review; grep for alert-delivery wording drift; get_errors on edited files
- 確認するログ/メトリクス: delivery channel wording、delivery owner wording、fallback wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/14_MONITORING_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-41-production-monitoring-follow-up.md、docs/portal/issues/issue-44-production-alert-routing-baseline.md を照合し、channel、owner、fallback、scope boundary のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: alert delivery baseline の記録が provider-specific tooling 実装済み、または 24x7 対応前提と誤読されること
- 影響範囲: production first response、owner handoff、notification reliability expectation
- 緩和策: wording を owned delivery channel、fallback、scope boundary に限定し、product implementation と staffing depth は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は owned delivery destination と fallback path だけを残し、paging / chat / remediation design は別 issue に切り出す
```

## Tasks

- [x] current phase で許可する production alert delivery channel を固定する
- [x] delivery owner と delivery failure fallback を整理する
- [x] alert delivery の非対象と fail-closed rule を current production operations 文脈で明文化する
- [x] alert delivery baseline の根拠と検証方針を issue 記録へ残す

## Definition of Done

- [x] production alert delivery channel、delivery owner、fallback path が同じ文脈で読める
- [x] delivery failure 時も Issue 44 の first-response notification path に戻る前提が読める
- [x] provider-specific tooling 実装と 24x7 on-call depth がスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- Issue 12 は notification path を製品選定より先に owner と一次対応経路で固定する原則を置いている
- Issue 41 は production monitoring baseline を first-response evidence path まで固定したが、external alert tooling と CloudWatch/SNS integration は follow-up として残している
- Issue 44 は alert trigger set、notification owner、first-response notification path を固定したが、provider-specific alert delivery、automatic escalation、24x7 on-call は scope 外として閉じている

## Current Review Notes

- external delivery channel を扱うとしても、Issue 44 の run URL と deployment record を primary path から外さないことが前提である
- delivery destination は owner 付きであることを優先し、無人の mailbox や未監視 channel を enable しない fail-closed rule を維持する必要がある
- provider-specific product の導入判断は、current small-team phase に合う最小範囲に留め、staffing や automatic remediation と切り分けて扱う必要がある

## Implementation Notes

- [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) に Current Production Alert Delivery Baseline と Alert Delivery Scope Boundary を追加し、許可される external delivery channel、delivery owner、fallback、非対象を current monitoring policy に接続した
- [.github/workflows/README.md](.github/workflows/README.md) に Production Alert Delivery Baseline を追加し、workflow evidence path が canonical source のままであること、external destination は pointer channel に限ること、delivery failure 時の扱いを workflow-facing wording として固定した
- [infra/environments/production/README.md](infra/environments/production/README.md) に Production Alert Delivery Snapshot と Production Alert Delivery Operator Direction を追加し、production operator が外部 delivery を使う場合の owner/fallback/fail-closed rule を current operations wording として固定した

## Spot Check Evidence

- monitoring policy wording: [docs/portal/14_MONITORING_POLICY_DRAFT.md](docs/portal/14_MONITORING_POLICY_DRAFT.md) は approved external delivery allowance、delivery owner baseline、delivery failure fallback、scope boundary を alert routing baseline と連続した文脈で保持している
- workflow guidance wording: [.github/workflows/README.md](.github/workflows/README.md) は production deploy run URL、step summary、`portal-production-deployment-record` artifact を canonical incident path としつつ、external destination を optional pointer channel に限定している
- production operator wording: [infra/environments/production/README.md](infra/environments/production/README.md) は external destination の owner 記録、fallback、fail-closed rule を current production operator path として保持している

## Final Review Result

- PASS: production alert delivery channel allowance、delivery owner、delivery failure fallback、scope boundary が monitoring draft、workflow README、production README、issue record で整合しており、Issue 45 の scope では blocking finding はない
- NOTE: 24x7 on-call、automatic remediation、broad chat fan-out、dashboard / SLO-SLI design、provider-specific implementation depth は本 issue では扱わず、operator-managed follow-up として残している

## Process Review Notes

- 2026-03-09 に Issue 45 を follow-up として起票し、initial task contract を GitHub Issue #45 へ同期した
- 同日、monitoring draft、workflow README、production README を同期し、approved external delivery allowance、delivery owner baseline、delivery failure fallback、fail-closed boundary を current operations baseline として整理した
- formal review では Issue 44 の first-response notification path が canonical source のままであること、external delivery destination が optional pointer channel に限定されていること、delivery failure 時に run URL / step summary / `portal-production-deployment-record` artifact へ即時に戻る fail-closed wording が各文書で一貫していることを確認した

## Current Status

- OPEN

- implementation sync と formal review は完了しており、close approval は未実施である

## Dependencies

- Issue 12
- Issue 41
- Issue 42
- Issue 43
- Issue 44