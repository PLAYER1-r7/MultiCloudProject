## Summary

Issue 108 で cloud-specific portal variant の design boundary が固まったら、次は portal-web を shared route structure のまま runtime hostname-aware variant selection に対応させる local implementation が必要になる。ここで live deploy と混ぜると、local validation failure と browser-facing reflection failure が再び同じ issue に混ざりやすい。

## Goal

portal-web に runtime cloud detection と cloud-specific content model を実装し、AWS variant、GCP variant、generic local preview variant を local validation まで完了させる。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-109
- Title: portal runtime cloud detection and content model implementation を進める
- Requester: repository owner
- Target App: portal-web
- Environment: local frontend implementation
- Priority: high
- Predecessor: Issue 108 closed

Objective
- Problem to solve: current portal は shared copy を全 hostname で返しており、host-aware variant selection と cloud-specific route copy が未実装である
- Expected value: shared route structure を維持したまま AWS/GCP 別の portal view を local build で検証できる

Scope
- In scope: runtime hostname detection、variant model、shared vs cloud-specific route copy split、generic local preview fallback、README synchronization、local validation
- Out of scope: AWS/GCP live deploy、workflow mutation、infra changes、Issue 110/111 の live verification
- Editable paths: apps/portal-web/src/main.ts, apps/portal-web/README.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, docs/portal/issues/issue-110-aws-portal-variant-live-reflection-execution.md, docs/portal/issues/issue-111-gcp-portal-variant-live-reflection-execution.md

Acceptance Criteria
- [x] AC-1: runtime hostname detection が AWS/GCP/local preview variant を判定できる
- [x] AC-2: cloud-specific route copy が shared route structure を壊さずに表示される
- [x] AC-3: `npm run test:baseline` と `npm run build` が通る
- [x] AC-4: local-only implementation と live reflection issue boundary が維持される

Implementation Plan
- Files likely to change: apps/portal-web/src/main.ts, apps/portal-web/README.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Approach: current routeDefinitions を shared shell と variant-specific content layer に分け、hostname から selected variant を決定する
- Alternative rejected and why: AWS/GCP separate builds は first implementation で maintenance surface を増やしすぎるため採らない

Validation Plan
- Commands to run: cd apps/portal-web && npm run test:baseline && npm run build
- Expected results: route validation passes, typecheck passes, production build succeeds
- Failure triage path: hostname detection、route copy split、README wording の差分を切り分ける

Risk and Rollback
- Risks: variant split が route structure や status doc link を壊すこと
- Impact area: portal rendering, route validation, browser-facing wording
- Mitigation: shared route skeleton は維持し、variant layer は copy / card / action emphasis に限定する
- Rollback: variant model が複雑になりすぎた場合は home / status のみ variant split に縮小し、他 route は shared copy に戻す
```

## Local Variant Targets

- AWS variant for `www.aws.ashnova.jp`
- GCP variant for `www.gcp.ashnova.jp`
- GCP variant for `preview.gcp.ashnova.jp`
- generic local preview variant for unknown host and local dev

## Evidence Boundary

- this issue ends at local validation only
- browser-facing reflection must be recorded in separate AWS and GCP execution issues
- do not mark browser-facing variant change Done from local validation alone

## Implementation Result

- runtime hostname detection now resolves `www.aws.ashnova.jp` to AWS, `www.gcp.ashnova.jp` and `preview.gcp.ashnova.jp` to GCP, and localhost or unknown hosts to generic local preview
- shared route inventory remains unchanged while variant-specific eyebrow and summary copy are selected at runtime
- hero metadata now surfaces the active variant and resolved hostname so local validation can confirm the chosen view without browser devtools
- GCP status view reorders the status cards so the GCP hardening context is shown first on GCP hosts
- route validation now checks AWS, GCP, and local preview variants instead of validating only the shared copy baseline

## Validation Result

- `cd apps/portal-web && npm run test:baseline && npm run build` passed
- route validation report covered variants `aws`, `gcp`, and `local` with no issues
- production build completed successfully and emitted bundle `dist/assets/index-B6aEQIvb.js`

## Execution Record

```text
Document: 08_ESCALATION_AND_HANDOFF
Scope: implement runtime hostname-aware portal variants locally without mixing in live deploy execution
Outcome: Done
Actions taken: runtime hostname resolver added | variant-specific route copy layer added on top of shared route inventory | active variant metadata added to the hero | README synchronized | local validation completed
Evidence: apps/portal-web/src/main.ts updated | apps/portal-web/README.md updated | npm run test:baseline passed | npm run build passed
Risks or blockers: browser-facing reflection is still unverified on the public AWS and GCP hosts because that evidence belongs to Issue 110 and Issue 111
Next action: promote the reviewed local candidate through Issue 110 and Issue 111 to capture cloud-specific public verification
```

## Current Status

- CLOSED
- GitHub Issue: #109
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/109
- Sync Status: synced to GitHub and closed
