# 認証要求プレイブック

## この文書を使う場面

- クラウドコマンド、GitHub 操作、保護された実行経路が不足認証に依存しているときに使う
- 認証切れとアプリ不具合を混同しないため、認証系デバッグの前にも使う

## 即時アクション順

1. 現在の認証状態を確認する
2. 必要な認証がなければ作業を止める
3. 不足プロバイダと実行コマンドを明記して依頼する
4. 再認証を確認できるまで再開しない

依頼送信後の待機上限は次のとおりです。

- 非本番タスク: 最大 30 分待機する
- アクティブな本番インシデント: 最大 15 分待機する
- 上限を過ぎても再認証が確認できない場合は、`08_ESCALATION_AND_HANDOFF.md` を使い `Outcome: Re-escalation requested - authentication still missing` で再エスカレーションする

## ルール

必要な認証がない場合は作業を止め、ただちに認証を依頼します。

## 最低限の認証前提

- このプラットフォームで採用しているネイティブ認証基盤である Cognito、Azure AD、Firebase Auth を前提に扱う
- GitHub、AWS、Azure、GCP の運用者アカウントでは MFA が有効である前提で判断する
- 認証不足を一時的なコード変更やチェック無効化で回避しない

## クラウド別認証の基準

| クラウド | サービス      | 標準フロー                | トークンの扱い             |
| -------- | ------------- | ------------------------- | -------------------------- |
| AWS      | Cognito       | Authorization Code + PKCE | セキュアな session cookie  |
| Azure    | Azure AD      | Authorization Code + PKCE | セキュアな session cookie  |
| GCP      | Firebase Auth | Authorization Code + PKCE | JWT idToken / refreshToken |

## エージェント運用ルール

- タスクが認証アーキテクチャ自体の変更を明示していない限り、上記を前提構成として扱う
- 認証挙動がこの基準と異なる場合は、コード変更前にデプロイ済み設定を確認する
- 検証を弱めたりログインフローを迂回したりせず、運用者の再認証を依頼する

## 確認コマンド

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
```

## 依頼メッセージ

```text
認証不足のため作業を停止しています。
タスク: <task>
必要な認証: <gh/aws/az/gcloud>
実行依頼: <command>
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 17_AUTH_REQUEST_PLAYBOOK
Scope: Issue #451 に対する exam-solver フロントエンド callback URL の staging 認証変更依頼
Outcome: 認証変更依頼を準備した
Actions taken: exam-solver のプロバイダ経路、必要な redirect URI 変更、承認者、deploy-exam-solver-aws.yml 前提の調整順を整理した
Evidence: staging で exam-solver のコールバック不一致を再現し、Issue #451 の修正先 URL を記録した
Risks or blockers: production の exam-solver 認証変更は別承認なしでは進められない
Next action: deploy-exam-solver-aws.yml 実行前に exam-solver-approval-owner へ認証変更依頼を送り、exam-solver-reviewer に共有する
```
