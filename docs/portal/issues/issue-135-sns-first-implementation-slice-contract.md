# Summary

Issue 127 から Issue 134 までで、簡易SNSの product scope、auth boundary、message persistence、backend API、security floor、stack split、stateful monitoring/test/rollback、change-isolation baseline は current planning chain として揃った。次に必要なのは、これらの fixed judgment を実装着手可能な最初の executable slice に束ね、どこまで作れば first stateful path が成立したと判断するかを 1 issue で固定することである。

この issue の役割は full SNS backlog を展開することではなく、single-cloud first の narrow slice として guest timeline read、member post、post-readback consistency、fail-closed auth and error handling、basic operational evidence までを first implementation contract として固定することである。

# Goal

簡易SNSの first implementation slice を定義し、single-cloud first の最小 deliverable、workstream split、dependency boundary、completion signal、validation path をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-135
- Title: SNS first implementation slice contract を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-134-sns-implementation-protection-and-change-isolation-baseline.md accepted as the current SNS protection reference

Objective
- Problem to solve: planning chain が揃っても、first executable slice の deliverable、dependency order、validation path、completion signal が未固定のままだと、実装が frontend-first or service-first に拡散し、first stateful path の done judgment が揺れやすい
- Expected value: guest timeline read、member post、post-readback consistency、fail-closed auth/error behavior を single-cloud first で成立させる最初の executable slice を fixed judgment にし、後続 implementation issue が同じ entry condition と exit condition を参照できる
- Terminal condition: first slice deliverable、workstream split、dependency order、completion signal、validation path、non-goals が fixed judgment として読め、implementation issues を execution-ready に起こせる

