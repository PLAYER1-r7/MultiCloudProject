# Summary

Issue 135 から Issue 147 までで、簡易SNS の first implementation slice は browser-local persistence を含む service-style path と staging-reviewed completion まで到達した。次に必要なのは、この first slice を historical completion record として残したまま、local browser storage 依存を越えて real service-backed persistence、stateful deploy boundary、post-deploy rollback judgment を含む fresh execution contract を切り出すことである。

この issue の役割は full SNS product を展開することではなく、single-cloud first の次段として service-managed persistence と deployable stateful boundary を narrow に固定し、後続 implementation issue が同じ done line を参照できるようにすることである。

# Goal

簡易SNS の post-first-slice expansion として、real service persistence を導入する narrow execution contract を定義し、deliverable、workstream split、dependency order、completion signal、validation and rollback path をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-148
- Title: SNS service persistence expansion contract を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-147-sns-staging-evidence-and-completion-review-execution.md accepted as the current first-slice completion reference

Objective
- Problem to solve: first slice は staging-reviewed complete だが、timeline read と post-readback が browser-local persistence に依存しており、stateful service-managed persistence、deploy rollback、post-deploy recovery judgment を含む次段 contract が未固定のままだと implementation が ad hoc に広がりやすい
- Expected value: browser-local persistence を historical baseline として残しつつ、real service-backed persistence、service-owned readback、stateful deploy boundary、rollback-aware validation を single-cloud first で成立させる narrow next slice を fixed judgment にし、後続 implementation issue が同じ entry condition と exit condition を参照できる
- Terminal condition: next-slice deliverable、workstream split、dependency order、completion signal、rollback-aware evidence path、non-goals が fixed judgment として読め、implementation issues を execution-ready に起こせる

