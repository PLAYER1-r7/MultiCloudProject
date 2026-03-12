## Summary

Issue 71 で current phase の live candidate は repository owner-managed email destination のみに絞られ、primary email pointer template、fixed Alert Type labels、Issue / Reference Path rule は固定できた。一方で、その pointer email をどの実装形で準備するかは未決定のままであり、manual compose、local text generator、provider-native email integration のどれを次段に残すかを comparison issue として切り出す必要がある。

## Goal

primary email pointer の implementation comparison を整理し、current operator-first alert path を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-76
- Title: AWS primary email pointer implementation comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production alert pointer implementation comparison
- Priority: medium
- Predecessor: Issue 41 closed, Issue 44 closed, Issue 45 closed, Issue 69 open, Issue 71 open

Objective
- Problem to solve: Issue 71 で primary email pointer の destination、template、fixed Alert Type labels、Issue / Reference Path rule は fixed したが、manual compose、local text generator、provider-native email integration のどれを next execution candidate にするかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の input/output boundary を fixed し、current canonical first-response path を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、input/output boundary、operator invocation shape、primary email pointer template compatibility、stale pointer handling、recommended next step
- Out of scope: live email sending automation、CloudWatch/SNS implementation、third-party paging product 導入、24x7 staffing expansion、approval log migration、incident truth relocation
- Editable paths: docs/portal/issues/issue-76-aws-primary-email-pointer-implementation-comparison.md, docs/portal/issues/issue-71-aws-alert-tooling-depth-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が current canonical first-response path と矛盾しない
- [x] AC-3: current favorite の input/output boundary と operator invocation shape が読める
- [x] AC-4: live sending automation や provider integration を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-76, issue-71
- Approach: Issue 71 の primary email pointer template、Alert Type labels、Issue / Reference Path rule を入力に、manual compose、local text generator、provider-native email integration の 3 候補を ownership clarity、drift risk、canonical path fit、operational overhead で比較する
- Alternative rejected and why: いきなり email sending implementation に進む案は live delivery boundary と retention path を広げすぎるため採らない

