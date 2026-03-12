# Definition of Done

## 必須ゲート

- [ ] アプリ境界を守っている。`15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md` で確認する
- [ ] 受け入れ条件を満たしている。`03_TASK_CONTRACT_TEMPLATE.md` のタスク契約に照らして確認する
- [ ] 必要なテストが通過している、または未実施理由を明示している。`32_TEST_EXECUTION_GATE.md` を使う
- [ ] セキュリティ後退がない。`14_CRITICAL_GUARDRAILS_EXTRACT.md` の停止条件を確認する
- [ ] ロールバック手順を文書化している。下の「ロールバック記載の最低要件」を満たす

## 納品ゲート

- [ ] 変更要約が明確である。`05_PR_TASK_CONTRACT_TEMPLATE.md` の packaging ルールに従う
- [ ] リスクとトレードオフが明示されている。`03_TASK_CONTRACT_TEMPLATE.md` の Risk and Rollback セクションに記録する
- [ ] レビュアー向けの確認ポイントがある。`05_PR_TASK_CONTRACT_TEMPLATE.md` の Reviewer Notes 形式に従う
- [ ] 必要な後続作業が記録されている。`08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record にある `Next action` に記録する
- [ ] タスクが Issue chain を close した、または提案中の child issue を見送った場合は、その stop-condition の根拠を `08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record にある `Closure rationale` へ記録している
- [ ] browser-facing な portal copy や他の公開向け文面を変更した場合は、live reflection を確認した、または deploy-ready/local-only 作業であることと未反映理由・引き継ぎ先を明記している
- [ ] Issue close を確認した。人間の close 承認（承認形式と承認根拠の引用または参照を Process Review Notes に記録済み）を取得した上で `gh issue close <N>` を実行し、`gh issue view <N> --json state` で closed 状態を確認した。このステップが完了するまで次の受領（Intake）を開始しない

## ロールバック記載の最低要件

ロールバック手順を文書化したと見なすには、最低でも次を含めます。

1. 正確なリバートコマンド、または復旧手順の並び。
2. 想定される復旧時間。
3. ロールバック成功を確認する検証コマンド。

## ルール

必須ゲートを1つでも満たさない場合、その作業は Done ではありません。
