# Summary

Issue 135 では first slice completion に既存 contract validator と browser suites を継承すると固定した。Issue 136 と Issue 137 で real service-backed path と frontend integration を execution-ready 単位に分けたことで、最後に必要なのは、request/response contract、auth-error contract、surface reachability、auth-post-readback を real slice behavior に追随させ、staging-oriented evidence path として完成させる validation and evidence update issue である。

この issue の役割は新しい test family を発明することではなく、既存 validator と browser flow evidence を first real stateful slice に合わせて更新し、completion signal を reviewable にすることである。

# Goal

SNS first implementation slice 向けに、validation and evidence update execution を定義し、existing validator and browser suite の更新境界、evidence path、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-138
- Title: SNS validation and evidence update execution を整理する
- Requester: repository owner
- Target App: portal-web and validation scripts
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-137-sns-frontend-integration-execution.md accepted as the current frontend integration reference

Objective
- Problem to solve: real service-backed slice を実装しても、既存 contract validator と browser suites が local demo or earlier assumptions のままだと、slice completion を reviewable evidence で閉じられない
- Expected value: request/response contract、auth-error contract、surface reachability、auth-post-readback を real slice behavior に追随させ、staging-oriented evidence path を fixed できる
- Terminal condition: validation scope、suite update boundary、evidence path、completion signal、non-goals が fixed judgment として読め、first slice completion を reviewable evidence で確認できる

Scope
- In scope: existing contract validator update boundary、browser suite update boundary、critical-path evidence path、staging-oriented execution evidence、first slice completion signal
- Out of scope: entirely new test framework family、deep load/perf testing、full monitoring automation、broad CI redesign、non-critical UI regression expansion
- Editable paths: docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
- Restricted paths: docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, docs/portal/issues/issue-137-sns-frontend-integration-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: validator and suite update scope が first slice completion line に沿って明文化されている
- [ ] AC-2: request/response、auth/error、surface reachability、auth-post-readback の evidence path が読み取れる
- [ ] AC-3: staging-oriented completion signal と fail conditions が読み取れる
- [ ] AC-4: deep coverage expansion や new test family が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
- Approach: historical Issue 119、Issue 120、Issue 121、Issue 122 の evidence shape を参照しつつ、Issue 135、Issue 136、Issue 137 の first-slice behavior に合わせて validator と browser suite の update boundary を execution-ready 単位に整理する
- Alternative rejected and why: backend/frontend issue の中で validation update を吸収する案は、behavior implementation と evidence update の done line が混ざり、slice completion を reviewable にしにくいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、validator update scope、browser suite scope、evidence path、completion signal、non-goals が issue 単位で読める
- Failure triage path: issue-119、issue-120、issue-121、issue-122 の historical evidence shape と、issue-135、issue-136、issue-137 の current slice behavior を照合し、contract or suite or completion signal のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: validation issue が broad すぎて new test family や CI redesign まで抱え込むか、逆に narrow すぎて slice completion を reviewable evidence で閉じられないこと
- Impact area: completion judgment, staging readiness, regression safety, operator confidence
- Mitigation: first pass は existing validator と browser suite の update に限定し、deep coverage expansion、perf testing、alert automation は non-goal に残す
- Rollback: scope が広がりすぎた場合は contract validator update、browser suite update、completion evidence path の 3 点だけを残し、coverage expansion は separate issue へ分離する
```

# Tasks

- [ ] contract validator update scope を fixed judgment にする
- [ ] browser suite update scope を fixed judgment にする
- [ ] staging-oriented evidence path を fixed judgment にする
- [ ] slice completion fail conditions を fixed judgment にする
- [ ] validation non-goals を明文化する

# Definition of Done

- [ ] request/response と auth/error validator が first slice behavior に追随する範囲が読める
- [ ] surface reachability と auth-post-readback suite が real service-backed path に追随する範囲が読める
- [ ] staging-oriented evidence path が slice completion signal と結び付いて読める
- [ ] fail conditions が reviewable evidence 不足も含めて読める
- [ ] deep coverage expansion や new test family が first pass から外れている

# Execution Unit

## Contract Validator Boundary

- keep request/response contract validation mandatory
- keep auth-error contract validation mandatory
- update validator assumptions so they reflect the real first-slice service behavior rather than local-only demo assumptions
- preserve stable command surfaces where possible instead of renaming validator entrypoints first

## Browser Suite Boundary

- keep SNS surface reachability evidence mandatory for the visible entry surface
- keep auth-post-readback evidence mandatory for guest blocked, member success, error visibility, and readback consistency
- update suite expectations so they validate the real service-backed path on the declared slice path
- do not expand this issue into broad cross-feature browser regression packs

## Evidence Path Boundary

- completion evidence should be reviewable from the existing validation command and browser suite path
- slice completion should require evidence for contract compatibility and user-visible critical flow
- local observation without repeatable command or suite output is insufficient for done judgment
- staging-oriented evidence should remain the preferred completion path once the slice is deployable there

## Fail Conditions Candidate

- validator output still proves only local-demo behavior and not the declared service-backed slice path
- browser suites pass only because they rely on fake success state on the critical path
- guest write reject, member valid post, or post-readback consistency lack repeatable evidence
- completion is claimed without contract-side and browser-side evidence both being reviewable

## Non-Goals

- new test framework family introduction
- deep end-to-end pack expansion beyond first slice critical path
- performance/load testing
- monitoring alert integration
- broad CI pipeline redesign

# Downstream Use

- slice completion review should use this issue as the evidence contract
- later regression hardening should treat this issue as the first-slice evidence update only, not the final SNS test strategy

# Derived Execution Follow-Ups

- docs/portal/issues/issue-145-sns-contract-validator-update-execution.md
- docs/portal/issues/issue-146-sns-browser-suite-update-execution.md
- docs/portal/issues/issue-147-sns-staging-evidence-and-completion-review-execution.md

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Historical References

- docs/portal/issues/issue-119-sns-request-response-contract-command-implementation-split.md
- docs/portal/issues/issue-120-sns-auth-error-contract-command-implementation-split.md
- docs/portal/issues/issue-121-sns-auth-post-readback-suite-implementation-split.md
- docs/portal/issues/issue-122-sns-surface-reachability-suite-implementation-split.md

# Dependencies

- docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-137-sns-frontend-integration-execution.md
