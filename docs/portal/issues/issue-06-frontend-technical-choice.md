## Summary

MVP の実装速度と運用負荷に直結するため、フロントエンドの方式を先に決める必要がある。

## Goal

静的配信、SPA、SSR のいずれかを選び、ビルド方式と実装基盤を確定する。

## Task Contract Record

This record was reconstructed after the main discussion and decision work to restore traceability for Issue 6. It documents the scope, validation path, and rollback expectation that should have been locked before implementation started, but it does not retroactively change the fact that the original pre-implementation contract step was missed.

```text
Task Contract

Metadata
- Task ID: ISSUE-06
- Title: frontend technical choice
- Requester: repository owner
- Target App: portal-web
- Environment: planning
- Priority: high

Objective
- Problem to solve: determine a first-release frontend technical choice that fits the public-first portal scope, S3 plus CloudFront delivery baseline, and low-operations launch target
- Expected value: downstream implementation and infrastructure issues can proceed against one agreed delivery model, routing policy, build shape, and environment-variable policy

Scope
- In scope: compare static site, SPA, and SSR for first release; decide adoption path; decide routing policy; decide build direction; decide frontend environment-variable policy; align local issue evidence and review state
- Out of scope: runtime application implementation, backend introduction, SSR infrastructure, authenticated experiences, and reopening Issue 5 path placement
- Editable paths: docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md, docs/portal/issues/issue-06-frontend-technical-choice.md
- Restricted paths: apps/, infra/, deployment workflows, runtime code

Acceptance Criteria
- [x] AC-1: the draft compares static site, SPA, and SSR on shared evaluation criteria tied to current product and architecture constraints
- [x] AC-2: one first-release frontend approach is selected with explicit routing, build, and environment-variable direction
- [x] AC-3: the local issue contains evidence mapping and final review output aligned to the current published decision state

Implementation Plan
- Files likely to change: docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md, docs/portal/issues/issue-06-frontend-technical-choice.md
- Approach: build the decision in the draft first, then map each checklist item to evidence in the local issue, then normalize final review sections and remote sync state
- Alternative rejected and why: deciding by seed implementation alone was rejected because it would not prove that static-first remains the best fit against scope, routing, and operational constraints

Validation Plan
- Commands to run: git status --short; git --no-pager log -1 --oneline; GH_PAGER=cat gh issue view 6 --repo PLAYER1-r7/MultiCloudProject --json number,state,updatedAt,url,title
- Expected results: local issue reflects the same adoption decision and final review state as the draft, and the remote issue can be synced without contradicting the local record
- Failure triage path: if wording, checklist state, or remote sync drift is found, update the local issue first, then re-run validation and re-sync the remote body before any close decision

Risk and Rollback
- Risks: checklist could be marked complete while evidence wording still drifts; remote issue body could diverge from the local source document; seed routes could be mistaken for MVP route commitments
- Impact area: planning integrity for Issue 6 and downstream Issue 7 through Issue 16 decisions
- Mitigation: keep evidence mapping explicit, add final review sections, and call out the seed-route caveat in the issue and draft
- Rollback: uncheck final review state, revert the latest issue-document wording change, and reopen decision review if downstream assumptions are found to be unsupported
```

## Tasks

- [x] 静的サイト構成の適合性を評価する
- [x] SPA 構成の適合性を評価する
- [x] SSR 構成の適合性を評価する
- [x] 採用案を決定する
- [x] ルーティング方針を決定する
- [x] ビルド方式を決定する
- [x] 環境変数方針を決定する

## Definition of Done

- [x] static site、SPA、SSR の比較結果が整理されている
- [x] 初回リリースで採用する実装方式が 1 つに決定されている
- [x] 公開ファースト前提に合うルーティング方針が説明されている
- [x] S3 と CloudFront へ配備可能なビルド方式が定義されている
- [x] フロントエンドで扱う環境変数の方針が整理されている
- [x] 初回実装に必要な技術前提と、見送る技術要素が説明されている

## Evidence To Fill Before Checking

