# Summary

Issue 3 と [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) は、static-first portal の first release を end-user authentication なしで開始する judgment を固定している。一方、簡易SNSの first release 候補は public read plus authenticated write を前提に寄せており、SNS の投稿機能を実装するなら no-auth baseline を historical record として残したまま、SNS 専用の auth reopening boundary を fresh issue として切り出す必要がある。

この issue の役割は auth provider を選ぶことではなく、どの actor にどの session requirement を課すか、provider-specific naming を app model に埋め込まないためにどの identity abstraction を先に固定するかを決めることである。

# Goal

簡易SNS向けに end-user authentication を reopen する範囲を定義し、guest、member、operator の role boundary、public read versus authenticated write の session boundary、provider-neutral identity abstraction の最小線をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-128
- Title: SNS auth reopening and provider-neutral identity boundary を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-127-sns-product-scope-and-operating-policy-judgment.md accepted as the current SNS product boundary reference

Objective
- Problem to solve: Issue 3 の no-auth baseline をそのまま延長すると SNS write path を定義できないが、auth provider や cloud implementation を先に選ぶと provider-specific assumption が app contract に混入しやすい
- Expected value: guest、member、operator の最小 role boundary と session requirement を fixed judgment にし、後続の persistence、API、frontend state、cloud mapping issue が同じ auth boundary を前提に進める
- Terminal condition: public read、authenticated write、operator moderation action の auth boundary と provider-neutral identity abstraction が fixed judgment として読め、provider selection issue を reopen せずに backend and API baseline issue が開始できる

