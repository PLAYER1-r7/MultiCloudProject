# Summary

Issue 148 では、next slice の completion は service-owned persistence と rollback-aware staging evidence まで含むと固定した。次に必要なのは、その evidence path を separate execution unit として切り出し、stateful staging review、reload-safe readback review、rollback trigger and recovery review を narrow に定義することである。

# Goal

SNS next slice 向けに stateful staging review and rollback evidence execution を定義し、service-persistence-aware staging review、rollback trigger、post-rollback verification を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-151
- Title: SNS stateful staging review and rollback evidence execution を整理する
- Requester: repository owner
- Target App: portal-web SNS next-slice review path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-150-sns-frontend-service-persistence-cutover-execution.md accepted as the current frontend cutover reference

Objective
- Problem to solve: service-owned persistence へ進んでも、staging review と rollback-aware evidence path が next slice 単位に固定されていないと completion judgment が再び ad hoc になる
- Expected value: service persistence、reload-safe readback、rollback trigger、post-rollback verification を同じ reviewable path で扱える
- Terminal condition: stateful staging review boundary、rollback trigger、post-rollback verification、fail conditions が fixed judgment として読め、code and ops evidence へ落とせる

Scope
- In scope: service-persistence-aware staging review、reload-safe readback review、rollback trigger、post-rollback verification
- Out of scope: production governance redesign、full incident program、automatic rollback orchestration、monitoring vendor selection
- Editable paths: docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md
- Restricted paths: docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md, docs/portal/issues/issue-149-sns-service-persistence-path-execution.md, docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: service-persistence-aware staging review boundary が明文化されている
- [ ] AC-2: rollback trigger と post-rollback verification が読み取れる
- [ ] AC-3: reload-safe readback review が completion signal と結び付いている
- [ ] AC-4: automatic rollback orchestration などが non-goals として切り分けられている
```

# Execution Unit

## Review Boundary

- staging review should prove service-owned persistence and reload-safe readback on the declared critical path
- completion review should fail closed when service persistence evidence and visible readback evidence disagree

## Rollback Boundary

- rollback trigger candidates should include repeated write failure、timeline read failure、data compatibility break、or service misconfiguration
- post-rollback verification should include guest read、guest write reject、member persisted write or declared maintenance posture、and reload-safe readback confirmation

## Non-Goals

- production governance redesign
- full incident program
- automatic rollback orchestration
- monitoring vendor selection

# Current Status

- staging deploy now records an SNS runtime config snapshot and rewrites runtime-config.js inside the deploy artifact so the reviewed staging surface can advertise the intended HTTP service path
- SNS staging review now fails closed unless staging is configured for HTTP service mode with a declared service base URL, and the surface reachability review verifies that the visible runtime markers match that reviewed service URL
- live staging review run and rollback-target evidence remain pending until the updated workflows are executed against a real staging SNS service target
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md
- docs/portal/issues/issue-149-sns-service-persistence-path-execution.md
- docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md
