# Azure 障害パターン プレイブック

## この文書を使う場面

- 初動の結果、Azure が主な障害領域だと見えたときに使う
- Azure 固有の routing、identity、CORS が真因候補に見えるときに使う

## 最初のアクション順

1. 症状を最も近いパターンへ当てる
2. リソース状態と CORS または routing 設定を確認する
3. 問題が platform 挙動か config drift かを確認する
4. まず最も低リスクな Azure 固有修正から当てる

## よくあるパターン

- CORS 失敗: Function App CORS と Blob CORS を別々に確認する
- API 404: `host.json` の route prefix が空か確認する
- Front Door 502: origin のヘルスとルーティング規則を確認する
- ログインリダイレクト異常: Azure AD の redirect URI を確認する

## 基本コマンド

```bash
az functionapp show --name multicloud-auto-deploy-staging-func --resource-group multicloud-auto-deploy-staging-rg
az functionapp cors show --name multicloud-auto-deploy-staging-func --resource-group multicloud-auto-deploy-staging-rg
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 22_AZURE_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #487 に関する settings 変更後の Azure staging sns-api Function App 500
Outcome: Azure パターンに一致
Actions taken: 直近の sns-api app settings、identity 権限、storage 接続前提を deploy-sns-azure.yml 後の状態で比較した
Evidence: sns-api は config 更新後から失敗し、deploy-sns-azure.yml 自体は成功したが runtime health が落ちている
Risks or blockers: 表面上の緩和だけだと sns-api の設定 drift を見逃す可能性がある
Next action: 再 deploy 前に sns-api の app settings と managed identity 権限を確認し、sns-reviewer へ共有してから sns-approval-owner の判断を待つ
```
