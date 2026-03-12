## Summary

Issue 56 で GCP preview rollback and recovery memo は artifact rollback、resource correction、DNS/operator rollback の単位に固定され、Issue 65 では production-equivalent execution boundary として destructive rollback が separate approval target に残された。一方で、destructive rollback implementation をどの実装形で次段に残すかは未決定のままであり、review-only rollback pack、destructive rollback checklist、automation-first destructive rollback のどれを next hardening candidate にするかを comparison issue として切り出す必要がある。

## Goal

GCP destructive rollback implementation の comparison を整理し、Issue 56 の rollback unit と Issue 65 の destructive boundary を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-89
- Title: GCP destructive rollback implementation comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview / production-equivalent destructive rollback comparison
- Priority: medium
- Predecessor: Issue 56 closed, Issue 65 closed, Issue 68 closed

Objective
- Problem to solve: Issue 56 と Issue 65 で rollback / safe-stop / destructive boundary は fixed したが、destructive rollback implementation を review-only rollback pack、destructive rollback checklist、automation-first destructive rollback のどれで進めるかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の review boundary を fixed し、current rollback discipline と destructive boundary を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、review boundary、operator invocation shape、Issue 56 compatibility、Issue 65 destructive boundary compatibility、recommended next step
- Out of scope: live destroy execution、automatic rollback 実装、DNS provider automation、incident command redesign、production traffic experiment
- Editable paths: docs/portal/issues/issue-89-gcp-destructive-rollback-implementation-comparison.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が Issue 56 rollback memo と Issue 65 destructive boundary と矛盾しない
- [x] AC-3: current favorite の review boundary と operator invocation shape が読める
- [x] AC-4: live destroy execution や automation-first destructive rollback を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-89, cloud status summary
- Approach: Issue 56 の rollback units と Issue 65 の destructive boundary を入力に、review-only destructive rollback pack、destructive rollback checklist、automation-first destructive rollback の 3 候補を safety boundary、reviewability、operational overhead、live compatibility で比較する
- Alternative rejected and why: いきなり live destructive rollback execution に進む案は current approval boundary を unnecessarily collapse し、review planning と destroy verification を同時に抱え込むため採らない

