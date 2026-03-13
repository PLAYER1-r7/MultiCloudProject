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
Scope: production SNS apply、runtime cutover、production deploy evidence checkpoint
Outcome: Handoff ready
Actions taken: OpenTofu v1.11.5 を使って use_lockfile 付き backend を受け入れられる実行経路で production Terraform を再実行し、reviewed alias と ACM certificate input を維持したまま portal_sns_service resources を apply した; その過程で AWS 実 API が lambda:InvokeFunction permission に function_url_auth_type を許可しないことを確認し、shared module を修正して main へ 15601d2 として push した; production GitHub environment variable を更新し、PRODUCTION_SNS_SERVICE_BASE_URL を reviewed Function URL へ、PRODUCTION_SNS_SERVICE_MODE を http へ切り替えた; そのうえで build run 23064520097、staging run 23064537933、rollback reference https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22839461795、approver PLAYER1-r7、reviewed DNS/state-locking references を使って portal-production-deploy を dispatch し、run 23071598026 の success まで確認した
Evidence: production Terraform output には sns_service_function_name multicloudproject-portal-sns-production、sns_service_timeline_table_name multicloudproject-portal-sns-production-timeline、sns_service_function_url https://isrvwfbt2ve3rr3d6pk5ddwgle0zonfi.lambda-url.ap-northeast-1.on.aws/ が記録された; AWS verification では production Lambda function と DynamoDB table が active であることを確認した; Function URL の GET /api/sns/timeline は 200 OK と access-control-allow-origin https://www.aws.ashnova.jp を返した; portal-production-deploy run 23071598026 は success で、deployed production runtime-config.js は VITE_PUBLIC_SNS_SERVICE_MODE=http と reviewed Function URL を配信している
Risks or blockers: production service-backed runtime 自体は live だが、この checkpoint には public production surface 上での browser-driven SNS post/readback evidence まではまだ含まれていない; local .vscode/settings.json は未追跡のままであり、reviewed repository change には含めていない
Closure rationale: Issue 138 が扱う pre-deploy promotion boundary は、reviewed production infrastructure、runtime variable cutover、production deploy evidence が同じ path に揃ったことで充足した; 残件は deploy prerequisite 不足ではなく user-facing verification depth の追加確認である
Next action: 必要なら今回の apply/deploy evidence を local issue chain 側へ反映し、deploy smoke evidence を超える public user-facing verification が必要な場合だけ production browser-level SNS post/readback check を 1 回追加実施する
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: production SNS service-backed infrastructure wiring と apply readiness checkpoint
Outcome: Handoff ready
Actions taken: production 環境に portal_sns_service を配線し、production 用 output と runtime cutover 前提を production README / tfvars example へ追記した; shared portal-sns-service module の permission 定義を現行 provider validation に通る形へ修正した; backend 無効化状態で production / staging entrypoint のローカル validate を通した; remote production Terraform state を確認し、現状が static delivery resources のみで module.portal_sns_service をまだ含まないことを確認した; wiring change を main の commit 4e998db として push した
Evidence: infra/environments/production/main.tf は portal_sns_service を配線し、SNS CORS 用の production_base_url を導出する; infra/environments/production/outputs.tf は sns_service_function_name / sns_service_function_url / sns_service_timeline_table_name を公開する; shared module 互換修正後に infra/environments/production と infra/environments/staging の local validate は通過した; remote state inspection では production に module.portal_sns_service resource がまだ存在しないことを確認した; backend を外した local targeted planning では production SNS Lambda、Function URL permission、IAM role/policy、DynamoDB timeline table の加算的作成が示され、static-site destroy は意図されていない
Risks or blockers: 現在の container からは local OpenTofu CLI が backend 引数 use_lockfile = true を受け付けず、backend 接続ありの production plan/apply はここでは実行できていない; reviewed apply で sns_service_function_url が出力されて PRODUCTION_SNS_SERVICE_BASE_URL へ反映されるまでは、production runtime variable を http mode へ切り替えてはならない
Closure rationale: production wiring の publish と local validation は完了し、残存 blocker は Terraform graph ではなく backend 互換のある実行環境へ切り分けられたため、この checkpoint はそこで止めた; reviewed apply evidence がないまま runtime cutover を進めることは意図的に避けた
Next action: repository backend configuration を受け入れられる reviewed environment で production plan/apply を実行し、sns_service_function_url と timeline table output を production operator path に記録したうえで、Issue 138 配下で PRODUCTION_SNS_SERVICE_BASE_URL と PRODUCTION_SNS_SERVICE_MODE=http を更新して production SNS cutover へ進む
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: ClaudeSonnet コメント対応後の MultiCloudProject GitHub Issue 136-138 review follow-up
Outcome: Handoff ready
Actions taken: GitHub Issue 136 から 138 をローカル source record と照合して review 指摘を見直し、presentation layer 上の具体的な follow-up 2 点だけを解消した; docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md に parent contract を明示する 1 文を追加し、Issue 136 を単独で見ても GitHub-tracked parent planning contract だと読めるようにした; 更新後の本文を GitHub Issue 136 へ同期した; planning 系 filter と execution-planning 系 filter の整合を保つため、GitHub Issue 138 に planning ラベルを追加した
Evidence: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md には、approved child split は parent contract の entry condition を継承しなければならないと記録された; 更新したローカル issue record の markdown diagnostics は通過した; GitHub Issue 136 の本文には parent-contract wording が反映された; GitHub Issue 138 のラベルは planning, portal, aws, infrastructure, cicd, sns になった
Risks or blockers: GitHub Issue 136 から 138 に blocking な review issue は現時点で残っていない; 今後の follow-up では、Issue 138 を pre-deploy promotion boundary 以上に広げたり、未公開のローカル draft を accepted child issue として扱ったりしないこと
Closure rationale: 今回の ClaudeSonnet follow-up は GitHub issue 表示上の 2 つの defect の補正に限定し、parent-contract の可読性と label filter の整合が戻った時点で止めた; execution scope の拡張は行っていない
Next action: GitHub-tracked parent planning contract としては引き続き Issue 136 を使い、その唯一の approved child execution issue として Issue 138 を使う; Issue 155 と 156 は、後続 review で別の distinct child boundary が明示承認されるまで local-only のまま維持する
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue 136 配下で Issue 138 を作成した後の MultiCloudProject SNS production-hardening child-split review
Outcome: Handoff ready
Actions taken: Issue 136 配下のローカル SNS child draft 群が distinct execution boundary を持つかを見直し、pre-deploy promotion gate を扱う draft だけを最初の narrow child split として承認した; docs/portal/issues/issue-154-sns-production-promotion-execution.md から、production-delivery 向けの必要ラベルを付けて GitHub Issue 138 を作成した; ローカルの SNS planning record、portal status summary、handoff record を同期し、publish 済み child issue は Issue 138 のみ、Issue 155 と 156 は unpublished のままという状態へそろえた
Evidence: GitHub Issue 138 は open で期待したラベルが付与されている; docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md は Issue 136 配下の最初の publish 済み child split として Issue 138 を記録している; docs/portal/issues/issue-154-sns-production-promotion-execution.md は open な GitHub issue 状態と整合している; 更新した local summary と handoff file に対する markdown diagnostics は通過した
Risks or blockers: Issue 155 と 156 にはまだ GitHub issue record がなく、accepted execution issue として扱ってはならない; production-hardening 作業が Issue 136 を離れてよいのは Issue 138 経由だけであり、残りの unpublished draft へ直接進めてはならない
Closure rationale: publish したのは Issue 154 だけである。これは Issue 136 が抽象化していた distinct な pre-deploy promotion execution boundary を追加するためである。一方、Issue 155 と 156 は post-deploy 側の downstream boundary であり、現時点では immediate child issue として正当化できないため不作成を維持した
Next action: SNS production promotion preparation の GitHub-tracked child issue は、Issue 136 配下では Issue 138 のみを使う; Issue 155 と 156 は、post-deploy review により public verification または rollback hardening を別 issue に切り出す必要が確認されるまで local-only のまま維持する
```

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: Issue 136 / 137 作成後の MultiCloudProject における post-staging SNS / Azure planning queue 正規化
Outcome: Handoff ready
Actions taken: ローカルの SNS / Azure planning draft 群を docs_agent の issue decomposition guardrail と照合し、GitHub 追跡対象として SNS production-hardening contract 用の Issue 136 と March Azure planning-only batch 用の Issue 137 を必要ラベル付きで作成した; ローカル planning record と portal status summary をこの GitHub-tracked issue 状態へ同期した; さらに、SNS production の deeper child draft である Issue 154 から 156 は、明示的な人間承認が出るまで unpublished のまま維持する判断を記録した
Evidence: GitHub Issue 136 と 137 は open で、期待したラベルが付与されている; docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md と docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md は active follow-up queue として Issue 136 / 137 を指している; docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md と docs/portal/issues/issue-153-azure-planning-only-batch-contract.md は open な GitHub issue 状態と整合している; 更新したローカル記録に対する markdown diagnostics は通過した
Risks or blockers: SNS child draft である Issue 154 から 156 には、まだ明示的な人間承認も GitHub issue record もないため、accepted execution issue として扱ってはならない; production-hardening 作業は、distinct な execution boundary を持つ narrower child issue が正当化されるまで、Issue 136 の範囲内に留める必要がある
Closure rationale: 現時点の planning boundary は Issue 136 と 137 で既に捕捉できており、Issue 154 から 156 を今 publish すると、split が distinct な execution boundary を追加するという明示承認なしに chain を延長することになるため、不作成判断を維持した
Next action: SNS production-hardening planning の GitHub 追跡入口は、reviewer が narrower child split を明示承認するまで Issue 136 のみを使う; Azure 側は Issue 137 を planning-only queue として扱い、April reopen gate が意図的に承認されるまで live Azure execution は開始しない
```

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
