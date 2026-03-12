# Cloud Status And Remaining Tasks

## Summary

AWS と GCP の portal surface はどちらも表示可能な段階まで進んだため、次は live surface の有無ではなく、cloud ごとの follow-up を切り分けて扱う必要がある。

browser-facing portal copy update については、local repository 上の wording correction と live portal reflection を別作業として扱う。current portal copy correction は local validation まで完了しているが、public portal reflection は separate execution issue で扱う。

## Goal

AWS / GCP の current live state と残タスクをひと目で読める形に整理し、closed issue records を再編集せずに次の execution batch を起こしやすくする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: DOC-PORTAL-CLOUD-STATUS-2026-03-10
- Title: AWS/GCP current status と remaining tasks を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: repository documentation / local frontend
- Priority: medium
- Predecessor: Issue 16 closed, Issue 17 closed, Issue 18 closed, Issue 38 closed, Issue 39 closed, Issue 42 closed, Issue 45 closed, Issue 46 closed, Issue 57 closed, Issue 64 closed, Issue 68 closed

Objective
- Problem to solve: AWS と GCP の portal がどこまで live か、何が follow-up かが closed issue records に分散しており、次の execution batch を始めるための current summary が不足している
- Expected value: cloud ごとの current live state、remaining tasks、next batch の切り方を 1 つの summary と portal route から参照できる

Scope
- In scope: AWS / GCP current status summary、remaining tasks inventory、portal current status route の追加、README route seed 更新
- Out of scope: GitHub issue close/open operations、新規 cloud resource 実行、closed issue body の再同期、DNS / certificate / deploy の live changes
- Editable paths: docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md, apps/portal-web/src/main.ts, apps/portal-web/README.md
- Restricted paths: docs/portal/issues/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: AWS / GCP の current live state と remaining tasks を 1 つの repo document で読める
- [x] AC-2: portal-web から AWS / GCP の current status と next follow-up を参照できる
- [x] AC-3: closed issue records を再編集せず、現行の closed record を source of truth とした summary になっている

Implementation Plan
- Files likely to change: docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md, apps/portal-web/src/main.ts, apps/portal-web/README.md
- Approach: current closed issue records の Current Status / Final Review Result / follow-up wording を根拠に、cloud-specific summary を新規 doc と current status route へ集約する
- Alternative rejected and why: closed issue records を reopening 相当で更新する案は、evidence record を summary 用メモで汚しやすいため採らない

Validation Plan
- Commands to run: cd apps/portal-web && npm run test:baseline && npm run build
- Expected results: route validation passes; typecheck passes; production build succeeds
- Failure triage path: apps/portal-web/src/main.ts の route definition / nav group / action link を確認し、README route seed との差分を切り分ける

Risk and Rollback
- Risks: summary が closed issue record の結果より強い意味を持つように見えること
- Impact area: documentation accuracy, portal status wording
- Mitigation: live state と remaining tasks を分離し、new execution や approval judgment を勝手に含めない
- Rollback: current status route または summary wording が過剰なら追加 route と doc を削除し、既存 route seed のみへ戻す
```

## Current Live State

| Cloud | Current state                                                                                                                                                                                                                                                                                                                                   | Canonical evidence            |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| AWS   | production custom domain `https://www.aws.ashnova.jp` が live。production cutover、monitoring baseline、external DNS cutover / reversal memo は current path として整理済み                                                                                                                                                                     | Issue 38, Issue 41, Issue 42  |
| GCP   | retained preview `https://preview.gcp.ashnova.jp` は継続中で、production-equivalent hostname `https://www.gcp.ashnova.jp` の hostname / certificate / reachability baseline は Issue 68 で close 済み。current portal copy bundle parity と `/overview` `/guidance` `/status` の HTTP status parity は Issue 107 の live remediation で回復済み | Issue 57, Issue 68, Issue 107 |

## AWS Remaining Tasks

