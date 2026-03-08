# GCP 障害パターン プレイブック

## この文書を使う場面

- 初動の結果、GCP が主な障害領域だと見えたときに使う
- デプロイ成果物、Cloud Run revision、Firebase 連携が怪しいときに使う

## 最初のアクション順

1. 症状を最も近いパターンへ当てる
2. service または function の一覧を確認する
3. revision またはデプロイ証跡を確認する
4. 最小の GCP 固有緩和策を適用して health を再確認する

## よくあるパターン

- `missing main.py` でデプロイ失敗: 配備成果物に `main.py` を含める
- Signed URL の private key エラー: service account email と access token を渡す
- Firebase popup 不安定: COOP ヘッダーと許可ドメインを確認する
- Cloud Run 5xx: revision logs と環境差分を確認する

## 基本コマンド

```bash
gcloud run services list --region asia-northeast1 --project ashnova
gcloud functions list --regions asia-northeast1 --project ashnova
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 23_GCP_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #451 に関する domain 更新後の GCP production exam-solver auth callback 失敗
Outcome: GCP パターンに一致
Actions taken: exam-solver の ingress、auth redirect、service 設定の整合を deploy-exam-solver-gcp.yml 後の状態で確認した
Evidence: exam-solver の callback route は GCP 経路だけ失敗し、Issue #451 に対応する直近 deploy-exam-solver-gcp.yml の domain 変更も確認できた
Risks or blockers: exam-solver の redirect mismatch 修正までログイン劣化が続く
Next action: exam-solver の redirect 設定と影響サービス revision を exam-solver-reviewer と確認し、exam-solver-approval-owner の承認可否へつなぐ
```
