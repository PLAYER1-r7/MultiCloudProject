# Summary

Issue 127 から Issue 133 までで、簡易SNSの product scope、auth boundary、message persistence、backend API、security floor、stack split、stateful monitoring/test/rollback baseline は current planning chain として揃った。一方で、これらが揃っても unrelated feature が shared auth、shared layout、shared API client、shared form primitive を変更したときに、SNS の write/read/auth critical path をどの gate で守るかが fresh chain 側ではまだ固定されていない。

既存の Issue 112 は protection baseline の歴史的参照として有効だが、current chain では Issue 127 から Issue 133 の judgment を前提に、SNS-owned boundary、shared-layer touch rule、critical-path regression gate、explicit exception process を fresh issue として固定し直す必要がある。

# Goal

簡易SNSを後続機能変更から守るために、current planning chain を前提にした SNS-owned boundary、shared-layer touch rule、critical-path regression gate、exception process、concrete regression targets を 1 issue で読めるようにする。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-134
- Title: SNS implementation protection and change-isolation baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md accepted as the current operational baseline reference

Objective
- Problem to solve: SNS の current baseline が揃っても、unrelated feature が shared auth、shared layout、shared client wrapper、shared form primitive、shared state wrapper を変更したときの no-touch zone と regression gate が未固定だと、write/read/auth critical path の破壊を review and test gate で止めにくい
- Expected value: current SNS planning chain を前提に、どこが SNS-owned no-touch zone か、shared layer を触るときに何を回帰確認すべきか、どんな例外手順で SNS internals 変更を許すかを fresh issue 単位で参照できる
- Terminal condition: SNS-owned boundary、shared-layer touch rule、critical-path regression gate、exception process、regression target matrix が fixed judgment として読め、implementation slice と later unrelated feature work が同じ protection contract を参照できる

Scope
- In scope: SNS ownership boundary、shared-layer touch rule、critical-path regression gate、exception process、concrete regression targets、compatibility checklist、first release non-goals
- Out of scope: actual CI workflow implementation、test framework selection、codeowners enforcement、database implementation、auth provider live selection、Azure implementation detail
- Editable paths: docs/portal/issues/issue-134-sns-implementation-protection-and-change-isolation-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/, historical closed issue records except reference reading

Acceptance Criteria
- [ ] AC-1: unrelated feature が原則として触ってよい shared-touch zone と、触ってはいけない SNS-owned no-touch zone が明文化されている
- [ ] AC-2: shared-layer change 時に必要な SNS critical-path regression gate が明文化されている
- [ ] AC-3: route、auth、API client、form、layout、state management、error handling の regression target が具体化されている
- [ ] AC-4: exception process と non-goals があり、broad platform-wide freeze に膨らんでいない

