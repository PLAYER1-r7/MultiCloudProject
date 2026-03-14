# Summary

この issue は、issue-154 で固定した promoted production candidate に対して、runtime-config marker と public behavior verification を execution-ready な単位で固定するためのものである。production deploy success を前提に、same-issue-path discipline のまま runtime marker verification、major SNS route verification、persisted-success distinction を fail-closed に判定できる状態を目標とする。

ここで扱うのは promoted production surface の public verification に限定し、promotion source freeze のやり直しや rollback / broader hardening は後続または前段 issue に残す。

# Goal

SNS production-hardening batch 向けに production runtime-config and public verification execution を定義し、runtime marker verification、major SNS surface verification、persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-155
- Title: SNS production runtime-config and public verification execution を整理する
- Requester: repository owner
- Target App: portal-web SNS production public surface
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-154-sns-production-promotion-execution.md accepted as the current production promotion execution reference

Objective
- Problem to solve: production promotion が成立しても、public surface が intended runtime mode、service target posture、guest/member behavior を reviewable に示せないと、production completion judgment が ad hoc になりやすい
- Expected value: promoted production surface が runtime-config marker と major SNS behavior の両方で reviewable になり、stale config や frontend-only success state を fail-closed に区別できる
- Terminal condition: runtime marker verification、major SNS surface verification、persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback、non-goals が fixed judgment として読め、public verification path を code and review evidence へ落とせる

