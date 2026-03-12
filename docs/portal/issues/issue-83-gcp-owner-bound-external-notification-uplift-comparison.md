## Summary

Issue 55 で GCP preview monitoring / alert routing baseline は fixed され、primary signal、first-response evidence path、notification owner、operator hold 条件は current phase の境界内で整理できた。一方で、owner-bound external destination uplift をどの実装形で次段に残すかは未決定のままであり、manual compose、local text generator、provider-native integration のどれを notification uplift branch の next execution candidate にするかを comparison issue として切り出す必要がある。

## Goal

owner-bound external notification uplift の implementation comparison を整理し、Issue 55 の operator-first monitoring path を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-83
- Title: GCP owner-bound external notification uplift comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview / retained preview notification uplift comparison
- Priority: medium
- Predecessor: Issue 55 closed, Issue 68 closed, Issue 80 closed

Objective
- Problem to solve: Issue 55 で notification owner、first-response path、operator hold 条件は fixed したが、owner-bound external destination uplift を manual compose、local text generator、provider-native integration のどれで進めるかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の input/output boundary を fixed し、current canonical first-response path を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、input/output boundary、operator invocation shape、Issue 55 compatibility、stale pointer handling、recommended next step
- Out of scope: live external delivery automation、Cloud Monitoring notification channel implementation、PagerDuty 等の third-party paging 導入、24x7 staffing expansion、incident truth relocation、shutdown execution
- Editable paths: docs/portal/issues/issue-83-gcp-owner-bound-external-notification-uplift-comparison.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が Issue 55 の canonical first-response path と矛盾しない
- [x] AC-3: current favorite の input/output boundary と operator invocation shape が読める
- [x] AC-4: live delivery automation や provider integration を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-83, cloud status summary
- Approach: Issue 55 の notification owner、first-response evidence path、pending certificate / target hold rule を入力に、manual compose、local text generator、provider-native integration の 3 候補を ownership clarity、canonical path fit、drift reduction、operational overhead で比較する
- Alternative rejected and why: いきなり external delivery implementation に進む案は live delivery boundary と retention path を広げすぎるため採らない

