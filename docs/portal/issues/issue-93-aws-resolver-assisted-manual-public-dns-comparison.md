## Summary

Issue 92 で manual public DNS verification fallback の evidence shape は固定できたが、allowed resolver source である public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence のどれを current phase の first comparison candidate に置くかは未固定のままである。このままだと、次の DNS follow-up で source selection と repeatability の判断が毎回ぶれ、manual verification evidence block の quality が operator ごとに揺れやすい。

## Goal

resolver-assisted manual public DNS verification comparison を整理し、allowed resolver source の比較軸、non-goals、recommended next execution shape、fallback direction を current AWS DNS governance を壊さない read-only comparison issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-93
- Title: AWS resolver-assisted manual public DNS comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS read-only follow-up comparison
- Priority: medium
- Predecessor: Issue 75 closed, Issue 92 closed, AWS-HARDENING-FRESH-BATCH-2026-03-10 local contract added

Objective
- Problem to solve: Issue 92 で allowed resolver source は 3 系統に固定したが、repeatability、timestampability、operator burden、current devcontainer fit の観点でどれを first execution candidate に置くかが未固定である
- Expected value: resolver source comparison を 1 文書に整理し、next execution issue が source selection を再議論せず current DNS governance と整合する単一路線から開始できる

Scope
- In scope: allowed resolver source comparison、comparison criteria、recommended next execution shape、fallback direction、evidence-path compatibility、non-goals
- Out of scope: live DNS write、dig installation、provider credentials registration、provider API integration、workflow automation、Route 53 migration、Issue 69 / 75 / 92 の再編集
- Editable paths: docs/portal/issues/issue-93-aws-resolver-assisted-manual-public-dns-comparison.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: allowed resolver source の比較軸と non-goals が 1 文書で読める
- [x] AC-2: recommended next execution shape が Issue 92 の manual verification boundary と矛盾しない
- [x] AC-3: current favorite と fallback direction が current issue path へ戻す evidence shape に接続している
- [x] AC-4: tooling install、provider integration、live DNS change を含まない comparison issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-93-aws-resolver-assisted-manual-public-dns-comparison.md
- Approach: Issue 75 の manual public DNS check required wording と Issue 92 の allowed resolver sources / stale handling を入力に、3 候補を evidence quality、repeatability、current environment fit、operator burden で比較する
- Alternative rejected and why: いきなり manual verification checklist execution に進む案は resolver source selection が未固定のまま実運用手順へ進むため採らない。Issue 92 に comparison を追記する案も single-stream follow-up の分割を曖昧にするため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-93-aws-resolver-assisted-manual-public-dns-comparison.md
- Expected results: comparison table、recommended next step、fallback direction が読み取れる
- Failure triage path: Issue 92 の allowed resolver source / stale handling と Issue 75 の fallback wording を再照合し、comparison scope が execution planning や live validation に寄りすぎていないか切り分ける

