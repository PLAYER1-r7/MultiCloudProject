# Summary

Issue 138 で validation and evidence update の外枠は fixed できた。最初に着手すべき証跡 unit は、request/response contract と auth-error contract の validator assumptions を real first-slice behavior に追随させる contract validator update execution である。

この issue の役割は browser suite や staging review 全体を抱えることではなく、contract-side repeatable evidence を narrow に固定することである。

# Goal

SNS first implementation slice 向けに、contract validator update execution を定義し、request/response と auth/error validator の update boundary、stable command surface、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-145
- Title: SNS contract validator update execution を整理する
- Requester: repository owner
- Target App: portal-web validation path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-138-sns-validation-and-evidence-update-execution.md accepted as the current validation/evidence parent execution record

Objective
- Problem to solve: real service-backed slice が成立しても、request/response と auth-error validator が local-demo assumptions のままだと、contract-side completion evidence が曖昧なまま残る
- Expected value: contract validator の update boundary と stable command surface を fixed し、browser suite と staging evidence が同じ backend/frontend slice contract を前提にできる
- Terminal condition: validator scope、stable command surface、completion signal、non-goals が fixed judgment として読め、contract validator code change を開始できる

Scope
- In scope: request/response validator update boundary、auth-error validator update boundary、stable command surface preservation、contract-side completion signal
- Out of scope: browser suite update、staging review packaging、new validator family introduction、CI redesign
- Editable paths: docs/portal/issues/issue-145-sns-contract-validator-update-execution.md
- Restricted paths: docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md, docs/portal/issues/issue-119-sns-request-response-contract-command-implementation-split.md, docs/portal/issues/issue-120-sns-auth-error-contract-command-implementation-split.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: request/response と auth/error validator の update scope が明文化されている
- [ ] AC-2: stable command surface preservation が読み取れる
- [ ] AC-3: contract-side completion signal と fail conditions が読み取れる
- [ ] AC-4: browser suite や new validator family が non-goals として切り分けられている
```

# Execution Unit

## Validator Scope Boundary

- keep request/response contract validation mandatory
- keep auth-error contract validation mandatory
- update assumptions so they reflect the real first-slice service and UI behavior rather than local-only demo assumptions

## Command Surface Boundary

- preserve stable validator command surfaces where practical
- avoid renaming validator entrypoints before behavior alignment is complete
- keep contract evidence repeatable on the existing command path family

## Completion Signal Candidate

- contract-side evidence proves the declared service-backed slice behavior
- validator output no longer depends on local-demo-only assumptions
- request/response and auth/error contract drift remain reviewable through repeatable command output

## Non-Goals

- browser suite update
- staging review packaging
- new validator family introduction
- broad CI redesign

# Downstream Use

- browser suite update issue should build on the updated contract-side assumptions from this issue
- staging evidence issue should treat this issue as the contract-side evidence source

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-119-sns-request-response-contract-command-implementation-split.md
- docs/portal/issues/issue-120-sns-auth-error-contract-command-implementation-split.md
- docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
