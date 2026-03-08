## Summary

インフラを手作業で構築すると再現性が低くなり、後続の Azure と GCP 展開にも不利になる。

## Goal

OpenTofu を前提にしたインフラ管理方針を定義し、環境差分を管理可能にする。

## Task Contract

```text
タスク契約（監査復元版）

メタデータ
- タスク ID: ISSUE-09
- タイトル: IaC 方針の初期整理
- 記録種別: retrospective audit restoration
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: planning
- 優先度: 高

目的
- 解決する問題: staging から production までを手作業ではなく再現可能な OpenTofu 管理へ寄せるため、管理単位、環境分離、出力値管理、差分の扱いを先に定義する
- 期待する価値: Issue 10 以降の CI/CD、セキュリティ、監視、rollback が ad hoc な console 作業ではなく reviewable な infrastructure contract を前提に設計できる

スコープ
- 含むもの: OpenTofu 管理単位、module と environment の責務分離、staging/production 分離、出力値管理、環境差分管理、state backend と運用ルールの整理
- 含まないもの: 実 apply、production 実装着手、Azure/GCP 用 IaC 実装、secret 実値登録、workflow 実装そのもの
- 編集可能パス: docs/portal/issues/issue-09-iac-policy.md, docs/portal/11_IAC_POLICY_DRAFT.md
- 制限パス: apps/, .github/workflows/, infra/production の実装追加

受け入れ条件
- [x] 条件 1: OpenTofu の管理単位と staging/production 分離の議論を開始できる状態になっている
- [x] 条件 2: Resolution に管理単位、stack 分離、environment isolation、output 方針、manual drift rule が明示されている
- [x] 条件 3: Evidence Mapping と Final Review Result により、close judgment の根拠が追跡可能になっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-09-iac-policy.md, docs/portal/11_IAC_POLICY_DRAFT.md
- アプローチ: Issue 4 の AWS baseline、Issue 7 の no custom API/no application persistence、Issue 8 の cloud-neutral contract を前提に、IaC の責務境界と運用ルールを固める
- 採用しなかった代替案と理由: まず staging を手で作ってから後で IaC 化する案は、再現性と downstream reviewability を壊しやすいため採らない

検証計画
- 実行するテスト: git status --short; GH_PAGER=cat gh issue view 9 --repo PLAYER1-r7/MultiCloudProject --json number,state,title,updatedAt,url
- 確認するログ/メトリクス: TBD
- 失敗時の切り分け経路: Issue 4, Issue 5, Issue 7, Issue 8 の前提に戻り、IaC 議論に runtime multi-cloud parity や backend requirement を混ぜていないか確認する

リスクとロールバック
- 主なリスク: 初期段階で stack を細かく分けすぎて実装速度を落とすこと、または逆に 1 stack に寄せすぎて後続変更の reviewability を落とすこと
- 影響範囲: infra directory layout、state backend 方針、CI/CD workflow 前提、production gate の運用判断
- 緩和策: first-release に必要な最小構造から始めつつ、environment isolation と controlled output だけは先に固定する
- ロールバック手順: 過剰な抽象化が判明した場合は module 分割を最小化し、environment isolation と state/backend rules を最優先の固定点として残す
```

## Tasks

- [x] OpenTofu の管理単位を決定する
- [x] stack 分離方針を決定する
- [x] staging と production の分離方針を決定する
- [x] 出力値管理方針を決定する
- [x] 環境差分の扱いを定義する
- [x] IaC 設計メモを作成する

## Definition of Done

- [x] OpenTofu による管理単位が環境と責務の観点で整理されている
- [x] staging と production の分離方針が明示されている
- [x] modules と environment 定義の役割分担が説明されている
- [x] 出力値と環境差分の扱い方が整理されている
- [x] 手動変更を最小化する運用ルールが含まれている
- [x] 再現可能な構成管理として Issue 10 以降の前提に使える

## Issue 9 Discussion Draft

このセクションは、Issue 9 の議論を始めるためのたたき台である。Issue 4 では AWS baseline を S3 + CloudFront + ACM に絞り、Issue 7 では no custom API / no application persistence を確定し、Issue 8 では app-facing contract を cloud-neutral に保つ方針を確定した。したがって Issue 9 で決めるべきことは「巨大な IaC を今すぐ作る方法」ではなく、「初回リリースの delivery 基盤を reviewable かつ reproducible に保つための最小 IaC 境界」を定義することである。

