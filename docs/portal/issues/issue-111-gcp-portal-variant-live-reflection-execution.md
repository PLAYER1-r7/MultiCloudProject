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
- [ ] AC-1: GCP deploy evidence path が issue 上に記録されている
- [ ] AC-2: `https://www.gcp.ashnova.jp` と `https://preview.gcp.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` で GCP variant が確認できる
- [ ] AC-3: Issue 107 を reopen せず current batch の GCP live reflection record として完結している

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

- OPEN
- GitHub Issue: #111
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/111
- Sync Status: synced to GitHub

## Current Execution Snapshot

- latest reviewed build on `main` is build run `22910183364` for commit `0991807895733669afb88dd592c42b07dd4817b3`
- latest reviewed GCP-side public baseline is still downstream of the same pre-variant build lineage
- current public GCP route probe on `https://www.gcp.ashnova.jp/status` still returns the shared marker `AWS first`
- this means the current public GCP portal is still serving the pre-variant shared portal copy, not the Issue 109 runtime-variant implementation

## Blocker Assessment

- Issue 109 implementation exists only in the current local working tree and is not yet a committed promotion candidate on `main`
- GCP public reflection for the cloud-specific variant batch cannot be recorded against the current live shell because it still reflects the older shared portal deployment
- fail-closed result: keep Issue 111 open until a new committed build candidate containing the Issue 109 code is built and then deployed through the GCP portal delivery path

## Next Action Gate

- commit and publish the Issue 109 implementation to `main`
- obtain a new successful `portal-build` run for that commit
- dispatch the reviewed GCP portal deploy path for that commit with the required resource execution reference
- verify `https://www.gcp.ashnova.jp/`, `/overview`, `/guidance`, and `/status` plus `https://preview.gcp.ashnova.jp/`, `/overview`, `/guidance`, and `/status` for GCP-specific variant wording before closing this issue
