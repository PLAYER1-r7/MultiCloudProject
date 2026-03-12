# Summary

Issue 148 では、next slice の frontend 側は browser-local critical path から切り替わり、service-owned persistence-backed path を表示と completion signal の source of truth にする必要がある。次に必要なのは、その cutover を frontend execution unit として切り出し、visible fallback policy、reload-safe readback、error/readback markers を service-backed path に合わせて固定することである。

# Goal

SNS next slice 向けに frontend service-persistence cutover execution を定義し、browser-local critical-path removal、service-backed completion signal、visible fallback/error/readback state を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-150
- Title: SNS frontend service-persistence cutover execution を整理する
- Requester: repository owner
- Target App: portal-web SNS frontend surface
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-149-sns-service-persistence-path-execution.md accepted as the current service persistence execution reference

Objective
- Problem to solve: service-owned persistence が実装されても、frontend が browser-local state を critical-path success source として扱い続けると next slice completion line が崩れる
- Expected value: frontend が service-backed readback を source of truth とし、visible fallback/error/readback markers を next slice completion signal に接続できる
- Terminal condition: browser-local critical-path removal、service-backed completion signal、visible fallback/error/readback state が fixed judgment として読め、implementation-ready unit に落とせる

Scope
- In scope: frontend cutover from browser-local critical path、service-backed completion signal、visible fallback/error/readback state
- Out of scope: service persistence implementation detail、workflow YAML detail、moderation UI、multi-cloud variant work
- Editable paths: docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md
- Restricted paths: docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md, docs/portal/issues/issue-149-sns-service-persistence-path-execution.md, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: browser-local critical-path removal が frontend behavior 単位で明文化されている
- [ ] AC-2: service-backed completion signal と readback markers が読み取れる
- [ ] AC-3: fallback and error visibility が next slice completion line と結び付いている
- [ ] AC-4: service persistence implementation detail と moderation UI が non-goals として切り分けられている
```

# Execution Unit

## Cutover Boundary

- frontend success should depend on service-backed readback rather than browser-local state
- visible fallback policy should remain reviewable when service persistence is unavailable
- reload-safe review should remain part of the completion signal

## Visibility Boundary

- runtime status、completion signal、fallback policy、error code、retryability、readback state should remain visible
- next slice should make those markers reflect service-backed behavior rather than browser-local success state

## Non-Goals

- service persistence implementation detail
- workflow YAML detail
- moderation UI
- multi-cloud variant work

# Current Status

- frontend runtime cutover now reads SNS public config from runtime-config.js first, so staging can switch the SNS surface to HTTP service mode without rebuilding the bundle
- local HTTP-mode validation rewrites dist/runtime-config.js before preview, which keeps the browser evidence on the service-backed path instead of depending on stale build-time env or browser-local state
- live staging cutover confirmation remains pending until a staging deploy publishes reviewed SNS service settings and the matching staging review passes against that runtime config
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md
- docs/portal/issues/issue-149-sns-service-persistence-path-execution.md
