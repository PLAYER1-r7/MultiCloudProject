# Summary

Issue 136 では minimum persistence behavior と readback expectation を first backend path の一部として固定した。次に必要なのは、message record の minimum persistence、newest-first readback、compatibility-preserving behavior を execution-ready 単位に分け、route/handler 実装から独立した persistence and readback issue として固定することである。

この issue の役割は storage product selection を再議論することではなく、first slice が real readback を成立させるための minimum persistence behavior を narrow に切ることである。

# Goal

SNS first implementation slice 向けに、message persistence and readback execution を定義し、minimum record behavior、readback expectation、compatibility rule、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-140
- Title: SNS message persistence and readback execution を整理する
- Requester: repository owner
- Target App: future SNS service layer
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-139-sns-service-route-and-handler-execution.md accepted as the current route/handler reference

Objective
- Problem to solve: route surface が固定されても、minimum message record、newest-first readback、compatibility-preserving persistence behavior が execution-ready 単位に切れていないため、real post-readback path の done line が曖昧である
- Expected value: first slice に必要な minimum persistence and readback behavior を fixed し、member post と timeline readback consistency の backend core を narrow に実装できる
- Terminal condition: minimum record behavior、readback expectation、compatibility rule、completion signal、non-goals が fixed judgment として読め、persistence/readback code change を開始できる

Scope
- In scope: minimum message record persistence、newest-first readback、post-readback consistency expectation、compatibility-preserving rule、persistence-level non-goals
- Out of scope: storage engine comparison reopening、search indexing、edit history、deep retention tooling、moderation workflow depth、analytics projections
- Editable paths: docs/portal/issues/issue-140-sns-message-persistence-and-readback-execution.md
- Restricted paths: docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md, docs/portal/issues/issue-136-sns-service-and-data-path-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: minimum message record persistence behavior が app behavior 単位で明文化されている
- [ ] AC-2: newest-first readback と post-readback consistency expectation が読み取れる
- [ ] AC-3: compatibility-preserving rule と completion signal が読み取れる
- [ ] AC-4: search、edit history、analytics projection などが non-goals として切り分けられている
```

# Execution Unit

## Minimum Record Boundary

- persist the minimum message record required by the current planning chain
- support readback of the intended newly created message record
- avoid destructive behavior that breaks first-slice compatibility assumptions

## Readback Boundary

- return newest-first timeline behavior for the first slice
- support member post followed by intended readback visibility
- do not require advanced filtering, search, or alternate projections in this pass

## Completion Signal Candidate

- valid member post can be read back through the intended timeline path
- newest-first ordering expectation is preserved for the slice path
- persistence behavior does not depend on local fake timeline state on the declared critical path

## Non-Goals

- full retention policy implementation
- edit history
- search indexing and advanced query
- analytics or moderation projections

# Downstream Use

- frontend integration should render the readback behavior defined here
- validation/evidence update should verify post-readback consistency against this issue

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
