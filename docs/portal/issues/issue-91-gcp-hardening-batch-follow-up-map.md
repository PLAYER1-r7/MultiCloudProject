## Summary

GCP production-equivalent path、retained preview judgment、notification uplift、Cloud Armor hardening、credential rotation、destructive rollback は、それぞれ current local issue chain で整理できている。一方で、次の execution batch は retained preview lifecycle と 4 本の hardening stream に分散しており、現在は Issue 80 から Issue 90 までを個別に読まないと current entry point と execution-ready issue が掴みにくい。このままだと、closed record を再編集したり、無関係な GCP hardening を一つの issue に混ぜたりしやすい。

## Goal

GCP remaining work を branch ごとの follow-up map として束ね、current execution entry point を parent issue から安全に辿れるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-91
- Title: GCP hardening batch の follow-up map を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview retention / production-equivalent hardening follow-up planning
- Priority: medium
- Predecessor: Issue 52 closed, Issue 53 closed, Issue 54 closed, Issue 55 closed, Issue 56 closed, Issue 57 closed, Issue 65 closed, Issue 68 closed, Issue 80 open, Issue 83 open, Issue 85 open, Issue 87 open, Issue 89 open

Objective
- Problem to solve: GCP remaining work は retained preview lifecycle、notification uplift、Cloud Armor hardening、credential rotation、destructive rollback に分散しており、current execution-ready issue と supporting path を 1 箇所で辿れる親記録がまだない
- Expected value: follow-up を branch ごとに整理した parent map を追加し、closed records を reopen せず、Issue 80 / Issue 84 / Issue 86 / Issue 88 / Issue 90 を current next-step entry points として安全に辿れる

Scope
- In scope: GCP hardening follow-up map、branch ごとの current progress 整理、current execution entry point の明示、cloud status summary への反映
- Out of scope: GitHub issue close/open、live GCP changes、preview shutdown execution、notification delivery integration、Cloud Armor live policy mutation、credential rotation execution、destructive rollback execution
- Editable paths: docs/portal/issues/issue-91-gcp-hardening-batch-follow-up-map.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: GCP remaining work が branch 単位で読める
- [x] AC-2: retained preview supporting note と 4 本の hardening stream の current progress が parent map から辿れる
- [x] AC-3: current execution entry points が Issue 80 / Issue 84 / Issue 86 / Issue 88 / Issue 90 として明示されている
- [x] AC-4: closed issue records を再編集せず、新規 parent map と既存 follow-up issue だけで次 batch を開始できる

Implementation Plan
- Files likely to change: issue-91, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: Issue 80 から Issue 90 の current chain を retained preview lifecycle、notification uplift、Cloud Armor hardening、credential rotation、destructive rollback の 5 branch に整理し、branch ごとの current progress と execution entry point を parent map に集約する
- Alternative rejected and why: cloud status summary のみに寄せる案は branch progress と next-step shape が埋もれやすく、issue chain の parent entry point として弱いため採らない

Validation Plan
- Commands to run: get_errors on issue-91 and updated cloud status summary
- Expected results: markdown files have no diagnostics and GCP follow-up streams plus current execution entry points have a clear boundary
- Failure triage path: branch scope が重複した場合は retained preview / notification / Cloud Armor / credential rotation / destructive rollback の責務境界に戻して 1 stream 1 concern に整理する

