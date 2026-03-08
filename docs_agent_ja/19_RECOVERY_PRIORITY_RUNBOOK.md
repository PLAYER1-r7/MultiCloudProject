# 復旧優先度 Runbook

## この文書を使う場面

- 初動後に、複数の障害要素が競合して優先順位を決める必要があるときに使う
- なぜその復旧順を選ぶかを説明するときに使う

## 復旧順のルール

1. まず安全性と信頼境界を戻す
2. 次に主要な本番ユーザーフローを戻す
3. 二次的な劣化の修復は、主要経路が安定した後に行う

## 優先順位

1. セキュリティと認証整合性
2. 本番ユーザーフローの復旧
3. データ整合性
4. 可用性
5. 性能調整

## 重要度目安

- P0: 大規模本番障害またはセキュリティ事故
- P1: 回避策付きの重大劣化
- P2: staging または非クリティカル障害
- P3: 外観上の問題またはブロックしない不具合

## 復旧確認

```bash
./scripts/test-endpoints.sh
./scripts/test-e2e.sh
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 19_RECOVERY_PRIORITY_RUNBOOK
Scope: Issue #487 に対する staging の sns ログイン障害復旧優先順位決定
Outcome: 復旧順を決定した
Actions taken: deploy-sns-aws.yml 後の状況を基に、sns の利用者向けサインイン復旧をダッシュボード整備や補助的な管理導線より優先すると判断した
Evidence: Issue #487 では sns の主ログイン導線は停止し、非重要ページは到達可能だった
Risks or blockers: sns 認証復旧を優先すると、低優先度の監視整備は後ろ倒しになる
Next action: 二次障害対応より先に sns のサインイン導線を復旧し、復旧順を sns-reviewer と sns-approval-owner へ共有する
```
