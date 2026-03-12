## Summary

Issue 57 で GCP preview は retained preview として 2026-03-31 まで継続し、shutdown が必要になった場合は separate execution issue に切り出す judgment まで固定された。その後、Issue 68 により production-equivalent hostname `www.gcp.ashnova.jp` は close gate を通過して live となったため、retained preview `preview.gcp.ashnova.jp` を retention deadline まで継続するのか、shutdown execution split へ進めるのかを decision issue として追跡する必要がある。

## Goal

GCP retained preview shutdown decision を管理し、continue / shutdown-triggered / defer の判断条件、evidence retention input、GitHub environment cleanup boundary、separate execution split 条件を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-80
- Title: GCP retained preview shutdown decision を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP retained preview shutdown decision
- Priority: medium
- Predecessor: Issue 52 closed, Issue 53 closed, Issue 57 closed, Issue 68 closed

Objective
- Problem to solve: retained preview continuation / shutdown judgment は Issue 57 で fixed したが、production-equivalent live completion 後に preview を継続するか、shutdown execution split に進むかの current decision record はまだない
- Expected value: retention deadline、shutdown trigger、evidence retention input、GitHub environment cleanup boundary、separate execution split condition を current live state に接続した decision issue を持ち、destroy 実行を混ぜずに go / no-go を fail-closed に管理できる

Scope
- In scope: continue vs shutdown-triggered decision、retention deadline check、shutdown trigger check、evidence retention input set、GitHub environment cleanup boundary、separate execution issue split condition、decision comment template
- Out of scope: live resource destroy、GitHub environment cleanup 実行、credential cleanup 実行、preview traffic cutover、production-equivalent rollback、new governance redesign
- Editable paths: docs/portal/issues/issue-80-gcp-retained-preview-shutdown-decision.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: continue / shutdown-triggered / defer の判断条件が 1 文書で読める
- [x] AC-2: evidence retention input、GitHub environment cleanup boundary、separate execution split 条件が読める
- [x] AC-3: live destroy や credential cleanup を含めない decision issue に留まっている
- [x] AC-4: retention deadline と current live evidence が current decision input として接続している

Implementation Plan
- Files likely to change: issue-80, cloud status summary
- Approach: Issue 57 の retention deadline / shutdown trigger judgment、Issue 52 / 53 の preview workflow and resource evidence、Issue 68 の production-equivalent live completion を入力に、retained preview の current decision baseline を整理する
- Alternative rejected and why: いきなり resource destroy execution issue に進む案は continue / defer の判断余地を失いやすく、current evidence retention input の確認を飛ばすため採らない

Validation Plan
- Commands to run: get_errors on issue-80 and updated cloud status summary; read back the decision table and execution-split gate against Issue 57 resolution
- Expected results: continue / shutdown-triggered / defer の判断条件、evidence retention input、separate execution split 条件が読み取れる
- Failure triage path: Issue 57 の retention deadline / shutdown trigger judgment、Issue 52 / 53 の preview evidence、Issue 68 の production-equivalent close note を再照合し、decision input の欠落箇所を切り分ける

Risk and Rollback
- Risks: decision issue が destroy 実行承認や preview 即時停止の決定済み記録に誤読されること
- Impact area: preview availability expectation, evidence retention, GitHub environment safety
- Mitigation: continue / shutdown-triggered / defer の 3 分岐を明記し、destroy execution と environment cleanup 実行は separate issue に残す
- Rollback: decision wording が広がりすぎた場合は retention deadline、shutdown trigger、execution split gate だけを残し、cleanup detail は後続 issue に戻す
```

## Tasks

- [x] current decision baseline を整理する
- [x] evidence retention input と cleanup boundary を固定する
- [x] continue / shutdown-triggered / defer の分岐を固定する
- [x] separate execution split 条件と decision comment template を追加する

## Definition of Done

- [x] current favorite decision shape と contract boundary が 1 文書で読める
- [x] decision output shape が predecessor judgment / evidence set に接続している
- [x] operator decision path、fallback、validation shape が読める
- [x] live destroy、credential cleanup、environment mutation が非対象のまま維持されている

## Initial Notes

- Issue 57 は retained preview continuation / shutdown judgment として 2026-03-31 retention deadline、shutdown trigger、evidence preservation、cleanup split を固定した
- Issue 52 は preview deploy workflow と deployment record artifact path を固定した
- Issue 53 は preview resource execution、preview URL `https://preview.gcp.ashnova.jp`、reviewed target reference `A 34.128.181.172`、certificate-related reference を固定した
- Issue 68 は production-equivalent hostname `https://www.gcp.ashnova.jp/` が close gate を通過したことを fixed した

