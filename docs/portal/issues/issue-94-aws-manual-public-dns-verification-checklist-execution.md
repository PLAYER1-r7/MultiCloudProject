## Summary

Issue 93 で public DNS web resolver が current phase の first execution candidate に絞られ、manual verification evidence block の source selection は固定できた。次段では、その選択を崩さない manual verification checklist draft を execution issue として切り出し、operator invocation rule、paste-back shape、manual-check-incomplete fallback、validation shape を fail-closed に追跡する必要がある。

## Goal

AWS manual public DNS verification checklist execution を管理し、Issue 92 の evidence block shape と Issue 93 の current favorite selection に接続する operator-ready checklist draft、paste-back rule、fallback condition、validation shape を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-94
- Title: AWS manual public DNS verification checklist execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS read-only checklist execution
- Priority: medium
- Predecessor: Issue 75 closed, Issue 92 closed, Issue 93 closed, AWS-HARDENING-FRESH-BATCH-2026-03-10 local contract added

Objective
- Problem to solve: Issue 93 で public DNS web resolver を current favorite に固定したが、operator が current issue path にそのまま貼り戻せる manual verification checklist と evidence block draft、manual-check-incomplete fallback、validation shape はまだ execution issue として追跡されていない
- Expected value: Issue 92 の manual verification template と fixed Match Result labels に接続する operator-ready checklist draft を 1 件で追跡し、current DNS governance を崩さずに次の review-ready execution step を進められる

Scope
- In scope: manual verification checklist draft、required inputs の受け渡し形、public DNS web resolver observation rule、Issue 92 template と同順序の evidence block、manual-check-incomplete fallback、validation steps、operator usage note
- Out of scope: live DNS write、dig or other tooling installation、provider credentials registration、provider API integration、workflow automation、Route 53 migration、issue record direct editing automation
- Editable paths: docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: checklist draft が Issue 92 / Issue 93 contract と矛盾せず、required inputs と fixed labels を明示している
- [x] AC-2: evidence block output が Issue 92 manual verification template と同順序で current issue path に接続できる
- [x] AC-3: operator invocation rule、manual-check-incomplete fallback、validation shape が読める
- [x] AC-4: tooling install、provider integration、live DNS change を含まない execution issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Approach: Issue 92 の minimum fields / stale handling と Issue 93 の current favorite selection を入力に、single-run operator checklist、evidence block shape、fallback rule、validation comment template を execution record として固定する
- Alternative rejected and why: いきなり tool-assisted execution や repo-local script expansion に進む案は current phase の read-only / no-install boundary を超えるため採らない。Issue 93 に execution-shaped wording を追記する案も comparison と execution の責務を混ぜるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Expected results: checklist draft、evidence block shape、fallback rule、validation template が読み取れる
- Failure triage path: Issue 92 の manual verification template / stale handling と Issue 93 の current favorite contract を再照合し、input boundary、field order、fallback wording のどこが崩れたか切り分ける

Risk and Rollback
- Risks: checklist execution issue が live DNS validation 承認や cutover approval の記録に見えること
- Impact area: DNS governance, operator review discipline, next-batch execution planning
- Mitigation: checklist を read-only observation、plain text paste-back、fixed Match Result labels に限定し、live write と tooling install は非対象に残す
- Rollback: checklist output が Issue 92 template を満たさない場合は execution issue を保留し、Issue 93 comparison result と Issue 92 fail-closed rule に戻る
```

## Tasks

- [x] operator-ready checklist draft を固定する
- [x] evidence block と field order を Issue 92 template に接続する
- [x] manual-check-incomplete fallback と operator usage note を固定する
- [x] validation comment template を追加する

## Definition of Done

- [x] checklist draft と contract boundary が 1 文書で読める
- [x] output shape と field order が predecessor template / rule set に接続している
- [x] operator invocation、fallback、validation shape が読める
- [x] live integration、provider access、tooling expansion が非対象のまま維持されている

## Initial Notes

- Issue 75 は `dig` 非搭載環境で `manual public DNS check required` を返す fail-closed wording を固定した
- Issue 92 は manual verification minimum fields、fixed Match Result labels、manual verification template、stale handling を固定した
- Issue 93 は public DNS web resolver を current favorite とし、OS standard resolver command を comparison-only、operator-reviewed browser evidence を fallback candidate に固定した
- current phase で許容されるのは operator が read-only public observation を current issue path に paste-back する checklist execution までである

## Execution Baseline Draft

- checklist は operator review path のみを前提とし、provider console、authoritative write UI、workflow trigger を前提にしない
- checklist への入力は operator が reviewed values と observed values を明示的に与える
- checklist の出力は Issue 92 manual verification template と同順序の plain text evidence block だけとし、issue record を自動編集しない
- current issue path と reviewed target reference は checklist 実行前に operator が開いて確認済みであることを前提にする
- output が Issue 92 template と fixed Match Result labels を満たさない場合は checklist candidate を保留し、manual-check-incomplete fallback に戻る

## Manual Verification Checklist Draft

1. current issue path を開き、record name、reviewed target reference、source evidence reference を確認する
2. public DNS web resolver を開き、resolver source display name を確認する
3. observation timestamp を UTC で記録する
4. observed public answer を推測で補完せず、そのまま転記する
5. fixed Match Result labels から 1 つだけを選ぶ
6. Issue 92 template と同順序の evidence block を作成する
7. validation checklist を満たした場合だけ current issue path に paste-back する

Checklist rule:

- resolver source が public DNS web resolver で説明できない場合は current favorite path を採らない
- observed public answer が不明または incomplete の場合でも推測値を書かず、`manual-check-incomplete` か `unresolved` を使う
- checklist 完了は live DNS validation、cutover approval、authoritative write approval を意味しない

## Required Inputs

- `record_name`: current DNS record name
- `resolver_source`: public DNS web resolver の display name
- `observation_timestamp_utc`: operator が記録する UTC timestamp
- `observed_public_answer`: observed answer summary
- `reviewed_target_reference`: Issue 92 で再掲する reviewed target value
- `source_evidence_reference`: current issue record か related evidence path

## Allowed Derived Data

- `match_result`: matches-reviewed-target | differs-from-reviewed-target | unresolved | manual-check-incomplete
- `review_note`: manual verification evidence only; approval and live DNS change remain separate

## Expected Evidence Block

Issue 92 の manual verification template に接続する出力は次の順序を維持する。

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

Usage rule:

- operator は evidence block をそのまま approval material として使わず、current issue path に貼り戻す review-only evidence として使う
- field が欠ける場合や Match Result が fixed labels に一致しない場合は evidence block を採用せず、manual-check-incomplete fallback に戻る

## Sample Completed Evidence Block

```text
AWS Manual Public DNS Verification

