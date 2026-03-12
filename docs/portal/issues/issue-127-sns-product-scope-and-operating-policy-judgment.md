# Summary

簡易SNSの first implementation slice に進む前に、product scope と operating policy を fixed judgment として切り出す。現状の portal-web には SNS の contract validator と local demo surface があるが、誰が投稿できるか、どこまで公開するか、削除や moderation を first release に何段入れるかは未固定である。このまま auth、persistence、API、security の実装契約へ進むと、後続 issue ごとに product assumption が揺れやすい。

# Goal

簡易SNSの first release product boundary を決めるために、投稿可能者、公開範囲、削除方針、moderation floor、non-goals を 1 issue でレビュー可能な形に整理する。

# Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-127
- Title: SNS product scope and operating policy judgment を整理する
- Requester: repository owner
- Target App: portal-web and future SNS service layer
- Environment: planning
- Priority: high
- Predecessor: none

Objective
- Problem to solve: simple SNS expansion は current static-first portal baseline を超えるが、product scope と operating policy が未固定のままでは auth、API、persistence、security の後続 issue が別々の前提で進みやすい
- Expected value: first release で何を投稿できて、誰が扱えて、何を non-goal として切るかを先に固定し、後続 issue が同じ boundary を前提に実装契約へ進める
- Terminal condition: 投稿可能者、公開範囲、削除方針、moderation floor、non-goals が fixed judgment として読め、auth reopening issue と persistence issue がこの judgment を前提に開始できる

Scope
- In scope: posting actor model、public read versus authenticated write boundary、delete and hide policy、moderation floor、first release non-goals、first release success boundary
- Out of scope: actual auth provider selection、database selection、API schema implementation、cloud resource apply、GitHub issue close/open operations
- Editable paths: docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Restricted paths: apps/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: first release で投稿できる actor とできない actor が明文化されている
- [ ] AC-2: public read、authenticated write、operator action の boundary が読み取れる
- [ ] AC-3: delete policy と moderation floor が first release 向けの最小線として固定されている
- [ ] AC-4: non-goals が明文化され、first release に含めない機能が読み取れる

Implementation Plan
- Files likely to change: docs/portal/issues/issue-127-sns-product-scope-and-operating-policy-judgment.md, docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- Approach: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md の issue candidate 1 を fresh issue として切り出し、current portal baseline と collision する product assumptions を fixed judgment に落とす
- Alternative rejected and why: auth issue や persistence issue の中で product scope を同時に決める案は、後続 issue ごとに audience、non-goals、moderation line が揺れやすいため採らない

Validation Plan
- Commands to run: get_errors on the updated markdown docs
- Expected results: markdown diagnostics がなく、first release boundary と non-goals が issue 単位で読める
- Failure triage path: docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md の task breakdown と照合し、scope、actor model、moderation floor、non-goals のどこが不足しているかを切り分ける

Risk and Rollback
- Risks: product scope が広がりすぎて auth、moderation、stateful rollback の初回実装境界が曖昧になること
- Impact area: SNS planning chain, auth boundary, persistence scope, implementation order
- Mitigation: first release では public read と authenticated write を基準にし、operator moderation は最小介入線へ限定し、social graph や rich interaction は non-goal として切る
- Rollback: scope が広がりすぎた場合は actor model、visibility boundary、delete policy、moderation floor、non-goals の 5 点だけを残し、engagement feature 議論や cloud-specific policy は別 issue へ分離する
```

# Tasks

- [ ] 投稿 actor model を fixed judgment にする
- [ ] public read と authenticated write の boundary を fixed judgment にする
- [ ] delete and hide policy を fixed judgment にする
- [ ] moderation floor を fixed judgment にする
- [ ] first release non-goals を fixed judgment にする

# Definition of Done

- [ ] visitor、member、operator の責務差分が読める
- [ ] 投稿可否と閲覧可否の boundary が読める
- [ ] delete policy と moderation floor が first release 向けに過不足なく固定されている
- [ ] social graph や engagement feature が non-goals として切り分けられている
- [ ] auth reopening issue と persistence issue の前提として参照できる

# Discussion Seed

最初に決めるべき論点は次の 5 点に限定する。

1. 誰が投稿できるか
2. 投稿は誰に読めるか
3. 投稿者本人と operator の削除権限をどう分けるか
4. first release に必要な moderation floor をどこまで入れるか
5. like、reply thread、follow、DM、edit history などを non-goal としてどこまで切るか

# Provisional Direction

- 閲覧は public read を基本とし、first release の価値は公開タイムラインを前提に置く
- 投稿は authenticated member に限定し、guest は read-only とする
- operator は hide または soft-delete 相当の moderation action を持つが、first release では full trust-and-safety workflow までは持ち込まない
- 投稿者本人の edit は first release non-goal とし、delete も first pass では operator-managed を優先候補に置く
- media upload、likes、follow graph、DM、ranking、recommendation、real-time push は first release non-goal とする

# Initial Boundary Candidates

## Actor Model Candidate

- visitor: read-only
- member: post allowed
- operator: moderation-sensitive action allowed

## Visibility Candidate

- public timeline read is in scope
- authenticated write is in scope
- private audience segmentation is out of scope

## Delete And Moderation Candidate

- first release should prefer hide or soft-delete semantics over destructive delete as the default moderation path
- spam、abusive text、obvious invalid payload、rate-abuse should be handled by the minimum moderation floor
- user self-edit and deep appeals workflow are out of scope for first release

## Non-Goals Candidate

- likes or reactions
- follow or follower graph
- private messaging
- media upload
- nested thread depth beyond the minimum baseline
- algorithmic ranking or recommendation
- multi-cloud active-active write path in first release

# Downstream Use

- auth reopening issue should inherit the actor model and write boundary from this issue
- persistence issue should inherit the visibility model, delete semantics, and moderation-sensitive state assumptions from this issue
- backend and API baseline issue should treat these judgments as the product-side source of truth rather than reopening them

# Current Draft Focus

- fresh SNS planning chain の first issue として product scope boundary を先に固定する
- auth、persistence、API issue が後から product assumption を再定義しないようにする
- first release を public read plus authenticated write の narrow scope に抑える

# Current Status

- local draft created
- GitHub Issue: not created in this task
- Sync Status: local-only draft

# Dependencies

- docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md
- docs/portal/03_PRODUCT_DEFINITION_DRAFT.md
- docs/portal/04_MVP_SCOPE_DRAFT.md
