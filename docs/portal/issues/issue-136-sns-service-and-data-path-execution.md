# Summary

Issue 135 で first implementation slice の done line は fixed できた。最初の実装順として先に固めるべきなのは、GET /api/sns/timeline と POST /api/sns/posts を real service-backed path として成立させる service and data path である。frontend integration より先に、service boundary、minimum persistence、fail-closed auth/error、secret-backed config injection が安定していないと、slice completion を local-only fallback や UI-only block に誤魔化しやすい。

この issue の役割は product や cloud-neutral contract を再議論することではなく、single-cloud first の one path で minimum read/write service を execution-ready 単位に切り出すことである。

# Goal

SNS first implementation slice 向けに、service and data path execution を定義し、minimum API path、persistence behavior、fail-closed auth/error、config/secret boundary、completion signal を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-136
- Title: SNS service and data path execution を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-135-sns-first-implementation-slice-contract.md accepted as the current first-slice contract

Objective
- Problem to solve: first slice の service path、minimum persistence、auth/error enforcement、secret-backed config injection が execution-ready 単位に切れていないため、frontend integration より先に安定させるべき backend path の着手条件と完了条件が曖昧である
- Expected value: GET /api/sns/timeline と POST /api/sns/posts を minimum message model と fail-closed behavior 付きで成立させる service/data execution unit を fixed し、frontend と validation issue が stable contract に依存できる
- Terminal condition: service route、minimum persistence behavior、auth/error enforcement、config/secret boundary、completion signal、non-goals が fixed judgment として読め、implementation work を code change へ落とせる

