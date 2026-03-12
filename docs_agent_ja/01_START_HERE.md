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

## 現在のリポジトリ到達点

- 2026-03-09 時点で Issue 46 まで完了している。
- Issue 45 と Issue 46 はローカル issue 記録と GitHub Issue の両方でクローズ済みである。
- 現在の production governance baseline は、external DNS を source of truth として維持し、current phase では Route 53 へ移行せず、DNS automation は operator-assist only に限定する判断まで固定済みである。
- 次の候補スコープは GCP baseline design だが、別チャットで新しい task contract から開始する。
- 次の follow-up に入る前に、まず `08_ESCALATION_AND_HANDOFF.md` の current project handoff record を読み、その後 `docs/portal/issues/` の最新 issue 記録を確認する。
