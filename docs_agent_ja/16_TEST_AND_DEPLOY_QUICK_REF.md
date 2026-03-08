# テストとデプロイ クイックリファレンス

## この文書を使う場面

- 小さな変更の直後に、最短で安全に検証とデプロイ判断へ進みたいときに使う
- 大きい変更では 31 と 32 を正本とし、この文書は起動用ショートカットとして使う

## 正本ドキュメント

- 証跡ルール、カバレッジ期待値、合格条件、検証十分性は `32_TEST_EXECUTION_GATE.md` を正本とする
- リリース感度の高い GO / NO-GO 判断は `31_PRODUCTION_READINESS_GATE.md` を正本とする

## クイックスタート手順

1. smoke を実行する
2. 変更モジュールに対する最小限の対象テストを実行する
3. `32_TEST_EXECUTION_GATE.md` を開き、まだ必要な証跡を確認する
4. テスト結果と証跡計画が明確になってから workflow を起動または確認する
5. 成功、承認待ち、失敗のいずれかが明確になるまで監視する

## まず実行するテスト

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## 対象テスト

```bash
cd services/sns-api
pytest tests/ -v
```

変更対象に応じて、サービスパスとテストコマンドは読み替えます。

## 手動ワークフロー起動

```bash
gh workflow run deploy-sns-aws.yml --ref develop -f environment=staging
gh run list --workflow=deploy-sns-aws.yml --limit 5
gh run watch <run-id>
```

手動デプロイは正当な理由がある場合だけにします。

詳細なゲートロジックはこの文書へ追加せず、`32_TEST_EXECUTION_GATE.md` に戻って判断します。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 16_TEST_AND_DEPLOY_QUICK_REF
Scope: Issue #487 に対する sns frontend_react の base-path 修正用 staging 検証手順の選定
Outcome: 検証手順を選定した
Actions taken: smoke、対象テスト、doc 32 を正本とした検証方針を選び、deploy-sns-aws.yml 前提の流れを整理した
Evidence: 影響範囲は services/frontend_react と deploy-sns-aws.yml に限定され、Issue #487 に対応する
Risks or blockers: doc 32 が求める証跡を満たすまでは検証完了と見なせない
Next action: 選んだコマンドを実行し、doc 32 に必要な証跡を満たしてから sns-reviewer へ渡し、その後 sns-approval-owner の判断に回す
```
