# Summary

Issue 127 で product scope、Issue 128 で auth boundary、Issue 129 で message domain model と persistence boundary の起点は作れた。次に必要なのは、これらを backend and API baseline として束ね、何を app-facing API として公開し、どこで authorization を効かせ、schema evolution をどの前提で扱い、single-cloud first execution boundary をどこに置くかを fixed judgment にすることである。

この issue の役割は compute service や database product を選ぶことではなく、SNS の first implementation slice が依存すべき API surface と authorization rule を決めることである。既存の local contract validator が想定している /api/sns/posts と /api/sns/timeline は、この baseline issue の input として扱う。

# Goal

簡易SNS向けに backend and API baseline を定義し、write API、read API、authorization boundary、schema evolution rule、single-cloud first execution boundary をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-130
- Title: SNS backend and API baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-129-sns-message-domain-model-and-persistence-decision.md accepted as the current SNS persistence boundary reference

Objective
- Problem to solve: product、auth、message persistence の判断があっても、write API、read API、authorization、schema evolution、single-cloud first execution boundary が未固定のままだと actual implementation slice を安全に開始できない
- Expected value: first implementation slice が依存すべき app-facing API surface と authorization rule を fixed judgment にし、service stack split、frontend slice、monitoring and rollback baseline issue が同じ backend contract を前提に進める
- Terminal condition: write API、read API、authorization boundary、schema evolution rule、single-cloud first execution boundary が fixed judgment として読め、service or storage product selection issue を reopen せずに implementation slice contract が開始できる

