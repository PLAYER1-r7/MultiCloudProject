## Summary

Issue 114 で SNS shared-layer manual major-flow check の trigger class、minimum checklist、evidence note shape は fixed できたが、operator が shared-layer change issue 上でそのまま使える single current-issue template と validation shape は未分解のままである。このままだと route/auth/post/readback/shared primitive の確認項目が定義済みでも、記録単位や field order が issue ごとに揺れやすい。

## Goal

SNS manual major-flow operator template baseline を整理し、Issue 114 の checklist と evidence note shape に接続する operator-facing single-record template、required inputs、fallback direction、validation shape を reviewable な implementation-preparation issue として固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-117
- Title: SNS manual major-flow operator template baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 114 open

Objective
- Problem to solve: manual major-flow check baseline は fixed したが、operator が same issue path に残す template と validation shape が未固定のため、manual evidence の記録品質が shared-layer change ごとに揺れる
- Expected value: route/auth/post/readback/shared primitive を 1 つの operator-facing template に落とし込み、manual fallback gate を repeatable な single-record unit にできる

Scope
- In scope: operator-facing template shape、required inputs、fixed output sections、validation shape、fallback direction、non-goals
- Out of scope: actual app implementation、automated integration implementation、CI wiring、broad exploratory QA、visual regression tooling
- Editable paths: docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md, docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: operator-facing single-record template shape が読める
- [x] AC-2: route、auth、post、readback、shared primitive coverage の fixed section order が読める
- [x] AC-3: validation shape と fallback direction が整理されている
- [x] AC-4: actual manual execution や app changes を含まない preparation issue に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md, docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Approach: Issue 114 の minimum checklist と evidence note shape を、single current-issue path で使う operator-facing template と validation shape に切り分ける
- Alternative rejected and why: manual checklist と dry-run 単位を同じ issue に混ぜる案は template definition と execution-shaped review の責務が混ざるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-117-sns-manual-major-flow-operator-template-baseline.md and docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
- Expected results: markdown diagnostics がなく、template shape、section order、validation shape が読み取れる
- Failure triage path: Issue 114 の checklist と evidence note shape を再照合し、route/auth/post/readback/shared primitive のどこが template から漏れているかを切り分ける

Risk and Rollback
- Risks: operator template が broad QA 記録や approval log の代替に誤読されること
- Impact area: SNS review discipline, shared-layer fallback quality, future feature velocity
- Mitigation: template を manual fallback evidence の single-record shape に限定し、broad exploratory QA と approval は非対象に残す
- Rollback: scope が広がりすぎた場合は route/auth/post/readback の four-point template だけを残し、shared primitive visibility は follow-up issue へ分離する
```

## Tasks

- [x] operator-facing template shape を固定する
- [x] fixed section order を固定する
- [x] validation shape と fallback direction を固定する
- [x] non-goals を明文化する

## Definition of Done

- [x] operator-facing single-record template が 1 文書で読める
- [x] route/auth/post/readback/shared primitive coverage が fixed sections で読める
- [x] validation shape と fallback direction が読める
- [x] actual manual execution や app changes を本 issue の外に維持している

## Recommended Template Shape

manual major-flow operator template は one change issue, one SNS fallback record を維持する single text block とする。

Template rule:

- template は current shared-layer change issue か linked exception issue の 1 箇所だけに残す
- route/auth/post/readback/shared primitive を別記録へ分散させない
- manual fallback evidence は approval log や broad QA note を兼ねない

## Required Inputs

- `change_class`: Issue 114 の manual trigger classes のいずれか
- `checked_sns_surface`: checked screen or route
- `signed_out_result`: blocked or sign-in-required result
- `signed_in_result`: posting availability result
- `post_interaction_result`: input / validation / pending behavior result
- `readback_or_failure_result`: success readback or failure-state result
- `shared_primitive_visibility_result`: CTA / text / error / loading visibility result
- `overall_judgment`: pass | follow-up-needed | blocked

## Fixed Section Order

1. Change Context
2. Entry And Route Result
3. Auth And Access Result
4. Posting Interaction Result
5. Readback And Failure-State Result
6. Shared Primitive Visibility Result
7. Overall Judgment

Section rule:

- field order は shared-layer change issue ごとに変えない
- one section でも空なら manual fallback evidence を complete 扱いにしない
- `looked okay` のような broad summary だけで sections を置き換えない

## Operator Template Draft

```text
SNS Shared-Layer Manual Major-Flow Check

Change Context

- Change Class: <value>
- Checked SNS Surface: <value>

Entry And Route Result

- SNS entry route reachable: yes | no
- SNS entry link visible where expected: yes | no
- Route misrouting observed: yes | no

Auth And Access Result

- Signed-out blocked or sign-in-required behavior: yes | no
- Signed-in posting availability confirmed: yes | no
- Operator-only behavior exposed to member path: yes | no

Posting Interaction Result

- Posting input focus/edit works: yes | no
- Validation feedback appears as expected: yes | no
- Submit pending/disabled behavior appears as expected: yes | no

Readback And Failure-State Result

- Success path reaches expected readback or refresh: yes | no
- Failure state remains visible and not silent: yes | no
- Timeline empty/loading/error meaning preserved: yes | no

Shared Primitive Visibility Result

- CTA visible and readable: yes | no
- Timeline text readable: yes | no
- Error and warning states distinguishable: yes | no
- Loading/disabled state not misleading: yes | no

Overall Judgment

- Overall Judgment: pass | follow-up-needed | blocked
- Note: manual fallback evidence only; approval and broad exploratory QA remain separate
```

## Validation Shape

GitHub issue comment や review note に残す validation shape は最低でも次を含む。

- Reviewed Inputs Ready: yes | no
- Fixed Section Order Preserved: yes | no
- Single Issue Path Preserved: yes | no
- Required Results Named: yes | no
- Non-Goal Direction Preserved: yes | no
- Result: pass | fallback-to-incomplete-manual-check

## Fallback Direction

- required inputs のいずれかが未確定なら template を complete 扱いにしない
- fixed section order が崩れた場合は `fallback-to-incomplete-manual-check` として扱う
- same change issue path に残っていない evidence は manual fallback 完了とみなさない

## Recommended Split Toward Implementation

- future implementation issue should turn this operator template into a comment-ready completed draft and dry-run shape
- automated and manual gates remain separate and can be combined when needed

## Next Split

- Issue 123: SNS manual major-flow template section implementation split
- Issue 124: SNS manual major-flow validation shape implementation split

## Non-Goals

- actual manual execution dry-run
- app implementation
- automated integration implementation
- CI workflow integration
- broad exploratory QA session design

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #117
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/117
- Sync Status: synced to GitHub as closed issue

- template section implementation split is synced as Issue 123
- validation shape implementation split is synced as Issue 124

- template section implementation split is drafted as Issue 123
- validation shape implementation split is drafted as Issue 124

## Dependencies

- docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md
