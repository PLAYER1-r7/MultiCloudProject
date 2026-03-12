# Portal Status Card Expansion

## Task Contract

```text
Task Contract

Metadata
- Task ID: PORTAL-STATUS-CARDS-2026-03-10
- Title: portal-web の status page に AWS/GCP 残タスクカードを追加する
- Requester: repository owner
- Target App: portal-web
- Environment: local frontend / repository documentation
- Priority: medium
- Predecessor: PORTAL-AWS-GCP-CONTENT-2026-03-10 completed locally

Objective
- Problem to solve: current status page は AWS/GCP の current state と next batches を文章では読めるが、cloud ごとの remaining tasks と closed-reference entry points が一覧的に把握しづらい
- Expected value: AWS と GCP の残タスク、current entry point、closed-reference chain をカード単位で比較でき、次に切る follow-up batch をすばやく判断できる

Scope
- In scope: status page 専用カードデータ追加、status page レンダリング拡張、status card 用 CSS、README の status route intent 更新
- Out of scope: new route creation, docs/portal source updates, GitHub issue changes, infra changes, workflow changes
- Editable paths: docs/portal/20_PORTAL_STATUS_CARD_EXPANSION.md, apps/portal-web/src/main.ts, apps/portal-web/src/styles.css, apps/portal-web/README.md
- Restricted paths: docs/portal/issues/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: status page 上で AWS と GCP の remaining tasks が card UI で比較できる
- [ ] AC-2: 各 card から current entry point と closed-reference shape が読み取れる
- [ ] AC-3: route validation と build が通る

Implementation Plan
- Files likely to change: apps/portal-web/src/main.ts, apps/portal-web/src/styles.css, apps/portal-web/README.md
- Approach: route definition に status 専用 card collection を追加し、Cloud Status route のみ追加レンダリングする
- Alternative rejected and why: existing story cards だけで情報を増やす案は AWS/GCP の比較面が弱く、残タスクの一覧性が上がらないため採らない

Validation Plan
- Commands to run: cd apps/portal-web && npm run test:baseline && npm run build
- Expected results: route validation passes, typecheck passes, build succeeds
- Failure triage path: status-only optional fields の型整合、internal/external action handling、responsive CSS を見直す

Risk and Rollback
- Risks: status page の情報量が過剰になり summary route より backlog board のように見えること
- Impact area: portal messaging, readability
- Mitigation: card は remaining tasks、entry point、reference chain に限定し、execution detail は canonical docs に残す
- Rollback: card section が過剰なら status 専用カード描画を削除し、既存 summary route に戻す
```
