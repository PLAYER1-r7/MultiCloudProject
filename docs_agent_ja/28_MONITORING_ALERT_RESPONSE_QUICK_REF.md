# 監視アラート対応 クイックリファレンス

## この文書を使う場面

- アラートが先に来て、人が読める障害サマリーがまだないときに使う
- 監視起点の初動として使い、その後は 18、21、22、23、29 へ必要に応じて引き継ぐ

## 必須アウトカム

- 対象範囲、現在の重要度、次の緩和担当を 1 つの文脈で残す

## 初動

1. アプリ、環境、クラウドを確定する
2. ヘルスチェックを実行する
3. 重要度を判定し、緩和策を開始する

障害クラウドがまだ特定できていない場合は、プロバイダー別プレイブックへ移る前に `24_CROSS_CLOUD_INCIDENT_MATRIX.md` を使ってドメインを絞り込む。

## クラウド別確認

- AWS: CloudWatch alarms + Lambda logs
- Azure: Monitor metrics + Function status
- GCP: Monitoring policies + Run または Functions status

## 完了条件

- 主要エンドポイントの健全性が回復
- アラート連発が止まった
- 再発防止タスクを記録した

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 28_MONITORING_ALERT_RESPONSE_QUICK_REF
Scope: Issue #451 に対する exam-solver-api staging のレイテンシアラート対応
Outcome: アラート対応を開始した
Actions taken: exam-solver のアラート発報元、レイテンシ推移、影響エンドポイント群を deploy-exam-solver-aws.yml 後の状態で確認した
Evidence: exam-solver の Issue #451 設定デプロイ後からレイテンシ上昇が継続している
Risks or blockers: ノイズアラートが exam-solver の主障害シグナルを埋める可能性がある
Next action: exam-solver のデプロイ時刻と実行ログを突き合わせ、要約を exam-solver-reviewer と exam-solver-approval-owner へ渡す
```
