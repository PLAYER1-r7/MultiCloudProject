# エスカレーションと引き継ぎ

## 流用ルール

- まず共通ペイロードをコピーし、`Outcome` を目的に応じて設定する
- 作業が詰まっている場合は `Outcome: Escalation requested`、完了してレビューや引き継ぎへ回す場合は `Outcome: Handoff ready` を固定値として使う
- 後続処理で機械的に読みやすいよう、項目順は変えない

## 正規 Execution Record 形式

docs 08 と 14-32 で使う共通記録形式はこれを正本とします。

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome:
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 共通ペイロード形式

上の正規 Execution Record 形式をそのまま使います。

## 即時エスカレーション条件

- 認証不足
- 本番リスクが高い
- セキュリティ後退につながる
- アーキテクチャ競合で安全実装が止まる

## エスカレーション内容

上の正規 Execution Record 形式を使い、`Outcome: Escalation requested` を設定します。

## エスカレーション項目ルール

- 現在の阻害要因と影響は `Risks or blockers` に入れる
- レビュアーまたは運用者に求める判断は `Next action` に入れる
- `Actions taken` には、エスカレーション前に確認済みの内容だけを書く

## コピー用エスカレーションテンプレート

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Escalation requested
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

## 引き継ぎ内容

上の正規 Execution Record 形式を使い、`Outcome: Handoff ready` を設定します。

## 引き継ぎ項目ルール

- 更新済みタスク契約と変更要約は `Actions taken` に入れる
- 検証証跡とロールバック証拠は `Evidence` に入れる
- 残存リスクは `Risks or blockers` に入れる
- 作業が Issue chain の close、停止、または child issue の不作成判断を含む場合は、その stop-condition の根拠を `Closure rationale` に記録する
- レビュアーが見るべき点や次の担当者の作業は `Next action` に入れる

## コピー用引き継ぎテンプレート

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope:
Outcome: Handoff ready
Actions taken:
Evidence:
Risks or blockers:
Closure rationale:
Next action:
```

## 記入例

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue #487 に対する staging の sns frontend_react ベースパス修正の引き継ぎ
Outcome: Handoff ready
Actions taken: frontend_react 側の変更範囲を整理し、deploy-sns-aws.yml への影響を確認した
Evidence: 文書目視確認完了; Issue #487 の /sns/ 経路に関する検証観点を記録済み
Risks or blockers: staging の /sns/ smoke test 実行結果は引き継ぎ先で確認が必要
Closure rationale: この引き継ぎでは Issue chain の close 判断は行っておらず、レビュー側の検証へ進めるだけである
Next action: sns-reviewer が frontend_react の /sns/ 経路と handoff 内容を確認し、その後 sns-approval-owner が deploy-sns-aws.yml を判断する
```

## Current Project Handoff Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: SNS issue クローズ後および safety branch 解体後の MultiCloudProject リポジトリ cleanup 到達点
Outcome: Handoff ready
Actions taken: Issue 119 と Issue 120 の実装が portal-web 側で既に完了していることを確認し、SNS contract validator を実行したうえで、ローカル issue 記録と GitHub Issue 本文を同期して両 issue をクローズした; 維持していた safety snapshot について、残差分を bucket ごとに監査し、forward な docset と portal docs の更新だけを main に cherry-pick して push した; その後、一時的な re-home branch、worktree、最後の safety snapshot branch を削除した
Evidence: GitHub 上に open issue と open pull request は存在しない; main には docset と portal docs の統合済み更新が含まれている; 一時的な safety/rehome branch と最終 safety snapshot branch はすべて削除済みである; リポジトリの working tree は clean である
Risks or blockers: 今後の作業では、削除済み safety snapshot の内容を再前提にせず、現在の main を正本として扱う必要がある; portal、cloud、process の追加 follow-up はすべて fresh task contract から始める新規スコープとして扱い、解体済み safety branch の継続とは見なさない
Closure rationale: 維持していた safety snapshot は、残っていた差分が main へ統合済みか、監査のうえで discard 済みかを確認できるまでだけ保持していた。この条件が満たされたため、snapshot 本体と関連 re-home branch を削除した
Next action: 次のチャットは fresh task contract から開始し、まず docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md とこのファイル内の最新 handoff record を読んだうえで、clean な main を前提に新規スコープとして作業する
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject における Issue 80 から Issue 91 クローズ後の GCP hardening 到達点の引き継ぎ
Outcome: Handoff ready
Actions taken: Issue 80 から Issue 91 の横断レビューを完了し、クローズ前にローカル正本 issue 記録の不整合を修正した; GCP parent map と cloud summary の文言を active execution entry から closed reference chain へ更新した; Issue 80 から Issue 91 の GitHub Issue 本文を再同期し、CloudSonnet review confirmation 後に全件クローズした
Evidence: GitHub Issue 80 から 91 は CLOSED である; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md は GCP chain を closed reference chain として記録している
Risks or blockers: 今後の GCP 作業で closed となった 80 から 91 の chain を再オープンしたり暗黙拡張したりしてはならない; retained preview、notification、Cloud Armor、credential rotation、destructive rollback の追加作業は fresh task contract と新しい follow-up issue chain を前提にする
Closure rationale: 最新の issue 群で必要な execution evidence が揃い、これ以上 child issue を増やしても新しい固定判断や実行境界が増えないため、この chain を close した
Next action: 次のチャットでは fresh task contract から開始し、まず docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md を読んだうえで、追加の GCP 作業を closed reference chain の再開ではなく新規 follow-up scope として扱う
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: MultiCloudProject における Issue 92 から Issue 95 クローズ後の AWS DNS verification 到達点の引き継ぎ
Outcome: Handoff ready
Actions taken: Issue 92 から Issue 95 までの DNS verification chain を見直し、ローカル issue 記録と GitHub issue 本文を揃えた; cloud status summary 上で AWS DNS verification flow を closed reference chain へ更新した; current phase で追加の DNS verification follow-up が残っていないことを確認したうえで GitHub Issue 92 から 95 をクローズした
Evidence: GitHub Issue 92 から 95 は CLOSED である; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md に DNS verification chain の closed reference 記述と短い retrospective がある
Risks or blockers: 今後の AWS DNS 作業で closed となった 92 から 95 の chain を暗黙拡張してはならない; provider credentials、provider API integration、Route 53 migration は別系統の governance または implementation track として残る
Closure rationale: Issue 95 が terminal dry-run draft を提供しており、これ以上 child issue を増やしても新しい証拠、新しい固定判断、新しい実行境界が増えないため、この chain を close した
Next action: 今後の AWS DNS 関連作業は fresh task contract から開始し、closed となった 92 から 95 の chain は参照専用として扱い、packaging-only な child issue は人間が明示承認しない限り作成しない
```

## 原則

止まるべき場面で止まることは失敗ではなく、安全な運用です。
