## Summary

初回リリースで扱う範囲を絞らないと、AWS 初期構成や実装コストが肥大化する。

## Goal

初回リリースで実装するページと機能を限定し、対象外を明確にする。

## Tasks

- [x] 初回リリース対象ページを定義する
- [x] 初回リリース対象機能を定義する
- [x] 非対象機能を整理する
- [x] 後続フェーズへ送る項目を整理する
- [x] MVP と非 MVP の一覧を作成する

## Definition of Done

- [x] 初回対象ページがページ名付きで定義されている
- [x] 初回対象機能が利用者視点で箇条書き化されている
- [x] 非対象機能が明示的な除外一覧として整理されている
- [x] 後続フェーズへ送る項目が理由付きで整理されている
- [x] MVP の成立条件が 1 段落で説明できる
- [x] Issue 3 と Issue 4 の前提条件として参照可能な状態になっている

## Evidence To Fill Before Checking

- in-scope pages が本当に初回リリース必須のページだけに絞れているかを議論する
- in-scope functions が visitor value に直結しているか、内部運用都合が混ざっていないかを確認する
- out-of-scope と deferred items の境界と理由を合意する
- `MVP Boundary` が成立条件として十分か、足りない acceptance 条件がないかを確認する
- 各 checkbox に対して、どの節のどの記述が根拠かを合意してからチェックする

## Discussion Seed

- 議論のたたき台は [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md) を使う
- まず次の 4 点を順に確定する:
  - 初回リリース対象ページを Home / Overview / Guidance の 3 ページで固定するか
  - 初回対象機能を利用者機能と運用能力に分けて記述するか
  - login と backend workflow を MVP 非対象として明示的に後続送りにするか
  - `MVP Boundary` を checkbox 判定の根拠として採用できるか
- 上記 4 点に合意した後で、Tasks と Definition of Done の checkbox 根拠を対応付ける

## Current Draft Focus

- Guidance page を MVP 必須ページとして扱う方針は合意済み
- 初回対象機能は利用者機能と運用能力を分けて記述する方針は合意済み
- login と backend workflow を明示的に後続送りとする方針は合意済み
- 次は evidence mapping と checkbox 判定根拠の整理に進む

## Provisional Agreement

- 初回リリース対象ページは Home、Overview、Guidance の 3 ページに限定する
- 利用者機能は visitor value に直接関わる項目を根拠として扱う
- repository-driven updates と minimal release verification は MVP を支える運用能力として別枠で扱う
- login と backend workflow は hidden requirement にせず、明示的に後続フェーズへ送る
- Issue 7 は backend workflow の将来判断に使うが、Issue 2 の完了条件そのものには含めない
- `MVP Boundary` の判定基準は public portal access、purpose understanding、initial navigation、next action reachability を満たすこととする

## Evidence Mapping Table

The tables below do not mark the checklist as complete yet. They only show where the evidence is expected to come from when the team performs final checkbox review.

### Task Mapping

