## Summary

AWS 側の portal live reflection batch は commit `0991807895733669afb88dd592c42b07dd4817b3` をもとに [docs/portal/issues/issue-106-portal-live-reflection-execution.md](docs/portal/issues/issue-106-portal-live-reflection-execution.md) で public verification まで完了している。一方で、repository owner の実観測では `https://www.gcp.ashnova.jp` は新しい portal 内容へ追随しておらず、2026-03-10 時点の public shell でも AWS 側は `/assets/index-BW80L7rV.js`、GCP 側は `/assets/index-OC6wphmQ.js` を返している。

Issue 68 は `www.gcp.ashnova.jp` の hostname / certificate / reachability close gate を満たした historical live-execution record であり、later portal copy batch の reflection parity まで保証する record ではない。このため、Issue 106 を流用せず、GCP 側 browser-facing portal parity を recover する fresh execution record が必要である。

## Goal

GCP production-equivalent hostname `https://www.gcp.ashnova.jp` が current portal copy batch を返す状態まで戻し、deploy evidence、artifact provenance、public verification、summary sync を same issue path で追跡できるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-107
- Title: GCP portal live reflection parity recovery を進める
- Requester: repository owner
- Target App: portal-web
- Environment: GCP production-equivalent portal surface
- Priority: high
- Predecessor: Issue 52 closed, Issue 53 closed, Issue 68 closed, Issue 106 evidence recorded

Objective
- Problem to solve: AWS 側では current portal copy batch が live reflection 済みだが、GCP 側 public portal は repository owner observation 上 old portal content のままであり、current cloud status summary と public reality がずれている
- Expected value: GCP 側の portal reflection discrepancy を separate execution boundary で扱い、build provenance、GCP deploy evidence、public verification、summary correction を同一 issue path に固定できる

Scope
- In scope: current mismatch evidence の固定、promotion candidate 特定、`portal-gcp-preview-deploy` dispatch input の確定、GCP deploy/redeploy evidence、`https://www.gcp.ashnova.jp` public verification、summary sync
- Out of scope: portal copy rewrite、Issue 68 reopen、Issue 106 reopen、GCP hostname redesign、certificate redesign、preview shutdown judgment、Cloud Armor / credential / destructive rollback follow-up
- Editable paths: docs/portal/issues/issue-107-gcp-portal-live-reflection-parity-recovery.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: AWS/GCP public mismatch evidence が 1 issue で読める
- [x] AC-2: GCP deploy/redeploy に使う build provenance と resource execution reference が issue 上で固定されている
- [x] AC-3: `https://www.gcp.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` について current portal copy parity を確認できる
- [x] AC-4: cloud status summary が Issue 68 historical record と current parity recovery issue を混同しない

Implementation Plan
- Files likely to change: docs/portal/issues/issue-107-gcp-portal-live-reflection-parity-recovery.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: Issue 68 は historical reachability baseline として保持しつつ、Issue 52 workflow contract と Issue 53 resource execution reference を入力に、current portal copy batch の GCP redeploy/reverification を fresh execution record へ切り出す
- Alternative rejected and why: Issue 106 を拡張する案は AWS public reflection batch と GCP parity recovery を混線させるため採らない。Issue 68 を reopen する案も hostname/certificate close gate の historical record を崩すため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-107-gcp-portal-live-reflection-parity-recovery.md and docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Expected results: markdown diagnostics がなく、mismatch evidence、deploy input、public verification gate、summary correction boundary が読める
- Failure triage path: Issue 52 workflow contract、Issue 53 resource execution reference、Issue 68 historical close note、Issue 106 portal reflection evidence を再照合し、scope が parity recovery を超えていないか切り分ける

