# Portal Cloud-Specific Variant Fresh Task Contract

## Summary

current portal-web は AWS / GCP の current state を 1 つの shared summary surface として表示している。一方で、browser-facing portal surface を次段で進めるなら、AWS hostname では AWS 向け portal view、GCP hostname では GCP 向け portal view を返す形へ進めた方が、cloud identity と operator expectation を合わせやすい。この変更を ad hoc に始めると、shared route structure、host 判定、deploy path、live reflection evidence が再び混線しやすい。

## Goal

AWS 向け portal view と GCP 向け portal view を fresh batch として切り出し、design boundary、local implementation、AWS live reflection、GCP live reflection を別 issue で安全に追跡できるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: PORTAL-CLOUD-VARIANT-FRESH-BATCH-2026-03-11
- Title: portal cloud-specific variant batch の fresh follow-up task contract を作成する
- Requester: repository owner
- Target App: portal-web
- Environment: local frontend / AWS production portal / GCP production-equivalent portal
- Priority: medium
- Predecessor: Issue 106 closed, Issue 107 closed

Objective
- Problem to solve: current portal は同じ shared surface を AWS/GCP 両 hostname で返しているため、cloud identity ごとの browser-facing view を分けるには host 判定、content split、deploy verification の boundary を先に固定する必要がある
- Expected value: runtime cloud detection と cloud-specific portal copy を同じ app 内で安全に扱い、local implementation と AWS/GCP live reflection を別 evidence path で追跡できる

Scope
- In scope: hostname-to-variant mapping、shared vs cloud-specific route copy boundary、runtime detection strategy、fresh issue chain、live reflection issue split
- Out of scope: new cloud resource creation、DNS redesign、new route creation、Issue 106/107 reopen、framework migration
- Editable paths: docs/portal/23_PORTAL_CLOUD_SPECIFIC_VARIANT_FRESH_TASK_CONTRACT.md, docs/portal/issues/issue-108-portal-cloud-specific-variant-design-and-delivery-strategy.md, docs/portal/issues/issue-109-portal-runtime-cloud-detection-and-content-model-implementation.md, docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/ (planning phase only)

Acceptance Criteria
- [ ] AC-1: cloud-specific portal variant batch の boundary が 1 文書で読める
- [ ] AC-2: design、local implementation、AWS live reflection、GCP live reflection の 4 issue split が読める
- [ ] AC-3: current portal update workflow と live reflection split rule を壊さない

Implementation Plan
- Files likely to change: docs/portal/23_PORTAL_CLOUD_SPECIFIC_VARIANT_FRESH_TASK_CONTRACT.md, docs/portal/issues/issue-108-portal-cloud-specific-variant-design-and-delivery-strategy.md, docs/portal/issues/issue-109-portal-runtime-cloud-detection-and-content-model-implementation.md, docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: current portal summary surface と Issue 106/107 live reflection records を入力に、shared app のまま hostname-aware variant selection を first candidate とした fresh issue chain を追加する
- Alternative rejected and why: AWS/GCP で app build 自体を fork する案は delivery complexity と drift risk を早期に増やしすぎるため first batch では採らない

Validation Plan
- Commands to run: get_errors on the new markdown files and updated cloud status summary
- Expected results: markdown diagnostics がなく、issue chain と runtime strategy boundary が読み取れる
- Failure triage path: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md と Issue 106/107 を再照合し、local implementation と live reflection の split が崩れていないか切り分ける

Risk and Rollback
- Risks: cloud-specific portal variant batch が app fork や immediate live deploy approval に見えること
- Impact area: portal delivery discipline, browser-facing wording, review traceability
- Mitigation: design issue と local implementation issue を live reflection issues より先に切り、browser-facing copy change の live verification は AWS/GCP で separate execution issue に残す
- Rollback: scope が広がりすぎた場合は design issue と local implementation issue だけを残し、live reflection issues は実装完了後に再起票する
```

## Hostname Mapping Baseline

- `https://www.aws.ashnova.jp` -> AWS portal variant
- `https://www.gcp.ashnova.jp` -> GCP portal variant
- `https://preview.gcp.ashnova.jp` -> GCP portal variant
- unknown host or local dev host -> generic local preview variant

## First Strategy Choice

- first batch は separate builds ではなく runtime hostname-aware variant selection を第一候補とする
- route structure は shared のまま維持し、copy、status emphasis、action labels、status cards の出し分けを variant layer で制御する
- host 判定不能時は AWS/GCP のどちらかに寄せず、generic local preview variant を返す

## Fresh Issue Chain

1. Issue 108: portal cloud-specific variant design and delivery strategy
2. Issue 109: portal runtime cloud detection and content model implementation
3. Issue 110: AWS portal variant live reflection execution
4. Issue 111: GCP portal variant live reflection execution

## Execution Rule

- Issue 108 closes only when hostname mapping、variant boundary、fallback behavior、delivery strategy が固定される
- Issue 109 is local-only until validation passes and a reviewed promotion candidate exists
- Issue 110 verifies only AWS public portal reflection for the selected commit
- Issue 111 verifies only GCP public portal reflection for the selected commit
- browser-facing copy change is not Done until Issue 110 and Issue 111 are each resolved or explicitly handed off

## Current Status

- LOCAL CONTRACT ADDED
- GitHub Issue: not-applicable
- Sync Status: local record only

- fresh batch boundary for cloud-specific portal variants is now defined locally
- next step is to create the design issue before any portal implementation change starts
