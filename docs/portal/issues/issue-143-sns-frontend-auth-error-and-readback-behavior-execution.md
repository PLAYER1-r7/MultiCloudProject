# Summary

Issue 137 では guest/member boundary、error visibility、post-readback rendering を first frontend path の中心 behavior として固定した。次に必要なのは、wired surface の上で guest blocked、member valid post、stable error display、readback rendering を execution-ready 単位に分け、first-slice UI behavior を narrow に固定することである。

この issue の役割は richer UX を作ることではなく、first-slice critical path の UI auth/error/readback behavior を service contract に従って成立させることである。

# Goal

SNS first implementation slice 向けに、frontend auth-error and readback behavior execution を定義し、guest/member boundary、error display、post-readback rendering、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-143
- Title: SNS frontend auth-error and readback behavior execution を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-142-sns-frontend-contract-wiring-and-surface-execution.md accepted as the current surface wiring reference

Objective
- Problem to solve: stable surface wiring があっても、guest blocked、member valid post、stable error display、post-readback rendering が execution-ready 単位に切れていないため、first-slice UI behavior の done line が曖昧である
- Expected value: UI-side auth/error/readback behavior を narrow unit として fixed し、validation/evidence issue が同じ visible critical path を検証できる
- Terminal condition: guest/member boundary、error display、readback rendering、completion signal、non-goals が fixed judgment として読め、UI behavior code change を開始できる

Scope
- In scope: guest blocked post UX、member valid post UX、stable error display、post-readback rendering、UI-side completion signal
- Out of scope: operator-specific UI depth、search/filter UI、notification UI、moderation UI、visual redesign
- Editable paths: docs/portal/issues/issue-143-sns-frontend-auth-error-and-readback-behavior-execution.md
- Restricted paths: docs/portal/issues/issue-137-sns-frontend-integration-execution.md, docs/portal/issues/issue-141-sns-service-auth-error-and-config-boundary-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: guest/member boundary が UI behavior 単位で明文化されている
- [ ] AC-2: stable error display と readback rendering が読み取れる
- [ ] AC-3: contract-confirmed success を待つ completion signal が読み取れる
- [ ] AC-4: richer UI and follow-on UX が non-goals として切り分けられている
```

# Execution Unit

## UI Auth Boundary

- UI auth state vocabulary should stay aligned to issue-128: signed-out, signed-in member, and operator
- guest may read the timeline surface
- guest may not complete post submission and should see the intended blocked state
- member may access the first-slice posting path
- operator-specific UI depth is not required in this pass

## Error Display Boundary

- invalid payload should surface the stable fail-closed error behavior
- write failure should remain visible and not degrade into silent success
- UI should not claim success before the contract-backed path confirms the intended result

## Readback Boundary

- successful post should render again through the intended readback path
- readback rendering should reflect the backend-defined slice behavior
- do not expand this pass into alternate projections, search results, or moderation views

## Completion Signal Candidate

- guest blocked state is visible on the declared slice path
- member valid post and post-readback rendering are visible on the declared slice path
- invalid payload and write failure remain visible through the stable error path

## Non-Goals

- operator workflow UI depth
- moderation UI
- search/filter/sort UI
- replies, reactions, follows, DMs, media upload
- broader visual redesign

# Downstream Use

- validation/evidence update issue should verify the visible critical path defined here

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-137-sns-frontend-integration-execution.md
- docs/portal/issues/issue-141-sns-service-auth-error-and-config-boundary-execution.md
- docs/portal/issues/issue-142-sns-frontend-contract-wiring-and-surface-execution.md
