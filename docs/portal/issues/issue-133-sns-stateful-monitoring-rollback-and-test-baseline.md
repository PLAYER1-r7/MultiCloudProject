# Summary

Issue 12、Issue 13、Issue 14 は public-first static portal 向けに monitoring、test、rollback の基線を閉じている。一方、簡易SNS の first implementation slice は authenticated write、service-backed read、message persistence を持つため、static-only failure mode では coverage が不足する。次に必要なのは、既存の static-first baseline を壊さずに auth/API/database failure mode を追加し、stateful service を含む first release operational baseline として fixed judgment にすることである。

この issue の役割は監視製品や test framework を選ぶことではなく、SNS の first stateful slice で必須となる health signal、critical-path test、rollback trigger、post-rollback verification を fixed judgment にすることである。

# Goal

簡易SNS向けに stateful monitoring, rollback, and test baseline を定義し、auth/API/database を含む failure mode、critical-path verification、rollback judgment、evidence path をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-133
- Title: SNS stateful monitoring, rollback, and test baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-132-sns-service-stack-and-secret-management-boundary-update.md accepted as the current stack split reference

Objective
- Problem to solve: static-first baseline のままでは SNS の authenticated write、service API failure、database or persistence drift、secret-backed service outage を release judgment と recovery judgment に接続できず、implementation slice が fail-open に進みやすい
- Expected value: Issue 12、Issue 13、Issue 14 の baseline を SNS stateful path へ拡張し、health signal、test critical path、rollback trigger、post-rollback verification を同じ judgment で扱える
- Terminal condition: auth/API/database failure mode を含む monitoring baseline、test baseline、rollback baseline が fixed judgment として読め、first implementation slice contract が運用前提を再解釈せずに開始できる

