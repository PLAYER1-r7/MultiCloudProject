## Summary

Issue 109 で local implementation が完了した後、GCP public portal `https://www.gcp.ashnova.jp` と retained preview `https://preview.gcp.ashnova.jp` が GCP portal variant を返していることを separate execution issue で確認する必要がある。Issue 107 は shared portal parity recovery の record であり、current cloud-specific variant batch の live proof として再利用しない。

## Goal

GCP portal variant live reflection を separate execution issue として管理し、deploy evidence、public verification、route-status parity を同一 issue path で追跡する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-111
- Title: GCP portal variant live reflection execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: GCP production-equivalent and retained preview portal surfaces
- Priority: high
- Predecessor: Issue 109 completed locally

Objective
- Problem to solve: local implementation だけでは GCP public surfaces が GCP variant を返したことを証明できない
- Expected value: GCP deploy evidence path、public route verification、GCP-specific wording reflection を current batch の separate issue で追跡できる

Scope
- In scope: build provenance fixation、GCP deploy evidence path、`www.gcp.ashnova.jp` と `preview.gcp.ashnova.jp` の route verification、GCP-specific wording reflection confirmation
- Out of scope: AWS public verification、portal copy redesign、Issue 107 reopen、infra redesign
- Editable paths: docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: GCP deploy evidence path が issue 上に記録されている
- [x] AC-2: `https://www.gcp.ashnova.jp` と `https://preview.gcp.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` で GCP variant が確認できる
- [x] AC-3: Issue 107 を reopen せず current batch の GCP live reflection record として完結している

Implementation Plan
- Files likely to change: docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: Issue 107 の evidence shape を current batch 用に流用しつつ、GCP-specific wording reflection confirmation を追加する
- Alternative rejected and why: Issue 107 へ追記する案は shared parity recovery record と current batch を混線させるため採らない

Validation Plan
- Commands to run: get_errors on issue-111 and updated cloud status summary
- Expected results: deploy evidence path と GCP-specific public verification shape が読み取れる
- Failure triage path: Issue 107 と GCP deploy workflow current boundary を再照合し、current batch の evidence path が独立しているかを確認する

Risk and Rollback
- Risks: GCP variant wording の reflection failure が route-status parity failure と混同されること
- Impact area: GCP public portal wording, deploy traceability
- Mitigation: current issue path では wording reflection verification と route-status verification を同じ execution record に置きつつ、Issue 107 とは分離する
- Rollback: live reflection が未実施なら deploy-ready/local-only handoff として止める
```

## Current Status

- CLOSED
- GitHub Issue: #111
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/111
- Sync Status: synced to GitHub

## Current Execution Snapshot

- Issue 109 implementation was committed and pushed to `main` as commit `ebe45a91379688ef277f28a63ac9cdea5d44adf5`
- reviewed build evidence is build run `22952659968` for the same commit
- GCP deploy evidence is deploy run `22952760131` for the same commit using resource execution reference `docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md`
- `https://www.gcp.ashnova.jp/` and `https://preview.gcp.ashnova.jp/` now serve the promoted portal shell referencing `/assets/index-B6aEQIvb.js`
- deployed bundles on both GCP public surfaces contain the hostname-aware variant markers and host mapping for `www.aws.ashnova.jp`, `www.gcp.ashnova.jp`, and `preview.gcp.ashnova.jp`

## Public Verification Snapshot

- route reachability verification returned `HTTP 200` for `https://www.gcp.ashnova.jp/`, `/overview`, `/guidance`, `/status` and `https://preview.gcp.ashnova.jp/`, `/overview`, `/guidance`, `/status`
- root shell responses on both GCP public surfaces now point to the promoted runtime-variant bundle hash `index-B6aEQIvb.js`
- browser-facing hostname selection remains runtime-driven inside the shared bundle, so public proof is recorded as `hosts serve promoted hostname-aware bundle plus route reachability` rather than a separate server-rendered copy split
- Issue 107 remains closed and was not reopened for this cloud-specific variant batch

## Validation Result

- local validation before promotion: `cd apps/portal-web && npm run test:baseline && npm run build` passed
- reviewed promotion path: build `22952659968` -> GCP deploy `22952760131`
- public verification path: curl probes returned `HTTP 200` on the required GCP production-equivalent and retained preview routes and the public shell now references the promoted bundle hash

## Execution Record

- promotion candidate commit: `ebe45a91379688ef277f28a63ac9cdea5d44adf5`
- build workflow: `portal-build` run `22952659968`
- GCP deploy workflow: `portal-gcp-preview-deploy` run `22952760131`
- resource execution reference: `docs/portal/issues/issue-53-gcp-preview-delivery-resource-execution.md`
- public bundle evidence: `https://www.gcp.ashnova.jp/assets/index-B6aEQIvb.js`, `https://preview.gcp.ashnova.jp/assets/index-B6aEQIvb.js`
