## Summary

Issue 56 で GCP preview rollback and recovery memo は fixed したが、実際に誰が、どの evidence path を見て、どの順で safe stop、artifact rollback、resource correction、DNS/operator rollback を行うかという runbook と drill 計画は未整備である。このままだと、recovery path は文書上の baseline に留まり、実 incident 時の実行品質が担保できない。

## Goal

GCP preview recovery runbook and drill baseline を整理し、trigger、owner、evidence path、restore sequence、drill cadence、non-goals を reviewable な実行 issue として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-59
- タイトル: GCP preview recovery runbook and drill baseline を整備する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: GCP preview recovery operations
- 優先度: 中
- 先行条件: Issue 52 closed, Issue 53 closed, Issue 56 closed, Issue 57 proposed

目的
- 解決する問題: rollback / recovery baseline は fixed したが、operator-facing runbook、evidence path、drill 手順、restore 完了判定が未整備のため、preview failure 時の recovery quality が人手依存になる
- 期待する価値: trigger、owner、evidence、restore sequence、drill cadence を整理し、preview path の recovery を reviewable に運用できる

スコープ
- 含むもの: recovery runbook structure、drill scope、owner、evidence path、restore sequence、post-recovery verification、open questions table の作成
- 含まないもの: automatic rollback 実装、production recovery runbook、same-hostname cutover recovery、incident command 組成
- 編集可能パス: docs/portal/issues/issue-59-gcp-preview-recovery-runbook-and-drill-baseline.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: recovery runbook の trigger、owner、restore sequence が文書から一意に読める
- [x] 条件 2: artifact / resource / DNS operator rollback boundary が runbook に接続されている
- [x] 条件 3: automatic rollback や production recovery を混ぜず、preview recovery operations に限定できている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-59-gcp-preview-recovery-runbook-and-drill-baseline.md
- アプローチ: Issue 56 の memo と Issue 52 / 53 の live evidence path を入力に、runbook と drill を trigger / owner / evidence / verification の 4 観点で整理する
- 採用しなかった代替案と理由: 失敗が起きたら都度判断する案は runbook 不在のままになるため採らない。逆に production recovery plan まで同時に作る案は preview scope を超えるため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: trigger wording、owner wording、restore sequence wording、drill wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-56-gcp-preview-rollback-and-recovery-memo.md、docs/portal/issues/issue-52-gcp-preview-workflow-execution.md、docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md、docs/portal/issues/issue-57-gcp-preview-continuation-shutdown-judgment.md を照合し、runbook / drill / retention のどこが欠けているかを分ける

