# Summary

Issue 137 で frontend integration execution の外枠は fixed できた。最初に着手すべき frontend unit は、既存 SNS surface を stable app-facing contract へ接続し、route と visible surface を first-slice scope のまま保つ contract wiring and surface execution である。

この issue の役割は auth/error behavior や readback rendering 全体を抱えることではなく、real service-backed UI path へ入るための route/surface wiring を narrow に固定することである。

# Goal

SNS first implementation slice 向けに、frontend contract wiring and surface execution を定義し、contract wiring、route/surface scope、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-142
- Title: SNS frontend contract wiring and surface execution を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-137-sns-frontend-integration-execution.md accepted as the current frontend integration parent execution record

Objective
- Problem to solve: stable service path があっても、frontend route/surface wiring が execution-ready 単位に切れていないため、local demo state から real contract への切り替えが auth/error/readback logic と混ざりやすい
- Expected value: existing SNS route と visible surface を stable app-facing contract に接続する narrow unit を fixed し、後続の UI behavior issue が安定した surface 上で進められる
- Terminal condition: contract wiring scope、route/surface scope、completion signal、non-goals が fixed judgment として読め、surface wiring code change を開始できる

Scope
- In scope: stable contract wiring、SNS route/surface scope、visible surface preservation、contract-name continuity、surface-level completion signal
- Out of scope: guest/member behavior detail、error state detail、readback rendering detail、moderation UI、design overhaul
- Editable paths: docs/portal/issues/issue-142-sns-frontend-contract-wiring-and-surface-execution.md
- Restricted paths: docs/portal/issues/issue-137-sns-frontend-integration-execution.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: contract wiring scope が app behavior 単位で明文化されている
- [ ] AC-2: route/surface scope と visible SNS surface preservation が読み取れる
- [ ] AC-3: local demo dependence を completion path から外す signal が読み取れる
- [ ] AC-4: UI behavior detail や follow-on UI が non-goals として切り分けられている
```

# Execution Unit

## Contract Wiring Boundary

- replace declared critical-path dependence on local-only SNS demo state with the stable service-backed contract
- keep app-facing contract names aligned with the backend baseline
- do not introduce a separate frontend-only API vocabulary for the first slice

## Route And Surface Boundary

- preserve the existing SNS route and visible entry surface as the first integration target
- keep the surface narrow to timeline read and posting entry behavior required by the first slice
- do not expand into moderation or richer social surfaces in this pass

## Completion Signal Candidate

- the declared SNS surface reads from the intended service-backed contract path
- no declared completed route/surface depends on local-only demo success state
- surface scope remains limited to the first-slice visible path

## Non-Goals

- guest/member behavior detail beyond surface wiring
- error banner or readback rendering detail
- moderation UI or richer social surface expansion
- visual redesign

# Downstream Use

- UI auth/error/readback behavior issue should build on this wired surface
- fallback/completion issue should enforce no-fake-success rule on this surface

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-137-sns-frontend-integration-execution.md