Scope
- In scope: auth reopening rationale、guest/member/operator role boundary、session requirement boundary、provider-neutral identity abstraction、protected surface candidates、non-goals for first release auth
- Out of scope: actual provider selection、Cognito or Azure Entra implementation、OIDC wiring、token format implementation、secret injection、database schema
- Editable paths: docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: guest、member、operator の auth boundary が明文化されている
- [x] AC-2: public read、authenticated write、operator action の session requirement が読み取れる
- [x] AC-3: provider-specific naming を app model に入れない identity abstraction rule が明文化されている
- [x] AC-4: first release auth の non-goals が明文化され、provider selection や implementation work と切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-128-sns-auth-reopening-and-provider-neutral-identity-boundary.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 3 の no-auth baseline と docs/portal/05_AUTH_DECISION_DRAFT.md を historical record として引用しつつ、SNS product boundary で必要になった authenticated write path だけを fresh reopening boundary として切り出す
- Alternative rejected and why: auth provider selection を同じ issue で進める案は、identity abstraction ではなく cloud/vendor choice が先行し、later Azure and GCP mapping を縛りやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、role boundary、session requirement、identity abstraction、non-goals が issue 単位で読める
- Failure triage path: issue-127 product boundary と docs/portal/05_AUTH_DECISION_DRAFT.md を照合し、role model、write boundary、provider-neutral rule のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: provider-neutral abstraction が曖昧すぎて後続 implementation が再解釈を始めるか、逆に provider choice を実質的に固定するほど細かく決めすぎること
- Impact area: auth model, frontend state model, API authorization model, later cloud mapping
- Mitigation: first release では role boundary と session boundary のみを fixed judgment にし、provider naming、token claim detail、federation path は non-goal に残す
- Rollback: auth scope が広がりすぎた場合は role boundary、session requirement、identity abstraction naming rule の 3 点だけを残し、provider comparison や login UX detail は separate issue へ分離する
```

# Tasks

- [x] auth reopening rationale を fixed judgment にする
- [x] guest、member、operator の role boundary を fixed judgment にする
- [x] session requirement boundary を fixed judgment にする
- [x] provider-neutral identity abstraction rule を fixed judgment にする
- [x] first release auth non-goals を fixed judgment にする

# Definition of Done

- [x] SNS 向け auth reopening が historical no-auth baseline と矛盾なく説明されている
- [x] guest、member、operator の責務差分が auth boundary として読める
- [x] public read、authenticated write、operator action の session boundary が読める
- [x] provider-neutral identity abstraction の rule が downstream issue で参照できる
- [x] provider selection と implementation work が本 issue の out-of-scope として切り分けられている

# Historical Baseline To Preserve

- Issue 3 の first release portal judgment は public portal without end-user authentication であり、これは static-first portal baseline の historical record として保持する
- SNS auth reopening は Issue 3 の否定ではなく、new protected user workflow が現れたために fresh planning track で boundary を切り直す作業として扱う
- current static portal route 群に login-required route を retroactively 混ぜる判断はこの issue の目的ではない

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. write path に認証を要求する actor は誰か
2. public read を保ったまま write path だけ authenticated にするか
3. operator action を member action とどこまで分離するか
4. app model に残す identity の最小表現は何か
5. provider selection と token detail をどこまで non-goal として切るか

# Provisional Direction

- public timeline read は session-free のまま維持する
- write action は authenticated member に限定する
- moderation-sensitive action は operator session を要求する
- app model の identity は provider-specific subject naming ではなく、provider-neutral actor id と role mapping を基本にする
- provider comparison、federation strategy、token claim detail、passwordless UX detail は first release auth planning の non-goal にする

# Fixed Judgment

## Auth Reopening Rationale

- Issue 3 と [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) が固定した no-auth baseline は static-first portal の public release に対する historical record として維持する
- SNS auth reopening はその baseline の否定ではなく、public read と protected write が同居する new user workflow が発生したために追加される narrow planning boundary として扱う
- この issue が reopen するのは SNS write path と moderation-sensitive action に限られ、portal-wide protected route expansion や static portal baseline の再定義は行わない

## Role Boundary Resolution

- guest は public timeline read のみを行う session-free actor であり、write path と moderation-sensitive action には入らない
- member は authenticated write actor であり、public timeline read に加えて SNS post create を行える
- operator は member capability を含んだ elevated actor であり、moderation-sensitive action を行うために operator session を要求する
- first release auth boundary は guest、member、operator の 3 role に限定し、additional provider-owned role names や tenant-specific role hierarchy は app contract に入れない

## Session Boundary Resolution

- downstream canonical auth state names は `signed-out`、`signed-in member`、`operator` の 3 つに固定する
- public timeline read は session-free のまま維持し、login gate を導入しない
- SNS post create は authenticated member session を必須とし、guest write attempt は fail-closed に扱う
- moderation-sensitive action は operator session を必須とし、member session と同一視しない
- この issue は SNS write surface の boundary を固定するだけであり、portal summary routes や既存 static route 群を protected route へ拡張しない

## Provider-Neutral Identity Abstraction Resolution

- app model と API contract が露出してよい identity surface は actor id、actor role、authentication state の 3 つに限定する
- authenticated action では provider-neutral actor id の presence を要求するが、actor id の format、global uniqueness guarantee、storage encoding は後続 persistence issue に委ねる
- frontend、backend、monitoring、test で参照する contract name は provider brand、provider subject claim、tenant-specific principal naming ではなく actor id と role semantics に揃える
- later provider selection はこの abstraction に mapping されるべきであり、provider-specific token field name を public contract name として露出しない

## Protected Surface Resolution

- protected surface 候補は SNS post create と moderation-sensitive action に限定する
- public timeline read と existing portal summary routes は protected surface に含めない
- operator tooling detail、operator UI shape、provider-hosted login screen、token refresh behavior は first release auth boundary の fixed judgment ではなく後続 implementation issue に委ねる

## First Release Auth Non-Goals Resolution

- actual provider selection
- Cognito、Azure Entra、GCP identity service の implementation choice
- OIDC wiring、token issuance、token refresh、secret injection
- hosted login UX、passwordless UX、social login comparison
- portal-wide protected route expansion
- multi-cloud identity federation in the first implementation slice

# Initial Boundary Candidates

## Role Boundary Candidate

- guest: read-only, no post submit
- member: post submit allowed
- operator: moderation-sensitive action allowed in addition to member actions

## Session Requirement Candidate

- canonical auth state names for downstream use are signed-out, signed-in member, and operator
- public timeline read: no session required
- post create action: authenticated session required
- moderation action: elevated operator session required
- portal summary routes: no login gate introduced by this issue; portal-wide protected route expansion remains out of scope for this issue

## Identity Abstraction Candidate

- app model should expose actor id, actor role, and authentication state without embedding provider brand names
- actor id format and uniqueness guarantee are intentionally deferred to the persistence issue; this issue only fixes the provider-neutral contract name and its required presence on authenticated actions
- frontend and API contract should depend on role and session semantics, not on provider-specific token field names
- later provider selection may map to this abstraction, but should not change the public contract names casually

## Auth Non-Goals Candidate

- choosing Cognito versus another provider
- implementing hosted login UI
- token refresh strategy detail
- social login provider comparison
- multi-cloud identity federation in the first implementation slice
- portal-wide protected route expansion unrelated to SNS write path

# Downstream Use

- persistence issue should inherit the actor and identity assumptions from this issue
- backend and API baseline issue should inherit the authorization boundary from this issue
- frontend slice issue should inherit the canonical signed-out, signed-in member, and operator state names from this issue instead of inventing a parallel auth vocabulary

# Process Review Notes

- Issue 3 と [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) を historical no-auth baseline として保持したまま、SNS write path に必要な auth reopening boundary のみを narrow scope で固定した
- downstream issue が provider-specific naming を app contract に持ち込まないよう、actor id、actor role、authentication state を canonical abstraction として明示した
- current SNS planning chain では provider selection より role and session semantics の固定を優先し、backend/API/persistence/security issue が同じ auth vocabulary を参照できる状態に整えた

# Current Draft Focus

- Issue 3 を historical record として維持したまま SNS write path に必要な auth reopening boundary を fixed judgment として切り出した
- provider choice より先に role and session semantics を固定した
- public read plus authenticated write の narrow scope を first release auth boundary として保持した

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed planning record

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-03-auth-decision.md
- docs/portal/05_AUTH_DECISION_DRAFT.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
