## Summary

Issue 75 で AWS external DNS helper material shell snippet の stdout-only boundary は closed reference として固定できたが、devcontainer に `dig` がない場合は `manual public DNS check required` へ fail-closed に戻るだけで、manual public DNS verification をどの evidence shape で current issue path に戻すかは未固定のままである。このままだと、次の DNS follow-up で resolver source、記録順序、stale handling が毎回ぶれ、read-only DNS evidence assembly の比較軸が再び曖昧になる。

## Goal

manual public DNS verification fallback の next follow-up scope を整理し、resolver source、minimum evidence fields、paste-back template、stale handling、future execution split を current AWS DNS governance を壊さない single-stream issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-92
- Title: AWS manual public DNS verification fallback を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS read-only follow-up planning
- Priority: medium
- Predecessor: Issue 69 closed, Issue 75 closed, AWS-HARDENING-FRESH-BATCH-2026-03-10 local contract added

Objective
- Problem to solve: Issue 75 は shell snippet の stdout-only draft と manual fill fallback を固定したが、manual public DNS check required の先で何を current issue record に残すべきか、どの resolver source を許可するか、どの stale rule で fail-closed に止めるかが未固定である
- Expected value: resolver tooling 非搭載環境でも、manual public DNS verification evidence を read-only / reviewable に current issue path へ戻せるようになり、DNS stream の fresh follow-up を closed reference chain と切り離して前進できる

Scope
- In scope: allowed resolver source comparison、manual public DNS verification minimum fields、paste-back template、stale handling、manual verification checklist、future execution split condition
- Out of scope: dig installation、provider credentials registration、provider API integration、live DNS write、workflow automation、Route 53 migration、Issue 69 / 75 の再編集
- Editable paths: docs/portal/issues/issue-92-aws-manual-public-dns-verification-fallback.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: manual public DNS verification fallback に必要な minimum fields が 1 文書で読める
- [x] AC-2: allowed resolver sources と stale handling が current DNS governance と矛盾しない
- [x] AC-3: current issue path へ戻す paste-back template と checklist が読める
- [x] AC-4: dig installation、provider integration、live DNS change を含めない planning issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-92-aws-manual-public-dns-verification-fallback.md
- Approach: Issue 75 の dry-run evidence と manual fallback wording を入力に、resolver source、evidence field set、paste-back path、stale handling を fresh single-stream issue として固定する
- Alternative rejected and why: Issue 75 を reopen して manual fallback detail を足す案は closed reference chain の boundary を壊すため採らない。いきなり dig 導入や script expansion へ進む案も current phase の read-only planning scope を超えるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-92-aws-manual-public-dns-verification-fallback.md
- Expected results: markdown diagnostics がなく、resolver source、minimum fields、paste-back template、stale handling が読み取れる
- Failure triage path: Issue 75 の manual public DNS check wording と docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md の single-stream rule を再照合し、scope が resolver fallback を超えていないか切り分ける