Scope
- In scope: production runtime marker verification、major SNS surface verification、guest read and guest write reject verification、persisted-success distinction when member write is in scope、incomplete verification 時の deploy-ready / handoff fallback
- Out of scope: production candidate selection、rollback target declaration、deeper monitoring fan-out、feature expansion
- Editable paths: docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md
- Restricted paths: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md, docs/portal/issues/issue-154-sns-production-promotion-execution.md, docs/portal/issues/issue-156-sns-production-rollback-hardening-and-recovery-evidence-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: production runtime marker verification boundary が明文化されている
- [x] AC-2: major SNS surface verification と guest read/write policy verification が読み取れる
- [x] AC-3: persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback、fail conditions が読み取れる
- [x] AC-4: promotion-source freeze and deeper monitoring が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md
- Approach: issue-152 の public verification boundary を継承し、issue-154 で固定した promoted path に対する runtime marker と public behavior verification を separate execution unit として整理する
- Alternative rejected and why: runtime marker verification を rollback/hardening issue に含める案は public completion signal と recovery discipline が混線するため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、runtime marker verification、major SNS surface verification、persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback、non-goals が issue 単位で読める
- Failure triage path: issue-152、issue-154、issue-150、issue-151 を照合し、runtime marker、public behavior、persisted-success distinction、fail conditions のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: verification issue が広がって promotion source freeze や deeper monitoring を吸収するか、逆に narrow すぎて stale config と frontend-only success state を区別できないこと
- Impact area: production verification quality, public-surface trust, regression detection
- Mitigation: issue は runtime marker verification、major SNS surface verification、persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback に限定し、deploy source freeze と hardening follow-up は separate issue に残す
- Rollback: scope が広がりすぎた場合は runtime marker verification、major SNS surface verification、persisted-success distinction、incomplete verification 時の deploy-ready / handoff fallback の 4 点だけを残し、hardening or incident depth は separate issue に分離する
```

# Tasks

- [x] runtime marker verification を fixed judgment にする
- [x] major SNS surface verification を fixed judgment にする
- [x] persisted-success distinction を fixed judgment にする
- [x] incomplete verification 時の deploy-ready / handoff fallback を fixed judgment にする
- [x] fail conditions を fixed judgment にする
- [x] non-goals を明文化する

# Definition of Done

- [x] intended SNS runtime mode と service target posture を public surface 上で読める
- [x] major SNS surface integrity と guest read/write policy を読める
- [x] member write が in scope の場合に persisted success と frontend-only success state を区別できる
- [x] deploy evidence と public verification evidence が同じ issue path に残る形を読める
- [x] public verification が incomplete の場合に completed production reflection ではなく deploy-ready または handoff wording に落ちる形を読める
- [x] promotion source freeze and deeper monitoring と混線せず読める
- [x] feature expansion が non-goal として切り分けられている

# Fixed Judgment

## Public Verification Rationale

- Issue 154 で fixed した production promotion candidate を browser-facing completion line まで閉じるため、この issue で runtime marker verification と major SNS public behavior verification を separate child execution unit に固定する
- この issue は promotion source freeze や rollback hardening を再定義するものではなく、promoted production surface が intended runtime posture を public host 上で fail-closed に示せるかを narrow に確定する execution record である

## Runtime Marker And Surface Resolution

- public verification は promoted production host 上で intended SNS runtime mode、service base URL posture、major SNS route reachability を確認する line に固定する
- guest read availability と guest write fail-closed policy は major SNS surface verification の minimum line に固定する
- runtime marker と visible behavior が disagreement を起こす場合は success を主張せず fail closed とする

## Persisted Success And Fallback Resolution

- member write が in scope の場合、verification は persisted success と frontend-only success state を distinguish できる line に固定する
- deploy evidence と public verification evidence は同じ issue path に残し、production deploy success だけで completed production reflection を主張しない
- public verification が incomplete の場合は deploy-ready or handoff wording に落とし、false completed state を作らない

## Verification Non-Goals Resolution

- production candidate selection
- rollback target declaration
- deeper monitoring fan-out
- feature expansion

# Process Review Notes

- Issue 154 の promoted production path から post-deploy public verification responsibility だけを切り出し、runtime marker、major SNS route、persisted-success distinction を same-issue-path discipline で固定した
- incomplete verification 時に completed wording へ流れないよう、deploy-ready or handoff fallback を execution record の fail-closed rule として明文化した
- later rollback and hardening path が同じ production host family を参照できるよう、public verification evidence の最小境界を parent-child 関係に沿って閉じた

# Public Verification Baseline

public verification は issue-154 で固定した promoted production candidate を前提にし、deploy evidence と browser-facing verification を同じ execution path に束ねる。

- production public verification should start only after the promoted candidate is identified by commit SHA, build run id, matching staging evidence, and a successful production deploy run for that same candidate
- if public verification starts, deploy evidence and public verification evidence must stay on the same issue path rather than being split into separate local notes
- if production deploy succeeds but public verification remains incomplete, the issue must fall back to deploy-ready or handoff wording rather than claiming completed production reflection
- verification scope may stay limited to the declared major SNS routes, while non-SNS shared-route coverage remains delegated to earlier local baseline validation

# Execution Unit

## Runtime Marker Boundary

- public verification should confirm the intended SNS runtime mode and service base URL markers after promotion
- runtime markers should fail closed when the public surface still reflects stale or ambiguous defaults
- runtime marker review should remain tied to the promoted production host rather than local preview evidence
- runtime marker review should verify the production host resolves the promoted runtime-config surface rather than stale build-time defaults

## Verification Surface Boundary

- the default public verification surface should include the top-level SNS route plus any major SNS sub-routes required to prove the promoted flow
- verification may stay narrow like prior public-route execution records: major route reachability first, deeper shared-route coverage deferred to earlier local baseline evidence
- browser-facing runtime markers, completion markers, and error markers should be checked on the same promoted host used for deploy evidence

## Public Behavior Boundary

- major SNS surface integrity should include reachability for the top-level SNS path and the same visible completion or error markers reviewed in staging
- guest read should remain available and guest write should remain fail-closed on the promoted path
- when member posting is part of scope, verification should prove persisted success rather than transient frontend-only success

## Evidence Record Boundary

- the issue record should name the promoted commit SHA, production deploy run, and the public verification result on the same path
- public verification evidence should be sufficient to reconstruct which host, which routes, and which runtime markers were checked
- when browser automation is used, the record should preserve which markers were asserted rather than claiming generic browser success

## Verification Methods Candidate

- HTTP or curl-style probes may confirm route reachability and runtime-config exposure on the promoted production host
- browser automation may confirm visible runtime markers, host markers, route markers, and persisted-success distinction when those cannot be proven from HTTP probes alone
- member-write verification is conditional: use it only when the promoted batch includes that public write path and when the evidence can distinguish persisted success from frontend-only success state

## Fail Conditions Candidate

- public surface does not expose the intended SNS runtime mode or service target posture
- production deploy for the named candidate has not succeeded or cannot be tied to the same promoted batch as the public verification record
- guest read, guest write reject, or major SNS surface integrity cannot be verified repeatably
- member-write verification, when required, cannot distinguish persisted success from stale frontend-only state
- public verification claims success while runtime markers and visible behavior disagree
- deploy evidence and public verification evidence point to different promoted batches or different public hosts
- verification covers only a generic shell and does not prove the declared SNS route behavior on the promoted host

## Non-Goals

- production candidate selection
- rollback target declaration
- deeper monitoring fan-out
- feature expansion

# Current Status

- local fixed judgment recorded
- local draft created as the second derived execution issue from issue-152
- draft wording requires successful production deploy evidence for the named candidate before public verification can start, and preserves same issue path / same rollout batch discipline
- current issue wording follows the same narrow major-route proof used by earlier portal live-reflection records while adding explicit deploy-ready or handoff fallback for incomplete verification
- this child split is still blocked pending explicit human confirmation and GitHub issue creation; do not treat this file as an accepted execution issue yet
- GitHub Issue: not created in this task
- Sync Status: local fixed execution record, hold for publication

# Dependencies

- docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md
- docs/portal/issues/issue-154-sns-production-promotion-execution.md
- docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md
- docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md
