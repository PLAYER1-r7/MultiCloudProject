# テスト実行ゲート

## この文書を使う場面

- 変更後に、タスク完了を主張する前に使う
- 引き継ぎ、PR、デプロイに対して検証が十分かを判断するために使う

## 必須出力

- 何を実行したかを記録する
- 何を skip したかと理由を記録する
- 最終的な pass または fail 判断を記録する

## 実行順

1. Smoke

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

2. 変更モジュールの対象テスト
3. 変更対象サービスのカバレッジ確認

```bash
cd services/<app>
pytest --cov=. --cov-report=term-missing tests/
```

測定種別は行カバレッジとし、参照閾値はリポジトリ全体ではなく変更対象サービスごとに適用します。

4. 回帰の簡易確認
5. 影響したクラウドまたはランタイム経路に対する検証

## 証跡ルール

- タスク開始時点のカバレッジを維持または改善する。長期目標は 88% とする。開始時点が 88% 未満の場合は、それ以上下げず、開始時点の基準値を証跡に記録する
- 環境依存の skip は、明示的に記録した場合のみ許容する
- デプロイ関連変更では、影響したクラウド経路に対する health 系の確認を最低 1 つ実施する

## 合格条件

- 重大失敗がない
- 主要フローが成功
- 失敗がある場合は影響と次アクションを説明できる

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 32_TEST_EXECUTION_GATE
Scope: Issue #487 に対する staging の sns frontend_react base-path 変更用テスト選定
Outcome: テストゲートを定義した
Actions taken: frontend build、/sns/ ルートの smoke check、deploy-sns-aws.yml に対する health 確認を選んだ
Evidence: 変更は services/frontend_react にあり、Issue #487 の影響は sns のフロントエンド経路に限定される
Risks or blockers: /sns/ ルートの基底パス変更が静的 asset 読み込みへ波及する場合、実行時確認の省略は危険になる
Next action: frontend_react build と /sns/ smoke check を実行してから sns-reviewer へ引き継ぎ、deploy-sns-aws.yml は sns-approval-owner の最終判断に回す
```
