## Summary

Issue 61 から Issue 67 で production-equivalent judgment、summary handoff、execution preparation は閉じられた。次段では、reviewed execution package を入力にして、live deploy、authoritative DNS change、post-change verification、rollback / evidence retention を operator-managed な live execution issue として明示的に追跡する必要がある。

## Goal

GCP production-equivalent live execution を管理し、reviewed execution package を入力にした release-sensitive live change、approval handoff、rollback / evidence retention、post-change verification を fail-closed な execution issue として固定する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-68
- タイトル: GCP production-equivalent live execution を行う
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: future GCP production-equivalent live execution
- 優先度: 中
- 先行条件: Issue 61 closed, Issue 62 closed, Issue 63 closed, Issue 64 closed, Issue 65 closed, Issue 66 closed, Issue 67 closed

目的
- 解決する問題: production-equivalent judgment と execution package は揃ったが、live deploy、authoritative DNS change、approval owner judgment、rollback branches、post-change verification を一つの release-sensitive execution issue で追えていない
- 期待する価値: reviewed execution package を入力にした operator-managed live execution path を一件で追跡し、go / no-go、safe-stop、rollback、evidence retention の境界を fail-closed に管理できる

スコープ
- 含むもの: live deploy 実行判断、authoritative DNS change judgment と operator handoff、reviewer package / approval owner handoff、rollback branches 実行境界、post-change verification、evidence retention の記録
- 含まないもの: 新しい hostname / DNS governance judgment、approval policy redesign、Cloud Armor / credential governance の新規判断、automatic rollback 実装、Cloud DNS migration redesign
- 編集可能パス: docs/portal/issues/issue-68-gcp-production-equivalent-live-execution.md
- 制限パス: closed issue records except explicit evidence references

受け入れ条件
- [x] 条件 1: live execution issue から hostname / DNS、approval handoff、notification / escalation、rollback / evidence retention の concrete input と未確定項目が区別して読める
- [x] 条件 2: go / no-go、safe-stop、rollback branches、post-change verification の境界が整理されている
- [x] 条件 3: new judgment を追加せず、closed judgment set と reviewed execution package を入力にした live execution issue に限定されている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-68-gcp-production-equivalent-live-execution.md
- アプローチ: Issue 62 から Issue 67 を入力に、release-sensitive live execution を operator-managed sequence、approval handoff、rollback branches、evidence retention、post-change verification の 5 観点で整理する
- 採用しなかった代替案と理由: summary issue や preparation issue の中に live change を埋め込む案は approval と rollback の境界を曖昧にするため採らない。逆に issue を起こさず ad hoc に live change を進める案は evidence path と fail-closed 条件を失うため採らない

検証計画
- 実行するテスト: markdown review; get_errors on edited files
- 確認するログ/メトリクス: live-execution wording、approval handoff wording、rollback / evidence wording、post-change verification wording の整合
- 失敗時の切り分け経路: docs/portal/issues/issue-62-gcp-production-equivalent-hostname-dns-governance-judgment.md、docs/portal/issues/issue-63-gcp-production-equivalent-approval-gate-and-environment-protection.md、docs/portal/issues/issue-64-gcp-production-equivalent-security-monitoring-and-rollback-uplift.md、docs/portal/issues/issue-65-gcp-production-cutover-and-same-hostname-migration-execution-boundary.md、docs/portal/issues/issue-66-gcp-production-equivalent-judgment-summary-and-execution-handoff.md、docs/portal/issues/issue-67-gcp-production-equivalent-execution-preparation.md を照合し、live input / approval / rollback / verification の欠落箇所を分ける

