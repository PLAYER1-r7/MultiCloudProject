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

- [x] IaC policy draft に state backend と locking direction を追加する
- [x] IaC policy draft に production entry criteria を追加する
- [x] IaC policy draft に current decision status を追加する
- [x] production README に placeholder guardrail を追加する
- [x] production 着手を block している未決事項を issue 記録へ残す
- [x] staging completed state と production deferred state の境界を明記する

## Definition of Done

- [x] production 着手の前提条件が文書から読み取れる
- [x] production README が placeholder 維持の理由を説明している
- [x] external DNS 前提が Route 53 前提と混同されない
- [x] state locking 未決で production 実装を進めない方針が明記されている
- [x] partial production wiring を避ける guardrail が記載されている
- [x] 本 issue ファイルが未決事項と更新対象を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に State Backend And Locking Direction を追加し、environment ごとの remote state 分離、S3 backend の暫定運用、formal locking decision を production 前提条件として明記した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に Production Entry Criteria を追加し、staging 完了だけでは production entrypoint work を開始しないこと、domain ownership、certificate sourcing、rollback target、state locking の決定が先行条件であることを整理した
- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に Current Decision Status を追加し、external DNS operating model、DNS validation を伴う certificate sourcing、state locking 未決による production IaC block を未決事項として固定した
- [infra/environments/production/README.md](infra/environments/production/README.md) に Current Guardrail を追加し、production directory を placeholder のまま維持する理由と、partial production wiring を禁止する条件を残した
- 本 issue 記録には production 着手を block している未決事項と、staging completed state と production deferred state の境界条件を追跡できるようにした

## Current Review Notes

- IaC policy draft を primary evidence にして production README を補助文書として揃える構成にしたため、placeholder を維持する理由と未決事項の判断根拠を一貫して読める
- external DNS operating model を Route 53 前提から切り離して明示しており、certificate sourcing も external DNS validation flow と一体で設計すべき前提になっている
- state locking が未決のままでは production 実装へ進めないことを policy と README の両方で確認でき、staging completed state と production deferred state の境界が明確になっている
- CloudSonnet とのレビューでは、Issue 20 の記載内容に blocking issue はなく、このまま issue 記録を更新して進めてよいことを確認した

## Spot Check Evidence

Issue 20 の final review 前に、production entry guardrail が想定どおり揃っているかを spot check した結果を残す。

