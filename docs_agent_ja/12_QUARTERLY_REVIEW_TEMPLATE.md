# 四半期レビュー テンプレート

## 流用ルール

- 四半期末レビューでは、下の fenced テンプレートをコピーして使う
- ガバナンス判断は前四半期と比較しやすい短い文で残す
- `最優先` にはコミットする項目だけを書く

## コピー用テンプレート

```text
四半期レビュー

概要
- 対象四半期:
- レビュアー:
- 戦略成果:

KPI 集計
- デリバリー:
- 品質:
- セキュリティ:
- 運用:

ガバナンス判断
- 維持:
- 変更:
- 廃止:
- 追加:

次四半期ロードマップ
- 最優先:
- 推奨:
- 余力対応:
```

## 記入例

```text
四半期レビュー

概要
- 対象四半期: 2026-Q1
- レビュアー: プラットフォームリード
- 戦略成果: exam-solver と sns のリリースワークフローを流用可能かつレビュー可能な形へ整理

KPI 集計
- デリバリー: exam-solver と sns の運用文書へ再利用テンプレートを追加
- 品質: 両アプリの英日整合性を改善
- セキュリティ: exam-solver と sns の release 経路に対する本番ゲート文言を強化
- 運用: 両アプリでエスカレーションと引き継ぎペイロードを統一

ガバナンス判断
- 維持: handoff 記入例で exam-solver-reviewer と sns-reviewer を直接書く
- 変更: release 感度の高い記入例では exam-solver-approval-owner と sns-approval-owner を必須にする
- 廃止: 承認経路を隠す匿名 handoff 文言
- 追加: deploy-exam-solver-aws.yml と deploy-sns-aws.yml 用の workflow 別 reviewer packet

次四半期ロードマップ
- 最優先: 両アプリ系で reviewer 名と approval owner 名を英日同期で固定する
- 推奨: deploy-exam-solver-gcp.yml と deploy-sns-azure.yml 記入例にも同じ命名規律を広げる
- 余力対応: mixed 文書に platform-reviewer の spot check を加える
```

新しいレビューエントリーを作成するときは、上記の fenced ブロックをコピーすること。
