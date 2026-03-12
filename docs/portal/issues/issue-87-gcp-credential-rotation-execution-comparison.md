## Summary

Issue 54 で GCP preview credential / secret boundary は preview 専用 GitHub environment scope と managed secret path 前提に固定され、Issue 52 では preview workflow execution が current environment wiring を含めて確認された。一方で、credential rotation execution をどの実装形で次段に残すかは未決定のままであり、manual owner-reviewed rotation pack、review-only rotation checklist、automation-first rotation のどれを next hardening candidate にするかを comparison issue として切り出す必要がある。

## Goal

GCP credential rotation execution の implementation comparison を整理し、Issue 54 の credential boundary と Issue 52 の workflow/environment evidence を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-87
- Title: GCP credential rotation execution comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview credential rotation comparison
- Priority: medium
- Predecessor: Issue 52 closed, Issue 54 closed, Issue 68 closed

Objective
- Problem to solve: Issue 54 で preview credential / secret boundary は fixed したが、credential rotation execution を manual owner-reviewed pack、review-only checklist、automation-first rotation のどれで進めるかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の review boundary を fixed し、current workflow / environment evidence を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、review boundary、operator invocation shape、Issue 54 compatibility、Issue 52 workflow/environment compatibility、recommended next step
- Out of scope: live credential rotation 実行、provider credential mutation、GitHub environment rewrite automation、Secret Manager redesign、incident response redesign
- Editable paths: docs/portal/issues/issue-87-gcp-credential-rotation-execution-comparison.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が Issue 54 credential boundary と矛盾しない
- [x] AC-3: current favorite の review boundary と operator invocation shape が読める
- [x] AC-4: live credential mutation や automation-first execution を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-87, cloud status summary
- Approach: Issue 54 の preview credential boundary と Issue 52 の workflow / environment evidence を入力に、manual owner-reviewed rotation pack、review-only rotation checklist、automation-first rotation の 3 候補を safety boundary、reviewability、operational overhead、live compatibility で比較する
- Alternative rejected and why: いきなり live credential rotation execution に進む案は current workflow / environment state を unnecessarily disturb し、rotation planning と execution verification を同時に抱え込むため採らない

Validation Plan
- Commands to run: get_errors on issue-87 and updated cloud status summary markdown
- Expected results: candidate comparison、recommended next step、current favorite review contract が読める
- Failure triage path: Issue 54 の credential boundary と Issue 52 の environment evidence を再照合し、candidate が current secret scope や workflow path を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live credential change や provider access refresh 承認の記録に誤読されること
- Impact area: credential safety, workflow continuity, operator review path
- Mitigation: comparison を reviewable rotation candidate selection に限定し、live mutation と automation-first execution は non-goals に残す
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
- [x] recommended next execution shape が Issue 54 boundary と Issue 52 evidence に接続している
- [x] current favorite の review boundary と operator invocation shape が 1 文書で読める
- [x] live credential mutation、provider access refresh、automation-first rollout が非対象のまま維持されている

## Initial Notes

- Issue 54 は preview credential / secret boundary を preview 専用 GitHub environment scope と managed secret path 前提に固定した
- Issue 52 は preview workflow execution で `gcp-preview` environment variable 群と workload identity provider wiring が確認済みであることを記録した
- current phase で比較対象にできるのは live secret rewrite を伴わず、rotation candidate をどう reviewable に整理するかである

## Candidate Comparison Draft

### Candidate 1: manual owner-reviewed rotation pack

- repository owner が current credential inventory、rotation trigger、pre/post checks、fallback note を single issue record にまとめる
- safety と reviewability は高いが、operator の手作業負荷は中程度になる

### Candidate 2: review-only rotation checklist

- actual rotation pack まで作らず、rotation readiness と non-goals の checklist に留める
- current boundary は最も守りやすいが、次 execution issue への handoff が弱くなりやすい

### Candidate 3: automation-first rotation

- workflow or script 主体で rotation sequence と environment update を進める前提で比較する
- operational automation は進むが、live credential mutation と verification burden が広がりやすい

## Comparison Table

