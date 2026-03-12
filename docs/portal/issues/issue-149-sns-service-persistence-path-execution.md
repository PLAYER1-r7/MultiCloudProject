# Summary

Issue 148 では、browser-local persistence を critical path から外し、service-owned persistence を real next slice の中心に据える contract を固定した。次に必要なのは、その contract を service persistence path execution として切り出し、GET /api/sns/timeline と POST /api/sns/posts の declared critical path を service-managed persistence に移すことである。

# Goal

SNS next slice 向けに service persistence path execution を定義し、service-owned read and write path、fail-closed persistence error handling、browser-local critical-path removal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-149
- Title: SNS service persistence path execution を整理する
- Requester: repository owner
- Target App: portal-web SNS service layer
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-148-sns-service-persistence-expansion-contract.md accepted as the current next-slice contract reference

Objective
- Problem to solve: browser-local persistence が critical path に残ったままでは service-owned readback と rollback-aware review を成立させられない
- Expected value: GET timeline と POST create が service-managed persistence によって成立し、fail-closed persistence error surface と browser-local critical-path removal が reviewable になる
- Terminal condition: service-managed read/write path、fail-closed persistence error surface、critical-path browser-local removal が fixed judgment として読め、implementation-ready unit に落とせる

Scope
- In scope: service-owned persistence-backed GET/POST path、persistence-aware fail-closed error handling、critical-path browser-local removal
- Out of scope: frontend cutover detail、workflow YAML detail、multi-cloud persistence、moderation expansion
- Editable paths: docs/portal/issues/issue-149-sns-service-persistence-path-execution.md
- Restricted paths: docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: service-managed timeline read and post create path が明文化されている
- [ ] AC-2: persistence failure の fail-closed error surface が読み取れる
- [ ] AC-3: browser-local critical-path removal boundary が読み取れる
- [ ] AC-4: frontend cutover and workflow detail が non-goals として切り分けられている
```

# Execution Unit

## Path Boundary

- GET /api/sns/timeline should read from service-owned persistence on the declared next slice
- POST /api/sns/posts should create records through service-owned persistence on the declared next slice
- browser-local storage should not remain the source of truth for the declared critical path

## Error Boundary

- persistence failure should be visible through a stable fail-closed error surface
- write success should not be claimed when persistence has not succeeded
- readback should not silently fall back to fake state on the declared next slice

## Non-Goals

- frontend cutover detail
- workflow YAML detail
- multi-cloud persistence
- moderation expansion

## Local Groundwork Note

- portal-web now includes a pluggable SNS service client boundary that separates simulated-route mode from future HTTP service mode
- public SNS config now supports `VITE_PUBLIC_SNS_SERVICE_MODE` and `VITE_PUBLIC_SNS_SERVICE_BASE_URL` so the browser bundle can target a real service boundary without reworking the SNS surface contract again
- runtime metadata now exposes service mode、service base URL、and next-slice readiness so the current first-slice baseline and the future service-persistence path are no longer conflated on the same surface
- current local implementation still does not satisfy this issue's full completion line because service-owned persistence and rollback-aware staging evidence are not implemented yet

# Current Status

- local groundwork implemented for the service-client boundary and HTTP service configuration path
- local validation evidence: `cd apps/portal-web && npm run typecheck && npm run test:sns-request-response-contract && npm run test:sns-auth-error-contract && npm run test:sns-surface-reachability && npm run test:sns-auth-post-readback`
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md
