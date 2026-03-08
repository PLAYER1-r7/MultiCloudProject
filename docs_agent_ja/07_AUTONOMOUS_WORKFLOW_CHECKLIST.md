# 自律ワークフローチェックリスト

## 開始前

詰まった場合: 認証 -> `17_AUTH_REQUEST_PLAYBOOK.md`、コントラクトまたはスコープ -> `03_TASK_CONTRACT_TEMPLATE.md`、境界確認 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`。

- [ ] 対象アプリを宣言した
- [ ] 対象環境を宣言した
- [ ] タスク契約を完了した
- [ ] 詳細が未確定でも、最初の編集前に最小着手版の契約を書き、未確定項目を `TBD` と明示した
- [ ] レビュー是正または文書修正の作業である場合、その是正範囲専用のタスク契約がある
- [ ] スコープと受け入れ条件を固定した
- [ ] 必要な認証を確認した

## 実装中

詰まった場合: 境界違反 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`、ハードストップ条件 -> `14_CRITICAL_GUARDRAILS_EXTRACT.md`。

- [ ] 変更が小さく巻き戻せる
- [ ] 無関係なパスに触れていない
- [ ] 境界チェックがクリーンである
- [ ] ロールバック経路が維持されている

## Resolution 作成前

詰まった場合: 論点処理 -> `02_AUTONOMOUS_DEV_PROTOCOL.md` Step 2（契約）。

- [ ] Discussion Draft に論点テーブルがある場合、全行の `Resolution 確定文言` 列が埋まっている
- [ ] 論点を逐次回答せずに直接決定した場合は、その事実を `direct-decision` と明記して Process Review Notes に記録した

## 引き継ぎ前

詰まった場合: テストゲート -> `32_TEST_EXECUTION_GATE.md`、DoD ゲート -> `04_DEFINITION_OF_DONE.md`、PR パッケージング -> `05_PR_TASK_CONTRACT_TEMPLATE.md`。

- [ ] テスト結果を記録した
- [ ] DoD の必須ゲートを満たした
- [ ] Issue close または引き継ぎの流れに、無関係な未コミット変更を混ぜていない
- [ ] ローカルの根拠文書、リモートの Issue または PR 本文、status の記述が一致している
- [ ] 根拠文書内のレビュー状態セクションが揃っており、異なる段階を指していない
- [ ] 外部レビュー対象が最新の公開状態であることを確認した、またはローカルのみの差分を明示した
- [ ] 新しい Final Review Result や同等の完了表現を含むリモート Issue または PR 本文を、対応する commit の公開前に更新していない
- [ ] 根拠文書が最後のリモート同期後に変わった場合は、close または引き継ぎ前にリモートの Issue または PR 本文を再同期した
- [ ] 人間の再合意を得た場合は、agent validation と分けて記録し、close 承認と混同していない
- [ ] Issue close などの最終状態変更について、明示的な人間承認を記録した
- [ ] PR テンプレートを埋めた
- [ ] 残存リスクと後続作業を記録した