### 1. 現時点の前提整理

- 初回リリースの AWS baseline は static delivery 中心であり、主要 service は S3、CloudFront、ACM である
- custom API、Lambda、DynamoDB、Cognito は current baseline に含めない
- frontend と app-facing contract は cloud-neutral に保つが、delivery implementation は AWS-first でよい
- staging は先行実装対象だが、production は domain ownership、certificate sourcing、rollback target、state locking が固まるまで gate を維持する

### 2. なぜ Issue 9 で IaC 方針を先に決めるか

提案:

- staging を含めて infrastructure change は OpenTofu 管理を前提に進める
- console 手作業は例外扱いとし、発生した場合も code へ戻す前提にする

理由:

- CI/CD、security、monitoring、rollback は、再現可能な infrastructure shape がないと判断基準がぶれやすい
- staging を手作業で作ると、production に進むときに差分理由が追いにくくなる
- multi-cloud の観点でも、最初に必要なのは provider abstraction ではなく reviewable な infrastructure contract である

### 3. OpenTofu の管理単位のたたき台

提案:

- reusable logic は `infra/modules/` に置く
- environment entrypoint は `infra/environments/<env>/` に置く
- 初期構成は `portal-static-site` のような責務単位 module と environment wiring の組み合わせを基本形とする

現時点の第一案:

- module は再利用可能な delivery building block を表す
- environment directory は state backend、provider 設定、variable binding、module wiring を担う
- まずは static delivery に必要な最小 module 数で開始し、未使用 service を先回りで module 化しない

### 4. stack 分離方針のたたき台

提案:

- 初期段階では「全部入り 1 stack」は避ける
- ただし service ごとに細かく分割しすぎず、review と運用の単位が説明できる最小分割に留める

議論の軸:

- static site delivery の core resources は一緒に review した方がよいか
- state backend bootstrap を delivery stack の外に出すべきか
- 将来の auth や API 追加を見越して、今から別 stack 前提の directory だけは切っておくべきか

現時点の第一案:

- first-release は delivery core を 1 つの責務単位として扱う
- state backend bootstrap は保護対象 stack の外に置く
- future app services 用の stack は validated requirement が出るまで placeholder に留める

### 5. staging と production の分離方針のたたき台

提案:

- staging と production は state、variable、approval path を分離する
- production は staging の ad hoc な値や手順に依存させない

理由:

- staging で動いた手順を人手で production に移植する運用は再現性が低い
- production は rollback、approval ownership、domain/certificate operating model と一体で設計する必要がある
- したがって production directory は存在しても、gate 未解決のうちは placeholder に留める方が安全である

現時点の第一案:

- `infra/environments/staging/` は先行実装対象
- `infra/environments/production/` は gate 完了まで placeholder 維持
- 同一 module を使っても、state key と environment config は共有しない

### 6. 出力値管理方針のたたき台

提案:

- bucket name、distribution id、certificate reference、base URL などの重要出力は明示 output にする
- application-facing value は console から手で写さず、controlled contract として受け渡す

Issue 8 との接続:

- frontend へ渡す値は provider-neutral な役割名で扱う
- provider-specific output が必要でも、delivery 側で neutral contract に変換して渡す

現時点の第一案:

- OpenTofu output は infra-facing truth として記録する
- workflow や app が使う値は、そのまま vendor 名を露出するのではなく usage-oriented name に変換する

### 7. 環境差分の扱いのたたき台

提案:

- 環境差分は variable または per-environment 設定ファイルで表す
- module logic 自体は staging / production で不必要に fork しない

差分候補:

- domain
- certificate reference or validation path
- cache / security policy detail
- tagging / naming suffix

避けたいこと:

- staging 専用ロジックと production 専用ロジックを module 内で分岐だらけにすること
- environment ごとに手作業で console setting を積み上げること

### 8. state backend と locking のたたき台

提案:

- 各 environment は独立した remote state key を持つ
- state backend bootstrap resource は保護対象 stack から分離する
- S3 backend は current staging phase では許容するが、formal locking は production entry 前に明示判断する

