# ツールとサービス基準

## 必須ツール

- Git
- Python
- Node.js と npm
- Docker
- GitHub CLI
- AWS CLI
- Azure CLI
- gcloud CLI
- Pulumi
- プロジェクト検証スクリプト: `./scripts/test-endpoints.sh` と `./scripts/test-e2e.sh`

## 必須プラットフォームサービス

- GitHub Issues / PRs / Actions
- ブランチ保護と environment ゲート
- 各クラウドのログと監視
- 各クラウドの認証サービス: Cognito, Azure AD, Firebase Auth

## 参照優先度

1. Pulumi outputs とデプロイ済みリソースの状態
2. ワークフロー実行結果とランタイムログ
3. 既存スクリプトと検証済みランブック
4. 説明文書

## 運用ルール

- 推測で設定値を埋めない
- 既存スクリプトを優先して使う
- 手動操作は最小限にする

## 配置ルール

- クラウド別の認証構成や運用者認証の前提は `17_AUTH_REQUEST_PLAYBOOK.md` に置く
- タイムアウト増加のようなアプリ固有の運用調整判断は `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` に置く
- 製品実装の詳細は `docs/` に残し、ここには安定した判断基準と運用前提だけを取り込む

## クイック確認

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
```
