# Portal Update Workflow

## Summary

portal-web は current AWS/GCP state の summary surface として使う方針になったため、今後の更新は単なる copy edit ではなく、canonical docs と route copy と validation を一続きで扱う必要がある。このままだと update request ごとに手順がぶれ、portal 実装だけ先に変わる、または docs だけ更新される、というズレが再発しやすい。

## Goal

portal-web の更新手順を固定し、request intake、source-of-truth 確認、task contract、portal route 更新、README 同期、validation、handoff を毎回同じ順序で実行できるようにする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: PORTAL-UPDATE-WORKFLOW-2026-03-10
- Title: portal-web 更新手順を runbook として固定し、portal から参照できるようにする
- Requester: repository owner
- Target App: portal-web
- Environment: local frontend / repository documentation
- Priority: medium
- Predecessor: PORTAL-AWS-GCP-CONTENT-2026-03-10 completed locally, PORTAL-STATUS-CARDS-2026-03-10 completed locally

Objective
- Problem to solve: portal-web の更新自体は進んだが、今後どの順序で docs と route copy と validation を揃えるかの共通 runbook がない
- Expected value: 次回以降の portal update request で source-of-truth、task contract、implementation、validation、handoff の順序が固定される

Scope
- In scope: portal update workflow runbook、portal delivery route への要約反映、README 同期
- Out of scope: new route creation, infra changes, deployment execution, GitHub issue close/open, live cloud changes
- Editable paths: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md, apps/portal-web/src/main.ts, apps/portal-web/README.md
- Restricted paths: docs/portal/issues/, infra/, .github/workflows/

Acceptance Criteria
- [ ] AC-1: portal update の標準手順が 1 文書で読める
- [ ] AC-2: portal site 内から update workflow の存在が辿れる
- [ ] AC-3: README が update workflow と validation baseline を案内している

Implementation Plan
- Files likely to change: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md, apps/portal-web/src/main.ts, apps/portal-web/README.md
- Approach: docs 側に runbook を追加し、delivery route に update loop を要約し、README から同じ workflow に誘導する
- Alternative rejected and why: docs だけ追加する案は portal UI から update workflow が見えず、site update request と runbook が再び分離するため採らない

Validation Plan
- Commands to run: cd apps/portal-web && npm run test:baseline && npm run build
- Expected results: route validation passes, typecheck passes, build succeeds
- Failure triage path: route metadata shape、external action handling、README wording の齟齬を見直す

