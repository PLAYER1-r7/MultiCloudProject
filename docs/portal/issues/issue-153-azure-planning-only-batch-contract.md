# Summary

Azure support remains planning-only until 2026-04 because current cost pressure and execution focus do not justify live Azure resource expansion during March. What is missing now is not another generic note, but a single fresh batch contract that narrows the March work to cost guardrail judgment、IaC/workflow planning、identity portability、evidence portability、and rollback portability, while explicitly excluding actual resource apply and live rollout.

この issue の役割は Azure implementation を始めることではなく、2026-04 reopen gate までに何を fixed judgment として整えるべきかを reviewable batch として整理し、April 以降の execution が ad hoc に始まらないようにすることである。

# Goal

Azure planning-only batch の deliverable、dependency order、cost gate、portability boundary、evidence shape、non-goals を 1 issue でレビュー可能な形に整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-153
- Title: Azure planning-only batch contract を整理する
- Requester: repository owner
- Target App: portal-web and future cloud delivery / service planning
- Environment: planning
- Priority: medium
- Predecessor: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md accepted as the current Azure defer-until-April planning reference

Objective
- Problem to solve: Azure は 2026-04 まで implementation defer judgment がある一方で、cost guardrail、IaC/workflow boundary、identity portability、observability/rollback portability をどこまで March 中に fixed judgment にするかが batch 単位では未固定であり、April reopen 時に scope が ad hoc になりやすい
- Expected value: March 中は planning-only として扱う deliverable と non-goals を明文化し、April reopen 前に必要な cost gate、portability boundary、evidence model を narrow batch として固定できる
- Terminal condition: cost guardrail、IaC/workflow planning、identity portability、observability/rollback portability、April reopen gate、non-goals が fixed judgment として読め、live Azure execution を開始せずに planning batch を完了できる

Scope
- In scope: Azure cost guardrail、defer-until-April gate、IaC topology planning、workflow and evidence contract planning、identity and secret portability、observability and rollback portability
- Out of scope: Azure resource apply、live environment creation、production traffic cutover、provider lock-in execution、stateful SNS implementation on Azure
- Editable paths: docs/portal/issues/issue-153-azure-planning-only-batch-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: March 中に扱う planning-only deliverable が明文化されている
- [ ] AC-2: cost guardrail と April reopen gate が読み取れる
- [ ] AC-3: IaC/workflow、identity/secret、observability/rollback portability の planning boundary が読み取れる
- [ ] AC-4: live Azure execution が non-goal として明確に切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-153-azure-planning-only-batch-contract.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md の Azure preparation issue candidates と blocker list を継承し、March planning-only batch と April reopen gate を fresh issue として再構成する
- Alternative rejected and why: Azure preparation candidates をバラバラの loose notes として残す案は、April reopen 時の entry condition と non-goal boundary が読み取りにくいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、deliverable、cost gate、portability boundary、April reopen gate、non-goals が issue 単位で読める
- Failure triage path: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md と docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md を照合し、cost gate、planning boundary、portability scope、non-goals のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: planning-only batch が implementation-ready 以上に広がって March 中に live Azure work を呼び込むか、逆に narrow すぎて April reopen に必要な portability boundary を残せないこと
- Impact area: cloud roadmap, cost governance, portability planning, April execution readiness
- Mitigation: batch は cost gate、portability boundary、evidence model に限定し、resource apply と live rollout は non-goal に固定する
- Rollback: scope が広がりすぎた場合は cost guardrail、April reopen gate、IaC/workflow planning、identity portability の 4 点だけを残し、observability depth や service-family detail は separate issue へ分離する
```

# Tasks

- [ ] March planning-only deliverable を fixed judgment にする
- [ ] cost guardrail and April reopen gate を fixed judgment にする
- [ ] IaC/workflow portability boundary を fixed judgment にする
- [ ] identity/secret and observability/rollback portability を fixed judgment にする
- [ ] live Azure non-goals を明文化する

# Definition of Done

- [ ] March 中にやる planning-only work とやらない live work が読める
- [ ] cost ceiling と April reopen gate が読める
- [ ] IaC/workflow and evidence portability boundary が読める
- [ ] identity/secret と observability/rollback の portability scope が読める
- [ ] live Azure environment creation や resource spend が non-goal として切り分けられている

# Batch Intent

- keep Azure in planning-only mode during March
- fix the minimum decisions needed to reopen Azure execution in April without ad hoc scope drift
- protect the current cost boundary by excluding all live Azure resource work from this batch

# Provisional Direction

- March batch の completion line は cost guardrail judgment、April reopen criteria、IaC/workflow portability plan、identity/secret portability notes、observability/rollback portability notes に置く
- Azure service-family detail should stay planning-level until SNS auth/API/data contracts are stable enough to map safely
- evidence shape should stay aligned with the existing build, deploy, verification, and rollback record model used by the current multi-cloud workflows
- identity and secret planning should avoid provider-specific naming leaking into app-side contracts
- live preview, live deploy, and live cost spend remain outside the batch until the April gate is intentionally reopened

# Deliverable Boundary

next batch の minimum deliverable は次の通りとする。

- a clear Azure cost guardrail and defer-until-April judgment
- a planning-level Azure IaC topology and workflow/evidence portability outline
- an identity and secret portability boundary that does not force provider-specific app contracts
- an observability and rollback portability outline that can connect to later Azure execution
- a documented April reopen gate with explicit go/no-go conditions

# Dependency Order Candidate

1. fix the March cost guardrail and April reopen conditions
2. define the planning-only IaC topology and workflow/evidence boundary
3. define identity and secret portability assumptions
4. define observability and rollback portability assumptions
5. defer all live Azure execution until the reopen gate is explicitly passed

# Completion Signal Candidate

next batch is complete when the following all hold.

- March planning-only work is explicitly separated from live Azure execution
- cost ceiling and reopen conditions are documented in a reviewable way
- IaC/workflow and evidence portability boundaries are readable without requiring resource apply
- identity/secret and observability/rollback portability assumptions are documented for later execution
- the batch does not start live Azure resource creation or cloud spend expansion

# Fail Conditions Candidate

the batch is not complete if any of the following remain true.

- March work still implies live Azure resource creation or rollout
- cost ceiling and April reopen gate remain implicit or ambiguous
- IaC/workflow portability and evidence shape are not documented enough to guide April execution
- identity or secret assumptions leak provider-specific lock-in into app contracts prematurely

# Follow-On Non-Goals Candidate

- Azure live resource apply
- Azure preview or production environment creation
- live traffic cutover
- SNS backend implementation on Azure
- provider-final selection execution beyond planning-level comparison

# Downstream Use

- April reopen decisions should inherit this issue as the planning-only baseline rather than redefining the March boundary
- Azure IaC, workflow, and portability follow-ups should derive their entry condition from this issue
- SNS/Azure combined planning should use this issue to keep Azure execution separate from current SNS production-hardening work

# Current Status

- local draft created and published to GitHub as Issue #137
- this record is now the accepted GitHub-tracked planning queue entry for the March Azure planning-only batch
- GitHub Issue: #137
- Sync Status: synced to GitHub as open planning issue

# Dependencies

- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
