## Summary

Issue 94 で manual public DNS verification checklist、evidence block shape、manual-check-incomplete fallback、validation comment template は固定できた。一方で、その checklist を使って single current-issue path に貼り戻す dry-run 単位はまだ separate issue として追跡されていない。このままだと、field order は定義済みでも actual paste-back 時の記録単位、validation comment の使い方、manual-check-incomplete への戻し方が issue ごとに揺れやすい。

## Goal

AWS manual public DNS verification paste-back dry-run を管理し、Issue 92 の evidence block shape と Issue 94 の checklist / validation shape に接続する single current-issue dry-run draft、paste-back rule、fallback condition、comment-ready validation flow を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-95
- Title: AWS manual public DNS verification paste-back dry-run を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS read-only paste-back dry-run
- Priority: medium
- Predecessor: Issue 75 closed, Issue 92 closed, Issue 93 closed, Issue 94 closed, AWS-HARDENING-FRESH-BATCH-2026-03-10 local contract added

Objective
- Problem to solve: Issue 94 で operator-ready checklist draft は fixed したが、single current-issue path に evidence block を貼り戻す dry-run draft、validation comment の実施単位、manual-check-incomplete fallback への戻し方はまだ execution follow-up として追跡されていない
- Expected value: Issue 92 template と Issue 94 checklist を崩さず、review-only の single current-issue paste-back dry-run を 1 件で追跡できるようになり、次段で operator が comment-ready な evidence validation を再議論なしで実施できる

Scope
- In scope: single current-issue paste-back dry-run draft、required inputs の確認順序、Issue 92 template と同順序の completed evidence block draft、Issue 94 validation comment の completed draft、manual-check-incomplete fallback、operator usage note
- Out of scope: live DNS write、dig or other tooling installation、provider credentials registration、provider API integration、workflow automation、issue record direct editing automation、Route 53 migration
- Editable paths: docs/portal/issues/issue-95-aws-manual-public-dns-verification-paste-back-dry-run.md, docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: dry-run draft が Issue 92 / Issue 94 contract と矛盾せず、single current-issue paste-back 単位を明示している
- [x] AC-2: completed evidence block draft と validation comment draft が Issue 92 template / Issue 94 validation shape と同順序で読める
- [x] AC-3: operator invocation rule、manual-check-incomplete fallback、comment-ready usage が読める
- [x] AC-4: live DNS change、tooling install、provider integration を含まない review-only dry-run issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-95-aws-manual-public-dns-verification-paste-back-dry-run.md, docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Approach: Issue 92 の evidence template と Issue 94 の checklist / validation comment を入力に、single current-issue paste-back dry-run、completed evidence draft、completed validation comment、fallback note を execution follow-up として固定する
- Alternative rejected and why: Issue 94 に actual dry-run wording を追記する案は checklist definition と dry-run execution の責務を混ぜるため採らない。いきなり automation や issue direct editing へ進む案も current phase の read-only boundary を超えるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-95-aws-manual-public-dns-verification-paste-back-dry-run.md and docs/portal/issues/issue-94-aws-manual-public-dns-verification-checklist-execution.md
- Expected results: dry-run draft、completed evidence block、validation comment draft、fallback rule が読み取れる
- Failure triage path: Issue 92 の template / fixed labels と Issue 94 の checklist / validation template を再照合し、field order、fallback wording、comment-ready shape のどこが崩れたか切り分ける

