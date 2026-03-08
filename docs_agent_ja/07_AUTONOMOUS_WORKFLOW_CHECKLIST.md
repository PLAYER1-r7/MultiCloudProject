# 自律ワークフローチェックリスト

## 開始前

詰まった場合: 認証 -> `17_AUTH_REQUEST_PLAYBOOK.md`、コントラクトまたはスコープ -> `03_TASK_CONTRACT_TEMPLATE.md`、境界確認 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`。

- [ ] 対象アプリを宣言した
- [ ] 対象環境を宣言した
- [ ] タスク契約を完了した
- [ ] スコープと受け入れ条件を固定した
- [ ] 必要な認証を確認した

## 実装中

詰まった場合: 境界違反 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`、ハードストップ条件 -> `14_CRITICAL_GUARDRAILS_EXTRACT.md`。

- [ ] 変更が小さく巻き戻せる
- [ ] 無関係なパスに触れていない
- [ ] 境界チェックがクリーンである
- [ ] ロールバック経路が維持されている

## 引き継ぎ前

詰まった場合: テストゲート -> `32_TEST_EXECUTION_GATE.md`、DoD ゲート -> `04_DEFINITION_OF_DONE.md`、PR パッケージング -> `05_PR_TASK_CONTRACT_TEMPLATE.md`。

- [ ] テスト結果を記録した
- [ ] DoD の必須ゲートを満たした
- [ ] PR テンプレートを埋めた
- [ ] 残存リスクと後続作業を記録した
