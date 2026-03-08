# 年次レビュー テンプレート

## 流用ルール

- 年末レビューでは、下の fenced テンプレートをコピーして使う
- 主な成果と失敗は、翌年の方針を変えたものに絞る
- インシデントからの学びは、恒久的な運用または設計変更に結びつくものだけを書く

## コピー用テンプレート

```text
年次レビュー

エグゼクティブサマリー
- 対象年:
- 主な成果:
- 主な失敗:
- 来年の主題:

年間 KPI
- デリバリー:
- 品質:
- 信頼性:
- セキュリティ:

重大インシデントからの学び
1. インシデント / 影響 / 恒久対策
2. インシデント / 影響 / 恒久対策
3. インシデント / 影響 / 恒久対策

来年の計画
- 戦略優先事項:
- 投資優先事項:
- プロセス改善:
```

## 記入例

```text
年次レビュー

エグゼクティブサマリー
- 対象年: 2026
- 主な成果: exam-solver と sns の運用文書を構造化し、再利用しやすくした
- 主な失敗: 英日 drift の再整理が release review 前に複数回必要だった
- 来年の主題: exam-solver と sns の両方でテンプレート規律を強めて手戻りを減らす

年間 KPI
- デリバリー: exam-solver と sns の契約系およびレビュー系へ再利用テンプレートを展開
- 品質: 両アプリ系統で共通記録形式を標準化
- 信頼性: exam-solver と sns の障害対応およびリリース判断フローを明確化
- セキュリティ: 両アプリ向けに guardrail と go/no-go の確認点を強化

重大インシデントからの学び
1. exam-solver callback drift / staging release リスク / deploy-exam-solver-aws.yml handoff で exam-solver-reviewer と exam-solver-approval-owner を明示する
2. sns の /sns/ base-path 回帰 / frontend route 影響 / deploy-sns-aws.yml handoff で sns-reviewer と sns-approval-owner を明示する
3. bilingual handoff の曖昧さ / reviewer 着手遅延 / 英日で同じ reviewer 名と approval owner 名を維持する

来年の計画
- 戦略優先事項: exam-solver と sns の記入例で reviewer 名と approval owner 名を固定し続ける
- 投資優先事項: deploy-exam-solver-gcp.yml と deploy-sns-azure.yml 周辺の reviewer packet を改善する
- プロセス改善: release handoff 完了条件に approval owner 名付き証跡を必須化する
```

新しいレビューエントリーを作成するときは、上記の fenced ブロックをコピーすること。
