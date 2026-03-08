# オンコール監視ワンページ

## この文書を使う場面

- オンコール対応の最初の 5 分で使う
- 完全な障害 handbook ではなく、時間制限付きの初動プロンプトとして使う

## 即時エスカレーション条件

- 本番全体へ影響が見えている
- 認証、データ整合性、セキュリティ境界が危険
- 影響 owner またはクラウドを短時間で特定できない

## 0-5分フロー

- アプリ、環境、クラウドを特定する
- `test-endpoints` と `test-e2e` を実行する
- 重要度と担当を確定する

## クイックコマンド

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

本番全体影響なら即時エスカレーションします。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 29_ONCALL_MONITORING_ONEPAGE
Scope: Issue #487 に対する夜間の sns staging アラート急増の初動確認
Outcome: オンコール用スナップショットを作成した
Actions taken: 担当者を確認し、deploy-sns-aws.yml 後の sns-api と frontend_react を影響サービスとして整理し、注視すべきダッシュボードを記録した
Evidence: Issue #487 に対する sns のアラートチャネル、ダッシュボードリンク、現在のヘルス要約を確認できた
Risks or blockers: sns の所有者が曖昧だと severity 上昇時の連絡が遅れる
Next action: 解消または sns-reviewer への引き継ぎまでスナップショットを更新し続け、sns-approval-owner にも状況を見せる
```
