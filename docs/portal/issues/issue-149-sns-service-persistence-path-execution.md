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
- [x] AC-1: service-managed timeline read and post create path が明文化されている
- [x] AC-2: persistence failure の fail-closed error surface が読み取れる
- [x] AC-3: browser-local critical-path removal boundary が読み取れる
- [x] AC-4: frontend cutover and workflow detail が non-goals として切り分けられている

# Tasks

- [x] service-managed read/write path を fixed judgment にする
- [x] fail-closed persistence error surface を fixed judgment にする
- [x] browser-local critical-path removal boundary を fixed judgment にする
- [x] local execution evidence line を fixed judgment にする
- [x] execution non-goals を明文化する

# Definition of Done

- [x] service-managed timeline read and post create path が読める
- [x] persistence failure の fail-closed error surface が読める
- [x] browser-local critical path removal boundary が読める
- [x] local HTTP execution evidence line が読める
- [x] frontend cutover detail と workflow detail が本 issue から外れている

# Fixed Judgment

## Service Persistence Path Rationale

- Issue 148 の next-slice contract を最初の child execution unit に落とすため、GET timeline と POST create の service-managed persistence path を browser-local state から分離して固定する
- この issue は frontend cutover detail や workflow YAML を扱うものではなく、service-owned read/write path と persistence-aware fail-closed behavior を narrow に確定する execution boundary である

## Service Path Resolution

- GET /api/sns/timeline は declared next slice で service-owned persistence から read する path に固定する
- POST /api/sns/posts は declared next slice で service-owned persistence を通じて record create を行う path に固定する
- browser-local storage は declared critical path の source of truth に残さない

## Error And Removal Resolution

- persistence failure は stable fail-closed error surface を通じて visible であることに固定する
- write success は persistence success 前に主張せず、readback も fake state に silently fallback しない
- browser-local critical-path removal は service-owned persistence が next-slice critical path を担って初めて成立する

## Evidence And Non-Goals Resolution

- local execution note にある HTTP service boundary、stable route contract reuse、cross-origin service fetch validation は this execution unit の local evidence line として固定する
- non-goals は frontend cutover detail、workflow YAML detail、multi-cloud persistence、moderation expansion とする

# Process Review Notes

- Issue 148 の next-slice contract を service persistence child に落とし、service-owned read/write、fail-closed persistence error、browser-local critical-path removal を first implementation line に固定した
- local HTTP-mode execution evidence が既に存在するため、draft ではなく implemented execution record として扱える状態に揃えた
- current next-slice chain では frontend cutover と staging review がこの service-owned persistence path を前提に進むため、child execution の done line をここで閉じた
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

## Local Execution Note

- portal-web now includes a runnable HTTP SNS service boundary backed by service-owned file persistence for local execution
- the HTTP service reuses the SNS route contract for GET /api/sns/timeline and POST /api/sns/posts, reads actor context from stable request headers, and keeps fail-closed write and readback behavior intact
- local HTTP-mode validation now starts the service and Vite preview together so the browser bundle exercises cross-origin service fetch instead of the simulated-route path
- service-owned persistence is now locally executable, but cloud deployment shape, shared rollback evidence, and staging-reviewed completion are still pending in later issues

# Current Status

- local HTTP service execution implemented for the service-persistence path
- local validation evidence target:
	- `cd apps/portal-web && npm run typecheck`
	- `cd apps/portal-web && npm run test:sns-request-response-contract`
	- `cd apps/portal-web && npm run test:sns-auth-error-contract`
	- `cd apps/portal-web && npm run test:sns-http-surface-reachability`
	- `cd apps/portal-web && npm run test:sns-http-auth-post-readback`
- GitHub Issue: not created in this task
- Sync Status: local fixed execution record

# Dependencies

- docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md
