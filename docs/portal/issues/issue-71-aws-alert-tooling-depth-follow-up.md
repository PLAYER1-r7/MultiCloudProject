## Summary

AWS production では deploy evidence path を canonical first-response path とし、optional pointer channel だけを許可する alert delivery baseline が固定されている。残っている作業は、provider-specific alert tooling をどこまで導入するか、owner-bound external destination をどこまで増やすか、24x7 staffing や broad chat fan-out を current phase に持ち込まない範囲をどこで切るかである。

## Goal

alert tooling depth の next follow-up scope を整理し、current operator-first alert path を壊さない比較軸を固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-71
- Title: AWS alert tooling depth follow-up を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production alert follow-up planning
- Priority: medium
- Predecessor: Issue 41 closed, Issue 44 closed, Issue 45 closed, Issue 69 drafted

Objective
- Problem to solve: alert routing と alert delivery baseline は fixed したが、provider-specific alert tooling と staffing depth の次段比較軸は未整理である
- Expected value: alert tooling の follow-up を owner、destination、staffing、non-goals の単位で分離できる

Scope
- In scope: owner-bound external destination depth、provider-specific alert tooling comparison、staffing assumptions、dashboard / SLO-SLI を含めない current-phase boundary
- Out of scope: CloudWatch/SNS live 実装、24x7 on-call 体制の開始、automatic remediation、broad chat fan-out 実装
- Editable paths: docs/portal/issues/issue-71-aws-alert-tooling-depth-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: alert tooling depth の比較軸と non-goals が読める
- [x] AC-2: current deploy evidence path が canonical source のまま維持されている
- [x] AC-3: live alert product 導入を含めない follow-up issue に留まっている

Implementation Plan
- Files likely to change: issue-71 only
- Approach: Issue 41, 44, 45 の closed records を入力に、alert tooling と staffing depth だけを切り出す
- Alternative rejected and why: CloudWatch/SNS 実装まで同時に扱う案は owner と staffing の前提が不足しているため採らない

Validation Plan
- Commands to run: get_errors on issue-71 markdown
- Expected results: canonical first-response path and non-goals are explicit
- Failure triage path: alert routing と alert delivery の closed records を再照合する

