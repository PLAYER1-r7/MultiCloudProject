# ツールとサービス基準

## 必須ツール

- Git
- Python
- Node.js と npm
- Docker
- DNS 確認ツール群 (`dnsutils`、`dig` を含む)
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
- Issue タグの選定基準や正規化ルールは、タスク個別メモへ再定義せず `27_GITHUB_OPERATIONS_COMMANDS.md` に置く
- 製品実装の詳細は `docs/` に残し、ここには安定した判断基準と運用前提だけを取り込む

## PR作成ヘルパー

`scripts/create-pr.sh` は `gh pr create` を薄く包む補助として使う。

- PR 本文は先に `05_PR_TASK_CONTRACT_TEMPLATE.md` または `docs_agent_ja/05_PR_TASK_CONTRACT_TEMPLATE.md` を使って準備する
- 実行前に `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` または `docs_agent_ja/07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` の PR作成前チェックを確認する
- 最終 PR 本文は `/tmp/pr-body.md` のような一時ファイルに置く
- 実行例: `scripts/create-pr.sh --title "<title>" --body-file /tmp/pr-body.md`
- このヘルパーは PR 本文生成、テスト実行、Issue 状態推定、PR チェックリストの代替は行わず、必要入力を確認したうえで `gh pr create` を呼ぶだけとする

## クイック確認

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
dig -v | head -n 1
```
