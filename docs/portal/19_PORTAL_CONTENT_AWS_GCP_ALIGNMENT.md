# Portal AWS/GCP Content Alignment

## Task Contract

```text
Task Contract

Metadata
- Task ID: PORTAL-AWS-GCP-CONTENT-2026-03-10
- Title: portal-web の内容を AWS/GCP の現行状態と follow-up に合わせて更新する
- Requester: repository owner
- Target App: portal-web
- Environment: local frontend / repository documentation
- Priority: medium
- Predecessor: Issue 69 closed, Issue 75 closed, Issue 77 closed, Issue 79 closed, Issue 80 closed, Issue 84 closed, Issue 86 closed, Issue 88 closed, Issue 90 closed, Issue 91 closed

Objective
- Problem to solve: portal-web は route seed を持っているが、主要ページの文言が初期 scaffold 寄りで、AWS/GCP の現行 live state と closed-reference follow-up batch を前提にした情報設計になっていない
- Expected value: portal-web から AWS/GCP の現状、cloud ごとの役割、canonical docs への参照導線、次の hardening batch の切り方を誤解なく読める

Scope
- In scope: route content rewrite, AWS/GCP current state wording alignment, canonical docs への参照導線追加, README の route description 更新
- Out of scope: new route creation, GitHub issue close/open, infra changes, workflow changes, live cloud changes
- Editable paths: docs/portal/19_PORTAL_CONTENT_AWS_GCP_ALIGNMENT.md, apps/portal-web/src/main.ts, apps/portal-web/README.md
- Restricted paths: docs/portal/issues/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: Home, overview, guidance, platform, delivery, operations, status が AWS/GCP の current repository state に沿った文言へ更新されている
- [ ] AC-2: status page から canonical docs を参照できる
- [ ] AC-3: remaining work が未実装機能ではなく follow-up hardening / lifecycle work として読める

Implementation Plan
- Files likely to change: apps/portal-web/src/main.ts, apps/portal-web/README.md
- Approach: 既存 route shell を保ちつつ routeDefinitions を AWS/GCP summary と closed reference chain に合わせて再記述し、必要最小限のレンダリング拡張で canonical docs への external links を追加する
- Alternative rejected and why: status page だけを更新する案は、portal 全体の導線が generic seed のまま残り、AWS/GCP aligned な site にならないため採らない

Validation Plan
- Commands to run: cd apps/portal-web && npm run test:baseline && npm run build
- Expected results: route validation passes, typecheck passes, build succeeds
- Failure triage path: route metadata shape と action rendering を見直し、README route summary と実装の齟齬を解消する

Risk and Rollback
- Risks: summary wording が closed issue records の代替 source of truth に見えること
- Impact area: portal messaging, documentation accuracy
- Mitigation: canonical docs へのリンクを明示し、status wording を current state と follow-up boundary に限定する
- Rollback: external link 導線や rewritten copy が過剰なら routeDefinitions と README を prior wording へ戻す
```