Scope
- In scope: app-facing write and read API surface、authorization boundary、error surface baseline、schema evolution rule、single-cloud first execution boundary、backend API non-goals for first release
- Out of scope: service product selection、database product selection、IaC implementation、OpenAPI generation、queue/event architecture、cross-cloud active-active write routing
- Editable paths: docs/portal/issues/issue-130-sns-backend-and-api-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: first release write API と read API の app-facing surface が明文化されている
- [x] AC-2: guest、member、operator の authorization boundary が API 単位で読み取れる
- [x] AC-3: schema evolution と error surface の最小 rule が明文化されている
- [x] AC-4: single-cloud first execution boundary と non-goals が切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-130-sns-backend-and-api-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: issue-128 と issue-129 の boundary を束ね、apps/portal-web の contract validator が already expecting している request/response shape を参照しながら、first release backend contract を fresh baseline issue として固定する
- Alternative rejected and why: compute or storage product selection を同じ issue で進める案は、API and authorization contract より先に infra choice が固定され、later portability judgment と implementation order を縛りやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、API surface、authorization、schema evolution、execution boundary、non-goals が issue 単位で読める
- Failure triage path: issue-128 auth boundary、issue-129 persistence boundary、apps/portal-web/src/snsRequestResponseContract.ts、apps/portal-web/src/snsAuthErrorContract.ts を照合し、API surface、authorization、error rule、execution boundary のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: API baseline が narrow すぎて implementation issue が再解釈を始めるか、逆に broad すぎて moderation API や cross-cloud routing まで抱え込むこと
- Impact area: API contract, frontend integration, service selection, rollout sequencing, later cloud mapping
- Mitigation: first release では create post と timeline read を中心にし、moderation write、advanced query、notification side effect、multi-cloud write routing は non-goal に残す
- Rollback: API scope が広がりすぎた場合は create post、timeline read、authorization boundary、error surface、single-cloud first execution boundary の 5 点だけを残し、schema registry や advanced moderation API は separate issue へ分離する
```

# Tasks

- [x] write API baseline を fixed judgment にする
- [x] read API baseline を fixed judgment にする
- [x] authorization boundary を fixed judgment にする
- [x] schema evolution and error surface rule を fixed judgment にする
- [x] single-cloud first execution boundary を fixed judgment にする

# Definition of Done

- [x] first release write and read API surface が downstream issue で参照できる
- [x] guest、member、operator の authorization boundary が API 単位で読める
- [x] schema evolution と error surface の最小 rule が読める
- [x] single-cloud first execution boundary が first implementation slice の前提として読める
- [x] service product choice と implementation work が本 issue の out-of-scope として切り分けられている

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. first release で必要な write API は何か
2. first release で必要な read API は何か
3. API 単位で guest、member、operator をどう許可分離するか
4. request/response schema drift をどう fail-closed に扱うか
5. first implementation をどの single-cloud boundary に置くか

# Provisional Direction

- write API は create post を first release minimum にする
- read API は public timeline read を first release minimum にする
- guest は read-only、member は create post 可、operator の moderation-sensitive write は first release baseline では optional follow-up とする
- invalid payload と write failure は app-facing error surface として fail-closed に扱う
- first implementation slice は single-cloud first とし、cross-cloud multi-write or active-active routing は non-goal にする

# Fixed Judgment

## Backend Baseline Rationale

- issue-127、issue-128、issue-129 で fixed judgment 化した product、auth、persistence boundary は、app-facing backend/API contract を持たないままでは implementation slice に落とせないため、この issue で single contract baseline に束ねる
- この issue は compute service や storage product を選ぶためのものではなく、frontend、service stack、monitoring/test が共有する app-facing API surface と authorization rule を固定するための narrow planning boundary として扱う
- apps/portal-web の existing contract validator が already expecting している `/api/sns/posts`、`/api/sns/timeline`、auth error surface は baseline input として尊重し、conflicting vocabulary を新設しない

## Write API Resolution

- first release write API の canonical minimum surface は `POST /api/sns/posts` に固定する
- request minimum field は `authorId` と `message` を required、`replyToPostId` を optional とし、message maximum length は 280 を baseline にする
- create post は authenticated write path として扱い、silent success や implicit fallback を許容しない
- moderation-specific write API は first release minimum surface に含めず、later follow-up issue が必要性を明示した場合に追加する

## Read API Resolution

- first release read API の canonical minimum surface は `GET /api/sns/timeline` に固定する
- read response は top-level collection field `items` を返し、minimum item field は `id`、`authorId`、`message`、`createdAt` に固定する
- timeline ordering は `createdAt-desc` の newest-first を canonical rule とし、public timeline readback はこの ordering を崩さない
- first release baseline では advanced query、search、personalized feed、private audience segmentation を read API surface に含めない

## Authorization Boundary Resolution

- downstream auth state vocabulary は issue-128 に揃えて `signed-out`、`signed-in member`、`operator` を canonical state とする
- guest は `GET /api/sns/timeline` のみ許可し、`POST /api/sns/posts` は 403 fail-closed rejection を返す
- member は `GET /api/sns/timeline` と `POST /api/sns/posts` を許可する
- operator は member action を含むが、moderation-sensitive write API は later follow-up が追加するまで first release baseline に含めない

## Error Surface And Schema Evolution Resolution

- invalid payload rejection は stable app-facing error として `INVALID_POST_PAYLOAD` を維持し、missing `authorId`、empty `message`、message-too-long を minimum rejected case にする
- guest blocked post は `SNS_POST_FORBIDDEN`、write failure は `SNS_POST_WRITE_FAILED`、fail-closed auth family は `SNS_AUTH_CONTEXT_MISSING`、`SNS_ACTOR_MISMATCH`、`SNS_WRITE_DISABLED` を stable error code として扱う
- app-facing write failure surface は `errorCode`、`message`、`retryable` を minimum visible field とし、fail-closed completion visibility は `errorCode`、`retryable`、`readbackState`、`completionSignal`、`fallbackPolicy` を含める
- request/response shape は additive change または explicit versioning によってのみ拡張し、silent field repurposing や implicit contract drift を許容しない
- provider-neutral actor id naming は issue-128 の contract に揃えて安定維持し、actor id format and uniqueness guarantee は issue-129 の persistence boundary に委ねる

## Execution Boundary Resolution

- first implementation slice は one-cloud execution path only を canonical rule とする
- frontend route naming、API path naming、auth vocabulary、message contract naming は cloud-neutral のまま維持し、single-cloud first execution でも provider brand を app-facing contract に露出しない
- cross-cloud replicated writes、active-active read/write routing、queue or event fan-out architecture は first release backend/API baseline の non-goal に残す

## First Release Backend API Non-Goals Resolution

- compute or storage product selection
- OpenAPI generation or schema registry tooling
- moderation-specific write API in the minimum surface
- queue/event architecture
- notification side effects
- cross-cloud active-active write routing
- advanced query, search, recommendation, or personalized feed API

# Initial Boundary Candidates

## API Surface Candidate

- POST /api/sns/posts
- GET /api/sns/timeline
- moderation-specific write API is not part of the minimum first release baseline unless a later issue proves it necessary

## Authorization Candidate

- downstream auth state vocabulary should stay aligned to issue-128: signed-out, signed-in member, and operator
- guest: GET timeline only
- member: GET timeline plus POST create
- operator: member actions plus moderation-sensitive action only if a later follow-up explicitly adds that API surface

## Error Surface Candidate

- invalid payload should return a stable client-visible error code for fail-closed handling
- write failure should return a stable client-visible error code for fail-closed handling
- silent failure and implicit success are out of bounds

## Schema Evolution Candidate

- request and response shape should evolve by additive or explicitly versioned change, not by silent field repurposing
- app-facing contract names should remain stable across the first implementation slice
- provider-neutral actor id naming should remain stable across the first implementation slice, while actor id format and uniqueness guarantee stay deferred to the persistence boundary
- frontend contract validator and backend implementation should fail review if they drift without an explicit linked issue

## Execution Boundary Candidate

- first implementation slice should run on one cloud path only
- frontend and app contract naming should remain cloud-neutral even when execution is single-cloud first
- cross-cloud replicated writes and active-active read/write behavior are first release non-goals

# Existing Contract Inputs

- current request-response contract baseline already expects POST /api/sns/posts and GET /api/sns/timeline as the minimum app-facing surface
- current auth-error contract baseline already expects guest blocked post, member allowed post, and write-failure visibility
- this issue should align the planning contract to those surfaces rather than inventing a conflicting API vocabulary

# Downstream Use

- service stack and secret-management boundary update should inherit the single-cloud first execution boundary from this issue
- frontend slice issue should inherit the API names, authorization model, and error surface from this issue
- monitoring, rollback, and test baseline issue should inherit the fail-closed error surface and API critical path from this issue

# Process Review Notes

- issue-128 の auth vocabulary と issue-129 の persistence vocabulary を backend/API contract へ束ね、apps/portal-web の contract validator が already expecting する minimum surface と整合させた
- downstream issue が service product choice より先に drift した API vocabulary を持ち込まないよう、endpoint、request field、response field、error code、authorization matrix を canonical baseline として明示した
- first release では create post と public timeline read の narrow surface を維持し、moderation-specific write と cross-cloud routing は non-goal に残した

# Current Draft Focus

- product、auth、persistence で決めた boundary を backend and API baseline の fixed judgment に束ねた
- service choice より先に app-facing contract を固定した
- first release を create post plus public timeline read の narrow API scope に抑えた

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed planning record

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- apps/portal-web/src/snsRequestResponseContract.ts
- apps/portal-web/src/snsAuthErrorContract.ts
