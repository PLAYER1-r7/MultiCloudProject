# GitHub Environment Gates 抜粋

## この文書を使う場面

- デプロイワークフローを起動または承認する前に使う
- ブランチ、environment、承認条件の不一致が疑わしいときに使う

## 判断パターン

1. 対象 environment を特定する
2. 許可される branch に逆引きする
3. 承認の要否を確認する
4. 承認待ちは未完了デプロイとして扱う

## 環境ルール

- production: `main` ブランチ、承認必須
- staging: `develop` ブランチ、通常は承認不要
- development: 幅広い検証用

## ブランチ戦略

- `feature/*`、`fix/*`、`docs/*`、`chore/*` は `develop` から切り、`develop` へ戻す
- `hotfix/*` は本番緊急修正時に限り `main` から切る
- 通常の機能作業を直接 `main` へマージしない
- environment 承認が保留中なら、そのデプロイは完了扱いにしない

## エージェント規則

production は常に承認ゲート付き作業として扱います。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 26_GITHUB_ENVIRONMENT_GATES_EXTRACT
Scope: Issue #487 に対する sns production デプロイワークフローの environment gate 待ち状態
Outcome: ゲート状態を把握した
Actions taken: deploy-sns-aws.yml に対する保留中の承認、必要 secrets、environment 固有制約を確認した
Evidence: deploy-sns-aws.yml は Issue #487 の production environment approval 段階で停止している
Risks or blockers: sns の承認者とシークレット状態が整うまでデプロイを続行できない
Next action: 必要証跡を添えて sns-approval-owner へ連絡し、sns-reviewer にも共有してから release を再開する
```
