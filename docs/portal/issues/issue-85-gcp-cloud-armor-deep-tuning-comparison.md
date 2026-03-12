## Summary

Issue 54 で GCP preview security baseline の edge protection minimum control は Cloud Armor として固定され、Issue 68 では production-equivalent live verification の close gate を通過した。一方で、Cloud Armor を minimum baseline のまま維持するだけで十分か、reviewable な deep tuning を次段でどの実装形に残すかは未決定のままであり、current baseline を壊さずに next hardening candidate を comparison issue として切り出す必要がある。

## Goal

GCP Cloud Armor deep tuning の implementation comparison を整理し、Issue 54 の minimum edge protection baseline と Issue 68 の live state を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-85
- Title: GCP Cloud Armor deep tuning comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview / production-equivalent Cloud Armor hardening comparison
- Priority: medium
- Predecessor: Issue 54 closed, Issue 68 closed

Objective
- Problem to solve: Issue 54 で Cloud Armor は minimum edge protection baseline として fixed したが、rule tuning depth を keep-minimum、reviewable custom rule tuning、advanced adaptive / rate-limit tuning のどれで進めるかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の review boundary を fixed し、current live verification baseline を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、review boundary、operator invocation shape、Issue 54 compatibility、Issue 68 live-state compatibility、recommended next step
- Out of scope: live Cloud Armor policy mutation、incident response redesign、WAF managed rule over-adoption、rate limiting activation、adaptive protection rollout、provider credential changes
- Editable paths: docs/portal/issues/issue-85-gcp-cloud-armor-deep-tuning-comparison.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が Issue 54 minimum baseline と矛盾しない
- [x] AC-3: current favorite の review boundary と operator invocation shape が読める
- [x] AC-4: live policy mutation や provider credential changes を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-85, cloud status summary
- Approach: Issue 54 の Cloud Armor baseline、Issue 68 の live verification evidence を入力に、keep-minimum baseline、reviewable custom rule tuning、advanced adaptive / rate-limit tuning の 3 候補を safety boundary、live compatibility、reviewability、operational overhead で比較する
- Alternative rejected and why: いきなり policy mutation execution に進む案は current live surface を unnecessarily disturb し、baseline validation と tuning validation を同時に抱え込むため採らない

Validation Plan
- Commands to run: get_errors on issue-85 and updated cloud status summary markdown
- Expected results: candidate comparison、recommended next step、current favorite review contract が読める
- Failure triage path: Issue 54 の edge protection baseline と Issue 68 の close gate evidence を再照合し、candidate が minimum baseline や current live verification path を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live Cloud Armor change や production-facing enforcement 承認の記録に誤読されること
- Impact area: edge protection expectations, live traffic safety, operator review path
- Mitigation: comparison を reviewable tuning candidate selection に限定し、policy mutation と enforcement activation は non-goals に残す
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
- [x] recommended next execution shape が Issue 54 baseline と Issue 68 live-state evidence に接続している
- [x] current favorite の review boundary と operator invocation shape が 1 文書で読める
- [x] live policy mutation、adaptive rollout、credential change が非対象のまま維持されている

## Initial Notes

- Issue 54 は Cloud Armor を minimum edge protection baseline として fixed した
- Issue 68 は certificate active、HTTPS verification success、monitoring enabled の live state を close gate として固定した
- current phase で比較対象にできるのは live traffic safety を崩さず、reviewable tuning candidate をどう準備するかである

## Candidate Comparison Draft

### Candidate 1: keep minimum baseline only

- current Cloud Armor baseline をそのまま維持し、deep tuning を後続へ先送りする
- safety は最も高いが、reviewable hardening depth を前進させない

### Candidate 2: reviewable custom rule tuning pack

- preview / production-equivalent surface を前提に、review-only の candidate rule set、expected allow / deny rationale、fallback note を current issue record にまとめる
- live mutation なしで hardening depth を前進できるが、rule categories と evidence path を明示する必要がある

### Candidate 3: advanced adaptive or rate-limit tuning

- adaptive protection、rate limiting、broader managed rule usage を current phase で比較対象に入れる
- security depth は進むが、live behavior impact と verification burden が広がりやすい

## Comparison Table