リスクとロールバック
- 主なリスク: concrete input が空のまま live execution issue を closed judgment の代用品として扱い、未確定事項を実行時に持ち込むこと
- 影響範囲: release safety、DNS correctness、rollback readiness、review traceability
- 緩和策: reviewed execution package の concrete input を明記し、未確定項目は `TBD` のまま実行しない
- ロールバック手順: concrete input が未確定のまま scope が膨らんだ場合は issue を execution-preparation 差し戻し扱いにし、safe-stop で止めて separate follow-up を起こす
```

## Tasks

- [x] concrete hostname / DNS live input の既知値と未確定値を分離して記録する
- [x] reviewer package と approval owner handoff の baseline を live execution 前提で固定する
- [x] go / no-go、safe-stop、rollback branches、evidence retention path の baseline を固定する
- [x] post-change verification と close 条件、および実値収集項目を固定する

## Definition of Done

- [x] live execution input と approval handoff の baseline が一件で読める
- [x] rollback / evidence retention / post-change verification の境界が読める
- [x] new judgment を追加せず execution issue の review baseline と実値収集項目が読める

## Initial Notes

- Issue 62 は dedicated hostname candidate、DNS source-of-truth、operator-managed authoritative DNS write boundary を固定した
- Issue 63 は reviewer / approval owner 分離と release-sensitive action boundary を固定した
- Issue 64 は external notification / escalation、Cloud Armor / credential governance uplift、rollback drill expectation を固定した
- Issue 65 は same-evidence redeploy、resource correction、hostname / DNS rollback、evidence retention boundary を固定した
- Issue 66 は single-entry summary / handoff record を固定した
- Issue 67 は reviewed execution package と live execution handoff gate を固定した

## Issue 68 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `reviewed execution package を入力にした live execution をどう fail-closed に進めるか` に限定する
- new judgment や redesign は扱わない
- preparation record の再要約ではなく actual live execution の入口条件と実行境界に集中する

### 2. live input set の第一案

提案:

- dedicated hostname candidate: `www.gcp.ashnova.jp`
- reviewed target reference for dedicated hostname candidate: `A 34.128.181.172`
- approval owner named assignment / approval comment path: repository owner / GitHub Issue #68 comment thread
- DNS source-of-truth: external DNS
- authoritative DNS write owner: repository owner as operator-managed step executor
- notification / escalation decision: external destination は今回採用せず、reviewed deploy evidence path、deployment record artifact、GitHub Issue #68 comment thread を canonical first-response path として維持する
- post-change verification URL / route set: `https://www.gcp.ashnova.jp/`, `https://www.gcp.ashnova.jp/overview`, `https://www.gcp.ashnova.jp/guidance`
- reviewed target reference / certificate-related reference / notification destination / escalation path / rollback branch reference は Issue 67 package link に束ねる

### 3. execution sequence の第一案

提案:

- reviewer package 完了を確認する
- approval owner が go / no-go を判断する
- live deploy と release-sensitive operator step を evidence path 付きで実行する
- authoritative DNS change がある場合も same evidence path に残す
- post-change verification を通過しない限り close しない

### 4. rollback / safe-stop の第一案

提案:

- safe-stop 条件を先に明示し、未確定 input や不足 evidence があれば実行しない
- rollback は same-evidence redeploy、resource correction、hostname / DNS rollback の分岐で扱う
- destructive rollback / live destroy は separate approval target に留める

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                       | 判断方向（Discussion 時点の仮）                                   | Resolution 確定文言                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| live execution の concrete hostname candidate を何に置くか | reviewed execution package から確定値を引く                       | `live execution の concrete hostname candidate は Issue 62 の judgment に従い preview.gcp.ashnova.jp を流用せず、www.aws.ashnova.jp と衝突しない dedicated hostname candidate として www.gcp.ashnova.jp を採用する`                                                                                                   |
| live execution go / no-go を何で判断するか                 | reviewer package 完了と approval owner judgment を前提にする      | `live execution の go / no-go は reviewed execution package 完了、reviewer package と approval owner handoff の同一 evidence path への固定、latest reviewed deploy evidence と monitoring state の参照可能性を満たしたうえで approval owner が判断する`                                                               |
| authoritative DNS change をどの evidence path に残すか     | operator-managed step を同一 execution record に残す              | `authoritative DNS change は external DNS source-of-truth を前提に workflow / IaC へ埋め込まず、operator-managed step として live execution issue 本文、reviewer package、approval comment path、deployment record artifact の同一 evidence path に残す`                                                              |
| rollback / safe-stop をどの分岐で扱うか                    | redeploy / resource correction / hostname-DNS rollback を明示する | `rollback / safe-stop は input 未確定時の safe-stop、same-evidence redeploy、infra/environments/gcp-preview を基準にした resource correction、artifact-path と resource-path が健全であることを確認した後にだけ進む hostname / DNS rollback の 3 分岐で扱い、destructive rollback は separate approval target とする` |
| close 条件を何に置くか                                     | post-change verification と evidence retention 完了を前提にする   | `Issue 68 の close 条件は post-change verification、monitoring state 確認、rollback / evidence retention path の同期、approval owner judgment 結果、safe-stop または rollback を含む最終結果が同一 evidence path に記録されていることに置く`                                                                          |

