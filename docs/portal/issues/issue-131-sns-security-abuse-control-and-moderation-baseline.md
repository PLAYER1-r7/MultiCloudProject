# Summary

Issue 11 と [docs/portal/13_SECURITY_BASELINE_DRAFT.md](docs/portal/13_SECURITY_BASELINE_DRAFT.md) は、public-first portal に必要な HTTPS、headers、managed secrets、auditability の baseline を固定している。一方、簡易SNSの first implementation slice は authenticated write を導入するため、portal static baseline だけでは足りず、投稿 API と message persistence に固有の abuse control、input validation、moderation action、audit needs を fresh issue として切り出す必要がある。

この issue の役割は WAF product や anti-spam vendor を選ぶことではなく、first release で最低限どの abuse を止め、どの invalid input を reject し、operator hide or delete をどの境界で持ち、どの security-relevant action を audit するかを fixed judgment にすることである。

# Goal

簡易SNS向けに security, abuse control, and moderation baseline を定義し、rate limiting、content validation、spam handling、operator hide/delete boundary、audit needs、non-goals をレビュー可能な形で整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-131
- Title: SNS security, abuse control, and moderation baseline を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: issue-130-sns-backend-and-api-baseline.md accepted as the current SNS API boundary reference

Objective
- Problem to solve: static portal の security baseline だけでは authenticated write と stored message record の abuse path を十分に扱えず、validation、rate limit、moderation、audit needs が未固定のままだと implementation slice が fail-open に寄りやすい
- Expected value: first release SNS write path に必要な abuse control と moderation baseline を fixed judgment にし、backend implementation、monitoring and rollback baseline、test baseline issue が同じ security floor を前提に進める
- Terminal condition: rate limiting、content validation、spam handling、operator hide/delete boundary、audit needs、security non-goals が fixed judgment として読め、product or vendor selection issue を reopen せずに implementation slice contract が開始できる

Scope
- In scope: rate limit baseline、content validation and size limits、spam or obvious abuse handling floor、operator hide/delete boundary、security-relevant audit events、first release security non-goals for SNS
- Out of scope: WAF product selection、captcha vendor selection、ML moderation tooling、incident response runbook detail、secret rotation implementation、cloud account policy changes
- Editable paths: docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [x] AC-1: first release write path の rate limit と validation floor が明文化されている
- [x] AC-2: spam or abuse handling と operator hide/delete boundary が読み取れる
- [x] AC-3: audit すべき security-relevant actions が明文化されている
- [x] AC-4: vendor choice や advanced trust-and-safety workflow が non-goals として切り分けられている

