## Summary

Issue 112 で SNS protection baseline は fixed され、Issue 113 で automated regression gate の最小 target を切り出す前提を置いた。一方で、layout shell、navigation、shared primitive、design token、early-phase auth shell change のように automated evidence だけでは判定しづらい shared-layer change に対して、どの manual major-flow check を minimum fallback として要求するかは未固定のままである。

## Goal

SNS protection gate のうち manual major-flow check 側の baseline を整理し、shared-layer change 時に最低限確認する human-reviewed path、checklist、evidence note、fallback condition を 1 issue で読めるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-114
- Title: SNS shared-layer manual major-flow check baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: Issue 112 open

Objective
- Problem to solve: shared layout、navigation、shared primitive、design token change では automated evidence だけで SNS UX regression を十分に判定しにくいが、manual major-flow check の minimum baseline が未固定のため review quality が issue ごとに揺れる
- Expected value: human-reviewed fallback gate を minimum checklist と evidence note に固定し、automated coverage が薄い early phase でも SNS critical path を壊しにくくできる

Scope
- In scope: manual trigger classes、manual major-flow checklist、evidence note shape、fallback conditions、non-goals
- Out of scope: actual check implementation in CI、broad exploratory QA、visual regression tooling adoption、automated integration suite implementation
- Editable paths: docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md, docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Restricted paths: apps/, infra/, .github/workflows/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: manual major-flow check を要求する trigger class が読める
- [x] AC-2: minimum human-reviewed checklist が route、auth、post、readback、shared primitive の観点で整理されている
- [x] AC-3: evidence note shape と fallback condition が読める
- [x] AC-4: exploratory QA 全般へ広げず、SNS protection fallback baseline に留まっている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md, docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Approach: Issue 112 の shared-touch zone と regression matrix を input に、human-reviewed fallback gate を route/auth/post/readback/shared primitive の major flow に限定して固定する
- Alternative rejected and why: manual check を automated baseline issue に混ぜる案は fallback gate の責務と implementation-ready test baseline の責務が混ざるため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/issues/issue-114-sns-shared-layer-manual-major-flow-check-baseline.md and docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
- Expected results: markdown diagnostics がなく、manual trigger classes、checklist、evidence note が読み取れる
- Failure triage path: Issue 112 の shared-touch zone と concrete regression target を再照合し、manual checklist が route / auth / post / readback / shared primitive のどこで不足しているかを切り分ける

Risk and Rollback
- Risks: manual major-flow check が broad manual QA へ膨らむか、逆に shallow すぎて shared-layer UX regression を止められないこと
- Impact area: review discipline, SNS stability, future feature velocity
- Mitigation: shared-layer change に限定した minimum human-reviewed path と evidence note に絞る
- Rollback: scope が広がりすぎた場合は route / auth / post / readback の four-point check だけを残し、visual/accessibility depth は separate follow-up に分離する
```

## Tasks

- [x] manual trigger classes を固定する
- [x] minimum manual major-flow checklist を固定する
- [x] evidence note shape を固定する
- [x] fallback condition と non-goals を固定する

## Definition of Done

- [x] manual fallback gate の trigger class が読める
- [x] route、auth、post、readback、shared primitive の minimum checklist が読める
- [x] evidence note が same issue path に残せる shape で読める
- [x] broad exploratory QA を本 issue の外に維持している

## Manual Trigger Classes

次の change class は manual major-flow check を minimum fallback として要求する。

1. layout shell or navigation structure change
2. shared input / button / validation primitive change
3. shared loading / error / disabled-state primitive change
4. design token change consumed by SNS surface
5. early-phase auth shell change where automated evidence is not yet sufficient

Trigger rule:

- automated test が存在しても、shared UX regression を見落としやすい class では manual major-flow check を省略しない
- route、auth、form、visibility のいずれかに視覚的・操作的影響がある change は manual fallback class とみなす

## Minimum Manual Major-Flow Checklist

### A. Entry And Route Check

- SNS entry route is reachable
- SNS entry link is visible where expected
- route / navigation refactor did not misroute the user away from SNS entry

### B. Auth And Access Check

- signed-out state shows blocked or sign-in-required behavior for posting
- signed-in state shows posting form availability
- operator-only behavior is not exposed to member-level path

### C. Posting Interaction Check

- posting input can be focused and edited
- validation feedback appears when invalid input is given
- submit action shows expected pending / disabled behavior

### D. Readback And State Check

- successful post reaches expected readback or refresh path
- failed post remains visible as failure and does not silently disappear
- timeline empty / loading / error state still communicates correct meaning

### E. Shared Primitive And Visibility Check

- CTA remains visible and readable
- timeline text remains readable
- error and warning states remain distinguishable
- loading / disabled state is not visually misleading

## Evidence Note Shape

manual major-flow check issue should record at least:

- change class
- checked SNS surface
- signed-out result
- signed-in result
- post interaction result
- readback or failure-state result
- shared primitive visibility result
- overall judgment: pass | follow-up-needed | blocked

Evidence rule:

- evidence note must stay on the same issue path as the shared-layer change or linked exception issue
- `looked okay` is insufficient; at least route/auth/post/readback result must be named

## Fallback Condition

- if automated regression target is unavailable or incomplete for the triggered change class, manual major-flow check becomes mandatory
- if manual check finds route/auth/post/readback regression, `SNS unaffected` cannot be claimed
- repeated fallback on the same change class should trigger a future automation follow-up rather than remain permanent

## Recommended Split Toward Implementation

- future implementation issue should convert this manual checklist into a stable operator-facing template
- automated and manual gates remain separate so shared-layer changes can use both when needed

## Next Split

- Issue 117: SNS manual major-flow operator template baseline
- Issue 118: SNS manual major-flow paste-back dry-run

## Non-Goals

- broad exploratory QA session design
- visual regression tooling adoption
- accessibility audit program definition
- automated integration implementation
- CI workflow integration

## Current Status

- CLOSED ON GITHUB
- GitHub Issue: #114
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/114
- Sync Status: synced to GitHub as closed issue

- operator-facing manual fallback template split is synced as Issue 117
- manual paste-back dry-run split is synced as Issue 118

## Dependencies

- docs/portal/issues/issue-112-sns-implementation-protection-and-change-isolation-baseline.md
