## Summary

AWS production では rollback target、operator restore sequence、DNS reversal memo が固定されている。残っている作業は、incident runbook をどこまで深掘りするか、walkthrough cadence や emergency override をどこまで operator-managed boundary に含めるか、automatic rollback を current phase で非採用のまま維持するかを整理することである。

## Goal

rollback and runbook depth の next follow-up scope を整理し、current operator-managed rollback path を壊さない比較軸を固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-72
- Title: AWS rollback and runbook depth follow-up を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production rollback follow-up planning
- Priority: medium
- Predecessor: Issue 40 closed, Issue 42 closed, Issue 69 drafted

Objective
- Problem to solve: rollback readiness と DNS reversal memo は fixed したが、runbook depth、walkthrough cadence、emergency override boundary の次段比較軸は未整理である
- Expected value: rollback hardening の follow-up を runbook、walkthrough、override、non-goals の単位で分離できる

Scope
- In scope: incident runbook depth、walkthrough cadence、emergency override boundary、automatic rollback 非採用の current-phase 維持条件
- Out of scope: automatic rollback 実装、live DNS reversal automation、incident command system の全面整備、workflow changes
- Editable paths: docs/portal/issues/issue-72-aws-rollback-and-runbook-depth-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: rollback and runbook depth の比較軸と non-goals が読める
- [x] AC-2: current rollback target と DNS reversal memo が前提として維持されている
- [x] AC-3: live rollback automation を含めない follow-up issue に留まっている

Implementation Plan
- Files likely to change: issue-72 only
- Approach: Issue 40 と Issue 42 の closed records を入力に、runbook depth と walkthrough boundary だけを切り出す
- Alternative rejected and why: automatic rollback 実装まで同時に扱う案は current operator-managed rollback boundary を超えるため採らない

Validation Plan
- Commands to run: get_errors on issue-72 markdown
- Expected results: runbook depth and non-goals are explicit
- Failure triage path: rollback readiness と DNS reversal memo の責務境界を再確認する

Risk and Rollback
- Risks: runbook depth の議論が automatic rollback 実装前提に見えること
- Impact area: rollback safety, incident response clarity
- Mitigation: current rollback target と operator-managed boundary を前提に固定する
- Rollback: scope が広がりすぎた場合は walkthrough cadence だけを残し override は別 issue に切り出す
```

## Follow-Up Focus

- incident runbook をどこまで current phase で深掘りするか
- rollback walkthrough cadence をどう定義するか
- emergency override をどの approval boundary に置くか
- automatic rollback を current phase で非採用に維持する条件は何か

## Discussion Draft

### 1. incident runbook depth の第一案

提案:

- current phase の runbook depth は rollback trigger、operator first actions、required evidence path、service restoration confirmation の 4 要素に限定する
- provider-specific deep operation や incident command system 全面整備は current phase の対象にしない
- runbook は operator memory を減らすための最小チェックポイント集とし、完全な incident manual を目指さない

### 2. rollback walkthrough cadence の第一案

提案:

- walkthrough は live rollback rehearsal ではなく、current rollback target と evidence path を辿れる desk-check を基本にする
- cadence は release ごと mandatory ではなく、rollback target 更新時または major operational change 後の review を比較対象にする
- walkthrough 結果は issue / handoff note に残し、別系統の運用ノートに分散させない

### 3. emergency override boundary の第一案

提案:

- emergency override は operator-managed rollback path から逸脱する shortcut ではなく、current documented path へ戻るための判断としてのみ扱う
- undocumented override や ad hoc DNS shortcut は current phase で許容しない
- override の必要が出た場合でも approval boundary と evidence retention を欠いた live action は non-goal のまま維持する

### 4. automatic rollback non-adoption の維持条件

提案:

- automatic rollback は current phase では非採用のまま維持する
- reconsideration には rollback trigger quality、false positive cost、DNS reversal boundary、operator approval path の再設計が必要である
- workflow change や live DNS reversal automation を含む改善は separate execution issue に残す

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                         | 判断方向（Discussion 時点の仮）                                        | Resolution 確定文言                                                                                                                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| runbook をどこまで深掘りするか                               | trigger、first action、evidence、restoration confirmation に限定する   | `current phase の incident runbook depth は rollback trigger、operator first actions、required evidence path、service restoration confirmation の 4 要素に限定する`        |
| walkthrough cadence をどう置くか                             | live rehearsal ではなく rollback target 更新時 review を比較対象にする | `rollback walkthrough cadence は live rollback rehearsal を要求せず、rollback target 更新時または major operational change 後の desk-check review を比較対象にする`        |
| emergency override をどう扱うか                              | documented path へ戻るための判断に限定する                             | `emergency override は operator-managed rollback path からの shortcut として許容せず、current documented path へ戻るための判断に限定する`                                  |
| automatic rollback をどう維持するか                          | current phase では非採用を維持する                                     | `automatic rollback は rollback trigger quality、false positive cost、DNS reversal boundary、operator approval path の再設計が揃うまで current phase では非採用を維持する` |
| workflow change や live DNS reversal automation をどう扱うか | separate execution issue に残す                                        | `workflow change と live DNS reversal automation は current follow-up scope に含めず、separate execution issue と approval boundary に残す`                                |

## Resolution

Issue 72 の判断結果は次の通りとする。

- current phase の incident runbook depth は rollback trigger、operator first actions、required evidence path、service restoration confirmation の 4 要素に限定する
- rollback walkthrough cadence は live rollback rehearsal を要求せず、rollback target 更新時または major operational change 後の desk-check review を比較対象にする
- emergency override は operator-managed rollback path からの shortcut として許容せず、current documented path へ戻るための判断に限定する
- automatic rollback は rollback trigger quality、false positive cost、DNS reversal boundary、operator approval path の再設計が揃うまで current phase では非採用を維持する
- workflow change と live DNS reversal automation は current follow-up scope に含めず、separate execution issue と approval boundary に残す

この合意で明確になること:

- rollback hardening の next step は automation 実装ではなく、operator が迷わない最小 runbook depth の整備である
- walkthrough を desk-check に限定することで、current small-team phase でも継続可能な review cadence を保てる
- emergency override を shortcut として許容しないため、incident 時も documented path と evidence retention が崩れにくい
- automatic rollback を急がないことで、false positive や DNS reversal を含む複合障害で被害を広げるリスクを避けられる

## Next Comparison Frame

- rollback trigger と first actions を 1 枚の operator checklist に束ねるか比較する
- walkthrough review note の最小フォーマットを別 issue に切る必要があるか比較する
- override request を記録する approval/evidence path を current issue chain のどこへ置くか比較する

## Operator Checklist Draft

current phase の operator checklist は、rollback automation を前提にせず次の順序で確認する最小 draft とする。

```text
AWS Production Rollback Operator Checklist