Risk and Rollback
- Risks: manual verification fallback issue が live DNS validation や cutover approval の記録に見えること
- Impact area: DNS governance, operator review discipline, next-batch planning
- Mitigation: resolver source、manual evidence fields、stale handling、paste-back rule に対象を限定し、live write や tooling install は非対象に残す
- Rollback: scope が広がりすぎた場合は minimum fields と stale handling だけを残し、resolver source comparison は別 issue に切り出す
```

## Tasks

- [x] allowed resolver source を整理する
- [x] manual public DNS verification minimum fields を固定する
- [x] current issue path へ戻す paste-back template を整理する
- [x] stale handling と fail-closed rule を固定する
- [x] future execution split 条件を整理する

## Definition of Done

- [x] manual public DNS verification fallback の shape が 1 文書で読める
- [x] resolver source と stale handling が current DNS governance に接続している
- [x] operator が current issue record に貼り戻せる template と checklist がある
- [x] live DNS write、provider access、tooling install が非対象のまま維持されている

## Initial Notes

- Issue 69 は DNS branch を current hardening stream として切り分けた closed parent map である
- Issue 73 は helper material template、review checklist、operator paste-back procedure、execution-ready gate を固定した
- Issue 75 は shell snippet draft と manual fill fallback を固定し、`dig` 非搭載時は `manual public DNS check required` を返す fail-closed wording を残した
- fresh AWS contract は DNS stream を最初の single-stream candidate とし、read-only / planning-only follow-up を優先すると固定した

## Discussion Draft

### 1. 今回の論点をどこまでに限定するか

提案:

- この issue は `manual public DNS check required` の先で何を evidence として残すかに限定する
- resolver source comparison、evidence field set、paste-back template、stale handling を扱う
- dig installation、repo-local script expansion、provider API read、live DNS validation は扱わない

### 2. allowed resolver source の第一案

提案:

- current phase では public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence の 3 系統だけを comparison 対象にする
- provider account console や authoritative write UI は current phase の manual public verification source に含めない
- resolver source は current issue record に source name と observation timestamp を残せるものだけを許可する

### 3. manual verification minimum fields の第一案

提案:

- Record Name
- Resolver Source
- Observation Timestamp UTC
- Observed Public Answer
- Reviewed Target Reference
- Match Result
- Source Evidence Reference
- Review Note

field rule:

- Match Result は `matches-reviewed-target | differs-from-reviewed-target | unresolved | manual-check-incomplete` の 4 値に固定する
- Review Note には pointer only と manual review boundary を明記する
- Reviewed Target Reference は Issue 75 で使った reviewed value の再掲に限定する

### 4. paste-back template の第一案

提案:

- output は current issue record に直接貼り戻せる plain text block とする
- template は helper material template の外側に置かず、manual fallback evidence block として current issue path に残す
- evidence block は approval log や live cutover note を兼ねない

### 5. stale handling の第一案

提案:

- observation timestamp が reviewed source evidence より古い、または resolver source と observed answer の整合が説明できない場合は stale とみなす
- stale evidence は current issue path に残せても、live DNS change や next execution split の入力には使わない
- unresolved や mismatch は推測で補完せず、そのまま fail-closed に残す

### 6. future execution split の第一案

提案:

- この issue の次段は resolver-assisted read-only helper comparison か manual verification checklist execution のどちらかに分ける
- dig installation や repo-local script skeleton 導入が必要になった場合は separate issue と separate approval boundary を要求する
- provider API read や live write を含む deeper automation は current DNS stream の別系統として扱う

### 7. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                 | 判断方向（Discussion 時点の仮）                                                                                                                                           | Resolution 確定文言                                                                                                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowed resolver source を何に置くか | public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence に限定する                                                                          | `allowed resolver source は public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence の 3 系統に限定し、provider account console と authoritative write UI は current phase の manual public verification source に含めない` |
| minimum fields を何に置くか          | Record Name、Resolver Source、Observation Timestamp UTC、Observed Public Answer、Reviewed Target Reference、Match Result、Source Evidence Reference、Review Note を含める | `manual public DNS verification minimum fields は Record Name、Resolver Source、Observation Timestamp UTC、Observed Public Answer、Reviewed Target Reference、Match Result、Source Evidence Reference、Review Note の 8 項目に固定する`                   |
| Match Result をどう固定するか        | 4 値の fixed labels に限定する                                                                                                                                            | `Match Result は matches-reviewed-target、differs-from-reviewed-target、unresolved、manual-check-incomplete の 4 値に固定し、unknown や inferred-match のような曖昧な label を許容しない`                                                                 |
| stale evidence をどう扱うか          | current issue path には残せても next execution input には使わない                                                                                                         | `stale evidence は current issue path に reference として残せても next execution input には使わず、observation timestamp または resolver / answer 整合が説明できない場合は fail-closed に manual reviewed values へ戻す`                                  |
| future execution split をどう置くか  | resolver-assisted read-only helper comparison と manual verification checklist execution に分ける                                                                         | `future execution split は resolver-assisted read-only helper comparison と manual verification checklist execution に分け、dig installation、repo-local script expansion、provider API read は separate issue と separate approval boundary に残す`      |

## Resolution

Issue 92 の判断結果は次の通りとする。

- allowed resolver source は public DNS web resolver、OS 標準 resolver command、operator-reviewed browser evidence の 3 系統に限定し、provider account console と authoritative write UI は current phase の manual public verification source に含めない
- manual public DNS verification minimum fields は Record Name、Resolver Source、Observation Timestamp UTC、Observed Public Answer、Reviewed Target Reference、Match Result、Source Evidence Reference、Review Note の 8 項目に固定する
- Match Result は matches-reviewed-target、differs-from-reviewed-target、unresolved、manual-check-incomplete の 4 値に固定し、曖昧な label を許容しない
- stale evidence は current issue path に reference として残せても next execution input には使わず、observation timestamp または resolver / answer 整合が説明できない場合は fail-closed に manual reviewed values へ戻す
- future execution split は resolver-assisted read-only helper comparison と manual verification checklist execution に分け、dig installation、repo-local script expansion、provider API read は separate issue と separate approval boundary に残す

この合意で明確になること:

- Issue 75 の manual public DNS check required は単なる placeholder ではなく、manual verification evidence block へ戻る fail-closed branch として扱える
- resolver source を 3 系統に限定することで、authoritative write path や provider console を review-only evidence source に混ぜずに済む
- Match Result を固定 label に限定することで、mismatch や unresolved を推測で丸めず current issue path に残せる
- stale evidence を current issue path に残せても next execution input に使わないため、古い public answer を後続 issue の判断材料に昇格させない

## Manual Verification Template Draft

```text
AWS Manual Public DNS Verification

