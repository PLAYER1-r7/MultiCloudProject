## Summary

簡易SNSは current portal baseline を超える stateful expansion であり、auth、API、persistence、moderation を含む shared layer を持つようになる。一方で、今後 unrelated feature を拡張していく前提のまま SNS の ownership boundary と regression gate を fixed しないと、SNS と無関係な機能実装が shared auth、shared layout、shared client wrapper、shared form primitive を経由して SNS の投稿・表示・認証フローを壊す再発が起きやすい。

この issue は SNS 機能そのものの product scope ではなく、SNS 実装後に後続機能が増えても SNS critical path を壊しにくくするための change-isolation baseline と regression discipline を固定する。

## Goal

簡易SNSを後続機能変更から守るために、SNS-owned boundary、shared-layer touch rule、critical-path regression gate、exception process、具体的な regression target を 1 issue で読めるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-112
- Title: SNS implementation protection and change-isolation baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md updated with SNS implementation protection baseline

Objective
- Problem to solve: simple SNS 実装後に unrelated feature が shared auth、shared layout、shared client wrapper、shared primitives を変更し、SNS の投稿・表示・認証 major flow を破壊する再発リスクがある
- Expected value: SNS-owned modules と shared-layer change rule を先に固定し、後続機能拡張時にどこへ触れてよいか、何を回帰確認すべきか、どの条件で例外を許すかを issue 単位で参照できる

Scope
- In scope: SNS ownership boundary、shared-layer touch rule、critical-path regression gate、exception process、concrete regression targets、compatibility checklist、non-goals
- Out of scope: actual SNS code implementation、test framework selection execution、CI workflow implementation、database creation、auth provider live selection、Azure implementation
- Editable paths: docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: unrelated feature が原則として触ってよい layer と触ってはいけない SNS-owned layer が整理されている
- [x] AC-2: shared-layer change 時に必要な SNS critical-path regression gate が整理されている
- [x] AC-3: route、auth、API client、form、layout、state management のどこを回帰対象にするかが具体化されている
- [x] AC-4: exception process と non-goals があり、過剰に broad な protection へ膨らんでいない