## Current Decision Baseline

- current retained preview URL baseline は `https://preview.gcp.ashnova.jp`
- current production-equivalent live baseline は `https://www.gcp.ashnova.jp/`
- retained preview continuation judgment は 2026-03-31 の retention deadline まで有効であり、current date 2026-03-10 時点では deadline 未到来である
- current decision は `continue unless shutdown trigger is positively met` を fail-closed baseline とする
- shutdown execution に進む場合でも、resource destroy、GitHub environment cleanup、evidence retention checklist 実行は separate execution issue に残す

## Decision Inputs Snapshot

- Retention deadline: `2026-03-31`
- Current date for decision baseline: `2026-03-10`
- Repository owner remains the primary owner for retained preview judgment
- Preview public URL baseline: `https://preview.gcp.ashnova.jp`
- Production-equivalent public URL baseline: `https://www.gcp.ashnova.jp/`
- Preview workflow evidence baseline: `portal-gcp-preview-deploy` run `22850625525`
- Preview resource execution reference baseline: `docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md`
- Reviewed target reference baseline: `A 34.128.181.172`
- Certificate-related reference baseline: `multicloudproject-portal-preview-cert-b4c0af33 domains=preview.gcp.ashnova.jp,www.gcp.ashnova.jp status_ref=google_compute_managed_ssl_certificate`
- Evidence retention input set: build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、closed issue records
- GitHub environment boundary: `gcp-preview` environment cleanup は shutdown execution split 後の separate action に残す

## Decision Branches

### 1. Continue

- retention deadline が未到来である
- repository owner が retained preview owner として継続可能である
- cost anomaly、security blocker、monitoring 未整備の長期化が current evidence path で確認されていない
- preview purpose がまだ残っているか、shutdown decision を即時に確定するだけの不足がある

### 2. Shutdown-triggered

- retention deadline 到来、preview purpose 完了、owner 不在、cost anomaly、security blocker、monitoring 未整備の長期化のいずれかが current evidence path で positive に確認されている
- evidence retention input が shutdown execution split 前に確保できる
- resource destroy、GitHub environment cleanup、evidence retention checklist を separate execution issue として切り出せる

### 3. Defer

- shutdown trigger の疑いはあるが current evidence path だけでは positive に確定できない
- continue のまま放置せず、不足 evidence を current issue record に追記して再判定する
- defer は indefinite continuation を意味せず、retention deadline と owner boundary を維持した一時判断に留める

Decision rule:

- current phase の default decision は `continue` であり、shutdown-triggered は positive trigger evidence がある場合にだけ採る
- `defer` は unknown を放置するラベルではなく、evidence が不足している場合だけに使う
- live destroy や environment cleanup 実行は decision result に含めず、必ず separate execution issue に切り出す

## Current Trigger Evidence Assessment

| Trigger / condition        | Current evidence path                                                                                                                                                                                                   | Current assessment             | Decision effect                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| Retention deadline reached | Issue 57 の retention deadline は `2026-03-31`、current date baseline は `2026-03-10`                                                                                                                                   | not met                        | shutdown-triggered に進まない                                                          |
| Preview purpose complete   | Issue 57 は retained preview を immediate shutdown ではなく timeboxed continuation として固定し、Issue 80 では preview shutdown execution split をまだ作成していない                                                    | not positively met             | continue か defer の範囲に留める                                                       |
| Owner absent               | Issue 57 と Issue 55 は repository owner を retained preview / notification の primary owner として固定しており、owner 不在 evidence は current issue path 上にない                                                     | not met                        | shutdown-triggered に進まない                                                          |
| Cost anomaly               | cost anomaly の positive evidence は current issue path 上に未記録                                                                                                                                                      | unknown but not positively met | continue baseline は維持するが、positive evidence なしで shutdown-triggered に進まない |
| Security blocker           | Issue 54 は pending certificate / target state を security blocker として扱うが、Issue 68 では certificate `multicloudproject-portal-preview-cert-b4c0af33` が `ACTIVE`、HTTPS verification は success と記録されている | not met                        | shutdown-triggered に進まない                                                          |
| Monitoring prolonged gap   | Issue 55 が monitoring baseline を固定し、Issue 68 では uptime checks と alert policies が enabled のまま残存している                                                                                                   | not met                        | shutdown-triggered に進まない                                                          |

