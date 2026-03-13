# Summary

この issue は、SNS production-hardening batch における production promotion の entry condition を execution-ready な単位で固定するためのものである。reviewed staging slice を promotion source として凍結し、runtime overlay input gate、approver boundary、rollback target declaration を同じ promotion record 上で fail-closed に扱える状態を目標とする。

ここで扱うのは production deploy に入る直前までの judgment line に限定し、public verification や broader hardening は後続 issue に分離する。

# Goal

SNS production-hardening batch 向けに production promotion execution を定義し、promotion source evidence、approver boundary、runtime overlay input gate、rollback target declaration を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-154
- Title: SNS production promotion execution を整理する
- Requester: repository owner
- Target App: portal-web SNS production delivery path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-152-sns-production-promotion-and-operational-hardening-contract.md accepted as the current post-staging promotion contract reference

Objective
- Problem to solve: reviewed staging evidence が揃っていても、production promotion の source candidate、runtime overlay inputs、rollback target declaration が execution-ready 単位に固定されていないと、production deploy entry condition が ad hoc になりやすい
- Expected value: reviewed build/staging chain を promotion source として凍結し、production deploy 前に required config inputs と rollback target reference を fail-closed に確認できる
- Terminal condition: promotion source evidence、approver boundary、runtime overlay input gate、rollback target declaration、non-goals が fixed judgment として読め、production execution path を code and ops evidence へ落とせる

