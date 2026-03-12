# 重要ガードレール抜粋

## この文書を使う場面

- 編集、デプロイ、シークレットのローテーション、危険度の高い復旧判断の前に使う
- 15-32 の作業で止まるべき条件を判断する基準文書として使う

## 即時停止条件

- ブランチと環境の対応が曖昧
- 対象アプリ境界が曖昧
- production の認証、secret、rollback 状態を確認できない

## 非交渉ルール

- `main` を通常開発ブランチとして扱わない
- staging / production で `AUTH_DISABLED=false` を維持する
- アプリ境界を守る
- 大きな一括変更を避ける
- Pulumi outputs を設定の正本とする
- デプロイ成果物は amd64 互換を前提に確認する

## Issue 分解ガードレール

- 新しい Issue は、次のいずれかを少なくとも 1 つ追加する場合に限って作成する: 新しい証拠採取、新しい固定判断、新しい実行境界
- packaging-only issue を作成しない。提案中の child issue が既存スコープの言い換え、再包装、再記述に留まるなら、作業は現行 Issue に残す
- 最初の child issue を作る前に、親 Issue に terminal condition を記載する
- 単一の planning または execution chain は、人間が明示的に長鎖化を承認しない限り 4 Issue 以内に保つ
- 連続する 2 件の Issue で、新しい証拠、新しい固定判断、新しい実行境界のいずれも増えない場合は、分解を停止し、その chain を close すべきか見直す
- 同じ chain の 4 件目に当たる child issue を提案する場合は、それが本当に別 Issue なのか、close または現 Issue 内解決で足りるのかについて、明示的な人間確認を取得する

## セキュリティデプロイ ガードレール

- デプロイまたは管理に使う GitHub と各クラウドアカウントでは MFA を必須とする
- production ではワイルドカード CORS を使わず、実ドメインのみに制限する
- secrets は管理された secret store または承認済み GitHub environment に置き、リポジトリへ置かない
- 現行のコストとポリシー制約を守り、禁止されている Azure Premium 経路を使わない

## セキュリティ運用基準

- CORS は単なる共通トグルではなく、クラウド別に扱う。Azure では API 層と Blob Storage 層を別々に検証する
- WAF の状態はプロジェクト方針に合わせる。AWS は CloudFront WebACL、GCP は Cloud Armor、Azure は追加保護が必要な場合に Front Door Standard + standalone WAF policy を使う
- すべての secret source に rotation 経路を持つ。AWS は自動 rotation を使えるが、Azure は rotation policy、GCP は明示的な手動または自動 rotation 計画を必要とする
- secret が露出した場合は、機能作業を続ける前に直ちに無効化と rotation を行う
- HTTPS 強制とセキュリティヘッダーは基準セキュリティ状態の一部として扱う。ヘッダー欠落は見た目の問題ではなく、セキュリティ上の欠落である
- audit logging は任意の監視ではなく必須インフラとして扱う。AWS CloudTrail、Azure Log Analytics、GCP Cloud Audit Logs を調査可能な状態で維持する
- feature 作業や incident response の過程で、audit trail を安易に無効化したり保持期間を縮めたりしない

## Security Header 基準

- 公開 entry point では HTTPS redirect を強制する
- プラットフォームが対応する箇所では、HSTS、CSP、X-Content-Type-Options、X-Frame-Options、厳格な referrer policy を優先する
- あるクラウド経路が現時点で header 対応不足でも、それを追跡対象のギャップとして扱い、他クラウド側を弱めて合わせない

## 安全確認

- [ ] ブランチと環境の対応が正しい
- [ ] 境界違反がない
- [ ] 必要な認証がある
- [ ] ロールバックを準備した
- [ ] production の CORS、シークレット、WAF/DDoS 状態を確認した

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 14_CRITICAL_GUARDRAILS_EXTRACT
Scope: Issue #451 に対する exam-solver-api の staging 設定変更前ガードレール確認
Outcome: 慎重に続行
Actions taken: develop から staging への対応、exam-solver 境界、認証可否、ロールバック経路、deploy-exam-solver-aws.yml への引き継ぎ前提を確認した
Evidence: exam-solver staging 認証あり; Pulumi outputs 確認済み; Issue #451 に対応する直前の exam-solver 成果物を特定済み
Risks or blockers: production の exam-solver リリース判断は別途確認が必要
Next action: deploy-exam-solver-aws.yml 実行前に exam-solver の staging 検証へ進み、結果を exam-solver-reviewer へ渡し、exam-solver-approval-owner が確認するまで本番系は触らない
```