理由:

- state key 共有は environment isolation を壊す
- state backend を同じ stack に閉じ込めると障害時の復旧や bootstrap が複雑になる
- operator や workflow が増える前に locking policy を決めないと production 変更の安全性が弱い

### 9. 手動変更を最小化する運用ルールのたたき台

提案:

- OpenTofu change は review 前提にする
- console change は緊急時を除いて避ける
- console change が発生した場合は drift を放置せず code に戻す

補足:

- secrets や sensitive values は frontend code に置かない
- IaC file に固定値として秘密情報を埋め込まない
- CI/CD 側の approval / apply path は Issue 10 で詳細化するが、Issue 9 では「reviewable な IaC change」を前提条件として固定する

### 10. 今回は決めないこと

- Azure / GCP 用の具体 module 設計
- production apply の実運用手順全文
- state locking の最終方式そのもの
- failover や cross-cloud replication の実装設計
- auth や API を含む future service stack の詳細分割

この切り分けを置く理由:

- 今の論点は first-release IaC boundary であり、future platform parity ではないため
- 後続 issue の責務を先食いすると、staging を動かすための最小判断がぼやけるため

### 11. 議論開始用の暫定結論

- IaC は OpenTofu を前提に進める
- reusable module と environment entrypoint を分ける
- staging と production は state と config を分離する
- production は gate 条件が揃うまで placeholder に留める
- output は controlled に管理し、app-facing value は neutral contract へ変換する
- environment 差分は variable / per-environment config で表し、module logic の不必要な fork は避ける

### 12. この場で確認したい論点

`Resolution 確定文言` 列が埋まっていない行がある場合は Resolution セクションを書いてはならない。

| 論点                                                                                                                  | 判断方向（Discussion 時点の仮）                                | Resolution 確定文言                                                         |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| first-release の delivery core は 1 module / 1 stack 相当で始めてよいか                                               | Yes。最小責務単位でまとめる                                    | `first-release の delivery core は 1 つの責務単位として扱い`                |
| state backend bootstrap を delivery stack の外に置く方針で問題ないか                                                  | Yes。保護対象外で独立管理                                      | `state backend bootstrap resource は保護対象 stack の外に置き`              |
| production directory は gate 完了まで placeholder 維持でよいか                                                        | Yes。gate 完了まで実装しない                                   | `infra/environments/production は ... gate が閉じるまで placeholder とする` |
| app や workflow が利用する出力値は、provider-specific output をそのまま渡さず neutral contract に変換する前提でよいか | Yes。app-facing value は neutral contract 経由                 | `usage-oriented かつ必要に応じて provider-neutral な contract に変換する`   |
| state locking の最終方式は後続判断に回しつつ、production entry criterion としては先に必須条件へ置いてよいか           | Yes。判断延期、ただし production gate の必須条件として先行記録 | `production entry 前に必須決定事項として扱う`（追跡先: Issue 10）           |

### 13. Resolution Trace For The Open Questions

このセクションの内容は `12. この場で確認したい論点` の表（Resolution 確定文言列）に統合した。各論点と Resolution の対応は Section 12 の表を参照すること。

## Resolution

Issue 9 の判断結果は次の通りとする。

- IaC は OpenTofu を標準手段として採用し、staging 以降の infrastructure change は reviewable な code change を基本経路とする
- repository 構造は `infra/modules/` を reusable module、`infra/environments/<env>/` を environment entrypoint とする二層構造を基本にする
- first-release の delivery core は 1 つの責務単位として扱い、static delivery に必要な resource を review しやすい最小単位でまとめる
- state backend bootstrap resource は保護対象 stack の外に置き、environment ごとに独立した remote state key を使う
- staging と production は state、variable、approval path、environment config を分離し、production は staging の ad hoc 値や手順に依存させない
- `infra/environments/staging/` は先行実装対象とし、`infra/environments/production/` は domain ownership、certificate sourcing、rollback target、state locking の gate が閉じるまで placeholder とする
- output は明示的に管理し、app や workflow が利用する値は provider-specific な表現をそのまま露出させず、usage-oriented かつ必要に応じて provider-neutral な contract に変換する
- environment 差分は variable または per-environment 設定で表し、module logic の不必要な fork を避ける
- console change は緊急時の例外対応に限定し、発生した場合も drift を放置せず IaC へ還元する
- state locking の最終方式はこの Issue では固定せず後続判断に回すが、production entry 前に必須決定事項として扱う