Risk and Rollback
- Risks: parity recovery issue が Issue 68 の historical live proof を否定するように読まれること
- Impact area: public status accuracy, deploy evidence discipline, issue-chain traceability
- Mitigation: Issue 68 は hostname/certificate/reachability baseline、Issue 107 は later portal copy parity recovery と明示して責務を分離する
- Rollback: scope が広がりすぎた場合は mismatch evidence、deploy input、public verification gate だけを残し、additional GCP hardening は existing follow-up chain に戻す
```

## Current Mismatch Evidence

- AWS public shell: `https://www.aws.ashnova.jp` -> `/assets/index-BW80L7rV.js`
- GCP public shell: `https://www.gcp.ashnova.jp` -> `/assets/index-OC6wphmQ.js`
- Repository owner observation: GCP portal content remains old while AWS reflects the new portal content
- Issue 106 evidence path: commit `0991807895733669afb88dd592c42b07dd4817b3`, build run `22910183364`, staging run `22910230433`, production deploy run `22910302949`
- Issue 68 historical note: close gate was based on GCP hostname / certificate / route reachability, not later portal copy parity with the AWS live reflection batch

## Execution Boundary

- do not reopen Issue 106; it is the AWS portal live reflection record for the current portal copy batch
- do not reopen Issue 68; it remains the historical GCP production-equivalent hostname execution record
- this issue is the only execution record for current GCP portal parity recovery

## Proposed Execution Steps

### 1. Promotion candidate を固定する

- current portal copy batch の canonical commit SHA を固定する
- GCP deploy に使う successful `portal-build` run ID を固定する
- `resource_execution_reference` として [docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md](docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md) を再確認する

### 2. GCP deploy / redeploy を実行する

- `portal-gcp-preview-deploy` を same build provenance で dispatch する
- required input は `source_build_run_id`, `source_build_commit_sha`, `resource_execution_reference` とする
- `portal-gcp-preview-deployment-record` artifact を evidence path に残す

### 3. Public verification を行う

- `https://www.gcp.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` を確認する
- public shell が current portal copy batch と同じ asset lineage に乗っていることを確認する
- browser-facing copy parity が AWS batch と同じ更新単位で反映されていることを確認する

### 4. Summary を同期する

- [docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md](docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md) へ current parity recovery state を反映する
- Issue 68 historical baseline と Issue 107 active parity recovery を分離した wording に更新する

## Step Checklist

- [x] current portal copy promotion candidate is identified by commit SHA and build run ID
- [x] `resource_execution_reference` is confirmed before GCP deploy starts
- [x] GCP deploy run URL and `portal-gcp-preview-deployment-record` artifact are recorded
- [x] `https://www.gcp.ashnova.jp` returns the current portal copy on `/`, `/overview`, `/guidance`, and `/status`
- [x] summary sync distinguishes historical GCP hostname proof from current portal parity recovery

## Step 1 Input Snapshot

- Canonical commit SHA: `0991807895733669afb88dd592c42b07dd4817b3`
- portal-build run ID: `22910183364`
- portal-build run URL: https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22910183364
- Build provenance confirmation: `portal-build` / `success` / `main`
- Resource execution reference: [docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md](docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md)

## Step 2 Deploy Evidence

- GCP deploy run ID: `22911151750`
- GCP deploy run URL: https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22911151750
- Deployment artifact: `portal-gcp-preview-deployment-record`
- Deployment artifact confirms:
  - Preview bucket: `multicloudproject-portal-gcp-preview-web`
  - Reviewed target reference: `A 34.128.181.172`
  - Source build run ID: `22910183364`
  - Source build commit SHA: `0991807895733669afb88dd592c42b07dd4817b3`
  - Reachability results recorded for `/`, `/overview`, `/guidance`

## Step 3 Public Verification Snapshot

- GCP public shell after redeploy: `https://www.gcp.ashnova.jp` -> `/assets/index-BW80L7rV.js`
- AWS deployed bundle hash: `aa14d080f61667c67a156b048d61f83655207c3f008faf337bffe859c004f626`
- GCP deployed bundle hash: `aa14d080f61667c67a156b048d61f83655207c3f008faf337bffe859c004f626`
- Final public route checks after live GCP URL map remediation:
  - `/` -> `200`
  - `/overview` -> `200`
  - `/guidance` -> `200`
  - `/status` -> `200`