## Resolution

Issue 68 の live execution baseline は次の通りとする。

- live execution の concrete hostname candidate は Issue 62 の judgment に従い preview.gcp.ashnova.jp を流用せず、www.aws.ashnova.jp と衝突しない dedicated hostname candidate として `www.gcp.ashnova.jp` を採用する
- live execution に使う reviewed target reference は current GCP delivery surface の shared global external HTTPS load balancer output を引き継ぎ、`www.gcp.ashnova.jp` に対応づく first reviewed target reference として `A 34.128.181.172` を採用する。reviewed target reference がこの値から変わる場合は、approval owner judgment 前に same evidence path 上の reviewer package を更新するまで DNS change を進めない
- live execution の go / no-go は reviewed execution package 完了、reviewer package と approval owner handoff の同一 evidence path への固定、latest reviewed deploy evidence と monitoring state の参照可能性を満たしたうえで repository owner を named approval owner として GitHub Issue #68 comment thread に判断を残した場合にのみ進める
- authoritative DNS change は external DNS source-of-truth を前提に workflow / IaC へ埋め込まず、repository owner を named operator assignment とする operator-managed step として live execution issue 本文、reviewer package、approval comment path、deployment record artifact の同一 evidence path に残す
- external notification / escalation destination は今回の live execution input には追加せず、reviewed deploy evidence path、deployment record artifact、GitHub Issue #68 comment thread を canonical first-response path として維持する。owner-bound external destination uplift が必要になった場合は Issue 64 judgment に従う separate follow-up とする
- rollback / safe-stop は input 未確定時の safe-stop、same-evidence redeploy、infra/environments/gcp-preview を基準にした resource correction、artifact-path と resource-path が健全であることを確認した後にだけ進む hostname / DNS rollback の 3 分岐で扱い、destructive rollback は separate approval target とする
- Issue 68 の close 条件は `https://www.gcp.ashnova.jp/`、`/overview`、`/guidance` を対象にした post-change verification、monitoring state 確認、rollback / evidence retention path の同期、approval owner judgment 結果、safe-stop または rollback を含む最終結果が同一 evidence path に記録されていることに置く

この live execution baseline で明確になること:

- live execution issue は Issue 66 の summary や Issue 67 の preparation record の代用品ではなく、release-sensitive action を一つの evidence path で実行・停止・巻き戻しするための record である
- preview の verified references は execution baseline の入力に使えるが、production-equivalent hostname candidate は `www.gcp.ashnova.jp` のように dedicated な値を別に持ち、preview hostname を shortcut として流用しない
- reviewed target reference は hostname そのものではなく operator handoff 用の target 値として扱い、current GCP delivery surface が shared global IP を返している限り `A 34.128.181.172` を `www.gcp.ashnova.jp` 向け first reviewed target reference に採用できる
- reviewer package と approval owner handoff は同じ evidence path に乗るため、repository owner を named approval owner として GitHub Issue #68 comment thread に固定し、parallel な ad hoc approval や unnamed operator step を許可しない
- authoritative DNS change と rollback は operator-managed step のまま維持され、workflow / IaC の自動化深度とは切り離して判断される
- notification / escalation は owner-bound external destination を今この issue で増設せず、deploy evidence path を canonical first-response path として維持するため、新しい routing judgment を持ち込まずに live execution を fail-closed に保てる
- post-change verification は dedicated hostname `www.gcp.ashnova.jp` に対する `/`、`/overview`、`/guidance` の HTTPS reachability を first close gate とし、preview hostname の成功で代替しない

