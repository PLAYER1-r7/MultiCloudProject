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
- [x] AC-1: surface reachability と auth-post-readback suite の update scope が明文化されている
- [x] AC-2: visible critical-path completion signal が読み取れる
- [x] AC-3: browser-side fail conditions が読み取れる
- [x] AC-4: broad regression expansion や visual platform adoption が non-goals として切り分けられている

# Tasks

- [x] surface reachability suite update scope を fixed judgment にする
- [x] auth-post-readback suite update scope を fixed judgment にする
- [x] visible critical-path completion signal を fixed judgment にする
- [x] browser-side fail conditions を fixed judgment にする
- [x] browser suite non-goals を明文化する

# Definition of Done

- [x] surface reachability と auth-post-readback suite の update scope が読める
- [x] visible critical-path completion signal が読める
- [x] browser-side fail conditions が読める
- [x] broad regression expansion や visual platform adoption が本 issue から外れている

# Fixed Judgment

## Browser Suite Rationale

- Issue 138 の validation/evidence parent execution と Issue 145 の contract-side evidence を visible critical path に追随させるため、surface reachability と auth-post-readback suite update を separate child unit として固定する
- この issue は new browser regression pack を作るものではなく、first-slice visible path に必要な browser-side evidence を narrow に確定する execution boundary である

## Surface Reachability Resolution

- SNS surface reachability evidence は visible first-slice entry surface の mandatory browser-side scope に固定する
- suite expectation は local-demo-only surface ではなく、declared real service-backed visible path を検証するよう更新する

## Auth Post Readback Resolution

- guest blocked、member success、error visibility、readback consistency evidence は mandatory browser-side critical path に固定する
- suite expectation は intended real first-slice path を検証するものとし、broad cross-feature browser pack へ拡張しない
- browser-side evidence は contract-side assumptions と矛盾しないことを前提にする

## Completion And Fail Condition Resolution

- visible critical-path completion signal は browser evidence が declared first-slice surface を証明し、suite success が fake local success state に依存せず、guest blocked、member success、error visibility、readback consistency が repeatable に reviewable であることに固定する
- fail condition は surface reachability or auth-post-readback suite が still local-demo behavior を前提にする、fake success state 依存で pass する、visible critical path の一部が repeatable evidence 化されていない、のいずれかが残る場合とする

## Browser Suite Non-Goals Resolution

- broad cross-feature browser regression pack
- visual regression platform adoption
- performance or load testing
- CI redesign

# Process Review Notes

- Issue 138 の evidence contract を browser-side unit に分離し、surface reachability と auth-post-readback を first-slice visible path の最小 browser evidence として固定した
- issue-121 と issue-122 の historical suite family を踏まえつつ、new pack 拡張ではなく real service-backed visible path への expectation update を優先した
- current validation chain では completion review が同じ visible critical-path evidence を参照できるよう、browser-side fail conditions と non-goals を明文化した
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

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed execution record

# Dependencies

- docs/portal/issues/issue-121-sns-auth-post-readback-suite-implementation-split.md
- docs/portal/issues/issue-122-sns-surface-reachability-suite-implementation-split.md
- docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
- docs/portal/issues/issue-145-sns-contract-validator-update-execution.md