1. Confirm rollback trigger
- verify that current incident or failed release requires rollback consideration
- confirm that deploy evidence path is the canonical source for current status

2. Confirm current rollback target
- identify the current last known-good run or artifact reference
- verify that the rollback target matches the documented production rollback record

3. Perform operator first actions
- open the deploy run, issue record, and relevant artifact reference
- confirm whether rollback can proceed on the documented path without undocumented shortcuts

4. Confirm required evidence path
- record the run URL, issue/reference path, and relevant artifact pointer used for the decision
- keep DNS-related evidence on the documented path and do not replace it with ad hoc notes

5. Confirm service restoration
- verify that the expected service restoration checks have been completed
- record that restoration confirmation is based on the documented evidence path, not memory or chat-only acknowledgement
```

Checklist rule:

- checklist は rollback trigger、operator first actions、required evidence path、service restoration confirmation の 4 要素を 1 枚で確認するための draft に留める
- undocumented shortcut、automatic rollback step、live DNS reversal automation は checklist に含めない
- 1 項目でも documented path に接続できない場合は rollback 実行判断を進めず、current evidence path の不足として扱う
- checklist の完了は override approval や incident close を意味せず、operator が documented rollback path に留まっている確認に使う

## Checklist Usage Note

- rollback trigger は failed deploy、post-deploy verification failure、または documented service degradation から開始する
- operator first actions は新しい判断を作るためではなく、Issue 40 と Issue 42 で固定した documented path へ戻るために使う
- service restoration confirmation は deploy evidence path、rollback record、required verification result が揃った場合にだけ記録する
- checklist の各項目は walkthrough note に転記できても、separate system of record を新設しない

## Walkthrough Review Note Draft

desk-check として扱う walkthrough review は、次の最小フォーマットを基準に記録する。

```text
AWS Production Rollback Walkthrough Review

