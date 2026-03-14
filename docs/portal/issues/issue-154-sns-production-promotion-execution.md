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
- [x] AC-1: production promotion source evidence が build/staging chain 単位で明文化されている
- [x] AC-2: runtime overlay input gate と service target declaration が読み取れる
- [x] AC-3: approver boundary、rollback target reference、pre-deploy fail conditions が読み取れる
- [x] AC-4: public verification and broader hardening が non-goals として切り分けられている

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

- [x] promotion source evidence を fixed judgment にする
- [x] approver boundary を fixed judgment にする
- [x] runtime overlay input gate を fixed judgment にする
- [x] rollback target declaration を fixed judgment にする
- [x] pre-deploy fail conditions を fixed judgment にする
- [x] non-goals を明文化する

# Definition of Done

- [x] reviewed build/staging chain を production candidate として読める
- [x] production runtime overlay inputs と service target declaration を読める
- [x] rollback target reference と pre-deploy stop condition を読める
- [x] promotion evidence record に approver / verification owner / source evidence が同居する形を読める
- [x] public verification and broader hardening と混線せず読める
- [x] feature expansion が non-goal として切り分けられている

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

## Production Apply Prerequisite Sequence

- apply the reviewed production Terraform entrypoint before any runtime-variable switch from `simulated-route` to `http`
- use the production wiring now published on `main` to create the dedicated SNS Lambda, Function URL, IAM role/policy, and DynamoDB timeline table for the production environment
- record the reviewed apply evidence together with the resulting `sns_service_function_url`, `sns_service_function_name`, and `sns_service_timeline_table_name` outputs in the same operator path that already carries the promotion inputs
- copy the reviewed Function URL into `PRODUCTION_SNS_SERVICE_BASE_URL` only after the apply output is captured and the browser origin used by the portal is aligned with `production_base_url`
- switch `PRODUCTION_SNS_SERVICE_MODE` to `http` only after the Function URL output is recorded and the runtime overlay review confirms that production is no longer targeting the simulated route
- keep `PRODUCTION_SNS_PERSISTENCE_MODE` and `PRODUCTION_SNS_WRITE_SURFACE_ENABLED` under the same runtime-overlay review so the first service-backed production path does not mix a real backend URL with stale local-only expectations

## Production Apply Readiness Snapshot

- this section is retained as the pre-apply readiness checkpoint captured before live production execution; the current operative state is recorded in `Production Apply And Deploy Evidence` and `Current Status`
- current production Terraform state still contains only the static delivery resources; it does not yet include `module.portal_sns_service`
- the published production SNS wiring landed on `main` in commit `4e998db` and adds the production service module plus the production outputs needed for runtime cutover
- remote state inspection shows the current production footprint is still the static-site baseline, so the service-backed SNS resources should be treated as additive production infrastructure rather than an already-provisioned path
- a local targeted plan against a backend-free temporary copy predicts creation of the production SNS Lambda, Function URL permissions, IAM role/policy attachments, and DynamoDB timeline table; no intended destroy action was found for the static delivery path
- direct backend-backed `tofu init` could not be completed from the current container because the local OpenTofu CLI rejected the production backend argument `use_lockfile = true`; production apply therefore needs an execution environment that is already proven to accept the repository backend configuration or an equivalent reviewed operator path

## Production Apply And Deploy Evidence

- production Terraform apply completed on 2026-03-13 by using OpenTofu `v1.11.5` in a reviewed temporary execution path that accepts the configured S3 backend with `use_lockfile = true`
- production Terraform output now records `sns_service_function_name=multicloudproject-portal-sns-production`, `sns_service_timeline_table_name=multicloudproject-portal-sns-production-timeline`, and `sns_service_function_url=https://isrvwfbt2ve3rr3d6pk5ddwgle0zonfi.lambda-url.ap-northeast-1.on.aws/`
- direct AWS verification confirmed the production Lambda function is active, the DynamoDB timeline table is active, and the Function URL is reachable on `GET /api/sns/timeline`
- the live Function URL now returns `200 OK` with `{"items":[]}` and `access-control-allow-origin: https://www.aws.ashnova.jp`, confirming the reviewed production browser origin is accepted by the service path
- production runtime variables were updated so `PRODUCTION_SNS_SERVICE_BASE_URL` points to the reviewed Function URL and `PRODUCTION_SNS_SERVICE_MODE=http`, while `PRODUCTION_SNS_PERSISTENCE_MODE=browser-local-storage` and `PRODUCTION_SNS_WRITE_SURFACE_ENABLED=true` were intentionally retained as the current surface labeling baseline
- `portal-production-deploy` run `23071598026` completed successfully against build run `23064520097` and staging deploy run `23064537933`, and the deployed `runtime-config.js` now advertises the service-backed SNS runtime on the production site
- transient live verification then posted one production SNS item through the reviewed Function URL with member actor context, read the same item back from `GET /api/sns/timeline`, and restored the DynamoDB item to the empty-state baseline immediately after the check; the final live timeline returned `{"items":[]}` again after restoration

## Non-Goals

- public verification detail
- post-promotion monitoring depth
- automatic rollback orchestration
- new SNS feature work

# Process Review Notes

- `Production Apply Readiness Snapshot` is intentionally retained as the historical pre-apply checkpoint; current live state is defined by `Production Apply And Deploy Evidence` and `Current Status`
- `Dispatch Example Shape` remains a template section, while the actual reviewed production values are fixed in the evidence record above
- CloudSonnet review identified stale open execution-planning wording; the local canonical record now reflects that the issue remains open on GitHub but is close-ready on the basis of completed apply, deploy, and transient verification evidence

# Current Status

- production promotion source evidence, runtime overlay gate, rollback target reference, and approver / verification ownership requirements are fixed in this canonical execution record
- repository baseline already expects source build evidence, staging verification evidence, rollback target reference, and verification owner to travel together in the production record; this issue now records the completed SNS production path with the same boundary
- reviewed production SNS infrastructure is now provisioned and the production frontend runtime has been redeployed with `VITE_PUBLIC_SNS_SERVICE_MODE=http`
- current production service target is `https://isrvwfbt2ve3rr3d6pk5ddwgle0zonfi.lambda-url.ap-northeast-1.on.aws/`, and `portal-production-deploy` run `23071598026` is the first production deploy record that carries the service-backed runtime overlay
- GitHub Issue: #138
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/138
- Sync Status: synced to GitHub; open but close-ready after CloudSonnet review follow-up

# Dependencies

- docs/portal/issues/issue-152-sns-production-promotion-and-operational-hardening-contract.md
- docs/portal/issues/issue-151-sns-stateful-staging-review-and-rollback-evidence-execution.md