Scope
- In scope: first executable SNS slice deliverable、frontend/service boundary、minimum data path、validation and evidence path、staging-oriented completion signal、first slice non-goals
- Out of scope: full moderation workflow、operator console completion、advanced query/search、media upload、multi-cloud write path、production automation depth、vendor-specific final selection record
- Editable paths: docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: first implementation slice の minimum deliverable が app behavior 単位で明文化されている
- [x] AC-2: frontend、service、config、validation の workstream split と dependency order が読み取れる
- [x] AC-3: completion signal と fail conditions が staging-oriented evidence path と結び付いている
- [x] AC-4: first slice に含めない follow-on work が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 127 から Issue 134 の fixed judgment を実装順へ落とし込み、API contract、service stack split、stateful critical path、change-isolation gate を継承した narrow first slice contract として整理する
- Alternative rejected and why: frontend issue、backend issue、monitoring issue を先に別々に起こす案は、最初の done line が曖昧なまま parallel decomposition されやすく、first stateful path の成立条件を揃えにくいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、first slice deliverable、dependency order、completion signal、validation path、non-goals が issue 単位で読める
- Failure triage path: issue-130 API baseline、issue-132 stack split、issue-133 stateful ops baseline、issue-134 protection baseline を照合し、deliverable、order、signal、non-goals のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: slice が広すぎて initial implementation が hardening work を抱え込むか、逆に narrow すぎて real stateful path を成立させないまま done 扱いになること
- Impact area: execution order, service readiness, frontend integration, validation path, release judgment
- Mitigation: first slice は guest timeline read、member post、post-readback consistency、fail-closed auth/error、basic evidence path に限定し、moderation UI、search、notifications、deep ops automation は non-goal に残す
- Rollback: scope が広がりすぎた場合は read path、write path、post-readback consistency、fail-closed behavior、validation evidence の 5 点だけを残し、follow-on features は separate issue へ分離する
```

# Tasks

- [x] first slice deliverable を fixed judgment にする
- [x] workstream split and dependency order を fixed judgment にする
- [x] completion signal と fail condition を fixed judgment にする
- [x] validation and evidence path を fixed judgment にする
- [x] first slice non-goals を明文化する

# Definition of Done

- [x] guest timeline read と member post-readback の minimum path が読める
- [x] frontend、service、config、validation の dependency order が読める
- [x] fail-closed auth/error behavior が completion signal に含まれている
- [x] staging-oriented evidence path が downstream execution issue で参照できる
- [x] moderation UI、deep ops automation、multi-cloud write が first slice から外れている

# Slice Intent

- establish the first real stateful SNS path, not a full SNS product completion
- keep the slice narrow enough that one execution wave can complete and verify it
- make the slice inherit existing contract validators and browser flow evidence rather than inventing a new validation family first

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. first slice の app behavior completion line をどこに置くか
2. frontend と service のどちらを先に安定化させるか
3. staging-oriented validation をどこまで first slice 完了条件に含めるか
4. fail-closed auth/error をどう first slice 完了条件へ入れるか
5. first slice に含めない follow-on work をどこまで明示するか

# Provisional Direction

- first slice の completion line は guest timeline read、member valid post、invalid payload reject、guest write reject、post-readback consistency に置く
- service contract and service stack を先に安定化し、その後 frontend が stable API surface に接続する順を優先する
- existing request/response contract、auth-error contract、surface reachability、auth-post-readback suites を first slice validation baseline とする
- first slice は one cloud execution path only とし、frontend contract names は cloud-neutral に維持する
- moderation console、operator workflow depth、search、notifications、media upload は follow-on に残す

# Fixed Judgment

## First Slice Rationale

- Issue 127 から Issue 134 までの fixed judgment は揃ったが、そのままでは first executable slice の done line が曖昧なため、この issue で single-cloud first の first stateful path を executable contract に束ねる
- この issue は full SNS backlog を展開するものではなく、guest timeline read、member post、post-readback consistency、fail-closed auth/error、staging-oriented evidence までを first slice として固定する narrow planning boundary として扱う
- implementation issue はこの issue の entry/exit condition を継承し、slice done を各 sub-issue が再定義しない

## Deliverable Resolution

- first implementation slice の canonical deliverable は guest can read timeline through the real service-backed read path、guest cannot post and gets the expected fail-closed auth outcome、member can submit a valid post through the real service-backed write path、invalid payload is rejected through the stable error contract、successful post appears through the intended readback path without local-only fake state dependence の 5 点に固定する
- first slice は real stateful path を成立させることが目的であり、local-only fake state や demo-only fallback を critical path completion に含めない

## Workstream Split And Dependency Resolution

- workstream split は service and data path、frontend integration path、config and secret path、validation and evidence path の 4 系列に固定する
- canonical dependency order は 1) stable service contract and service config path 2) minimum persistence-backed read and write path 3) frontend integration onto the stable contract 4) validation and staging-oriented evidence update 5) follow-on hardening の順とする
- first slice は one-cloud execution path only を前提にし、frontend contract names は cloud-neutral のまま維持する

## Completion Signal And Fail Condition Resolution

- completion signal は `GET /api/sns/timeline` と `POST /api/sns/posts` が intended service boundary で reachable、guest read succeeds、guest write is rejected by the service contract、member valid write succeeds、invalid payload reject is stable、post-readback consistency is observed、critical path に no local-only fallback remains の全充足とする
- fail condition は timeline read が local-only fake state に依存する、member valid post が readback できない、guest write が frontend UI blocking のみで service contract reject されない、invalid payload handling に stable fail-closed error がない、frontend deployment が unready or secret-leaking service boundary を向く、のいずれかが残る場合とする

## Validation And Evidence Resolution

- first slice validation baseline は request/response contract validation、auth-error contract validation、SNS surface reachability、auth-post-readback flow を mandatory gate とする
- evidence path は informal local observation ではなく staging-oriented execution evidence を正規経路とし、service path、frontend path、validation result を同じ slice completion record で追えるようにする
- implementation-specific check は baseline を拡張してよいが、この mandatory gate を置き換えない

## First Slice Non-Goals Resolution

- moderation dashboard or operator console completion
- operator hide/delete UI
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- deep monitoring automation, paging integration, automatic rollback orchestration
- multi-cloud write path or Azure live execution

# First Slice Candidate

## Deliverable Boundary

first implementation slice は次の app behavior を deliverable とする。

- guest can read the SNS timeline through the real service-backed read path
- guest cannot post and receives the expected fail-closed auth outcome
- member can submit a valid post through the real service-backed write path
- invalid payload is rejected through the stable error contract
- successful post appears again through the intended readback path without local-only fake state dependence

## Workstream Split

### 1. Service And Data Path

- implement the minimum service path required for GET /api/sns/timeline and POST /api/sns/posts
- persist the minimum message model defined by the current planning chain
- keep execution on one cloud path only
- preserve fail-closed error behavior rather than silent fallback to local demo state

### 2. Frontend Integration Path

- switch SNS surface from local-only demo dependence to the stable app-facing contract
- preserve guest/member/operator boundary already fixed in the planning chain
- keep the visible SNS route and posting/timeline surface narrow to the first slice behavior only
- do not expand into moderation UI or richer social interactions in this slice

### 3. Config And Secret Path

- keep public config in the frontend bundle limited to safe app contract values
- inject service-side secret-backed config through the service path only
- ensure frontend rollout does not point to an unready service boundary

### 4. Validation And Evidence Path

- preserve the existing contract validation commands as baseline gates
- preserve or extend the existing browser flow evidence so the real service path can be checked with guest read and member post-readback behavior
- record the first slice completion with staging-oriented execution evidence rather than informal local observation only

## Dependency Order Candidate

1. stable service contract and service config path
2. minimum persistence-backed read and write path
3. frontend integration onto the stable contract
4. validation and staging-oriented evidence update
5. follow-on hardening only after the first slice is stable

## Completion Signal Candidate

first slice is complete when the following all hold.

- GET /api/sns/timeline and POST /api/sns/posts are reachable through the intended service boundary
- guest read succeeds and guest write is rejected with the stable auth/error contract
- member valid write succeeds and readback shows the intended record
- invalid payload is rejected without silent success
- contract validation and critical browser flow evidence pass on the slice path
- no local-only fallback remains on the critical stateful path being declared complete

## Fail Conditions Candidate

the slice is not complete if any of the following remain true.

- timeline read still depends on local-only fake state on the declared critical path
- valid member post cannot be read back through the intended read model
- guest write is blocked only by frontend UI and not by the service contract
- invalid payload handling lacks a stable fail-closed error surface
- frontend deployment can point at an unready or secret-leaking service boundary

## Validation Baseline Candidate

- request/response contract validation remains mandatory
- auth-error contract validation remains mandatory
- SNS surface reachability remains mandatory
- auth-post-readback flow remains mandatory
- added implementation-specific checks may extend these baselines, but should not replace them in the first slice

## Follow-On Non-Goals Candidate

- moderation dashboard or operator console completion
- operator hide/delete UI
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- deep monitoring automation, paging integration, automatic rollback orchestration
- multi-cloud write path or Azure live execution

# Downstream Use

- execution-ready implementation issues should inherit this issue as the first slice contract
- backend, frontend, and validation sub-issues should derive their completion signal from this issue rather than redefining slice done independently
- later hardening and feature expansion should use this issue to decide whether work belongs in follow-on scope

# Process Review Notes

- Issue 127 から Issue 134 の fixed judgment を first executable slice の deliverable、dependency order、completion signal に束ね、planning chain の締めとして読める状態に整えた
- issue-130 の API baseline、issue-132 の stack split、issue-133 の stateful ops baseline、issue-134 の protection baseline と整合するよう、guest read、member post、post-readback consistency、fail-closed auth/error を first slice done line に固定した
- current SNS planning chain では full backlog 展開より first stateful path の成立条件を優先し、execution issue が同じ completion signal を参照できる状態に整えた

# Derived Execution Follow-Ups

- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-137-sns-frontend-integration-execution.md
- docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md

# Current Draft Focus

- turn the planning chain into one executable first slice contract with fixed judgment
- keep the slice stateful and real, but still narrow enough for one execution wave
- preserve existing validator and browser-suite value as the initial evidence path

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed planning record

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md
- docs/portal/issues/issue-134-sns-implementation-protection-and-change-isolation-baseline.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- apps/portal-web/src/snsRequestResponseContract.ts
- apps/portal-web/src/snsAuthErrorContract.ts
