## Summary

Issue 80 では retained preview shutdown decision の current baseline を `continue` に固定した一方、`cost anomaly` は positive evidence が current issue path 上に未記録であり、supporting note が必要になった場合だけ別記録を追加する boundary も明示した。Issue 81 は、その cost anomaly supporting note を doc-first で整理し、どの signal を positive evidence とみなすか、どの note shape で Issue 80 に接続するか、shutdown-triggered 再判定へ進む gate をどう残すかを固定する follow-up issue である。

## Goal

GCP retained preview の cost anomaly supporting note を整理し、signal source、minimum note fields、Issue 80 への接続方法、shutdown-triggered 再判定条件を fail-closed に固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-81
- Title: GCP retained preview cost anomaly supporting note を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP retained preview cost anomaly judgment support
- Priority: medium
- Predecessor: Issue 57 closed, Issue 68 closed, Issue 80 open

Objective
- Problem to solve: Issue 80 では cost anomaly が unknown but not positively met と整理されているが、positive signal が出た場合に何を supporting evidence として扱い、どの note shape で Issue 80 の再判定へ接続するかが current issue path にない
- Expected value: billing / spend evidence を live query 実行なしの supporting note template として整理し、cost anomaly が positive になったときだけ Issue 80 の shutdown-triggered 再判定へ進める fail-closed path を持てる

Scope
- In scope: cost anomaly signal candidate、minimum supporting note fields、Issue 80 への link rule、reassessment gate、operator comment template
- Out of scope: live billing export 実装、cloud cost automation、spend threshold automation、resource destroy、environment cleanup、budget alert configuration 実行
- Editable paths: docs/portal/issues/issue-81-gcp-retained-preview-cost-anomaly-supporting-note.md, docs/portal/issues/issue-80-gcp-retained-preview-shutdown-decision.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: cost anomaly supporting note に必要な minimum fields が 1 文書で読める
- [x] AC-2: Issue 80 へ接続する rule と shutdown-triggered 再判定 gate が読める
- [x] AC-3: live billing query や automation 実装を含まない doc-first issue に留まっている
- [x] AC-4: positive evidence がない限り continue baseline を壊さない fail-closed path が明示されている

Implementation Plan
- Files likely to change: issue-81, issue-80, cloud status summary
- Approach: Issue 57 の shutdown trigger、Issue 68 の current live stability、Issue 80 の evidence gap 定義を入力に、cost anomaly supporting note の signal source と note shape を fixed template に整理する
- Alternative rejected and why: live cost automation を先に作る案は current decision branch の責務を超え、credential / billing access path を新設するため採らない

Validation Plan
- Commands to run: get_errors on issue-81, issue-80, cloud status summary; read back minimum fields and Issue 80 link rule
- Expected results: cost anomaly note の minimum fields、Issue 80 再判定 gate、non-goals が読み取れる
- Failure triage path: Issue 57 shutdown trigger、Issue 80 evidence gap section、current GCP summary の chain を再照合し、cost anomaly note の役割が execution issue に寄りすぎていないか切り分ける