Implementation Plan
- Files likely to change: docs/portal/issues/issue-134-sns-implementation-protection-and-change-isolation-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: historical Issue 112 の protection baseline を参照しつつ、Issue 127 から Issue 133 の current SNS boundary を前提に fresh protection issue として再構成し、shared auth、route、client wrapper、form primitive、stateful path への回帰 gate を current chain 向けに固定する
- Alternative rejected and why: historical Issue 112 をそのまま current chain の derived follow-up に再利用する案は、old chain の依存関係と close 状態を current chain に混在させ、Issue 127 から Issue 133 の updated boundary を前提にした fresh contract として読みにくくなるため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、ownership boundary、shared-layer touch rule、critical regression target、exception process、non-goals が issue 単位で読める
- Failure triage path: issue-130 API baseline、issue-131 security floor、issue-132 stack split、issue-133 operational baseline、historical issue-112 protection baseline を照合し、boundary、gate、target、exception のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: protection baseline が強すぎて shared layer の正常な改善まで止めるか、逆に曖昧すぎて unrelated feature の SNS 破壊を止められないこと
- Impact area: future feature development, SNS stability, review discipline, regression evidence depth
- Mitigation: absolute ban ではなく no-touch zone、shared-touch zone、critical-path gate、exception rule、compatibility checklist を分けて定義し、implementation detail は non-goal に残す
- Rollback: scope が広がりすぎた場合は no-touch zone、shared-layer touch rule、critical regression target の 3 点だけを残し、workflow enforcement や ownership automation は separate issue へ分離する
```

# Tasks

- [ ] SNS-owned boundary を fixed judgment にする
- [ ] shared-layer touch rule を fixed judgment にする
- [ ] SNS critical-path regression target を具体化する
- [ ] exception process を fixed judgment にする
- [ ] first release non-goals を明文化する

# Definition of Done

- [ ] no-touch zone と shared-touch zone が current chain 前提で読める
- [ ] shared-layer 変更時に必須の regression gate が読める
- [ ] route、auth、API client、form、layout、state management、error handling に対する concrete regression target が読める
- [ ] unrelated feature work が SNS internals を変更する場合の exception process が読める
- [ ] broad platform-wide freeze ではなく SNS protection baseline に留まっている

# Protection Intent

- protect SNS from unrelated feature changes, not from intentional SNS feature evolution
- keep future feature work moving without forcing every change to open SNS internals
- define a reviewable rule set before the first stateful SNS implementation lands, so regression prevention is not retrofitted after breakage

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. current SNS chain で no-touch zone に置くべき領域はどこか
2. shared-touch zone に含めつつ regression gate を要求すべき shared layer はどこか
3. unrelated feature change で最低限確認すべき SNS critical path は何か
4. SNS-owned zone を変更する例外をどの条件で許すか
5. protection baseline のどこまでを contract として固定し、どこから先を implementation detail とするか

# Provisional Direction

- SNS route entry、post form behavior、timeline readback contract、auth-to-post boundary、API contract、domain service contract は no-touch zone とする
- shared auth abstraction、shared layout shell、shared API client、shared error/loading primitive、shared form primitive、shared state wrapper は shared-touch zone とする
- shared-touch zone を変更する場合は impact statement と SNS critical-path regression evidence を必須にする
- unrelated feature が SNS-owned zone を変更する場合は linked exception issue と explicit regression evidence を必須にする
- first release では codeowners automation や broad platform freeze ではなく、reviewable gate and evidence rule に留める

# Change-Isolation Baseline

## 1. SNS-Owned No-Touch Zone

unrelated feature work は、原則として次の SNS-owned zone を直接編集してはならない。

- SNS route entry and route guard behavior
- SNS posting form behavior and validation contract
- SNS message timeline rendering and post-readback contract
- SNS auth-to-post authorization boundary
- SNS API request / response contract and stable error contract
- SNS domain service and persistence adapter contract
- SNS moderation-sensitive state transitions and operator-only hooks

No-touch rule:

- unrelated feature が上記領域を変更する場合は separate linked issue と explicit regression evidence を要求する
- refactor、cleanup、shared abstraction migration であっても SNS contract change を伴う場合は unrelated incidental change とみなさない
- rename や file move だけに見えても route wiring、import boundary、shared wrapper、state hookup 経由で behavior が変わる場合は no-touch zone として扱う

## 2. Shared-Touch Zone

次の shared layer は後続機能でも変更し得るが、SNS protection gate の対象にする。

- shared auth abstraction
- shared layout shell and navigation frame
- shared API client / fetch wrapper
- shared error handling and loading-state primitives
- shared form primitives and validation helpers
- shared state container or query/cache wrapper
- shared design tokens actually consumed by SNS screens

Shared-touch rule:

- shared-touch zone の変更は allowed だが、SNS critical-path regression evidence を伴わないまま merge-ready として扱わない
- shared-touch zone を変える変更は、SNS へ影響しないと主張する場合でも impact statement を残す
- shared-touch zone の変更が SNS contract、auth boundary、post-readback behavior まで波及する場合は no-touch zone 扱いへ昇格する

## 3. Critical Regression Gate

次の change class に該当する場合、SNS critical-path regression gate を必須にする。

1. auth abstraction change
2. route registration or route guard change
3. layout shell or navigation structure change
4. API client / data-fetch wrapper change
5. form primitive or validation helper change
6. state management / cache behavior change
7. error/loading primitive or design token change used by SNS

Gate rule:

- minimum gate として regression evidence を要求する
- regression evidence は full E2E 固定ではなく、contract test、integration test、manual major-flow check の組み合わせでよい
- impact statement が SNS unaffected でも、change class が上記に該当するなら zero-check で通さない
- Issue 133 で固定した stateful operational baseline を満たす critical path を regression target の中心に置く

## 4. Concrete Regression Targets

### A. Route And Entry Surface

最低限確認する対象:

- SNS entry route が intended route policy で表示可能である
- navigation 変更で SNS entry link が消えたり誤接続していない
- guest と member で expected route guard behavior が崩れていない
- portal-wide layout refactor 後も SNS surface が shell 内で mount failure を起こしていない

### B. Authentication And Authorization Surface

最低限確認する対象:

- guest は write action を実行できず、expected blocked state を受ける
- member は post form を開ける
- operator-only or moderation-sensitive action が member 権限へ漏れていない
- auth state refresh や session recovery 変更で posting availability が誤判定されていない

### C. Posting Flow Surface

最低限確認する対象:

- valid message body を送信できる
- invalid input が expected validation で止まる
- post pending / success / failure state が shared loading or error refactor 後も維持される
- success 後に timeline readback or expected refresh path が壊れていない

### D. Timeline And Readback Surface

最低限確認する対象:

- newly posted message が intended read model で表示される
- unrelated list component change で message ordering、empty state、error state が崩れていない
- shared data cache or query wrapper の変更で stale timeline が固定されていない
- message status change が unrelated UI state refactor で誤表示されていない

### E. API And Client Contract Surface

最低限確認する対象:

- post message request shape が expected contract のままである
- read timeline response shape が expected client mapping のままである
- shared fetch wrapper change で auth header、error mapping、retry behavior が SNS major flow を壊していない
- global error handling change で SNS write failure が silent failure になっていない

### F. Shared Primitive Surface

最低限確認する対象:

- SNS form が shared input / button / validation helper change 後も操作可能である
- SNS loading、empty、error、disabled state が refactor 後も意味を保つ
- layout token change で posting CTA や timeline text が不可視 or misleading になっていない

## 5. Regression Target Matrix

| Change class                            | Mandatory SNS regression target                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| auth abstraction change                 | guest blocked post, member post availability, auth-to-post state transition     |
| route or navigation change              | SNS entry route reachability, entry link integrity, route guard behavior        |
| layout shell change                     | SNS surface mount, CTA visibility, timeline visibility, error banner placement  |
| API client or fetch wrapper change      | post request success/failure handling, readback mapping, auth header continuity |
| form primitive change                   | post form input, validation error state, submit button disabled/pending state   |
| state management or cache change        | post-to-readback consistency, stale timeline behavior, retry/reload behavior    |
| error/loading primitive or token change | post failure visibility, read failure visibility, pending state clarity         |

## 6. Compatibility Checklist For Shared-Layer Changes

shared-layer change を起こす issue は、少なくとも次を記録対象にする。

- which shared layer changed
- whether SNS consumes that layer directly or transitively
- which regression target from the matrix was checked
- what evidence path was used: contract test, integration test, manual major-flow check
- whether the change stayed in shared-touch zone or crossed into SNS-owned no-touch zone

Checklist rule:

- SNS does not use this という主張は transitive dependency を確認してからでないと採用しない
- one shared-layer change may require multiple regression targets if auth、routing、form state、readback behavior が同時に触られる
- evidence が incomplete の場合は SNS unaffected 判定を確定しない

## 7. Exception Process

unrelated feature が SNS-owned no-touch zone を変更する必要がある場合は、次を満たす。

1. linked issue で例外理由を明記する
2. why SNS-owned zone に触れる必要があるかを説明する
3. impacted regression targets を列挙する
4. regression evidence を同じ issue path に残す
5. change が temporary workaround か lasting contract update かを明記する

Exception rule:

- ついでに直す は exception reason として認めない
- SNS behavior change が intentional なら unrelated feature issue ではなく SNS-related issue として扱う
- exception は approval shortcut ではなく evidence obligation を増やす rule である

## 8. Recommended Evidence Shapes

- contract tests for post / read API mapping
- integration tests for guest read、member write、post-readback major flow
- manual major-flow check for shared layout / auth / route changes in early phase
- focused visual or accessibility checks only when shared primitive or design token change is involved

## 9. Non-Goals

- full codeowners system implementation
- complete CI policy implementation
- broad freeze on shared-layer refactors
- test framework selection execution
- full visual regression platform adoption
- Azure-specific protection design

# Downstream Use

- future implementation slice should inherit this issue as the change-isolation contract
- future CI or regression issue should inherit the regression target matrix and evidence checklist from this issue
- unrelated feature planning can use this issue to decide whether a change stays in shared-touch zone or requires SNS exception handling

# Current Draft Focus

- current SNS planning chain を前提に no-touch zone と shared-touch zone を固定する
- stateful SNS critical path を shared-layer regression gate に接続する
- evidence obligation を fixed しつつ implementation automation は non-goal に残す

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Historical Reference

- docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md
- docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md
- docs/portal/issues/issue-133-sns-stateful-monitoring-rollback-and-test-baseline.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