Validation Plan
- Commands to run: get_errors on issue-76 and updated issue-71 markdown
- Expected results: candidate comparison、recommended next step、current favorite contract が読める
- Failure triage path: Issue 71 の primary email pointer template、Alert Type rule、Issue / Reference Path rule を再照合し、candidate が canonical first-response path を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live alert implementation や approval path migration の承認済み record に誤読されること
- Impact area: alert routing discipline, incident traceability, staffing expectation
- Mitigation: comparison を pointer generation と review path compatibility に限定し、live sending と provider integration は non-goals に残す
- Rollback: candidate comparison が広がりすぎた場合は comparison table だけを残し、recommended next step を保留する
```

## Tasks

- [x] implementation candidate を列挙する
- [x] comparison table を整理する
- [x] recommended next execution shape を固定する
- [x] current favorite の email pointer generation contract draft を整理する
- [x] non-goals を明文化する

## Definition of Done

- [x] candidate comparison が 1 文書で読める
- [x] recommended next execution shape が Issue 71 の canonical path rule と接続している
- [x] current favorite の input/output boundary と operator invocation shape が 1 文書で読める
- [x] provider integration、live sending automation、staffing expansion が非対象のまま維持されている

## Initial Notes

- Issue 71 は current phase の live candidate を repository owner-managed email destination のみに絞った
- Issue 71 は primary email pointer template、fixed Alert Type labels、current issue record のみを許容する Issue / Reference Path rule を固定した
- current phase で比較対象にできるのは canonical first-response path を deploy evidence path のまま維持しつつ、pointer message の準備 drift をどこまで減らすかである

## Candidate Comparison Draft

### Candidate 1: manual compose on fixed email template

- operator が Issue 71 の fixed template に従って subject と body を手動で埋める
- implementation surface は最小だが、Alert Type label、Issue / Reference Path、artifact pointer の記載揺れが残りやすい

### Candidate 2: local text generator for email pointer

- operator が local single-run command を実行し、subject line と body text block を生成して mail client へ貼り付ける
- live sending を伴わず drift を減らせるが、generator contract と fallback rule を明示する必要がある

### Candidate 3: provider-native email integration

- alert source か workflow 側から email pointer を直接生成または送信する
- operational automation は進むが、canonical path と retention の責務分離が弱まり current phase の boundary を超えやすい

## Comparison Table

| Candidate                              | Safety boundary                          | Canonical path fit | Drift reduction | Operational overhead | Current-phase judgment   |
| -------------------------------------- | ---------------------------------------- | ------------------ | --------------- | -------------------- | ------------------------ |
| manual compose on fixed email template | 最も安全で責務が明確                     | 高い               | 低い            | 低い                 | comparison 対象に残す    |
| local text generator for email pointer | pointer only を維持しやすい              | 高い               | 中              | 中                   | current favorite         |
| provider-native email integration      | live sending と retention の責務が広がる | 低い               | 高              | 中から高             | current phase では非対象 |

Comparison rule:

- candidate comparison は pointer generation と review path compatibility に限定する
- output は Issue 71 の primary email pointer template、fixed Alert Type labels、Issue / Reference Path rule をそのまま満たす必要がある
- candidate が canonical first-response path を deploy evidence path から外部 destination へ移す場合は採らない
- live sending automation、provider credentials、provider-native integration を要求する候補は current phase で除外する

## Recommended Next Execution Shape

- current phase の recommended next execution shape は local text generator for email pointer を第一候補とする
- 理由は、manual compose より Alert Type label、Issue / Reference Path、pointer note の drift を減らしつつ、provider-native integration ほど live delivery boundary を広げないためである
- local text generator は subject と body text block の生成に限定し、actual send action と recipient ownership は operator-managed のまま維持する
- manual compose on fixed email template は fallback candidate として維持し、provider-native email integration は current phase では comparison-only に留める

## Email Pointer Generation Contract Draft

current favorite として扱う local text generator for email pointer は、次の boundary に限定する。

### Required inputs

- `alert_type`: Issue 71 で許容した fixed labels のいずれか 1 つ
- `run_url`: canonical deploy evidence path へ戻れる workflow run URL
- `issue_reference_path`: current issue record path
- `artifact_pointer`: relevant artifact name か `N/A`

### Allowed derived data

- fixed subject prefix
- operator next check fixed sentence
- generated timestamp

### Required output

- output は subject line と body text block のみとする
- body は Issue 71 の primary email pointer template と同じ field order を満たす
- output には approval suggestion、incident diagnosis、acknowledgement request、provider-specific raw payload を含めない

### Operator invocation shape

- generator は operator が reviewed inputs を明示的に与えて local single-run で実行する
- generator 実行前に current issue record と deploy evidence path を operator 自身が開いていることを前提にする
- generator は stdout-only を前提とし、mail client、issue record、run record を直接更新しない

### Contract rule

- generator は one pointer, one Alert Type を維持する
- `issue_reference_path` は current issue record 以外を許容しない
- output が Issue 71 の template rule と衝突する場合は generator candidate を採らず、manual compose fallback に戻る
- pointer 内容が canonical path と衝突した場合は deploy evidence path を優先し、generated pointer は stale 扱いにする

## Email Pointer Generator Gate

- required inputs が reviewed values として揃っている
- `alert_type` が Issue 71 の fixed labels の 1 つだけに一致する
- output が Issue 71 の primary email pointer template と field order を満たす
- output が current issue record のみを Issue / Reference Path として使っている
- generator contract が live sending automation、provider integration、approval log migration を要求しない

Gate outcome:

- gate を満たした場合のみ、local text generator for email pointer を next execution issue の第一候補として維持する
- gate を満たさない場合は manual compose on fixed email template を fallback candidate として優先する

Current child follow-up:

- Issue 77: primary email pointer local text generator execution

## Non-Goals

- live email sending automation
- provider-native alert integration
- CloudWatch/SNS implementation
- third-party paging product adoption
- staffing expansion or acknowledgement SLA
- approval log migration

## Current Status

- CLOSED
- GitHub Issue: #76
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/76
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 71 の single-path email pointer judgment を implementation comparison issue として切り出した
- manual compose、local text generator、provider-native integration の 3 候補を current-phase boundary 内で比較した
- current favorite として local text generator の input/output boundary と gate を追加した