Risk and Rollback
- Risks: dry-run issue が live DNS validation 承認や cutover evidence の final record に見えること
- Impact area: DNS governance, operator review discipline, next-batch execution planning
- Mitigation: dry-run を review-only、single current-issue paste-back、completed draft text に限定し、live write と provider integration は非対象に残す
- Rollback: dry-run output が Issue 92 / Issue 94 rule set を満たさない場合は Issue 95 を保留し、Issue 94 checklist execution と manual-check-incomplete fallback に戻る
```

## Tasks

- [x] single current-issue paste-back dry-run draft を固定する
- [x] completed evidence block draft を Issue 92 template に接続する
- [x] completed validation comment draft を Issue 94 validation shape に接続する
- [x] manual-check-incomplete fallback と operator usage note を固定する

## Definition of Done

- [x] dry-run draft と contract boundary が 1 文書で読める
- [x] completed evidence block と validation comment が predecessor template / rule set に接続している
- [x] operator invocation、fallback、comment-ready usage が読める
- [x] live integration、provider access、tooling expansion が非対象のまま維持されている

## Initial Notes

- Issue 75 は `dig` 非搭載環境で `manual public DNS check required` を返す fail-closed wording を fixed した
- Issue 92 は manual verification minimum fields、fixed Match Result labels、manual verification template、stale handling を fixed した
- Issue 93 は public DNS web resolver を current favorite とし、OS standard resolver command を comparison-only、operator-reviewed browser evidence を fallback candidate に fixed した
- Issue 94 は operator-ready checklist draft、sample evidence block、manual-check-incomplete fallback、validation comment template を fixed した
- current phase で許容されるのは operator が read-only observation を current issue path に review-only で貼り戻す dry-run までである

## Dry-Run Baseline Draft

- dry-run は current issue path 1 件だけを対象にし、multi-record batch を前提にしない
- dry-run への入力は operator が reviewed values と observed values を Issue 94 checklist に従って確認済みであることを前提にする
- dry-run の出力は completed evidence block draft と completed validation comment draft の plain text だけとし、issue record を自動編集しない
- output が Issue 92 template と Issue 94 validation shape を満たさない場合は dry-run candidate を保留し、manual-check-incomplete fallback に戻る

## Single Current-Issue Paste-Back Draft

1. current issue path を開き、record name、reviewed target reference、source evidence reference を確認する
2. Issue 94 checklist に沿って observed public answer と match result を確定する
3. Issue 92 template と同順序の completed evidence block draft を作成する
4. Issue 94 validation shape と同順序の completed validation comment draft を作成する
5. evidence block と validation comment の両方が current issue path に review-only で貼り戻せるか確認する
6. 条件未達なら manual-check-incomplete fallback に戻る

Dry-run rule:

- one dry-run, one current issue path を維持する
- evidence block draft と validation comment draft のどちらか一方だけが成立する場合でも success に丸めない
- dry-run 完了は live DNS validation、cutover approval、authoritative write approval を意味しない

## Required Inputs

- `record_name`: current DNS record name
- `resolver_source`: public DNS web resolver の display name
- `observation_timestamp_utc`: operator が記録する UTC timestamp
- `observed_public_answer`: observed answer summary
- `reviewed_target_reference`: Issue 92 で再掲する reviewed target value
- `source_evidence_reference`: current issue record か related evidence path
- `match_result`: matches-reviewed-target | differs-from-reviewed-target | unresolved | manual-check-incomplete

## Completed Evidence Block Draft

```text
AWS Manual Public DNS Verification

- Record Name: www.aws.ashnova.jp
- Resolver Source: Google Public DNS web resolver
- Observation Timestamp UTC: 2026-03-10 13:10 UTC
- Observed Public Answer: d168agpgcuvdqq.cloudfront.net
- Reviewed Target Reference: d168agpgcuvdqq.cloudfront.net
- Match Result: matches-reviewed-target
- Source Evidence Reference: docs/portal/issues/issue-95-aws-manual-public-dns-verification-paste-back-dry-run.md
- Review Note: manual verification evidence only; approval and live DNS change remain separate
```

## Completed Validation Comment Draft

```text
Manual Public DNS Verification Checklist Validation

- Issue: #95 local draft
- Validation Timestamp: 2026-03-10 13:15 UTC
- Reviewed Inputs Ready: yes
- Resolver Source Explained: yes
- Field Order Match: yes
- Fixed Match Result Used: yes
- Non-Goal Content Excluded: yes
- Result: pass
- Note: checklist completion confirms review-ready manual verification evidence only; it does not approve live DNS change or cutover
```

## Sample Manual-Check-Incomplete Dry-Run Draft

```text
AWS Manual Public DNS Verification

- Record Name: www.aws.ashnova.jp
- Resolver Source: Google Public DNS web resolver
- Observation Timestamp UTC: 2026-03-10 13:20 UTC
- Observed Public Answer: answer not fully confirmed from the current observation
- Reviewed Target Reference: d168agpgcuvdqq.cloudfront.net
- Match Result: manual-check-incomplete
- Source Evidence Reference: docs/portal/issues/issue-95-aws-manual-public-dns-verification-paste-back-dry-run.md
- Review Note: manual verification evidence only; approval and live DNS change remain separate
```

```text
Manual Public DNS Verification Checklist Validation

