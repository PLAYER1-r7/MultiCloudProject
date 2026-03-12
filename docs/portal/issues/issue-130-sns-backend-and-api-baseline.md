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
- [ ] AC-1: first release write API と read API の app-facing surface が明文化されている
- [ ] AC-2: guest、member、operator の authorization boundary が API 単位で読み取れる
- [ ] AC-3: schema evolution と error surface の最小 rule が明文化されている
- [ ] AC-4: single-cloud first execution boundary と non-goals が切り分けられている

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

- [ ] write API baseline を fixed judgment にする
- [ ] read API baseline を fixed judgment にする
- [ ] authorization boundary を fixed judgment にする
- [ ] schema evolution and error surface rule を fixed judgment にする
- [ ] single-cloud first execution boundary を fixed judgment にする

# Definition of Done

- [ ] first release write and read API surface が downstream issue で参照できる
- [ ] guest、member、operator の authorization boundary が API 単位で読める
- [ ] schema evolution と error surface の最小 rule が読める
- [ ] single-cloud first execution boundary が first implementation slice の前提として読める
- [ ] service product choice と implementation work が本 issue の out-of-scope として切り分けられている

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

# Initial Boundary Candidates

## API Surface Candidate

- POST /api/sns/posts
- GET /api/sns/timeline
- moderation-specific write API is not part of the minimum first release baseline unless a later issue proves it necessary

## Authorization Candidate

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

# Current Draft Focus

- product、auth、persistence で決めた boundary を backend and API baseline に束ねる
- service choice より先に app-facing contract を固定する
- first release を create post plus public timeline read の narrow API scope に抑える

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- apps/portal-web/src/snsRequestResponseContract.ts
- apps/portal-web/src/snsAuthErrorContract.ts
