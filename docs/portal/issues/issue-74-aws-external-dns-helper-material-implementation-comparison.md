## Summary

Issue 73 で read-only helper material の template、review checklist、operator paste-back procedure、execution-ready gate までは固定できた。一方で、helper material を実際にどう生成するかは未決定である。このままだと execution-ready candidate ができても、manual fill、shell snippet、repo-local script skeleton のどれで次段を進めるかが曖昧なまま残り、implementation step で review path が再びぶれやすい。

## Goal

read-only helper material generation の implementation comparison を整理し、current DNS governance を崩さない次の execution issue の候補を 1 つに絞れる状態にする。特に current favorite である operator-invoked shell snippet の input/output boundary を固定し、次段 implementation issue の contract drift を防ぐ。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-74
- Title: AWS external DNS helper material implementation comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS helper implementation comparison
- Priority: medium
- Predecessor: Issue 42 closed, Issue 46 closed, Issue 70 open, Issue 73 open

Objective
- Problem to solve: helper material の review path と execution-ready gate は fixed したが、manual fill、operator shell snippet、repo-local read-only script skeleton のどれを次段 implementation 候補にするかが未決定である
- Expected value: implementation 候補の比較軸、non-goals、recommended next execution shape を固定し、current fail-closed DNS governance を崩さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、input/output boundary、operator invocation shape、review path compatibility、shell snippet contract draft、non-goals、recommended next step
- Out of scope: live DNS write、provider credentials、provider API integration、workflow automation、Route 53 migration、production execution
- Editable paths: docs/portal/issues/issue-74-aws-external-dns-helper-material-implementation-comparison.md, docs/portal/issues/issue-73-aws-external-dns-helper-material-preparation.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が read-only / credential-free boundary と矛盾しない
- [x] AC-3: current favorite の shell snippet input/output boundary と operator invocation shape が読める
- [x] AC-4: live execution や provider integration を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-74, issue-73
- Approach: Issue 73 の execution-ready gate を入力に、manual fill、operator shell snippet、repo-local script skeleton の 3 候補を review path / safety / operability / drift risk で比較する
- Alternative rejected and why: いきなり script 実装へ進む案は candidate comparison と operator invocation boundary が未固定のため採らない

Validation Plan
- Commands to run: get_errors on issue-74 and updated issue-73 markdown
- Expected results: candidate comparison と recommended next step が読める
- Failure triage path: Issue 70 と Issue 73 の helper boundary を再照合し、candidate が current DNS governance を超えていないか切り分ける