Risk and Rollback
- Risks: alert tooling の議論が 24x7 on-call 導入済みの前提に見えること
- Impact area: incident routing, staffing expectations
- Mitigation: owner-bound destination と canonical evidence path を先に固定する
- Rollback: scope が広がりすぎた場合は destination depth だけを残し staffing は別 issue に切り出す
```

## Follow-Up Focus

- owner-bound external destination をどこまで増やすか
- provider-specific alert tooling を current phase で比較対象にするか
- staffing depth と broad fan-out をどこで non-goal に維持するか
- canonical first-response path を deploy evidence path のまま保つ条件は何か

## Discussion Draft

### 1. owner-bound external destination depth の第一案

提案:

- current phase で増やす external destination は repository owner が直接管理できる宛先に限定する
- destination を増やす場合も、deploy evidence path を first-response source とし、external destination は pointer channel に留める
- broad chat room や team-wide fan-out は operator ownership が薄くなるため current phase の対象にしない

### 2. provider-specific alert tooling comparison の第一案

提案:

- provider-specific tooling は live 導入候補ではなく comparison table として扱う
- 比較軸は setup ownership、destination control、message fidelity、cost/lock-in、current deploy evidence path との接続容易性に限定する
- CloudWatch/SNS 実装や third-party paging product 導入は staffing と owner model が固まるまで non-goal のまま維持する

### 3. staffing assumptions の第一案

提案:

- current phase は repository owner 중심の small-team response を前提にする
- 24x7 on-call rotation、escalation ladder、mandatory acknowledgement SLA は current phase で要求しない
- alert tooling の議論は human coverage 拡張ではなく、owner が missed alert を減らすための補助線に留める

### 4. canonical first-response path の維持条件

提案:

- canonical first-response path は deploy evidence path と issue / run record を維持する
- external destination は「異常を気付くための pointer」であり、incident truth や approval log の source-of-truth にはしない
- external destination と canonical path の内容が衝突した場合は deploy evidence path を優先する

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                                          | 判断方向（Discussion 時点の仮）                | Resolution 確定文言                                                                                                                                                               |
| ------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| external destination をどこまで増やすか                       | owner-bound destination のみ比較対象にする     | `current phase の external destination は repository owner が直接管理できる owner-bound destination に限定し、broad fan-out を含めない`                                           |
| provider-specific tooling をどう扱うか                        | live 導入ではなく comparison に留める          | `provider-specific alert tooling は current phase では live implementation 対象にせず、ownership、message fidelity、cost、deploy evidence path 接続の比較対象に留める`            |
| staffing depth をどう置くか                                   | small-team response を前提に 24x7 を要求しない | `current phase の staffing assumption は repository owner 中心の small-team response とし、24x7 on-call rotation や acknowledgement SLA を要求しない`                             |
| canonical first-response path を何に置くか                    | deploy evidence path を維持する                | `canonical first-response path は deploy evidence path と related issue/run record に置き、external destination は pointer channel に留める`                                      |
| external destination と canonical path が衝突したらどうするか | deploy evidence path を優先する                | `external destination の通知内容が deploy evidence path と衝突した場合は canonical source である deploy evidence path を優先し、external destination は stale pointer として扱う` |

## Resolution

Issue 71 の判断結果は次の通りとする。

- current phase の external destination は repository owner が直接管理できる owner-bound destination に限定し、broad fan-out を含めない
- provider-specific alert tooling は current phase では live implementation 対象にせず、ownership、message fidelity、cost、deploy evidence path 接続の比較対象に留める
- current phase の staffing assumption は repository owner 中心の small-team response とし、24x7 on-call rotation や acknowledgement SLA を要求しない
- canonical first-response path は deploy evidence path と related issue/run record に置き、external destination は pointer channel に留める
- external destination の通知内容が deploy evidence path と衝突した場合は canonical source である deploy evidence path を優先し、external destination は stale pointer として扱う

この合意で明確になること:

- alert tooling の next step は live product 導入ではなく、owner-bound destination の比較と review path 整理である
- pointer channel を許容しても canonical incident truth は deploy evidence path のまま残る
- staffing expansion を前提にしないため、current phase の alert hardening は small-team 現実に合わせて進められる
- broad fan-out や paging escalation を急いで入れないことで、通知だけ増えて operator responsibility が曖昧になることを避けられる

## Next Comparison Frame

- owner-bound external destination の候補を列挙し、ownership と retention を比較する
- provider-specific tooling を導入しない場合の manual pointer pattern を整理する
- stale pointer を検知した場合に deploy evidence path へ戻す review rule を別 issue に切る必要があるか比較する

## Owner-Bound Destination Comparison Draft

current phase で比較対象にできる owner-bound destination は、次の表の粒度で扱う。

| 候補                                                  | Ownership                                                              | Retention / Traceability                                                          | Deploy evidence path との接続                                                      | Current-phase judgment   |
| ----------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| repository owner-managed email destination            | repository owner が直接管理できる場合のみ許容候補                      | message retention は mail provider 側に依存し、canonical incident log にはしない  | run URL、issue link、artifact pointer を載せやすい                                 | comparison 対象に残す    |
| repository owner-managed direct messaging destination | repository owner が単独で確認・管理できる場合のみ許容候補              | retention や searchability は provider 差が大きいため canonical record にはしない | pointer message としては使えるが evidence 本文は issue/run record へ戻す必要がある | comparison 対象に残す    |
| team shared chat channel                              | ownership が分散し current small-team phase の責任境界を曖昧にしやすい | retention policy と既読責任が曖昧になりやすい                                     | pointer は送れても canonical first-response path を代替しやすい                    | current phase では非対象 |
| third-party paging product                            | ownership、cost、acknowledgement expectation が current phase には重い | audit trail は持てても staffing expansion と一体になりやすい                      | deploy evidence path と二重運用になりやすい                                        | current phase では非対象 |

Comparison rule:

- 比較表に残す候補は repository owner が直接 owner を説明できる destination のみとする
- retention や searchability が強くても、それ自体を canonical incident record とみなさない
- pointer message に含める情報は run URL、issue reference、artifact reference までに留め、approval や incident truth を外部 destination へ移さない
- current phase では候補比較までに留め、live destination enable は別判断に残す

## Manual Pointer Pattern Draft

- external destination に送る内容は deploy evidence path への pointer summary に限定する
- pointer summary は alert type、run URL、issue/reference path、operator next check の 4 要素を最小構成にする
- pointer が欠落、遅延、衝突した場合でも first response は deploy evidence path から開始する
- pointer channel 側にだけ存在する判断や acknowledgement は有効な approval log とみなさない

## Current-Phase Narrowing Decision

current phase で実際に残す候補は primary candidate の 1 つに絞る。

### Primary candidate

- repository owner-managed email destination を primary candidate とする
- 理由は、repository owner 単独 ownership を説明しやすく、run URL、issue link、artifact pointer を最も素直に残せるためである
- retention は mail provider 依存でも、pointer message の内容を deploy evidence path へ戻す前提と整合しやすい

### Comparison-only candidate

- repository owner-managed direct messaging destination は comparison-only candidate に留める
- 理由は、owner-bound を維持したまま short pointer を送れるが、retention と searchability の弱さにより current phase の single-path destination としては弱いためである
- current phase では enable 候補として残さず、将来 owner redundancy が必要になった場合の reference comparison にだけ使う

### Excluded for current phase

- team shared chat channel は ownership と acknowledgement boundary が分散するため current phase では除外する
- third-party paging product は staffing expansion と acknowledgement expectation を持ち込みやすいため current phase では除外する

Narrowing rule:

- current phase の live candidate は repository owner-managed email destination の 1 候補に限定する
- repository owner-managed direct messaging destination は comparison table に残しても live enable 候補には進めない
- live enable の判断は primary candidate 単独で first-response path が壊れないことを前提に行う
- owner redundancy が必要になった場合だけ、direct messaging destination を separate follow-up comparison として再検討する

## Primary Email Pointer Template Draft

primary candidate として扱う email destination へ送る pointer message は、次の最小テンプレートを基準にする。

```text
Subject: [portal-web][aws-production] alert pointer