## Known Live Input Snapshot

- dedicated hostname candidate: `www.gcp.ashnova.jp`。Issue 47 の候補群に含まれ、`www.aws.ashnova.jp` と衝突せず、provider label を hostname 上で保持できるため Issue 62 judgment と整合する
- reviewed target reference for dedicated hostname candidate: `A 34.128.181.172`。`infra/modules/portal-gcp-static-delivery/outputs.tf` は operator handoff を `A <global_ip_address>` 形式で出力し、current GCP delivery surface は shared global IP を HTTP / HTTPS forwarding rule で共用しているため、`www.gcp.ashnova.jp` も first-step ではこの target reference に対応づける
- approval owner named assignment / approval comment path: repository owner。approval owner judgment は GitHub Issue #68 の comment thread を canonical path とし、reviewer package と同じ evidence path 上で go / no-go、safe-stop、rollback judgment を残す
- DNS source-of-truth: external DNS
- authoritative DNS write owner: repository owner as operator-managed step executor under approval owner judgment。Issue 46 / Issue 51 の external DNS source-of-truth と authoritative write prohibition に従い、workflow / IaC 外の owner-bound step として記録する
- current verified preview public URL baseline: `https://preview.gcp.ashnova.jp`
- current verified preview reviewed target reference baseline: `A 34.128.181.172`。Issue 53 live evidence と一致しており、dedicated hostname candidate に再利用する first reviewed target reference の根拠にもなる
- current certificate-related reference baseline: `multicloudproject-portal-preview-cert-b4c0af33 domains=preview.gcp.ashnova.jp,www.gcp.ashnova.jp status_ref=google_compute_managed_ssl_certificate`
- current selected environment entrypoint reference baseline: `infra/environments/gcp-preview`
- latest reviewed deploy evidence baseline: `portal-gcp-preview-deploy` run `22850625525`
- latest reviewed build provenance baseline: deploy commit `d8718f6fc27a1b5aeb63547bb95e23bab6fbae53` used by run `22850625525`
- resource execution reference baseline: `docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md`
- monitoring state baseline: uptime checks `multicloudproject-gcp-preview-root-reachability-GXq2k8zSjBs`, `multicloudproject-gcp-preview-overview-reachability-YWqgYb2H9Os`, `multicloudproject-gcp-preview-guidance-reachability-n3hEGz2ncLE`; alert policies `projects/ashnova/alertPolicies/13322564960593715613`, `projects/ashnova/alertPolicies/17871929588028771371`, `projects/ashnova/alertPolicies/13322564960593716894`
- notification / escalation baseline: external destination は今回採用せず、reviewed deploy evidence path、deployment record artifact、GitHub Issue #68 comment thread を canonical first-response path として維持する。Issue 64 が要求する external destination uplift は separate follow-up judgment / implementation に残す
- post-change verification URL / route set: `https://www.gcp.ashnova.jp/`、`https://www.gcp.ashnova.jp/overview`、`https://www.gcp.ashnova.jp/guidance`。Issue 58 / Issue 64 の monitored-path baseline と揃え、dedicated hostname 上で same route set を確認する

## Live Execution Baseline