Implementation Plan
- Files likely to change: docs/portal/issues/issue-131-sns-security-abuse-control-and-moderation-baseline.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: Issue 11 の generic security baseline と issue-127 から issue-130 の SNS planning boundary を束ね、authenticated write path で必要になる abuse control and moderation floor だけを fresh baseline issue として固定する
- Alternative rejected and why: anti-spam vendor selection や incident workflow detail を同じ issue で進める案は、first release security floor より先に tooling or operations choice が固定され、implementation order を重くしやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、rate limit、validation、moderation、audit needs、non-goals が issue 単位で読める
- Failure triage path: issue-127 product boundary、issue-129 persistence boundary、issue-130 API boundary、docs/portal/13_SECURITY_BASELINE_DRAFT.md を照合し、abuse floor、moderation boundary、audit need のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: security baseline が broad すぎて enterprise-grade trust-and-safety workflow まで抱え込むか、逆に narrow すぎて implementation slice が fail-open に流れること
- Impact area: write-path safety, moderation posture, auditability, monitoring, later incident handling
- Mitigation: first release では obvious invalid input、size limit、basic rate abuse、operator hide path、audit trail のみを fixed judgment にし、advanced moderation tooling、automated reputation scoring、appeal workflow は non-goal に残す
- Rollback: scope が広がりすぎた場合は validation floor、rate limit floor、operator hide/delete boundary、audit needs の 4 点だけを残し、vendor or process detail は separate issue へ分離する
```

# Tasks

- [x] rate limit baseline を fixed judgment にする
- [x] content validation and size limits を fixed judgment にする
- [x] spam and obvious abuse handling floor を fixed judgment にする
- [x] operator hide/delete boundary を fixed judgment にする
- [x] security-relevant audit needs を fixed judgment にする

# Definition of Done

- [x] first release write path の validation floor が downstream issue で参照できる
- [x] rate abuse と obvious spam に対する minimum control が読める
- [x] operator hide/delete boundary が product and API boundary と矛盾なく読める
- [x] security-relevant audit events が monitoring and rollback baseline issue で参照できる
- [x] vendor choice と advanced trust-and-safety workflow が本 issue の out-of-scope として切り分けられている

# Historical Baseline To Preserve

- Issue 11 の generic security baseline は public-first static portal 向けの HTTPS、headers、secrets、auditability を扱う historical baseline として保持する
- SNS security reopening は Issue 11 の否定ではなく、authenticated write path and stored record に固有の abuse and moderation floor を fresh planning track で追加する作業として扱う
- generic portal route に WAF mandatory や broad CORS policy を retroactively 混ぜることはこの issue の目的ではない

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. first release の write path で最低限止めるべき invalid input は何か
2. rate abuse をどの粒度で fail-closed にするか
3. obvious spam or abusive content をどこまで first release で止めるか
4. operator hide/delete を通常 user flow とどう分離するか
5. audit が必要な security-relevant action をどこまで first release に含めるか

# Provisional Direction

- invalid payload、empty body、message-too-long、obvious malformed request は fail-closed に扱う
- rate limit は advanced behavior analytics ではなく basic write throttling を first release minimum にする
- spam and abuse handling は obvious abuse と repeated rate abuse を first release floor とし、advanced ML moderation は non-goal にする
- operator hide or soft-delete path は持つが、full appeal workflow や granular policy engine は first release non-goal にする
- create post attempt、write rejection、moderation-sensitive action、operator delete or hide path は audit candidate にする

# Fixed Judgment

## Security Reopening Rationale

- Issue 11 と [docs/portal/13_SECURITY_BASELINE_DRAFT.md](docs/portal/13_SECURITY_BASELINE_DRAFT.md) が固定した generic portal security baseline は static-first public portal に対する historical record として維持する
- SNS security reopening はその baseline の否定ではなく、authenticated write path と stored message record に固有の abuse control、moderation、audit need を追加する narrow planning boundary として扱う
- この issue が reopen するのは write-path validation、rate limit、obvious abuse handling、operator hide/delete boundary、audit event に限られ、vendor choice や enterprise trust-and-safety workflow を固定しない

## Validation Floor Resolution

- first release write path は invalid payload を fail-closed に扱い、minimum rejected case として empty body、message-too-long、malformed payload、unauthorized post を含める
- validation floor は issue-130 の stable error surface と整合し、invalid payload family は `INVALID_POST_PAYLOAD` を維持する
- message size limit は issue-130 の request contract と同じ 280 を baseline にし、oversize payload を silent truncate しない

## Rate Limit Resolution

- first release rate limit floor は basic per-actor or equivalent write throttling を minimum requirement にする
- unlimited retry、unlimited burst posting、write-path fail-open は許容しない
- adaptive reputation scoring、behavior analytics、dynamic trust scoring は first release rate limit baseline に含めない

## Abuse And Moderation Resolution

- obvious spam、repeated rate abuse、obvious malformed or abusive write attempt は pass silently させず fail-closed に扱う
- operator hide or soft-delete は primary moderation path とし、normal user flow と分離する
- destructive hard delete は exceptional path に留め、later issue が必要性を固定するまで default moderation path にしない
- user-facing appeal workflow、granular policy engine、advanced ML moderation は first release abuse-control baseline の non-goal に残す

## Audit Needs Resolution

- security-relevant audit candidate は successful post create、rejected post create for validation or authorization reasons、rate-limited post create、moderation-sensitive hide or delete action に固定する
- operator-triggered exceptional purge は later issue が導入した場合に追加 audit requirement として扱う
- monitoring and rollback baseline は上記 audit candidate を inherited input として扱い、write-path failure と moderation-sensitive action を観測対象に含める

## First Release Security Non-Goals Resolution

- WAF product selection
- captcha vendor selection
- ML moderation scoring
- trust-and-safety policy engine
- detailed appeals or dispute workflow
- cross-cloud abuse event sharing
- enterprise SIEM integration in the first implementation slice

# Initial Boundary Candidates

## Validation Candidate

- empty message reject
- message-too-long reject
- malformed payload reject
- unauthorized post reject

## Rate Limit Candidate

- basic per-actor or equivalent write throttling is in scope
- unlimited retry and unlimited post burst are out of bounds
- adaptive reputation scoring is out of scope

## Abuse And Moderation Candidate

- obvious spam and repeated abuse should not pass silently
- operator hide or soft-delete is the primary moderation path
- destructive hard delete remains exceptional and separately controlled if introduced
- user-facing appeal workflow is out of scope for first release

## Audit Candidate

- successful post create
- rejected post create for validation or authorization reasons
- rate-limited post create
- moderation-sensitive hide or delete action
- operator-triggered exceptional purge if a later issue introduces it

## Security Non-Goals Candidate

- captcha vendor selection
- ML moderation scoring
- trust-and-safety policy engine
- detailed appeals or dispute workflow
- cross-cloud abuse event sharing
- enterprise SIEM integration in the first implementation slice

# Downstream Use

- implementation slice contract should inherit the validation and rate-limit floor from this issue
- monitoring and rollback baseline issue should inherit audit candidates and moderation-sensitive failure modes from this issue
- frontend slice issue should inherit fail-closed user-visible error behavior for validation, authorization, and throttling states from this issue

# Process Review Notes

- Issue 11 の generic security baseline を historical record として保持したまま、SNS write path に必要な abuse-control and moderation floor のみを narrow scope で固定した
- issue-130 の API/error surface と整合するよう、invalid payload、authorization rejection、write throttling、moderation path を fail-closed security vocabulary に揃えた
- current SNS planning chain では vendor/tooling choice より validation、rate limit、audit candidate の固定を優先し、implementation/monitoring/test issue が同じ security floor を参照できる状態に整えた

# Current Draft Focus

- generic portal security baseline に対して SNS write path 固有の abuse and moderation floor を fixed judgment として追加した
- vendor or advanced workflow choice より先に fail-closed security floor を固定した
- first release を basic rate limit、input validation、operator hide path の narrow scope に抑えた

# Current Status

- local fixed judgment recorded
- GitHub Issue: not created in this task
- Sync Status: local-only fixed planning record

# Dependencies

- docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md
- docs/portal/issues/issue-129-sns-message-domain-model-and-persistence-decision.md
- docs/portal/issues/issue-130-sns-backend-and-api-baseline.md
- docs/portal/issues/issue-11-security-baseline.md
- docs/portal/13_SECURITY_BASELINE_DRAFT.md
- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
