## Summary

portal-web の browser-facing copy は AWS / GCP の current state に合わせて local repository 上では更新され、`npm run test:baseline` と `npm run build` も通過している。一方で、この変更はまだ live portal reflection としては確認されておらず、deploy-ready evidence と public URL verification を同じ完了扱いにすると、portal update request が local-only のまま Done と誤認されやすい。

## Goal

portal live reflection execution を separate issue として管理し、browser-facing portal copy update を production deploy、public URL verification、deploy-ready/local-only handoff 境界のいずれかで明示的に閉じられるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-106
- Title: portal live reflection execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production portal surface
- Priority: medium
- Predecessor: no direct GitHub issue predecessor; local task PORTAL-AWS-GCP-CONTENT-2026-03-10 completed locally, and docs/portal/21_PORTAL_UPDATE_WORKFLOW.md was updated with the live reflection rule

Objective
- Problem to solve: portal copy update は local validation まで完了しているが、production deploy 実行と public URL verification が別 issue になっていないため、browser-facing copy の live reflection 未完了が見えにくい
- Expected value: browser-facing portal copy change を deploy-ready/local-only と live portal reflection に分離し、production deploy evidence path と public URL verification を current execution issue で追跡できる
- Terminal condition: 次のどちらか一方で close できること。1) production deploy と public URL verification が同一 evidence path で確認された 2) live reflection を今回行わない理由、handoff owner、next action が deploy-ready/local-only handoff として current issue record に固定された

Scope
- In scope: live reflection scope declaration、production deploy evidence path の確認、public URL verification 手順、deploy-ready/local-only handoff 境界、validation / comment-ready record の固定
- Out of scope: portal copy の再編集、canonical docs の再更新、AWS infra redesign、custom-domain cutover redesign、production rollback redesign、GitHub issue close/open automation without explicit approval
- Editable paths: docs/portal/issues/issue-106-portal-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/src/main.ts, apps/portal-web/README.md, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: browser-facing portal copy change の live reflection issue として、deploy-ready/local-only と live reflection included の境界が 1 文書で読める
- [x] AC-2: production deploy evidence path と public URL verification evidence の expected shape が current issue record に固定されている
- [x] AC-3: live reflection を今回行わない場合の reason、handoff owner、next action が current issue record から読める

Implementation Plan
- Files likely to change: docs/portal/issues/issue-106-portal-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md の live reflection rule と既存 production deploy evidence path を入力に、portal copy の live reflection を separate execution issue として固定する
- Alternative rejected and why: local portal copy update の既存 issue や runbook に live reflection execution を混ぜる案は、local-only completion と public reflection completion の境界を再び曖昧にするため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-106-portal-live-reflection-execution.md and docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Expected results: markdown diagnostics がなく、deploy-ready/local-only handoff と live reflection included の分岐、production deploy evidence path、public URL verification path が読み取れる
- Failure triage path: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md、docs_agent/03_TASK_CONTRACT_TEMPLATE.md、docs_agent/04_DEFINITION_OF_DONE.md を再照合し、issue wording が local validation と live reflection verification を混同していないか切り分ける

