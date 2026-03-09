# エスカレーションと引き継ぎ

## 流用ルール

- まず共通ペイロードをコピーし、`Outcome` を目的に応じて設定する
- 作業が詰まっている場合は `Outcome: Escalation requested`、完了してレビューや引き継ぎへ回す場合は `Outcome: Handoff ready` を固定値として使う
- 後続処理で機械的に読みやすいよう、項目順は変えない

## 正規 Execution Record 形式

docs 08 と 14-32 で使う共通記録形式はこれを正本とします。

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome:
Actions taken:
Evidence:
Risks or blockers:
Next action:
```

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 共通ペイロード形式

上の正規 Execution Record 形式をそのまま使います。

## 即時エスカレーション条件

- 認証不足
- 本番リスクが高い
- セキュリティ後退につながる
- アーキテクチャ競合で安全実装が止まる

## エスカレーション内容

上の正規 Execution Record 形式を使い、`Outcome: Escalation requested` を設定します。

## エスカレーション項目ルール

- 現在の阻害要因と影響は `Risks or blockers` に入れる
- レビュアーまたは運用者に求める判断は `Next action` に入れる
- `Actions taken` には、エスカレーション前に確認済みの内容だけを書く

## コピー用エスカレーションテンプレート

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Escalation requested
Actions taken:
Evidence:
Risks or blockers:
Next action:
```

## 引き継ぎ内容

上の正規 Execution Record 形式を使い、`Outcome: Handoff ready` を設定します。

## 引き継ぎ項目ルール

- 更新済みタスク契約と変更要約は `Actions taken` に入れる
- 検証証跡とロールバック証拠は `Evidence` に入れる
- 残存リスクは `Risks or blockers` に入れる
- レビュアーが見るべき点や次の担当者の作業は `Next action` に入れる

## コピー用引き継ぎテンプレート

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Handoff ready
Actions taken:
Evidence:
Risks or blockers:
Next action:
```

## 記入例

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue #487 に対する staging の sns frontend_react ベースパス修正の引き継ぎ
Outcome: Handoff ready
Actions taken: frontend_react 側の変更範囲を整理し、deploy-sns-aws.yml への影響を確認した
Evidence: 文書目視確認完了; Issue #487 の /sns/ 経路に関する検証観点を記録済み
Risks or blockers: staging の /sns/ smoke test 実行結果は引き継ぎ先で確認が必要
Next action: sns-reviewer が frontend_react の /sns/ 経路と handoff 内容を確認し、その後 sns-approval-owner が deploy-sns-aws.yml を判断する
```

## Current Project Handoff Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject における Issue 45 と Issue 46 クローズ後の portal governance 到達点の引き継ぎ
Outcome: Handoff ready
Actions taken: production alert delivery baseline を扱う Issue 45 と external DNS automation / Route 53 migration judgment を扱う Issue 46 をクローズした; ローカル issue 記録、共有 governance 文書、GitHub Issue 本文を同期した; external DNS を source of truth として維持し、current phase では Route 53 へ移行せず、DNS automation は operator-assist only に限定する current production governance wording を固定した
Evidence: Issue 45 と Issue 46 のローカル issue 記録は CLOSED である; GitHub Issue 45 と 46 は CLOSED である; architecture、IaC、workflow README、production README に Issue 46 の governance wording が同期されている
Risks or blockers: GCP baseline design、incident runbook の深掘り、alert product implementation は未着手の follow-up であり、完了した DNS governance judgment と混在させてはならない
Next action: 次のチャットでは新しい task contract から開始し、docs/portal/issues/ の最新記録を読んだうえで、GCP baseline design を別スコープの follow-up として扱う
```

## 原則

止まるべき場面で止まることは失敗ではなく、安全な運用です。
