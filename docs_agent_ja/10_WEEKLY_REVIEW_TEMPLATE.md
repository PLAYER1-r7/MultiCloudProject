# 週次レビュー テンプレート

## 流用ルール

- 週末または短いスプリント区切りで、下のテンプレートをコピーして使う
- 指標は可能な限り数値で残す
- `翌週アクション` はそのまま担当に渡せる粒度まで具体化する

## コピー用テンプレート

```text
週次レビュー

概要
- 対象週:
- レビュアー:
- 対象範囲:

指標
- 完了タスク数:
- マージした PR 数:
- リードタイム:
- 初回成功率:
- 失敗した検証数:
- 境界違反数:

うまくいったこと
-

うまくいかなかったこと
-

翌週アクション
1. アクション / 担当 / 期限
2. アクション / 担当 / 期限
```

## 記入例

```text
週次レビュー

概要
- 対象週: 2026-W10
- レビュアー: exam-solver 保守担当
- 対象範囲: exam-solver staging の callback と timeout 運用整合

指標
- 完了タスク数: 5
- マージした PR 数: 1
- リードタイム: 1.2日
- 初回成功率: 80%
- 失敗した検証数: 0
- 境界違反数: 0

うまくいったこと
- exam-solver-reviewer が callback と timeout の確認を deploy-exam-solver-aws.yml 検討前に閉じられた

うまくいかなかったこと
- exam-solver-approval-owner 向け redirect 検証メモが不足し、承認判断が遅れた

翌週アクション
1. exam-solver-reviewer / exam-solver-approval-owner 向け redirect 検証証跡を追加する / AI agent / 2026-03-14
2. 次回の deploy-exam-solver-aws.yml review 前に callback checklist を再実行する / AI agent / 2026-03-14
```

新しいレビューエントリーを作成するときは、上記の fenced ブロックをコピーすること。
