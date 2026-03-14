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
- [x] AC-1: guest/member boundary が UI behavior 単位で明文化されている
- [x] AC-2: stable error display と readback rendering が読み取れる
- [x] AC-3: contract-confirmed success を待つ completion signal が読み取れる
- [x] AC-4: richer UI and follow-on UX が non-goals として切り分けられている

# Tasks

- [x] guest/member UI boundary を fixed judgment にする
- [x] stable error display を fixed judgment にする
- [x] post-readback rendering を fixed judgment にする
- [x] contract-confirmed completion signal を fixed judgment にする
- [x] UI behavior non-goals を明文化する

# Definition of Done

- [x] guest blocked と member valid post path が UI behavior として読める
- [x] stable error display と readback rendering が読める
- [x] contract-confirmed success を待つ completion signal が読める
- [x] richer UX が本 issue から外れている

# Fixed Judgment

## UI Behavior Rationale

- Issue 137 の frontend parent execution と Issue 142 の wired surface を visible critical path に落とすため、guest/member boundary、stable error display、post-readback rendering を separate child unit として固定する
- この issue は richer UX や operator-specific UI depth を扱うものではなく、first-slice critical path の UI auth/error/readback behavior を service contract に従って成立させる narrow execution boundary である

## UI Auth Boundary Resolution

- UI auth state vocabulary は Issue 128 に揃えて signed-out、signed-in member、operator とする
- guest は timeline surface を読めるが、post submission completion path には入らず intended blocked state を見る
- member は first-slice posting path を利用でき、operator-specific UI depth はこの pass の対象外とする

## Error Display Resolution

- invalid payload は stable fail-closed error behavior として surface に見えることを固定する
- write failure は silent success へ degrade させず、visible error outcome として残す
- UI は contract-backed path が intended result を確認する前に success を宣言しない

## Readback And Completion Resolution

- successful post は intended readback path 経由で再描画され、backend-defined slice behavior に従う
- completion signal は guest blocked state visible、member valid post and post-readback rendering visible、invalid payload and write failure visible through stable error path、success declaration が contract-confirmed path に従属する、の全充足とする
- alternate projection、search result、moderation view はこの pass に要求しない

## UI Behavior Non-Goals Resolution

- operator workflow UI depth
- moderation UI
- search/filter/sort UI
- replies, reactions, follows, DMs, media upload
- broader visual redesign

# Process Review Notes

- Issue 137 の user-visible critical path を child execution unit に落とし、guest blocked、member valid post、stable error、post-readback rendering を first-slice UI behavior の done line に固定した
- issue-141 の backend enforcement contract と整合するよう、frontend 側では visible outcome と contract-confirmed success の境界を明確にした
- current frontend chain では validation/evidence issue が同じ visible critical path を参照できるよう、auth/error/readback behavior を reviewable な単位に整理した
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

- local fixed judgment recorded
- GitHub Issue: #148
- Sync Status: synced to GitHub as open execution-planning issue

# Dependencies

- docs/portal/issues/issue-137-sns-frontend-integration-execution.md
- docs/portal/issues/issue-141-sns-service-auth-error-and-config-boundary-execution.md
- docs/portal/issues/issue-142-sns-frontend-contract-wiring-and-surface-execution.md
