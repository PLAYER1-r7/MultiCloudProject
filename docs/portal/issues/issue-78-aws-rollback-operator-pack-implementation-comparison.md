## Summary

Issue 72 で operator checklist draft、walkthrough review note、override request path、Requested Deviation fixed categories は current documented path の内側で固定できた。一方で、これらを次段でどう運用形へ束ねるかは未決定のままであり、single current-issue operator pack、split templates、local text generator のどれを next execution candidate にするかを comparison issue として切り出す必要がある。

## Goal

rollback operator pack の implementation comparison を整理し、current documented rollback path を壊さない next execution candidate を 1 つに絞れる状態にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-78
- Title: AWS rollback operator pack implementation comparison を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production rollback operator pack implementation comparison
- Priority: medium
- Predecessor: Issue 40 closed, Issue 42 closed, Issue 69 closed, Issue 72 closed

Objective
- Problem to solve: Issue 72 で checklist、walkthrough note、override request path は fixed したが、single current-issue operator pack、split templates、local text generator のどれを next execution candidate にするかは未決定である
- Expected value: implementation candidate の比較軸、non-goals、recommended next execution shape、current favorite の pack boundary を fixed し、current documented rollback path を壊さずに次 issue を切れる

Scope
- In scope: implementation candidate comparison、pack boundary、operator invocation shape、current issue/handoff path compatibility、stale handling、recommended next step
- Out of scope: automatic rollback 実装、workflow change、live DNS reversal automation、incident command system redesign、provider-specific deep operation
- Editable paths: docs/portal/issues/issue-78-aws-rollback-operator-pack-implementation-comparison.md, docs/portal/issues/issue-72-aws-rollback-and-runbook-depth-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: implementation candidate の比較軸と non-goals が読める
- [x] AC-2: recommended next execution shape が current documented rollback path と矛盾しない
- [x] AC-3: current favorite の pack boundary と operator invocation shape が読める
- [x] AC-4: rollback automation や workflow change を含めない comparison issue に留まっている

Implementation Plan
- Files likely to change: issue-78, issue-72
- Approach: Issue 72 の checklist、walkthrough note、override path を入力に、single current-issue operator pack、split templates、local text generator の 3 候補を evidence path clarity、drift risk、operational overhead、documented-path fit で比較する
- Alternative rejected and why: いきなり workflow-integrated rollback guidance に進む案は automatic rollback や execution path redesign に見えやすいため採らない

Validation Plan
- Commands to run: get_errors on issue-78 and updated issue-72 markdown; read back the comparison table and current favorite pack contract against Issue 72 rule set
- Expected results: candidate comparison、recommended next step、current favorite contract、manual fallback direction が読み取れる
- Failure triage path: Issue 72 の checklist / walkthrough / override rule を再照合し、candidate が documented path と evidence retention を壊していないか切り分ける

