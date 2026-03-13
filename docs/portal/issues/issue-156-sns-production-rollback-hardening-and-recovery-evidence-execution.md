# Summary

この issue は、issue-155 の production verification 後段として、rollback trigger、post-rollback verification、minimum hardening evidence を execution-ready な単位で固定するためのものである。rollback start reason、restored target、recovery verification result、drift-check result を同じ recovery issue path 上で fail-closed に追跡できる状態を目標とする。

ここで扱うのは rollback-aware recovery evidence と minimum operational hardening line に限定し、broad incident program や automation expansion は non-goal に残す。

# Goal

SNS production-hardening batch 向けに production rollback hardening and recovery evidence execution を定義し、rollback trigger、post-rollback verification、minimum operational hardening note を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-156
- Title: SNS production rollback hardening and recovery evidence execution を整理する
- Requester: repository owner
- Target App: portal-web SNS production recovery and hardening path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-155-sns-production-runtime-config-and-public-verification-execution.md accepted with either completed production verification evidence or an explicit incomplete-verification / maintenance-state handoff recorded on the same issue path

Objective
- Problem to solve: production promotion と public verification が揃っても、rollback trigger、post-rollback verification、minimum hardening note が execution-ready 単位に固定されていないと、incident 時の recovery judgment と drift detection が ad hoc になりやすい
- Expected value: rollback start conditions、post-rollback verification line、minimum production hardening note が同じ reviewable path で読め、recovery judgment を fail-closed に扱える
- Terminal condition: rollback trigger、post-rollback verification、minimum operational hardening line、non-goals が fixed judgment として読め、recovery evidence path を code and ops review へ落とせる

