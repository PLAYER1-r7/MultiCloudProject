## Summary

Issue 117 で SNS manual major-flow operator template の single-record shape は fixed できる前提を置けるが、shared-layer change issue に review-only で貼り戻す dry-run 単位、completed draft、validation comment、incomplete fallback の使い方は未分解のままである。このままだと template shape は定義できても、actual paste-back 時の結果記録が issue ごとに揺れやすい。

## Goal

SNS manual major-flow paste-back dry-run を整理し、Issue 114 の checklist と Issue 117 の operator template shape に接続する completed draft、validation comment、fallback condition、single current-issue paste-back rule を reviewable な execution-preparation issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-118
- Title: SNS manual major-flow paste-back dry-run を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 114 open, Issue 117 draft

Objective
- Problem to solve: operator-facing template は fixed できても、single current-issue path に review-only で貼り戻す dry-run 単位と validation flow が未固定のため、manual fallback execution shape が安定しない
- Expected value: completed manual major-flow draft と validation comment を one current issue path 単位で扱えるようにし、shared-layer change 時の human-reviewed fallback を repeatable にできる

Scope
- In scope: single current-issue paste-back dry-run、completed template draft、validation comment shape、incomplete fallback、operator usage note
- Out of scope: actual app implementation、automated integration implementation、CI wiring、broad exploratory QA、approval flow redesign
- Editable paths: docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md, docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: dry-run shape が Issue 114 / Issue 117 contract と矛盾しない
- [x] AC-2: completed manual major-flow draft と validation comment が fixed order で読める
- [x] AC-3: fallback condition と operator usage note が整理されている
- [x] AC-4: actual manual execution や app changes を含まない preparation issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md, docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Approach: Issue 114 の checklist と Issue 117 の operator template を input に、single current-issue paste-back dry-run、completed draft、validation comment、fallback note を execution-preparation issue として固定する
- Alternative rejected and why: completed draft を Issue 117 に混ぜる案は template definition と dry-run execution の責務が混ざるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-118-sns-manual-major-flow-paste-back-dry-run.md and docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Expected results: markdown diagnostics がなく、completed draft、validation comment、fallback condition が読み取れる
- Failure triage path: Issue 114 の checklist と Issue 117 の template shape を再照合し、field order、fallback wording、single-path rule のどこが崩れたかを切り分ける

Risk and Rollback
- Risks: dry-run issue が live approval や broad QA completion の最終記録に誤読されること
- Impact area: SNS review discipline, shared-layer fallback quality
- Mitigation: dry-run を review-only、single current-issue paste-back、completed draft text に限定し、approval と broad QA は非対象に残す
- Rollback: output が Issue 114 / 117 rule set を満たさない場合は dry-run issue を保留し、template baseline へ戻る
```

## Tasks

- [x] single current-issue paste-back dry-run shape を固定する
- [x] completed manual major-flow draft を固定する
- [x] validation comment shape を固定する
- [x] incomplete fallback と operator usage note を固定する

## Definition of Done

- [x] dry-run shape と contract boundary が 1 文書で読める
- [x] completed draft と validation comment が predecessor rule set に接続している
- [x] fallback と operator usage note が読める
- [x] actual manual execution や app changes が非対象のまま維持されている

## Dry-Run Baseline Draft

- dry-run は current shared-layer change issue 1 件だけを対象にする
- dry-run の出力は completed manual major-flow draft と validation comment draft の plain text だけとし、issue record を自動編集しない
- output が Issue 114 checklist と Issue 117 fixed section order を満たさない場合は incomplete fallback に戻る

## Single Current-Issue Paste-Back Draft

1. current shared-layer change issue を開き、change class と checked SNS surface を確認する
2. Issue 114 checklist に沿って route/auth/post/readback/shared primitive result を確定する
3. Issue 117 fixed section order に沿って completed manual major-flow draft を作成する
4. validation comment draft を作成する
5. 両方が same issue path に review-only で貼り戻せるか確認する
6. 条件未達なら incomplete fallback に戻る

Dry-run rule:

- one dry-run, one current issue path を維持する
- completed draft と validation comment draft のどちらか一方だけが成立しても success に丸めない
- dry-run 完了は approval や broad QA completion を意味しない

## Completed Draft Example

```text
SNS Shared-Layer Manual Major-Flow Check

Change Context

- Change Class: layout shell or navigation structure change
- Checked SNS Surface: SNS entry route and posting surface

Entry And Route Result

- SNS entry route reachable: yes
- SNS entry link visible where expected: yes
- Route misrouting observed: no

Auth And Access Result

- Signed-out blocked or sign-in-required behavior: yes
- Signed-in posting availability confirmed: yes
- Operator-only behavior exposed to member path: no

Posting Interaction Result

- Posting input focus/edit works: yes
- Validation feedback appears as expected: yes
- Submit pending/disabled behavior appears as expected: yes

Readback And Failure-State Result

- Success path reaches expected readback or refresh: yes
- Failure state remains visible and not silent: yes
- Timeline empty/loading/error meaning preserved: yes

Shared Primitive Visibility Result

- CTA visible and readable: yes
- Timeline text readable: yes
- Error and warning states distinguishable: yes
- Loading/disabled state not misleading: yes

Overall Judgment

- Overall Judgment: pass
- Note: manual fallback evidence only; approval and broad exploratory QA remain separate
```

## Validation Comment Draft

```text
SNS Manual Major-Flow Check Validation

- Issue: #118 local draft
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed Inputs Ready: yes | no
- Fixed Section Order Preserved: yes | no
- Single Issue Path Preserved: yes | no
- Required Results Named: yes | no
- Non-Goal Direction Preserved: yes | no
- Result: pass | fallback-to-incomplete-manual-check
- Note: validation confirms review-only SNS fallback evidence readiness; it does not approve release or replace broader QA
```

## Incomplete Fallback

- required inputs のいずれかが未確定なら completed draft を complete 扱いにしない
- fixed section order が崩れた場合は `fallback-to-incomplete-manual-check` として扱う
- completed draft と validation comment draft が同じ issue path を参照していない場合も incomplete fallback に戻る

## Operator Usage Note

- operator は current issue path 上で route/auth/post/readback/shared primitive の named results を埋めてから paste-back 候補として扱う
- one section でも yes/no or named result が欠ける場合は `pass` を使わない
- manual fallback evidence は `SNS unaffected` の broad 宣言を補助するだけで、approval や automated gate 不要を意味しない

## Recommended Split Toward Implementation

- future implementation issue should turn this dry-run shape into a comment-ready operator flow when SNS surfaces exist
- template baseline and dry-run shape remain separate so review definition and execution-shaped evidence do not mix

## Next Split

- Issue 125: SNS manual major-flow completed draft implementation split
- Issue 126: SNS incomplete manual check fallback implementation split

## Non-Goals

- actual manual execution
- app implementation
- automated integration implementation
- CI workflow integration
- broad exploratory QA session design

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #118
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/118
- Sync Status: synced to GitHub as closed issue

- completed draft implementation split is synced as Issue 125
- incomplete fallback implementation split is synced as Issue 126

- completed draft implementation split is drafted as Issue 125
- incomplete fallback implementation split is drafted as Issue 126

## Dependencies

- docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md
