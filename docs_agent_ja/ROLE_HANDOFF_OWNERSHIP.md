# reviewer / approval owner の役割境界

## 目的

文書セット全体の記入例で `reviewer` と `approval owner` の使い分けを固定するため、運用上の境界だけを定義します。

## 役割要約

| 役割             | 主責務                                                        | 必ず判断すること                                    | 原則としてしないこと                                      |
| ---------------- | ------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| `reviewer`       | 正しさ、証跡品質、スコープ整合、handoff 完成度を確認する      | 技術的にレビュー可能か、何を直すべきか              | release 承認を出すこと、無断でスコープを広げること        |
| `approval owner` | 証跡が揃った後に release 感度の高い作業を進めてよいか判断する | deploy、本番変更、認証変更、rollback を進めてよいか | reviewer の詳細確認をやり直すこと、証跡不足を黙認すること |

## reviewer の責務

- タスクのスコープ、Issue 番号、workflow 名、対象環境が一致しているか確認する
- 証跡が読めるか、再現できるか、handoff に添付されているか確認する
- テスト、rollback メモ、risk 記述が不足していれば修正を求める
- 指摘は `Reviewer Notes` や `Next action` など既存の handoff 項目内で返す

## approval owner の責務

- reviewer 向けの確認が完了した後に、release、本番、認証、rollback、freeze の可否を判断する
- 証跡不足、スコープ変更、運用前提不足があれば承認を止めるか延期する
- `deploy-sns-aws.yml` や `deploy-exam-solver-aws.yml` のように承認対象を明示する
- handoff 記録とは別の臨時承認経路を増やさず、既存記録に判断を結び付ける

承認が返ってこない場合は、次の待機上限を使います。

- 非本番作業: 24 時間後に `Outcome: Re-escalation requested - approval not received` で再エスカレーションする
- 本番インシデント: 2 時間後に再エスカレーションする
- 再エスカレーション時は、元の実行記録または handoff ペイロードを再利用する

## handoff 境界

1. Agent が成果物と証跡を用意する
2. `reviewer` が技術的な完成度を確認し、必要なら修正を返す
3. `approval owner` が機微な作業を進めてよいか判断する

## 記入例での使い方

- 記入例では `sns-reviewer` や `exam-solver-approval-owner` のように役名を直接書く
- release 感度の高い作業では reviewer の確認を approval owner の判断より前に置く
- テンプレートごとに責務を再定義せず、必要ならこの文書を参照する