Scope
- In scope: rollback trigger conditions、post-rollback verification、minimum runtime-config drift check、minimum production review note
- Out of scope: automatic remediation orchestration、broad incident command design、new monitoring platform rollout、feature expansion
- Editable paths: docs/portal/issues/issue-156-sns-production-rollback-hardening-and-recovery-evidence-execution.md
- Restricted paths: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md, docs/portal/issues/issue-154-sns-production-promotion-execution.md, docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: rollback trigger conditions が明文化されている
- [ ] AC-2: post-rollback verification boundary が読み取れる
- [ ] AC-3: minimum operational hardening line と drift-check result が recovery issue path に証跡として残る
- [ ] AC-4: broader incident program and automation が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-156-sns-production-rollback-hardening-and-recovery-evidence-execution.md
- Approach: issue-152 の operational hardening minimum line を継承し、issue-155 で固定した public verification path の後段として rollback trigger、post-rollback verification、minimum hardening note を separate execution unit に整理する
- Alternative rejected and why: rollback/hardening を production promotion issue に含める案は pre-deploy gate と post-deploy recovery judgment が混線し、done line が広がりすぎるため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、rollback trigger、post-rollback verification、minimum hardening line、drift-check result が recovery issue path に証跡として残ること、non-goals が issue 単位で読める
- Failure triage path: issue-152、issue-154、issue-155 と historical rollback references を照合し、rollback trigger、verification line、drift check、non-goals のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: hardening issue が broad incident program や monitoring expansion を吸収するか、逆に narrow すぎて rollback verification と drift check を含まないまま recovery-ready 扱いになること
- Impact area: recovery clarity, operator response, production drift detection
- Mitigation: issue は rollback trigger、post-rollback verification、minimum hardening note に限定し、automation depth や broader incident design は non-goal に残す
- Rollback: scope が広がりすぎた場合は rollback trigger、post-rollback verification、runtime-config drift check の 3 点だけを残し、alerting or automation expansion は separate issue に分離する
```

# Tasks

- [ ] rollback trigger conditions を fixed judgment にする
- [ ] post-rollback verification を fixed judgment にする
- [ ] minimum hardening line を fixed judgment にする
- [ ] drift check boundary を fixed judgment にする
- [ ] non-goals を明文化する

# Definition of Done

- [ ] rollback を開始する trigger 条件を読める
- [ ] post-rollback verification line を読める
- [ ] minimum runtime-config drift check result と production review note が recovery issue path に証跡として残る
- [ ] rollback target reference と recovery evidence が同じ issue path に残る形を読める
- [ ] promotion and public verification issue と混線せず読める
- [ ] broader incident program and automation が non-goal として切り分けられている

# Recovery Baseline

production recovery evidence は issue-154 の promotion record と issue-155 の public verification record を前提にしつつ、historical rollback baseline の fail-closed discipline を引き継ぐ。

- rollback target should remain the staging-validated last-known-good artifact or deployment target rather than a fresh rebuild candidate
- rollback evidence should stay tied to the same promotion chain that named the production candidate and rollback target reference
- issue-156 should not start from an implicit verification gap; issue-155 must already record either completed verification or an explicit incomplete-verification, containment, or maintenance posture on the same issue path
- post-rollback verification remains an operator-reviewed discipline rather than a claim of fully automated recovery
- DNS reversal detail, full incident command flow, and automation expansion remain outside this issue even when they are referenced as upstream prerequisites

# Execution Unit

## Rollback Trigger Boundary

- rollback trigger candidates should include repeated write failure, timeline read failure, runtime-config drift, or incompatible production data-path change
- rollback should not require re-deriving the candidate or target during incident response
- trigger conditions should stay narrow enough to support operator judgment without turning into a full incident matrix

## Trigger Classification Boundary

- trigger candidates should stay classified by recovery relevance: major route failure, wrong content delivery, runtime-config drift, persisted-write failure, or incompatible data-path change
- security-relevant secret exposure should be recorded as a recovery-start signal that may require rotate-and-invalidate priority before normal feature restoration
- failed verification does not automatically imply rollback, but the issue should make clear which signals are strong rollback-start candidates versus cases that stay at containment or handoff

## Post-Rollback Verification Boundary

- post-rollback verification should include guest read, guest write reject, and the declared runtime marker posture after recovery
- when member-write verification is part of the promoted path, the recovery check should confirm that persisted success state has returned or that a declared maintenance posture is active
- rollback verification should fail closed when runtime markers and visible behavior disagree after recovery

## Recovery Evidence Record Boundary

- rollback target reference, rollback start reason, and post-rollback verification result should be recorded on the same issue path rather than split across separate notes
- the recovery record should be sufficient to reconstruct which target was restored, which trigger started recovery, and which host or routes were rechecked after recovery
- when rollback is not executed, the issue should still distinguish between recovered state, containment-only state, and explicit maintenance posture rather than implying successful recovery
- if issue-155 ended in incomplete verification, the recovery record should restate that handoff state explicitly before claiming any restored or maintenance posture

## Minimum Hardening Line

- runtime-config drift checks should remain reviewable after promotion and after rollback
- minimum production review notes should capture the checks needed to detect read failure, write failure, and config drift without expanding into a new monitoring program
- issue completion should require the drift-check result and minimum production review note to be recorded on the same recovery issue path
- deeper alert fan-out, automatic remediation, and broader incident coordination remain separate follow-up scope

## Recovery Verification Methods Candidate

- HTTP or curl-style probes may confirm route reachability, declared runtime marker posture, and basic recovery status on the production host
- browser verification may confirm visible recovery markers or persisted-success restoration when HTTP probes alone cannot distinguish recovered state from stale shell behavior
- post-rollback verification should reuse the same promoted host family and major SNS route set established in the production verification issue unless a declared maintenance posture narrows the surface intentionally

## Fail Conditions Candidate

- rollback target cannot be named from the previously recorded promotion evidence path
- rollback start reason is not captured, making the recovery decision non-auditable
- post-rollback verification does not confirm runtime marker posture and visible SNS behavior on the restored host
- recovered state cannot be distinguished from containment-only or stale frontend shell behavior
- minimum runtime-config drift checks are absent after rollback or contradict the visible recovery result

## Non-Goals

- automatic remediation orchestration
- broad incident command design
- new monitoring platform rollout
- feature expansion

# Current Status

- local draft created as the third derived execution issue from issue-152
- draft wording requires either completed production verification evidence or an explicit incomplete-verification / maintenance-state handoff before the recovery issue can start
- current issue wording follows the historical production rollback baseline: last-known-good target, same evidence path, operator-reviewed post-rollback verification, and recorded drift-check evidence
- this child split is still blocked pending explicit human confirmation and GitHub issue creation; do not treat this file as an accepted execution issue yet
- GitHub Issue: not created in this task
- Sync Status: local-only draft, hold for publication

# Historical References

- docs/portal/issues/issue-14-rollback-policy.md
- docs/portal/issues/issue-35-production-rollback-target-baseline.md

# Dependencies

- docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md
- docs/portal/issues/issue-154-sns-production-promotion-execution.md
- docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md
