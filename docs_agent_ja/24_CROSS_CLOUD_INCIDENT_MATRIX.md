# クロスクラウド障害マトリクス

## この文書を使う場面

- 症状は分かるが、どのクラウドが主因かまだ確定していないときに使う
- 3 つのプレイブックを最初から全部読む代わりに、最初の確認先を選ぶために使う

## 実行パターン

1. 症状の行を選ぶ
2. 最も可能性が高いクラウド列の確認から始める
3. 証跡が合わなければ横に移って次のクラウドを見る
4. 1 つのクラウドに絞れたら、その専用プレイブックへ移る

## 症状ベースで使う

症状から入り、クラウド別の確認と緩和策を素早く実行します。

| 症状        | AWS                         | Azure                           | GCP                                |
| ----------- | --------------------------- | ------------------------------- | ---------------------------------- |
| API 5xx     | Lambda logs + redeploy diff | Function metrics + app settings | Run/Functions logs + revision diff |
| API 404     | API path または base check  | `routePrefix` 確認              | URL map または route 確認          |
| CORS エラー | API と storage の CORS      | Function CORS + Blob CORS       | Run または Storage CORS            |
| UI が真っ白 | `/sns/` asset path          | Front Door route/rules          | CDN/GCS path と cache              |
| 認証失敗    | Cognito config/token        | AAD config/token                | Firebase domain/token              |

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 24_CROSS_CLOUD_INCIDENT_MATRIX
Scope: Issue #487 に対する AWS、Azure、GCP staging 経路の sns ログイン障害比較
Outcome: クラウド横断の差分を特定した
Actions taken: sns 症状の有無をプロバイダごとに整理し、deploy-sns-aws.yml、deploy-sns-azure.yml、deploy-sns-gcp.yml の経路を比較した
Evidence: AWS と Azure は Issue #487 の sns callback が失敗し、GCP は同一試験で正常だった
Risks or blockers: sns の共通原因と決め打ちすると復旧が遅れる可能性がある
Next action: sns の AWS と Azure を個別プレイブックへ回し、差分を sns-reviewer へ共有しつつ、sns-approval-owner が判断するまで GCP を対照経路として維持する
```
