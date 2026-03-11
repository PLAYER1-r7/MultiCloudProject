## Summary

Issue 109 で local implementation が完了した後、AWS public portal `https://www.aws.ashnova.jp` が AWS portal variant を実際に返していることを separate execution issue で確認する必要がある。Issue 106 は current shared portal copy batch の live reflection record であり、cloud-specific variant batch の live proof として再利用しない。

## Goal

AWS portal variant live reflection を separate execution issue として管理し、production deploy evidence と public URL verification を同一 issue path で追跡する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-110
- Title: AWS portal variant live reflection execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production portal surface
- Priority: high
- Predecessor: Issue 109 completed locally

Objective
- Problem to solve: local implementation だけでは AWS public portal が AWS variant を返したことを証明できない
- Expected value: AWS portal variant の deploy evidence path、artifact provenance、public route verification を current batch の separate issue で追跡できる

Scope
- In scope: promotion candidate identification、production deploy evidence path、AWS public route verification、AWS-specific wording reflection confirmation
- Out of scope: GCP public verification、portal copy redesign、infra redesign、workflow redesign
- Editable paths: docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: production deploy evidence path が issue 上に記録されている
- [x] AC-2: `https://www.aws.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` で AWS variant が確認できる
- [x] AC-3: Issue 106 を reopen せず current batch の AWS live reflection record として完結している

Implementation Plan
- Files likely to change: docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: Issue 106 の evidence shape を current batch 用に流用しつつ、AWS-specific wording reflection confirmation を追加する
- Alternative rejected and why: Issue 106 へ追記する案は batch boundary を壊すため採らない

Validation Plan
- Commands to run: get_errors on issue-110 and updated cloud status summary
- Expected results: deploy evidence path と AWS-specific public verification shape が読み取れる
- Failure triage path: Issue 106 と docs/portal/21_PORTAL_UPDATE_WORKFLOW.md を再照合し、current batch の evidence path が独立しているかを確認する

Risk and Rollback
- Risks: AWS variant wording の reflection failure が local implementation failure と混同されること
- Impact area: production portal wording, release traceability
- Mitigation: production deploy evidence と public verification を current issue path に限定し、local implementation issue とは分離する
- Rollback: live reflection が未実施なら deploy-ready/local-only handoff として止める
```

## Current Status

- CLOSED
- GitHub Issue: #110
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/110
- Sync Status: synced to GitHub

## Current Execution Snapshot

- Issue 109 implementation was committed and pushed to `main` as commit `ebe45a91379688ef277f28a63ac9cdea5d44adf5`
- reviewed build evidence is build run `22952659968` for the same commit
- reviewed staging verification is staging run `22952673408` for the same commit
- production deploy evidence is production run `22952714344` for the same commit
- `https://www.aws.ashnova.jp/` and `https://www.aws.ashnova.jp/status` now serve the promoted portal shell referencing `/assets/index-B6aEQIvb.js`
- deployed bundle `https://www.aws.ashnova.jp/assets/index-B6aEQIvb.js` contains the hostname-aware variant markers and host mapping for `www.aws.ashnova.jp`, `www.gcp.ashnova.jp`, and `preview.gcp.ashnova.jp`

## Public Verification Snapshot

- route reachability verification returned `HTTP 200` for `https://www.aws.ashnova.jp/`, `/overview`, `/guidance`, and `/status`
- root and status route shell responses now point to the promoted runtime-variant bundle hash `index-B6aEQIvb.js`
- browser-facing hostname selection remains runtime-driven inside the shared bundle, so public proof is recorded as `host serves promoted hostname-aware bundle plus route reachability` rather than a separate server-rendered copy split
- Issue 106 remains closed and was not reopened for this cloud-specific variant batch

## Validation Result

- local validation before promotion: `cd apps/portal-web && npm run test:baseline && npm run build` passed
- reviewed promotion path: build `22952659968` -> staging `22952673408` -> production `22952714344`
- public verification path: curl probes returned `HTTP 200` on the required AWS routes and the public shell now references the promoted bundle hash

## Host-Aware Metadata Follow-Up Snapshot

- follow-up commit for host-aware head metadata and browser automation is `38085e8368fd0e266bca5a183530d065cab37a0a`
- reviewed build evidence for the follow-up is build run `22953281656`
- reviewed staging verification for the follow-up is staging run `22953295798`
- production deploy evidence for the follow-up is production run `22953349238`
- public browser verification for the follow-up was executed with `cd apps/portal-web && npm run test:public-variants`
- Playwright verification confirmed `https://www.aws.ashnova.jp/` and `/status` rendered `AWS portal variant`, host `www.aws.ashnova.jp`, route markers, runtime title segment `AWS host view`, and runtime description text on the public site
- the follow-up keeps the shared HTML shell generic and records AWS-specific rendering as runtime metadata plus browser-observed markers rather than server-rendered split HTML

## Execution Record

- promotion candidate commit: `ebe45a91379688ef277f28a63ac9cdea5d44adf5`
- build workflow: `portal-build` run `22952659968`
- staging workflow: `portal-staging-deploy` run `22952673408`
- production workflow: `portal-production-deploy` run `22952714344`
- public bundle evidence: `https://www.aws.ashnova.jp/assets/index-B6aEQIvb.js`
- host-aware metadata follow-up commit: `38085e8368fd0e266bca5a183530d065cab37a0a`
- host-aware metadata follow-up build workflow: `portal-build` run `22953281656`
- host-aware metadata follow-up staging workflow: `portal-staging-deploy` run `22953295798`
- host-aware metadata follow-up production workflow: `portal-production-deploy` run `22953349238`
