# Simple SNS And Azure Preparation Plan

## Summary

現行の portal は public-first、static-first、no end-user auth、no application persistence を前提に閉じている。一方、今回検討したい簡易SNSは message 投稿と表示だけの最小機能でも、end-user authentication、application API、persistent data、abuse control、secret handling、stateful rollback を新たに導入するため、既存前提をそのまま延長して進めるべきではない。

また、簡易SNSを導入したあとに unrelated feature の実装で SNS 側まで不用意に変更され、投稿・表示・認証まわりが壊れる再発リスクも early phase で抑える必要がある。そのため SNS 実装そのものだけでなく、後続拡張から SNS を守るための boundary、regression gate、change discipline も同じ planning track の一部として先に固定する。

また Azure 対応は将来拡張として整備したいが、現時点では月額コストが高く、actual implementation と live operation は 2026-04 以降へ遅らせるべきである。そのため 3 月中に進めるべきことは Azure 実装そのものではなく、cost-safe な planning、portability boundary、IaC/workflow contract の整理である。

## Goal

簡易SNS実装に向けた task breakdown と pre-implementation issues を整理し、そのうえで SNS を後続機能変更から守る実装保護方針と、Azure 対応を 2026-04 以降に開始できるように今のうちに固めるべき issue と前提条件を一つの計画として読めるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: DOC-PORTAL-EXPANSION-2026-03-11
- Title: simple SNS expansion and Azure preparation plan を整理する
- Requester: repository owner
- Target App: portal-web and future portal service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 108 through 111 closed; current portal cloud-specific variant batch treated as a closed reference chain

Objective
- Problem to solve: simple SNS は current static portal baseline を超える大きな仕様変更であり、auth、API、persistence、security、operations、post-SNS change protection を fresh planning track として整理しないと、既存 static-first issue chain と混線しやすく、後続機能で SNS を壊す再発も起きやすい
- Expected value: SNS 実装前に解くべき issue と実装タスク、SNS 実装保護の baseline、Azure を 2026-04 以降に着手するための pre-work を分けて計画できる

Scope
- In scope: SNS implementation task breakdown、SNS implementation 前に解くべき issue、SNS implementation protection baseline、Azure implementation に向けて先に整える issue、Azure actual implementation 前に解くべき issue、recommended phase plan
- Out of scope: actual auth provider selection execution、database creation、cloud resource apply、GitHub issue close/open operations、Azure live deployment start before 2026-04-01
- Editable paths: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/, infra/, .github/workflows/, docs/portal/issues/

Acceptance Criteria
- [x] AC-1: SNS implementation の task breakdown が execution-ready な粒度で整理されている
- [x] AC-2: SNS implementation 前に片付けるべき issue が current baseline との衝突点ベースで整理されている
- [x] AC-3: SNS 実装保護のための boundary、regression gate、change discipline が planning 粒度で整理されている
- [x] AC-4: Azure preparation issue と Azure implementation 前の blocker issue が 2026-04 defer judgment と接続して整理されている

Implementation Plan
- Files likely to change: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/17_IMPLEMENTATION_BACKLOG_DRAFT.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: current portal baseline、auth decision、backend/persistence decision、multi-cloud constraint、cloud status summary を再読し、fresh expansion track として SNS / Azure planning を切り出す
- Alternative rejected and why: existing Issue 3、Issue 7、Issue 8 を reopen する案は historical baseline と new expansion boundary を混線させるため採らない

Validation Plan
- Commands to run: get_errors on the updated planning docs
- Expected results: markdown diagnostics がなく、phase plan と issue ordering が読み取れる
- Failure triage path: auth decision、backend/persistence decision、multicloud constraint、cloud status summary のどの前提と矛盾したかを切り分ける

