# Summary

Issue 138 では staging-oriented evidence path と completion signal を validation/evidence update の最後の役割として固定した。次に必要なのは、contract-side evidence と browser-side evidence をどの reviewable path で束ね、何をもって first slice completion と言えるかを separate execution unit として固定することである。

この issue の役割は suite 実装そのものではなく、slice completion review の evidence packaging と fail conditions を narrow に定義することである。

# Goal

SNS first implementation slice 向けに、staging evidence and completion review execution を定義し、contract-side evidence、browser-side evidence、staging-oriented completion signal、fail conditions を実装着手可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-147
- Title: SNS staging evidence and completion review execution を整理する
- Requester: repository owner
- Target App: portal-web execution review path
- Environment: implementation-planning
- Priority: high
- Predecessor: issue-146-sns-browser-suite-update-execution.md accepted as the current browser-side evidence reference

Objective
- Problem to solve: contract evidence と browser evidence が揃っても、それをどの reviewable path で completion judgment に束ねるかが execution-ready 単位に切れていないと、slice done の判断が ad hoc になりやすい
- Expected value: staging-oriented completion review の evidence path と fail conditions を fixed し、first-slice completion を reviewable に閉じられる
- Terminal condition: evidence packaging boundary、completion signal、fail conditions、non-goals が fixed judgment として読め、completion review path を code and ops evidence へ落とせる

Scope
- In scope: contract-side evidence path、browser-side evidence path、staging-oriented completion review、fail conditions for incomplete evidence
- Out of scope: new test family implementation、monitoring integration、production approval depth、broader release governance redesign
- Editable paths: docs/portal/issues/issue-147-sns-staging-evidence-and-completion-review-execution.md
- Restricted paths: docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md, apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: contract-side と browser-side evidence packaging boundary が明文化されている
- [ ] AC-2: staging-oriented completion signal が読み取れる
- [ ] AC-3: incomplete evidence を含む fail conditions が読み取れる
- [ ] AC-4: production governance redesign などが non-goals として切り分けられている
```

# Execution Unit

## Evidence Packaging Boundary

- completion review should include contract-side validator evidence
- completion review should include browser-side visible critical-path evidence
- local observation alone is insufficient for completion review

## Completion Signal Boundary

- slice completion review means contract-side and browser-side evidence both prove the declared first-slice path
- staging-oriented evidence remains the preferred completion path once available
- completion review must fail closed when evidence is incomplete or contradictory

## Fail Conditions Candidate

- contract-side evidence is missing or still proves local-demo-only behavior
- browser-side evidence is missing or still passes only via fake success state
- visible critical-path success is claimed without repeatable reviewable output
- completion is claimed while evidence paths disagree on the slice behavior

## Non-Goals

- new test family implementation
- monitoring integration
- production approval governance redesign
- broader release management redesign

# Downstream Use

- future slice completion review should use this issue as the evidence packaging contract

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-138-sns-validation-and-evidence-update-execution.md
- docs/portal/issues/issue-145-sns-contract-validator-update-execution.md
- docs/portal/issues/issue-146-sns-browser-suite-update-execution.md