Risk and Rollback
- Risks: separate issue が deploy 承認済み record や live reflection 完了済み record に誤読されること
- Impact area: portal release discipline, public-facing wording accuracy, operator handoff clarity
- Mitigation: deploy evidence path、public URL verification、local-only handoff の 3 分岐を明示し、actual deploy 実行と verification result は evidence が揃うまで未確定のまま維持する
- Rollback: scope が広がりすぎた場合は live reflection included と local-only handoff の boundary だけを残し、deploy execution detail は separate follow-up に分離する
```

## Current State Snapshot

- local portal copy update は completed locally として扱う
- local validation evidence は `cd apps/portal-web && npm run test:baseline && npm run build` passed で揃っている
- pending browser-facing copy changes are still local working-tree changes in `apps/portal-web/src/main.ts`, `apps/portal-web/src/styles.css`, and `apps/portal-web/README.md`
- live portal reflection evidence は current issue path 上にまだない
- current phase の default state は `deploy-ready/local-only until live reflection evidence is added` とする

## Current Blocking Condition

- `portal-production-deploy` can promote only a successful `portal-build` run plus a matching successful `portal-staging-deploy` run from `main`
- step 1 promotion candidate is now available on `main` with commit `0991807895733669afb88dd592c42b07dd4817b3`
- matching evidence pair is build run `22910183364` and staging run `22910230433`, both successful for the same commit on `main`
- current blocker is no longer step 1 readiness; the next boundary is step 2 production deploy plus public URL verification

## Stepwise Execution Record

Issue 106 は次の 1 -> 2 -> 3 の順で扱う。

### 1. Promotion candidate を確定する

- pending portal copy changes を `main` に載る promotion candidate にする
- matching `portal-build` run と `portal-staging-deploy` run を揃える
- build/staging evidence pair が current browser-facing copy update を含むことを current issue path に残す

### 2. Production deploy と public verification を行う

- `portal-production-deploy` を matching build/staging evidence pair で dispatch する
- `portal-production-deployment-record` artifact を deploy evidence として記録する
- `https://www.aws.ashnova.jp` の `/`, `/overview`, `/guidance` と changed route を確認する

### 3. Final state を固定する

- step 2 まで完了した場合は `live reflection included` として evidence comment を残す
- step 1 までで止まる場合、または live reflection を今回行わない場合は `deploy-ready/local-only handoff` comment を残す
- browser-facing copy change は step 2 の verification か step 3 の explicit handoff のどちらかがない限り Done にしない

## Step 1 Checklist

- [x] pending portal copy changes are committed on `main`
- [x] a successful `portal-build` run exists for that commit
- [x] a successful `portal-staging-deploy` run exists for the same commit
- [x] the production promotion candidate is identified by commit SHA, build run id, and staging run id
- [x] the issue record states that the candidate includes the current portal copy update

Step 1 rule:

- step 1 is not complete from local validation alone
- if the pending copy change is not yet represented by a `main`-based build/staging pair, do not start step 2

## Step 2 Checklist

- [x] `portal-production-deploy` run URL is recorded
- [x] `portal-production-deployment-record` artifact is recorded
- [x] production deploy inputs use the same commit SHA as step 1
- [x] public URL `https://www.aws.ashnova.jp` is checked after deploy
- [x] route verification includes `/`, `/overview`, `/guidance`, and changed route if needed
- [x] browser-facing copy update is confirmed on the public portal

Step 2 rule:

- if step 2 starts, deploy evidence and public verification must stay on the same issue path
- if production deploy succeeds but public verification is incomplete, do not mark live reflection as done; fall back to step 3 handoff wording

## Source Of Truth

- [docs/portal/21_PORTAL_UPDATE_WORKFLOW.md](docs/portal/21_PORTAL_UPDATE_WORKFLOW.md)
- [docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md](docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md)
- [docs_agent/03_TASK_CONTRACT_TEMPLATE.md](docs_agent/03_TASK_CONTRACT_TEMPLATE.md)
- [docs_agent/04_DEFINITION_OF_DONE.md](docs_agent/04_DEFINITION_OF_DONE.md)
- [docs/portal/issues/issue-36-production-rollout-implementation-baseline.md](docs/portal/issues/issue-36-production-rollout-implementation-baseline.md)
- [docs/portal/issues/issue-38-production-cutover-execution-baseline.md](docs/portal/issues/issue-38-production-cutover-execution-baseline.md)
- [docs/portal/issues/issue-41-production-monitoring-follow-up.md](docs/portal/issues/issue-41-production-monitoring-follow-up.md)

## Execution Boundary

- this issue is the separate execution boundary for browser-facing portal copy live reflection
- local validation evidence is deploy-ready only and does not close this issue by itself
- live reflection evidence requires both production deploy evidence path and public URL verification result
- if live reflection is not performed in this batch, this issue must end as deploy-ready/local-only handoff instead of Done