- Record Name: <value>
- Resolver Source: <value>
- Observation Timestamp UTC: <value>
- Observed Public Answer: <value>
- Reviewed Target Reference: <value>
- Match Result: matches-reviewed-target | differs-from-reviewed-target | unresolved | manual-check-incomplete
- Source Evidence Reference: <value>
- Review Note: manual verification evidence only; approval and live DNS change remain separate
```

## Operator Checklist Draft

- [ ] Resolver Source が allowed resolver source の比較対象に含まれている
- [ ] Observation Timestamp UTC が recorded されている
- [ ] Observed Public Answer が推測値で埋められていない
- [ ] Reviewed Target Reference が current reviewed value と一致している
- [ ] Match Result が fixed labels のいずれか 1 つになっている
- [ ] Source Evidence Reference が current issue path か related evidence path を指している
- [ ] Review Note が pointer only と manual boundary を明示している

Checklist rule:

- 1 項目でも欠けた場合は manual verification evidence を next execution input に使わない
- mismatch と unresolved は gap ではなく evidence としてそのまま残す
- checklist 完了は live DNS validation や cutover approval を意味しない

## Future Execution Split

- resolver-assisted read-only helper comparison は、manual verification evidence block を入力にして resolver source ごとの差分、repeatability、stale detection を比較する separate issue として扱う
- manual verification checklist execution は、current issue path へ実際に paste-back する operator-ready checklist の dry-run または review execution を扱う separate issue として扱う
- dig installation、repo-local script expansion、provider API read、provider credential handling は current stream の外に残し、この issue から直接進めない

## Current Child Follow-Up

- Issue 93: resolver-assisted read-only helper comparison

## Non-Goals

- live DNS write
- dig or other tooling installation
- provider credentials registration
- provider API integration
- workflow automation
- Route 53 migration

## Current Sync State

- GitHub body | allowed resolver source、minimum fields template、paste-back template、stale handling を含む current local record | synced 状態
- Boundary | resolver source comparison and evidence shape planning only; execution は Issue 93 以降に分離 | preserved

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #92
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/92
- Sync Status: synced to GitHub as closed issue

- fresh AWS contract に基づく最初の DNS single-stream issue draft として追加した
- closed Issue 75 の manual fallback wording を input にし、resolver source、minimum fields、paste-back template、stale handling、future execution split を local issue body 上で固定した
- current phase では read-only / planning-only boundary を維持し、dig installation、provider access、live DNS change は非対象に残している
- DNS verification planning chain は Issue 95 terminal endpoint までで完結し、Issue 92 の論点に追加の child follow-up は残っていないため close 対象とする
