# GitHub ガバナンス クイックリファレンス

## この文書を使う場面

- branch protection、merge flow、強制ルールの前提を確認したいときに使う
- branch policy と実際のデプロイ挙動が噛み合っていない疑いがあるときに使う

## 実行パターン

1. 対象ブランチを確定する
2. 想定される protection 基準を確認する
3. ガバナンス逸脱と断定する前に確認コマンドを実行する

## ブランチ保護の基準

- `main`: PR 必須、承認必須、force push 禁止
- `develop`: PR 必須、force push 禁止

## 確認コマンド

```bash
curl -s -H "Authorization: token $(gh auth token)" \
  "https://api.github.com/repos/PLAYER1-r7/multicloud-auto-deploy/branches/main/protection" | jq .
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 25_GITHUB_GOVERNANCE_QUICK_REF
Scope: Issue #487 に対する sns production hotfix PR のガバナンス経路確認
Outcome: ガバナンス経路を確認した
Actions taken: deploy-sns-aws.yml を伴う sns リリース PR に必要な branch protection、レビュアー、承認フローを確認した
Evidence: 対象ブランチは保護され、Issue #487 に対する sns の production environment approval が必須だった
Risks or blockers: sns の merge は必須レビュアー応答までは進められない
Next action: release 前に sns-reviewer へ依頼し、sns-approval-owner の承認経路も確認する
```