| Checklist item                     | Primary evidence section                                                                                                                                                                                                                                                  | Why this is the evidence                                                                                                | Review state              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `初回リリース対象ページを定義する` | `Proposed In-Scope Pages` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                                                                                                                       | This section names the exact initial page set and states the purpose of each page in the first release.                 | Accepted for final review |
| `初回リリース対象機能を定義する`   | `Proposed In-Scope User-Facing Functions` and `Operational Capabilities Required For MVP` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                                                       | These sections separate visitor-facing functions from the operational capabilities required to support the MVP.         | Accepted for final review |
| `非対象機能を整理する`             | `Proposed Out-of-Scope Functions` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                                                                                                               | This section provides the explicit exclusion list for features that should not be treated as part of the first release. | Accepted for final review |
| `後続フェーズへ送る項目を整理する` | `Explicitly Deferred To Later Phases` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                                                                                                           | This section lists later-phase items and gives the reason each item is deferred instead of included in the MVP.         | Accepted for final review |
| `MVP と非 MVP の一覧を作成する`    | `Proposed In-Scope Pages`, `Proposed In-Scope User-Facing Functions`, `Operational Capabilities Required For MVP`, `Proposed Out-of-Scope Functions`, and `Explicitly Deferred To Later Phases` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md) | Taken together, these sections define the MVP boundary and the non-MVP list in a way that can be reviewed item by item. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                  | Primary evidence section                                                                                                                                                 | Why this is the evidence                                                                                                                   | Review state              |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `初回対象ページがページ名付きで定義されている`                  | `Proposed In-Scope Pages` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                      | The section explicitly names Home, Overview, and Guidance and describes the role of each page.                                             | Accepted for final review |
| `初回対象機能が利用者視点で箇条書き化されている`                | `Proposed In-Scope User-Facing Functions` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                      | The section states the initial visitor actions and outcomes in user-facing language rather than implementation detail.                     | Accepted for final review |
| `非対象機能が明示的な除外一覧として整理されている`              | `Proposed Out-of-Scope Functions` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                              | The section is an explicit non-MVP exclusion list for the first release.                                                                   | Accepted for final review |
| `後続フェーズへ送る項目が理由付きで整理されている`              | `Explicitly Deferred To Later Phases` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                          | The section lists deferred items and explains why each belongs in a later phase instead of the first release.                              | Accepted for final review |
| `MVP の成立条件が 1 段落で説明できる`                           | `MVP Boundary` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md)                                                                                 | The section defines the single-paragraph acceptance boundary for what makes the MVP successful.                                            | Accepted for final review |
| `Issue 3 と Issue 4 の前提条件として参照可能な状態になっている` | `Decision Inputs Required`, `Current Coverage Notes For Issue 2`, and final `One-Page Summary` in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md) | These sections connect the MVP scope to the authentication and AWS architecture decisions while preserving a compact downstream reference. | Accepted for final review |

### Final Review Rule For Issue 2

- The presence of mapped evidence is not by itself enough to check the box.
- Final checkbox review should confirm that the mapped section still reflects the latest agreed wording.
- If a mapped section changes materially, the table should be rechecked before marking the checklist item complete.

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md).

| Checklist area                 | Final judgment | Evidence basis                                                                                                                                                        |
| ------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial pages                  | Satisfied      | `Proposed In-Scope Pages` defines the first-release page set as Home, Overview, and Guidance, with the role of each page stated explicitly.                           |
| Initial functions              | Satisfied      | `Proposed In-Scope User-Facing Functions` defines visitor-facing outcomes and keeps operational capabilities separate in `Operational Capabilities Required For MVP`. |
| Out-of-scope exclusions        | Satisfied      | `Proposed Out-of-Scope Functions` provides an explicit non-MVP exclusion list for the first release.                                                                  |
| Deferred items with reasons    | Satisfied      | `Explicitly Deferred To Later Phases` lists later-phase items and explains why each is deferred.                                                                      |
| MVP boundary                   | Satisfied      | `MVP Boundary` explains the success condition in one paragraph using public access, purpose understanding, navigation, and next-action reachability.                  |
| Downstream reference readiness | Satisfied      | `Decision Inputs Required`, `Current Coverage Notes For Issue 2`, and the final `One-Page Summary` make the scope reusable as input for Issue 3 and Issue 4.          |

## Current Status

- [docs/portal/04_MVP_SCOPE_DRAFT.md](docs/portal/04_MVP_SCOPE_DRAFT.md) に候補材料はある
- Guidance page 必須、機能分離、login と backend workflow の後続送りは合意済み
- deferred items の理由付けと Issue 7 の位置付けは文書上で補強済み
- Evidence Mapping Table を追加し、各 checkbox の候補根拠を対応付けた
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- GitHub Issue は open のまま再確認できる状態にしているため、close は明示的な最終判断で実施する

## Dependencies

- Issue 1