Risk and Rollback
- Risks: parent map が新しい live judgment や approval を意味するように誤読されること
- Impact area: documentation accuracy, next-batch execution planning
- Mitigation: current live state を変えず、follow-up stream、supporting note、current execution entry point、non-goals だけを固定する
- Rollback: map の粒度が粗すぎる場合は issue-91 を parent index として残し、branch detail は個別 issue chain に委ねる
```

## Follow-Up Streams

### 1. Retained preview lifecycle and decisioning

- current source-of-truth は Issue 80 の continue / shutdown-triggered / defer judgment に置く
- cost anomaly と preview purpose complete は direct trigger ではなく、Issue 81 と Issue 82 の supporting note で positive evidence を待つ
- current local follow-up records: Issue 80, Issue 81, Issue 82
- current execution entry point: Issue 80
- current progress: Issue 80 で trigger matrix、operator-ready comment、Issue 91 追加後の parent-map alignment refresh まで固定済みであり、Issue 81 と Issue 82 は monitor-only supporting path として current decision を補助している

### 2. Owner-bound external notification uplift

- current comparison path は manual compose、local text generator、provider-native integration の比較に置く
- current phase では stdout-only local text generator draft と manual compose fallback を扱う
- current local follow-up records: Issue 83, Issue 84
- current execution entry point: Issue 84
- current progress: Issue 83 で current favorite を local text generator に固定し、Issue 84 で operator invocation、validation checklist、completed validation comment、parent-map alignment refresh まで整理済みである

### 3. Cloud Armor hardening depth

- current comparison path は keep-minimum baseline、reviewable custom rule tuning pack、advanced adaptive / rate-limit tuning の比較に置く
- current phase では review-only tuning pack draft と keep-minimum fallback を扱う
- current local follow-up records: Issue 85, Issue 86
- current execution entry point: Issue 86
- current progress: Issue 85 で reviewable tuning pack を current favorite に固定し、Issue 86 で fixed section order、validation checklist、completed validation comment、parent-map alignment refresh まで整理済みである

### 4. Credential rotation depth

- current comparison path は manual owner-reviewed rotation pack、review-only checklist、automation-first rotation の比較に置く
- current phase では review-only rotation pack draft と review-only checklist fallback を扱う
- current local follow-up records: Issue 87, Issue 88
- current execution entry point: Issue 88
- current progress: Issue 87 で manual owner-reviewed rotation pack を current favorite に固定し、Issue 88 で operator-ready rotation pack draft、validation checklist、completed validation comment、parent-map alignment refresh まで整理済みである

### 5. Destructive rollback depth

- current comparison path は review-only destructive rollback pack、destructive rollback checklist、automation-first destructive rollback の比較に置く
- current phase では review-only rollback pack draft と destructive rollback checklist fallback を扱う
- current local follow-up records: Issue 89, Issue 90
- current execution entry point: Issue 90
- current progress: Issue 89 で review-only destructive rollback pack を current favorite に固定し、Issue 90 で operator-ready rollback pack draft、validation checklist、completed validation comment、parent-map alignment refresh まで整理済みである

## Resolution

Issue 91 の判断結果は次の通りとする。

- GCP hardening batch は retained preview lifecycle and decisioning、notification uplift、Cloud Armor hardening、credential rotation、destructive rollback の 5 本へ整理する
- retained preview branch は Issue 80 を parent execution entry point とし、Issue 81 と Issue 82 は positive evidence がある場合だけ再判定に使う supporting note に固定する
- notification uplift、Cloud Armor、credential rotation、destructive rollback はそれぞれ comparison issue と execution issue の 2 層で維持し、current execution entry point は Issue 84、Issue 86、Issue 88、Issue 90 に置く
- cloud status summary には issue-80 から issue-91 の GCP hardening chain を closed reference chain として反映し、branch ごとの latest closed references は Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 に置く

## Current Branch Progress

- retained preview branch は Issue 80 の decision matrix、Issue 81 の cost anomaly supporting note、Issue 82 の preview purpose complete supporting note、completed decision comment、parent-map alignment refresh まで具体化されており、continue baseline を retained した closed reference chain へ移行した
- notification branch は Issue 83 の comparison と Issue 84 の stdout-only local text generator execution issue、completed validation comment、parent-map alignment refresh まで具体化されており、provider-native delivery は separate comparison に残したまま closed reference chain へ移行した
- Cloud Armor branch は Issue 85 の comparison と Issue 86 の review-only tuning pack execution issue、completed validation comment、parent-map alignment refresh まで具体化されており、live policy mutation は separate execution に残したまま closed reference chain へ移行した
- credential rotation branch は Issue 87 の comparison と Issue 88 の review-only rotation pack execution issue、completed validation comment、parent-map alignment refresh まで具体化されており、live secret rewrite は separate execution に残したまま closed reference chain へ移行した
- destructive rollback branch は Issue 89 の comparison と Issue 90 の review-only rollback pack execution issue、completed validation comment、parent-map alignment refresh まで具体化されており、live destroy execution は separate execution に残したまま closed reference chain へ移行した

## Current Next-Step Shape

- Parent map: Issue 91 を closed parent map reference として扱い、Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 を branch ごとの latest closed references として辿る
- Retained preview branch: Issue 80 は continue / shutdown-triggered / defer の decision matrix と supporting-note linkage を残した latest closed decision reference であり、Issue 81 と Issue 82 は closed supporting references である
- Notification branch: Issue 84 は stdout-only local text generator draft、manual compose fallback、validation evidence を残した latest closed execution reference であり、この chain 内の active execution entry point ではない
- Cloud Armor branch: Issue 86 は review-only tuning pack draft、keep-minimum fallback、validation evidence を残した latest closed execution reference であり、この chain 内の active execution entry point ではない
- Credential rotation branch: Issue 88 は review-only rotation pack draft、review-only checklist fallback、validation evidence を残した latest closed execution reference であり、この chain 内の active execution entry point ではない
- Destructive rollback branch: Issue 90 は review-only rollback pack draft、destructive rollback checklist fallback、validation evidence を残した latest closed execution reference であり、この chain 内の active execution entry point ではない

## Current Sync State

- Parent map | Issue 91 | current branch progress と closed-reference shape を反映した GitHub body synced 状態
- Retained preview branch | Issue 80 | completed decision comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Notification branch | Issue 84 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Cloud Armor branch | Issue 86 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Credential rotation branch | Issue 88 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態
- Destructive rollback branch | Issue 90 | completed validation comment、recorded primary comment、parent-map alignment refresh evidence を含む closed record として synced 状態

## Combined Completed Comment

GitHub issue comment に 1 回で残す場合は、次の completed block をそのまま使う。

```text
GCP Hardening Batch Follow-Up Map Summary

- Issue: #91
- Summary Timestamp: 2026-03-10 11:25 UTC
- Parent Map Added: yes
- Retained Preview Entry Point Fixed: yes
- Notification Entry Point Fixed: yes
- Cloud Armor Entry Point Fixed: yes
- Credential Rotation Entry Point Fixed: yes
- Destructive Rollback Entry Point Fixed: yes
- Result: pass
- Note: this parent map summarizes current follow-up streams and execution entry points only; it does not authorize live GCP changes or approvals
```

## Current Status

- CLOSED
- GitHub Issue: #91
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/91
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/91#issuecomment-402990821
- Recorded alignment refresh comment: tracked in child execution issues Issue 80、Issue 84、Issue 86、Issue 88、Issue 90

- Parent-map role | GCP lifecycle and hardening batch の current summary 起点として追加済み
- Branch map | retained preview supporting notes と 4 本の hardening branch を parent map から辿れる形に固定済み
- Latest closed references | Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 を branch ごとの closed reference として固定済み
- Summary reflection | current branch progress、sync state、closed-reference shape を parent map に反映済み
- Alignment coverage | 5 本の current execution entry point すべてに parent-map alignment refresh evidence を追加済み
- Primary comment coverage | Issue 80、Issue 84、Issue 86、Issue 88、Issue 90 の recorded primary comment を parent map 起点で追跡可能
