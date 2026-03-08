## Summary

staging delivery path が成立した後も、production 着手条件が曖昧なままだと partial wiring と未決事項の持ち込みが起きやすくなる。

## Goal

production entrypoint に入る前のガードレールと未決事項を文書化する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-20
- タイトル: production entry 条件とガードレールを明文化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal infra/docs
- 対象環境: production planning
- 優先度: 中
- 先行条件: Issue 17 closed, Issue 18 closed

目的
- 解決する問題: production IaC と運用条件の未決事項が明示されていないと、staging 成果物の延長で partial production wiring を追加してしまうリスクがある
- 期待する価値: domain ownership、certificate sourcing、approval ownership、rollback target、state locking などの前提を明記することで、production 作業の開始条件を判断可能にする

スコープ
- 含むもの: IaC policy draft の production entry criteria 追記、production README の placeholder guardrail 追記、未決事項の整理
- 含まないもの: production OpenTofu 実装、DNS 設計の確定、certificate 発行手順の実装、locking mechanism の導入
- 編集可能パス: docs/portal/11_IAC_POLICY_DRAFT.md, infra/environments/production/README.md, docs/portal/issues/issue-20-production-entry-guardrails.md
- 制限パス: infra/environments/production/*.tf, deployed staging resources, workflow implementation files

受け入れ条件
- [ ] 条件 1: production 着手前に決めるべき項目が IaC policy draft に整理されている
- [ ] 条件 2: production README が placeholder を維持する理由と禁止事項を説明している
- [ ] 条件 3: external DNS 前提と state locking 未決の扱いが明文化されている

実装計画
- 変更見込みファイル: docs/portal/11_IAC_POLICY_DRAFT.md, infra/environments/production/README.md, docs/portal/issues/issue-20-production-entry-guardrails.md
- アプローチ: production をまだ実装しない理由を policy と README の両方に残し、entry criteria を先に文書化して partial rollout を防ぐ
- 採用しなかった代替案と理由: production README に短い注意書きだけを置く案は、なぜ block されているかの判断根拠が弱くなるため採らない

検証計画
- 実行するテスト: read-through review of policy and production README; get_errors on edited markdown files
- 確認するログ/メトリクス: consistency between production placeholder wording and IaC policy draft; explicit mention of unresolved decisions
- 失敗時の切り分け経路: docs/portal/11_IAC_POLICY_DRAFT.md を主文書として見直し、production README の guardrail wording をそれに合わせて再調整する

リスクとロールバック
- 主なリスク: guardrail が強すぎて後続の production planning に必要な柔軟性まで失うこと
- 影響範囲: infra planning, production readiness discussions, environment README guidance
- 緩和策: 実装禁止ではなく entry criteria と unresolved decisions の明示に主眼を置く
- ロールバック手順: production planning が確定したら placeholder guardrail を段階的に置き換え、README の block wording を実装前提へ更新する
```

## Tasks

- [ ] IaC policy draft に state backend と locking direction を追加する
- [ ] IaC policy draft に production entry criteria を追加する
- [ ] IaC policy draft に current decision status を追加する
- [ ] production README に placeholder guardrail を追加する
- [ ] production 着手を block している未決事項を issue 記録へ残す
- [ ] staging completed state と production deferred state の境界を明記する

## Definition of Done

- [ ] production 着手の前提条件が文書から読み取れる
- [ ] production README が placeholder 維持の理由を説明している
- [ ] external DNS 前提が Route 53 前提と混同されない
- [ ] state locking 未決で production 実装を進めない方針が明記されている
- [ ] partial production wiring を避ける guardrail が記載されている
- [ ] 本 issue ファイルが未決事項と更新対象を追跡できる状態になっている

## Current Draft Focus

- staging が完了しても production 実装に自動移行しない境界条件を明示する
- production planning に必要な決定項目を README の注意書きではなく policy と issue 記録の両方で残す
- 未決事項が解消されるまでは production directory を placeholder として扱うルールを固定する

## Dependencies

- Issue 9
- Issue 17
- Issue 18