Current judgment from the table:

- 2026-03-10 時点では shutdown trigger は positive に確認されておらず、current decision は `continue` を維持する
- `cost anomaly` と `preview purpose complete` は将来の再判定対象だが、current issue path では positive evidence 不足のため `shutdown-triggered` に進めない
- 新しい operator input が入るまでは `defer` ではなく `continue` が default である

## Supporting Path Current Assessment Note

- Issue 81 は `cost anomaly` supporting path を current reference とし、completed supporting-note comment は `monitor-only`、`no positive cost anomaly evidence is recorded in the current issue path` で記録されている
- Issue 82 は `preview purpose complete` supporting path を current reference とし、completed supporting-note comment は `monitor-only`、`no positive purpose-complete evidence is recorded in the current issue path` で記録されている
- current decision issue から見る限り、Issue 81 と Issue 82 はどちらも reassess request を起動しておらず、Issue 80 の default decision は引き続き `continue` のままである

Supporting reference links:

- Issue 81 completed supporting-note comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/81#issuecomment-402920449
- Issue 82 completed supporting-note comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/82#issuecomment-402921707

## Evidence Retention And Cleanup Boundary

- shutdown execution split 前に保持すべき evidence は Issue 57 の resolution に従い、build / deploy evidence、resource outputs、reviewed target reference、certificate-related reference、closed issue records とする
- GitHub environment `gcp-preview` の cleanup は decision issue では扱わず、separate execution issue で explicit に追う
- preview URL が live であっても、evidence retention input が未確認なら shutdown-triggered に進めない
- preview resource destroy と credential cleanup は decision comment や summary note だけで implied approval しない

## Evidence Gaps Requiring Fresh Operator Input

- `preview purpose complete` は current predecessor records だけでは positive / negative を固定し切れないため、repository owner が retained preview の remaining purpose を current comment で明示する必要がある。purpose-complete supporting note は Issue 82 を current reference path とする
- `cost anomaly` は billing or spend evidence を current issue path に持っていないため、positive signal が出た場合だけ Issue 81 の separate supporting note を追加する
- owner reassignment や owner absence は repository governance 側の変更がない限り current issue path では陰性扱いだが、owner change が発生した場合は current issue に即追記する

Fresh-input rule:

- 新しい operator input がない限り、Issue 57 / 68 を起点にした current assessment を再利用する
- 新しい input が `preview purpose complete` か `cost anomaly` を positive に変える場合のみ、shutdown-triggered の再判定に進む。`preview purpose complete` は Issue 82、`cost anomaly` は Issue 81 supporting note を current reference path とする
- 新しい input が監視欠落、certificate failure、target mismatch を示す場合は security / monitoring blocker として current issue に追記したうえで `defer` か `shutdown-triggered` を再判定する

## Execution-Split Gate

- shutdown trigger が current evidence path で positive に確認されている
- evidence retention input set が current issue record 上で列挙されている
- GitHub environment cleanup が separate action であることを明記している
- preview destroy、environment cleanup、credential cleanup の各 action が same issue に混ざっていない
- decision result が `shutdown-triggered` の場合でも separate execution issue の作成前に live action を開始しない

Gate outcome:

- gate を満たした場合のみ、shutdown execution split を次 issue として切り出す
- gate を満たさない場合は `continue` か `defer` に留め、current issue record 上で不足 evidence を補う

## Operator Validation Checklist

operator は shutdown execution split に進むか判断する前に次を順に確認する。

- [ ] retention deadline と current date の関係が current issue record 上で明示されている
- [ ] continue / shutdown-triggered / defer の 3 分岐が current evidence path と接続している
- [ ] evidence retention input set が列挙されている
- [ ] GitHub environment cleanup が separate action として扱われている
- [ ] live destroy、credential cleanup、environment mutation が current issue の scope に含まれていない

Checklist rule:

- 1 項目でも満たせない場合は shutdown execution split に進まず、`continue` または `defer` に留める
- checklist 完了は preview shutdown approval を意味せず、decision issue としての判断材料が揃ったことだけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Retained Preview Shutdown Decision Check

- Issue: #80
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Retention Deadline Check: continue | shutdown-triggered | defer
- Trigger Evidence Present: yes | no
- Evidence Retention Inputs Listed: yes | no
- Environment Cleanup Left To Separate Issue: yes | no
- Non-Goal Direction Preserved: yes | no
- Result: continue | shutdown-triggered-create-execution-issue | defer-pending-evidence
- Note: checklist completion confirms decision readiness only; it does not approve destroy, cleanup, or credential rotation
```

## Sample Completed Decision Comment

```text
Retained Preview Shutdown Decision Check

