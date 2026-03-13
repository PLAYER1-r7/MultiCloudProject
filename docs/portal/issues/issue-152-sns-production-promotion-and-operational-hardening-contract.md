# Summary

Issue 148 から Issue 151 までで、simple SNS の next slice は staging-reviewed complete に到達し、Terraform-managed Lambda Function URL plus DynamoDB の stateful backend が reviewed staging path として成立した。次に必要なのは、この completed staging slice を historical execution record として残したまま、production-safe promotion boundary、post-promotion verification、runtime-configuration guardrail、rollback-aware operational hardening を fresh contract として切り出すことである。

この issue の役割は SNS product scope を広げることではなく、stateful staging backend を production-ready path へ進めるための narrow next batch を fixed judgment として整理し、以後の production execution や hardening follow-up が同じ done line を参照できるようにすることである。

# Goal

stateful staging backend completion の次段として、SNS production promotion and operational hardening batch の deliverable、dependency order、verification boundary、rollback posture、non-goals をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-152
- Title: SNS production promotion and operational hardening contract を整理する
- Requester: repository owner
- Target App: portal-web SNS surface and production delivery path
- Environment: planning
- Priority: high
- Predecessor: issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md accepted as the current staging-complete reference

Objective
- Problem to solve: staging-reviewed complete まで到達しても、production promotion boundary、production-safe runtime configuration、post-promotion verification、rollback-aware hardening path が fresh issue として未固定のままだと、production reflection と運用 hardening が ad hoc に広がりやすい
- Expected value: staging-complete SNS backend を historical baseline として残しつつ、production promotion criteria、verification path、runtime guardrail、rollback-aware operational hardening を narrow next batch として固定し、後続 execution issue が同じ entry condition と exit condition を参照できる
- Terminal condition: production batch deliverable、dependency order、verification boundary、rollback posture、non-goals が fixed judgment として読め、execution-ready issue を起こせる

