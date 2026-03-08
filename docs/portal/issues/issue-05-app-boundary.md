## Summary

既存の exam-solver と sns に対して、どこまでが新規ポータルの作業範囲かを明確にしないと、越境変更が発生する。

## Goal

新規ポータルのディレクトリ配置、編集可能範囲、共有基盤扱いの有無を定義する。

## Tasks

- [x] 新規ポータルの配置先候補を整理する
- [x] 編集可能範囲を定義する
- [x] 既存アプリで触らない範囲を定義する
- [x] 共有基盤扱いとなる領域を整理する
- [x] boundary メモを作成する

## Definition of Done

- [x] planning ドキュメントの主作業領域が明示されている
- [x] 将来のフロントエンド実装配置先が定義されている
- [x] 将来のインフラ実装配置先が定義されている
- [x] 触ってはいけない領域または今は触らない領域が明文化されている
- [x] 共有基盤と portal 固有領域の切り分けが説明されている
- [x] 境界違反を避けるための編集ルールが存在する

## Evidence To Fill Before Checking

- `docs/portal` が planning source of truth であることと、`apps/portal-web` / `infra/` の扱いが矛盾なく説明できるかを確認する
- 既に存在する `apps/portal-web` と `infra/` を、実装 root として扱うのか、単なる placeholder として扱うのかを明確にする
- `docs_agent`、`docs_agent_ja`、`.tmp-home` を portal product work の通常編集対象から外す理由が十分かを確認する
- shared foundation と portal-specific work の境界が、README や reusable infra module まで含めて説明できるかを確認する
- issue summary にある `exam-solver` と `sns` を、現 repository scope とどう接続して解釈するかを確認する

## Current Draft Focus

- current repository reality に合わせた boundary decision の整理は完了した
- `docs/portal` と `docs/portal/issues` を planning source of truth とする方針は合意済み
- `apps/portal-web`、`infra/`、`docs_agent`、`docs_agent_ja`、`.tmp-home` の扱いは文書上で整理済み
- shared foundation と portal-specific work の切り分けは文書上で整理済み
- evidence mapping と final checkbox review の反映まで完了した

## Provisional Agreement

- planning の主作業領域は `docs/portal` と `docs/portal/issues` とする
- portal frontend の配置先は `apps/portal-web` で仮確定とし、Issue 6 は配置変更ではなく技術選定を扱う
- portal infrastructure の配置先は `infra/` で仮確定とし、environment entrypoint は `infra/environments/`、module は `infra/modules/` に置く
- `docs_agent`、`docs_agent_ja`、`.tmp-home` は通常の portal product edits から外す
- repository root の shared material と portal 固有領域は分けて扱い、portal-specific な判断を root ドキュメントへ逃がさない
- `exam-solver` と `sns` は boundary awareness を示す背景としてのみ扱い、この repository での直接編集対象には含めない

## Provisional Agreement On Frontend Placement

- `apps/portal-web` は portal frontend の実装 root として扱う
- この判断は path の固定に関するものであり、framework や build choice の固定ではない
- Issue 6 は `apps/portal-web` の中でどの frontend technical choice を採るかを決める役割とする
- この論点は checkbox 直前の最終確認を除いて、仮確定として扱う

## Provisional Agreement On Infrastructure Placement

- `infra/` は portal infrastructure の実装 root として扱う
- `infra/environments/staging` は staging-first delivery の実装 entrypoint として扱う
- `infra/environments/production` は production design gate が揃うまで production-gated 領域として扱う
- ただし README や skeleton のような planning-aligned structural maintenance は許容する
- この論点は checkbox 直前の最終確認を除いて、仮確定として扱う

## Provisional Agreement On Shared Foundation

- repository root の `README.md` は shared navigation、planning index、cross-cutting workflow guidance に限って更新対象とする
- `infra/modules/` は一律に shared foundation とみなさず、module ごとに reusable scope と ownership で判断する
- portal-only delivery concern を表す module は、複数 environment で再利用しても portal-specific work として扱ってよい
- この論点は checkbox 直前の最終確認を除いて、仮確定として扱う

## Provisional Agreement On External Context

- `exam-solver` と `sns` は boundary discipline の必要性を説明する背景文脈として残してよい
- ただし current repository の boundary memo では、現に存在する directory と編集対象を中心に書く
- current task scope に含まれない外部 workload の変更は、この issue の通常作業範囲に含めない
- この論点は checkbox 直前の最終確認を除いて、仮確定として扱う

## Discussion Outcome So Far

- planning の主作業領域は `docs/portal` と `docs/portal/issues` とする
- portal frontend の実装配置先は `apps/portal-web` とする
- portal infrastructure の実装配置先は `infra/` とし、environment entrypoint は `infra/environments/`、module は `infra/modules/` に置く
- `apps/portal-web` と `infra/` が存在していても、planning decisions の source of truth は引き続き `docs/portal` 側に置く
- `docs_agent`、`docs_agent_ja`、`.tmp-home` は portal product work の通常編集対象に含めない
- `infra/environments/production` は production design gate が揃うまで production-gated 領域として扱い、README や skeleton のような planning-aligned maintenance のみ許容する
- repository root の `README.md` は shared navigation、planning index、cross-cutting workflow guidance の範囲でのみ更新対象とする
- `infra/modules/` は一律に shared foundation とみなさず、module ごとに reusable scope と ownership で判断する
- `exam-solver` と `sns` は boundary awareness の背景として扱うが、この repository における直接編集対象には含めない

