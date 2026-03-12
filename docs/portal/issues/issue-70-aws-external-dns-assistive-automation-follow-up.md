## Summary

AWS production では external DNS source-of-truth を維持し、authoritative DNS writes を workflow / IaC に持ち込まない判断が固定されている。残っている作業は、その判断を壊さない範囲でどこまで assistive automation を許可するか、provider credentials と provider API boundary をどこに置くか、Route 53 non-adoption を current phase でどう維持するかを実務粒度で整理することである。

## Goal

external DNS assistive automation の次段比較軸を整理し、current fail-closed boundary を崩さない follow-up scope、許可条件、non-goals、next execution split を固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-70
- Title: AWS external DNS assistive automation follow-up を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS follow-up planning
- Priority: medium
- Predecessor: Issue 42 closed, Issue 46 closed, Issue 69 open

Objective
- Problem to solve: external DNS source-of-truth と Route 53 non-adoption judgment は fixed したが、manual helper automation、provider credential boundary、provider API integration の比較軸はまだ薄く、次の execution-ready preparation がどこまでか読み切れない
- Expected value: assistive automation を比較するための follow-up scope、許可条件、non-goals、execution split 条件を固定し、current fail-closed DNS governance を崩さない

Scope
- In scope: provider credential boundary、manual helper automation candidate、provider API boundary、Route 53 non-adoption 維持条件、next execution split、open questions table
- Out of scope: authoritative DNS write automation 実装、Route 53 migration 実行、DNS provider credentials live 登録、multi-account DNS design、incident-time emergency shortcut の新設
- Editable paths: docs/portal/issues/issue-70-aws-external-dns-assistive-automation-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: external DNS assistive automation の比較軸、許可条件、non-goals が読める
- [x] AC-2: provider credentials と authoritative writes の boundary が current judgment と矛盾しない
- [x] AC-3: live DNS change を含めない planning issue に留まっている

Implementation Plan
- Files likely to change: issue-70 only
- Approach: Issue 42 の operator memo と Issue 46 の governance judgment を入力に、assistive automation の depth、credential boundary、provider API 非採用条件、next execution split を planning record として具体化する
- Alternative rejected and why: Route 53 migration を再評価する案は current phase の non-adoption judgment を揺らすため採らない。workflow から authoritative DNS writes まで伸ばす案も provider credential boundary と rollback risk を広げるため採らない

Validation Plan
- Commands to run: get_errors on issue-70 markdown
- Expected results: scope、allowed/disallowed boundary、next split condition が明示される
- Failure triage path: Issue 42 と Issue 46 の external DNS wording を再照合し、helper / authoritative / migration の境界ずれを切り分ける

