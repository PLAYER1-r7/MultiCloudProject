# AI エージェント文書セット開始点

## 目的

このフォルダは、AIエージェントが自律開発を進めるための運用文書セットです。
人向けの長文説明ではなく、短い手順、判断基準、テンプレートを優先します。

このフォルダは、エージェントの作業手順、停止条件、引き継ぎ、運用判断の基準に使います。
製品実装の詳細は `docs/`、GitHub 運用は `.github/` を参照します。

## 推奨読書順

1. 02_AUTONOMOUS_DEV_PROTOCOL.md
2. 03_TASK_CONTRACT_TEMPLATE.md
3. 04_DEFINITION_OF_DONE.md
4. 08_ESCALATION_AND_HANDOFF.md
5. 09_DOCSET_SYNC_RULES.md
6. 14_CRITICAL_GUARDRAILS_EXTRACT.md
7. 15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md
8. 16_TEST_AND_DEPLOY_QUICK_REF.md

## 参照マップ

必要に応じて以下を参照します。

- ツール基準、認証確認、サービス前提: 06_TOOLING_AND_SERVICES.md, 17_AUTH_REQUEST_PLAYBOOK.md
- 実装前後のセルフチェック: 07_AUTONOMOUS_WORKFLOW_CHECKLIST.md
- 正規 Execution Record と handoff 形式: 08_ESCALATION_AND_HANDOFF.md
- reviewer と approval owner の役割境界: ROLE_HANDOFF_OWNERSHIP.md
- タイムアウト変更のようなアプリ固有の運用判断: 20_MANUAL_DEPLOY_DECISION_CRITERIA.md
- GitHub 運用: 25_GITHUB_GOVERNANCE_QUICK_REF.md から 27_GITHUB_OPERATIONS_COMMANDS.md
  Issue タグの正規化やタグ選定を伴う場合は 27_GITHUB_OPERATIONS_COMMANDS.md を使う
- 監視/障害対応: 18_INCIDENT_TRIAGE_RUNBOOK.md から 29_ONCALL_MONITORING_ONEPAGE.md
- 本番判定/テスト判定: 31_PRODUCTION_READINESS_GATE.md, 32_TEST_EXECUTION_GATE.md
- レビュー雛形: 10_WEEKLY_REVIEW_TEMPLATE.md から 13_ANNUAL_REVIEW_TEMPLATE.md

## クイック振り分け表

| 主なタスク                         | 最初に読む文書                                                                                                         | 次に使う文書                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 自律作業を安全に開始する           | `02_AUTONOMOUS_DEV_PROTOCOL.md`                                                                                        | `03_TASK_CONTRACT_TEMPLATE.md`, `04_DEFINITION_OF_DONE.md`                     |
| エスカレーションまたは引き継ぎ     | `08_ESCALATION_AND_HANDOFF.md`                                                                                         | `05_PR_TASK_CONTRACT_TEMPLATE.md`                                              |
| アプリ境界やワークフロー範囲       | `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`                                                                              | `26_GITHUB_ENVIRONMENT_GATES_EXTRACT.md`                                       |
| GitHub Issue 運用やタグ付与        | `27_GITHUB_OPERATIONS_COMMANDS.md`                                                                                     | `25_GITHUB_GOVERNANCE_QUICK_REF.md`                                            |
| 認証、シークレット、運用者アクセス | `17_AUTH_REQUEST_PLAYBOOK.md`                                                                                          | `14_CRITICAL_GUARDRAILS_EXTRACT.md`                                            |
| 障害対応                           | `29_ONCALL_MONITORING_ONEPAGE.md`、`18_INCIDENT_TRIAGE_RUNBOOK.md`、または `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` | `21_AWS_INCIDENT_PATTERN_PLAYBOOK.md` から `24_CROSS_CLOUD_INCIDENT_MATRIX.md` |
| 本番投入の可否判断                 | `31_PRODUCTION_READINESS_GATE.md`                                                                                      | `32_TEST_EXECUTION_GATE.md`, `08_ESCALATION_AND_HANDOFF.md`                    |

障害対応で最初に開く文書は次のルールで選びます。

- アラート発生から 5 分未満で症状が特定できていない: `29_ONCALL_MONITORING_ONEPAGE.md`
- 症状が特定できている進行中インシデント: `18_INCIDENT_TRIAGE_RUNBOOK.md`
- 単一原因が見えないアラートストーム: `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`

## 運用ルール

- 1タスクごとに目的、スコープ、受け入れ条件、検証方法を明記する。
- 大きな変更は小さな差分に分割する。
- 認証不足、境界違反、影響不明の本番変更では停止する。
- 14-32 と PR 引き継ぎでは、`08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record 形式を使う。
- 変更後は必ず検証結果を残す。
- `docs_agent/` と `docs_agent_ja/` の同期を維持する。

## AI エージェント向け指針

- 複数のファイルや参照を独立に確認できる場合は、read-only の文脈収集を並列化する。
- 並列で文脈収集した直後に、何が分かって次に何をするかを短く進捗共有する。
- ユーザー編集、formatter、セッション再開、またはツール警告でファイル変更の可能性がある場合は、編集直前に現行内容を読み直す。
- 実装が必要な依頼では、部分分析で止まらず、依頼範囲が解決するか本物の blocker が確定するまで進める。
- 作業が長引く場合は、計画の全文を繰り返さず、差分だけを短く共有する。
- 引き継ぎ前に変更範囲を検証し、関連検証を実行できなかった場合はその制約を明示する。

## 最近の文書セット更新

- 2026-03-14: 並列の read-only 文脈収集、短い進捗共有、編集前再読、未実行検証の明示に関する AI エージェント指針を追加した。
- 2026-03-14: 同じ指針を、自律開発プロトコル、ワークフローチェックリスト、タスク契約テンプレート、PR タスク契約テンプレート、エスカレーション/引き継ぎルールへ反映した。
- 2026-03-14: 納品記録とツール運用で、検証済み事実と仮説を区別するための evidence provenance と assumption labeling の規則を追加した。
- 2026-03-14: ネットワーク不安定時の GitHub Issue / PR drift に対して、ローカル正本補正と 1 issue ずつの remote 再同期を行う指針を追加した。

## 現在のリポジトリ到達点

- このファイルを current project state の正本チェックポイントとして扱わない。
- 現在の正本チェックポイントは `08_ESCALATION_AND_HANDOFF.md` にあり、そこでは以前の closed issue chain 記録に加えて、SNS issue クローズ後および safety branch 解体後の最新 repository cleanup handoff も管理している。
- GitHub Issue 45-46 の close 状態は履歴として有効だが、current project checkpoint としてはその後の follow-up chain と handoff record が優先される。
- 現在、GitHub 上に open issue と open pull request は存在せず、cleanup 中に使っていた safety snapshot branch 群も削除済みである。
- production governance baseline は、より新しい handoff record に別記がない限り、external DNS を source of truth とし、current phase での Route 53 非採用と operator-assist only の DNS automation を維持する。
- 次の follow-up に入る前に、まず `08_ESCALATION_AND_HANDOFF.md` の current project handoff record を読み、その後 `docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md` や `docs/portal/issues/` 配下の実在する正本ファイルを確認する。