リスクとロールバック
- 主なリスク: runbook issue の名目で自動 remediation や production cutover recovery まで scope が膨らむこと
- 影響範囲: preview recovery quality、owner expectation、operator burden
- 緩和策: preview runbook、drill cadence、evidence path に限定し、自動化と production recovery は follow-up に残す
- ロールバック手順: scope が広がりすぎた場合は restore sequence と evidence path だけを残し、drill cadence や automation は別 issue に切り出す
```

## Tasks

- [x] recovery trigger と owner を整理する
- [x] restore sequence と evidence path を整理する
- [x] post-recovery verification と drill cadence を整理する
- [x] preview scope 外の recovery 要求を切り出す

## Definition of Done

- [x] runbook trigger、owner、restore sequence、verification が読める
- [x] artifact / resource / DNS rollback boundary が読める
- [x] drill cadence と非対象が明示されている

## Initial Notes

- Issue 56 は rollback unit と recovery baseline まで固定した memo である
- Issue 52 / 53 は recovery の参照元になる workflow evidence と resource output を live state で残している
- preview を継続するなら、safe stop と restore の実行パスを owner ベースで明文化する必要がある

## Issue 59 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `Issue 56 の recovery baseline を operator-facing runbook と drill に落とすには何が必要か` に限定する
- automatic rollback は扱わない
- production recovery は扱わない

### 2. runbook structure の第一案

提案:

- runbook は trigger 判定、failure 分類、artifact rollback、resource correction、DNS/operator rollback、post-recovery verification の順で構成する
- blocked pending state は execution completed failure と分けて扱う
- first deploy / first apply で live baseline がない場合は safe stop を優先する

### 3. drill cadence の第一案

提案:

- drill は artifact path、resource path、DNS/operator path の代表ケースを最低単位にする
- continuation judgment が継続運用を選ぶ場合のみ cadence を設定する
- drill 証跡は issue / runbook / deployment evidence へ紐付ける

### 4. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                       | 判断方向（Discussion 時点の仮）                                                        | Resolution 確定文言                                                                                                                                                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| runbook の起点を何に置くか                 | trigger 判定、failure 分類、restore sequence を起点にする                              | `preview recovery runbook の起点は trigger 判定、failure 分類、artifact / resource / DNS-operator の restore sequence とする`                                                                                                      |
| blocked pending state をどう扱うか         | execution completed failure と分け、operator hold として扱う                           | `blocked pending state は execution completed failure と分け、safe stop と operator hold の起点として扱う`                                                                                                                         |
| evidence path を何に置くか                 | deploy run、deployment record、resource execution reference、monitoring state を揃える | `recovery evidence path は latest reviewed portal-gcp-preview-deploy run URL、step summary、portal-gcp-preview-deployment-record artifact、resource_execution_reference、Issue 58 の monitoring state を同じ review path に揃える` |
| drill cadence をいつ有効化するか           | retained preview 期間中に少なくとも 1 回実施する                                       | `preview が 2026-03-31 まで retained preview として継続する間、少なくとも 1 回の operator-reviewed recovery walkthrough を retention deadline 前に記録する`                                                                        |
| automatic rollback をこの issue に含めるか | no。別 issue に切り出す                                                                | `automatic rollback、destructive DNS reversal、production recovery は本 issue に含めない`                                                                                                                                          |

## Resolution

Issue 59 の判断結果は次の通りとする。

- preview recovery runbook の起点は trigger 判定、failure 分類、artifact / resource / DNS-operator の restore sequence とする
- blocked pending state は execution completed failure と分け、safe stop と operator hold の起点として扱う
- recovery evidence path は latest reviewed `portal-gcp-preview-deploy` run URL、step summary、`portal-gcp-preview-deployment-record` artifact、`resource_execution_reference`、Issue 58 の monitoring state を同じ review path に揃える
- preview が 2026-03-31 まで retained preview として継続する間、少なくとも 1 回の operator-reviewed recovery walkthrough を retention deadline 前に記録する
- automatic rollback、destructive DNS reversal、production recovery は本 issue に含めない

この合意で明確になること:

- preview recovery は baseline memo から operator-facing runbook へ移り、trigger 判定から restore sequence までの読み筋が 1 本になる
- Issue 58 の monitoring 実装で発火した signal と、Issue 52 / 53 の reviewed deploy / resource evidence が同じ first-response path に接続される
- blocked pending state を safe stop として扱うため、未成立の preview state を無理に restore 完了扱いしない
- retained preview 期間中の walkthrough cadence が固定されたため、runbook を未検証のまま期限まで放置しない
- destructive recovery は別 issue に切り出されるため、runbook baseline と実際の破壊的操作が混線しない

後続 issue への引き継ぎ事項:

- Issue 60 では retained preview の security hardening が recovery evidence path と owner path を壊さないことを確認する
- preview shutdown が必要になった場合は destroy / credential cleanup / DNS reversal を separate execution issue として切り出す
- production-equivalent promotion judgment では preview runbook をそのまま流用せず、別 uplift 前提で扱う

## Process Review Notes

- Section 4 の open questions は `Resolution 確定文言` 列を埋めたうえで本 Resolution に統合した
- `infra/environments/gcp-preview/README.md` に recovery snapshot、operator sequence、post-recovery verification、drill baseline を追加した
- post-close execution aid として [infra/environments/gcp-preview/recovery-walkthrough-template.md](infra/environments/gcp-preview/recovery-walkthrough-template.md) を追加し、README から walkthrough 記録の最小テンプレートへ直接到達できるようにした
- GitHub Issue #59 の body は local issue record の最新版へ再同期する前提で扱う

## Current Status

- ISSUE CLOSED
- GitHub Issue: #59
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/59
- Sync Status: local close note updated and GitHub issue body resynced before closing
- Close Status: GitHub issue closed; local record retained as final reference

- local issue record として recovery runbook / drill baseline を固定した
- `infra/environments/gcp-preview/README.md` に recovery snapshot、operator sequence、post-recovery verification、drill cadence を追加した
- walkthrough の実施を前倒ししやすくするため、README から参照できる operator-reviewed walkthrough record template を追加した
- retained preview 期間中の walkthrough cadence と safe-stop rule を Resolution として固定した
- 2026-03-09 に latest reviewed deploy evidence path を使った operator-reviewed walkthrough を実施し、artifact-path failure を起点とする非破壊の first-response 判断を記録した

## Walkthrough Execution Record

### Walkthrough Metadata

- Walkthrough date: 2026-03-09
- Walkthrough owner: repository owner
- Additional participants: AI agent
- Trigger class exercised: artifact-path failure
- Reason this path was selected: latest reviewed positive-path deploy evidence をそのまま first-response path に使えるため、retained preview の最小 walkthrough を非破壊で完了できる

### Evidence Path

- Latest reviewed `portal-gcp-preview-deploy` run URL: https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22850625525
- Step summary reference: `portal-gcp-preview-deploy` run `22850625525` の GitHub Actions step summary
- `portal-gcp-preview-deployment-record` artifact reference: run `22850625525` の artifact `portal-gcp-preview-deployment-record`
- `resource_execution_reference`: `docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md`
- Monitoring state reference: root=`multicloudproject-gcp-preview-root-reachability-GXq2k8zSjBs` / overview=`multicloudproject-gcp-preview-overview-reachability-YWqgYb2H9Os` / guidance=`multicloudproject-gcp-preview-guidance-reachability-n3hEGz2ncLE`; alert policies root=`projects/ashnova/alertPolicies/13322564960593715613` / overview=`projects/ashnova/alertPolicies/17871929588028771371` / guidance=`projects/ashnova/alertPolicies/13322564960593716894`
- Reviewed target reference: `A 34.128.181.172`
- Certificate-related reference: `multicloudproject-portal-preview-certificate domains=preview.gcp.ashnova.jp managed_status=ACTIVE`
- Selected known-good build reference: reviewed deploy commit `d8718f6fc27a1b5aeb63547bb95e23bab6fbae53` used by run `22850625525`

### Walkthrough Sequence Notes

- Trigger classification result: route-level alert または smoke failure が起きても、latest reviewed deploy evidence、reviewed target reference、certificate-related reference が一致している限り最初の扱いは artifact-path failure 候補とする
- First-response check result: latest reviewed deploy run、step summary、deployment record artifact、`resource_execution_reference`、monitoring IDs を同じ review path に束ねて確認できることを確認した
- Safe-stop judgment: destructive DNS reversal、live destroy、ad hoc console fix はこの walkthrough の対象外とし、evidence path が崩れていない限り first-response は reviewed deploy path 内で止める
- Artifact-path recovery decision: 同種の failure では reviewed `resource_execution_reference` を維持したまま、run `22850625525` と同じ known-good build provenance を起点に `portal-gcp-preview-deploy` を再 dispatch して artifact-path のみを先に回復対象とする
- Resource-path recovery decision: same-evidence redeploy が失敗するか、`resource_execution_reference` と reviewed target / certificate reference に drift が見えた場合にだけ `infra/environments/gcp-preview` の reviewed OpenTofu state へ戻す判断に進む
- DNS/operator-path recovery decision: artifact-path と resource-path が健全で、`reviewed_target_reference` または `certificate_related_reference` に不整合が出た場合にのみ DNS/operator-path を次段として扱う
- Supporting diagnostics consulted, if any: Issue 52 positive-path deploy record、Issue 53 delivery resource execution record、Issue 58 monitoring state record、Issue 56 recovery memo

### Verification Checklist

- [x] Confirm the walkthrough started from the latest reviewed deploy run URL rather than provider dashboards or DNS tools
- [x] Confirm the step summary and `portal-gcp-preview-deployment-record` artifact were reviewed on the same evidence path
- [x] Confirm `resource_execution_reference`, reviewed target reference, and certificate-related reference were checked together
- [x] Confirm the chosen recovery path stayed within the non-destructive Issue 59 boundary
- [x] Confirm `/`, `/overview`, and `/guidance` were included in the recovery verification plan
- [x] Confirm monitoring state was treated as part of the same operator review path
- [x] Confirm any follow-up action is recorded separately from the walkthrough itself

### Outcome

- Walkthrough verdict: accepted
- Follow-up actions: none required for the current retained-preview baseline; rerun a walkthrough if monitoring scope, security hardening scope, or delivery resource topology changes materially
- Recommended due date for follow-up: 2026-03-31 retention checkpoint or earlier if the evidence path changes
- Review sign-off note: operator-reviewed walkthrough completed against the latest positive-path evidence without expanding into destructive recovery or production scope

## Dependencies

- Issue 52
- Issue 53
- Issue 56
- Issue 57
