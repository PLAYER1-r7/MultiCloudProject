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
- [x] AC-1: guest/member enforcement と invalid payload reject が service-side rule として明文化されている
- [x] AC-2: stable error contract と fail-closed behavior が読み取れる
- [x] AC-3: secret-backed config boundary と no-leak assumption が読み取れる
- [x] AC-4: provider selection や UX detail が non-goals として切り分けられている

# Tasks

- [x] guest/member enforcement を fixed judgment にする
- [x] invalid payload reject と stable error contract を fixed judgment にする
- [x] secret-backed config boundary を fixed judgment にする
- [x] fail-closed completion signal を fixed judgment にする
- [x] auth/error/config non-goals を明文化する

# Definition of Done

- [x] guest write reject と member valid post enforcement が service-side rule として読める
- [x] invalid payload reject と stable error contract が読める
- [x] secret-backed config boundary と no-leak assumption が読める
- [x] fail-open ではない completion signal が読める
- [x] provider selection や frontend UX detail が本 issue から外れている

# Fixed Judgment

## Enforcement Config Rationale

- Issue 136 の backend parent execution を fail-open にしないため、route and persistence unit に横断する auth/error enforcement と config boundary を separate child issue として固定する
- この issue は auth provider live selection や secret store product choice を再議論するものではなく、first slice backend の fail-closed behavior と no-leak config boundary を narrow に確定する execution boundary である

## Auth Enforcement Resolution

- service-side auth state vocabulary は Issue 128 に揃えて signed-out、signed-in member、operator とする
- guest write は service boundary で fail closed し、member valid post の intended write path は許可される
- declared completed path で frontend-only blocking を enforcement 代替にしない

## Error Contract Resolution

- invalid payload は stable error contract を返すことに固定する
- write failure は implicit success へ degrade させず、stable backend outcome として残す
- uncontrolled backend error は success surrogate として扱わない

## Config Boundary Resolution

- secret-backed config は frontend bundle と public contract value から分離し、service side only に維持する
- first slice の public/private config separation を保ち、frontend rollout が unready service or secret path を推測しなくてよい状態を completion 前提とする
- provider-neutral actor id naming は service contract boundary で維持し、format や uniqueness guarantee は persistence boundary へ委譲する

## Completion And Non-Goals Resolution

- completion signal は guest write reject と invalid payload reject が service boundary で enforced、stable error contract が frontend and validation から読める、service config path が private value を public contract surface に leak しない、の全充足とする
- non-goals は auth provider comparison or live federation depth、secret store product comparison、frontend UX redesign for auth/error states、operator moderation workflow detail とする

# Process Review Notes

- Issue 136 の fail-closed auth/error と config boundary を child execution unit に分離し、route/persistence issue が enforcement line を抱え込まない形に整理した
- issue-128 の auth boundary と issue-132 の stack split を execution line に落とし込み、guest reject、invalid payload reject、stable error、secret-backed config separation を first backend pass の必須条件に固定した
- current backend chain では frontend and validation issue が同じ enforcement contract を参照できるよう、fail-open を許さない completion signal を明文化した
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

- local fixed judgment recorded
- GitHub Issue: #141
- Sync Status: synced to GitHub as open execution-planning issue

# Dependencies

- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
- docs/portal/issues/issue-140-sns-message-persistence-and-readback-execution.md
