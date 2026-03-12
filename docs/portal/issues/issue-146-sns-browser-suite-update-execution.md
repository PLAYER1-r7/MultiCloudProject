# Summary

Issue 138 では surface reachability と auth-post-readback suite を real service-backed path に追随させると fixed した。次に必要なのは、visible SNS critical path を browser-side evidence として維持するため、surface reachability と auth-post-readback の suite expectation update を execution-ready 単位に分けることである。

この issue の役割は new browser regression pack を作ることではなく、first-slice visible path に必要な suite update を narrow に固定することである。

# Goal

SNS first implementation slice 向けに、browser suite update execution を定義し、surface reachability と auth-post-readback suite の update boundary、visible-path completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-146
- Title: SNS browser suite update execution を整理する
- Requester: repository owner
- Target App: portal-web browser validation path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-145-sns-contract-validator-update-execution.md accepted as the current contract-side evidence reference

Objective
- Problem to solve: contract validator が更新されても、surface reachability と auth-post-readback suite が local-demo behavior のままだと、visible critical path の browser evidence が slice completion に追随しない
- Expected value: browser suite update boundary を fixed し、guest blocked、member success、error visibility、readback consistency を real service-backed path 上で reviewable にできる
- Terminal condition: browser suite scope、visible-path completion signal、fail conditions、non-goals が fixed judgment として読め、browser suite code change を開始できる

Scope
- In scope: surface reachability suite update boundary、auth-post-readback suite update boundary、visible critical-path evidence、browser-side fail conditions
- Out of scope: broad cross-feature regression pack、visual regression platform adoption、performance testing、CI redesign
- Editable paths: docs/portal/issues/issue-146-sns-browser-suite-update-execution.md
- Restricted paths: docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md, docs/portal/issues/issue-121-sns-auth-post-readback-suite-implementation-split.md, docs/portal/issues/issue-122-sns-surface-reachability-suite-implementation-split.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: surface reachability と auth-post-readback suite の update scope が明文化されている
- [ ] AC-2: visible critical-path completion signal が読み取れる
- [ ] AC-3: browser-side fail conditions が読み取れる
- [ ] AC-4: broad regression expansion や visual platform adoption が non-goals として切り分けられている
```

# Execution Unit

## Surface Reachability Boundary

- keep SNS surface reachability evidence mandatory for the visible first-slice entry surface
- update expectations so they validate the real service-backed visible path rather than a local-demo-only surface

## Auth-Post-Readback Boundary

- keep guest blocked, member success, error visibility, and readback consistency evidence mandatory
- update expectations so they validate the intended real first-slice path
- do not merge this issue into a broad cross-feature browser pack

## Completion Signal Candidate

- browser evidence proves the visible first-slice path on the declared surface
- suite success no longer depends on fake local success state on the critical path
- visible guest blocked, member success, error visibility, and readback consistency remain reviewable

## Non-Goals

- broad cross-feature browser regression pack
- visual regression platform adoption
- performance or load testing
- CI redesign

# Downstream Use

- staging evidence issue should treat this issue as the browser-side evidence source

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-121-sns-auth-post-readback-suite-implementation-split.md
- docs/portal/issues/issue-122-sns-surface-reachability-suite-implementation-split.md
- docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
- docs/portal/issues/issue-145-sns-contract-validator-update-execution.md
