## Summary

公開サイトとして始めるのか、ログイン付きポータルとして始めるのかで AWS 構成が大きく変わる。

## Goal

認証ありか認証なしかを決定し、保護対象範囲を確定する。

## Tasks

- [x] 公開ページと保護ページを整理する
- [x] 利用者種別を整理する
- [x] ログイン必須導線を整理する
- [x] 認証ありか認証なしかを決定する
- [x] 決定理由を文書化する

## Definition of Done

- [x] 初回リリースは認証なしで開始するかどうかが明示的に決定されている
- [x] 公開対象ページがページ単位で整理されている
- [x] 保護対象が存在しない、または存在する場合は対象範囲が明記されている
- [x] 一次利用者と運用者の区別が認証方針に接続して説明されている
- [x] Cognito などの認証基盤の要否が AWS 構成判断に使える形で整理されている
- [x] 認証再検討のトリガー条件が列挙されている

## Evidence To Fill Before Checking

- public scope と protected scope の切り分けが本当に漏れなく書けているかを確認する
- end-user authentication を外す理由が MVP, AWS complexity, operations の観点で十分に説明できているかを確認する
- Cognito 非採用が一時的判断なのか、現段階の明確な決定なのかを合意する
- auth を再検討する trigger が実際の要件変化に対応できる粒度かを確認する
- 各 checkbox に対して、どの節のどの記述が根拠かを合意してからチェックする

## Discussion Outcome So Far

- 初回リリースは認証なしの public portal とする
- portal 内に end-user 向け protected page は設けない
- 初回の公開ページは Home、Overview、Guidance とする
- FAQ と News / Updates は初回 MVP には含めず、公開後に必要性を再評価する
- 運用上の保護は portal 内ログインではなく、repository、deployment workflow、cloud access controls で担保する
- Cognito は初回リリース baseline では採用しない
- 認証再検討の主トリガーは、特定ユーザーだけに見せる情報が必要になった場合と、会員機能またはセルフサービスが必要になった場合とする

## Resolution

- 決定文書は [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) とする
- Issue 3 の checkbox review は下記の根拠対応表を使って最終確認する

## Evidence Mapping

| Checklist item                                                          | Primary evidence in draft                                                                                                                                                                           | Review note                                                                              |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `公開ページと保護ページを整理する`                                      | `Public Scope In The First Release` and `Protected Scope In The First Release` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                    | Home / Overview / Guidance を public scope とし、portal 内 protected area なしを確認する |
| `利用者種別を整理する`                                                  | `User Model Connection To This Decision` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                          | external visitor と operator role の違いが認証判断に接続されているかを見る               |
| `ログイン必須導線を整理する`                                            | `Protected Scope In The First Release` and `Confirmed Working Answers` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                            | 初回リリースに login-required route が存在しないことを確認する                           |
| `認証ありか認証なしかを決定する`                                        | `Working Recommendation` and `Decision Statement` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                 | first release は end-user authentication なしで開始すると読めることを確認する            |
| `決定理由を文書化する`                                                  | `Why This Direction Fits The Current Plan`, `AWS Impact Of The Current Recommendation`, and `Risks And Tradeoffs` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) | MVP, AWS complexity, operations, rework risk が説明されているかを見る                    |
| `初回リリースは認証なしで開始するかどうかが明示的に決定されている`      | `Decision Statement` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                                              | 曖昧な推奨ではなく first release の決定として読めるかを確認する                          |
| `公開対象ページがページ単位で整理されている`                            | `Public Scope In The First Release` and `Confirmed Working Answers` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                               | page-level の列挙が Home / Overview / Guidance で固定されているかを見る                  |
| `保護対象が存在しない、または存在する場合は対象範囲が明記されている`    | `Protected Scope In The First Release` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                            | end-user protected scope なし、運用保護は portal 外であることを確認する                  |
| `一次利用者と運用者の区別が認証方針に接続して説明されている`            | `User Model Connection To This Decision` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                          | visitor journey に login が不要で、operator protection は別経路で担保することを確認する  |
| `Cognito などの認証基盤の要否が AWS 構成判断に使える形で整理されている` | `AWS Impact Of The Current Recommendation` and `Downstream Implication` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                           | Cognito 非採用が Issue 4 の baseline 判断に接続できるかを見る                            |
| `認証再検討のトリガー条件が列挙されている`                              | `Triggers That Would Reopen This Decision` in [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md)                                                                        | protected information と member function の trigger が十分かを確認する                   |

## Current Status

- [docs/portal/05_AUTH_DECISION_DRAFT.md](docs/portal/05_AUTH_DECISION_DRAFT.md) を決定文書として更新済み
- 議論結果と checkbox 根拠の対応付けをこの local issue file に追加済み
- 上記対応表に対する final checkbox review を完了し、Tasks と Definition of Done は満了と判断する

## Dependencies

- Issue 1
- Issue 2
