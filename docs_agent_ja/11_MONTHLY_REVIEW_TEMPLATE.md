# 月次レビュー テンプレート

## 流用ルール

- 月末レビューでは、下のテンプレートをコピーして使う
- KPI は月次比較しやすい短い形でそろえる
- 根本原因は 問題 / 原因 / 修正 の順で書く

## コピー用テンプレート

```text
月次レビュー

概要
- 対象月:
- レビュアー:
- 対象範囲:

KPI 集計
- デリバリー指標:
- 品質指標:
- 信頼性指標:
- セキュリティ指標:

根本原因
1. 問題 / 原因 / 修正
2. 問題 / 原因 / 修正
3. 問題 / 原因 / 修正

翌月計画
- 最優先:
- 推奨:
- 余力対応:
```

## 記入例

```text
月次レビュー

概要
- 対象月: 2026-03
- レビュアー: sns サービス保守担当
- 対象範囲: sns frontend_react と sns-api の staging 安定化

KPI 集計
- デリバリー指標: staging 修正 4 件と関連レビュー文書を更新
- 品質指標: /sns/ ルートガイダンスと sns-api 引き継ぎ手順を整合
- 信頼性指標: frontend_react と sns-api の staging 確認手順を標準化
- セキュリティ指標: sns の production ゲート確認点を release 前に明確化

根本原因
1. staging の /sns/ 経路 drift / reviewer 用共有パケット不足 / sns-reviewer 向け handoff メモ整合で修正
2. sns-api 追跡作業の曖昧さ / workflow 所有者が不明瞭 / sns-approval-owner を release 経路へ明記して修正
3. cache 検証遅延 / 証跡到着が遅い / deploy-sns-aws.yml smoke checkpoint を添付して修正

翌月計画
- 最優先: すべての release handoff に sns-reviewer と sns-approval-owner を残す
- 推奨: deploy-sns-azure.yml と deploy-sns-gcp.yml 向け reviewer packet を標準化する
- 余力対応: sns-approval-owner の承認枠を通知する仕組みを追加する
```

新しいレビューエントリーを作成するときは、上記の fenced ブロックをコピーすること。