Risk and Rollback
- Risks: comparison の段階で script implementation や live DNS execution が承認済みに見えること
- Impact area: DNS governance, review discipline, next execution planning
- Mitigation: candidate を read-only / credential-free / operator-invoked boundaryに限定し、execution は separate issue に残す
- Rollback: scope が広がりすぎた場合は recommended next step を保留し、comparison table だけ残す
```

## Tasks

- [x] implementation candidate を列挙する
- [x] comparison table を整理する
- [x] recommended next execution shape を固定する
- [x] current favorite の shell snippet contract draft を整理する
- [x] non-goals を明文化する

## Definition of Done

- [x] candidate comparison が 1 文書で読める
- [x] recommended next execution shape が current review path と接続している
- [x] shell snippet input/output boundary と operator invocation shape が 1 文書で読める
- [x] provider credentials、API、live DNS write が非対象のまま維持されている

## Initial Notes

- Issue 73 は helper material template、usage example、review checklist、operator paste-back procedure、execution-ready gate を固定した
- current phase で許容されるのは credential-free、read-only、operator review path を補助する generation までである
- next issue は implementation comparison であり、live generation 実装や provider integration を確定させるものではない

## Candidate Comparison Draft

### Candidate 1: manual fill on fixed template

- operator が reviewed values を手作業で template に貼る
- implementation surface は最も小さいが、transcription drift の削減効果が限定的である

### Candidate 2: operator-invoked shell snippet

- operator が local shell snippet を明示的に実行し、public DNS resolution と reviewed input をまとめて text block を得る
- automation depth は最小限で、repo-local script より review しやすいが、command composition drift が残る

### Candidate 3: repo-local read-only script skeleton

- repo-local script が reviewed inputs を受け取り、helper material block を標準フォーマットで出力する
- drift は下げやすいが、script contract、input boundary、maintenance owner の固定が必要になる

## Comparison Table

| Candidate                            | Safety boundary                              | Review path fit | Drift reduction | Operational overhead | Current-phase judgment |
| ------------------------------------ | -------------------------------------------- | --------------- | --------------- | -------------------- | ---------------------- |
| manual fill on fixed template        | 最も安全だが automation 効果が薄い           | 高い            | 低い            | 低い                 | comparison 対象に残す  |
| operator-invoked shell snippet       | read-only を維持しやすい                     | 高い            | 中              | 中                   | current favorite       |
| repo-local read-only script skeleton | read-only を維持できるが contract 固定が必要 | 中              | 高              | 中から高             | comparison 対象に残す  |

Comparison rule:

- candidate comparison は read-only、credential-free、operator-invoked boundary を超えないものに限定する
- output は Issue 73 の helper material template と review checklist をそのまま満たす必要がある
- candidate が current issue record への paste-back procedure を壊す場合は採らない
- provider API、credential registration、workflow trigger を要求する候補は current phase で除外する

## Recommended Next Execution Shape

- current phase の recommended next execution shape は operator-invoked shell snippet を第一候補とする
- 理由は、manual fill より transcription drift を減らしつつ、repo-local script skeleton ほど contract surface を増やさないためである
- shell snippet は reviewed inputs を operator が明示的に与え、public DNS resolution と formatting を補助する範囲に限定する
- repo-local read-only script skeleton は snippet の input/output boundary が安定した後で再評価する

## Shell Snippet Contract Draft

current favorite として扱う operator-invoked shell snippet は、次の boundary に限定する。

### Required inputs

- `record_name`: current change target を識別する DNS record name
- `reviewed_cloudfront_target`: reviewed distribution evidence から取得した target
- `certificate_reference`: reviewed certificate-related reference
- `ttl_baseline`: reviewed TTL value
- `source_evidence_reference`: current issue record か related evidence path を指す reference

### Allowed derived data

- public DNS resolution result
- generation timestamp
- optional before target comparison

### Required output

- output は Issue 73 の helper material template と同じ field order を満たす text block のみとする
- output には reviewed values と allowed derived data だけを含める
- output に approval suggestion、live DNS write proposal、provider API action は含めない

### Operator invocation shape

- snippet は operator が reviewed inputs を明示的に与えて実行する
- snippet 実行前に source evidence path を operator 自身が開いていることを前提にする
- snippet は local shell invocation のみを前提とし、workflow trigger、scheduled run、background service を前提にしない

### Contract rule

- snippet は credential-free、read-only、single-run invocation に限定する
- input に未確定値がある場合は snippet を実行せず、Issue 73 の paste-back procedure に従って source evidence path を先に確定する
- output が Issue 73 の review checklist を満たさない場合は snippet candidate を採らず、manual fill に戻る
- snippet は current issue record への paste-back を補助するだけで、issue record を直接編集しない

## Shell Snippet Gate

- required inputs がすべて reviewed values として揃っている
- public DNS resolution の取得が read-only command だけで完了する
- output が Issue 73 の helper material template と review checklist を満たす
- operator invocation が current issue record と source evidence path の役割分担を壊さない
- snippet contract が provider credentials、API、workflow automation を要求しない

Gate outcome:

- gate を満たした場合のみ、operator-invoked shell snippet を next execution issue の第一候補として維持する
- gate を満たさない場合は manual fill on fixed template を fallback candidate として優先し、script skeleton comparison は保留する

Current child follow-up:

- Issue 75: helper material shell snippet execution

## Non-Goals

- live DNS write automation
- provider credentials registration
- provider API integration
- workflow automation or scheduled execution
- Route 53 migration

## Current Status

- CLOSED
- GitHub Issue: #74
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/74
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 73 の execution-ready gate 後に比較すべき implementation candidate を切り出した
- current phase の recommended next execution shape を operator-invoked shell snippet comparison に寄せた
- provider credentials、API、live DNS write を含めない comparison issue に留めている
- current favorite の shell snippet input/output boundary と operator invocation shape を追加した