## Evidence Paths

### 1. Deploy-ready / local-only evidence

- local validation command result: `cd apps/portal-web && npm run test:baseline && npm run build`
- source-of-truth wording alignment: [docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md](docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md)
- workflow rule reference: [docs/portal/21_PORTAL_UPDATE_WORKFLOW.md](docs/portal/21_PORTAL_UPDATE_WORKFLOW.md)

### 2. Live reflection included evidence

- production deploy evidence path: reviewed `portal-production-deploy` run URL
- deploy artifact path: `portal-production-deployment-record`
- public URL verification target: `https://www.aws.ashnova.jp`
- route verification minimum set: `/`, `/overview`, `/guidance`, and the route whose browser-facing copy was changed if different

## Expected Decision Branches

### 1. Live reflection included

- production deploy evidence path is recorded
- public URL verification result is recorded
- current browser-facing copy is confirmed on the public URL
- same issue record links deploy evidence and public verification evidence

### 2. Deploy-ready / local-only handoff

- local validation evidence is recorded
- live reflection is intentionally not performed in this batch
- reason, handoff owner, and next action are recorded
- issue remains a handoff record, not a false Done state

Decision rule:

- default state remains deploy-ready/local-only until live reflection evidence is added
- browser-facing portal copy must not be marked Done from local validation alone
- if live reflection evidence is missing, record explicit handoff instead of inferring deployment completion

## Current Input Snapshot

- Promotion candidate commit SHA: `0991807895733669afb88dd592c42b07dd4817b3`
- portal-build run ID: `22910183364`
- portal-staging-deploy run ID: `22910230433`
- Step 1 result: current portal copy update is now represented by a successful `main`-based build/staging evidence pair
- Ready for step 2: yes

## Step 2 Input Snapshot

- `source_build_run_id`: `22910183364`
- `source_build_commit_sha`: `0991807895733669afb88dd592c42b07dd4817b3`
- `staging_deploy_run_id`: `22910230433`
- `rollback_target_reference`: production deploy run `22839461795`
- `verification_owner`: `PLAYER1-r7`

Step 2 dispatch rule:

- step 2 must use the exact build/staging evidence pair above
- if rollback target reference changes before production deploy starts, update this issue record first

## Live Reflection Verification Checklist

- [x] production deploy run URL is recorded
- [x] `portal-production-deployment-record` artifact is recorded
- [x] public URL `https://www.aws.ashnova.jp` is checked after deploy
- [x] route-level verification includes `/`, `/overview`, and `/guidance`
- [x] changed browser-facing copy is visible on the public portal
- [x] evidence path and public verification result point to the same rollout batch

Checklist rule:

- 1 項目でも欠ける場合は live reflection included を宣言しない
- missing public verification forces deploy-ready/local-only handoff instead of Done
- checklist completion confirms public reflection evidence only; it does not replace rollback or monitoring procedures

## Deploy-Ready / Local-Only Handoff Template

```text
Portal Live Reflection Handoff

- Issue: #106
- Status: deploy-ready/local-only
- Reason live reflection was not performed: <value>
- Handoff owner: <value>
- Local validation evidence: npm run test:baseline passed; npm run build passed
- Next action: <value>
- Note: local validation is deploy-ready evidence only; public portal reflection remains unverified
```

## Step 1 Promotion Candidate Comment Template

```text
Portal Live Reflection Step 1

- Issue: #106
- Candidate commit SHA: <value>
- portal-build run ID: <value>
- portal-staging-deploy run ID: <value>
- Includes current portal copy update: yes | no
- Ready for production deploy: yes | no
- Note: step 1 confirms a main-based promotion candidate only; it does not confirm public portal reflection
```

## Live Reflection Evidence Comment Template