Scope
- In scope: production promotion source freeze、approver boundary、explicit runtime overlay input gate、service target declaration、rollback target reference、pre-deploy fail conditions
- Out of scope: public verification detail、post-promotion monitoring depth、automatic rollback orchestration、new SNS feature work
- Editable paths: docs/portal/issues/issue-154-sns-production-promotion-execution.md
- Restricted paths: docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md, docs/portal/issues/issue-155-sns-production-runtime-config-and-public-verification-execution.md, docs/portal/issues/issue-156-sns-production-rollback-hardening-and-recovery-evidence-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: production promotion source evidence が build/staging chain 単位で明文化されている
- [ ] AC-2: runtime overlay input gate と service target declaration が読み取れる
- [ ] AC-3: approver boundary、rollback target reference、pre-deploy fail conditions が読み取れる
- [ ] AC-4: public verification and broader hardening が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-154-sns-production-promotion-execution.md
- Approach: issue-152 の promotion input baseline を継承し、reviewed build/staging chain、approver boundary、production runtime overlay inputs、rollback target declaration を最初の production execution unit として整理する
- Alternative rejected and why: production promotion と public verification を 1 issue に混ぜる案は deploy entry condition と post-deploy judgment が混線し、fail conditions が曖昧になるため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown doc
- Expected results: markdown diagnostics がなく、promotion source evidence、approver boundary、runtime overlay input gate、rollback target declaration、non-goals が issue 単位で読める
- Failure triage path: issue-152 と issue-151 を照合し、promotion source、approver boundary、runtime input、rollback target、pre-deploy fail condition のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: promotion issue が広がって public verification や operational hardening を吸収するか、逆に narrow すぎて rollback target declaration を含まないまま deploy-ready 扱いになること
- Impact area: production deploy safety, source-of-truth clarity, rollback readiness
- Mitigation: issue は candidate freeze、approver boundary、runtime overlay input gate、rollback target declaration に限定し、post-deploy judgment は後続 issue に分離する
- Rollback: scope が広がりすぎた場合は promotion source evidence、approver boundary、runtime overlay input gate、rollback target declaration の 4 点だけを残し、post-deploy checks は separate issue に分離する
```

# Tasks

- [ ] promotion source evidence を fixed judgment にする
- [ ] approver boundary を fixed judgment にする
- [ ] runtime overlay input gate を fixed judgment にする
- [ ] rollback target declaration を fixed judgment にする
- [ ] pre-deploy fail conditions を fixed judgment にする
- [ ] non-goals を明文化する

# Definition of Done

- [ ] reviewed build/staging chain を production candidate として読める
- [ ] production runtime overlay inputs と service target declaration を読める
- [ ] rollback target reference と pre-deploy stop condition を読める
- [ ] promotion evidence record に approver / verification owner / source evidence が同居する形を読める
- [ ] public verification and broader hardening と混線せず読める
- [ ] feature expansion が non-goal として切り分けられている

# Promotion Source Baseline

production promotion の candidate freeze は、既存の production gate baseline と issue-152 の staging-complete reference をそのまま引き継ぐ。

- production promotion unit remains a staging-validated commit on `main`, not a release tag
- promotion source must point to one reviewed build run and one matching reviewed staging deploy run for the same commit
- current post-staging reference chain is `portal-build` run `23064520097` plus downstream `portal-staging-deploy` run `23064537933` on `main`
- staging-complete SNS service-backed reference remains the Lambda Function URL plus DynamoDB path reviewed through `portal-staging-deploy` run `23041594174` and `portal-sns-staging-review` run `23041628020`
- promotion candidate fails closed if build evidence, staging deploy evidence, and reviewed service target do not describe the same commit and the same service-backed path

# Execution Unit

## Promotion Source Boundary

- production promotion candidate should be identified by reviewed build evidence plus matching reviewed staging deploy and review evidence
- candidate selection should remain tied to the service-backed staging shape rather than the removed App Runner diagnostic path
- promotion source should fail closed when build, staging deploy, and staging review do not describe the same reviewed path

## Required Production Record Inputs

- production execution should record commit SHA, build run id, staging deploy run id, rollback target reference, and post-deploy verification owner in the same promotion record
- single named approver should be declared before dispatch, and production execution should not start without that approval boundary
- artifact evidence should stay tied to the candidate commit so current candidate and latest known-good target are both re-identifiable without a fresh rebuild
- external DNS coordination and state-locking checkpoint remain required production gates, but they are prerequisites to record here rather than execution scope to solve here

## Runtime Overlay Gate

- production deploy should require explicit SNS runtime overlay inputs rather than inheriting ambiguous defaults
- service mode, service base URL, persistence mode, and write-surface policy should be reviewable before execution starts
- deploy should not proceed when runtime-config generation cannot prove the intended production service target
- runtime overlay review should confirm that production values are sourced from approved environment inputs rather than stale staging defaults or build-time leftovers

## Rollback Target Boundary

- production execution should name the last-known-good target before deploy starts
- rollback target reference should be tied to the same evidence chain as the promotion candidate
- pre-deploy fail conditions should include missing rollback target, ambiguous service target declaration, or inconsistent build/staging evidence

## Evidence Record Boundary

- promotion evidence should be collected in one production deployment record rather than split across separate local notes
- the record should be sufficient to reconstruct who approved promotion, what candidate was promoted, what rollback target was declared, and who owns post-deploy verification
- step-1 style candidate freeze is not complete from local validation alone; the record must point to published `main`-based build and staging evidence

## Dispatch Input Template

- `source_build_run_id`: use the reviewed `portal-build` run id for the candidate commit; current recorded baseline is `23064520097`
- `source_build_commit_sha`: use the exact `main` commit SHA attached to that reviewed build run and the matching staging deploy run
- `staging_deploy_run_id`: use the reviewed `portal-staging-deploy` run id for the same commit; current recorded baseline is `23064537933`
- `rollback_target_reference`: cite the last-known-good production deploy run URL or equivalent reviewed rollback evidence reference; do not use an implicit description such as `latest good build`
- `approver`: record the single named production approver for this promotion; do not use placeholders such as `tbd` or role-only wording without a name
- `dns_certificate_coordination_reference`: cite the reviewed external DNS and certificate coordination note, including the operator path that names the current production alias, certificate, and cutover plan
- `state_locking_checkpoint`: cite the reviewed checkpoint showing the production state-locking path is ready for this promotion window
- `verification_owner`: record the named owner for post-deploy verification; if omitted, the workflow defaults to the repository owner and the production record will show that default explicitly

## Dispatch Example Shape

- `source_build_run_id=23064520097`
- `source_build_commit_sha=<main commit SHA from build 23064520097 and staging deploy 23064537933>`
- `staging_deploy_run_id=23064537933`
- `rollback_target_reference=https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/<last-known-good-production-run-id>`
- `approver=<named production approver>`
- `dns_certificate_coordination_reference=<reviewed operator note or handoff record reference for external DNS and ACM coordination>`
- `state_locking_checkpoint=<reviewed checkpoint reference for the production state-locking path>`
- `verification_owner=<named post-deploy verification owner or empty to use repository owner default>`

## Pre-Deploy Fail Conditions Candidate

- no single reviewed commit on `main` can be named as the promotion candidate
- build run id and staging deploy run id do not resolve to the same reviewed commit
- runtime overlay inputs do not prove the intended SNS production target and mode
- rollback target reference or post-deploy verification owner is missing from the production record
- named approver boundary is still unresolved
- external DNS coordination note is still unresolved
- state-locking checkpoint is still unresolved

## Non-Goals

- public verification detail
- post-promotion monitoring depth
- automatic rollback orchestration
- new SNS feature work

# Current Status

- local draft created as the first derived execution issue from issue-152
- draft wording captures the intended SNS service-backed promotion candidate, approver boundary, runtime overlay gate, and rollback target declaration on one issue path
- repository baseline already expects source build evidence, staging verification evidence, rollback target reference, and verification owner to travel together in the production record; this draft now narrows that baseline to the SNS production path
- this child split is now the approved first publication candidate under issue-152 because it adds the distinct pre-deploy promotion execution boundary
- GitHub Issue: #138
- Sync Status: synced to GitHub as open execution-planning issue

# Dependencies

- docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md
- docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md
