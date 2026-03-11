## Summary

current portal-web は AWS / GCP の current state を cross-cloud summary surface として返しているが、次段では AWS hostname では AWS 向け portal view、GCP hostname では GCP 向け portal view を表示したい。この変更を実装先行で始めると、hostname mapping、shared route boundary、fallback behavior、delivery strategy が曖昧なまま code と deploy issue が増えやすい。

## Goal

portal cloud-specific variant の design boundary を固定し、hostname mapping、runtime detection strategy、shared vs cloud-specific copy split、fallback behavior、delivery impact を 1 issue で読めるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-108
- Title: portal cloud-specific variant design and delivery strategy を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: planning
- Priority: medium
- Predecessor: Issue 106 closed, Issue 107 closed, PORTAL-CLOUD-VARIANT-FRESH-BATCH-2026-03-11 local contract added

Objective
- Problem to solve: cloud-specific portal view を始める前に、hostname mapping、runtime variant selection、shared route boundary、fallback behavior、delivery impact が未固定である
- Expected value: local implementation と AWS/GCP live reflection を separate issue で進められるだけの design boundary を先に固定できる

Scope
- In scope: hostname mapping、runtime detection candidate、shared route structure 維持条件、cloud-specific copy split、generic local fallback、delivery impact summary
- Out of scope: portal code implementation、infra/workflow changes、production deploy 実行、Issue 106/107 reopen
- Editable paths: docs/portal/issues/issue-108-portal-cloud-specific-variant-design-and-delivery-strategy.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: hostname-to-variant mapping が 1 issue で読める
- [x] AC-2: runtime hostname-aware strategy と non-goals が読める
- [x] AC-3: shared route structure を維持したまま cloud-specific copy を split する boundary が読める

Implementation Plan
- Files likely to change: docs/portal/issues/issue-108-portal-cloud-specific-variant-design-and-delivery-strategy.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: current shared portal surface と Issue 106/107 の live reflection boundary を入力に、host-aware variant selection を first strategy として固定する
- Alternative rejected and why: AWS/GCP separate app build strategy は first batch の drift risk と delivery complexity を増やしすぎるため採らない

Validation Plan
- Commands to run: get_errors on issue-108 and updated cloud status summary
- Expected results: markdown diagnostics がなく、mapping、strategy、fallback、next execution split が読み取れる
- Failure triage path: apps/portal-web/src/main.ts の current shared route model と docs/portal/21_PORTAL_UPDATE_WORKFLOW.md の live reflection rule を再照合し、design issue が implementation detail に寄りすぎていないか切り分ける

Risk and Rollback
- Risks: design issue が immediate live change approval や app fork decision と誤読されること
- Impact area: portal planning, delivery complexity, review traceability
- Mitigation: runtime strategy、mapping、fallback、issue split に対象を限定し、implementation と live reflection は後続 issue に分ける
- Rollback: strategy disagreement が解けない場合は hostname mapping と generic fallback だけを残し、delivery strategy decision は separate follow-up に切り出す
```

## Design Questions To Fix

- which hostname maps to which variant
- whether route structure remains shared
- whether variant selection happens at runtime or build time
- what local / unknown-host fallback should display
- which route elements are shared and which are cloud-specific

## Current Recommended Answers

- `www.aws.ashnova.jp` serves AWS portal variant
- `www.gcp.ashnova.jp` and `preview.gcp.ashnova.jp` serve GCP portal variant
- route structure remains shared for `/`, `/overview`, `/guidance`, `/platform`, `/delivery`, `/operations`, `/status`
- variant selection happens at runtime from hostname
- local dev and unknown host serve a generic local preview variant instead of defaulting to AWS or GCP

## Fixed Design Decision

- variant identity is decided from `window.location.hostname` at runtime inside the shared portal app
- hostname mapping is fixed as AWS=`www.aws.ashnova.jp`, GCP=`www.gcp.ashnova.jp` and `preview.gcp.ashnova.jp`, fallback=`generic local preview`
- route inventory stays shared so existing portal navigation, validation flow, and live reflection checks can be reused
- cloud-specific variance is limited to route copy, status emphasis, action labels, hero summary, and status-card content
- unknown host must not silently impersonate AWS or GCP because that would blur preview validation and operator review

## Shared vs Cloud-Specific Boundary

shared:

- route skeleton
- navigation structure
- rendering primitives
- validation baseline

cloud-specific:

- hero summary
- status emphasis
- platform / operations wording
- status cards and action labels
- route notes and cloud-facing guidance copy

## Non-Goals For This Batch

- no separate AWS and GCP app builds
- no route split by cloud namespace such as `/aws/*` or `/gcp/*`
- no DNS redesign or hostname expansion
- no infra or workflow mutation inside this design issue
- no live reflection claim; browser-facing verification remains in Issue 110 and Issue 111

## Delivery Impact Boundary

- first batch does not require separate app builds
- first batch does not require DNS or hostname redesign
- first batch does not require new routes
- browser-facing copy change still requires separate live reflection issues after local implementation

## Implementation Handoff To Issue 109

- add a small hostname-to-variant resolver in the shared portal runtime
- move route copy to a model that can express shared copy plus variant overrides
- keep build and route validation behavior unchanged for the shared route set
- treat generic local preview as the default for localhost and unknown hosts so local validation stays explicit

## Validation Result

- current contract, cloud status summary, and current portal route model were re-read together
- hostname mapping, runtime strategy, fallback behavior, and shared-route boundary are now fixed in this record
- implementation and live reflection remain split into Issue 109, Issue 110, and Issue 111

## Execution Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: fix the design boundary for cloud-specific portal variants before code implementation starts
Outcome: Done
Actions taken: current portal route model reread | hostname mapping fixed | runtime detection strategy fixed | shared-vs-cloud-specific boundary fixed | implementation handoff narrowed to Issue 109
Evidence: docs/portal/23_PORTAL_CLOUD_SPECIFIC_VARIANT_FRESH_TASK_CONTRACT.md reviewed | docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md reviewed | apps/portal-web/src/main.ts shared route model reviewed
Risks or blockers: no live reflection evidence is created by this issue because browser-facing verification remains split by cloud
Next action: execute Issue 109 to add runtime hostname detection and a variant-aware content model without changing the shared route inventory
```

## Next Split

- Issue 109: local implementation
- Issue 110: AWS live reflection
- Issue 111: GCP live reflection

## Current Status

- CLOSED
- GitHub Issue: #108
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/108
- Sync Status: synced to GitHub and closed