- `docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md` が static site、SPA、SSR を同じ評価軸で比較できているかを確認する
- Issue 2 の public-first MVP と Issue 4 の S3 + CloudFront baseline を前提にしても、SPA や SSR を採る合理的な理由が残るかを確認する
- Issue 5 で固定した `apps/portal-web` の配置判断と、今回決める frontend technical choice を混同していないかを確認する
- routing 方針が first release の情報導線に合っており、認証前提や backend 前提を持ち込んでいないかを確認する
- environment variable 方針が frontend に秘密情報を持ち込まない構成になっているかを確認する

## Current Draft Focus

- frontend technical choice の議論対象は `apps/portal-web` の配置ではなく、その中で採る delivery model と build shape である
- static-first with Vite を first-release adoption decision とし、その根拠となる比較結果と採用理由は draft 上に整理済みである
- first release は public-first、no-auth、no-backend、S3 + CloudFront baseline を前提に議論する
- routing、build、environment variable policy まで一体で決め、実装着手前の判断材料を揃える

## Provisional Agreement

- 初回リリースの frontend technical choice は static-first を第一候補として扱う
- SPA は完全除外ではないが、S3 + CloudFront への静的配備を崩さず、routing 複雑性を増やさない範囲に限る
- SSR は初回リリースでは採用候補から外す方向で扱う
- routing は public-first の少数ページを shallow に保つ
- build は `apps/portal-web` から静的 asset を生成し、S3 と CloudFront に配備できる形を必須条件とする
- frontend environment variables は public non-secret values に限定し、secret は frontend 側へ持ち込まない

## Provisional Agreement On Delivery Model

- static-first を初回リリースの基本方針とする
- first release の主要価値は public informational portal を低運用負荷で公開することであり、SSR runtime や複雑な client state は前提にしない
- SPA 的な実装は、最終成果物が静的 asset であり、first release の情報提供導線を複雑にしない場合に限って許容する
- SSR は backend/runtime 増加を伴うため、Issue 7 などで動的要件が確定するまで deferred とする

## Provisional Agreement On Routing

- 初回ページ群は Home、Overview、Guidance を中心とした shallow public routes とする
- protected route、authenticated area、server-side route dependency は持ち込まない
- client-side routing を使う場合でも、CloudFront fallback と deep link handling を明示的に説明できる構成に限定する

## Provisional Agreement On Build And Tooling

- build pipeline は TypeScript ベースとする
- `apps/portal-web` から S3 配備可能な静的出力を生成する
- Vite with TypeScript は現時点の strongest default candidate とする
- React は interactive need が明確になった場合のみ許容し、初回ページセットより先に framework choice を膨らませない

## Provisional Comparison Result

- static site は delivery fit、operational fit、product fit の観点で最上位候補として扱う
- SPA は expansion fit では優位性があるが、first release では routing complexity と client complexity を増やすため secondary option とする
- SSR は current scope に対して runtime と運用負荷が過大であり、比較対象としては残すが採用候補からは外す方向で扱う

## Adoption Decision

- 初回リリースの採用案は static-first TypeScript frontend with Vite とする
- 根拠は current product definition、auth decision、AWS architecture baseline、そして `apps/portal-web` の現 seed 実態が同じ方向を向いているためである
- この決定は first release の frontend technical choice を確定するものであり、後続 issue が新しい要件を持ち込まない限り再オープンしない

## Provisional Agreement On Environment Variables

- frontend environment variables は browser-safe な public values のみに限定する
- secret、private token、approval-sensitive config は frontend build に含めない
- environment-specific secrets や protected values は infra または deploy workflow 側で扱う

## Discussion Outcome So Far

- first release の frontend technical choice は path choice ではなく delivery model choice として扱う
- public-first、no-auth、no-backend、S3 + CloudFront baseline は frontend choice の前提条件とする
- static-first は product fit、delivery fit、operational fit の観点で最も整合的な候補として扱う
- SPA は secondary option として残すが、静的配備・浅い routing・低複雑性を維持できる場合に限る
- SSR は current scope と architecture baseline に対して過剰であり、初回リリース候補からは外す方向とする
- build 方式は S3 と CloudFront にそのまま載せられる静的 asset 出力を必須条件とする
- frontend environment variable policy は public non-secret values only を基本方針とする
- `apps/portal-web` の seed 実装は Vite + TypeScript の静的配備前提であり、adoption decision と整合している
- 現 seed に MVP 範囲より広い route が存在しても、first-release route policy は Home、Overview、Guidance を優先する

