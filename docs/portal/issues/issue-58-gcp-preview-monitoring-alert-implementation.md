## Summary

Issue 55 で GCP preview monitoring / alert routing baseline は固定されたが、Cloud Monitoring、alert policy、notification channel、runbook 連携などの実装はまだ repo と運用面に存在しない。このままだと、preview path の一次検知は人手依存のままで、closed issue 55 の baseline が live operations に接続されない。

## Goal

GCP preview monitoring / alert implementation の実装単位を整理し、signal source、alert policy、notification destination、runbook handoff、non-goals を reviewable な実行 issue として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-58
- タイトル: GCP preview monitoring / alert implementation を行う
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview monitoring implementation
- 優先度: 中
- 先行条件: Issue 52 closed, Issue 53 closed, Issue 55 closed, Issue 57 proposed

目的
- 解決する問題: monitoring baseline は fixed したが、preview public URL reachability、major route verification、notification owner、first-response path を live monitoring surface へ接続する実装が未作成のため、異常検知が人手依存のまま残る
- 期待する価値: GCP preview path の primary signal を monitoring / alert product に接続し、repository owner と supporting owner が一次対応できる notification path と runbook handoff を作れる

スコープ
- 含むもの: signal implementation、alert policy boundary、notification destination、runbook / issue / evidence handoff、verification plan、open questions table の作成
- 含まないもの: 24x7 on-call 体制、broad telemetry dashboard、SLO/SLI 数値最適化、production-wide alert routing 実装
- 編集可能パス: docs/portal/issues/issue-58-gcp-preview-monitoring-alert-implementation.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: monitoring 実装対象と signal source が文書から一意に読める
- [x] 条件 2: alert policy、notification destination、runbook handoff の責務分離が整理されている
- [x] 条件 3: 24x7 staffing や broad telemetry を混ぜず、preview alert implementation に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-58-gcp-preview-monitoring-alert-implementation.md
- アプローチ: Issue 55 の baseline を入力に、preview public URL、major route、resource / deploy evidence path を alert implementation へ接続する観点で signal / destination / runbook handoff を整理する
- 採用しなかった代替案と理由: 引き続き人手確認だけで済ませる案は detection gap が残るため採らない。逆に production-grade telemetry を同時導入する案は first-step preview scope を超えるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: signal implementation wording、destination wording、runbook handoff wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-55-gcp-monitoring-alert-routing-baseline.md、docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md、docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md を照合し、signal / owner / continuation 前提のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: preview monitoring 実装 issue の名目で production-grade dashboard、24x7 staffing、広範な telemetry 収集まで scope が膨らむこと
- 影響範囲: preview alert routing、owner expectation、cost、operational noise
- 緩和策: primary signal、notification destination、runbook handoff に限定し、broad telemetry は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は URL reachability と notification path だけを残し、追加メトリクスは別 issue に切り出す
```

## Tasks

- [x] primary signal 実装対象を整理する
- [x] alert policy と notification destination を整理する
- [x] runbook handoff と evidence 参照経路を整理する
- [x] preview scope 外の telemetry 要求を切り出す

## Definition of Done

- [x] monitoring 実装対象、notification destination、runbook handoff が 1 文書で追える
- [x] preview scope 外の telemetry / staffing が非対象として明示されている
- [x] verification plan が整理されている

## Initial Notes

- Issue 55 は signal、owner、first-response path まで固定した baseline issue である
- Issue 52 / 53 は preview deploy evidence と resource execution outputs を live state で残している
- continuation 判断が未了の場合でも、暫定運用するなら monitoring 実装の owner と retention が必要になる

## Issue 58 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `Issue 55 で固定した preview monitoring baseline を live implementation に落とすには何が必要か` に限定する
- dashboard や production-wide telemetry は扱わない
- 24x7 on-call staffing は扱わない

### 2. signal implementation の第一案

提案:

- primary signal は preview public URL と major route `/`、`/overview`、`/guidance` の reachability を起点にする
- deploy failure と blocked pending state は supporting signal として扱う
- provider control-plane state は supporting diagnostics に留める

### 3. notification destination の第一案

提案:

- repository owner を primary destination の第一候補にする
- deploy operator と DNS/operator reviewer は supporting destination に留める
- owner 未確定の external delivery channel は enable 前提にしない

### 4. runbook handoff の第一案

提案:

- alert から参照すべき evidence は deploy run URL、deployment evidence artifact、resource_execution_reference、reviewed target reference に揃える
- first-response 手順は Issue 55 と Issue 56 の triage / recovery path へ接続する

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                 | 判断方向（Discussion 時点の仮）                                           | Resolution 確定文言                                                                                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| primary signal を何に置くか                          | preview public URL と major route reachability を第一候補にする           | `primary signal は preview public URL と major route /、/overview、/guidance の Cloud Monitoring uptime checks に置く`                                                                                                       |
| notification destination をどこに置くか              | default は deploy evidence path、optional で owner-bound email を許可する | `notification destination は default では deploy run URL と deployment record artifact を canonical first-response path とし、monitoring_notification_email が明示設定された場合のみ owner-bound email channel を追加できる` |
| provider control-plane signal をどう扱うか           | supporting diagnostics に留める                                           | `provider control-plane signal は supporting diagnostics に留め、primary signal には昇格させない`                                                                                                                            |
| runbook handoff を何に置くか                         | Issue 55 と Issue 56 の triage / recovery path に接続する                 | `alert policy documentation と environment README から reviewed deploy evidence path と Issue 59 recovery runbook へ handoff できる状態にする`                                                                               |
| dashboard や broad telemetry をこの issue に含めるか | no。別 issue に切り出す                                                   | `dashboard depth、broad telemetry、24x7 staffing、automatic remediation は本 issue に含めない`                                                                                                                               |

## Resolution

Issue 58 の判断結果は次の通りとする。

- primary signal は preview public URL と major route `/`、`/overview`、`/guidance` の Cloud Monitoring uptime checks に置く
- notification destination は default では deploy run URL と deployment record artifact を canonical first-response path とし、`monitoring_notification_email` が明示設定された場合のみ owner-bound email channel を追加できる
- provider control-plane signal は supporting diagnostics に留め、primary signal には昇格させない
- alert policy documentation と environment README から reviewed deploy evidence path と Issue 59 recovery runbook へ handoff できる状態にする
- dashboard depth、broad telemetry、24x7 staffing、automatic remediation は本 issue に含めない

この合意で明確になること:

- retained preview は人手依存の smoke check だけではなく、Cloud Monitoring uptime checks と alert policies を持つ live monitoring surface に接続される
- default の first-response path は引き続き deploy evidence 中心であり、owner 未確定の外部通知先を前提にしない
- optional email destination は variable 経由で明示的にだけ有効化されるため、通知先 drift を起こしにくい
- provider diagnostics は supporting evidence に留まり、Issue 55 で固定した user-facing availability 主語を崩さない
- recovery handoff は README と alert documentation から Issue 59 へ接続できるため、alert 発火後の operator path を曖昧にしない

後続 issue への引き継ぎ事項:

- Issue 59 では alert 発火後の first-response path を recovery runbook と drill へ接続する
- Issue 60 では monitoring_notification_email を使う場合の owner / retention / governance を security hardening 側で再確認する
- dashboard や broader telemetry が必要になった場合は separate follow-up issue に切り出す

## Process Review Notes

- Section 5 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- 本 issue では `infra/environments/gcp-preview/monitoring.tf` に uptime checks、alert policies、optional notification channel を追加し、README と tfvars example を更新した
- follow-up cleanup として local apply 生成物 `infra/environments/gcp-preview/tfplan.monitoring` は repo 管理対象に含めず、`.gitignore` に tfplan pattern を追加して再発を防ぐ
- repo hygiene follow-up 完了後に re-review を実施し、追加の blocking findings はなく close 判定で確定した
- GitHub Issue #58 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- ISSUE CLOSED
- GitHub Issue: #58
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/58
- Sync Status: closed after re-review PASS
- Close Status: closed — re-review confirmed monitoring.tf implementation and repo hygiene (tfplan artifact removed, .gitignore updated) complete; no blockers

- local issue record として monitoring / alert implementation を固定した
- `infra/environments/gcp-preview/monitoring.tf` に Cloud Monitoring uptime checks、alert policies、optional owner-bound notification channel を追加し、uptime check の content matcher は provider 制約に合わせて 1 本の regex matcher へ集約した
- `infra/environments/gcp-preview/README.md` と `terraform.tfvars.example` に monitoring snapshot、first-response path、optional notification input を追記した
- `/tmp/opentofu-1.11.0/tofu apply` により gcp-preview 環境へ 3 本の uptime check と 3 本の alert policy を live 適用した
- Current uptime check IDs: root=`multicloudproject-gcp-preview-root-reachability-GXq2k8zSjBs`, overview=`multicloudproject-gcp-preview-overview-reachability-YWqgYb2H9Os`, guidance=`multicloudproject-gcp-preview-guidance-reachability-n3hEGz2ncLE`
- Current alert policy IDs: root=`projects/ashnova/alertPolicies/13322564960593715613`, overview=`projects/ashnova/alertPolicies/17871929588028771371`, guidance=`projects/ashnova/alertPolicies/13322564960593716894`
- optional notification channel は未設定のため `monitoring_notification_channel_names = []` のままとし、canonical first-response path は deploy run URL と deployment record artifact を維持している
- follow-up repo hygiene として generated tfplan artifact は削除し、tfplan pattern を ignore 対象へ追加した

## Dependencies

- Issue 52
- Issue 53
- Issue 55
- Issue 57