Risk and Rollback
- Risks: helper automation の議論が authoritative write automation 実装や Route 53 migration 再開に誤読されること
- Impact area: DNS governance, operator safety, rollback discipline
- Mitigation: assistive automation、authoritative write automation、migration judgment を明確に分離する
- Rollback: scope が広がりすぎた場合は credential boundary と helper candidate だけを残し、execution split は別 issue に切り出す
```

## Tasks

- [x] current external DNS governance を前提に assistive automation の論点を整理する
- [x] provider credentials と provider API boundary を current phase 向けに切り分ける
- [x] helper automation の allowed / disallowed boundary を整理する
- [x] next execution issue が必要になる条件を整理する

## Definition of Done

- [x] current source-of-truth と Route 53 non-adoption を崩さない wording で読める
- [x] helper automation と authoritative write automation の境界が読める
- [x] provider credentials と provider API integration の current-phase 非対象が読める
- [x] 次に execution-ready preparation issue を切る条件が読める

## Initial Notes

- Issue 42 は external DNS cutover / reversal の operator sequence、TTL 記録、minimum evidence を current operations memo として固定した
- Issue 46 は external DNS source-of-truth 維持、Route 53 non-adoption、operator-assist only automation、authoritative write prohibition を governance judgment として固定した
- current phase で不足しているのは source-of-truth judgment そのものではなく、helper automation を許可する場合の credential / API / evidence boundary の比較軸である

## Issue 70 Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は current external DNS governance を前提に、assistive automation をどこまで許可するかの planning に限定する
- authoritative DNS write automation、Route 53 migration 実行、provider credential live 登録は扱わない
- incident-time shortcut としての ad hoc automation は current phase に持ち込まない

### 2. helper automation candidate の第一案

提案:

- helper automation は reviewed CloudFront target、certificate reference、TTL baseline、public DNS resolution evidence の収集と整形に限定する
- helper output は operator review path を補助するものであり、approval boundary や live DNS write authority を置き換えない
- helper output が reviewed evidence path と衝突した場合は helper を stale 扱いにして manual reviewed values に戻る

### 3. provider credentials / API boundary の第一案

提案:

- current phase では provider credentials を repo 標準 contract に持ち込まない
- provider API integration は live authoritative write を前提にしやすいため、current phase では比較対象に留めて実装対象にしない
- helper automation が将来必要でも、まずは credential-free な read-only evidence assembly から検討する

### 4. Route 53 non-adoption の維持条件

提案:

- Route 53 non-adoption は current phase の fail-closed rule として維持する
- reconsideration は ownership transfer、credential model、rollback sequence、operator review path の同時再設計が揃った場合に限る
- incident 中の migration shortcut として Route 53 を持ち込まない

### 5. next execution split の第一案

提案:

- 次の execution-ready issue は provider credentials live 登録ではなく、read-only helper material の format、review path、staleness handling を固定する preparation issue に留める
- live DNS writes や provider API execution が必要になった場合は、separate execution issue と separate approval boundary を要求する

### 6. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                               | 判断方向（Discussion 時点の仮）                                                                | Resolution 確定文言                                                                                                                                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assistive automation を何に限定するか              | reviewed target、certificate reference、TTL、public resolution evidence の収集と整形に限定する | `assistive automation は reviewed CloudFront target、certificate-related reference、TTL baseline、public DNS resolution evidence の収集と整形に限定し、authoritative DNS write を含めない`                        |
| helper output を approval boundary に使うか        | no。operator review path の補助に留める                                                        | `helper output は operator review path の補助に留め、approval boundary や live DNS write authority を置き換えない`                                                                                                |
| provider credentials を current phase でどう扱うか | repo standard contract に持ち込まず、live 登録を要求しない                                     | `current phase では DNS provider credentials を repo standard contract に持ち込まず、assistive automation のための live credential registration を要求しない`                                                     |
| provider API integration を current phase で採るか | no。比較対象に留める                                                                           | `provider API integration は live authoritative write へ近づきすぎるため current phase では比較対象に留め、implementation 対象にしない`                                                                           |
| Route 53 non-adoption をどう維持するか             | ownership、credential、rollback、review path の再設計が揃うまで維持する                        | `Route 53 non-adoption は ownership transfer、credential model、rollback sequence、operator review path の再設計が揃うまで current phase judgment として維持する`                                                 |
| 次の execution issue をどこで分けるか              | read-only helper material preparation と live execution を分ける                               | `next execution split は read-only helper material の format、review path、staleness handling を固定する preparation issue と、live DNS write や provider API execution を含む separate execution issue に分ける` |

## Resolution

Issue 70 の判断結果は次の通りとする。

- assistive automation は reviewed CloudFront target、certificate-related reference、TTL baseline、public DNS resolution evidence の収集と整形に限定し、authoritative DNS write を含めない
- helper output は operator review path の補助に留め、approval boundary や live DNS write authority を置き換えない
- current phase では DNS provider credentials を repo standard contract に持ち込まず、assistive automation のための live credential registration を要求しない
- provider API integration は live authoritative write へ近づきすぎるため current phase では比較対象に留め、implementation 対象にしない
- Route 53 non-adoption は ownership transfer、credential model、rollback sequence、operator review path の再設計が揃うまで current phase judgment として維持する
- next execution split は read-only helper material の format、review path、staleness handling を固定する preparation issue と、live DNS write や provider API execution を含む separate execution issue に分ける

この合意で明確になること:

- current external DNS governance は helper automation を許容しても source-of-truth や approval boundary を AWS 側へ移さない
- credential-free、read-only な evidence assembly までは current phase でも検討できるが、live write を伴う provider integration は別段階の判断を要する
- helper automation は transcription drift を減らすための補助であり、incident-time shortcut や implicit approval path にはならない
- Route 53 migration は current production path の改善 shortcut ではなく、別設計を要求する separate judgment のまま維持される
- 次に進む場合も、いきなり credential live registration や provider API 実装へ進まず、reviewable helper material preparation から始めるのが妥当である

## Follow-Up Direction

- reviewed target、certificate-related reference、TTL baseline、public resolution result を 1 つの helper material に束ねる format を定義する
- helper material が stale だった場合の fallback を current operator review path にどう戻すかを定義する
- live DNS write や provider API execution を要求する場合の separate approval boundary と evidence retention 条件を別 issue で設計する

Current child follow-up:

- Issue 73: read-only helper material preparation

## Current Status

- CLOSED
- GitHub Issue: #70
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/70
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- external DNS assistive automation の follow-up scope を placeholder から planning record へ拡張した
- helper automation、provider credentials、provider API integration、Route 53 non-adoption、next execution split の current-phase judgment を明文化した
- read-only helper material preparation は Issue 73 へ分離し、field set、review path、stale handling の preparation scope を子 issue へ引き渡した
- child Issue 73 は operator paste-back procedure と execution-ready gate まで具体化された
- authoritative write automation と Route 53 migration 実行は非対象のまま維持している