## Resolution

- 決定文書は [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md) とする
- Issue 6 の checkbox review は下記の根拠対応表を使って最終確認する

## Evidence Mapping Table

The tables below do not mark the checklist as complete yet. They only show where the evidence is expected to come from when the team performs final checkbox review.

### Task Mapping

| Checklist item                     | Primary evidence section                                                                                                                                                                                 | Why this is the evidence                                                                                                                                               | Review state              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `静的サイト構成の適合性を評価する` | `Option Assessment`, `Option Comparison Table`, and `Why The Current Judgment Looks This Way` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)  | These sections evaluate static site delivery against the current product, delivery, and operational constraints and explain why it is the strongest first-release fit. | Accepted for final review |
| `SPA 構成の適合性を評価する`       | `Option Assessment`, `Option Comparison Table`, and `Working Answers To The Current Questions` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md) | These sections describe where SPA remains viable, what constraints apply, and why it is a secondary option rather than the default.                                    | Accepted for final review |
| `SSR 構成の適合性を評価する`       | `Option Assessment`, `Option Comparison Table`, and `Provisional Recommendation Summary` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)       | These sections explain the runtime and operational costs of SSR and why it is deferred for the first release.                                                          | Accepted for final review |
| `採用案を決定する`                 | `Current Recommendation`, `Adoption Decision`, and `Decision Statement` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                        | These sections identify the preferred frontend model and state the chosen adoption path for the first release.                                                         | Accepted for final review |
| `ルーティング方針を決定する`       | `Routing Direction` and `Working Answers To The Current Questions` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                             | These sections define the public-first route shape, route depth expectations, and CloudFront routing considerations.                                                   | Accepted for final review |
| `ビルド方式を決定する`             | `Build Direction`, `Current Repository Evidence`, and `Adoption Decision` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                      | These sections define the static build output requirement and connect it to the existing Vite plus TypeScript seed under `apps/portal-web`.                            | Accepted for final review |
| `環境変数方針を決定する`           | `Environment Variable Direction` and `Working Answers To The Current Questions` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                | These sections state that frontend variables must be public and secret-free, with protected values handled outside frontend code.                                      | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                               | Primary evidence section                                                                                                                                                                                                           | Why this is the evidence                                                                                                                               | Review state              |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `static site、SPA、SSR の比較結果が整理されている`           | `Option Assessment`, `Evaluation Lens`, and `Option Comparison Table` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                                                    | These sections present the comparison set, the shared evaluation criteria, and the resulting judgment for each option.                                 | Accepted for final review |
| `初回リリースで採用する実装方式が 1 つに決定されている`      | `Current Recommendation`, `Provisional Recommendation Summary`, `Adoption Decision`, and `Decision Statement` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)            | These sections converge on a static-first TypeScript frontend with Vite as the chosen first-release path.                                              | Accepted for final review |
| `公開ファースト前提に合うルーティング方針が説明されている`   | `Routing Direction` and `Working Answers To The Current Questions` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                                                       | These sections explain the shallow public route model and the constraints on client-side routing.                                                      | Accepted for final review |
| `S3 と CloudFront へ配備可能なビルド方式が定義されている`    | `Build Direction`, `Current Repository Evidence`, and `Current Coverage Notes For Issue 6` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                               | These sections define static deployable output and tie it to the existing repository scaffold and AWS baseline.                                        | Accepted for final review |
| `フロントエンドで扱う環境変数の方針が整理されている`         | `Environment Variable Direction` and `Current Coverage Notes For Issue 6` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md)                                                | These sections define public-only frontend configuration and keep secrets outside the browser build.                                                   | Accepted for final review |
| `初回実装に必要な技術前提と、見送る技術要素が説明されている` | `Current Inputs`, `Current Repository Evidence`, `Candidate Tooling Direction`, and `Provisional Recommendation Summary` in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md) | These sections describe the approved first-release assumptions, the current tooling baseline, and the heavier options that are intentionally deferred. | Accepted for final review |

### Final Review Rule For Issue 6