Verification note:

- old-content mismatch is no longer reproducible after run `22911151750`; the public GCP shell now serves the same current bundle lineage as AWS
- the remaining parity blocker was not stale content but GCP delivery semantics: route rewrite alone still served the SPA shell with HTTP `404`
- after live remediation, both `https://www.gcp.ashnova.jp` and `https://preview.gcp.ashnova.jp` returned `HTTP 200` for `/overview`, `/guidance`, and `/status`
- the GCP deploy workflow had previously treated non-root `404` plus SPA shell markers as pass for configured smoke paths, which explained why the earlier deploy completed without surfacing the parity defect

## Root Cause And Live Remediation

- Root cause is now identified in reviewed IaC and workflow contracts:
  - `infra/modules/portal-gcp-static-delivery/main.tf` rewrites known SPA routes to `/index.html`, but `/status` was not included in `spa_fallback_routes`
  - `infra/environments/gcp-preview/variables.tf` and related monitoring docs defaulted monitored paths to `/`, `/overview`, `/guidance`, so `/status` was outside the first-response surface
  - `.github/workflows/portal-gcp-preview-deploy.yml` default smoke paths also omitted `/status`, and its non-root `404` allowance meant the workflow could pass while `/status` still returned the SPA shell with HTTP `404`
  - additional live finding: even after `/status` was added to SPA rewrite targets, GCP backend-bucket delivery still served deep links as SPA HTML with HTTP `404`; route rewrite by itself did not normalize the status code to `200`
- Live remediation applied to the GCP delivery surface:
  - `/status` added to GCP SPA rewrite targets
  - `/status` added to GCP monitoring default paths and recovery walkthrough expectations
  - GCP deploy smoke defaults expanded to include `/status`
  - configured smoke paths are now treated as required `HTTP 200` routes rather than silently accepting a non-root `404`
  - each SPA deep-link route rule now carries `custom_error_response_policy` so backend-bucket `404` responses are served from `/index.html` with overridden status `200`
  - CDN invalidation was executed on the live URL map after apply so cached `404` responses did not mask the new behavior
- Verified live outcome:
  - `https://www.gcp.ashnova.jp/overview` -> `200`
  - `https://www.gcp.ashnova.jp/guidance` -> `200`
  - `https://www.gcp.ashnova.jp/status` -> `200`
  - `https://preview.gcp.ashnova.jp/overview` -> `200`
  - `https://preview.gcp.ashnova.jp/guidance` -> `200`
  - `https://preview.gcp.ashnova.jp/status` -> `200`

## Close Gate

- mismatch evidence is recorded on this issue path
- GCP deploy/redeploy evidence is recorded on this issue path
- public verification for `https://www.gcp.ashnova.jp` is recorded on this issue path
- cloud status summary no longer overstates GCP portal parity without referring to the fresh recovery record

Current close assessment:

- deploy/redeploy successfully recovered current bundle parity on `https://www.gcp.ashnova.jp`
- live GCP delivery remediation has been applied and public route-status parity is now recovered for `/`, `/overview`, `/guidance`, and `/status`
- documentation/body sync is complete; the technical acceptance criteria are satisfied and the issue is closed

## Current Status

- CLOSED
- GitHub Issue: #107
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/107
- Sync Status: synced to GitHub and closed

- fresh execution boundary created for GCP portal parity recovery
- Issue 106 and Issue 68 remain historical references and are not reopened here
- current bundle parity between AWS and GCP has been recovered by GCP deploy run `22911151750`
- route-status parity is now recovered: `/status` serves the current SPA shell on GCP and responds with `200`
- root cause required two layers of fix: `/status` had to be added to the GCP SPA rewrite / monitoring / smoke-path defaults, and deep-link route rules also needed `custom_error_response_policy` to convert backend-bucket `404` responses into `/index.html` `200` responses
- CDN invalidation was required after the live URL map update before public checks converged to the corrected `200` results