この合意案で明確になること:

- Issue 10 以降は IaC 前提の CI/CD、security、monitoring、rollback を議論できる
- staging を先に進めつつ、production への premature implementation を防げる
- AWS-first 実装を許容しながら、app-facing contract と environment isolation の品質を保てる

Issue 10 以降への引き継ぎ観点:

- CI/CD では review 済み IaC change を apply path の前提条件に置く
- security review では secret の配置禁止と manual drift 抑制を前提にする
- monitoring と rollback では environment ごとの独立 state と output 管理を前提にする
- production workflow は gate 条件が確定するまで staging 停止線を越えない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 9 final review, the local issue record is the primary evidence source. [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) is supporting background and rationale, not the sole proof of checklist completion.

### Task Mapping

| Checklist item                               | Primary evidence section                                                                                                                                                                  | Why this is the evidence                                                                                                                                                    | Review state              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `OpenTofu の管理単位を決定する`              | `3. OpenTofu の管理単位のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)              | These sections define the module plus environment entrypoint model, show how the open question was resolved, and record that OpenTofu is the standard management path.      | Accepted for final review |
| `stack 分離方針を決定する`                   | `4. stack 分離方針のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)                   | These sections explain the minimum-responsibility stack direction, connect it to the resolved question, and separate bootstrap concerns from protected stacks.              | Accepted for final review |
| `staging と production の分離方針を決定する` | `5. staging と production の分離方針のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md) | These sections state that staging and production must keep separate state, config, and approval paths and show that production remains gated by resolved criteria.          | Accepted for final review |
| `出力値管理方針を決定する`                   | `6. 出力値管理方針のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)                   | These sections define explicit outputs, connect the provider-neutral contract decision to a resolved question, and prohibit manual copying as the main path.                | Accepted for final review |
| `環境差分の扱いを定義する`                   | `7. 環境差分の扱いのたたき台`, `8. state backend と locking のたたき台`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)       | These sections describe how environment differences are represented and how state isolation is preserved without forking module logic unnecessarily.                        | Accepted for final review |
| `IaC 設計メモを作成する`                     | `Issue 9 Discussion Draft`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)                      | Together these sections now serve as the planning memo that records the management boundary, explicit question disposition, operational rules, and downstream implications. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                              | Primary evidence section                                                                                                                                                                               | Why this is the evidence                                                                                                                                                                                                     | Review state              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `OpenTofu による管理単位が環境と責務の観点で整理されている` | `3. OpenTofu の管理単位のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)                           | These sections organize infrastructure by reusable responsibility and environment entrypoint rather than manual setup or a single undifferentiated stack.                                                                    | Accepted for final review |
| `staging と production の分離方針が明示されている`          | `5. staging と production の分離方針のたたき台`, `8. state backend と locking のたたき台`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)  | These sections explicitly separate environment state, config, and gate conditions and prohibit production from depending on staging ad hoc values.                                                                           | Accepted for final review |
| `modules と environment 定義の役割分担が説明されている`     | `3. OpenTofu の管理単位のたたき台`, `Resolution`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md)                                                                         | The issue-local sections describe `infra/modules` as reusable logic and `infra/environments/<env>` as the location for provider settings, variables, state, and module wiring, while the draft remains supporting rationale. | Accepted for final review |
| `出力値と環境差分の扱い方が整理されている`                  | `6. 出力値管理方針のたたき台`, `7. 環境差分の扱いのたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md) | These sections define explicit outputs, controlled export rules, and variable-driven environment differences without unnecessary module forks.                                                                               | Accepted for final review |
| `手動変更を最小化する運用ルールが含まれている`              | `2. なぜ Issue 9 で IaC 方針を先に決めるか`, `9. 手動変更を最小化する運用ルールのたたき台`, and `Resolution` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md) | These sections state that OpenTofu changes are review-first, console changes are exceptional, and any drift must be returned to code.                                                                                        | Accepted for final review |
| `再現可能な構成管理として Issue 10 以降の前提に使える`      | `Resolution`, `Issue 10 以降への引き継ぎ観点`, and `Current Status` in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md)                                          | These sections define enough IaC structure and downstream constraints for CI/CD, security, monitoring, and rollback planning to proceed on top of a reproducible base.                                                       | Accepted for final review |