- The presence of mapped evidence is not by itself enough to check the box.
- Final checkbox review should confirm that the mapped section still reflects the latest agreed wording.
- If a mapped section changes materially, the table should be rechecked before marking the checklist item complete.
- If the local issue definition changes after the last remote sync, the GitHub issue body should be synced again before close or any equivalent final-state transition.

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md).

| Checklist area                  | Final judgment | Evidence basis                                                                                                                                                              |
| ------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Option comparison               | Satisfied      | `Option Assessment`, `Evaluation Lens`, and `Option Comparison Table` compare static site, SPA, and SSR on a shared decision frame tied to first-release constraints.       |
| Adoption decision               | Satisfied      | `Current Recommendation`, `Adoption Decision`, and `Decision Statement` converge on a static-first TypeScript frontend with Vite as the selected first-release path.        |
| Routing direction               | Satisfied      | `Routing Direction` and `Working Answers To The Current Questions` keep the release route model shallow, public-first, and compatible with CloudFront fallback constraints. |
| Build direction                 | Satisfied      | `Build Direction`, `Current Repository Evidence`, and `Current Coverage Notes For Issue 6` define static output deployable to S3 and CloudFront from `apps/portal-web`.     |
| Environment-variable policy     | Satisfied      | `Environment Variable Direction` and `Current Coverage Notes For Issue 6` keep browser configuration public-only and move protected values out of frontend code.            |
| First-release technical framing | Satisfied      | `Current Inputs`, `Current Repository Evidence`, `Candidate Tooling Direction`, and `Provisional Recommendation Summary` define what is required now and what is deferred.  |

## Process Review Notes

- A pre-implementation task contract was required by the protocol but was not written before the main Issue 6 decision work started.
- The Task Contract Record above was added afterward to restore auditability for scope, validation, and rollback, but it should be treated as a retrospective record rather than proof of full step-order compliance.
- Final review output is now separated from evidence mapping so future reviewers can distinguish evidence locations from completion judgment.

## Discussion Starter

- first release は public informational portal を前提にし、Home、Overview、Guidance の少数ページを低運用負荷で届ける前提で置く
- AWS baseline は S3 + CloudFront であり、初回リリースに SSR runtime や backend runtime を追加しない前提で置く
- `apps/portal-web` は Issue 5 で frontend 実装 root として確定済みであり、Issue 6 では path ではなく technical choice を決める前提で置く
- 比較対象は static site、SPA、SSR の 3 つとし、採否は delivery complexity、routing complexity、build fit、future extensibility の観点で揃えて評価する前提で置く
- first release の environment variables は public build-time configuration のみに寄せ、secret を frontend に持ち込まない前提で置く

## Discussion Questions

- 初回リリースの主目的が informational portal の公開であるなら、static site を default と見てよいか、それとも SPA を標準にするだけの将来要件がすでにあるか
- SPA を選ぶ場合、CloudFront 上の route fallback や deep link handling を first release の複雑性として受け入れるべきか
- SSR を選ぶ理由として、現時点で SEO、personalization、runtime data fetch のどれかに明確な必然性があるか
- routing は content-first の少数 public route に留めるべきか、それとも初回から client-side nested routing を前提にすべきか
- build は `apps/portal-web` から静的 asset を生成して S3 に配備できる形を絶対条件としてよいか
- frontend の environment variables は public non-secret values のみに限定し、secret や approval-sensitive config は infra 側で扱う方針でよいか

## Current Status

- [docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md](docs/portal/08_FRONTEND_TECHNICAL_CHOICE_DRAFT.md) を判断材料の中心文書として使う
- local issue file には discussion starter、比較結果、adoption decision、checkbox 根拠の対応付けを追加済み
- retrospective Task Contract Record、Final Review Rule、Final Review Result を追加し、Issue 6 の監査可能性を補強した
- 採用案は static-first TypeScript frontend with Vite として確定した
- routing、build 方式、environment variable policy は first-release decision として文書上で整列済みである
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- protocol 上の step-order gap として、Task Contract が事前に存在しなかった事実は Process Review Notes に明記した
- GitHub Issue は open のまま再確認できる状態にしているため、close は明示的な最終判断で実施する

## Dependencies

- Issue 2
- Issue 4
- Issue 5