## Resolution

- 決定文書は [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md) とする
- Issue 5 の checkbox review は下記の根拠対応表を使って最終確認する

## Evidence Mapping Table

The tables below do not mark the checklist as complete yet. They only show where the evidence is expected to come from when the team performs final checkbox review.

### Task Mapping

| Checklist item                       | Primary evidence section                                                                                                                                                                                | Why this is the evidence                                                                                                                                           | Review state              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `新規ポータルの配置先候補を整理する` | `Current Repository Reality`, `Recommended Directory Boundary`, and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md) | These sections identify the actual candidate roots already present in the repository and state the intended placement for portal frontend and infrastructure work. | Accepted for final review |
| `編集可能範囲を定義する`             | `Current Working Boundary` and `Editing Rules` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                                                                          | These sections describe what is in scope now, what remains out of scope, and how edits should be constrained by directory and document role.                       | Accepted for final review |
| `既存アプリで触らない範囲を定義する` | `Current Repository Reality`, `Current Working Boundary`, and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)       | Taken together, these sections explain that `exam-solver` and `sns` are contextual references rather than active workloads inside the current repository scope.    | Accepted for final review |
| `共有基盤扱いとなる領域を整理する`   | `Shared Foundation Versus Portal-Specific Work` and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                 | These sections separate repository-level shared material from portal-specific work and explain why `infra/modules/` must be judged module by module.               | Accepted for final review |
| `boundary メモを作成する`            | `Decision Statement` and `Current Coverage Notes For Issue 5` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                                                           | These sections provide the summary form of the boundary memo and show the current coverage expected for final review.                                              | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                 | Primary evidence section                                                                                                                                                                                | Why this is the evidence                                                                                                                                      | Review state              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `planning ドキュメントの主作業領域が明示されている`            | `Current Working Boundary`, `Editing Rules`, and `Current Coverage Notes For Issue 5` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                                   | These sections state that planning decisions live under `docs/portal` and preserve `docs/portal/issues` as the issue source location.                         | Accepted for final review |
| `将来のフロントエンド実装配置先が定義されている`               | `Current Repository Reality`, `Recommended Directory Boundary`, and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md) | These sections identify `apps/portal-web` as the intended frontend implementation root rather than a vague future placeholder.                                | Accepted for final review |
| `将来のインフラ実装配置先が定義されている`                     | `Recommended Directory Boundary`, `Editing Rules`, and `Current Coverage Notes For Issue 5` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                             | These sections define `infra/` as the implementation root and distinguish environment entrypoints from reusable modules.                                      | Accepted for final review |
| `触ってはいけない領域または今は触らない領域が明文化されている` | `Current Working Boundary`, `Editing Rules`, and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                    | These sections identify excluded areas such as `docs_agent`, `docs_agent_ja`, `.tmp-home`, out-of-scope workloads, and production-gated implementation zones. | Accepted for final review |
| `共有基盤と portal 固有領域の切り分けが説明されている`         | `Shared Foundation Versus Portal-Specific Work` and `Working Answers To The Current Boundary Questions` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                 | These sections explicitly distinguish shared repository material from portal-specific code and planning artifacts.                                            | Accepted for final review |
| `境界違反を避けるための編集ルールが存在する`                   | `Editing Rules` and `Change Triggers` in [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md)                                                                                   | These sections provide the concrete rules and escalation triggers that prevent accidental edits outside the agreed boundary.                                  | Accepted for final review |

## Discussion Starter

- 現時点の planning 主作業領域は `docs/portal` と `docs/portal/issues` とする
- portal frontend の実装 root は `apps/portal-web` とし、portal runtime code を他ディレクトリへ分散させない前提で置く
- portal infrastructure の実装 root は `infra/` とし、environment entrypoint は `infra/environments/`、reusable module は `infra/modules/` に置く前提で置く
- `apps/portal-web` と `infra/` は既に存在するが、planning decisions の source of truth は引き続き `docs/portal` 側に置く
- `docs_agent`、`docs_agent_ja`、`.tmp-home` は portal product work の通常編集対象に含めない前提で置く
- repository-level README や reusable infra module は shared foundation 候補とし、page structure、content model、deployment path、app runtime code は portal-specific work として扱う前提で置く
- issue summary にある `exam-solver` と `sns` は current repository には存在しないため、現時点では boundary awareness を示す外部文脈として扱い、portal task の直接編集対象には含めない前提で置く

## Discussion Questions

- `apps/portal-web` は今後の実装 root として確定してよいか、それとも Issue 6 の技術選定完了までは reserved path とだけ表現すべきか
- `infra/environments/production` は production gate が揃うまで no-touch に近い扱いとするか、それとも README や skeleton 程度の planning-aligned changes は許容するか
- repository root の `README.md` は shared foundation としてどこまで portal task で更新してよいか
- reusable infra module を shared foundation と呼ぶ範囲を `infra/modules/` 全体に置くか、portal-static-site のような portal 専用 module は portal-specific とみなすか
- issue summary に残っている `exam-solver` / `sns` の文脈を、この repository 用の boundary memo にどこまで残すか

## Current Status

- [docs/portal/07_APP_BOUNDARY_DRAFT.md](docs/portal/07_APP_BOUNDARY_DRAFT.md) を決定文書として更新済み
- 議論結果と checkbox 根拠の対応付けをこの local issue file に追加済み
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- GitHub Issue は open のまま再確認できる状態にしているため、close は明示的な最終判断で実施する

## Dependencies

- Issue 4
