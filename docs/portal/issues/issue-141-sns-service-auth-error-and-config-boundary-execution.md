# Summary

Issue 136 では guest write reject、invalid payload reject、secret-backed config boundary を first backend path の必須条件として固定した。次に必要なのは、service route/handler と persistence/readback に横断する auth-error enforcement と config boundary を execution-ready 単位に分け、fail-closed backend behavior を separate issue として固定することである。

この issue の役割は auth provider selection や secret store product choice を再議論することではなく、first slice backend が fail-open にならないための enforcement and config boundary を narrow に切ることである。

# Goal

SNS first implementation slice 向けに、service auth-error and config boundary execution を定義し、guest/member enforcement、invalid payload handling、stable error contract、secret-backed config boundary、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-141
- Title: SNS service auth-error and config boundary execution を整理する
- Requester: repository owner
- Target App: future SNS service layer
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-140-sns-message-persistence-and-readback-execution.md accepted as the current persistence/readback reference

Objective
- Problem to solve: route and persistence が揃っても、guest/member enforcement、invalid payload reject、stable error contract、secret-backed config boundary が execution-ready 単位に切れていないと、first slice backend が UI-only blocking や config leakage に依存しやすい
- Expected value: first slice backend の fail-closed auth/error behavior と secret-backed config boundary を fixed し、frontend と validation issue が同じ enforcement contract に依存できる
- Terminal condition: auth enforcement、error contract、config boundary、completion signal、non-goals が fixed judgment として読め、enforcement/config code change を開始できる

Scope
- In scope: guest/member enforcement at service boundary、invalid payload reject、stable error contract、secret-backed config boundary、fail-closed completion signal
- Out of scope: auth provider live selection、operator console depth、secret store product comparison、monitoring automation、frontend UX detail
- Editable paths: docs/portal/issues/issue-141-sns-service-auth-error-and-config-boundary-execution.md
- Restricted paths: docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md, docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: guest/member enforcement と invalid payload reject が service-side rule として明文化されている
- [ ] AC-2: stable error contract と fail-closed behavior が読み取れる
- [ ] AC-3: secret-backed config boundary と no-leak assumption が読み取れる
- [ ] AC-4: provider selection や UX detail が non-goals として切り分けられている
```

# Execution Unit

## Auth Enforcement Boundary

- service-side auth state vocabulary should stay aligned to issue-128: signed-out, signed-in member, and operator
- guest write must fail closed at the service boundary
- member valid post may proceed through the intended write path
- service enforcement must not rely on frontend-only blocking for the declared completed path

## Error Contract Boundary

- invalid payload must return the stable error contract
- write failure must stay visible as a stable backend outcome and not degrade into implicit success
- uncontrolled backend error is not an acceptable success surrogate

## Config Boundary

- keep secret-backed config outside the frontend bundle and repository constants used as public contract values
- preserve public/private config separation for the first slice
- keep provider-neutral actor id naming stable at the service contract boundary, while actor id format and uniqueness guarantee remain deferred to the persistence boundary
- do not force frontend rollout to guess unready service or secret paths

## Completion Signal Candidate

- guest write reject and invalid payload reject are enforced at the service boundary
- stable error contract remains readable by frontend and validation paths
- service config path does not leak private values into public contract surfaces

## Non-Goals

- auth provider comparison or live federation depth
- secret store product comparison
- frontend UX redesign for auth/error states
- operator moderation workflow detail

# Downstream Use

- frontend integration should render the enforced auth/error outcomes from this issue
- validation/evidence update should verify these fail-closed outcomes without redefining them

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
- docs/portal/issues/issue-140-sns-message-persistence-and-readback-execution.md