| Candidate                              | Safety boundary          | Live compatibility | Reviewability | Operational overhead | Current-phase judgment   |
| -------------------------------------- | ------------------------ | ------------------ | ------------- | -------------------- | ------------------------ |
| keep minimum baseline only             | 最も安全                 | 高い               | 低い          | 低い                 | fallback candidate       |
| reviewable custom rule tuning pack     | live mutation を含めない | 高い               | 高い          | 中                   | current favorite         |
| advanced adaptive or rate-limit tuning | behavior impact が広がる | 中から低い         | 中            | 高い                 | current phase では非対象 |

Comparison rule:

- candidate comparison は reviewable tuning candidate selection に限定する
- output は Issue 54 の minimum baseline と Issue 68 の live-state evidence を前提にする必要がある
- candidate が live policy mutation、rate-limit activation、adaptive enforcement を要求する場合は current phase で除外する
- current live verification path を崩す candidate は採らない

## Recommended Next Execution Shape

- current phase の recommended next execution shape は reviewable custom rule tuning pack を第一候補とする
- 理由は、keep minimum baseline より rule hardening depth を前進させつつ、advanced adaptive / rate-limit tuning ほど live behavior impact を広げないためである
- reviewable custom rule tuning pack は candidate rule names、expected rationale、verification checkpoints を current issue record にまとめるだけに留め、actual enforcement は operator-reviewed separate execution issue に残す
- keep minimum baseline only は fallback candidate として維持し、advanced adaptive / rate-limit tuning は current phase では comparison-only に留める

## Reviewable Tuning Pack Contract Draft

current favorite として扱う reviewable custom rule tuning pack は、次の boundary に限定する。

### Required inputs

- `current_surface_scope`: preview / production-equivalent のどちらを主語にするか
- `baseline_reference`: Issue 54 と Issue 68 の reviewed evidence path
- `candidate_rule_family`: header / origin / path / region など review対象の family
- `fallback_note`: tuning 不採用時に keep-minimum baseline へ戻す note

### Allowed derived data

- rule candidate labels
- expected review checkpoints
- tuning rationale summary

### Required output

- output は candidate rule summary と review checkpoint text block のみとする
- output には live apply command、provider-specific credential step、enforcement approval を含めない
- output は current issue record から predecessor evidence へ戻れる reference path を持つ

### Operator invocation shape

- operator は reviewed baseline evidence を開いた上で、candidate rule family ごとの review note を current issue record に追記する
- pack は review-only を前提とし、Cloud Armor policy や infra state を直接変更しない
- same issue record 内で keep / reject / follow-up-needed の比較結果を残せる形にする

### Contract rule

- tuning pack は one review pack, one baseline reference を維持する
- output が Issue 54 baseline を undermine する場合は current favorite として採らない
- live verification path と矛盾する candidate は reject する

## Review Pack Gate

- required inputs が reviewed values として揃っている
- candidate rule family が current surface scope と接続している
- output が baseline reference と fallback note を含んでいる
- output が live apply command、credential step、enforcement approval を要求しない
- current live verification path と矛盾しない

Gate outcome:

- gate を満たした場合のみ、reviewable custom rule tuning pack を next execution issue の第一候補として維持する
- gate を満たさない場合は keep minimum baseline only を fallback candidate として優先する

Current child follow-up:

- Issue 86: reviewable Cloud Armor tuning pack execution

## Non-Goals

- live Cloud Armor policy mutation
- adaptive protection rollout
- rate limiting activation
- provider credential changes
- incident response redesign
- production traffic experiment

## Current Sync State

- GitHub body | child follow-up Issue 86 を追加した current local record | synced 状態
- Boundary | comparison record のみ; execution は Issue 86 に委任

## Current Status

- CLOSED
- GitHub Issue: #85
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/85
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 54 の Cloud Armor baseline を deep tuning comparison issue として切り出した
- keep-minimum baseline、reviewable custom rule tuning pack、advanced adaptive / rate-limit tuning の 3 候補を current-phase boundary 内で比較した
- current favorite として reviewable custom rule tuning pack の review boundary と gate を追加した
- current child follow-up として Issue 86 を追加し、execution issue への handoff を固定した