Risk and Rollback
- Risks: comparison issue が live rollback implementation や override shortcut の承認済み record に誤読されること
- Impact area: rollback discipline, incident traceability, operator review path
- Mitigation: comparison を template packaging と documented-path compatibility に限定し、automation と workflow change は non-goals に残す
- Rollback: candidate comparison が広がりすぎた場合は comparison table だけを残し、recommended next step を保留する
```

## Tasks

- [x] implementation candidate を列挙する
- [x] comparison table を整理する
- [x] recommended next execution shape を固定する
- [x] current favorite の operator pack contract draft を整理する
- [x] non-goals を明文化する

## Definition of Done

- [x] current favorite draft と contract boundary が 1 文書で読める
- [x] output shape と field order が predecessor template / rule set に接続している
- [x] operator invocation、fallback、validation shape が読める
- [x] live integration、provider access、automation expansion が非対象のまま維持されている

## Initial Notes

- Issue 72 は operator checklist draft、walkthrough review note、override request path、Requested Deviation fixed categories を固定した
- current phase で比較対象にできるのは documented rollback path を維持しつつ、operator が必要な template set をどこまで 1 つの pack にまとめるかである
- automation や workflow integration ではなく、documented-path discipline を崩さない運用 packaging を first comparison target とする

## Candidate Comparison Draft

### Candidate 1: single current-issue operator pack

- checklist、walkthrough review note、override request skeleton を current issue record か current handoff note の 1 箇所へまとめて置く
- evidence path は最も単純だが、operator が必要 section を毎回手で整える必要がある

### Candidate 2: split templates across issue and handoff

- checklist、walkthrough、override を separate sections または separate notes として扱う
- section ごとの独立性は高いが、current documented path が分散しやすく drift risk が上がる

### Candidate 3: local text generator for operator pack

- operator が local single-run command を実行し、current issue/handoff path に貼り付ける pack text block を得る
- drift reduction は期待できるが、generator contract と fallback rule を追加で固定する必要がある

## Comparison Table

| Candidate                                | Safety boundary                                  | Documented-path fit | Drift reduction | Operational overhead | Current-phase judgment |
| ---------------------------------------- | ------------------------------------------------ | ------------------- | --------------- | -------------------- | ---------------------- |
| single current-issue operator pack       | 最も安全で責務が明確                             | 高い                | 中              | 低い                 | current favorite       |
| split templates across issue and handoff | 記録分散の risk が高い                           | 低い                | 低い            | 中                   | comparison 対象に残す  |
| local text generator for operator pack   | pointer-only ではなく pack assembly を補助できる | 中                  | 高              | 中                   | comparison 対象に残す  |

Comparison rule:

- candidate comparison は checklist、walkthrough、override request の packaging と documented-path compatibility に限定する
- output は Issue 72 の checklist rule、walkthrough usage note、override path rule、Requested Deviation classification をそのまま満たす必要がある
- candidate が evidence path を current issue/handoff path 以外へ分散させる場合は採らない
- automatic rollback、workflow trigger、live DNS reversal automation を要求する候補は current phase で除外する

## Recommended Next Execution Shape

- current phase の recommended next execution shape は single current-issue operator pack を第一候補とする
- 理由は、Issue 72 で既に固定した checklist、walkthrough、override rule を 1 箇所に維持でき、documented path と evidence retention の責務を最も崩しにくいためである
- single current-issue operator pack は current issue record か current handoff note のどちらか 1 箇所だけに置く
- split templates は comparison-only に留め、local text generator は pack field order が安定した後で再評価する

## Operator Pack Contract Draft

current favorite として扱う single current-issue operator pack は、次の boundary に限定する。

### Required inputs

- `rollback_trigger_reference`: rollback consideration を開始する trigger summary
- `rollback_target_reference`: last known-good run か artifact reference
- `evidence_path_reference`: current issue path、run URL、artifact reference の最小組み合わせ
- `review_trigger_reference`: walkthrough review を起こした trigger
- `related_issue_or_handoff_path`: current issue record か current handoff note の 1 つ

### Allowed derived data

- generated timestamp
- default checklist placeholders
- default walkthrough result placeholder
- default override outcome placeholder

### Required output

- output は single text block のみとする
- text block は Operator Checklist、Walkthrough Review Note、Override Request Skeleton の 3 sections を固定順序で含む
- output には rollback approval、incident close、DNS shortcut、automatic rollback suggestion を含めない

### Operator invocation shape

- operator pack は current issue record か current handoff note のどちらか 1 箇所だけに貼る
- current issue/handoff path と deploy evidence path は operator 自身が先に開いて確認する
- pack は documented path に戻るための補助であり、live action authorization を兼ねない

### Contract rule

- one incident, one current-issue operator pack を維持する
- `related_issue_or_handoff_path` は current issue record か current handoff note のいずれか 1 つだけを許容する
- Requested Deviation は Issue 72 の fixed categories 以外を許容しない
- output が Issue 72 の rule set と衝突する場合は pack candidate を採らず、manual copy fallback に戻る

## Operator Pack Gate

- required inputs が reviewed values として揃っている
- output が Issue 72 の checklist、walkthrough、override rule を 1 文書で満たす
- output が current issue/handoff path を 1 箇所だけ使っている
- Requested Deviation placeholder が fixed categories へ接続している
- pack contract が automatic rollback、workflow change、DNS shortcut を要求しない

Gate outcome:

- gate を満たした場合のみ、single current-issue operator pack を next execution issue の第一候補として維持する
- gate を満たさない場合は split templates へ戻さず、manual copy on fixed templates を fallback candidate として優先する

## Operator Comparison Checklist

operator は current favorite を次段 execution issue に進めるか判断する前に次を順に確認する。

- [ ] candidate comparison が single current-issue operator pack、split templates、local text generator の 3 候補を崩さずに読める
- [ ] current favorite pack boundary が Issue 72 の checklist、walkthrough、override rule と接続している
- [ ] current issue / handoff path を 1 箇所に保つ rule と manual copy fallback が読める
- [ ] Requested Deviation placeholder が fixed categories に接続している
- [ ] automatic rollback、workflow change、DNS shortcut を推奨していない

Checklist rule:

- 1 項目でも満たせない場合は single current-issue operator pack を execution issue に進めず、comparison issue のまま gap を残す
- checklist 完了は rollback approval や override approval を意味せず、comparison close か next execution split に進める判断材料が揃ったことだけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Rollback Operator Pack Comparison Check

- Issue: #78
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Candidate Comparison Readable: yes | no
- Current Favorite Connected To Issue 72 Rules: yes | no
- Single Record Path Rule Preserved: yes | no
- Requested Deviation Categories Preserved: yes | no
- Non-Goal Direction Preserved: yes | no
- Result: ready-for-execution-split | keep-comparison-open
- Note: checklist completion confirms comparison readiness only; it does not approve rollback or override actions
```

Current child follow-up:

- Issue 79: single current-issue operator pack execution

## Non-Goals

- automatic rollback implementation
- workflow-integrated rollback guidance
- live DNS reversal automation
- incident command system redesign
- provider-specific deep operation
- approval path redesign

## Current Status

- CLOSED
- GitHub Issue: #78
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/78
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- Issue 72 の documented rollback discipline を implementation comparison issue として切り出した
- single pack、split templates、local text generator の 3 候補を current-phase boundary 内で比較した
- current favorite として single current-issue operator pack の boundary と gate を追加した