- locking direction: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に environment ごとの state 分離、暫定的な serialized operation、formal locking decision の必要性が記載されている
- production entry criteria: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に domain ownership、certificate sourcing、rollback target、state locking を production 着手前の決定項目として整理している
- decision status: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に external DNS operating model と state locking 未決の扱いが current decision status として記録されている
- placeholder guardrail: [infra/environments/production/README.md](infra/environments/production/README.md) に placeholder 維持と partial production wiring 禁止が明記されている
- boundary statement: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) は staging infrastructure の存在だけで production entrypoint work を始めないことを明示している
- diagnostics: [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[infra/environments/production/README.md](infra/environments/production/README.md)、[docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 20 final review, the local issue record is the primary evidence source. [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) provides the planning and guardrail rationale, while [infra/environments/production/README.md](infra/environments/production/README.md) provides the environment-entry placeholder rule.

### Task Mapping

| Checklist item                                                          | Primary evidence section                                                                                                                                                                            | Why this is the evidence                                                                                                           | Review state              |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `IaC policy draft に state backend と locking direction を追加する`     | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                         | These sources show the remote state separation rule, temporary serialized control, and required formal locking decision.           | Accepted for final review |
| `IaC policy draft に production entry criteria を追加する`              | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                 | These sources show the explicit production entry criteria and the decision items that must be resolved first.                      | Accepted for final review |
| `IaC policy draft に current decision status を追加する`                | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                 | These sources show the unresolved production decisions, including external DNS and state locking.                                  | Accepted for final review |
| `production README に placeholder guardrail を追加する`                 | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/production/README.md](infra/environments/production/README.md)                                                               | These sources show the environment README now explains why the directory stays a placeholder and what must not be added yet.       | Accepted for final review |
| `production 着手を block している未決事項を issue 記録へ残す`           | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md) | These sections keep the unresolved decision list and review rationale inside the issue record itself.                              | Accepted for final review |
| `staging completed state と production deferred state の境界を明記する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                 | These sources show that staging completion does not imply production entry and that unresolved decisions keep production deferred. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                       | Primary evidence section                                                                                                                                                                                                                | Why this is the evidence                                                                                          | Review state              |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `production 着手の前提条件が文書から読み取れる`                      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                                     | These sources confirm the production entry criteria are explicitly documented.                                    | Accepted for final review |
| `production README が placeholder 維持の理由を説明している`          | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                   | These sources confirm the README states why the directory remains a placeholder.                                  | Accepted for final review |
| `external DNS 前提が Route 53 前提と混同されない`                    | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                                     | These sources confirm the production domain model is stated as external DNS rather than Route 53 source-of-truth. | Accepted for final review |
| `state locking 未決で production 実装を進めない方針が明記されている` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md), and [infra/environments/production/README.md](infra/environments/production/README.md) | These sources confirm unresolved state locking keeps production implementation blocked.                           | Accepted for final review |
| `partial production wiring を避ける guardrail が記載されている`      | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/production/README.md](infra/environments/production/README.md)                                                                                                   | These sources confirm the README explicitly prohibits partial production wiring before the design gate is closed. | Accepted for final review |
| `本 issue ファイルが未決事項と更新対象を追跡できる状態になっている`  | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md)                | These sections keep the change scope, unresolved decisions, and validation basis inside the issue record.         | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md), with [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) used as the primary planning evidence and [infra/environments/production/README.md](infra/environments/production/README.md) used as the environment-entry guardrail evidence. CloudSonnet review did not identify blocking issues in the current wording. Explicit issue close approval is recorded in Process Review Notes.

| Checklist area                      | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                             |
| ----------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State backend and locking direction | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm state separation, temporary serialized operation, and the need for a formal locking decision before production changes.                                                |
| Production entry criteria           | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm the decision items required before production entrypoint work begins.                                                                          |
| Current unresolved decision status  | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm external DNS and unresolved state locking are documented as active constraints.                                                                |
| Placeholder guardrail clarity       | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [infra/environments/production/README.md](infra/environments/production/README.md) confirm the directory remains a placeholder and prohibits partial production wiring.                                                                                 |
| Staging/production boundary         | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm staging completion does not automatically authorize production implementation.                                                                 |
| Issue record traceability           | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md) confirm the issue record now tracks scope, unresolved items, and review evidence. |

## Process Review Notes

- Issue 20 は production planning を block している未決事項を IaC policy draft と production README の両方に記録し、local issue record、spot check、evidence mapping、final review result の順で close 判断に必要な記録を揃えた。
- final checkbox review は [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)、[infra/environments/production/README.md](infra/environments/production/README.md)、[docs/portal/issues/issue-20-production-entry-guardrails.md](docs/portal/issues/issue-20-production-entry-guardrails.md) を根拠に完了している。
- 承認形式: 外部レビュー確認後の明示承認。
- 外部レビュー根拠: ユーザー発言「CloudeSonnetとのレビューで問題ないことが確認できたので」。
- Issue 20 close 実行承認: ユーザー発言「CloudeSonnetとのレビューで問題ないことが確認できたのでCloseを進めてください。」（2026-03-08 セッション）

## Current Status

- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) に production entry criteria、state backend and locking direction、current decision status が追加されている
- [infra/environments/production/README.md](infra/environments/production/README.md) に placeholder guardrail が追加されている
- 対象 3 ファイルに editor diagnostics は発生していない
- local issue record 上の Tasks、Definition of Done、evidence mapping、final review result は更新済みである
- explicit close approval は Process Review Notes に記録済みであり、現時点では close 実行可能な状態として扱う

## Dependencies

- Issue 9
- Issue 17
- Issue 18
