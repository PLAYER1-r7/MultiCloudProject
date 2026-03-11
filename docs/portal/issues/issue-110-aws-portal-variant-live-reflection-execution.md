## Summary

Issue 109 で local implementation が完了した後、AWS public portal `https://www.aws.ashnova.jp` が AWS portal variant を実際に返していることを separate execution issue で確認する必要がある。Issue 106 は current shared portal copy batch の live reflection record であり、cloud-specific variant batch の live proof として再利用しない。

## Goal

AWS portal variant live reflection を separate execution issue として管理し、production deploy evidence と public URL verification を同一 issue path で追跡する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-110
- Title: AWS portal variant live reflection execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production portal surface
- Priority: high
- Predecessor: Issue 109 completed locally

Objective
- Problem to solve: local implementation だけでは AWS public portal が AWS variant を返したことを証明できない
- Expected value: AWS portal variant の deploy evidence path、artifact provenance、public route verification を current batch の separate issue で追跡できる

Scope
- In scope: promotion candidate identification、production deploy evidence path、AWS public route verification、AWS-specific wording reflection confirmation
- Out of scope: GCP public verification、portal copy redesign、infra redesign、workflow redesign
- Editable paths: docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: apps/portal-web/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: production deploy evidence path が issue 上に記録されている
- [ ] AC-2: `https://www.aws.ashnova.jp` の `/`, `/overview`, `/guidance`, `/status` で AWS variant が確認できる
- [ ] AC-3: Issue 106 を reopen せず current batch の AWS live reflection record として完結している

Implementation Plan
- Files likely to change: docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: Issue 106 の evidence shape を current batch 用に流用しつつ、AWS-specific wording reflection confirmation を追加する
- Alternative rejected and why: Issue 106 へ追記する案は batch boundary を壊すため採らない

Validation Plan
- Commands to run: get_errors on issue-110 and updated cloud status summary
- Expected results: deploy evidence path と AWS-specific public verification shape が読み取れる
- Failure triage path: Issue 106 と docs/portal/21_PORTAL_UPDATE_WORKFLOW.md を再照合し、current batch の evidence path が独立しているかを確認する

Risk and Rollback
- Risks: AWS variant wording の reflection failure が local implementation failure と混同されること
- Impact area: production portal wording, release traceability
- Mitigation: production deploy evidence と public verification を current issue path に限定し、local implementation issue とは分離する
- Rollback: live reflection が未実施なら deploy-ready/local-only handoff として止める
```

## Current Status

- OPEN
- GitHub Issue: #110
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/110
- Sync Status: synced to GitHub

## Current Execution Snapshot

- latest reviewed build on `main` is build run `22910183364` for commit `0991807895733669afb88dd592c42b07dd4817b3`
- latest reviewed staging verification on `main` is staging run `22910230433` for the same commit
- latest production deploy evidence is production run `22910302949` for the same commit
- current public AWS route probe on `https://www.aws.ashnova.jp/status` still returns the shared marker `AWS first`
- this means the current public AWS portal is still serving the pre-variant shared portal copy, not the Issue 109 runtime-variant implementation

## Blocker Assessment

- Issue 109 implementation exists only in the current local working tree and is not yet a committed promotion candidate on `main`
- production promotion requires a reviewed `portal-build` run and a matching successful `portal-staging-deploy` run for the commit being promoted
- because the current public production run `22910302949` is tied to commit `0991807895733669afb88dd592c42b07dd4817b3`, AWS live reflection cannot be truthfully recorded for the new variant batch yet
- fail-closed result: keep Issue 110 open until a new committed build candidate containing the Issue 109 code is built, staging-verified, and promoted

## Next Action Gate

- commit and publish the Issue 109 implementation to `main`
- obtain a new successful `portal-build` run for that commit
- obtain a matching successful `portal-staging-deploy` run for that commit
- dispatch `portal-production-deploy` with the new reviewed build and staging evidence
- verify `https://www.aws.ashnova.jp/`, `/overview`, `/guidance`, and `/status` for AWS-specific variant wording before closing this issue