| Candidate                           | Safety boundary        | Live compatibility | Reviewability | Operational overhead | Current-phase judgment   |
| ----------------------------------- | ---------------------- | ------------------ | ------------- | -------------------- | ------------------------ |
| manual owner-reviewed rotation pack | 高い                   | 高い               | 高い          | 中                   | current favorite         |
| review-only rotation checklist      | 最も安全               | 高い               | 中            | 低い                 | fallback candidate       |
| automation-first rotation           | live mutation が広がる | 低い               | 中            | 高い                 | current phase では非対象 |

Comparison rule:

- candidate comparison は reviewable rotation candidate selection に限定する
- output は Issue 54 の credential boundary と Issue 52 の workflow / environment evidence を前提にする必要がある
- candidate が live credential rewrite、environment mutation automation、provider credential refresh を要求する場合は current phase で除外する
- current workflow continuity を崩す candidate は採らない

## Recommended Next Execution Shape

- current phase の recommended next execution shape は manual owner-reviewed rotation pack を第一候補とする
- 理由は、review-only checklist より execution handoff を前進させつつ、automation-first rotation ほど live mutation boundary を広げないためである
- manual owner-reviewed rotation pack は credential inventory、rotation trigger、pre/post validation、fallback note を current issue record にまとめるだけに留め、actual rotation は separate execution issue に残す
- review-only rotation checklist は fallback candidate として維持し、automation-first rotation は current phase では comparison-only に留める

## Rotation Pack Review Contract Draft

current favorite として扱う manual owner-reviewed rotation pack は、次の boundary に限定する。

### Required inputs

- `credential_scope`: workload identity provider / service account / environment variable reference などの reviewed scope
- `baseline_reference`: Issue 54 と Issue 52 の reviewed evidence path
- `rotation_trigger_type`: periodic / security-review / ownership-change などの review trigger
- `fallback_note`: rotation 不採用時に current credential boundary を維持する note

### Allowed derived data

- reviewed credential inventory labels
- pre/post validation checkpoints
- rotation rationale summary

### Required output

- output は credential inventory summary と review checkpoint text block のみとする
- output には live secret value、provider login command、environment rewrite command、execution approval を含めない
- output は current issue record から predecessor evidence へ戻れる reference path を持つ

### Operator invocation shape

- operator は reviewed baseline evidence を開いた上で、credential scope ごとの review note を current issue record に追記する
- pack は review-only を前提とし、GitHub environment や provider state を直接変更しない
- same issue record 内で keep / reject / follow-up-needed の比較結果を残せる形にする

### Contract rule

- rotation pack は one review pack, one baseline reference を維持する
- output が Issue 54 boundary を undermine する場合は current favorite として採らない
- current workflow continuity と矛盾する candidate は reject する

## Review Pack Gate

- required inputs が reviewed values として揃っている
- credential scope が baseline reference と接続している
- output が baseline reference と fallback note を含んでいる
- output が live secret value、provider login command、environment rewrite command、execution approval を要求しない
- current workflow continuity と矛盾しない

Gate outcome:

- gate を満たした場合のみ、manual owner-reviewed rotation pack を next execution issue の第一候補として維持する
- gate を満たさない場合は review-only rotation checklist を fallback candidate として優先する

Current child follow-up:

- Issue 88: manual owner-reviewed rotation pack execution

## Non-Goals

- live credential rotation execution
- provider access refresh automation
- GitHub environment rewrite automation
- secret value disclosure
- incident response redesign
- production traffic experiment

## Current Sync State

- GitHub body | child follow-up Issue 88 を追加した current local record | synced 状態
- Boundary | comparison record のみ; execution は Issue 88 に委任

## Current Status

- CLOSED
- GitHub Issue: #87
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/87
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 54 の credential boundary を credential rotation comparison issue として切り出した
- manual owner-reviewed rotation pack、review-only rotation checklist、automation-first rotation の 3 候補を current-phase boundary 内で比較した
- current favorite として manual owner-reviewed rotation pack の review boundary と gate を追加した
- current child follow-up として Issue 88 を追加し、execution issue への handoff を固定した
