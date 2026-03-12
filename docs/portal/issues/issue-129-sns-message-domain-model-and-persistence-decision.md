# Summary

Issue 7 と [docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md](docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md) は、static-first portal の first release では custom API と application persistence を導入しない judgment を固定している。一方、簡易SNSの first release 候補は authenticated write と timeline readback を前提にしており、投稿を扱うなら message record、retention、delete semantics、indexing needs を持たないまま backend and API baseline に進むことはできない。

この issue の役割は storage service を選ぶことではなく、message entity に何を持たせるか、first release でどこまで保存するか、soft delete と operator purge をどの boundary で扱うかを fixed judgment にすることである。

# Goal

簡易SNS向けに message domain model と persistence boundary を reopen する範囲を定義し、message entity、retention、delete semantics、indexing needs、non-goals をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-129
- Title: SNS message domain model and persistence decision を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md accepted as the current SNS auth boundary reference

Objective
- Problem to solve: Issue 7 の no-persistence baseline をそのまま延長すると SNS message write/read model を定義できないが、storage service や schema detail を先に決めると later cloud mapping と implementation order が固定されすぎる
- Expected value: message entity、retention、delete semantics、indexing needs の最小線を fixed judgment にし、後続の backend and API baseline、service stack split、rollback/test baseline issue が同じ data boundary を前提に進める
- Terminal condition: message entity、retention、delete semantics、indexing needs、persistence non-goals が fixed judgment として読め、storage service selection issue を reopen せずに backend and API baseline issue が開始できる

Scope
- In scope: message entity fields、timeline read model assumptions、retention boundary、soft delete versus operator purge semantics、indexing needs、persistence non-goals for first release
- Out of scope: DynamoDB or other storage selection、DDL implementation、migration tooling、backup implementation、cloud resource apply、throughput sizing
- Editable paths: docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: first release message entity の必須 field が明文化されている
- [ ] AC-2: retention と delete semantics が読み取れる
- [ ] AC-3: timeline readback に必要な indexing or ordering needs が明文化されている
- [ ] AC-4: storage selection や implementation detail が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 7 の no-persistence baseline と docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md を historical record として引用しつつ、SNS product and auth boundary で必要になった message record だけを fresh reopening boundary として切り出す
- Alternative rejected and why: storage service selection を同じ issue で進める案は、message semantics より先に infra choice が固定され、later Azure and GCP mapping との portability judgment を縛りやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、message entity、retention、delete semantics、indexing needs、non-goals が issue 単位で読める
- Failure triage path: issue-127 product boundary、issue-128 auth boundary、docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md を照合し、message model、retention、delete semantics、indexing needs のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: message model が広がりすぎて engagement feature や moderation workflow detail まで抱え込むか、逆に narrow すぎて backend and API baseline が再解釈を始めること
- Impact area: data model, API contract, retention policy, rollback planning, later storage mapping
- Mitigation: first release では message create and timeline readback に必要な field と retention semantics のみを fixed judgment にし、attachments、analytics、graph relation、complex search は non-goal に残す
- Rollback: persistence scope が広がりすぎた場合は message entity minimum fields、retention boundary、delete semantics、ordering/indexing need の 4 点だけを残し、storage comparison や moderation audit detail は separate issue へ分離する
```

# Tasks

- [ ] message entity minimum fields を fixed judgment にする
- [ ] retention boundary を fixed judgment にする
- [ ] delete semantics を fixed judgment にする
- [ ] ordering and indexing needs を fixed judgment にする
- [ ] first release persistence non-goals を fixed judgment にする

# Definition of Done

- [ ] SNS 向け persistence reopening が historical no-persistence baseline と矛盾なく説明されている
- [ ] message entity minimum fields が downstream issue で参照できる
- [ ] retention と delete semantics が first release 向けに読める
- [ ] timeline readback 用の ordering and indexing needs が読める
- [ ] storage selection と implementation work が本 issue の out-of-scope として切り分けられている

# Historical Baseline To Preserve

- Issue 7 の first release portal judgment は custom API なし、application persistence なしであり、これは static-first portal baseline の historical record として保持する
- SNS persistence reopening は Issue 7 の否定ではなく、new stored application record が必要になったために fresh planning track で boundary を切り直す作業として扱う
- current portal summary route や static content delivery path に application database を retroactively 混ぜる判断はこの issue の目的ではない

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. first release message record に必須の field は何か
2. timeline readback の ordering と lookup に最低限何が必要か
3. soft delete、hard delete、operator purge をどこまで first release に含めるか
4. moderation-sensitive status を message model にどう残すか
5. storage service choice や advanced search をどこまで non-goal として切るか

# Provisional Direction

- first release message entity は id、actor reference、body、created_at、status、moderation flags を minimum candidate にする
- timeline readback は newest-first ordering を基本にする
- destructive hard delete は default path にせず、soft delete or hidden status を優先候補にする
- operator purge は first release で必要なら exceptional action として扱い、通常 path では hide semantics を基本にする
- attachments、rich profile data、full-text search、analytics aggregation、cross-cloud replicated write model は first release persistence planning の non-goal にする

# Initial Boundary Candidates

## Message Entity Candidate

- message id
- author or actor reference
- body
- created_at timestamp
- visibility or status field
- moderation flag set

## Retention Candidate

- first release should retain posted messages as application records rather than ephemeral client-only state
- retention policy should distinguish normal visible records from hidden or soft-deleted records
- long-term archival or legal-hold policy is out of scope for first release

## Delete Semantics Candidate

- member self-delete is not assumed as the default first release path
- operator hide or soft-delete should be the primary moderation-oriented removal path
- hard delete or purge should remain exceptional and explicitly separated from the normal user flow

## Ordering And Indexing Candidate

- timeline readback requires newest-first ordering by created_at or equivalent monotonic ordering field
- first release should support lookup by message id and chronological listing for the public timeline
- complex search, hashtag indexing, recommendation indexing, and follower-graph indexing are out of scope

## Persistence Non-Goals Candidate

- choosing DynamoDB versus another store
- schema migration tooling detail
- binary media persistence
- analytics warehouse design
- cross-cloud multi-write replication
- advanced search and recommendation storage paths

# Downstream Use

- backend and API baseline issue should inherit the message entity and delete semantics from this issue
- service stack and secret-management boundary update should treat persistence as a stateful service concern separated from the static portal stack
- monitoring, rollback, and test baseline issue should inherit the retention and delete assumptions from this issue

# Current Draft Focus

- Issue 7 を historical record として維持したまま SNS message record に必要な persistence reopening boundary を切る
- storage choice より先に message semantics と retention semantics を固定する
- first release を timeline readback plus authenticated write の narrow scope に抑える

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-07-backend-persistence-decision.md
- docs/portal/09_BACKEND_PERSISTENCE_DRAFT.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