Risk and Rollback
- Risks: comparison issue が resolver source 決定済みの execution approval や live DNS validation 承認に見えること
- Impact area: DNS governance, operator review discipline, next-batch planning
- Mitigation: comparison を source selection と evidence-path fit に限定し、checklist execution や live validation は separate issue に残す
- Rollback: scope が広がりすぎた場合は comparison table と recommended next step だけを残し、execution-shaped wording は別 issue に分離する
```

## Tasks

- [x] allowed resolver source を comparison candidate として列挙する
- [x] comparison criteria を整理する
- [x] recommended next execution shape を固定する
- [x] fallback direction を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] candidate comparison が 1 文書で読める
- [x] recommended next execution shape が Issue 92 の evidence block shape と接続している
- [x] fallback direction が stale / incomplete handling と矛盾しない
- [x] tooling install、provider integration、live DNS write が非対象のまま維持されている

## Initial Notes

- Issue 75 は `dig` 非搭載環境で `manual public DNS check required` を返す fail-closed wording を固定した
- Issue 92 は allowed resolver source を public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence の 3 系統に限定した
- current phase で不足しているのは source type の許容可否ではなく、どの source を first execution candidate として次 issue に渡すかである

## Candidate Comparison Draft

### Candidate 1: public DNS web resolver

- public resolver service の browser result を current issue path に戻す
- resolver name と observed answer を明示しやすく、tooling install を要求しない
- external web UI 依存のため、copy drift と operator timestamp discipline が必要になる

### Candidate 2: OS standard resolver command

- OS 標準 command か current environment で既定提供される resolver command output を current issue path に戻す
- local command output と timestamp を取りやすいが、available command set が environment 差分を受けやすい
- current devcontainer では `dig` 非搭載のため、source selection を command availability に依存させすぎると repeatability が落ちる

### Candidate 3: operator-reviewed browser evidence

- browser 上で public DNS result を確認し、operator review note として current issue path に戻す
- tooling requirement は最小だが、resolver source name と observed answer の transcription drift が最も出やすい
- first execution candidate というより fallback candidate としての相性が高い

## Comparison Table

| Candidate                          | Evidence clarity                              | Repeatability | Current environment fit | Operator burden | Current-phase judgment |
| ---------------------------------- | --------------------------------------------- | ------------- | ----------------------- | --------------- | ---------------------- |
| public DNS web resolver            | resolver name と observed answer を残しやすい | 中            | 高い                    | 中              | current favorite       |
| OS standard resolver command       | local output を残しやすい                     | 中            | 中                      | 中              | comparison 対象に残す  |
| operator-reviewed browser evidence | tooling requirement は最小                    | 低い          | 高い                    | 高い            | fallback candidate     |

Comparison rule:

- candidate comparison は Issue 92 で許可した 3 系統だけに限定する
- current favorite は resolver source name、observation timestamp、observed answer を current issue path に戻しやすいものを優先する
- current environment fit は `dig` 非搭載 devcontainer でも separate tooling install を要求しないことを重視する
- candidate が provider console、authoritative write UI、provider API read に寄る場合は current phase で除外する

## Recommended Next Execution Shape

- current phase の recommended next execution shape は public DNS web resolver を first execution candidate とする
- 理由は、Issue 92 の minimum fields に必要な resolver source name、observation timestamp、observed public answer を separate tooling install なしで current issue path に戻しやすいためである
- OS standard resolver command は environment ごとの差分が説明できる場合の comparison-only candidate として残す
- operator-reviewed browser evidence は command availability や web resolver access が揃わない場合の fallback candidate として維持する

## Current Favorite Review Contract Draft

current favorite として扱う public DNS web resolver path は、次の boundary に限定する。

### Required inputs

- `record_name`: current DNS record name
- `reviewed_target_reference`: Issue 92 で再掲する reviewed target value
- `source_evidence_reference`: current issue record か related evidence path
- `observation_timestamp_utc`: operator が記録する observed timestamp

### Allowed derived data

- resolver source display name
- observed public answer summary
- match result label
- short review note

### Required output

- output は Issue 92 の manual verification template にそのまま接続できる evidence block summary のみとする
- output には approval suggestion、live DNS write proposal、provider API action を含めない
- output は current issue path へ paste-back できる plain text shape を維持する

### Operator invocation shape

- operator は current issue path を開いた上で public DNS web resolver の observed result を確認する
- operator は resolver source display name と observation timestamp を明示的に記録する
- operator は Issue 92 の fixed Match Result labels のいずれか 1 つだけを使う

### Contract rule

- current favorite は read-only public observation に限定し、authoritative source や provider console を current issue path の evidence source に昇格させない
- output が Issue 92 の minimum fields を満たさない場合は current favorite として採らず、fallback candidate に戻る
- stale または inconsistent evidence は next execution input に使わず、Issue 92 の fail-closed rule に戻る

## Fallback Direction

- OS standard resolver command は current environment で available command と source name を説明できる場合だけ fallback candidate ではなく comparison candidate として再評価する
- operator-reviewed browser evidence は command availability が不足する場合の fallback candidate として維持する
- fallback を採る場合でも Match Result は fixed labels に限定し、unknown や inferred values を追加しない

## Current Child Follow-Up

- Issue 94: manual public DNS verification checklist execution
- Next expected execution split: manual verification checklist execution

## Non-Goals

- live DNS write
- dig or other tooling installation
- provider credentials registration
- provider API integration
- workflow automation
- Route 53 migration

## Current Sync State

- GitHub body | comparison table、current favorite contract、fallback direction を含む current local record | synced 状態
- Boundary | read-only comparison only; execution は Issue 94 に分離 | preserved

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #93
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/93
- Sync Status: synced to GitHub as closed issue

- Issue 92 の `resolver-assisted read-only helper comparison` split を child issue として切り出した
- public DNS web resolver、OS standard resolver command、operator-reviewed browser evidence の 3 候補を current-phase boundary 内で比較した
- current favorite と fallback direction を Issue 92 の manual verification evidence block shape に接続した
- comparison judgment は Issue 94 / 95 の execution-shaped drafts で消化済みのため、追加の DNS verification comparison follow-up は残っていない
