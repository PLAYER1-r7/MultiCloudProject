# Summary

Issue 136 で service/data path execution の外枠は fixed できた。最初に着手すべき最小 backend unit は、GET /api/sns/timeline と POST /api/sns/posts の handler surface を安定させ、app-facing contract と fail-closed response shape を local-only fallback なしで返せる service route and handler execution である。

この issue の役割は persistence strategy 全体や secret store 実装を抱えることではなく、first slice の route entrypoint と handler behavior を narrow に固定することである。

# Goal

SNS first implementation slice 向けに、service route and handler execution を定義し、minimum route surface、handler responsibility、response/error shape、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-139
- Title: SNS service route and handler execution を整理する
- Requester: repository owner
- Target App: future SNS service layer
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-136-sns-service-and-data-path-execution.md accepted as the current service/data parent execution record

Objective
- Problem to solve: GET /api/sns/timeline と POST /api/sns/posts の route entrypoint、handler responsibility、response/error shape が execution-ready 単位に切れていないため、service path 実装が transport、domain、persistence を一度に抱え込みやすい
- Expected value: first slice の route surface と handler contract を先に固定し、persistence issue と auth/error/config issue が安定した entrypoint に依存できる
- Terminal condition: route scope、handler responsibility、response/error shape、completion signal、non-goals が fixed judgment として読め、route/handler code change を開始できる

Scope
- In scope: GET /api/sns/timeline route、POST /api/sns/posts route、handler responsibility split、response shape baseline、stable fail-closed error return、route-level non-goals
- Out of scope: deep persistence implementation、secret store implementation、moderation API、advanced query/filtering、frontend integration、validation suite update
- Editable paths: docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
- Restricted paths: docs/portal/issues/issue-130-sns-backend-and-api-baseline.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: GET /api/sns/timeline と POST /api/sns/posts の route scope が app-facing behavior 単位で明文化されている
- [ ] AC-2: handler responsibility と response/error shape が読み取れる
- [ ] AC-3: fail-closed route behavior と completion signal が読み取れる
- [ ] AC-4: persistence detail や follow-on API が non-goals として切り分けられている
```

# Execution Unit

## Route Scope

- expose GET /api/sns/timeline as the first public read route
- expose POST /api/sns/posts as the first authenticated write route for the canonical signed-in member state defined in issue-128
- keep moderation-specific routes out of the first route surface

## Handler Responsibility

- parse and validate request into the stable contract boundary
- keep provider-neutral actor id naming stable at the handler contract boundary, while actor id format and uniqueness guarantee remain deferred to the persistence boundary
- call the intended domain/persistence path rather than local fake state
- return stable success or fail-closed error outcomes without silent fallback

## Completion Signal Candidate

- both routes are reachable on the intended service boundary
- route handlers return the intended baseline response or stable error surface
- no route success is simulated by local-only fallback on the declared slice path

## Non-Goals

- moderation write routes
- advanced timeline filtering or search routes
- transport-neutral abstraction redesign beyond first handler need

# Downstream Use

- persistence/readback issue should plug into these handlers without redefining route surface
- auth-error-config issue should apply enforcement to this route surface

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