現在の AWS 側は delivery 自体ではなく、operator-managed hardening と automation depth が残タスクである。

Issue 69 から Issue 79 の AWS hardening chain は CloudSonnet review 確認後にすべて closed となっており、以下は active execution queue ではなく closed reference chain として扱う。

一方で、closed chain を再開せずに fresh contract から切り出した current open follow-up として Issue 92 が存在する。これは closed parent-map の更新対象ではなく、AWS DNS stream の新しい planning queue として扱う。

- external DNS provider credentials 管理、provider API 実装、Route 53 hosted zone creation、full DNS automation、multi-account DNS design は separate follow-up のまま残す
- 24x7 on-call、automatic remediation、broad chat fan-out、dashboard / SLO-SLI design は production alert delivery baseline の外側にある follow-up として残す
- automatic rollback、emergency override depth、incident runbook depth は current production path を壊さない別 execution batch として残す

Current parent-map view:

- Parent map | Issue 69 | closed
- DNS branch | Issue 70 -> Issue 73 -> Issue 74 -> Issue 75 | closed
- Alert branch | Issue 71 -> Issue 76 -> Issue 77 | closed
- Rollback branch | Issue 72 -> Issue 78 -> Issue 79 | closed

Current branch progress:

- DNS assistive automation branch | Issue 70 planning boundary fixed | Issue 73 と Issue 74 で helper material preparation と comparison 完了 | Issue 75 で execution issue、primary validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Alert tooling branch | Issue 71 owner-managed email path fixed | Issue 76 comparison 完了 | Issue 77 で execution issue、primary validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Rollback / runbook branch | Issue 72 documented-path discipline fixed | Issue 78 comparison 完了 | Issue 79 で execution issue、primary validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行

Current AWS sync state:

- Parent map | Issue 69 | current branch progress と closed-reference shape を反映した GitHub body synced 状態
- DNS branch | Issue 75 | dry-run evidence、primary validation comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Alert branch | Issue 77 | dry-run evidence、primary validation comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Rollback branch | Issue 79 | validation evidence、primary validation comment、parent-map alignment refresh evidence を含む closed record として synced 状態

Current AWS next-step shape:

- Parent map | Issue 69 | DNS、alert、rollback/runbook の latest closed execution references を束ねる
- DNS branch | Issue 75 | reviewable snippet draft、fail-closed dry-run evidence、paste-back compatibility を残した latest closed reference | credentials や provider API を含む live integration は separate issue に残す
- Alert branch | Issue 77 | local text generator の dry-run evidence、invalid input fallback、pointer-only boundary を残した latest closed reference | live sending や provider-native integration は separate issue に残す
- Rollback branch | Issue 79 | actual operator pack draft、operator-ready validation evidence、single-record boundary を残した latest closed reference | automatic rollback や workflow change は separate issue に残す
- DNS verification chain | Issue 92-95 | closed-reference chain | manual public DNS verification fallback、resolver comparison、checklist execution、terminal paste-back dry-run まで current-phase DNS verification scope を完結済み | provider credentials、provider API、Route 53 migration は separate governance / implementation track に残す

## GCP Remaining Tasks

現在の GCP 側は live hostname の表示可否ではなく、retained preview の扱いと production-equivalent hardening depth が残タスクである。

Issue 80 から Issue 91 の GCP hardening chain は CloudSonnet review 確認後にすべて closed となっており、以下は active execution queue ではなく closed reference chain として扱う。

- retained preview は 2026-03-31 を retention deadline とする judgment があるため、shutdown が必要になった場合は resource destroy、GitHub environment cleanup、evidence retention checklist を separate execution issue として切り出す
- live notification routing change、owner-bound external destination uplift は separate implementation issue の対象として残す
- Cloud Armor deep tuning、credential rotation execution、destructive rollback implementation は current uplift judgment を壊さない follow-up として残す

Current parent-map view:

- Parent map | Issue 91 | closed
- Retained preview branch | Issue 80 | supporting notes Issue 81 and Issue 82 | closed
- Notification branch | Issue 83 -> Issue 84 | closed
- Cloud Armor branch | Issue 85 -> Issue 86 | closed
- Credential rotation branch | Issue 87 -> Issue 88 | closed
- Destructive rollback branch | Issue 89 -> Issue 90 | closed

Current branch progress:

- Retained preview branch | Issue 80 continue baseline maintained | Issue 81 と Issue 82 を monitor-only supporting notes として保持 | completed decision comment と parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Notification branch | Issue 83 comparison 完了 | Issue 84 で stdout-only execution issue、completed validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Cloud Armor branch | Issue 85 comparison 完了 | Issue 86 で review-only execution issue、completed validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Credential rotation branch | Issue 87 comparison 完了 | Issue 88 で review-only execution issue、completed validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行
- Destructive rollback branch | Issue 89 comparison 完了 | Issue 90 で review-only execution issue、completed validation comment、parent-map alignment refresh まで完了し、chain 全体は closed reference へ移行

Current GCP sync state:

- Parent map | Issue 91 | current branch progress と closed-reference shape を反映した GitHub body synced 状態
- Retained preview branch | Issue 80 | completed decision comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Notification branch | Issue 84 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Cloud Armor branch | Issue 86 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Credential rotation branch | Issue 88 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Destructive rollback branch | Issue 90 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態

Current GCP next-step shape:

- Parent map | Issue 91 | retained preview、notification uplift、Cloud Armor、credential rotation、destructive rollback の latest closed references を束ねる
- Retained preview branch | Issue 80 | continue / shutdown-triggered / defer の decision matrix を残した latest closed decision reference | Issue 81 と Issue 82 は positive evidence がある場合だけ再判定に使う closed supporting references として残す
- Notification branch | Issue 84 | stdout-only local text generator draft、manual compose fallback、validation evidence を残した latest closed reference | live delivery implementation は separate issue に残す
- Cloud Armor branch | Issue 86 | review-only tuning pack draft、keep-minimum fallback、validation evidence を残した latest closed reference | live policy mutation は separate issue に残す
- Credential rotation branch | Issue 88 | review-only rotation pack draft、review-only checklist fallback、validation evidence を残した latest closed reference | live credential rotation は separate issue に残す
- Destructive rollback branch | Issue 90 | review-only rollback pack draft、destructive rollback checklist fallback、validation evidence を残した latest closed reference | live destructive rollback execution は separate issue に残す

## Suggested Next Batch

次の execution batch は parent map 起点で次の 2 本に分ける。

1. AWS hardening batch | parent map Issue 69 | closed reference chain Issue 75、Issue 77、Issue 79 | future AWS follow-up should start with a fresh task contract instead of reopening this closed chain
2. GCP lifecycle and hardening batch | parent map Issue 91 | closed reference chain Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 | supporting notes Issue 81、Issue 82 | future GCP follow-up should start with a fresh task contract instead of reopening this closed chain

Portal cloud-specific variant batch:

- fresh contract: docs/portal/23_PORTAL_CLOUD_SPECIFIC_VARIANT_FRESH_TASK_CONTRACT.md
- design issue: docs/portal/issues/issue-108-portal-cloud-specific-variant-design-and-delivery-strategy.md | design boundary fixed and ready for implementation handoff
- local implementation issue: docs/portal/issues/issue-109-portal-runtime-cloud-detection-and-content-model-implementation.md | runtime hostname detection, variant-aware route copy, and local preview fallback implemented locally
- AWS live reflection issue: docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md
- GCP live reflection issue: docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md
- batch rule: shared route structure is kept, runtime hostname-aware variant selection is the first strategy, and browser-facing reflection remains split by cloud
- current local evidence: `cd apps/portal-web && npm run test:baseline && npm run build` passed after runtime variant selection was added
- reviewed promotion candidate: commit `ebe45a91379688ef277f28a63ac9cdea5d44adf5`
- reviewed build and deploy evidence: build `22952659968`, staging `22952673408`, AWS production deploy `22952714344`, GCP deploy `22952760131`
- public verification result: `https://www.aws.ashnova.jp`, `https://www.gcp.ashnova.jp`, and `https://preview.gcp.ashnova.jp` all serve the promoted bundle hash `index-B6aEQIvb.js`, and `/`, `/overview`, `/guidance`, `/status` returned `HTTP 200` on the required public hosts
- route coverage boundary: public execution issues verify the 4 major flow routes `/`, `/overview`, `/guidance`, and `/status`; the remaining shared routes `/platform`, `/delivery`, and `/operations` stay covered by the local baseline validation recorded in Issue 109
- metadata/browser-automation follow-up candidate: commit `38085e8368fd0e266bca5a183530d065cab37a0a`
- metadata/browser-automation follow-up evidence: build `22953281656`, staging `22953295798`, AWS production deploy `22953349238`, GCP deploy `22953350674`
- runtime browser verification result: `cd apps/portal-web && npm run test:public-variants` passed against the public AWS, GCP, and preview hosts, confirming host-specific runtime title, description, variant marker, host marker, and route marker after deployment
- execution record split: Issue 110 is the closed AWS public verification record for this batch, and Issue 111 is the closed GCP public verification record for this batch

Portal live reflection follow-up:

- browser-facing portal copy update has been promoted and verified as live reflection on the public portal for commit `0991807895733669afb88dd592c42b07dd4817b3`
- separate execution record: [docs/portal/issues/issue-106-portal-live-reflection-execution.md](docs/portal/issues/issue-106-portal-live-reflection-execution.md)
- production evidence path: build run `22910183364`, staging run `22910230433`, production deploy run `22910302949`
- public verification summary: `https://www.aws.ashnova.jp`, `/overview`, `/guidance`, and `/status` returned `HTTP 200`, and the deployed bundle matched the local build artifact for the same commit
- next portal batch should start a fresh execution record instead of reopening Issue 106 for unrelated portal copy updates
- GCP parity recovery has been split into a fresh execution record: [docs/portal/issues/issue-107-gcp-portal-live-reflection-parity-recovery.md](docs/portal/issues/issue-107-gcp-portal-live-reflection-parity-recovery.md)
- current recovery evidence for that record: GCP deploy run `22911151750` switched the public shell from `/assets/index-OC6wphmQ.js` to `/assets/index-BW80L7rV.js`, the deployed bundle hash now matches AWS, and the follow-up live GCP delivery remediation restored `HTTP 200` on `/overview`, `/guidance`, and `/status`
- verified root cause: `/status` was omitted from the SPA rewrite set and from the default monitoring / smoke-path surface, and GCP backend-bucket deep links additionally required `custom_error_response_policy` to convert rewritten `404` responses into `/index.html` `200` responses
- live remediation outcome: `https://www.gcp.ashnova.jp/overview`, `/guidance`, `/status` and `https://preview.gcp.ashnova.jp/overview`, `/guidance`, `/status` now all return `HTTP 200` after URL map update plus CDN invalidation
- do not reopen Issue 68 for this mismatch; Issue 68 remains the historical hostname / certificate / reachability record

Current open follow-up note:

- AWS | fresh contract [docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md](docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md) から派生した DNS verification chain は Issue 92-95 で完結し、current-phase の追加 DNS verification follow-up は不要

DNS verification retrospective:

- AWS DNS verification chain は Issue 92-95 で完結し、Issue 95 の terminal dry-run draft 以降に新しい証拠、新しい固定判断、新しい実行境界は増えていなかった
- そのため、Issue 96-99 のような packaging-only extension は無効と判断し、current chain は closed reference として止めた
- 今後の同系統作業では、親 Issue に terminal condition を先書きし、2 件連続で前進がなければ child issue を増やさず close を再評価する
- provider credentials、provider API integration、Route 53 migration は DNS verification の残件ではなく、別系統の governance / implementation track として扱う