### Final Review Rule For Issue 9

- The presence of mapped evidence is not by itself enough to check the box.
- Final checkbox review should confirm that the mapped section still reflects the latest agreed wording.
- If a mapped section changes materially, the table should be rechecked before marking the checklist item complete.
- If the local issue definition changes after the last remote sync, the GitHub issue body should be synced again before close or any equivalent final-state transition.

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-09-iac-policy.md](docs/portal/issues/issue-09-iac-policy.md), with [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) used as supporting background. The table below records the document-level validation judgment. Human close approval remains a separate action.

| Checklist area                  | Final judgment | Evidence basis                                                                                                                                                                                                                                   |
| ------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Management unit decision        | Satisfied      | `3. OpenTofu の管理単位のたたき台`, `Resolution`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm the module plus environment-entrypoint model as the default IaC shape.                                    |
| Stack separation decision       | Satisfied      | `4. stack 分離方針のたたき台`, `8. state backend と locking のたたき台`, and `Resolution` confirm a minimum reviewable split with bootstrap concerns kept outside protected stacks.                                                              |
| Environment isolation decision  | Satisfied      | `5. staging と production の分離方針のたたき台`, `Resolution`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm that staging and production keep separate state, config, and gate conditions.                |
| Output and contract decision    | Satisfied      | `6. 出力値管理方針のたたき台`, `Resolution`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm explicit outputs and controlled export rules, including neutralized app-facing contracts where needed.         |
| Environment difference handling | Satisfied      | `7. 環境差分の扱いのたたき台`, `8. state backend と locking のたたき台`, and `Resolution` confirm variable-driven differences and independent environment state keys without unnecessary module forks.                                           |
| Operational rule decision       | Satisfied      | `2. なぜ Issue 9 で IaC 方針を先に決めるか`, `9. 手動変更を最小化する運用ルールのたたき台`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm review-first IaC changes and exception-only console operations. |
| Downstream readiness            | Satisfied      | `Resolution`, `Issue 10 以降への引き継ぎ観点`, and [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) confirm that Issue 10 and later planning can build on the agreed reproducible infrastructure contract.               |

## Process Review Notes

- The Task Contract in this file is a retrospective audit-restoration record and should not be read as proof that every planning gate occurred in strict chronological order.
- This issue was hardened from discussion draft to final review format during the planning flow, so the current structure should be read as a consolidated planning record.
- The open questions listed in `12. この場で確認したい論点` were not answered one by one in a separate discussion log before the resolution was finalized; instead, the resolution was fixed by direct decision flow after the user requested to proceed to the next stage.
- A question-resolution table has been embedded in `12. この場で確認したい論点` so later reviewers can map each open question to the final wording that absorbed it. `13. Resolution Trace For The Open Questions` now redirects to that table.
- The resulting resolution still covers those open questions substantively, but the record should be read as a direct-decision planning close rather than a fully expanded question-by-question discussion transcript.
- Final review output is separated from evidence mapping so later reviewers can distinguish completion judgment from source locations.

## Current Status

- [docs/portal/11_IAC_POLICY_DRAFT.md](docs/portal/11_IAC_POLICY_DRAFT.md) を IaC 判断の中心文書として扱う
- local issue file には task contract、discussion draft、resolution、evidence mapping、final review result を追加済み
- open questions と final wording の対応は `12. この場で確認したい論点` の Resolution 確定文言列に明示した
- 初回リリースの IaC judgment は `OpenTofu as default path`, `module plus environment separation`, `environment isolation`, and `production gate retention` で確定した
- management unit、stack separation、output handling、environment difference、state/backend rule の各論点は後続 issue へ引き継げる粒度で文書化した
- state locking の後続追跡先は Issue 10 の production precondition 整理に接続した
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- GitHub Issue 9 は local issue file 同期後に close し、Issue 9 は完了と判断する

## Dependencies

- Issue 4
- Issue 5
- Issue 7
