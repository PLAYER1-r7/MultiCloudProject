## Summary

staging-first の rollback readiness と artifact retention evidence は揃ってきたが、production promotion 時にどの状態を rollback target として採用するかが current decision として固定されていないままだと、production gate の remaining blocker が rollback 側で曖昧なまま残る。

## Goal

production rollback target baseline を明文化し、last known-good artifact、staging-validated promotion candidate、artifact evidence path、post-rollback verification boundary を current decision として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-35
- タイトル: production rollback target baseline を明文化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: production rollout planning
- 優先度: 中
- 先行条件: Issue 14 closed, Issue 20 closed, Issue 26 closed, Issue 27 closed, Issue 28 closed, Issue 33 closed, Issue 34 closed

目的
- 解決する問題: production promotion 前に rollback target が current decision として固定されていないと、artifact retention と release evidence が揃っていても、どの build を復旧対象とみなすか、どこまでを rollback baseline として fail-closed に扱うかが文書から読めない
- 期待する価値: production rollback target を staging delivery path で検証済みの last known-good artifact に固定し、artifact evidence と post-rollback verification の責務境界を production gate 文書へ同期できる

スコープ
- 含むもの: product / architecture / IaC / CI/CD / production README wording の同期、issue 記録への根拠整理
- 含まないもの: production deploy workflow 追加、artifact restore automation 実装、DNS cutover rollback 手順の詳細化、production apply 実行、incident runbook の全面実装
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-35-production-rollback-target-baseline.md
- 制限パス: infra/environments/production/main.tf, infra/environments/production/variables.tf, infra/environments/production/outputs.tf, .github/workflows/*.yml, apps/portal-web/**, docs/portal/16_ROLLBACK_POLICY_DRAFT.md, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: production rollback target baseline が staging-validated last known-good artifact を current decision として含めて読める
- [ ] 条件 2: artifact evidence path と post-rollback verification boundary が product / policy / workflow / environment 文書で整合している
- [ ] 条件 3: DNS cutover rollback や automation 実装を本 issue に混ぜず、production rollback target baseline だけにスコープを限定できている

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/06_AWS_ARCHITECTURE_DRAFT.md, docs/portal/11_IAC_POLICY_DRAFT.md, docs/portal/12_CICD_POLICY_DRAFT.md, .github/workflows/README.md, infra/environments/production/README.md, docs/portal/issues/issue-35-production-rollback-target-baseline.md
- アプローチ: Issue 14 の rollback policy、Issue 26 の staging rollback readiness、Issue 27 の artifact retention / release evidence、Issue 28 の production gate baseline を接続し、production rollback target を staging-validated artifact baseline として固定する
- 採用しなかった代替案と理由: production DNS rollback や automatic rollback を同時に詳細化する案は、cutover execution details と production rollout implementation を混在させて scope を広げるため採らない

検証計画
- 実行するテスト: markdown review; grep for rollback target wording drift; get_errors on edited files
- 確認するログ/メトリクス: last known-good artifact wording、staging-validated promotion candidate wording、artifact evidence path wording、post-rollback verification wording の整合
- 失敗時の切り分け経路: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md、docs/portal/06_AWS_ARCHITECTURE_DRAFT.md、docs/portal/11_IAC_POLICY_DRAFT.md、docs/portal/12_CICD_POLICY_DRAFT.md、.github/workflows/README.md、infra/environments/production/README.md を照合し、rollback target baseline と operator boundary のどこがずれているかを分ける

リスクとロールバック
- 主なリスク: rollback target baseline の明文化が production DNS rollback や full incident runbook まで確定したように読まれること
- 影響範囲: production gate wording、promotion approval expectation、future rollout / recovery planning
- 緩和策: wording を last known-good artifact、artifact evidence path、post-rollback verification boundary に限定し、DNS reversal と automation detail は operator-managed follow-up として残す
- ロールバック手順: rollback target baseline が current artifact retention / evidence path と衝突すると判明した場合は current decision wording を deferred state に戻し、別 issue で再整理する
```

## Tasks

- [ ] production rollback target baseline を production gate 文書へ同期する
- [ ] artifact evidence path と post-rollback verification boundary を揃える
- [ ] staging-validated promotion candidate と rollback target の関係を production 文脈で明記する
- [ ] issue 記録へ根拠と非対象を残す

## Definition of Done

- [ ] rollback target baseline が staging-validated last known-good artifact を current decision として読める
- [ ] artifact evidence path と post-rollback verification boundary が複数文書で整合している
- [ ] production rollback target baseline が DNS cutover rollback や automation detail と分離されている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Current Status

- OPEN

- production README には rollback target baseline の文言が存在するが、product / architecture / IaC / CI/CD の current decision snapshot までは未同期である
- artifact retention evidence と staging rollback readiness は揃っているが、production rollback target baseline は後続 issue として残っている
- production rollout implementation と cutover execution details は本 issue の外に残す

## Dependencies

- Issue 14
- Issue 20
- Issue 26
- Issue 27
- Issue 28
- Issue 33
- Issue 34
