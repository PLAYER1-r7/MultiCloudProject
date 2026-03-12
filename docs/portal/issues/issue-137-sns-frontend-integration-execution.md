# Summary

Issue 135 の first slice contract では、frontend integration は service/data path が stable contract として見えた後に接続する第二段階とした。次に必要なのは、local-only SNS demo 依存を real app-facing contract へ置き換えつつ、guest/member/operator boundary と narrow first-slice UI を保つ frontend integration execution unit を固定することである。

この issue の役割は richer SNS UI を作ることではなく、existing SNS surface を stable API contract へ接続し、guest timeline read、member post、post-readback consistency、fail-closed error display を first slice behavior として成立させることである。

# Goal

SNS first implementation slice 向けに、frontend integration execution を定義し、real service contract 接続、UI-side auth boundary preservation、error/readback behavior、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-137
- Title: SNS frontend integration execution を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-136-sns-service-and-data-path-execution.md accepted as the current service-path reference

Objective
- Problem to solve: service/data path が用意されても、frontend が local-only demo state、UI-only auth blocking、implicit optimistic fallback に依存したままだと first slice の real stateful path が成立しない
- Expected value: existing SNS surface を stable app-facing contract に接続し、guest/member boundary、post-readback behavior、fail-closed error display を narrow UI scope で成立させる frontend execution unit を fixed できる
- Terminal condition: frontend contract integration scope、UI-side auth/error/readback behavior、completion signal、non-goals が fixed judgment として読め、implementation work を code change へ落とせる

Scope
- In scope: SNS surface contract integration、guest/member/operator UI boundary preservation、read/post/readback UI behavior、stable error display、route and surface narrowness、frontend-side completion signal
- Out of scope: moderation dashboard、operator console depth、richer social UI、search/filter UI、notification UI、design overhaul
- Editable paths: docs/portal/issues/issue-137-sns-frontend-integration-execution.md
- Restricted paths: docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: frontend integration scope が app behavior 単位で明文化されている
- [ ] AC-2: guest/member/operator UI boundary と fail-closed error/readback behavior が読み取れる
- [ ] AC-3: local-only fallback を許さない completion signal が読み取れる
- [ ] AC-4: richer UI and follow-on features が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-137-sns-frontend-integration-execution.md
- Approach: Issue 135 と Issue 136 を継承し、既存 SNS surface を stable contract に接続する narrow frontend execution unit として、route/surface behavior、UI auth/error handling、readback rendering を切り出す
- Alternative rejected and why: validation suite update を同一 issue に入れる案は、UI wiring 完了と evidence update 完了を混同しやすく、slice completion signal を曖昧にするため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、UI integration scope、auth/error/readback behavior、completion signal、non-goals が issue 単位で読める
- Failure triage path: issue-127 product scope、issue-128 auth boundary、issue-135 first slice contract、issue-136 service/data execution を照合し、UI boundary、contract integration、fallback condition のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: frontend integration issue が broad すぎて moderation UI や product polish まで抱え込むか、逆に narrow すぎて real service-backed UX を成立させないこと
- Impact area: route behavior, user-facing correctness, validation stability, slice completion evidence
- Mitigation: first pass は timeline read、member post form、error visibility、post-readback rendering に限定し、operator console、search、rich interaction は follow-on に残す
- Rollback: scope が広がりすぎた場合は contract wiring、guest/member boundary、error display、readback rendering の 4 点だけを残し、UI hardening は separate issue へ分離する
```

# Tasks

- [ ] frontend contract wiring scope を fixed judgment にする
- [ ] guest/member/operator UI boundary を fixed judgment にする
- [ ] error display and readback behavior を fixed judgment にする
- [ ] local-only fallback prohibition を fixed judgment にする
- [ ] frontend completion signal と non-goals を明文化する

# Definition of Done

- [ ] SNS surface が stable app-facing contract に接続される範囲が読める
- [ ] guest write blocked、member valid post、post-readback rendering が UI behavior として読める
- [ ] fail-closed error display が local-only demo fallback と混ざらず読める
- [ ] route/surface scope が narrow first-slice に留まっている
- [ ] moderation UI、search/filter UI、notification UI が first pass から外れている

# Execution Unit

## Contract Wiring Boundary

- replace local-only SNS demo dependence on the declared critical path with the stable service-backed contract
- preserve the existing route and visible SNS surface as the first integration target
- keep app-facing contract names aligned with the current backend baseline
- do not introduce a separate experimental frontend-only API vocabulary

## UI Auth Boundary

- guest may read the timeline surface
- guest may not complete post submission and must see the expected blocked state
- member may access the posting path defined by the first slice
- operator-specific UI depth is not required in this pass

## Error And Readback Boundary

- invalid payload should surface the stable fail-closed error behavior
- write failure should remain visible to the user and not degrade into silent success
- successful post should render again through the intended readback path
- UI should not declare success before the contract-backed path confirms the intended result

## Local-Only Fallback Rule

- local-only fake state may remain as non-critical development support only if it is not on the declared completion path
- first slice completion cannot rely on UI-only block logic or fake timeline success on the critical path
- if the stable service path is unavailable, the UI should fail closed rather than pretend success

## Completion Signal Candidate

- frontend SNS surface reads from the intended service-backed timeline path on the declared slice path
- guest write remains blocked with the intended UX and service contract alignment
- member valid post and post-readback behavior are visible on the surface
- invalid payload and write failure remain visible through the stable error path
- no declared completed path relies on local-only fake success state

## Non-Goals

- moderation dashboard or operator workflow UI
- advanced timeline filtering, search, or sorting UI
- replies, reactions, follows, DMs, media upload
- visual redesign beyond the minimum first-slice integration need
- notification or activity UI

# Downstream Use

- validation/evidence update issue should use this issue as the source of truth for expected UI-side critical-path behavior
- later UX hardening should treat this issue as first-slice integration only, not as full SNS frontend completion

# Derived Execution Follow-Ups

- docs/portal/issues/issue-142-sns-frontend-contract-wiring-and-surface-execution.md
- docs/portal/issues/issue-143-sns-frontend-auth-error-and-readback-behavior-execution.md
- docs/portal/issues/issue-144-sns-frontend-fallback-prohibition-and-completion-signal-execution.md

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
