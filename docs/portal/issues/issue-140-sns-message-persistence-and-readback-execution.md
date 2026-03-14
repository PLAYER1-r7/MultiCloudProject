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
- [x] AC-1: minimum message record persistence behavior が app behavior 単位で明文化されている
- [x] AC-2: newest-first readback と post-readback consistency expectation が読み取れる
- [x] AC-3: compatibility-preserving rule と completion signal が読み取れる
- [x] AC-4: search、edit history、analytics projection などが non-goals として切り分けられている

# Tasks

- [x] minimum record persistence を fixed judgment にする
- [x] newest-first readback を fixed judgment にする
- [x] post-readback consistency expectation を fixed judgment にする
- [x] compatibility-preserving rule と completion signal を fixed judgment にする
- [x] persistence non-goals を明文化する

# Definition of Done

- [x] minimum message record persistence behavior が読める
- [x] newest-first readback と member post 後の intended visibility が読める
- [x] compatibility-preserving persistence rule が読める
- [x] local fake timeline state なしの completion signal が読める
- [x] search、edit history、analytics projection が本 issue から外れている

# Fixed Judgment

## Persistence Readback Rationale

- Issue 136 の backend parent execution と Issue 139 の route surface を real stateful path にするため、minimum persistence and readback behavior を separate unit として固定する
- この issue は storage engine comparison を再開するものではなく、first slice の member post と timeline readback consistency を成立させる最小 persistence behavior を narrow に確定する execution boundary である

## Minimum Record Resolution

- persistence scope は current planning chain が要求する minimum message record を intended backend path で保存することに固定する
- newly created message record は intended timeline path から readback 可能であることを必須条件とする
- first slice compatibility assumption を壊す destructive behavior は completion に含めない

## Readback Resolution

- first slice readback expectation は newest-first timeline behavior に固定する
- member valid post 後に intended readback visibility が成立することを backend core completion に含める
- advanced filtering、search、alternate projection はこの pass に要求しない

## Compatibility And Completion Resolution

- compatibility-preserving rule は first-slice readback assumption を壊さず、route and handler unit が stable readback contract を前提にできることに固定する
- completion signal は valid member post が intended timeline path で readback できる、newest-first ordering expectation が維持される、declared critical path に local fake timeline success が残らない、の全充足とする
- persistence implementation detail はこの issue で扱ってよいが、storage product comparison reopening は扱わない

## Persistence Non-Goals Resolution

- full retention policy implementation
- edit history
- search indexing and advanced query
- analytics or moderation projections
- storage engine comparison reopening

# Process Review Notes

- Issue 136 の minimum persistence behavior を child execution unit に落とし、message record、newest-first readback、post-readback consistency を backend core の done line として固定した
- issue-129 の persistence judgment を継承しつつ、route and handler issue が readback expectation を再定義しないよう、compatibility-preserving rule を execution boundary に寄せた
- current backend chain では local fake timeline state を readback completion から除外し、frontend と validation が同じ persisted readback behavior を参照できる状態に整えた
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

- local fixed judgment recorded
- GitHub Issue: #146
- Sync Status: synced to GitHub as open execution-planning issue

# Dependencies

- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
