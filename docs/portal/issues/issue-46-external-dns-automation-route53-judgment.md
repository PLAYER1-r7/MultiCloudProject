## Summary

Issue 42 で external DNS cutover と reversal の operator sequence は固定できたが、authoritative DNS を今後も external DNS のまま維持するのか、Route 53 へ移行するのか、あるいは DNS write automation をどこまで許可するのかは current judgment として未固定のままである。このままだと、次に DNS 改善を進める際に operator helper、authoritative write automation、Route 53 migration の境界が崩れ、small-team phase の fail-closed rule が壊れやすい。

## Goal

external DNS automation / Route 53 migration judgment を実運用レベルで固め、current source-of-truth、許可する automation 範囲、非採用とする migration path、scope boundary を current operations record として同期する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-46
- タイトル: external DNS automation / Route 53 migration judgment を実運用レベルで固める
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production external DNS governance
- 優先度: 中
- 先行条件: Issue 34 closed, Issue 38 closed, Issue 42 closed, Issue 45 closed

目的
- 解決する問題: external DNS cutover sequence は固定されたが、current phase で authoritative DNS を external DNS のまま維持するのか、Route 53 migration を判断するのか、DNS write automation をどこまで許可するのかが未固定だと、改善作業のたびに source-of-truth と fail-closed boundary がぶれやすい
- 期待する価値: external DNS source-of-truth、Route 53 非採用判断、許可する operator-assist automation、禁止する authoritative write automation を current judgment として固定し、small-team phase の DNS governance を曖昧にしない

