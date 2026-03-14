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
- [x] AC-1: GET /api/sns/timeline と POST /api/sns/posts の route scope が app-facing behavior 単位で明文化されている
- [x] AC-2: handler responsibility と response/error shape が読み取れる
- [x] AC-3: fail-closed route behavior と completion signal が読み取れる
- [x] AC-4: persistence detail や follow-on API が non-goals として切り分けられている

# Tasks

- [x] route scope を fixed judgment にする
- [x] handler responsibility を fixed judgment にする
- [x] response and error shape を fixed judgment にする
- [x] fail-closed completion signal を fixed judgment にする
- [x] route-level non-goals を明文化する

# Definition of Done

- [x] GET /api/sns/timeline と POST /api/sns/posts の route scope が読める
- [x] request parse、validation、domain call、stable response or error return の責務分離が読める
- [x] local-only fallback なしの route-level completion signal が読める
- [x] persistence detail や follow-on API が本 issue から外れている

# Fixed Judgment

## Route Handler Rationale

- Issue 136 の backend parent execution を code change に落とす最初の unit として、route surface と handler responsibility を persistence や auth/config 実装から分離して固定する
- この issue は transport-neutral redesign や persistence strategy を抱えるものではなく、first slice route entrypoint と handler behavior を narrow に確定する execution boundary である

## Route Scope Resolution

- first route surface は `GET /api/sns/timeline` と `POST /api/sns/posts` の 2 本に固定する
- `GET /api/sns/timeline` は first public read route、`POST /api/sns/posts` は canonical signed-in member state 向け first authenticated write route とする
- moderation-specific write routes、advanced query/filter routes、follow-on API はこの issue に含めない

## Handler Responsibility Resolution

- route handler の責務は request parse、stable contract boundary への validation、intended domain or persistence path call、stable success or fail-closed error return に固定する
- provider-neutral actor id naming は handler contract boundary で維持し、format や uniqueness guarantee は persistence boundaryへ委譲する
- handler は local fake state を completion path に使わず、intended backend path を必ず経由する

## Response Error And Completion Resolution

- route-level success は intended baseline response shape を返し、failure は stable fail-closed error surface を返すことに固定する
- completion signal は 2 route が intended service boundary で reachable、handler が stable baseline response or stable error surface を返し、declared slice path に local-only fallback success が残らない、の全充足とする
- uncontrolled backend error を success surrogate として扱わない

## Route Non-Goals Resolution

- moderation write routes
- advanced timeline filtering or search routes
- transport-neutral abstraction redesign beyond first handler need
- frontend integration
- validation suite update

# Process Review Notes

- Issue 136 の backend parent execution を route and handler unit に落とし、route surface、handler responsibility、stable response or error shape を first code-change boundary として固定した
- issue-130 の API baseline と issue-141 の auth/error/config enforcement がこの route surface を継承できるよう、route 側では persistence strategy や secret handling を抱え込まない形に寄せた
- current backend chain では local-only fallback を route level で禁止し、later persistence or enforcement issue が同じ entrypoint を共有できる状態に整えた
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

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed execution record

# Dependencies

- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