Validation Plan
- Commands to run: get_errors on issue-83 and updated cloud status summary markdown
- Expected results: candidate comparison、recommended next step、current favorite contract が読める
- Failure triage path: Issue 55 の primary signal、first-response path、notification owner rule を再照合し、candidate が canonical first-response path を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live notification implementation や escalation path migration の承認済み record に誤読されること
- Impact area: monitoring routing discipline, incident traceability, staffing expectation
- Mitigation: comparison を owner-bound notification pointer generation と review path compatibility に限定し、live sending と provider integration は non-goals に残す
- Rollback: candidate comparison が広がりすぎた場合は comparison table だけを残し、recommended next step を保留する
```

## Tasks

- [x] implementation candidate を列挙する
- [x] comparison table を整理する
- [x] recommended next execution shape を固定する
- [x] current favorite の notification pointer generation contract draft を整理する
- [x] non-goals を明文化する

## Definition of Done

- [x] candidate comparison が 1 文書で読める
- [x] recommended next execution shape が Issue 55 の canonical path rule と接続している
- [x] current favorite の input/output boundary と operator invocation shape が 1 文書で読める
- [x] provider integration、live delivery automation、staffing expansion が非対象のまま維持されている

## Initial Notes

- Issue 55 は GCP preview monitoring の primary signal を preview public URL と major route reachability に固定した
- Issue 55 は first-response evidence path を preview deploy run URL、step summary、deploy evidence artifact に固定した
- Issue 55 は notification owner を repository owner の第一候補に固定し、external delivery channel 実装は current phase 非対象に残した

## Candidate Comparison Draft

### Candidate 1: manual compose on fixed notification template

- operator が fixed notification template に従って subject と body を手動で埋める
- implementation surface は最小だが、signal label、issue reference、evidence pointer の記載揺れが残りやすい

### Candidate 2: local text generator for owner-bound notification pointer

- operator が local single-run command を実行し、subject line と body text block を生成して mail client か notification destination へ貼り付ける
- live sending を伴わず drift を減らせるが、generator contract と fallback rule を明示する必要がある

### Candidate 3: provider-native notification integration

- Cloud Monitoring か workflow 側から notification pointer を直接生成または送信する
- operational automation は進むが、canonical path と retention の責務分離が弱まり current phase の boundary を超えやすい

## Comparison Table

| Candidate                                                 | Safety boundary                          | Canonical path fit | Drift reduction | Operational overhead | Current-phase judgment   |
| --------------------------------------------------------- | ---------------------------------------- | ------------------ | --------------- | -------------------- | ------------------------ |
| manual compose on fixed notification template             | 最も安全で責務が明確                     | 高い               | 低い            | 低い                 | comparison 対象に残す    |
| local text generator for owner-bound notification pointer | pointer only を維持しやすい              | 高い               | 中              | 中                   | current favorite         |
| provider-native notification integration                  | live sending と retention の責務が広がる | 低い               | 高              | 中から高             | current phase では非対象 |

Comparison rule:

- candidate comparison は notification pointer generation と review path compatibility に限定する
- output は Issue 55 の primary signal、first-response path、notification owner rule を満たす必要がある
- candidate が canonical first-response path を deploy evidence path から外部 destination へ移す場合は採らない
- live delivery automation、provider credentials、provider-native integration を要求する候補は current phase で除外する

## Recommended Next Execution Shape

- current phase の recommended next execution shape は local text generator for owner-bound notification pointer を第一候補とする
- 理由は、manual compose より signal label、issue reference、evidence pointer の drift を減らしつつ、provider-native integration ほど live delivery boundary を広げないためである
- local text generator は subject と body text block の生成に限定し、actual send action と recipient ownership は operator-managed のまま維持する
- manual compose on fixed notification template は fallback candidate として維持し、provider-native notification integration は current phase では comparison-only に留める

## Notification Pointer Generation Contract Draft

current favorite として扱う local text generator for owner-bound notification pointer は、次の boundary に限定する。

### Required inputs

- `signal_type`: reachability / deploy-failure / hold-condition など current issue で reviewed 済みの label 1 つ
- `run_url`: canonical deploy evidence path へ戻れる workflow run URL か `N/A`
- `issue_reference_path`: current issue record path
- `artifact_pointer`: relevant artifact name か `N/A`

### Allowed derived data

- fixed subject prefix
- operator next check fixed sentence
- generated timestamp

### Required output

- output は subject line と body text block のみとする
- body は notification owner が first-response path へ戻れる field order を維持する
- output には approval suggestion、incident diagnosis、acknowledgement request、provider-specific raw payload を含めない

### Operator invocation shape

- generator は operator が reviewed inputs を明示的に与えて local single-run で実行する
- generator 実行前に current issue record と deploy evidence path を operator 自身が開いていることを前提にする
- generator は stdout-only を前提とし、mail client、issue record、run record を直接更新しない

### Contract rule

- generator は one pointer, one signal type を維持する
- `issue_reference_path` は current issue record 以外を許容しない
- output が Issue 55 の canonical path rule と衝突する場合は generator candidate を採らず、manual compose fallback に戻る
- pointer 内容が canonical path と衝突した場合は deploy evidence path を優先し、generated pointer は stale 扱いにする

## Notification Pointer Generator Gate

- required inputs が reviewed values として揃っている
- `signal_type` が current issue で reviewed された label 1 つだけに一致する
- output が Issue 55 の first-response path と notification owner rule を満たす
- output が current issue record のみを issue reference path として使っている
- generator contract が live delivery automation、provider integration、approval log migration を要求しない

Gate outcome:

- gate を満たした場合のみ、local text generator for owner-bound notification pointer を next execution issue の第一候補として維持する
- gate を満たさない場合は manual compose on fixed notification template を fallback candidate として優先する

Current child follow-up:

- Issue 84: owner-bound notification pointer local text generator execution

## Non-Goals

- live external delivery automation
- provider-native notification integration
- Cloud Monitoring notification channel implementation
- third-party paging product adoption
- staffing expansion or acknowledgement SLA
- incident truth relocation

## Current Sync State

- GitHub body | child follow-up Issue 84 を追加した current local record | synced 状態
- Boundary | comparison record のみ; execution は Issue 84 に委任

## Current Status

- CLOSED
- GitHub Issue: #83
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/83
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 55 の owner-bound notification uplift judgment を implementation comparison issue として切り出した
- manual compose、local text generator、provider-native integration の 3 候補を current-phase boundary 内で比較した
- current favorite として local text generator の input/output boundary と gate を追加した
- current child follow-up として Issue 84 を追加し、execution issue への handoff を固定した