```text
Portal Live Reflection Verification

- Issue: #106
- Deploy Run URL: <value>
- Deployment Record Artifact: portal-production-deployment-record
- Public URL Checked: https://www.aws.ashnova.jp
- Route Verification: / | /overview | /guidance | <changed-route-if-needed>
- Browser-Facing Copy Reflected: yes | no
- Result: pass | fallback-to-deploy-ready-local-only
- Note: live reflection verification confirms public portal visibility for this rollout batch; it does not replace rollback or monitoring evidence
```

## Combined Step 2 Plus Step 3 Comment Template

```text
Portal Live Reflection Verification

- Issue: #106
- Candidate commit SHA: <value>
- portal-build run ID: <value>
- portal-staging-deploy run ID: <value>
- Deploy Run URL: <value>
- Deployment Record Artifact: portal-production-deployment-record
- Public URL Checked: https://www.aws.ashnova.jp
- Route Verification: / | /overview | /guidance | <changed-route-if-needed>
- Browser-Facing Copy Reflected: yes | no
- Result: pass | fallback-to-deploy-ready-local-only
- Note: this record confirms either same-batch public reflection or explicit fallback to local-only handoff; it does not replace rollback or monitoring evidence
```

## Completed Step 2 Evidence

- `portal-production-deploy` run ID: `22910302949`
- Deploy Run URL: `https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22910302949`
- Deployment Record Artifact: `portal-production-deployment-record`
- Source build run ID: `22910183364`
- Staging verification run ID: `22910230433`
- Rollback target reference: `https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22839461795`
- Production reachability results recorded in artifact: `/`, `/overview`, `/guidance` all `200 / passed`

## Completed Public Verification Snapshot

- Public URL checked: `https://www.aws.ashnova.jp`
- Additional route checks: `/overview`, `/guidance`, `/status`
- Route result: all checked routes returned `HTTP 200` and the production HTML shell loaded `assets/index-BW80L7rV.js`
- Bundle match result: deployed `assets/index-BW80L7rV.js` checksum matched the local build artifact checksum `aa14d080f61667c67a156b048d61f83655207c3f008faf337bffe859c004f626`
- Reflection conclusion: the production portal is serving the same bundle produced from commit `0991807895733669afb88dd592c42b07dd4817b3`, so the current browser-facing portal copy batch is reflected live

## Completed Verification Comment

```text
Portal Live Reflection Verification

- Issue: #106
- Candidate commit SHA: 0991807895733669afb88dd592c42b07dd4817b3
- portal-build run ID: 22910183364
- portal-staging-deploy run ID: 22910230433
- Deploy Run URL: https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22910302949
- Deployment Record Artifact: portal-production-deployment-record
- Public URL Checked: https://www.aws.ashnova.jp
- Route Verification: / | /overview | /guidance | /status
- Browser-Facing Copy Reflected: yes
- Result: pass
- Note: this record confirms same-batch public reflection for the current portal copy update; it does not replace rollback or monitoring evidence
```

## Current Recommended Next Action

- step 1, step 2, and step 3 evidence are now recorded on this issue
- no additional deploy work is required for the current portal copy batch
- keep rollback and monitoring follow-up on their existing evidence paths; do not reopen this issue for unrelated portal changes

## Pre-Deploy Freeze Note

- Issue 106 should be treated as the single execution record before deploy starts
- do not create an additional portal live-reflection child issue for the same copy update batch
- when step 1 becomes true, update this issue first, then start step 2 from the same record

## Non-Goals

- portal copy rewrite
- canonical docs rewrite
- AWS infrastructure redesign
- custom-domain cutover redesign
- rollback redesign
- implicit deploy completion from local validation only

## Current Status

- CLOSED
- GitHub Issue: #106
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/106
- Sync Status: synced to GitHub and closed
- Step 1 status: completed with commit `0991807895733669afb88dd592c42b07dd4817b3`, build run `22910183364`, and staging run `22910230433`
- Step 2 status: completed with production deploy run `22910302949`
- Step 3 status: live reflection included evidence recorded; close condition satisfied and issue closed

- separate issue boundary for portal live reflection has been created
- local validation and public reflection are explicitly split
- this issue now contains the completed production deploy verification record for the current portal copy batch
