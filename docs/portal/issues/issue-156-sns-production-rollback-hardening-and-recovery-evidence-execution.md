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
- [x] AC-1: rollback trigger conditions が明文化されている
- [x] AC-2: post-rollback verification boundary が読み取れる
- [x] AC-3: minimum operational hardening line と drift-check result が recovery issue path に証跡として残る
- [x] AC-4: broader incident program and automation が non-goals として切り分けられている

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

- [x] rollback trigger conditions を fixed judgment にする
- [x] post-rollback verification を fixed judgment にする
- [x] minimum hardening line を fixed judgment にする
- [x] drift check boundary を fixed judgment にする
- [x] non-goals を明文化する

# Definition of Done

- [x] rollback を開始する trigger 条件を読める
- [x] post-rollback verification line を読める
- [x] minimum runtime-config drift check result と production review note が recovery issue path に証跡として残る
- [x] rollback target reference と recovery evidence が同じ issue path に残る形を読める
- [x] promotion and public verification issue と混線せず読める
- [x] broader incident program and automation が non-goal として切り分けられている

# Fixed Judgment

## Recovery Execution Rationale

- Issue 154 の promotion record と Issue 155 の public verification line の後段として、rollback trigger、post-rollback verification、minimum hardening note を separate recovery child execution unit に固定する
- この issue は broad incident command design や automation expansion を始めるものではなく、rollback-aware recovery evidence と runtime-config drift discipline を narrow に確定する execution record である

## Trigger And Verification Resolution

- rollback trigger candidates は repeated write failure、timeline read failure、runtime-config drift、incompatible production data-path change、security-relevant secret exposure を recovery-start signals として読む line に固定する
- post-rollback verification は guest read、guest write reject、declared runtime marker posture、member-write scope 時の recovered or maintenance posture distinction を minimum line に固定する
- recovered state、containment-only state、explicit maintenance posture は同じ recovery issue path 上で区別して残す

## Hardening And Drift Resolution

- minimum hardening line は runtime-config drift check、read failure and write failure detection の production review note、rollback target reference と recovery evidence の同一記録 path に固定する
- rollback is not executed の場合でも、handoff or containment state と drift-check result を記録し、implicit recovery success を作らない
- deeper alert fan-out、automatic remediation、broader incident coordination は this issue の done line に含めない

## Recovery Non-Goals Resolution

- automatic remediation orchestration
- broad incident command design
- new monitoring platform rollout
- feature expansion

# Process Review Notes

- historical rollback baseline を production SNS child split に移し替え、rollback start reason、restored target、post-rollback verification、drift check を同じ evidence path で読む構造に固定した
- Issue 155 が incomplete verification or maintenance posture に落ちた場合でも、この issue が recovered state と handoff state を混同しないよう fail-closed wording を補強した
- parent production-hardening contract から incident program 全体を切り離し、minimum recovery and hardening line だけを child execution record で閉じた

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

- local fixed judgment recorded
- local fixed execution record published as the third derived execution issue from issue-152
- draft wording requires either completed production verification evidence or an explicit incomplete-verification / maintenance-state handoff before the recovery issue can start
- current issue wording follows the historical production rollback baseline: last-known-good target, same evidence path, operator-reviewed post-rollback verification, and recorded drift-check evidence
- this child split is now the accepted GitHub-tracked execution queue entry for the production rollback and recovery evidence boundary
- GitHub Issue: #151
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/151
- Sync Status: synced to GitHub as open fixed execution issue

# Historical References

- docs/portal/issues/issue-14-rollback-policy.md
- docs/portal/issues/issue-35-production-rollback-target-baseline.md

# Dependencies

- docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md
- docs/portal/issues/issue-154-sns-production-promotion-execution.md
- docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md