Scope
- In scope: service-managed persistence boundary、remote or service-owned readback path、frontend cutover from browser-local critical path、stateful deploy and rollback-aware validation path、next-slice non-goals
- Out of scope: moderation console completion、search、replies、reactions、multi-cloud write path、Azure live execution、deep incident automation、vendor-final-selection record
- Editable paths: docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: browser-local baseline の次に進む minimum deliverable が app behavior 単位で明文化されている
- [x] AC-2: service persistence、frontend cutover、stateful evidence/rollback の workstream split と dependency order が読み取れる
- [x] AC-3: completion signal と fail conditions が stateful deploy and rollback-aware evidence path と結び付いている
- [x] AC-4: first slice と区別される non-goals が切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: issue-129 persistence boundary、issue-130 backend/API baseline、issue-132 stack split、issue-133 stateful ops baseline、issue-147 completion review を継承し、browser-local persistence を critical path から外す narrow next-slice contract として整理する
- Alternative rejected and why: first slice issue chain を reopen する案は historical completion line を曖昧にし、browser-local baseline と real service persistence baseline を混線させるため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、deliverable、dependency order、completion signal、rollback-aware evidence path、non-goals が issue 単位で読める
- Failure triage path: issue-129、issue-130、issue-132、issue-133、issue-147 を照合し、deliverable、order、signal、rollback path のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: scope が広がりすぎて full backend program になってしまうか、逆に narrow すぎて browser-local persistence の置き換えと rollback judgment を含まないまま done 扱いになること
- Impact area: service readiness, data integrity, deploy sequencing, frontend cutover, rollback judgment
- Mitigation: next slice は service-owned persistence、service-owned readback、frontend cutover、stateful validation、rollback-aware evidence に限定し、moderation depth や multi-cloud write は non-goal に残す
- Rollback: slice が広がりすぎた場合は service persistence、service readback、frontend cutover、stateful evidence の 4 点だけを残し、deeper ops automation や richer product behavior は separate issue へ分離する
```

# Tasks

- [x] next-slice deliverable を fixed judgment にする
- [x] workstream split and dependency order を fixed judgment にする
- [x] completion signal と fail condition を fixed judgment にする
- [x] rollback-aware validation and evidence path を fixed judgment にする
- [x] next-slice non-goals を明文化する

# Definition of Done

- [x] service-owned timeline read と member post-readback の minimum path が読める
- [x] browser-local persistence を critical path から外す cutover boundary が読める
- [x] stateful deploy and rollback-aware evidence path が downstream issue で参照できる
- [x] first slice completion record と next-slice expansion boundary が混線せず読める
- [x] moderation UI、search、multi-cloud write、Azure live execution が next slice から外れている

# Fixed Judgment

## Next Slice Rationale

- Issue 135 から Issue 147 までの first slice は historical completion record として保持しつつ、browser-local persistence を source of truth にしたままでは次段の stateful boundary を定義できないため、この issue で service persistence expansion の next-slice contract を固定する
- この issue は full SNS backend program を展開するものではなく、service-owned persistence、frontend cutover、stateful staging review、rollback-aware evidence を one-cloud first の narrow next slice として束ねる planning boundary である
- downstream の Issue 149、Issue 150、Issue 151 はこの issue の next-slice completion signal を継承し、done line を再定義しない

## Deliverable Resolution

- next slice の canonical deliverable は guest can read timeline through service-owned persistence-backed path、guest write stays fail closed、member valid post is persisted outside browser-local storage、successful post is visible again after reload or fresh-session review through the service-owned readback path、rollback-aware validation can distinguish service persistence failure from frontend-only success state の 5 点に固定する
- browser-local persistence は historical baseline として残すが、declared next-slice critical path の source of truth には含めない

## Workstream And Dependency Resolution

- workstream split は service persistence path、frontend cutover path、stateful validation and rollback path の 3 系列に固定する
- canonical dependency order は 1) stable service persistence boundary and deploy-safe config path 2) minimum persistence-backed read and write path 3) frontend cutover away from browser-local critical-path dependence 4) stateful validation and rollback-aware staging evidence update 5) follow-on hardening の順とする
- next slice は one-cloud execution path only を前提にし、frontend contract names は cloud-neutral のまま維持する

## Completion And Fail Condition Resolution

- completion signal は GET と POST が service-owned persistence に支えられ、guest read succeeds、guest write is rejected with the stable auth/error contract、member valid write succeeds and readback survives reload or fresh-session review、browser-local persistence is no longer the source of truth on the critical path、stateful validation and rollback-aware staging evidence pass の全充足とする
- fail condition は timeline read or post-readback が still browser-local persistence に依存する、valid member post appears successful only before reload、rollback or staging review cannot distinguish service persistence failure from frontend-only success state、frontend deployment points at an unready or secret-leaking service boundary、のいずれかが残る場合とする

## Rollback-Aware Evidence Resolution

- validation baseline は request/response contract、auth-error contract、surface reachability、auth-post-readback を継続 mandatory gate としつつ、service-owned persistence and reload-safe readback を追加で証明する形に固定する
- evidence path は local observation ではなく rollback-aware staging review を正規 completion path とし、repeated write failure、timeline read failure、data compatibility break、service misconfiguration を rollback trigger candidate として扱える状態を前提にする
- first slice と next slice の completion record は分離し、historical browser-local baseline を next-slice success の根拠に使わない

## Next Slice Non-Goals Resolution

- moderation dashboard or operator console completion
- operator hide/delete UI
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- multi-cloud write path or Azure live execution
- deep monitoring automation and automatic rollback orchestration

# Slice Intent

- preserve the first slice as a completed historical baseline
- replace browser-local persistence on the declared critical path with service-owned persistence and readback
- keep the next slice narrow enough that one execution wave can still complete and review it

# Provisional Direction

- next slice の completion line は service-owned timeline read、member valid post persisted through the service boundary、post-readback consistency without browser-local critical-path dependence、rollback-aware staging evidence に置く
- service persistence boundary and deploy-safe config path を先に安定化し、その後 frontend が browser-local critical path から cutover する順を優先する
- existing contract validators and browser suites は継承しつつ、service-owned persistence と rollback-aware review に必要な evidence を追加する
- next slice は one cloud execution path only とし、frontend contract names は cloud-neutral に維持する
- moderation console、search、notifications、replies、reactions、media upload は follow-on に残す

# Next Slice Candidate

## Deliverable Boundary

next implementation slice は次の app behavior を deliverable とする。

- guest can read the SNS timeline through a service-owned persistence-backed read path
- guest cannot post and continues to receive the stable fail-closed auth outcome
- member can submit a valid post through the intended service boundary and the resulting record is persisted outside browser-local storage
- successful post appears again through the intended service-owned readback path after reload or fresh session review
- rollback-aware validation can distinguish service persistence failure from frontend-only success state

## Workstream Split

### 1. Service Persistence Path

- implement the minimum service-managed persistence path required for GET /api/sns/timeline and POST /api/sns/posts
- keep browser-local storage out of the declared critical path for persisted timeline readback
- preserve fail-closed error behavior rather than silently falling back to fake state on the declared next slice

### 2. Frontend Cutover Path

- cut the SNS surface over from browser-local critical-path persistence to the stable service-backed path
- preserve guest/member boundary and visible completion/error markers from the first slice
- keep fallback policy visible when service persistence is unavailable

### 3. Stateful Validation And Rollback Path

- extend the current evidence path so staging review can prove service-owned persistence and reload-safe readback
- define rollback-aware review for repeated write failure、timeline read failure、or incompatible data-path change
- keep completion judgment tied to reviewable output rather than local observation

## Dependency Order Candidate

1. stable service persistence boundary and deploy-safe config path
2. minimum persistence-backed read and write path owned by the service boundary
3. frontend cutover away from browser-local critical-path dependence
4. stateful validation and rollback-aware staging evidence update
5. follow-on hardening only after the next slice is stable

## Completion Signal Candidate

next slice is complete when the following all hold.

- GET /api/sns/timeline and POST /api/sns/posts are backed by service-owned persistence on the declared critical path
- guest read succeeds and guest write is rejected with the stable auth/error contract
- member valid write succeeds and readback shows the intended persisted record after reload or fresh review path
- browser-local persistence is no longer the source of truth for the declared critical path
- stateful validation and rollback-aware staging evidence pass on the slice path

## Fail Conditions Candidate

the slice is not complete if any of the following remain true.

- timeline read or post-readback still depends on browser-local storage on the declared critical path
- valid member post appears successful only before reload or only within the same browser-local session
- rollback or staging review cannot distinguish service persistence failure from frontend-only success state
- frontend deployment can point at an unready or secret-leaking service boundary

## Validation Baseline Candidate

- request/response contract validation remains mandatory
- auth-error contract validation remains mandatory
- SNS surface reachability remains mandatory
- auth-post-readback flow remains mandatory
- added next-slice checks should prove service-owned persistence and reload-safe readback rather than replace the existing baseline suites

## Follow-On Non-Goals Candidate

- moderation dashboard or operator console completion
- operator hide/delete UI
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- multi-cloud write path or Azure live execution
- deep monitoring automation and automatic rollback orchestration

# Downstream Use

- execution-ready implementation issues should inherit this issue as the next-slice contract
- service persistence、frontend cutover、stateful evidence sub-issues should derive their completion signal from this issue rather than redefining done independently
- later feature expansion should use this issue to decide whether work belongs in next-slice scope or follow-on scope

# Process Review Notes

- first slice historical completion line を reopen せずに、browser-local baseline の次段として service-owned persistence と rollback-aware evidence を持つ next slice を fresh contract として固定した
- issue-129 の persistence judgment、issue-130 の API baseline、issue-132 の stack split、issue-133 の stateful ops baseline、issue-147 の completion review を再解釈せずに継承し、next-slice done line を narrow に束ねた
- current local execution record では derived Issue 149、Issue 150、Issue 151 がこの contract を実行済みであるため、parent contract も completed derived chain と整合する fixed judgment record に揃えた

# Derived Execution Follow-Ups

- docs/portal/issues/issue-149-sns-service-persistence-path-execution.md
- docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md
- docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md

# Current Status

- planning contract accepted as the next-slice reference and executed through derived Issue 149、Issue 150、and Issue 151
- derived execution chain is now complete on a Terraform-managed staging backend consisting of Lambda Function URL plus DynamoDB timeline persistence
- reviewed staging evidence passed through `portal-staging-deploy` run `23041594174` and `portal-sns-staging-review` run `23041628020` after the OpenTofu-backed cutover
- GitHub Issue: not created in this task
- Sync Status: local fixed judgment record updated to reflect completed derived execution status

# Dependencies

- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md
- docs/portal/issues/issue-147-sns-staging-evidence-and-completion-review-execution.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
