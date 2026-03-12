# AWS Hardening Batch Fresh Task Contract

## Summary

AWS production custom domain、monitoring baseline、external DNS cutover / reversal memo、rollback readiness は current path として固定された。一方で、今後の follow-up は Issue 69 から Issue 79 の closed reference chain を再利用するのではなく、fresh task contract から新しい batch として起こす必要がある。この起点がないままだと、closed chain を reopen したり、DNS、alert、rollback/runbook の 3 系統を再び 1 つの曖昧な作業に混ぜたりしやすい。

## Goal

AWS hardening batch の次段を fresh task contract で開始し、DNS automation depth、alert tooling depth、rollback and runbook depth のどれを着手対象にしても、closed reference chain を壊さずに新しい execution scope を切り出せるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: AWS-HARDENING-FRESH-BATCH-2026-03-10
- Title: AWS hardening batch の fresh follow-up task contract を作成する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production follow-up planning
- Priority: medium
- Predecessor: Issue 69 closed, Issue 75 closed, Issue 77 closed, Issue 79 closed

Objective
- Problem to solve: AWS remaining tasks は closed reference chain として整理済みだが、次の作業をどの boundary で fresh contract 化するかが未固定のままだと、closed chain の reopen や scope 混線が起きやすい
- Expected value: DNS automation depth、alert tooling depth、rollback and runbook depth の次段作業を、新しい task contract と新しい follow-up issue chain で安全に開始できる

Scope
- In scope: next AWS batch の execution boundary 定義、primary stream selection rule、source-of-truth reference 固定、non-goals 明文化、validation baseline、handoff shape
- Out of scope: Issue 69 から Issue 79 の再編集、AWS live changes、DNS provider credential 登録、provider API 実装、live alert integration、automatic rollback 実装、workflow change
- Editable paths: docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md
- Restricted paths: docs/portal/issues/, infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [ ] AC-1: 次の AWS batch が fresh contract 起点であることを 1 文書で読める
- [ ] AC-2: DNS、alert、rollback/runbook の 3 stream から最初の着手対象を選ぶ rule が読める
- [ ] AC-3: closed reference chain を reopen しない boundary と non-goals が明示されている

Implementation Plan
- Files likely to change: docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md
- Approach: docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md と Issue 69 parent map の current wording を基準に、fresh contract の起点文書だけを追加する
- Alternative rejected and why: Issue 69 配下を直接再編集する案は closed reference chain の boundary を壊すため採らない

Validation Plan
- Commands to run: get_errors on docs/portal/22_AWS_HARDENING_BATCH_FRESH_TASK_CONTRACT.md
- Expected results: markdown diagnostics がなく、fresh contract boundary と stream selection rule が読み取れる
- Failure triage path: docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md と Issue 69 の current next-step shape を再照合し、fresh contract wording が closed chain を reopen していないか切り分ける

Risk and Rollback
- Risks: fresh task contract がそのまま live execution 承認や stream 決定済み記録に見えること
- Impact area: AWS follow-up planning, documentation accuracy, next-batch execution safety
- Mitigation: source-of-truth reference、selection rule、non-goals、separate execution issue requirement を明示する
- Rollback: scope が広がりすぎた場合は stream selection rule と non-goals のみを残し、execution detail は次 issue に分離する
```

## Source Of Truth References

- [docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md](docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md)
- [docs/portal/issues/issue-69-aws-hardening-batch-follow-up-map.md](docs/portal/issues/issue-69-aws-hardening-batch-follow-up-map.md)
- [docs/portal/issues/issue-75-aws-external-dns-helper-material-shell-snippet-execution.md](docs/portal/issues/issue-75-aws-external-dns-helper-material-shell-snippet-execution.md)
- [docs/portal/issues/issue-77-aws-primary-email-pointer-local-text-generator-execution.md](docs/portal/issues/issue-77-aws-primary-email-pointer-local-text-generator-execution.md)
- [docs/portal/issues/issue-79-aws-single-current-issue-operator-pack-execution.md](docs/portal/issues/issue-79-aws-single-current-issue-operator-pack-execution.md)

## Fresh Contract Boundary

- this contract starts from closed references only
- this contract does not reopen Issue 69, Issue 75, Issue 77, or Issue 79
- any new AWS work must be cut as a new follow-up issue chain after this contract
- current production path remains unchanged unless a later execution issue explicitly approves a separate change

## Stream Selection Rule

次に着手する stream は、次の 3 本から 1 つだけ選ぶ。

1. DNS automation depth
2. Alert tooling depth
3. Rollback and runbook depth

Selection rule:

- first stream must be chosen by smallest safe scope, not by maximum breadth
- if a proposed task touches credentials or provider API, prefer DNS stream only when the work can stay read-only or planning-only
- if a proposed task changes notification routing or destination ownership, prefer alert stream only when canonical first-response path remains unchanged
- if a proposed task changes rollback triggers, DNS reversal, or workflow behavior, prefer rollback stream only when it stays review-only and operator-managed
- if more than one stream is needed, split into separate contracts rather than merging them into one batch

## Recommended First Batch Shape

current repository state から見る first fresh batch の推奨形は次の通り。

- Primary candidate: DNS automation depth の read-only / planning-only follow-up
- Reason: Issue 75 までで helper material の fail-closed boundary が明確であり、live integration を含めずに next comparison or preparation issue へ進めやすい
- Fallback candidate: alert tooling depth の pointer-only follow-up
- Deferred candidate: rollback and runbook depth の deeper execution follow-up

Current derived follow-up:

- First DNS single-stream follow-up は [docs/portal/issues/issue-92-aws-manual-public-dns-verification-fallback.md](docs/portal/issues/issue-92-aws-manual-public-dns-verification-fallback.md) として起票済みで、GitHub Issue #92 が open
- この contract 自体は引き続き batch start point であり、Issue 92 を含む後続 issue の source contract として reference する

## Non-Goals For This Contract

- DNS provider credentials live registration
- provider API write integration
- live alert sending automation
- broad chat fan-out or 24x7 staffing expansion
- automatic rollback implementation
- workflow automation changes
- production DNS cutover change

## Next-Issue Hand-off Shape

この contract の次に起こす issue は、最低でも次を満たす。

- single stream only
- fresh issue title and task ID
- closed reference chain cited as input, not editable target
- explicit non-goals preserving current AWS production path
- validation plan matching the selected stream

## Execution Checklist

- [ ] selected stream is exactly one of DNS, alert, rollback/runbook
- [ ] selected stream keeps closed Issue 69 chain as reference only
- [ ] new issue title and task ID are fresh
- [ ] non-goals exclude live integration and workflow mutation unless separately approved
- [ ] validation commands are specific to the selected stream

## Execution Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: start the next AWS hardening batch from a fresh task contract instead of reopening the closed Issue 69 chain
Outcome: Handoff ready
Actions taken: source-of-truth references were fixed | fresh contract boundary was defined | stream selection rule and non-goals were documented
Evidence: docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md reviewed | issue-69 parent map reviewed | fresh contract document added locally
Risks or blockers: this contract does not choose or execute a live AWS change by itself; a new single-stream issue is still required
Next action: choose one AWS stream and cut a new single-stream follow-up issue from this contract without editing the closed reference chain
```
