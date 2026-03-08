## Summary

MVP をどの AWS 構成で支えるかを早期に絞り込む必要がある。

## Goal

AWS 上での最小構成を 1 案に決定し、採用理由を説明可能にする。

## Tasks

- [x] S3 の要否を判定する
- [x] CloudFront の要否を判定する
- [x] Route 53 の要否を判定する
- [x] ACM の要否を判定する
- [x] Cognito の要否を判定する
- [x] API Gateway の要否を判定する
- [x] Lambda の要否を判定する
- [x] DynamoDB の要否を判定する
- [x] 初期構成図を作成する
- [x] 採用理由を文書化する

## Definition of Done

- [x] 初期 AWS 構成が 1 案に絞られ、主要リクエスト経路が説明できる
- [x] 採用サービスと不採用サービスが理由付きで整理されている
- [x] S3、CloudFront、ACM、Route 53 の要否が個別に判断されている
- [x] Cognito、API Gateway、Lambda、DynamoDB を現時点で採用しない理由が整理されている
- [x] 構成図または同等の構成表現が存在する
- [x] MVP スコープと認証方針の前提に整合している

## Evidence To Fill Before Checking

- 各 AWS service の adopt or do not adopt 判断が、要件と運用前提から見て妥当かを確認する
- external DNS 前提と Route 53 非採用が、production operating model と矛盾しないかを確認する
- baseline request path が staging と production の両方で説明可能かを確認する
- architecture table と change triggers が将来拡張時の再判断条件として十分かを確認する
- 各 checkbox に対して、どの節のどの記述が根拠かを合意してからチェックする

## Discussion Outcome So Far

- 初回リリースの baseline architecture は S3、CloudFront、ACM を採用する
- baseline request path は User から CloudFront を経由して S3 に到達する構成とする
- staging の初期到達先は CloudFront default domain とし、custom domain は production entry criteria が揃った後に external DNS coordination で接続する
- Route 53 は current production operating model が external DNS 前提であるため、現時点の baseline では採用しない
- Cognito は Issue 3 の public-first auth decision に従い、現時点の baseline では採用しない
- API Gateway、Lambda、DynamoDB は dynamic workflow、server-side logic、persistent user data の validated requirement が出るまで採用しない
- guidance / contact 導線は static-first content として扱い、初回リリースで API や server-side processing を前提にしない
- ACM は CloudFront custom domain path に必要な service として採用するが、certificate ownership や cutover approval の最終責任者は production design gate で別途確定する
- public entry model は CloudFront 経由に統一し、S3 website endpoint を primary public entry にしない

## Resolution

- 決定文書は [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) とする
- Issue 4 の checkbox review は下記の根拠対応表を使って最終確認する

## Evidence Mapping

| Checklist item                                                                    | Primary evidence in draft                                                                                                                                                                                      | Review note                                                                                         |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `S3 の要否を判定する`                                                             | `Working Recommendation` and `Service Decision Table` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                  | static asset hosting の baseline service として adopt が明示されていることを確認する                |
| `CloudFront の要否を判定する`                                                     | `Working Recommendation`, `Recommended Baseline Architecture`, and `Service Decision Table` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                            | public entry、HTTPS、staging access path の中心 service として adopt が明示されていることを確認する |
| `Route 53 の要否を判定する`                                                       | `Service Decision Table` and `Working Answers To The Current Architecture Questions` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                   | external DNS operating model を理由に baseline 非採用が説明されていることを確認する                 |
| `ACM の要否を判定する`                                                            | `Working Recommendation`, `Service Decision Table`, and `Working Answers To The Current Architecture Questions` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)        | custom domain path に必要な service として adopt が説明されていることを確認する                     |
| `Cognito の要否を判定する`                                                        | `Service Decision Table` and `Decision Statement` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                      | Issue 3 の public-first auth decision に接続して baseline 非採用が読めることを確認する              |
| `API Gateway の要否を判定する`                                                    | `Service Decision Table`, `Working Answers To The Current Architecture Questions`, and `Change Triggers` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)               | validated API requirement が出るまで adopt しない判断が説明されていることを確認する                 |
| `Lambda の要否を判定する`                                                         | `Service Decision Table`, `Working Answers To The Current Architecture Questions`, and `Change Triggers` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)               | server-side processing requirement が出るまで adopt しない判断が説明されていることを確認する        |
| `DynamoDB の要否を判定する`                                                       | `Service Decision Table` and `Change Triggers` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                         | persistent user or app data requirement が出るまで adopt しない判断が説明されていることを確認する   |
| `初期構成図を作成する`                                                            | `Recommended Baseline Architecture` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                                    | request path を説明できる最小構成図が存在することを確認する                                         |
| `採用理由を文書化する`                                                            | `Why This Fits The Current Plan`, `What This Architecture Supports`, and `What This Architecture Does Not Yet Support` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) | adopt / do not adopt の背景が MVP、運用、拡張余地の観点で読めることを確認する                       |
| `初期 AWS 構成が 1 案に絞られ、主要リクエスト経路が説明できる`                    | `Recommended Baseline Architecture` and `Decision Statement` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                           | S3 + CloudFront + ACM の 1 案に絞られ、User から S3 までの経路が説明できることを確認する            |
| `採用サービスと不採用サービスが理由付きで整理されている`                          | `Service Decision Table` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                                               | 全 service に adopt / do not adopt と理由が付いていることを確認する                                 |
| `S3、CloudFront、ACM、Route 53 の要否が個別に判断されている`                      | `Service Decision Table` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                                               | 4 service が個別判断になっていることを確認する                                                      |
| `Cognito、API Gateway、Lambda、DynamoDB を現時点で採用しない理由が整理されている` | `Service Decision Table`, `Working Answers To The Current Architecture Questions`, and `Change Triggers` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)               | 非採用理由が current requirement と再検討条件に接続されていることを確認する                         |
| `構成図または同等の構成表現が存在する`                                            | `Recommended Baseline Architecture` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                                                                    | 図形式の表現が存在することを確認する                                                                |
| `MVP スコープと認証方針の前提に整合している`                                      | `Why This Fits The Current Plan`, `Decision Statement`, and `Downstream Implication` in [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md)                                   | Issue 2 の static-first MVP と Issue 3 の public-first auth decision に整合することを確認する       |

## Current Status

- [docs/portal/06_AWS_ARCHITECTURE_DRAFT.md](docs/portal/06_AWS_ARCHITECTURE_DRAFT.md) を決定文書として更新済み
- 議論結果と checkbox 根拠の対応付けをこの local issue file に追加済み
- 上記対応表に対する final checkbox review を完了し、Tasks と Definition of Done は満了と判断する

## Dependencies

- Issue 2
- Issue 3