- Issue: #80
- Validation Timestamp: 2026-03-10 07:40 UTC
- Retention Deadline Check: continue
- Trigger Evidence Present: no
- Evidence Retention Inputs Listed: yes
- Environment Cleanup Left To Separate Issue: yes
- Non-Goal Direction Preserved: yes
- Result: continue
- Note: checklist completion confirms decision readiness only; it does not approve destroy, cleanup, or credential rotation
```

## Sample Completed Evidence Refresh Comment

```text
Retained Preview Evidence Refresh

- Issue: #80
- Refresh Timestamp: 2026-03-10 08:10 UTC
- Preview Purpose Complete: no positive evidence in current issue path
- Owner Present: yes
- Cost Anomaly Evidence Added: no
- Security Blocker Evidence Added: no
- Monitoring Gap Evidence Added: no
- Resulting Decision: continue
- Next Refresh Trigger: owner judgment change, cost anomaly evidence, security blocker evidence, monitoring prolonged gap, or retention deadline approach
```

## Combined Completed Comment

GitHub issue comment に 1 回で残す場合は、次の completed block をそのまま使う。

```text
Retained Preview Shutdown Decision Check

- Issue: #80
- Validation Timestamp: 2026-03-10 08:20 UTC
- Retention Deadline Check: continue
- Trigger Evidence Present: no
- Evidence Retention Inputs Listed: yes
- Environment Cleanup Left To Separate Issue: yes
- Non-Goal Direction Preserved: yes
- Result: continue
- Note: checklist completion confirms decision readiness only; it does not approve destroy, cleanup, or credential rotation

Retained Preview Evidence Refresh

- Issue: #80
- Refresh Timestamp: 2026-03-10 08:20 UTC
- Preview Purpose Complete: no positive evidence in current issue path
- Owner Present: yes
- Cost Anomaly Evidence Added: no
- Security Blocker Evidence Added: no
- Monitoring Gap Evidence Added: no
- Resulting Decision: continue
- Next Refresh Trigger: owner judgment change, cost anomaly evidence, security blocker evidence, monitoring prolonged gap, or retention deadline approach
```

## Parent Map Alignment Refresh Comment

Issue 91 追加後の retained preview branch alignment を GitHub issue comment に 1 回で残す場合は、次の block を使う。

```text
Retained Preview Parent Map Alignment Refresh

- Issue: #80
- Refresh Timestamp: 2026-03-10 11:35 UTC
- Parent Map Issue: #91
- Parent Map Entry Point Confirmed: yes
- Cost Anomaly Supporting Path Still Monitor-Only: yes
- Preview Purpose Supporting Path Still Monitor-Only: yes
- Trigger Evidence Present: no
- Resulting Decision: continue
- Note: parent map alignment confirms Issue 80 remains the retained preview execution entry point; it does not approve shutdown, destroy, or cleanup execution
```

## Validation Evidence

- shutdown trigger ごとの current evidence assessment を predecessor records に接続し、2026-03-10 時点の default decision が `continue` である理由を current issue record 上で固定している
- Issue 81 と Issue 82 の supporting path current state を current issue 内へ戻し、どちらも monitor-only のため default decision が変わっていないことを明示している
- current phase は destroy 実行や cleanup を含まず、shutdown-triggered 時も separate execution issue を要求する fail-closed boundary に留めている

## Non-Goals

- retained preview shutdown execution
- GitHub environment cleanup
- resource destroy approval
- credential rotation execution
- retention deadline redesign
- production-equivalent rollback

## Current Sync State

- GitHub body | completed decision comment、recorded primary comment、parent-map alignment refresh comment を含む current local record | synced 状態
- Boundary | decision readiness | 維持中; shutdown-triggered execution は separate issue に残置

## Current Status

- CLOSED
- GitHub Issue: #80
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/80
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/80#issuecomment-402919437
- Recorded alignment refresh comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/80#issuecomment-402991782

- Issue 57 の retained preview judgment を current live state に接続する decision issue として切り出した
- continue / shutdown-triggered / defer の 3 分岐、evidence retention input、execution-split gate、comment-ready template を current phase boundary 内で整理した
- `preview purpose complete` の fresh operator input path は Issue 82 の supporting note へ分離した
- `cost anomaly` の fresh operator input path は Issue 81 の supporting note へ分離した