- Issue: #95 local draft
- Validation Timestamp: 2026-03-10 13:25 UTC
- Reviewed Inputs Ready: no
- Resolver Source Explained: yes
- Field Order Match: yes
- Fixed Match Result Used: yes
- Non-Goal Content Excluded: yes
- Result: fallback-to-manual-check-incomplete
- Note: checklist completion confirms review-ready manual verification evidence only; it does not approve live DNS change or cutover
```

## Operator Invocation Note

operator は次の順で実行する。

1. current issue path と reviewed target reference を開き、reviewed values が確定していることを確認する
2. public DNS web resolver observation と Issue 94 checklist result を照合する
3. completed evidence block draft を作成する
4. completed validation comment draft を作成する
5. 両方が rule set を満たす場合だけ current issue path への paste-back candidate として扱う

## Manual-Check-Incomplete Fallback

- reviewed values のいずれかが未確定なら dry-run を成立扱いにしない
- resolver source ambiguity、field order 崩れ、fixed Match Result labels 不一致のいずれかがある場合は `manual-check-incomplete` に戻る
- validation comment draft が `pass` を示していても evidence block draft が不完全なら `pass` を採用しない
- evidence block draft と validation comment draft が同じ current issue path を参照していない場合も `manual-check-incomplete` に戻る

Fallback note:

- stale evidence、resolver source ambiguity、observed answer incomplete のいずれかがある場合は success に丸めず、`manual-check-incomplete` か `unresolved` のまま current issue path に残す

## Dry-Run Outcome Gate

- `pass` は completed evidence block draft と completed validation comment draft の両方が同じ current issue path を対象にし、Issue 92 / Issue 94 の rule set を同時に満たす場合だけに限定する
- `fallback-to-manual-check-incomplete` は evidence block draft が incomplete、validation comment draft が incomplete、または両者の対象 issue path がずれる場合に使う
- `unresolved` は observed public answer を推測で補完せず残す必要がある場合に evidence block 側で使い、validation comment 側では `fallback-to-manual-check-incomplete` と組み合わせて dry-run 不成立として扱う

## Operator Validation Checklist

- [x] required inputs が reviewed values と observed values として揃っている
- [x] completed evidence block draft が Issue 92 template と同順序になっている
- [x] completed validation comment draft が Issue 94 validation shape と同順序になっている
- [x] Match Result が fixed labels のいずれか 1 つに一致する
- [x] evidence block draft と validation comment draft の結果が矛盾していない
- [x] output に live DNS write、provider API action、approval suggestion が含まれていない

Checklist rule:

- 1 項目でも満たせない場合は dry-run output を current issue path に貼り戻さず、manual-check-incomplete fallback に戻る
- checklist 完了は review-ready draft の確認完了だけを意味し、live DNS change や cutover approval を意味しない

## Current Child Follow-Up

- none; Issue 95 is the terminal evidence-bearing endpoint for the current DNS verification chain

## Current Sync State

- GitHub body | terminal endpoint wording、completed dry-run draft、validation shape を含む current local record | synced 状態
- Boundary | review-only single current-issue paste-back dry-run | preserved

## Non-Goals

- live DNS write
- dig or other tooling installation
- provider credentials registration
- provider API integration
- workflow automation
- issue record direct editing automation
- Route 53 migration

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #95
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/95
- Sync Status: synced to GitHub as closed issue

- Issue 94 の checklist execution を single current-issue paste-back dry-run へ分離し、その後 GitHub issue #95 として同期した
- Issue 92 template と Issue 94 validation shape に接続する completed evidence block draft と completed validation comment draft を current-phase boundary 内で整理した
- Issue 95 is the terminal evidence-bearing endpoint for the current DNS verification chain; Issues 96-99 have been removed as they contained no additional evidence collection or DNS verification scope
- current phase では review-only paste-back dry-run に限定し、tooling install、provider integration、live DNS change は非対象に残している
- terminal endpoint judgment に変更はなく、DNS verification chain 内に追加検討点は見当たらないため close 対象とする