スコープ
- 含むもの: source-of-truth judgment、Route 53 migration judgment、許可する automation 範囲、workflow / IaC / operator docs への同期、issue 記録への根拠整理
- 含まないもの: DNS provider credentials 管理、DNS provider API 実装、Route 53 hosted zone 作成、full DNS automation 実装、multi-account DNS design、GCP/Azure DNS design
- 編集可能パス: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-46-external-dns-automation-route53-judgment.md
- 制限パス: apps/portal-web/**, infra/environments/production/*.tf, .github/workflows/*.yml, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: current source-of-truth と Route 53 migration judgment が文書から一意に読める
- [ ] 条件 2: 許可する automation と禁止する authoritative write automation の境界が workflow / IaC / operator 文脈で接続して読める
- [ ] 条件 3: provider credential detail や full DNS automation 実装を混ぜず、judgment baseline に限定できている

実装計画
- 変更見込みファイル: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-46-external-dns-automation-route53-judgment.md
- アプローチ: Issue 34 の domain ownership baseline、Issue 42 の external DNS operations memo、Issue 45 の fail-closed alert delivery baseline を接続し、current phase の DNS governance を external DNS source-of-truth 維持 + Route 53 非採用 + operator-assist only automation として固定する
- 採用しなかった代替案と理由: Route 53 migration を先に採る案は current production operating model と ownership boundary を崩すため採らない。workflow から authoritative DNS writes まで進める案も provider credential boundary と rollback risk を広げるため採らない

検証計画
- 実行するテスト: markdown review; grep for Route 53 / automation wording drift; get_errors on edited files
- 確認するログ/メトリクス: source-of-truth wording、Route 53 judgment wording、automation boundary wording、scope boundary wording の整合
- 失敗時の切り分け経路: docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md、docs/portal/issues/issue-34-production-domain-ownership-baseline.md、docs/portal/issues/issue-42-external-dns-operations-memo.md、docs/portal/issues/issue-45-production-alert-delivery-baseline.md を照合し、source-of-truth、automation、migration judgment のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: judgment baseline の記録が full DNS automation 実装や Route 53 migration 実施済みであるかのように誤読されること
- 影響範囲: production DNS governance、workflow responsibility、incident rollback safety
- 緩和策: wording を source-of-truth、allowed assistive automation、disallowed authoritative writes、Route 53 non-adoption judgment に限定し、implementation depth は follow-up に残す
- ロールバック手順: judgment scope が広がりすぎた場合は source-of-truth と non-adoption judgment だけを残し、assistive automation detail は別 issue に切り出す
```

## Tasks

- [x] current external DNS source-of-truth と Route 53 migration judgment を固定する
- [x] 許可する operator-assist automation と禁止する authoritative write automation を整理する
- [x] workflow / IaC / operator docs に同じ fail-closed boundary を同期する
- [x] judgment baseline の根拠と検証方針を issue 記録へ残す

## Definition of Done

- [x] current source-of-truth、Route 53 judgment、automation boundary が同じ文脈で読める
- [x] authoritative write automation を current phase で採らない理由が workflow / IaC / operator path で整合している
- [x] provider credential detail と full automation 実装がスコープ外として維持されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Initial Notes

- Issue 34 は production custom-domain path を external DNS ownership model で固定し、Route 53 ownership への移行は current model に含めていない
- Issue 42 は cutover / reversal sequence を固定したが、DNS automation と Route 53 migration は follow-up として残している
- current phase で必要なのは DNS writes の自動化ではなく、source-of-truth と fail-closed boundary を崩さない改善判断である

## Current Review Notes

- current phase の automation は operator-assist に限定し、authoritative DNS writes を workflow / IaC の責務へ持ち込まないことが前提である
- Route 53 migration を採るなら domain ownership、credential boundary、rollback path を再設計する必要があり、現時点の small-team phase では優先しない方が整合的である
- current judgment は「外部 DNS を残したまま人が危険操作を制御する」方向であり、「手順を完全自動化する」方向ではない

## Implementation Notes

- [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) に Current External DNS Governance Judgment を追加し、external DNS を authoritative source-of-truth として維持すること、Route 53 非採用判断、operator-assist only automation を architecture judgment として固定した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に external DNS governance judgment と IaC の禁止境界を追記し、reviewed values の surfacing は許可しつつ live DNS writes は apply contract 外であることを current decision status と operational rules に同期した
- [.github/workflows/README.md](.github/workflows/README.md) に External DNS Automation Judgment を追加し、workflow が emit できるのは handoff / evidence / guidance に限り、authoritative DNS writes と Route 53 migration は workflow contract 外であることを固定した
- [infra/environments/production/README.md](infra/environments/production/README.md) に External DNS Automation Judgment Snapshot と Operator Direction を追加し、production operator が helper automation を使う場合の fail-closed boundary を current operations wording として固定した

## Spot Check Evidence

- architecture wording: [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) は external DNS source-of-truth 維持、Route 53 非採用、allowed assistive automation を同じ judgment 文脈で保持している
- IaC wording: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) は reviewed values の surfacing と live DNS write 禁止を current decision status / operational rules で整合して保持している
- workflow wording: [.github/workflows/README.md](.github/workflows/README.md) は DNS handoff support と authoritative write prohibition を current workflow contract として保持している
- operator wording: [infra/environments/production/README.md](infra/environments/production/README.md) は helper automation、manual approval boundary、Route 53 migration 非対象を production operator path として保持している

## Final Review Result

- PASS: current source-of-truth、Route 53 non-adoption judgment、allowed operator-assist automation、disallowed authoritative writes、scope boundary が architecture / IaC / workflow / production README / issue record で整合しており、Issue 46 の scope では blocking finding はない
- NOTE: DNS provider credentials 管理、provider API 実装、Route 53 hosted zone creation、full DNS automation、multi-account DNS design は本 issue では扱わず、operator-managed follow-up として残している

## Process Review Notes

- 2026-03-09 に Issue 46 を follow-up として起票し、initial task contract を GitHub Issue #46 へ同期する前提の local issue record を作成した
- 同日、architecture draft、IaC policy、workflow README、production README を同期し、external DNS source-of-truth 維持、Route 53 非採用判断、operator-assist only automation、authoritative write prohibition を current judgment baseline として整理した
- formal review では external DNS cutover / reversal memo と衝突せず、helper automation が approval boundary を置き換えないこと、Route 53 migration が current production path の shortcut として扱われていないこと、live DNS writes が workflow / IaC contract 外として一貫していることを確認した

## Current Status

- OPEN

- implementation sync と formal review は完了しており、close approval は未実施である

## Dependencies

- Issue 34
- Issue 38
- Issue 42
- Issue 45