- reviewer package は latest reviewed deploy evidence、resource execution reference、reviewed target reference、certificate-related reference、monitoring state reference、rollback branch reference を同一 record に束ねる
- approval owner handoff は reviewer package 完了後にのみ行い、repository owner を named approval owner として go / no-go、safe-stop、rollback、authoritative DNS change judgment を GitHub Issue #68 comment thread に残す
- live deploy を開始する前に canonical first-response path が reviewed deploy evidence path、deployment record artifact、GitHub Issue #68 comment thread で一意に参照できなければ safe-stop とする
- authoritative DNS change は artifact-path と resource-path が healthy であることを reviewer package 上で確認した後にのみ進める

## Rollback And Safe-Stop Branches

- safe-stop: canonical first-response path または evidence retention input のいずれかが未確定なら実行しない
- same-evidence redeploy: latest reviewed deploy evidence path と same build provenance を使って redeploy し、新しい artifact を ad hoc に作らない
- resource correction: `infra/environments/gcp-preview` の reviewed state と issue-53 baseline を参照して drift correction を行い、console-only fix を steady state にしない
- hostname / DNS rollback: artifact-path と resource-path が healthy であり、reviewed target / certificate reference と operator step の不整合が DNS/operator path に限定される場合にのみ approval owner judgment 下で進める
- destructive rollback / live destroy / credential cleanup: separate approval target として扱い、本 issue の implicit fallback にしない

## Post-Change Verification And Close Gate

- target hostname `https://www.gcp.ashnova.jp/`、`https://www.gcp.ashnova.jp/overview`、`https://www.gcp.ashnova.jp/guidance` の HTTPS reachability が expected shell marker または expected response を返す
- latest live deploy evidence、deployment record artifact、resource execution reference、authoritative DNS step record、approval comment path が同じ evidence path で参照できる
- monitoring state が normal に戻っているか、あるいは同じ evidence path 上で明示的に acknowledged されている
- rollback / evidence retention checklist が safe-stop、success、rollback のいずれの結果でも同じ issue record 上に残っている

## Approval Owner Judgment Comment Template

GitHub Issue #68 の comment thread には、最低でも次の形式で approval owner judgment を残す。

```text
Approval Owner Judgment

- Approval owner: repository owner
- Decision: GO | NO-GO | SAFE-STOP | ROLLBACK
- Decision timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed deploy evidence: portal-gcp-preview-deploy run 22850625525
- Reviewed build provenance: d8718f6fc27a1b5aeb63547bb95e23bab6fbae53
- Reviewed target hostname: https://www.gcp.ashnova.jp
- Reviewed target reference: A 34.128.181.172
- Resource execution reference: docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md
- Monitoring state reference: uptime checks / alert policies reviewed
- Authoritative DNS step status: pending | completed | not-needed
- Decision rationale: <why this decision is safe>
- Required follow-up: none | <follow-up>
```

## Authoritative DNS Step Record Template

authoritative DNS step を実施する場合は、GitHub Issue #68 本文または同 comment thread に最低でも次の記録を残す。

```text
Authoritative DNS Step Record

- Operator: repository owner
- Execution timestamp: YYYY-MM-DD HH:MM UTC
- Hostname: www.gcp.ashnova.jp
- Record type: A
- DNS source-of-truth: external DNS
- TTL baseline: <value>
- Before target value: <value>
- After target value: 34.128.181.172
- Reviewed target reference: A 34.128.181.172
- Certificate-related reference: multicloudproject-portal-preview-certificate domains=preview.gcp.ashnova.jp managed_status=ACTIVE
- Reviewed deploy evidence: portal-gcp-preview-deploy run 22850625525
- Reviewed build provenance: d8718f6fc27a1b5aeb63547bb95e23bab6fbae53
- Reachability result: success | failure | pending
- Verification notes: <summary>
- Rollback trigger observed: no | yes (<details>)
```

## Actual Value Collection Checklist