Risk and Rollback
- Risks: SNS planning が multi-cloud active-active 前提に膨らみ、first executable slice が不明瞭になること
- Impact area: portal roadmap, auth architecture, persistence model, Azure timing judgment
- Mitigation: SNS first slice は single-cloud execution boundary と cloud-neutral app contract を分け、Azure は 2026-04 まで planning-only に限定する
- Rollback: plan が広すぎる場合は SNS と Azure の親計画を分離し、Azure 側は cost and readiness memo のみに縮小する
```

## Current Baseline And Why A Fresh Track Is Required

- current portal baseline は public-first、static-first、repository-driven updates を前提に閉じている
- current auth baseline は end-user login を持たず、operator protection を portal 外に置いている
- current backend baseline は custom API と application persistence を持たない
- current multi-cloud baseline は product/app model を cloud-neutral に保つが、runtime multi-cloud write path までは扱っていない

したがって、簡易SNSは「画面追加」ではなく baseline 再定義である。message 投稿が入る時点で、少なくとも次の 5 点が新たな fixed decision になる。

1. 誰が投稿できるか
2. 何をどこまで保存するか
3. どうやって API と authorization を分けるか
4. abuse と moderation をどこで止めるか
5. どの cloud を first execution boundary にするか

## Simple SNS Implementation Task Breakdown

first executable slice は multi-cloud 同時実装ではなく、single-cloud の stateful backend を 1 本通し、その上で app contract を cloud-neutral に保つ形を推奨する。

### 1. Product And Domain Slice

- define posting model: 投稿本文、最大長、編集可否、削除可否、公開範囲
- define actor model: visitor、authenticated member、operator / moderator の責務分離
- define timeline model: 新着順のみか、固定表示や pagination を持つか
- define moderation floor: spam 対策、通報、非表示、operator intervention の最小線

### 2. Authentication Slice

- decide end-user authentication reopening as a fresh issue
- fix identity abstraction: provider-specific naming を app model に埋め込まない
- decide session boundary: read public / write authenticated / operator privileged
- define minimum authorization roles: guest、member、operator
- downstream canonical auth state names are signed-out、signed-in member、operator
- app-facing identity surface should stay provider-neutral and expose actor id、actor role、authentication state only

### 3. Data And API Slice

- define message entity: id、author reference、body、created_at、status、moderation flags
- define API boundary: post message、list messages、optional delete or hide action
- decide persistence family: first implementation の primary store と indexing strategy
- define retention and deletion policy: soft delete、hard delete、operator purge
- first release lookup and ordering minimum is message id lookup plus newest-first public timeline readback
- keep the minimum app-facing API surface aligned to `POST /api/sns/posts` and `GET /api/sns/timeline` with fail-closed error visibility

### 4. Frontend Slice

- split portal routes into public portal surface と SNS surface の boundary
- add auth-aware UI states: signed-out、signed-in、post pending、post failed
- define optimistic update or strict server-roundtrip strategy
- preserve existing portal route integrity while adding a separate SNS entry path

### 5. Security And Abuse Slice

- rate limiting and anti-abuse baseline
- content validation and size limits
- secret and credential handling for auth / API / data store
- audit trail for moderation-sensitive operations
- keep the first release security floor aligned to fail-closed invalid payload rejection, basic write throttling, obvious abuse blocking, and operator hide or soft-delete as the primary moderation path

### 6. Delivery And Operations Slice

- add service stack and environment variable contract without polluting the static delivery stack
- define deploy order between frontend and backend
- monitoring for API availability、auth failures、write latency、error bursts
- rollback path for schema changes、auth misconfiguration、bad deploys

### 7. Test Slice

- contract tests for auth and posting API
- integration tests for sign-in to post to readback major flow
- abuse boundary tests for invalid input and unauthorized post attempts
- rollback verification checklist for stateful deploys

### 8. SNS Implementation Protection Slice

- split SNS into explicit route、UI component、API client、domain/service、persistence adapter boundaries so unrelated features do not need to edit SNS internals by default
- define stable SNS contracts: post/create request、message read model、auth state model、moderation action surface
- require SNS critical-path regression coverage for any change that touches shared auth、routing、layout shell、API client、state management、design tokens used by SNS
- define a touch policy: unrelated feature work must not modify SNS contracts or SNS-owned modules without an explicit linked issue and regression evidence
- keep SNS behind a clearly named entry surface so portal-wide refactors can avoid accidental coupling
- define a compatibility checklist for shared-layer changes such as auth abstraction、navigation shell、error handling、form primitives、data-fetch wrapper

## Issues To Resolve Before Simple SNS Implementation

以下は「実装タスク」ではなく、実装前に fixed decision として切るべき issue 群である。既存 closed issue を reopen せず、fresh issue chain として扱うべきである。

### SNS Pre-Implementation Issue Candidates

1. Simple SNS product scope and operating policy judgment
   内容: 投稿可能者、公開範囲、削除方針、moderation floor、non-goals を固定する。
   current derived follow-up: [docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md](docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md)

2. End-user authentication reopening and provider-neutral identity boundary
   内容: Issue 3 の no-auth baseline を historical record として残したまま、SNS 用に auth を再判断する。guest、member、operator の role boundary、signed-out / signed-in member / operator の canonical state name、provider-neutral actor id abstraction を app model 側で固定する。
   current derived follow-up: [docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md](docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md)

3. Message domain model and persistence decision
   内容: Issue 7 の no-persistence baseline を historical record として残したまま、message id、actor reference、body、created_at、status、moderation flags を minimum message record として固定し、retention、soft delete、operator purge、newest-first readback needs を決める。
   current derived follow-up: [docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md](docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md)

4. SNS backend and API baseline
   内容: `POST /api/sns/posts` と `GET /api/sns/timeline` を minimum app-facing surface として固定し、authorization、stable error code、schema evolution、single-cloud first execution boundary を決める。
   current derived follow-up: [docs/portal/issues/issue-130-sns-backend-and-api-baseline.md](docs/portal/issues/issue-130-sns-backend-and-api-baseline.md)

5. SNS security, abuse control, and moderation baseline
   内容: fail-closed validation、basic write throttling、obvious spam blocking、operator hide or soft-delete、security-relevant audit events を fixed judgment にする。
   current derived follow-up: [docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md](docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md)

6. Service stack and secret-management boundary update
   内容: Issue 9 / Issue 10 を踏まえ、static delivery stack と service stack を分離し、secret injection と deploy order を定義する。
   current derived follow-up: [docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md](docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md)

7. Stateful monitoring, rollback, and test baseline
   内容: Issue 12、Issue 13、Issue 14 の static-first baseline を拡張し、auth/API/database を含む failure mode へ更新する。
   current derived follow-up: [docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md](docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md)

8. SNS implementation protection and change-isolation baseline
   内容: unrelated feature が SNS の route、contract、service、shared dependency を壊さないために、module ownership、shared-layer touch rule、critical-path regression gate、explicit exception process を fixed judgment にする。
   current derived follow-up: [docs/portal/issues/issue-134-sns-implementation-protection-and-change-isolation-baseline.md](docs/portal/issues/issue-134-sns-implementation-protection-and-change-isolation-baseline.md)

### SNS Implementation 前に片付けるべき論点

- no-auth baseline をどこまで破るか
- portal と SNS の route / product boundary をどう分けるか
- single-cloud first execution をどの cloud に置くか
- message retention と operator moderation をどのレベルまで first release に含めるか
- stateful rollback を deploy contract にどう組み込むか
- unrelated feature が SNS 実装へ触ってよい境界と、触るなら何を満たすべきか
- shared auth、shared layout、shared client wrapper の変更時に SNS 回帰をどの gate で止めるか

## Azure 対応の実装に向けて整備しておくべき Issue

Azure は 2026-04 以降に actual implementation を始める前提で、3 月中は planning-only とする。コスト増を避けるため、resource apply や live environment start を acceptance criteria に含めない。

### Azure Preparation Issue Candidates

1. Azure cost guardrail and defer-until-April judgment
   内容: なぜ 2026-04 まで actual implementation を止めるか、何をもって再開するか、月額予算の上限と go / no-go gate を固定する。

2. Azure baseline design for portal plus future SNS expansion
   内容: static portal と stateful SNS を将来 Azure 上へ載せる場合の service family 候補を整理する。ただし actual service selection は SNS backend contract 固定後に限定する。

3. Azure IaC topology and state/backends planning
   内容: naming、environment separation、remote state、module boundary を planning-only で決める。

4. Azure deploy workflow and evidence contract planning
   内容: build artifact reuse、environment secrets、approval gates、deployment record shape を planning-only で決める。

5. Azure identity and secret portability boundary
   内容: auth provider abstraction、secret naming、environment variable contract、credential rotation path を Azure 観点でも壊れないように定義する。

6. Azure observability and rollback portability baseline
   内容: dashboard / alert naming、API health、auth failures、data-path rollback を Azure 側でも接続できる形にしておく。

## Azure 対応前に片付けるべき Issue

Azure actual implementation 前に未解決のままだと高確率で手戻りになる blocker は次の通りである。

1. SNS auth contract must be fixed
   理由: Azure identity selection は app-side auth abstraction が固まる前に進めるべきではない。

2. SNS data and API contract must be fixed
   理由: Azure storage / compute mapping は message write/read contract が未固定だと service selection だけが先行する。

3. Service stack separation must be fixed
   理由: static portal と stateful SNS を別 stack で扱う boundary がないまま Azure IaC を始めると、AWS/GCP/Azure すべてで drift しやすい。

4. Shared deployment evidence model must be fixed
   理由: build、deploy、verification、rollback の evidence shape が cloud ごとにばらけると April 以降の review cost が増える。

5. Cost ceiling and environment lifecycle rule must be fixed
   理由: Azure preview を立てたあとに止め方が未定だと、今起きている cost pressure を再生産する。

## Recommended Phase Plan

### Phase 1: 2026-03 中に完了させる planning batch

- create a fresh SNS planning chain without reopening Issue 3 or Issue 7
- fix SNS product scope、auth reopening boundary、message persistence judgment、service stack split、implementation protection baseline
- define Azure defer-until-April judgment and cost guardrail
- define Azure planning-only baseline for IaC、workflow、identity portability

### Phase 2: SNS first implementation batch

- implement SNS on a single-cloud execution boundary first
- keep frontend route and app contracts cloud-neutral
- postpone Azure actual implementation and live resource spend
- complete auth/API/data/monitoring/test/rollback for one cloud before Azure mapping
- current derived execution contract: [docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md](docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md)
- current completion note: the first implementation slice represented by Issue 135 and its execution chain is now staging-reviewed complete via pushed commit `f9892a3a6a2b38a0ec982f37328215308414686f`、`portal-staging-deploy` run `23012584685`、and `portal-sns-staging-review` run `23012658196`; remaining work is no longer first-slice validation but the next fresh stateful backend expansion beyond the browser-local persistence baseline
- current next-step contract: [docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md](docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md)
- current completion note for that next-step contract: the Issue 148 derived execution chain represented by Issue 149 through Issue 151 is now staging-reviewed complete on a Terraform-managed Lambda Function URL plus DynamoDB backend, with `portal-staging-deploy` run `23041594174` and `portal-sns-staging-review` run `23041628020` passing after the OpenTofu-backed cutover

推奨判断:

- first SNS backend は current live primary path に近い single-cloud へ寄せる
- multi-cloud write path や active-active data replication は first SNS batch に含めない

### Phase 3: 2026-04 以降の Azure implementation batch

- start Azure only after Phase 1 decisions are fixed and Phase 2 contracts are stable
- begin with planning-confirmed IaC and workflow scaffolding
- keep live rollout gated by explicit cost and readiness review

## Concrete Next Moves

1. create a fresh SNS planning issue map instead of reopening static-first decisions
2. fix auth reopening and message persistence judgments before touching app code
3. fix SNS implementation protection baseline before unrelated feature expansion starts touching shared layers
4. separate static portal stack and stateful service stack in backlog and IaC planning
5. prepare Azure cost and portability issues in March, but do not start live Azure resources before April
6. treat browser-local persistence as a completed first-slice baseline and start the next SNS execution wave from Issue 148 through Issue 151 instead of reopening Issue 135 through Issue 147
7. track the post-staging SNS production-hardening contract in GitHub Issue 136 before considering any deeper child split
8. track the March Azure planning-only batch in GitHub Issue 137 and keep live Azure execution deferred until the April reopen gate is explicitly passed
9. use GitHub Issue 138 as the first approved child split for the pre-deploy promotion gate in docs/portal/issues/issue-154-sns-production-promotion-execution.md, and keep later production child drafts unpublished until they are separately justified

## Execution Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: plan the next major portal expansion for simple SNS while deferring Azure actual implementation until 2026-04 due to cost pressure
Outcome: Handoff ready
Actions taken: current auth / persistence / multicloud / cloud-status baseline reread | SNS task breakdown defined | SNS pre-implementation issues identified | SNS implementation protection baseline added | Azure preparation issues identified | phased plan fixed
Evidence: docs/portal/05_AUTH_DECISION_DRAFT.md reread | docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md reread | docs/portal/10_MULTICLOUD_CONSTRAINTS_DRAFT.md reread | docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md reread
Risks or blockers: actual provider selection for auth, API, and data store remains intentionally open until the fresh SNS issue chain fixes the contract
Next action: start with the SNS planning chain, and keep Azure in planning-only mode until 2026-04 cost gate is explicitly reopened
```