Risk and Rollback
- Risks: supporting note が cost anomaly 確定判定や shutdown approval と誤読されること
- Impact area: retained preview continuation judgment, shutdown escalation timing, operator evidence quality
- Mitigation: positive cost evidence の supporting note と shutdown decision を分離し、Issue 80 で再判定する rule を明記する
- Rollback: supporting note の scope が広がりすぎた場合は signal candidate、minimum fields、Issue 80 link rule だけを残し、automation 話題は別 issue に戻す
```

## Tasks

- [x] cost anomaly signal candidate を整理する
- [x] supporting note minimum fields を固定する
- [x] Issue 80 への link rule と再判定 gate を固定する
- [x] operator comment template と sample completed comment を追加する

## Definition of Done

- [x] cost anomaly supporting note の shape と boundary が 1 文書で読める
- [x] positive evidence が出た場合の Issue 80 再判定 path が読める
- [x] live billing query、automation、shutdown execution を非対象に維持している
- [x] operator が current issue thread に paste-back できる completed comment がある

## Initial Notes

- Issue 57 は cost anomaly を retained preview shutdown trigger の 1 つとして固定した
- Issue 68 は current preview / production-equivalent surfaces が live verification を通過していることを固定した
- Issue 80 は current baseline を `continue` としつつ、cost anomaly positive evidence が出た場合だけ separate supporting note を追加する rule を明示した

## Cost Anomaly Signal Candidates

- repository owner が preview retained purpose と比べて disproportionate と判断する spend increase
- existing operator review path に載る billing screenshot、budget alert message、cost summary memo、manual spend note
- resource destroy や cleanup を即時に要求する signal ではなく、Issue 80 の再判定材料として扱える spend-related evidence

Signal rule:

- cost anomaly は absolute threshold をこの issue で固定せず、repository owner review で `unexpected or unjustified spend increase for retained preview` と判断された場合にだけ positive candidate とする
- signal が曖昧な場合は positive evidence とせず、Issue 80 の `continue` baseline を維持する
- live billing access や automation 実装は current phase 非対象とする

## Supporting Note Minimum Fields

supporting note は最低でも次を含む。

1. Observation Timestamp UTC
2. Observer
3. Signal Source Type
4. Cost Observation Summary
5. Why It Is Considered Anomalous
6. Preview Scope Affected
7. Immediate Decision Request
8. Related Issue Link

Field rule:

- Signal Source Type は `billing-screenshot | budget-alert-message | cost-summary-memo | manual-spend-note` のいずれかに固定する
- Immediate Decision Request は `reassess-issue-80 | monitor-only` のどちらかに固定する
- Related Issue Link は必ず Issue 80 を指す
- note は anomaly assertion を残すが、shutdown approval や cleanup execution を含めない

## Issue 80 Link Rule

- cost anomaly supporting note が追加された場合、Issue 80 の current trigger evidence assessment の `Cost anomaly` 行を再判定する
- supporting note 単体では `shutdown-triggered` を自動で確定せず、Issue 80 側で trigger evidence present / absent を再評価する
- supporting note が `monitor-only` の場合、Issue 80 には supporting reference として追記するだけで decision result を変えない
- supporting note が `reassess-issue-80` の場合でも、evidence retention input と cleanup boundary を満たさない限り shutdown execution split に進まない

## Reassessment Gate

- supporting note minimum fields がすべて埋まっている
- signal source type が fixed categories に一致している
- anomaly reasoning が retained preview purpose と current spend observation の差分として読める
- Issue 80 link が current issue path 上で明示されている
- decision request が `reassess-issue-80` の場合は Issue 80 の `Cost anomaly` 行を positive / not positive のどちらへ更新するか判断理由が読める

Gate outcome:

- gate を満たした supporting note のみ Issue 80 再判定材料として扱う
- gate を満たさない supporting note は information-only とし、Issue 80 の current baseline を変えない

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Retained Preview Cost Anomaly Supporting Note

- Issue: #81
- Observation Timestamp UTC: YYYY-MM-DD HH:MM UTC
- Observer: <value>
- Signal Source Type: billing-screenshot | budget-alert-message | cost-summary-memo | manual-spend-note
- Cost Observation Summary: <value>
- Why It Is Considered Anomalous: <value>
- Preview Scope Affected: retained-preview | shared-preview-surface | unknown
- Immediate Decision Request: reassess-issue-80 | monitor-only
- Related Issue Link: #80
- Note: this supporting note records spend-related evidence only; it does not approve shutdown, cleanup, or destroy actions
```

## Sample Completed Comment

```text
Retained Preview Cost Anomaly Supporting Note

- Issue: #81
- Observation Timestamp UTC: 2026-03-10 08:45 UTC
- Observer: repository owner
- Signal Source Type: manual-spend-note
- Cost Observation Summary: no positive cost anomaly evidence is recorded in the current issue path
- Why It Is Considered Anomalous: N/A; current note confirms absence of a positive anomaly signal rather than raising one
- Preview Scope Affected: retained-preview
- Immediate Decision Request: monitor-only
- Related Issue Link: #80
- Note: this supporting note records spend-related evidence only; it does not approve shutdown, cleanup, or destroy actions
```

## Combined Completed Comment

GitHub issue comment に 1 回で残す場合は、次の completed block をそのまま使う。

```text
Retained Preview Cost Anomaly Supporting Note

- Issue: #81
- Observation Timestamp UTC: 2026-03-10 08:55 UTC
- Observer: repository owner
- Signal Source Type: manual-spend-note
- Cost Observation Summary: no positive cost anomaly evidence is recorded in the current issue path
- Why It Is Considered Anomalous: N/A; current note confirms absence of a positive anomaly signal rather than raising one
- Preview Scope Affected: retained-preview
- Immediate Decision Request: monitor-only
- Related Issue Link: #80
- Note: this supporting note records spend-related evidence only; it does not approve shutdown, cleanup, or destroy actions
```

## Validation Evidence

- Issue 57 の cost anomaly trigger を current decision support shape に変換し、Issue 80 の continue baseline を壊さない supporting-note boundary へ落とし込んだ
- fixed categories、minimum fields、Issue 80 reassessment gate を明示したため、positive evidence が出た場合だけ再判定へ進める
- current phase は live billing query や automation を含まず、comment-ready doc-first issue に留めている

## Non-Goals

- live billing export or query execution
- budget alert implementation
- spend threshold automation
- retained preview shutdown execution
- GitHub environment cleanup
- resource destroy approval

## Current Sync State

- GitHub issue body は completed supporting-note comment を含む current local record と synced 状態にある
- current supporting-note boundary は spend-related evidence support と Issue 80 reassessment gate の範囲で維持されている

## Current Status

- CLOSED
- GitHub Issue: #81
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/81
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/81#issuecomment-402920449
- Recorded alignment refresh comment: not-applicable for supporting-note issue

- Issue 80 の cost anomaly evidence gap を separate supporting-note issue として切り出した
- minimum note fields、Issue 80 link rule、reassessment gate、comment-ready template を current phase boundary 内で整理した
- current phase では spend-related evidence support に留め、shutdown decision や cleanup execution は Issue 80 と separate execution issue に残している
