# Summary

Issue 9 は OpenTofu を前提にした environment separation と reviewable IaC boundary を固定し、Issue 10 は validation、staging deploy、production gate を分離した CI/CD policy を固定している。一方、簡易SNSの first implementation slice は static portal とは別に authenticated write、stored message record、secret-backed service configuration を必要とするため、existing static delivery stack に stateful service concerns を混ぜない境界を fresh issue として切り出す必要がある。

この issue の役割は cloud product を選ぶことではなく、static delivery stack と SNS service stack の責務分離、environment variable and secret injection contract、frontend/backend deploy order を fixed judgment にすることである。

# Goal

簡易SNS向けに service stack and secret-management boundary を定義し、static delivery stack と stateful service stack の分離、secret injection rule、environment variable contract、deploy order、non-goals をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-132
- Title: SNS service stack and secret-management boundary update を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-131-sns-security-abuse-control-and-moderation-baseline.md accepted as the current SNS security floor reference

Objective
- Problem to solve: static portal baseline のままでは authenticated write と stored record を持つ SNS service concerns を安全に運用できず、stack separation、secret injection、deploy order が未固定のままだと implementation slice が static delivery stack を汚染しやすい
- Expected value: static delivery stack と stateful service stack の責務を fixed judgment にし、secret injection path、environment variable contract、deploy order を後続 implementation と IaC planning が同じ boundary で扱える
- Terminal condition: stack separation、secret injection rule、environment variable contract、deploy order、service stack non-goals が fixed judgment として読め、cloud product selection issue を reopen せずに implementation slice contract が開始できる

Scope
- In scope: static delivery stack versus SNS service stack responsibility split、environment variable contract boundary、secret injection rule、frontend/backend deploy order、environment separation assumptions、first release stack non-goals
- Out of scope: actual cloud product selection、runtime secret store implementation、workflow YAML implementation、database provisioning、network topology implementation
- Editable paths: docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: static delivery stack と SNS service stack の責務分離が明文化されている
- [ ] AC-2: secret injection と environment variable contract の boundary が読み取れる
- [ ] AC-3: frontend/backend deploy order が明文化されている
- [ ] AC-4: cloud product choice や workflow implementation が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-132-sns-service-stack-and-secret-management-boundary-update.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 9 の IaC separation、Issue 10 の CI/CD flow、Issue 128 から Issue 131 の SNS planning boundary を束ね、static portal stack と stateful SNS service stack の分離と secret handling boundary を fresh baseline issue として固定する
- Alternative rejected and why: cloud service family selection を同じ issue で進める案は、責務境界より先に provider choice が固定され、later Azure and GCP portability judgment と implementation order を縛りやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、stack split、secret injection、environment variable contract、deploy order、non-goals が issue 単位で読める
- Failure triage path: issue-130 API boundary、issue-131 security floor、issue-09 IaC policy、issue-10 CI/CD policy を照合し、stack split、secret handling、deploy order のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: stack split が曖昧すぎて static portal bundle へ service secrets が漏れるか、逆に detailed infra design まで抱え込んで planning issue が重くなること
- Impact area: deployment safety, secret posture, IaC layout, implementation ordering, later cloud mapping
- Mitigation: first release では static asset delivery と stateful SNS service concerns を分離し、public config と secret-backed config を contract level で切り分け、workflow detail と product choice は non-goal に残す
- Rollback: scope が広がりすぎた場合は stack responsibility split、secret injection rule、deploy order の 3 点だけを残し、topology or service family detail は separate issue へ分離する
```

# Tasks

- [ ] stack responsibility split を fixed judgment にする
- [ ] secret injection rule を fixed judgment にする
- [ ] environment variable contract を fixed judgment にする
- [ ] frontend/backend deploy order を fixed judgment にする
- [ ] first release stack non-goals を fixed judgment にする

# Definition of Done

- [ ] static delivery stack と SNS service stack の責務差分が downstream issue で参照できる
- [ ] public config と secret-backed config の boundary が読める
- [ ] deploy order が CI/CD policy と矛盾なく読める
- [ ] environment separation assumption が IaC policy と矛盾なく読める
- [ ] cloud product choice と workflow implementation が本 issue の out-of-scope として切り分けられている

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. static portal stack に残す責務は何か
2. SNS service stack に移す責務は何か
3. frontend bundle に入れてよい public config と secret-backed config をどう分けるか
4. backend と frontend の deploy order をどう固定するか
5. stack split と secret handling で product choice をどこまで non-goal として切るか

# Provisional Direction

- static portal stack は public asset delivery と public route shell を担当する
- SNS service stack は authenticated write、message persistence、secret-backed service configuration を担当する
- frontend bundle には public-only config を残し、service credentials や private connection detail は入れない
- secret injection の正規経路は service runtime or deploy environment 側とし、repository や frontend bundle への埋め込みは許可しない
- first implementation slice の deploy order は service stack を先に整え、その後 frontend が stable app-facing contract に接続する形を優先候補にする

# Initial Boundary Candidates

## Stack Responsibility Candidate

- static delivery stack: static assets, public route shell, public metadata, public environment markers
- SNS service stack: write API, stateful persistence, auth-bound service configuration, service-side moderation and abuse control hooks

## Secret Injection Candidate

- public config may be exposed to the frontend bundle only when it is safe as a public contract value
- service credentials, signing secrets, private endpoints, and managed secret references stay outside the frontend bundle
- secret injection should happen through approved environment or runtime secret paths, not through repository constants

## Environment Variable Contract Candidate

- frontend contract should consume public base URL and public capability flags only
- service stack should consume private connection and credential material separately
- provider-specific secret names should not become the public app contract by default

## Deploy Order Candidate

- backend or service contract should be deployed or made stable before frontend switches to rely on it
- frontend rollout should not expose a write path that points to an unready service boundary
- production promotion should preserve the existing staging-first, approval-gated flow from Issue 10

## Stack Non-Goals Candidate

- choosing AWS service family now
- choosing Azure service family now
- workflow YAML implementation detail
- runtime secret store product selection
- network segmentation detail
- production topology deep design

# Downstream Use

- implementation slice contract should inherit stack split and deploy order from this issue
- IaC planning follow-up should inherit the static-versus-service responsibility split from this issue
- frontend slice issue should inherit the public config boundary from this issue and avoid secret-backed assumptions in the browser bundle

# Current Draft Focus

- static portal stack と stateful SNS service stack の責務分離を先に固定する
- secret handling rule と deploy order を product choice より先に固定する
- first release を public config plus secret-backed service split の narrow scope に抑える

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/issues/issue-09-iac-policy.md
- docs/portal/issues/issue-10-cicd-policy.md
- docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