Alert Type: <alert-type>
Run URL: <workflow-run-url>
Issue / Reference Path: <current-issue-record-path>
Artifact Pointer: <artifact-name-or-N/A>
Operator Next Check: open deploy evidence path and verify current status
Note: this email is a pointer only; canonical incident truth and approval remain in deploy evidence path
```

Template rule:

- Subject は app、environment、pointer であることが一読で分かる固定 prefix を持たせる
- Alert Type は provider 固有の raw payload 全文ではなく、operator が first check を始めるための短い分類に留める
- Run URL は canonical deploy evidence path へ最短で戻れる値を優先する
- Issue / Reference Path は current issue record のみを許容し、run record や handoff note を代替に使わない
- Artifact Pointer は relevant artifact がない場合 `N/A` を許容し、推測値を書かない
- Operator Next Check は deploy evidence path を開く行動を必ず明示し、email 内で判断を完結させない
- Note は pointer only であること、approval log ではないことを毎回明記する

## Primary Email Usage Rule

- email pointer は current phase で 1 通の short summary に限定し、長文の incident narrative を本文へ持ち込まない
- email 本文にだけ存在する判断、acknowledgement、override は有効な incident record とみなさない
- email delivery failure が疑われる場合でも first response は deploy evidence path から開始し、email 再送を前提条件にしない

## Issue Reference Path Rule

- current phase の Issue / Reference Path は current issue record の 1 種類に限定する
- run URL が execution evidence path を担い、Issue / Reference Path は operator-facing decision record を指す役割に分ける
- handoff note や temporary record は current issue record の代替に使わず、必要なら issue record 側へ内容を寄せてから pointer を送る
- issue record が未整備の状態では reference path を増やさず、email pointer は run URL と operator next check のみで canonical path へ戻す

## Alert Type Classification Draft

current phase の email pointer で許容する Alert Type は次の fixed labels に限定する。

| Alert Type                         | Use When                                                                                                               | Excluded Detail                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `deploy-failure`                   | production deploy run が失敗し、deploy evidence path の確認が first action になるとき                                  | provider raw payload 全文、step-by-step failure narrative |
| `post-deploy-verification-failure` | deploy 後 verification が fail し、artifact と run summary の確認が first action になるとき                            | browser trace 全文、 ad hoc operator commentary           |
| `manual-check-required`            | automated signal だけでは判断を閉じられず、operator に canonical evidence path の確認を要求するとき                    | speculative incident diagnosis、approval suggestion       |
| `delivery-path-warning`            | pointer channel や surrounding notification path に warning があり、deploy evidence path からの first check を促すとき | delivery provider internal error dump、retry transcript   |

Classification rule:

- email pointer の Alert Type は上表の fixed labels から 1 つだけ選ぶ
- current phase では severity、priority、service tier の追加 taxonomy を持ち込まない
- provider 固有の event name は email pointer にそのまま書かず、必要なら deploy evidence path 側で追跡する
- `manual-check-required` は unknown を埋めるための汎用逃げ道ではなく、automation が canonical path への pointer しか出せない場合に限定する
- classification に迷う場合は email pointer を複雑化せず、deploy evidence path への pointer だけを維持して `manual-check-required` を使う

## Alert Type Usage Note

- `deploy-failure` と `post-deploy-verification-failure` は workflow run 起点の pointer に優先して使う
- `delivery-path-warning` は incident truth ではなく pointer path 自体の warning であることを明示するため、他の Alert Type と混在させない
- one email, one Alert Type を原則にし、複数の状態を 1 通へ詰め込まない

## Current-Phase Final Candidate Decision

- current phase の live enable 候補は repository owner-managed email destination のみとする
- repository owner-managed direct messaging destination は owner-bound comparison の参考として残すが、現時点では live pointer channel に採用しない
- この判断により、pointer destination は single owner、single retained path に寄せ、運用責任と見落とし時の切り分けを単純化する
- secondary channel を増やす判断は staffing、retention、acknowledgement expectation を別に再評価した後でしか行わない

Current child follow-up:

- Issue 76: primary email pointer implementation comparison

## Current Status

- CLOSED
- GitHub Issue: #71
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/71
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- alert tooling depth の follow-up scope を current alert routing / delivery baseline と分離して起票した
- CloudWatch/SNS 実装、24x7 on-call、automatic remediation は非対象のまま維持している
- owner-bound destination、provider comparison、staffing assumption、canonical first-response path の current-phase judgment を追加した
- owner-bound destination comparison table と manual pointer pattern の draft を追加した
- current phase の live candidate を email primary の 1 つに絞り、direct messaging は comparison-only に戻した
- primary candidate 向けの email pointer message 最小テンプレートと usage rule を追加した
- primary email pointer に許容する Alert Type を fixed labels へ限定した
- primary email pointer の Issue / Reference Path を current issue record の 1 種類へ限定した