Scope
- In scope: stateful health signal、API and auth critical-path tests、persistence-aware rollback trigger、post-rollback verification、evidence and owner path、first release non-goals
- Out of scope: actual monitoring tool implementation、test framework selection、dashboard construction、automated rollback orchestration、database product choice、incident staffing design
- Editable paths: docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: auth/API/database を含む first release monitoring signal が明文化されている
- [x] AC-2: SNS critical-path test baseline が pre-deploy and post-deploy の両方で読み取れる
- [x] AC-3: rollback trigger と post-rollback verification が stateful failure mode を含めて明文化されている
- [x] AC-4: tool choice や automation detail が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 12、Issue 13、Issue 14 の static-first baseline と、Issue 128 から Issue 132 の SNS boundary を束ね、stateful SNS path 向けの monitoring/test/rollback fixed judgment を fresh baseline issue として整理する
- Alternative rejected and why: monitoring product、test runner、or rollback workflow implementation を同じ issue で進める案は、failure mode judgment より先に tool detail が固定され、implementation slice より重い planning issue になりやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、stateful signal、critical-path test、rollback trigger、post-rollback verification、non-goals が issue 単位で読める
- Failure triage path: issue-130 API baseline、issue-131 security baseline、issue-132 stack split、issue-12 monitoring、issue-13 test、issue-14 rollback を照合し、signal/test/recovery のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: stateful baseline が broad すぎて full incident program を抱え込むか、逆に narrow すぎて auth/API/database failure を static route check に押し込めること
- Impact area: release gate, service readiness, operator recovery judgment, test evidence, future production runbook
- Mitigation: first release では timeline read、post create、auth reject、service error、persistence restore を中心にし、dashboard depth、provider alerting、automatic rollback は non-goal に残す
- Rollback: scope が広がりすぎた場合は monitoring signal、critical-path test、rollback trigger、post-rollback verification の 4 点だけを残し、tooling and automation detail は separate issue へ分離する
```

# Tasks

- [x] stateful monitoring signal を fixed judgment にする
- [x] SNS critical-path test baseline を fixed judgment にする
- [x] stateful rollback trigger を fixed judgment にする
- [x] post-rollback verification and evidence path を fixed judgment にする
- [x] first release non-goals を fixed judgment にする

# Definition of Done

- [x] auth/API/database failure mode を含む monitoring baseline が downstream issue で参照できる
- [x] pre-deploy and post-deploy の SNS critical-path test が読める
- [x] rollback trigger と operator judgment が stateful failure mode を含めて読める
- [x] post-rollback verification が API/auth/persistence path まで含めて読める
- [x] tooling choice と automation detail が本 issue の out-of-scope として切り分けられている

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. stateful SNS で first release monitoring signal に追加すべき failure mode は何か
2. pre-deploy と post-deploy で最低限確認すべき SNS critical path は何か
3. rollback 開始候補と release stop 条件をどう切り分けるか
4. stateful rollback 後にどこまで復旧確認するか
5. monitoring/test/rollback のどこまでを tooling 非依存の contract として固定するか

# Provisional Direction

- monitoring baseline は static reachability に加えて auth reject、write failure、timeline read failure、service availability、persistence recovery evidence を扱う
- test baseline は guest read、member write、invalid payload reject、post-readback consistency を critical path とする
- rollback baseline は artifact restore だけでなく service config rollback、known-good schema or data-compatibility judgment、secret rotation path を含む
- post-rollback verification は route reachability に加えて API health、auth boundary、timeline read、member post failure absence を確認する
- first release では provider-native alert product、deep load testing、automatic rollback orchestration は non-goal にする

# Fixed Judgment

## Stateful Ops Rationale

- Issue 12、Issue 13、Issue 14 の static-first baseline は historical record として維持しつつ、SNS first stateful slice に必要な auth/API/persistence failure mode を追加する narrow planning boundary として扱う
- この issue は monitoring vendor、test framework、automation product を選ぶものではなく、release gate と recovery judgment が参照すべき stateful signal、critical-path test、rollback trigger、post-rollback verification を固定する
- static reachability だけが green でも SNS stateful path が broken なら release-ready と扱わないことを明示する

## Monitoring Signal Resolution

- first release monitoring baseline は public route reachability に加えて `GET /api/sns/timeline` availability、member write path success or stable fail-closed error、guest write reject、invalid payload reject、service-side error visibility、persistence restore evidence を mandatory signal とする
- auth boundary break、repeated write failure、repeated timeline read failure、secret-backed service outage は static page health とは別の stateful blocker として扱う
- signal naming や dashboard implementation は後続 issue に委ねるが、監視対象の failure mode 自体はこの issue の contract として固定する

## Critical-Path Test Resolution

- pre-deploy baseline は request/response contract validation、auth-error contract validation、SNS surface reachability の 3 つを minimum gate とする
- post-deploy baseline は guest timeline read、guest write reject、member valid write、member invalid payload reject、post-readback consistency を minimum critical path とする
- production readiness と staging completion は stateful critical-path failure が 1 件でも残る場合に block される

## Rollback Trigger Resolution

- rollback trigger candidate は repeated write failure、repeated timeline read failure、auth boundary break、data-compatibility break、secret-backed service misconfiguration に固定する
- rollback action は artifact restore だけでなく service config restore、known-good compatibility judgment、secret rotation or invalidation を含み得る
- database-destructive rollback は default path にせず、compatibility-preserving restore または hide/fail-closed posture を優先する

## Post-Rollback Verification And Evidence Resolution

- post-rollback verification minimum は public route reachability、guest timeline read success、guest write reject、member valid write success or intentional maintenance disable、post-readback consistency、critical path 上の uncontrolled server error absence とする
- evidence path は informal local note ではなく staging-oriented execution evidence を正規経路とし、owner と verification responsibility を同じ operator path で追えるようにする
- rollback success は static page recovery だけでは足りず、API/auth/persistence path まで復旧確認できたときに成立する

## First Release Stateful Ops Non-Goals Resolution

- monitoring vendor selection
- load-test product selection
- dashboard construction
- automatic rollback orchestration
- provider-native alerting detail
- 24x7 on-call staffing design

# Initial Boundary Candidates

## Monitoring Candidate

- public route reachability remains mandatory
- GET timeline availability and expected non-error response remain mandatory
- member write path success or stable fail-closed error remains mandatory
- guest write reject and invalid payload reject remain mandatory security signals
- service-side error visibility and persistence restore evidence should be reviewable on the same operator path

## Test Candidate

- pre-deploy: contract validation for request/response and auth error surface
- pre-deploy: module or route-level checks that the SNS surface is still reachable and wired to the expected contract
- post-deploy: guest timeline read, guest write reject, member valid write, member invalid payload reject, post-readback consistency
- production readiness should treat stateful critical-path failure as a blocker even if static pages remain reachable

## Rollback Candidate

- rollback trigger candidates: repeated write failure, repeated timeline read failure, auth boundary break, data-compatibility break, secret-backed service misconfiguration
- rollback may require artifact restore, service config restore, or secret rotation/invalidation depending on failure class
- database-destructive rollback is not the default path; prefer compatibility-preserving restore or hide/fail-closed posture first

## Post-Rollback Verification Candidate

- confirm public route reachability
- confirm GET timeline works for guest
- confirm guest write remains rejected
- confirm member valid write succeeds or is intentionally disabled by declared maintenance posture
- confirm post-readback consistency and absence of uncontrolled server error on the critical path

## Non-Goals Candidate

- choosing a monitoring vendor now
- choosing a load test product now
- implementing dashboards now
- implementing automatic rollback orchestration now
- defining 24x7 on-call staffing now

# Downstream Use

- first implementation slice contract should inherit the stateful critical path and recovery judgment from this issue
- future CI/CD or deploy issue should inherit the pre-deploy and post-deploy SNS verification sequence from this issue
- future runbook work should inherit rollback trigger and post-rollback verification from this issue without reopening API or auth boundary

# Process Review Notes

- Issue 12、Issue 13、Issue 14 の static-first baseline を historical record として保持したまま、SNS stateful path に必要な monitoring/test/rollback contract だけを narrow scope で固定した
- issue-130 の API boundary、issue-131 の security floor、issue-132 の stack split と整合するよう、guest read、member write、invalid payload reject、post-readback consistency を stateful critical path に揃えた
- current SNS planning chain では tooling choice より failure mode、rollback trigger、post-rollback verification の固定を優先し、execution issue が同じ operational contract を参照できる状態に整えた

# Current Draft Focus

- static-first baseline を壊さずに stateful SNS failure mode を fixed judgment として追加した
- auth/API/database critical path を release blocker と recovery judgment に接続した
- tooling choice より先に operational contract を固定した

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed planning record

# Dependencies

- docs/portal/issues/issue-12-monitoring-policy.md
- docs/portal/issues/issue-13-test-strategy.md
- docs/portal/issues/issue-14-rollback-policy.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
