# GitHub 運用コマンド

## この文書を使う場面

- GitHub の認証、作業項目、workflow を最短で確認したいときに使う
- 障害対応中や release 中に、その場で新しい `gh` コマンドを組み立てる代わりに使う

## 典型手順

1. GitHub 認証を確認する
2. 関連する issue または PR 状態を確認する
3. workflow を起動または確認する
4. 実行環境側へ移る前に run ID を記録する

## 認証

```bash
gh auth login
gh auth status
```

## Issue / PR

```bash
gh issue list --state open
gh pr list --state open
```

## ワークフロー

```bash
gh workflow run deploy-sns-aws.yml --ref develop -f environment=staging
gh run list --workflow=deploy-sns-aws.yml --limit 5
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 27_GITHUB_OPERATIONS_COMMANDS
Scope: Issue #487 に対する sns のリリース候補レビュー用 PR と workflow 状態収集
Outcome: 実行コマンドを選定した
Actions taken: sns の PR 状態、deploy-sns-aws.yml checks、直近デプロイ履歴を取るコマンドを選んだ
Evidence: Issue #487 の sns release review では repository 状態と CI 結果をまとめて確認する必要がある
Risks or blockers: 古い手元認識のまま sns の承認判断をすると誤る可能性がある
Next action: 選んだ GitHub コマンドを実行し、結果を sns-reviewer と sns-approval-owner 向けの引き継ぎへ添付する
```
