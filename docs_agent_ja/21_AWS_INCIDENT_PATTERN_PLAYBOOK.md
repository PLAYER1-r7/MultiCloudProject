# AWS 障害パターン プレイブック

## この文書を使う場面

- 初動の結果、AWS が主な障害領域だと見えたときに使う
- 場当たり的な探索ではなく、最初の AWS 確認を選ぶために使う

## 最初のアクション順

1. 症状を最も近いパターンへ当てる
2. 基本コマンドを実行する
3. ランタイム証跡と直近デプロイまたは config 変更を比較する
4. まず最小の AWS 固有緩和策だけを適用する

## よくあるパターン

- SNS 画面が真っ白 / MIME エラー: `/sns/` base path で再ビルドし、静的アセットを再配備する
- API 5xx 増加: Lambda ログと直近デプロイ差分を確認する
- CloudFront 証明書エラー: Pulumi の証明書とドメイン設定を確認する
- 画像URL期限切れ: レスポンス時点で署名URLを発行しているか確認する

## 基本コマンド

```bash
aws logs tail /aws/lambda/multicloud-auto-deploy-staging-api --since 10m --follow --region ap-northeast-1
aws cloudwatch describe-alarms --state-value ALARM
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 21_AWS_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #487 に関する AWS production の /sns/ 真っ白表示障害
Outcome: AWS パターンに一致
Actions taken: sns の CloudFront 経路、直近の deploy-sns-aws.yml asset deploy、origin policy 変更を確認した
Evidence: /sns/ asset は失敗するが sns API health は正常で、Issue #487 に一致した
Risks or blockers: edge または asset path の原因特定まで sns 利用者影響が続く
Next action: rollback 前に /sns/ base-path 出力、WebACL、origin access policy を sns-reviewer と確認し、sns-approval-owner の判断を待つ
```
