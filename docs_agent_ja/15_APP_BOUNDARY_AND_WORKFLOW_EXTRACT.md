# アプリ境界とワークフロー抜粋

## この文書を使う場面

- アプリコード、デプロイ workflow、クラウド設定に触る前に使う
- `sns` と `exam-solver` の両方へ波及しそうなタスクで再確認に使う

## 実行順

1. 対象アプリ名を明示する
2. 編集可能ディレクトリを確認する
3. 対応 workflow を確認する
4. 変更前に boundary guard を実行する
5. 変更後に同じ guard を再実行する

## exam-solver

- 編集対象: `services/exam-solver-api/`, `services/frontend_exam/`
- 対応ワークフロー: `deploy-exam-solver-*.yml`

## sns

- 編集対象: `services/sns-api/`, `services/frontend_react/`
- 対応ワークフロー: `deploy-sns-*.yml`

## 共有インフラストラクチャ

- 対象パス: `infrastructure/`、`scripts/`、およびアプリ固有デプロイファイル以外の `.github/workflows/`
- レビュー役割: `platform-reviewer` と `platform-approval-owner`
- ルール: ここへの編集は、実装前に明示的なクロスアプリ調整契約を必要とする

## ガードコマンド

```bash
./scripts/check-app-boundary.sh exam-solver
```

変更前後に実行します。

## ワークフロー境界ルール

- `exam-solver` の変更は `services/exam-solver-api/`、`services/frontend_exam/`、および対応するデプロイワークフロー内に留める
- `sns` の変更は `services/sns-api/`、`services/frontend_react/`、および対応するデプロイワークフロー内に留める
- 共有インフラストラクチャ変更は別のクロスアプリ契約を必要とし、platform reviewer / approval owner ロールを使う
- デバッグまたはデプロイ前に、対象 entrypoint、route 系統、workflow 群が意図したアプリに一致していることを確認する
- 両アプリをまたぐ変更が必要に見える場合は、タスクが明示的にクロスアプリ連携を要求していない限り、作業を分割して契約を分ける

## 手動境界チェックのフォールバック

`./scripts/check-app-boundary.sh` が存在しない、または実行に失敗する場合は、手動境界チェックへ切り替えます。

```bash
# exam-solver用: snsのパスが触られていないことを確認
git diff --name-only | grep -E "sns-api|frontend_react"

# sns用: exam-solverのパスが触られていないことを確認
git diff --name-only | grep -E "exam-solver-api|frontend_exam"
```

どちらかのコマンドが結果を返した場合は作業を止めて分割します。証跡には `manual boundary check used` を記録します。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT
Scope: Issue #451 に対する services/frontend_exam の exam-solver フロントエンドタイムアウト修正
Outcome: 境界確認完了
Actions taken: 編集を services/frontend_exam に限定し、対応する deploy-exam-solver-aws.yml 範囲を確認した
Evidence: services/exam-solver-api と sns 系パスは未変更で、Issue #451 の境界を維持した
Risks or blockers: API 側の timeout 制限も変える場合は backend 検証が別途必要
Next action: Issue #451 の frontend 修正後に deploy-exam-solver-aws.yml 前提で境界確認を再実施し、結果を exam-solver-reviewer へ渡す
```