- Record Name: www.aws.ashnova.jp
- Resolver Source: Google Public DNS web resolver
- Observation Timestamp UTC: 2026-03-10 12:30 UTC
- Observed Public Answer: d168agpgcuvdqq.cloudfront.net
- Reviewed Target Reference: d168agpgcuvdqq.cloudfront.net
- Match Result: matches-reviewed-target
- Source Evidence Reference: docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Review Note: manual verification evidence only; approval and live DNS change remain separate
```

## Operator Invocation Note

operator は次の順で実行する。

1. current issue path と reviewed target reference を開き、reviewed values が確定していることを確認する
2. public DNS web resolver の observed result を確認する
3. required inputs を埋め、fixed Match Result labels から 1 つだけを選ぶ
4. Issue 92 template と validation checklist に照合する
5. current issue path に paste-back するか、条件未達なら manual-check-incomplete fallback に切り替える

## Manual-Check-Incomplete Fallback

- reviewed values のいずれかが未確定なら evidence block を作らない
- resolver source display name を説明できない場合は current favorite path を使わず、Issue 93 fallback direction に戻る
- output field order が崩れた場合、または validation checklist で fail した場合は `manual-check-incomplete` を使い、next execution input に昇格させない

Fallback note:

- stale evidence、resolver source ambiguity、observed answer incomplete のいずれかがある場合は `matches-reviewed-target` へ丸めず、`manual-check-incomplete` か `unresolved` のまま current issue path に残す

## Operator Validation Checklist

- [ ] required inputs が reviewed values と observed values として揃っている
- [ ] Resolver Source が public DNS web resolver の display name として説明できる
- [ ] Observation Timestamp UTC が recorded されている
- [ ] Observed Public Answer が推測で補完されていない
- [ ] Match Result が fixed labels のいずれか 1 つに一致する
- [ ] output が Issue 92 manual verification template と同順序になっている
- [ ] Review Note が manual boundary を明示している

Checklist rule:

- 1 項目でも満たせない場合は evidence block を current issue path に貼り戻さず、manual-check-incomplete fallback に戻る
- checklist 完了は live DNS validation や cutover approval を意味せず、review-ready evidence block の確認完了だけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Manual Public DNS Verification Checklist Validation

- Issue: #94
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed Inputs Ready: yes | no
- Resolver Source Explained: yes | no
- Field Order Match: yes | no
- Fixed Match Result Used: yes | no
- Non-Goal Content Excluded: yes | no
- Result: pass | fallback-to-manual-check-incomplete
- Note: checklist completion confirms review-ready manual verification evidence only; it does not approve live DNS change or cutover
```

## Sample Completed Comment

```text
Manual Public DNS Verification Checklist Validation

- Issue: #94
- Validation Timestamp: 2026-03-10 12:20 UTC
- Reviewed Inputs Ready: yes
- Resolver Source Explained: yes
- Field Order Match: yes
- Fixed Match Result Used: yes
- Non-Goal Content Excluded: yes
- Result: pass
- Note: checklist completion confirms review-ready manual verification evidence only; it does not approve live DNS change or cutover
```

## Current Sync State

- GitHub body | operator-ready checklist draft、sample evidence block、validation template を含む current local record | synced 状態
- Boundary | read-only checklist execution and plain-text paste-back only | preserved

## Current Child Follow-Up

- Issue 95: manual public DNS verification paste-back dry-run

## Non-Goals

- live DNS write
- dig or other tooling installation
- provider credentials registration
- provider API integration
- workflow automation
- Route 53 migration

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #94
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/94
- Sync Status: synced to GitHub as closed issue

- Issue 93 の current favorite selection を execution-shaped local draft へ落とし込み、その後 GitHub issue #94 として同期した
- Issue 92 manual verification template と fixed Match Result labels に接続する checklist draft、sample evidence block、fallback rule、validation template を current-phase boundary 内で整理した
- single current-issue paste-back dry-run の local child follow-up として Issue 95 を追加した
- current phase では read-only paste-back discipline に限定し、tooling install、provider integration、live DNS change への拡張は保留している
- checklist execution contract は Issue 95 の terminal dry-run draft へ引き渡し済みで、Issue 94 自体に未消化の DNS verification scope は残っていない