## Next Major Expansion Planning Note

- next major feature candidate is a simple SNS surface with message posting and listing, but this is not an extension of the current static-first baseline; it reopens auth、API、persistence、security、monitoring、rollback as a fresh planning track
- planning entry point: [docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md](docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md)
- do not reopen Issue 3 or Issue 7 for this work; keep them as historical static-first baselines and start a fresh issue chain for SNS expansion
- Azure support remains planning-only until 2026-04 because current monthly cost is already high; do not start actual Azure implementation or live resource operation before that gate is reopened
- during March, Azure work should be limited to cost guardrail judgment、IaC/workflow planning、identity portability、observability/rollback portability preparation

## SNS Regression Chain Status

- SNS regression planning parent issues Issue 113、Issue 115、Issue 116 are closed and now retained as baseline references after the child implementation chain completed
- SNS implementation child issues Issue 119、Issue 120、Issue 121、Issue 122 are closed as completed local implementation references for contract-side CLI coverage and browser-side local preview suites
- portal-web now includes the SNS service-backed route handler baseline、browser-local persistence/readback baseline、public-config and fail-closed auth boundary、updated contract validators、and updated browser suites for surface reachability plus auth-post-readback coverage in the same app workspace
- validated local evidence for the current first-slice chain is: `cd apps/portal-web && npm run typecheck && npm run test:routes && npm run test:sns-request-response-contract && npm run test:sns-auth-error-contract && npm run test:sns-surface-reachability && npm run test:sns-auth-post-readback`
- current browser-side completion signal is reviewable on the SNS surface through runtime status、completion signal、fallback policy、error code、retryable marker、and readback state selectors rather than local-demo-only wording
- staging review path has now been executed in the same evidence path: pushed commit `f9892a3a6a2b38a0ec982f37328215308414686f` -> `portal-staging-deploy` run `23012584685` -> `portal-sns-staging-review` run `23012658196`
- matched staging evidence is retained as the staging deploy run URL、`portal-staging-monitoring-record` artifact、and `portal-sns-staging-review-record` artifact, with review target `https://d32v64hg1mmmau.cloudfront.net` and passing reachability plus auth-post-readback checks
- current first slice is now staging-reviewed complete under the in-repo completion rule because staging monitoring、SNS surface reachability、and SNS auth-post-readback all passed in the same review path; any next SNS work should start from a fresh planning or execution record rather than reopening this chain
- current SNS next-step record is [docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md](docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md), with derived execution follow-ups [docs/portal/issues/issue-149-sns-service-persistence-path-execution.md](docs/portal/issues/issue-149-sns-service-persistence-path-execution.md)、[docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md](docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md)、and [docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md](docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md)
- next SNS work, if any, should start from a fresh planning or execution record rather than reopening Issue 113 through Issue 122, because the current regression chain is complete

## Execution Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: summarize AWS/GCP current status and remaining tasks without reopening closed issue records, then surface the same summary in portal-web
Outcome: Handoff ready
Actions taken: cloud status summary document added | portal-web current status route added | portal-web README route seed synchronized
Evidence: closed AWS and GCP issue records reread | portal-web route validation completed | typecheck completed | build completed locally
Risks or blockers: remaining tasks are operator-managed follow-up hardening batches | not blocking defects on the current live surfaces
Next action: AWS | parent map Issue 69 | closed reference chain Issue 75、Issue 77、Issue 79 | start any new AWS hardening work with a fresh task contract rather than reopening the closed chain | GCP | parent map Issue 91 | closed reference chain Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 | supporting notes Issue 81、Issue 82 | start any new GCP hardening work with a fresh task contract rather than reopening the closed chain
```