Implementation Plan
- Files likely to change: docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Approach: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md の protection slice を起点に、SNS-owned boundary、shared-layer touch rule、critical regression surface、operator-facing exception rule を fresh issue record として固定する
- Alternative rejected and why: SNS 実装後に test や ownership を都度決める案は、最初の unrelated feature 実装時点で回帰 gate 不在のまま shared layer へ変更が入りやすく、再発防止として弱いため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Expected results: markdown diagnostics がなく、boundary、regression targets、exception process が読み取れる
- Failure triage path: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md の protection slice と照合し、ownership boundary、touch rule、regression targets のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: protection baseline が強すぎて shared layer の正常な改善まで止めるか、逆に曖昧すぎて unrelated feature の SNS 破壊を止められないこと
- Impact area: future feature development, SNS stability, review discipline, test depth
- Mitigation: absolute ban ではなく no-touch zone、shared-touch zone、exception rule、critical-path regression gate を分けて定義する
- Rollback: scope が広がりすぎた場合は no-touch zone、shared-layer touch rule、critical regression target の 3 点だけを残し、ownership metadata や CI depth は follow-up issue へ分離する
```

## Tasks

- [x] SNS-owned boundary を固定する
- [x] shared-layer touch rule を固定する
- [x] SNS critical-path regression target を具体化する
- [x] exception process を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] no-touch zone と shared-touch zone が 1 文書で読める
- [x] shared-layer 変更時に必須の regression gate が読める
- [x] route、auth、API client、form、layout、state management に対する concrete regression target が読める
- [x] unrelated feature work が SNS internals を変更する場合の exception process が読める
- [x] broad platform-wide freeze ではなく SNS protection baseline に留まっている

## Protection Intent

- protect SNS from unrelated feature changes, not from intentional SNS feature evolution
- keep future feature work moving without forcing every change to open SNS internals
- define a reviewable rule set before the first SNS implementation lands, so regression prevention is not retrofitted after breakage

## Change-Isolation Baseline

### 1. SNS-Owned No-Touch Zone

unrelated feature work は、原則として次の SNS-owned zone を直接編集してはならない。

- SNS route entry and route guard behavior
- SNS posting form behavior and validation contract
- SNS message timeline rendering and readback contract
- SNS auth-to-post authorization boundary
- SNS API request / response contract
- SNS domain service and persistence adapter contract
- SNS moderation-sensitive state transitions

No-touch rule:

- unrelated feature が上記領域を変更する場合は separate linked issue と explicit regression evidence を要求する
- refactor、cleanup、shared abstraction migration であっても SNS contract change を伴う場合は unrelated feature の incidental change とみなさない
- rename や file move だけに見えても route wiring、import boundary、test fixture、shared wrapper 経由で behavior が変わる場合は no-touch zone として扱う

### 2. Shared-Touch Zone

次の shared layer は後続機能でも変更し得るが、SNS protection gate の対象にする。

- shared auth abstraction
- shared layout shell and navigation frame
- shared API client / fetch wrapper
- shared error handling and loading-state primitives
- shared form primitives and validation helpers
- shared state container or query cache wrapper
- shared design tokens actually consumed by SNS screens

Shared-touch rule:

- shared-touch zone の変更は allowed だが、SNS critical-path regression evidence を伴わないまま merge-ready として扱わない
- shared-touch zone を変える変更は、SNS へ影響しないと主張する場合でも impact statement を残す
- shared-touch zone の変更が SNS contract まで波及する場合は no-touch zone 扱いへ昇格する

## Critical Regression Gate

次の change class に該当する場合、SNS critical-path regression gate を必須にする。

1. auth abstraction change
2. route registration or route guard change
3. layout shell or navigation structure change
4. API client / data-fetch wrapper change
5. form primitive or validation helper change
6. state management / cache behavior change
7. SNS が利用する design token or error/loading primitive change

Gate rule:

- code owner 的な承認概念を持ち込む前でも、minimum gate として regression evidence を要求する
- regression evidence は full E2E 固定ではなく、contract test、integration test、manual major-flow check の組み合わせでよい
- impact statement が `SNS unaffected` でも、change class が上記に該当するなら zero-check で通さない

## Concrete Regression Targets

### A. Route And Entry Surface

最低限確認する対象:

- SNS entry route が intended hostname / route policy で表示可能である
- non-SNS route 追加や navigation 変更で SNS entry link が消えたり別 route へ誤接続していない
- signed-out user と signed-in user で expected route guard behavior が崩れていない
- portal-wide layout refactor 後も SNS surface が shell 内で表示崩れや mount failure を起こしていない

### B. Authentication And Authorization Surface

最低限確認する対象:

- signed-out user は post action を実行できず、expected sign-in prompt or blocked state を受ける
- signed-in member は post form を開ける
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
- SNS loading、empty、error、disabled state が design-system refactor 後も意味を保つ
- layout token change で posting CTA や timeline text が不可視 or misleading になっていない

## Regression Target Matrix

| Change class                       | Mandatory SNS regression target                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| auth abstraction change            | signed-out blocked post, signed-in post availability, auth-to-post state transition  |
| route or navigation change         | SNS entry route reachability, entry link integrity, route guard behavior             |
| layout shell change                | SNS surface mount, CTA visibility, timeline visibility, error banner placement       |
| API client or fetch wrapper change | post request success/failure handling, readback mapping, auth header continuity      |
| form primitive change              | post form input, validation error state, submit button disabled/pending state        |
| state management or cache change   | post-to-readback consistency, stale timeline behavior, retry/reload behavior         |
| error/loading primitive change     | post failure visibility, read failure visibility, pending state clarity              |
| design token change used by SNS    | posting CTA readability, timeline text readability, warning/error distinguishability |

## Compatibility Checklist For Shared-Layer Changes

shared-layer change を起こす issue は、少なくとも次を記録対象にする。

- which shared layer changed
- whether SNS consumes that layer directly or transitively
- which regression target from the matrix was checked
- what evidence path was used: contract test, integration test, manual major-flow check
- whether the change stayed in shared-touch zone or crossed into SNS-owned no-touch zone

Checklist rule:

- `SNS does not use this` という主張は transitive dependency を確認してからでないと採用しない
- one shared-layer change may require multiple regression targets if auth、routing、form state が同時に触られる
- evidence が incomplete の場合は `SNS unaffected` 判定を確定しない

## Exception Process

unrelated feature が SNS-owned no-touch zone を変更する必要がある場合は、次を満たす。

1. linked issue で例外理由を明記する
2. why SNS-owned zone に触れる必要があるかを説明する
3. impacted regression targets を列挙する
4. regression evidence を同じ issue path に残す
5. change が temporary workaround か lasting contract update かを明記する

Exception rule:

- `ついでに直す` は exception reason として認めない
- SNS behavior change が intentional なら unrelated feature issue ではなく SNS-related issue として扱う
- exception は approval shortcut ではなく evidence obligation を増やす rule である

## Recommended Evidence Shapes

- contract tests for post / read API mapping
- integration tests for sign-in to post to readback major flow
- manual major-flow check for shared layout / auth / route changes in early phase
- focused visual or accessibility checks only when shared primitive or design token change is involved

## Next Split

- Issue 113: SNS critical-path regression test baseline
- Issue 114: SNS shared-layer manual major-flow check baseline

## Non-Goals

- full code owner system implementation
- complete CI policy implementation
- broad freeze on shared-layer refactors
- test framework selection execution
- full visual regression platform adoption
- Azure-specific protection design

## Validation Result

- SNS protection baseline is separated into no-touch zone, shared-touch zone, critical regression gate, and exception process
- concrete regression targets are fixed across route, auth, posting, timeline, API client, and shared primitive surfaces
- the issue remains planning-only and does not assume a specific test framework or CI implementation

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #112
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/112
- Sync Status: synced to GitHub as closed issue

- SNS protection baseline is ready to be referenced before SNS implementation starts
- concrete regression targets are explicit enough to turn into future tests or manual validation gates
- child follow-up drafts for automated regression baseline and manual major-flow fallback are prepared as Issue 113 and Issue 114

## Dependencies

- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