Risk and Rollback
- Risks: update workflow が portal implementation runbook ではなく一般運用手順に見えること
- Impact area: portal maintenance flow, documentation clarity
- Mitigation: source-of-truth、task contract、route copy、README、validation、handoff に対象を限定する
- Rollback: workflow summary が過剰なら portal route 側の要約だけ戻し、runbook 自体は docs に残す
```

## When To Use This Workflow

- portal-web の copy を AWS/GCP current state に合わせて更新するとき
- status page の remaining tasks、card、canonical reference 導線を調整するとき
- route の summary、section、action link、README intent を同期したいとき
- portal 実装が canonical docs からずれていないか点検するとき

## Source Of Truth Order

portal update は次の順で source を確認する。

1. docs_agent の current operating rules を読む
2. docs/portal の current summary を読む
3. 必要なら closed parent-map docs と latest closed references を読む
4. その後で apps/portal-web/src/main.ts と apps/portal-web/README.md を更新する

Rule:

- portal-web は summary layer であり、canonical state を上書きしない
- current live state や remaining tasks は docs/portal 側の wording を基準にする
- closed issue chain を reopen せず、新しい follow-up は fresh task contract 前提で扱う
- browser-facing copy を変更する場合は、その task contract で local-only update なのか live portal reflection まで含むのかを明示する
- local build と route validation は deploy-ready evidence であり、live portal reflection evidence そのものではない

## Standard Update Loop

1. Request boundary を固定する

- 何を更新するのかを route 単位で言い切る
- content update なのか、status card 追加なのか、導線追加なのかを分離する
- source-of-truth doc がまだ曖昧なら、portal 実装より先に docs 側を確認する

2. Task contract を作る

- docs_agent の task contract template を使う
- editable paths と restricted paths を先に固定する
- acceptance criteria と validation commands を先に書く
- browser-facing copy change の場合は、scope に local-only か live reflection included かを書き、live reflection を行わないなら handoff owner と未反映理由を先に残す

3. Current portal shape を読む

- apps/portal-web/src/main.ts の対象 route を読む
- apps/portal-web/README.md の route intent を読む
- external links を足す場合は route validation が internal route だけを見ているか確認する

4. Minimal implementation を入れる

- routeDefinitions の対象 route だけを書き換える
- generic scaffold wording を残さず、AWS/GCP current state に寄せる
- 必要な rendering 拡張がある場合だけ最小追加する
- README の route intent も同じ変更単位で同期する

5. Canonical reference を残す

- portal 側だけで判断が閉じないよう、Cloud Status または relevant route から canonical docs へ戻れるようにする
- external doc links を使う場合は internal route validation から除外される前提を守る

6. Validate する

- apps/portal-web で npm run test:baseline を実行する
- 続けて npm run build を実行する
- route validation、typecheck、build の 3 つを minimum evidence とする

7. Live reflection を確認する

- task contract が live portal reflection を含む場合は、deploy 実行後に公開 URL で表示確認を行う
- live reflection を今回行わない場合は、local-only update であること、未反映理由、反映担当、次 action を handoff に残す
- browser-facing copy change は live reflection または明示的な未反映 handoff のどちらかがない限り Done としない

8. Handoff を書ける状態にする

- どの canonical docs を根拠にしたかを短く残す
- portal は summary layer であることを崩していないか確認する
- 次の follow-up があるなら route copy ではなく next batch として分離する

## Edit Targets

| Change type                      | Primary file                             | Secondary file                 | Notes                                        |
| -------------------------------- | ---------------------------------------- | ------------------------------ | -------------------------------------------- |
| route copy rewrite               | apps/portal-web/src/main.ts              | apps/portal-web/README.md      | route summary, sections, actions を同期する  |
| status card expansion            | apps/portal-web/src/main.ts              | apps/portal-web/src/styles.css | status 専用 data と rendering を最小追加する |
| canonical doc link refresh       | apps/portal-web/src/main.ts              | apps/portal-web/README.md      | external link handling を維持する            |
| workflow or maintenance guidance | docs/portal/21_PORTAL_UPDATE_WORKFLOW.md | apps/portal-web/src/main.ts    | Release Path に短い要約導線を置く            |

## Validation Baseline

portal update 完了条件は次の 2 コマンドとする。

```bash
cd apps/portal-web && npm run test:baseline && npm run build
```

Expected result:

- typecheck passes
- route validation passes
- production build succeeds

Live reflection rule:

- browser-facing copy change で live portal reflection を scope に含む場合は、公開 URL の表示確認結果を別途 evidence に残す
- browser-facing copy change が local-only のまま止まる場合は、Done ではなく deploy-ready handoff として扱う

Failure handling:

- action link を追加した直後に route validation が失敗したら、external URL が internal route として扱われていないか確認する
- README だけ先に直して build が通らない場合は main.ts 側の route intent との差分を解消する
- status 専用 UI を足した場合は route-specific optional field の型整合を先に疑う

## Completion Checklist

- [ ] source-of-truth docs を読んだ
- [ ] task contract を作った
- [ ] target route と README を同期した
- [ ] canonical reference 導線を確認した
- [ ] npm run test:baseline が通った
- [ ] npm run build が通った
- [ ] browser-facing copy change の場合、live portal reflection を確認した、または local-only handoff と未反映理由を明記した
- [ ] summary layer と source-of-truth の境界を崩していない

## Execution Record

```text
Document: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md
Scope: portal-web update workflow を docs と portal route に固定し、以後の content update を source-of-truth driven に揃える
Outcome: Handoff ready
Actions taken: portal update runbook を追加した | Release Path route に update loop 要約と canonical runbook link を追加した | portal-web README を update workflow に同期した
Evidence: docs/portal/21_PORTAL_UPDATE_WORKFLOW.md added | apps/portal-web route metadata updated | npm run test:baseline passed | npm run build passed
Risks or blockers: portal update workflow は local implementation runbook であり、deployment execution や live cloud change 手順は別文脈で扱う必要がある
Next action: 次回の portal update request ではこの runbook を起点に task contract を切り、canonical docs と route copy の同期を同一タスク内で完了させる
```