Scope
- In scope: GET /api/sns/timeline、POST /api/sns/posts、minimum message persistence behavior、guest/member enforcement、stable error contract、service-side config/secret path、single-cloud first execution boundary
- Out of scope: moderation dashboard、operator workflow depth、advanced search/filtering、multi-cloud routing、production automation depth、provider comparison reopening
- Editable paths: docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- Restricted paths: docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md, docs/portal/issues/issue-130-sns-backend-and-api-baseline.md, docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: service-side minimum read/write path が app behavior 単位で明文化されている
- [x] AC-2: minimum persistence behavior と fail-closed auth/error enforcement が読み取れる
- [x] AC-3: service config and secret boundary と single-cloud first assumption が読み取れる
- [x] AC-4: frontend integration と validation issue が参照すべき completion signal と non-goals が整理されている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-136-sns-service-and-data-path-execution.md
- Approach: Issue 130、Issue 131、Issue 132、Issue 135 を継承し、service contract を先に安定化する narrow execution unit として、minimum API、message persistence、auth/error、config path を切り出す
- Alternative rejected and why: frontend integration と service path を同一 issue に入れる案は、service-side fail-closed condition と UI-side wiring 完了を切り分けにくくし、done judgment を曖昧にするため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、service route、persistence behavior、auth/error enforcement、config boundary、completion signal が issue 単位で読める
- Failure triage path: issue-130 API baseline、issue-131 security floor、issue-132 stack split、issue-135 first slice contract を照合し、service path、security enforcement、config boundary のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: service execution issue が broad すぎて provider selection や moderation workflow まで抱え込むか、逆に narrow すぎて real read/write path を成立させずに done 扱いになること
- Impact area: backend execution order, data consistency, frontend dependency stability, validation readiness
- Mitigation: first pass は timeline read、member post、guest write reject、invalid payload reject、minimum persistence restore だけに限定し、operator UI や advanced query は follow-on に残す
- Rollback: scope が広がりすぎた場合は read path、write path、minimum persistence、fail-closed auth/error、config boundary の 5 点だけを残し、follow-on service features は separate issue へ分離する
```

# Tasks

- [x] minimum service route scope を fixed judgment にする
- [x] minimum persistence behavior を fixed judgment にする
- [x] fail-closed auth/error enforcement を fixed judgment にする
- [x] config and secret boundary を fixed judgment にする
- [x] service completion signal と non-goals を明文化する

# Definition of Done

- [x] GET /api/sns/timeline と POST /api/sns/posts の minimum service path が読める
- [x] guest write reject と invalid payload reject が service-side rule として読める
- [x] minimum message persistence behavior と readback expectation が読める
- [x] service config and secret boundary が frontend integration issue に渡せる形で読める
- [x] moderation workflow depth、advanced query、multi-cloud write が first pass から外れている

# Fixed Judgment

## Backend Parent Execution Rationale

- Issue 135 で first slice done line は固定されたが、その completion signal を code change に落とすには、frontend より先に service/data path の backend parent execution を固定する必要がある
- この issue は product scope や API baseline を再議論するものではなく、Issue 130、Issue 131、Issue 132、Issue 135 で決めた backend-facing contract を one-cloud first の execution parent として束ねる narrow execution boundary である
- downstream の Issue 137 と Issue 138 はこの issue の service completion signal を継承し、backend 側の成立条件を再定義しない

## Minimum Service Route Resolution

- first backend execution path は `GET /api/sns/timeline` と `POST /api/sns/posts` の 2 route に固定し、public read と authenticated write の最小 app behavior をここで成立対象とする
- timeline route は intended service-backed public read path として扱い、post route は signed-in member の intended write path として扱う
- moderation-specific write route、operator workflow route、advanced query route はこの parent execution には含めない

## Persistence And Readback Resolution

- backend parent execution は minimum message record persistence と newest-first readback expectation を必須条件として継承する
- successful member post は intended read path で readback できることを backend core completion に含め、local-only fake state による見かけ上の success を completion に含めない
- destructive schema churn より compatibility-preserving behavior を優先し、first slice の post-readback consistency を壊す変更は fail と扱う

## Auth Error And Config Resolution

- guest write reject、invalid payload reject、stable fail-closed error contract は service-side mandatory rule とする
- backend completion は frontend-only blocking に依存せず、service boundary 自体で auth/error が成立していることを前提にする
- secret-backed config は service side only に固定し、public config と private config の分離を保ったまま one-cloud execution path を成立させる

## Completion Signal Resolution

- completion signal は `GET /api/sns/timeline` reachable、`POST /api/sns/posts` reachable、guest write rejected at service boundary、member valid post succeeds through intended write path、invalid payload reject follows stable contract、post-readback consistency observed through intended read path、critical-path success に local-only fallback が残らない、の全充足とする
- frontend integration issue はこの backend completion signal に依存して surface を接続し、validation issue は同じ backend behavior を repeatable evidence で確認する

## Backend Parent Non-Goals Resolution

- moderation dashboard or operator console depth
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- multi-cloud write path or Azure live execution
- production automation depth or provider comparison reopening

# Execution Unit

## Service Route Boundary

- implement GET /api/sns/timeline as the minimum service-backed public read path
- implement POST /api/sns/posts as the minimum service-backed authenticated write path
- do not add moderation-specific write APIs in this first pass
- keep app-facing contract names aligned with the current request/response and auth-error baselines

## Persistence Boundary

- persist the minimum message record needed for timeline readback
- preserve newest-first timeline expectation from the planning chain
- prefer compatibility-preserving data behavior over destructive schema churn
- do not expand into search indexing, edit history, or deep retention tooling in this pass

## Auth And Error Enforcement Boundary

- guest write must fail closed at the service boundary, not only in the UI
- member valid post may succeed through the intended write path
- invalid payload must return the stable error contract rather than implicit success
- uncontrolled server error on the critical path is not an acceptable success surrogate

## Config And Secret Boundary

- keep secret-backed config on the service side only
- preserve public config and private config separation already fixed in the stack split issue
- do not require frontend rollout to guess unready service endpoints
- one cloud execution path is allowed; cloud-neutral app contract naming should remain unchanged

## Completion Signal Candidate

- service-backed GET /api/sns/timeline is reachable and returns the intended baseline shape
- service-backed POST /api/sns/posts accepts member valid post and rejects guest write
- invalid payload rejection follows the stable contract
- post-readback can retrieve the intended persisted record through the read path
- no critical-path success depends on local-only fallback behavior

## Non-Goals

- moderation dashboard or operator console
- operator hide/delete workflow depth
- advanced timeline query, filtering, or search
- replies, reactions, follows, DMs, media upload
- multi-cloud write path or Azure live execution

# Downstream Use

- frontend integration issue should inherit the stable service boundary from this issue
- validation/evidence update issue should use this issue as the source of truth for critical-path backend behavior
- later service hardening should treat this issue as the first executable backend boundary, not the full SNS backend completion

# Process Review Notes

- Issue 135 の first slice contract を backend parent execution に落とし込み、service route、minimum persistence、fail-closed auth/error、config boundary を single execution line として束ねた
- issue-130 の API baseline、issue-131 の security floor、issue-132 の stack split を再議論せずに継承する形に寄せ、backend 側の done line が frontend or validation 側に流出しないよう整理した
- current SNS execution chain では backend parent completion を先に固定し、そのうえで frontend integration と validation evidence が同じ service behavior を参照できる状態に整えた

# Derived Execution Follow-Ups

- docs/portal/issues/issue-139-sns-service-route-and-handler-execution.md
- docs/portal/issues/issue-140-sns-message-persistence-and-readback-execution.md
- docs/portal/issues/issue-141-sns-service-auth-error-and-config-boundary-execution.md

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed execution record

# Dependencies

- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md
- docs/portal/issues/issue-135-sns-first-implementation-slice-contract.md
