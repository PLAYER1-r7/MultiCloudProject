# PRタスク契約テンプレート

実装結果を PR またはレビュー単位として引き渡すときに使います。

## 流用ルール

- PR 説明、引き継ぎレビュー、マージ要約を作るときは下のテンプレートをコピーして使う
- `予定スコープ` と `実績スコープ` は短く、比較しやすい形で書く
- 未実行の検証は本文に埋めず、明示的に残す
- reviewer や approval owner の動きが入る記入例では、PR 文書内で責務を再定義せず `ROLE_HANDOFF_OWNERSHIP.md` の境界に合わせる

## コピー用テンプレート

```text
PRタスク契約

概要
- タスク ID:
- 対象アプリ:
- 関連 Issue:

契約との整合
- 予定スコープ:
- 実績スコープ:
- 差分:

検証
- 実行コマンド:
- 結果:
- 未実行項目と理由:

リスク
- 影響範囲:
- 緩和策:
- ロールバック:

レビュアーメモ
- 最初に見てほしい点:
- 再現手順:
- 未解決事項:
```

上記ブロックをそのままコピーすること。Markdown ヘッダーに変換しないこと。

## 記入例

```text
PRタスク契約

概要
- タスク ID: AGENT-118
- 対象アプリ: sns
- 関連 Issue: #487

契約との整合
- 予定スコープ: staging 向けに frontend_react の /sns/ base path と引き継ぎメモを修正する
- 実績スコープ: /sns/ base path ガイダンス、引き継ぎメモ、デプロイ確認観点を更新した
- 差分: 静的 asset cache 確認のレビュアーメモを 1 件追加した

検証
- 実行コマンド: npm run build、staging の /sns/ smoke checklist review
- 結果: build は通過し、staging 確認観点を整理できた
- 未実行項目と理由: production deploy は staging 限定変更のため未実施

リスク
- 影響範囲: sns staging の /sns/ 経路と静的 asset cache 挙動
- 緩和策: sns-reviewer が merge 前に /sns/ asset 読み込みを確認する
- ロールバック: sns-approval-owner が deploy-sns-aws.yml を止め、直前 asset bundle へ戻せる

レビュアーメモ
- 最初に見てほしい点: sns-reviewer が /sns/ cache invalidation と handoff メモを確認する
- 再現手順: deploy-sns-aws.yml 向け build 出力準備後に staging の /sns/ を開く
- 未解決事項: sns-approval-owner に別の本番承認枠が必要か
```

## 共通記録形式との接続

この PR 契約は、共通実行記録をレビュー単位に写したものとして使います。

- `概要` と `契約との整合` で、最終的な `Scope` と `Outcome` を定義する
- `検証` は `Evidence` にそのまま対応させる
- `リスク` は `Risks or blockers` にそのまま対応させる
- `レビュアーメモ` はレビュアー向けの `Next action` として扱う

## PR 取りまとめルール

PR を開く、または引き継ぐ前に、最終状態を `08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record 形式で表現できることを確認します。

PR または handoff を取りまとめるときは、その形式を再利用し、`Outcome: Handoff ready` を設定します。