Validation Plan
- Commands to run: get_errors on issue-89 and updated cloud status summary markdown
- Expected results: candidate comparison、recommended next step、current favorite review contract が読める
- Failure triage path: Issue 56 rollback memo と Issue 65 destructive boundary を再照合し、candidate が safe-stop / separate approval target / rollback unit rule を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live destructive rollback 承認や destroy plan approval の記録に誤読されること
- Impact area: rollback safety, evidence retention, operator review path
- Mitigation: comparison を reviewable destructive rollback candidate selection に限定し、live destroy と automatic rollback は non-goals に残す
- Rollback: candidate comparison が広がりすぎた場合は comparison table だけを残し、recommended next step を保留する
```

## Tasks

- [x] implementation candidate を列挙する
- [x] comparison table を整理する
- [x] recommended next execution shape を固定する
- [x] current favorite の review contract draft を整理する
- [x] non-goals を明文化する

## Definition of Done

- [x] candidate comparison が 1 文書で読める
- [x] recommended next execution shape が Issue 56 rollback memo と Issue 65 destructive boundary に接続している
- [x] current favorite の review boundary と operator invocation shape が 1 文書で読める
- [x] live destroy execution、automatic rollback、DNS automation が非対象のまま維持されている

## Initial Notes

- Issue 56 は rollback unit、safe-stop、resource correction、DNS/operator rollback、automatic rollback 非対象を固定した
- Issue 65 は destructive rollback / live destroy / credential cleanup を separate approval target に固定した
- current phase で比較対象にできるのは live destroy を伴わず、destructive rollback candidate をどう reviewable に整理するかである

## Candidate Comparison Draft

### Candidate 1: review-only destructive rollback pack

- repository owner が destructive rollback trigger、preconditions、evidence retention inputs、fallback note を single issue record にまとめる
- safety と reviewability は高く、次 execution issue への handoff も明確にできる

### Candidate 2: destructive rollback checklist

- actual pack まで作らず、destructive rollback readiness と non-goals の checklist に留める
- current boundary は最も守りやすいが、execution handoff が弱くなりやすい

### Candidate 3: automation-first destructive rollback

- scripted destroy や workflow rollback path を前提に比較する
- operational automation は進むが、live destroy と approval boundary の risk が広がりやすい

## Comparison Table

| Candidate                             | Safety boundary            | Live compatibility | Reviewability | Operational overhead | Current-phase judgment   |
| ------------------------------------- | -------------------------- | ------------------ | ------------- | -------------------- | ------------------------ |
| review-only destructive rollback pack | 高い                       | 高い               | 高い          | 中                   | current favorite         |
| destructive rollback checklist        | 最も安全                   | 高い               | 中            | 低い                 | fallback candidate       |
| automation-first destructive rollback | live destroy risk が広がる | 低い               | 中            | 高い                 | current phase では非対象 |

Comparison rule:

- candidate comparison は reviewable destructive rollback candidate selection に限定する
- output は Issue 56 の rollback memo と Issue 65 の destructive boundary を前提にする必要がある
- candidate が live destroy execution、automatic rollback、provider DNS automation を要求する場合は current phase で除外する
- safe-stop と separate approval target を崩す candidate は採らない

## Recommended Next Execution Shape

- current phase の recommended next execution shape は review-only destructive rollback pack を第一候補とする
- 理由は、checklist のみより execution handoff を前進させつつ、automation-first destructive rollback ほど live destroy boundary を広げないためである
- review-only destructive rollback pack は destructive rollback trigger、preconditions、evidence retention、fallback note を current issue record にまとめるだけに留め、actual destroy は separate execution issue に残す
- destructive rollback checklist は fallback candidate として維持し、automation-first destructive rollback は current phase では comparison-only に留める

## Rollback Pack Review Contract Draft

current favorite として扱う review-only destructive rollback pack は、次の boundary に限定する。

### Required inputs

- `rollback_scope`: resource correction / DNS rollback / destructive boundary reference などの reviewed scope
- `baseline_reference`: Issue 56 と Issue 65 の reviewed evidence path
- `rollback_trigger_type`: severe-recovery-failure / destructive-boundary-review / ownership-approved-recovery-stop などの review trigger
- `fallback_note`: destructive rollback 不採用時に keep current rollback boundary を維持する note

### Allowed derived data

- reviewed rollback inventory labels
- pre/post validation checkpoints
- rollback rationale summary

### Required output

- output は rollback inventory summary と review checkpoint text block のみとする
- output には live destroy command、approval grant、execution order shortcut、automatic rollback trigger を含めない
- output は current issue record から predecessor evidence へ戻れる reference path を持つ

### Operator invocation shape

- operator は reviewed baseline evidence を開いた上で、rollback scope ごとの review note を current issue record に追記する
- pack は review-only を前提とし、resource destroy や DNS action を直接実行しない
- same issue record 内で keep / reject / follow-up-needed の比較結果を残せる形にする

### Contract rule

- rollback pack は one review pack, one baseline reference を維持する
- output が Issue 56 / 65 boundary を undermine する場合は current favorite として採らない
- separate approval target rule と矛盾する candidate は reject する

## Review Pack Gate

- required inputs が reviewed values として揃っている
- rollback scope が baseline reference と接続している
- output が baseline reference と fallback note を含んでいる
- output が live destroy command、approval grant、automatic rollback trigger を要求しない
- safe-stop と separate approval target rule に矛盾しない

Gate outcome:

- gate を満たした場合のみ、review-only destructive rollback pack を next execution issue の第一候補として維持する
- gate を満たさない場合は destructive rollback checklist を fallback candidate として優先する

Current child follow-up:

- Issue 90: review-only destructive rollback pack execution

## Non-Goals

- live destructive rollback execution
- automatic rollback implementation
- provider DNS automation
- approval grant automation
- incident response redesign
- production traffic experiment

## Current Sync State

- GitHub body | child follow-up Issue 90 を追加した current local record | synced 状態
- Boundary | comparison record のみ; execution は Issue 90 に委任

## Current Status

- CLOSED
- GitHub Issue: #89
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/89
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 56 / Issue 65 の destructive boundary を destructive rollback comparison issue として切り出した
- review-only destructive rollback pack、destructive rollback checklist、automation-first destructive rollback の 3 候補を current-phase boundary 内で比較した
- current favorite として review-only destructive rollback pack の review boundary と gate を追加した
- current child follow-up として Issue 90 を追加し、execution issue への handoff を固定した
