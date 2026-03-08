# 障害初動 Runbook

## この文書を使う場面

- 障害、劣化、アラート急増、またはデプロイ結果が怪しいときの最初の切り分けで使う
- クラウド別プレイブックを選ぶ前の最初の整理に使う

## 必須出力

- 緩和方針を変える前に、初動サマリーを 1 回埋める
- 重要度または疑わしい層が変わったら、サマリーも更新する

## 最初の15分

1. 対象のアプリ、環境、クラウドを特定する
2. ヘルスチェックを実行する
3. 重要度を分類する (P0/P1/P2/P3)
4. 証跡を残す (ログ、失敗エンドポイント、直近デプロイ)
5. エスカレーションか即時緩和策かを決める

最初の分類では次の基準を使います。

- P0: 大規模な本番停止または進行中のセキュリティ侵害。完全なトリアージを待たずに即時エスカレーションする。
- P1: 回避策が存在する大きな機能劣化。
- P2: staging または非クリティカル経路の障害。
- P3: 外観上の問題またはブロックしない不具合。

## クイックコマンド

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 18_INCIDENT_TRIAGE_RUNBOOK
Scope: Issue #451 に関する設定更新後に発生した exam-solver-api の staging P2 障害
Outcome: 初動切り分け完了
Actions taken: exam-solver アプリと staging 環境を特定し、health check と直近の deploy-exam-solver-aws.yml 設定変更を確認した
Evidence: exam-solver のヘルスエンドポイントが失敗し、Issue #451 に対応する alert 開始時刻と直近 deploy-exam-solver-aws.yml 時刻が一致した
Risks or blockers: callback 設定か API 起動かの根本原因はまだ未確定
Next action: exam-solver API 障害の兆候に沿ってクラウド別プレイブックへ進み、deploy freeze が必要なら exam-solver-reviewer と exam-solver-approval-owner へ通知する
```