Scope
- In scope: production promotion gate、production runtime overlay guardrail、post-promotion public verification、rollback-aware operational hardening boundary、evidence shape、next-batch non-goals
- Out of scope: auth reopening、new SNS product features、moderation depth expansion、multi-cloud write path、Azure live implementation、automatic remediation program
- Editable paths: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: production promotion batch の minimum deliverable が app behavior and evidence 単位で明文化されている
- [ ] AC-2: promotion gate、verification path、rollback posture、operational hardening boundary の dependency order が読み取れる
- [ ] AC-3: production runtime-config guardrail と public verification boundary が completion signal と結び付いている
- [ ] AC-4: new SNS feature expansion や Azure work が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: issue-148 through issue-151 の completed staging slice を継承し、production-safe promotion criteria、verification boundary、runtime-config guardrail、rollback-aware hardening path を fresh next-batch contract として整理する
- Alternative rejected and why: issue-148 through issue-151 を reopen する案は reviewed staging completion line と production hardening line を混線させるため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、deliverable、dependency order、verification boundary、rollback posture、non-goals が issue 単位で読める
- Failure triage path: issue-148 through issue-151、docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md、docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md を照合し、promotion gate、verification、rollback、hardening scope のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: batch が広がりすぎて new product scope や auth expansion を含み始めるか、逆に narrow すぎて production verification と rollback posture を含まないまま done 扱いになること
- Impact area: production readiness, delivery governance, rollback discipline, evidence quality
- Mitigation: batch は production promotion gate、runtime overlay guardrail、public verification、rollback-aware hardening に限定し、feature expansion は non-goal に残す
- Rollback: scope が広がりすぎた場合は production gate、public verification、rollback posture、hardening checklist の 4 点だけを残し、feature work や deeper automation は separate issue へ分離する
```

# Tasks

- [ ] production batch deliverable を fixed judgment にする
- [ ] promotion gate and dependency order を fixed judgment にする
- [ ] public verification and runtime-config guardrail を fixed judgment にする
- [ ] rollback-aware hardening boundary を fixed judgment にする
- [ ] next-batch non-goals を明文化する

# Definition of Done

- [ ] production promotion に必要な source build、staging verification、runtime-config guardrail が読める
- [ ] public verification boundary と rollback posture が読める
- [ ] post-promotion operational hardening の minimum line が読める
- [ ] completed staging slice と fresh production batch が混線せず読める
- [ ] auth/product expansion、multi-cloud write、Azure implementation が non-goals として切り分けられている

# Batch Intent

- preserve issue-148 through issue-151 as a completed staging backend slice
- promote the reviewed SNS backend through a production-safe and rollback-aware path
- harden the runtime overlay and verification discipline without reopening product-scope debates

# Promotion Input Baseline

production promotion の entry condition は、completed staging slice から次の reviewable inputs を引き継げることに置く。

- reviewed staging backend shape remains Lambda Function URL plus DynamoDB timeline persistence rather than the removed App Runner diagnostic path
- reviewed staging deploy evidence remains `portal-staging-deploy` run `23041594174`
- reviewed staging review evidence remains `portal-sns-staging-review` run `23041628020`
- post-merge mainline confirmation remains `portal-build` run `23064520097` and downstream `portal-staging-deploy` run `23064537933`
- production batch must either reuse that reviewed service-backed shape or explicitly record why a different production-safe target is required before execution starts

# Provisional Direction

- next batch の completion line は production deployment using the reviewed service-backed path、public verification of the SNS runtime markers、and rollback-aware operational posture に置く
- production should keep fail-closed runtime-config validation and explicit service-mode declaration rather than silently inheriting ambiguous defaults
- public verification should prove that the production surface exposes the intended SNS runtime configuration and does not regress guest read or write-surface signaling
- post-promotion hardening should stay narrow: reviewable runtime config, rollback reference freshness, and minimum operational checklist depth
- auth reopening、feature expansion、multi-cloud write、Azure execution は follow-on に残す

# Deliverable Boundary

next batch の minimum deliverable は次の通りとする。

- production deployment can promote the reviewed build/staging candidate with explicit SNS runtime overlay inputs and a declared source evidence chain
- production runtime config advertises the intended SNS mode, base URL, persistence mode, and write-surface flag in a fail-closed shape
- public verification can confirm the deployed SNS runtime markers plus major SNS route integrity after promotion
- rollback posture includes a declared last-known-good target reference, rollback trigger conditions, and a post-rollback verification line
- operational follow-up captures only the minimum hardening needed to keep the production path reviewable and drift-resistant

# Public Verification Boundary

production public verification は browser-facing completion signal を narrow に保つため、最低でも次を確認対象にする。

- public surface exposes the intended SNS runtime mode and service base URL markers without falling back to ambiguous defaults
- major SNS surface integrity remains intact on the promoted production host, including reachability for the top-level SNS path and the same completion or error markers reviewed in staging
- guest read remains available, guest write remains fail-closed, and the write-surface policy shown on the page matches the promoted runtime config
- when member posting is part of the promoted path, public verification must distinguish persisted success from stale frontend-only success state

# Operational Hardening Minimum Line

post-promotion hardening は production rollout の done line を広げすぎないよう、最低限次だけを含む。

- runtime overlay inputs stay reviewable in GitHub environment or equivalent approved config source and are not silently inherited from stale defaults
- rollback target reference stays fresh enough that the operator can name the exact revert target without re-deriving it during incident response
- monitoring or review notes capture the minimum production checks needed to detect read failure, write failure, or runtime-config drift after promotion
- deeper alert fan-out, automatic remediation, and broader incident automation remain separate follow-up scope

# Dependency Order Candidate

1. freeze the production promotion input contract from the reviewed build and staging evidence
2. validate production runtime overlay inputs, runtime-config generation path, and service target declaration before deploy
3. name the explicit rollback target reference and rollback trigger conditions before production execution
4. execute production promotion with the reviewed service-backed path and declared config inputs
5. verify public runtime markers, major SNS surface integrity, and rollback-aware operator checks after promotion
6. record rollback-aware operational hardening follow-up only after the promoted path is stable

# Completion Signal Candidate

next batch is complete when the following all hold.

- production promotion uses a reviewed build run and a matching reviewed staging deploy and review chain
- production runtime-config overlay is explicit, validated, and reviewable on the public surface
- public verification confirms the intended SNS mode, service target posture, and major SNS surface integrity after promotion
- rollback target reference, rollback trigger conditions, and post-rollback verification line are documented in the same evidence path
- the resulting follow-up does not redefine product scope or reopen the completed staging slice

# Fail Conditions Candidate

the batch is not complete if any of the following remain true.

- production can be deployed with ambiguous or invalid SNS runtime overlay inputs
- public verification cannot distinguish the intended production SNS mode or service target posture from fallback or stale config
- rollback target reference is missing, stale, or not tied to the production promotion evidence
- production verification omits the major SNS surface or cannot distinguish persisted success from frontend-only success state where member write is in scope
- post-promotion operational hardening is mixed with new feature work or auth/product-scope reopening

# Follow-On Non-Goals Candidate

- auth reopening and provider selection
- new SNS feature expansion such as replies, reactions, moderation UI, or search
- multi-cloud active-active write path
- Azure live implementation
- deep incident automation or automatic remediation orchestration

# Downstream Use

- this issue remains the GitHub-tracked parent planning contract for the SNS production-hardening batch, and approved child splits such as issue-154 must inherit its post-staging entry condition rather than redefining it
- the first approved production execution child split should inherit this issue as the post-staging promotion contract for the pre-deploy promotion gate only
- runtime-config guardrail and public verification follow-ups should derive their completion signal from this issue rather than redefining done independently
- later SNS feature expansion should use this issue to decide whether work belongs in production-hardening scope or a separate feature track

# Local Draft Follow-Ups

- docs/portal/issues/issue-154-sns-production-promotion-execution.md is the first approved child split because it adds a distinct pre-deploy execution boundary under this contract
- docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md and docs/portal/issues/issue-156-sns-production-rollback-hardening-and-recovery-evidence-execution.md remain intentionally unpublished until later review confirms they add distinct follow-on execution boundaries

# Current Status

- local draft refined after issue-148 through issue-151 completed as the staging-backed slice and published to GitHub as Issue #136
- staging-backed reference currently points to Lambda Function URL plus DynamoDB timeline persistence with reviewed runs `23041594174` and `23041628020`
- post-merge confirmation on `main` currently points to `portal-build` run `23064520097` and downstream `portal-staging-deploy` run `23064537933`
- the first child split for the pre-deploy promotion gate has now been published to GitHub as Issue #138; later child drafts remain local working material only until further review approves them
- production execution has not started in this issue; this record remains planning-only while GitHub Issue #136 is open
- GitHub Issue: #136
- Sync Status: synced to GitHub as open planning issue; first child split published as Issue #138 and deeper follow-on drafts remain local-only

# Dependencies

- docs/portal/issues/issue-148-sns-service-persistence-expansion-contract.md
- docs/portal/issues/issue-149-sns-service-persistence-path-execution.md
- docs/portal/issues/issue-150-sns-frontend-service-persistence-cutover-execution.md
- docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md
- docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