- [x] dedicated hostname candidate として `www.gcp.ashnova.jp` を採用し、Issue 62 judgment と矛盾しないことを reviewer package baseline に記録する
- [x] live execution に使う reviewed target reference として `A 34.128.181.172` を採用し、shared global IP handoff を `www.gcp.ashnova.jp` に対応づけて記録する
- [x] approval owner の named assignment を repository owner、approval comment path を GitHub Issue #68 comment thread として記録する
- [x] authoritative DNS write を実施する named operator assignment を repository owner として記録する
- [x] external notification / escalation destination は採用せず、reviewed deploy evidence path、deployment record artifact、GitHub Issue #68 comment thread を canonical first-response path として進めると確定する
- [x] live execution に使う post-change verification URL / route set を `https://www.gcp.ashnova.jp/`、`/overview`、`/guidance` として dedicated hostname candidate に対応づけて記録する

- CloudSonnet review で指摘された monitoring state acknowledgment 欠落を補い、same evidence path 上で close gate の整合を確認した

## Current Status

- CLOSED
- GitHub Issue: #68
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68
- Sync Status: synced to GitHub after monitoring state verification を追記し、Issue 68 close 後の closed record として再同期した
- Close Status: GitHub issue closed; local record retained as final reference
- Current approval owner judgment: GO。Google-managed certificate `multicloudproject-portal-preview-cert-b4c0af33` は `preview.gcp.ashnova.jp` と `www.gcp.ashnova.jp` の両方で `ACTIVE` となり、served certificate SANs も両 hostname を含む。`https://www.gcp.ashnova.jp/`、`/overview`、`/guidance` の HTTPS verification はすべて 200 を返して close gate を満たした
- Approval owner judgment comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402736937
- Prior SAFE-STOP judgment comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402476782
- Authoritative DNS step record comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402476769
- Propagation verification comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402474484
- Reviewed apply follow-up comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402563253
- Provisioning root-cause comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402717366
- Certificate recheck comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402719868
- Certificate activation verification comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402735409
- Monitoring state verification comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/68#issuecomment-402738357

- known live input baseline と未確定項目を分離し、preview verified reference を production-equivalent shortcut として流用しない条件を明示した
- go / no-go、safe-stop、rollback branches、post-change verification、close gate を同一 evidence path 上の live execution baseline として固定した
- actual value collection checklist は完了しており、reviewed apply 実行証跡、provisioning root-cause investigation、certificate activation verification、monitoring state verification、final approval owner judgment を comment thread に追加した
- provisioning blocker の root cause は `www.gcp.ashnova.jp` 側ではなく、同一 Google-managed certificate に含めた `preview.gcp.ashnova.jp` が一時的に `FAILED_NOT_VISIBLE` だった点にあったが、その後の DNS 更新反映で解消した
- 最新再確認では Google-managed certificate `multicloudproject-portal-preview-cert-b4c0af33` が `ACTIVE` となり、`preview.gcp.ashnova.jp` と `www.gcp.ashnova.jp` の両方が domainStatus `ACTIVE` へ収束した。`https://www.gcp.ashnova.jp/`、`/overview`、`/guidance` の HTTPS verification も 200 を返している
- monitoring state verification note: project `ashnova` 上では uptime checks `multicloudproject-gcp-preview-root-reachability-GXq2k8zSjBs`、`multicloudproject-gcp-preview-overview-reachability-YWqgYb2H9Os`、`multicloudproject-gcp-preview-guidance-reachability-n3hEGz2ncLE` が timeout `10s`、period `300s` のまま残存し、alert policies `projects/ashnova/alertPolicies/13322564960593715613`、`projects/ashnova/alertPolicies/17871929588028771371`、`projects/ashnova/alertPolicies/13322564960593716894` も enabled を維持している
- reviewed apply note: `infra/environments/gcp-preview` と `infra/modules/portal-gcp-static-delivery` の `additional_hostnames` support は reviewed apply 済みであり、state 上の managed domains と HTTPS host rule は `www.gcp.ashnova.jp` を含む。certificate provisioning blocker は解消済みで、close gate に必要な実測値は揃い、本 issue は closed へ移行した

## Dependencies

- Issue 61
- Issue 62
- Issue 63
- Issue 64
- Issue 65
- Issue 66
- Issue 67