- Review Trigger: <rollback-target-update-or-major-operational-change>
- Review Date: <UTC date>
- Rollback Target Reference: <last-known-good run or artifact reference>
- Evidence Path Checked: <run URL / issue path / artifact reference>
- Checklist Result: <pass-or-gaps-found>
- Open Gap: <none-or-short gap summary>
- Next Action: <no-change-or-follow-up-needed>
- Note: walkthrough is a desk-check only and does not authorize rollback or override
```

Review note rule:

- Review Trigger は rollback target 更新、major operational change、または operator handoff review のいずれかに限定する
- Rollback Target Reference と Evidence Path Checked は documented path にある値だけを再掲し、推測値を入れない
- Checklist Result は `pass` か `gaps-found` の 2 値に留め、曖昧な中間状態を作らない
- Open Gap がある場合は long narrative を書かず、separate follow-up が必要かだけを短く残す
- Next Action は `no-change` または `follow-up-needed` のどちらかに寄せ、desk-check と live action を混ぜない
- Note は desk-check only であること、rollback approval や override request を兼ねないことを毎回明記する

## Walkthrough Usage Note

- walkthrough review note は issue record か handoff note のどちらか 1 箇所へ残し、重複した記録を作らない
- `gaps-found` の場合は rollout/rollback 実行前に documented path の不足として扱い、ad hoc workaround を正当化しない
- `no-change` は current documented path が desk-check で読めたことを示すだけで、live recovery の成功証跡には使わない
- walkthrough note は override approval path の代替ではなく、次回 review までの比較基準としてのみ使う

## Override Request Path Draft

current phase の override request は separate approval system を新設せず、次の最小 path に限定する。

```text
AWS Production Rollback Override Request

- Request Trigger: <why documented path alone is insufficient>
- Related Issue / Record Path: <current issue or handoff path>
- Evidence Path: <run URL / rollback record / DNS evidence path>
- Requested Deviation: <short description of the requested override>
- Risk Note: <why the override increases risk or bypasses a normal check>
- Approval Note: <repository-owner review required>
- Outcome: <approved-or-rejected>
- Note: override request does not replace documented rollback evidence or incident record
```

Override path rule:

- override request は current issue record か current handoff note のどちらか 1 箇所に記録し、chat-only approval を許容しない
- Related Issue / Record Path は current rollback issue chain の記録先 1 つに固定し、複数 issue へ分散させない
- Evidence Path には deploy evidence path、rollback record、必要なら documented DNS evidence path だけを載せ、口頭判断や未記録の観測を使わない
- Requested Deviation は documented path から何を外すかを短く書き、new execution plan や long narrative に広げない
- Approval Note は repository owner review required を固定文として持たせ、automatic approval や implied approval を許さない
- Outcome が `approved` の場合でも、override 自体は documented evidence path に紐づく一時判断として扱い、separate normal path に昇格させない

## Requested Deviation Classification Draft

current phase の Requested Deviation は次の fixed categories に限定する。

| Requested Deviation             | Use When                                                                                         | Excluded Content                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `sequence-reordering`           | documented steps の順序を一時的に入れ替えないと timing constraint を吸収できないとき             | 新しい rollback plan 全文、未承認の shortcut 手順 |
| `evidence-gap-temporary-bypass` | documented evidence の一部が一時的に欠けるが、残存 evidence で owner review に進む必要があるとき | 記録不要の口頭判断、恒久的な evidence 省略        |
| `verification-order-adjustment` | restoration verification の順序を変える必要があるが、verification 自体は維持するとき             | verification 項目の削除、成功判定の緩和           |
| `timing-window-exception`       | 通常の wait/order を維持すると operational window を逸するため、限定的な timing 例外が必要なとき | 常態化する特例、将来の標準運用化の示唆            |

Deviation rule:

- Requested Deviation は上表の fixed categories から 1 つだけ選び、その後ろに短い補足を 1 行付けるまでに留める
- current phase では `step-skip`、`dns-shortcut`、`approval-bypass` のような category は許容しない
- Requested Deviation は documented path のどの制約を一時的に調整するかだけを書き、代替実装案や恒久対策は follow-up issue に残す
- classification に迷う場合は override request を複雑化せず、documented path に戻って evidence を補う方向を優先する

## Override Usage Note

- override request は documented path に gap があるか、timing constraint があり通常順序を維持できない場合にだけ起票する
- `rejected` は rollback 不可を意味するのではなく、documented path に戻って evidence を補うべきことを意味する
- `approved` でも post-action evidence は通常どおり deploy evidence path と rollback record に残し、override request 本文だけで完結させない
- override request は incident close、rollback success、DNS reversal approval の代替ラベルにしない

Current child follow-up:

- Issue 78: rollback operator pack implementation comparison

## Current Status

- CLOSED
- GitHub Issue: #72
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/72
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- rollback and runbook depth の follow-up scope を current rollback readiness と DNS reversal memo から分離して起票した
- automatic rollback 実装と workflow 変更は非対象のまま維持している
- runbook depth、walkthrough cadence、emergency override boundary、automatic rollback 非採用条件の current-phase judgment を追加した
- rollback trigger、first actions、required evidence path、service restoration confirmation を束ねる operator checklist draft を追加した
- desk-check 用の walkthrough review note 最小テンプレートと usage rule を追加した
- override request を current issue/handoff path に記録する approval/evidence rule を追加した
- Requested Deviation に許容する current-phase category を fixed labels へ限定した
