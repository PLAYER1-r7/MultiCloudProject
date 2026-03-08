## Summary

portal を AWS 上で公開するには、静的配信と HTTPS を担う最小の delivery 基盤を実装する必要がある。

## Goal

S3、CloudFront、ACM を中心とした初期 AWS 静的配信基盤を実装する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-17
- タイトル: AWS 静的配信基盤を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first
- 優先度: 高

目的
- 解決する問題: frontend build artifact を受け取り、HTTPS 付きの static delivery path へ載せる IaC 基盤がないと、Issue 18 の staging deploy workflow が接続できない
- 期待する価値: staging entrypoint と reusable module を通じて、S3、CloudFront、ACM 前提の最小 AWS static delivery foundation を code-first に管理できる

スコープ
- 含むもの: staging OpenTofu entrypoint、portal-static-site module、S3 bucket、CloudFront distribution、certificate integration point、environment outputs、baseline delivery control、issue 実装記録
- 含まないもの: production wiring、external DNS cutover、本番証明書発行運用、application deploy workflow、monitoring/alert integration
- 編集可能パス: infra/, docs/portal/issues/issue-17-aws-delivery-foundation.md
- 制限パス: apps/, .github/workflows/

受け入れ条件
- [ ] 条件 1: staging を想定した S3 + CloudFront の静的配信基盤が IaC として存在し、frontend build artifact の受け渡し先を説明できる
- [ ] 条件 2: HTTPS と baseline delivery control の適用箇所が module レベルで整理されている

実装計画
- 変更見込みファイル: infra/modules/portal-static-site/*, infra/environments/staging/*, docs/portal/issues/issue-17-aws-delivery-foundation.md
- アプローチ: staging-first の reusable module 構成を維持しつつ、CloudFront response headers policy を module に含め、environment README と outputs で deploy workflow 接続点を明確にする
- 採用しなかった代替案と理由: environment ごとに直接 resource を書く案は、Issue 9 の reusable module 方針と矛盾し、後続 production entrypoint でも重複が増えるため採らない

検証計画
- 実行するテスト: cd infra/environments/staging && tofu fmt -check && tofu validate
- 確認するログ/メトリクス: OpenTofu validate 結果、module output、staging README の handoff 記述
- 失敗時の切り分け経路: infra/modules/portal-static-site/main.tf、infra/environments/staging/main.tf、docs/portal/11_IAC_POLICY_DRAFT.md を見直し、module wiring、provider requirement、delivery control のどこで崩れているかを分離する

リスクとロールバック
- 主なリスク: staging foundation の段階で production-specific decision を入れ込みすぎて、external DNS や state locking の未決事項と衝突すること
- 影響範囲: staging deploy、future production entrypoint、certificate handling、artifact handoff
- 緩和策: custom alias と ACM ARN は optional のままに保ち、default CloudFront certificate で staging path を成立させる
- ロールバック手順: delivery control や certificate integration が過剰と判明した場合は、S3 + CloudFront + optional ACM の最小構成へ戻し、extra behavior は follow-on issue に分離する
```

## Tasks

- [x] portal 配信基盤の IaC 雛形を作成する
- [x] static asset 配信先を定義する
- [x] CloudFront 配信設定を定義する
- [x] HTTPS 証明書と関連設定を定義する
- [x] 環境差分と出力値の扱いを整理する
- [x] 初期セキュリティヘッダまたは配信制御の適用箇所を整理する

## Definition of Done

- [x] 初期 AWS 静的配信基盤の実装ファイルが存在する
- [x] staging を想定した最低限の配信経路が定義されている
- [x] HTTPS 配信に必要な設定方針が実装へ反映されている
- [x] 環境ごとの差分管理と出力値の扱いが実装単位で整理されている
- [x] フロントエンド build artifact を受け取る前提条件が説明できる
- [x] 後続の deploy workflow 実装に渡せる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- reusable module として `infra/modules/portal-static-site` が存在し、S3 bucket、CloudFront distribution、Origin Access Control を管理している
- staging entrypoint は `infra/environments/staging` に分離され、backend、provider、locals、variables、outputs を environment 単位で持つ
- custom alias と ACM certificate ARN は optional とし、staging は default CloudFront certificate でも成立する
- baseline delivery control として CloudFront response headers policy を module に追加し、HTTPS redirect と合わせて初期 security header 適用箇所を固定した

## Current Review Notes

- Issue 17 の責務は production cutover ではなく staging-first の delivery foundation なので、external DNS と custom domain は integration point の記録に留める
- frontend build artifact handoff は Issue 18 実装対象だが、Issue 17 側で bucket output と distribution output の接続点を説明できる必要がある
- security header は full edge hardening ではなく baseline control として扱い、後続 issue で追加 behavior を足せる形に保つ

## Spot Check Evidence

Issue 17 の final review 前に、実装済み AWS delivery foundation が最低限の成立条件を満たしているかを spot check した結果を残す。

- tofu validation: `cd infra/environments/staging && tofu fmt -check && tofu validate` は 2026-03-08 セッションで成功し、staging entrypoint と reusable module の構成が OpenTofu 上で妥当であることを確認した
- static delivery foundation: [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) には private S3 bucket、bucket versioning、public access block、CloudFront distribution、Origin Access Control、bucket policy が実装されており、static asset 配信基盤の最小構成を満たしている
- HTTPS and certificate posture: [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf) と [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) では `acm_certificate_arn` を optional としつつ、未指定時は default CloudFront certificate を使う分岐を持ち、staging-first の HTTPS integration point を保っている
- delivery control: [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) では `viewer_protocol_policy = "redirect-to-https"` と response headers policy を設定し、content type、frame、referrer、HSTS の baseline delivery control を module レベルで固定している
- environment outputs and handoff: [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf) は `site_bucket_name`、`distribution_id`、`distribution_domain_name` を公開し、[infra/environments/staging/README.md](infra/environments/staging/README.md) は Issue 18 が参照する artifact sync と optional invalidation の handoff expectation を明示している
- diagnostics check: [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf)、[infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf)、[infra/modules/portal-static-site/outputs.tf](infra/modules/portal-static-site/outputs.tf)、[infra/environments/staging/main.tf](infra/environments/staging/main.tf)、[infra/environments/staging/variables.tf](infra/environments/staging/variables.tf)、[infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf)、[infra/environments/staging/README.md](infra/environments/staging/README.md) に editor diagnostics は出ていない

## Process Review Notes

- Issue 17 は AWS delivery foundation の実装記録、spot check、evidence mapping、final review result を段階的に追記し、close 判断前に root evidence と GitHub Issue 本文の同期状態を再確認した。
- final checkbox review は [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf)、[infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf)、[infra/modules/portal-static-site/outputs.tf](infra/modules/portal-static-site/outputs.tf)、[infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md)、[infra/environments/staging/main.tf](infra/environments/staging/main.tf)、[infra/environments/staging/variables.tf](infra/environments/staging/variables.tf)、[infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf)、[infra/environments/staging/README.md](infra/environments/staging/README.md) を根拠に完了している。
- 承認形式: (b) 連続処理一括承認。
- 一括承認根拠: ユーザー発言「Issue17に付いて合意が取れたので内容に問題がないか確認してください。」（2026-03-08 セッション）
- Issue 17 close 実行承認: ユーザー発言「CloudeSonnetとのレビューで問題ないことを確認したので、Closeに向けて作業を進めてください。」（2026-03-08 セッション）

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 17 final review, the local issue record is the primary evidence source. [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/modules/portal-static-site/outputs.tf](infra/modules/portal-static-site/outputs.tf), [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md), [infra/environments/staging/main.tf](infra/environments/staging/main.tf), [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md) are the primary implementation artifacts.

### Task Mapping

| Checklist item                                             | Primary evidence section                                                                                                                                                                                                                                                                            | Why this is the evidence                                                                                                               | Review state              |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `portal 配信基盤の IaC 雛形を作成する`                     | `Implementation Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/environments/staging/main.tf](infra/environments/staging/main.tf)                                                                                   | These sources show the reusable module and staging entrypoint that define the portal static delivery baseline in code.                 | Accepted for final review |
| `static asset 配信先を定義する`                            | `Implementation Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf)                                                                             | These sources show the S3 asset destination and the outputs that expose the delivery target to downstream workflows.                   | Accepted for final review |
| `CloudFront 配信設定を定義する`                            | `Implementation Notes`, `Spot Check Evidence`, and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf)                                                                                                                                                             | These sources show the CloudFront distribution, cache behavior, HTTPS redirect, fallback responses, and OAC wiring.                    | Accepted for final review |
| `HTTPS 証明書と関連設定を定義する`                         | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf)                                     | These sources show the optional ACM integration point and the default CloudFront certificate fallback used for staging-first delivery. | Accepted for final review |
| `環境差分と出力値の扱いを整理する`                         | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md) | These sources show environment-scoped variables, outputs, naming rules, and handoff documentation for staging.                         | Accepted for final review |
| `初期セキュリティヘッダまたは配信制御の適用箇所を整理する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md)                                           | These sources show the baseline response headers policy and HTTPS delivery controls defined at the module layer.                       | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                 | Primary evidence section                                                                                                                                                                                                                                                                                                                                                                                      | Why this is the evidence                                                                                                                    | Review state              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `初期 AWS 静的配信基盤の実装ファイルが存在する`                | `Implementation Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/modules/portal-static-site/outputs.tf](infra/modules/portal-static-site/outputs.tf), and [infra/environments/staging/main.tf](infra/environments/staging/main.tf) | These sources confirm the delivery foundation exists in the repository as reusable module code plus a staging entrypoint.                   | Accepted for final review |
| `staging を想定した最低限の配信経路が定義されている`           | `Implementation Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/environments/staging/main.tf](infra/environments/staging/main.tf)                                                                                                                                                                                             | These sources confirm the S3 to CloudFront delivery path, OAC access pattern, and staging module wiring are defined.                        | Accepted for final review |
| `HTTPS 配信に必要な設定方針が実装へ反映されている`             | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf)                                                                                                                                               | These sources confirm HTTPS redirect behavior and the certificate-selection posture for staging delivery.                                   | Accepted for final review |
| `環境ごとの差分管理と出力値の扱いが実装単位で整理されている`   | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), [infra/environments/staging/locals.tf](infra/environments/staging/locals.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md)                             | These sources confirm environment-specific naming, variables, outputs, and operational notes are organized at the staging entrypoint layer. | Accepted for final review |
| `フロントエンド build artifact を受け取る前提条件が説明できる` | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md)                                                                                                                                                                                               | These sources confirm the bucket and distribution outputs plus the documented artifact sync and invalidation expectations for Issue 18.     | Accepted for final review |
| `後続の deploy workflow 実装に渡せる状態になっている`          | `Implementation Notes`, `Spot Check Evidence`, `Current Status`, [infra/environments/staging/README.md](infra/environments/staging/README.md), and [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf)                                                                                                                                                                             | These sources confirm the delivery foundation is ready to hand off bucket, distribution, and control expectations to Issue 18.              | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-17-aws-delivery-foundation.md](docs/portal/issues/issue-17-aws-delivery-foundation.md), with [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf), [infra/modules/portal-static-site/outputs.tf](infra/modules/portal-static-site/outputs.tf), [infra/environments/staging/main.tf](infra/environments/staging/main.tf), [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), and [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf) used as the primary implementation evidence. [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md) and [infra/environments/staging/README.md](infra/environments/staging/README.md) were used as supporting evidence for module responsibility and deploy handoff behavior. Explicit issue close approval is recorded in Process Review Notes.

| Checklist area                 | Final judgment | Evidence basis                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Delivery module presence       | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/environments/staging/main.tf](infra/environments/staging/main.tf) confirm the static delivery foundation exists as reusable module code wired into staging.                                                                                                                                                    |
| Static delivery path           | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf) confirm the S3, CloudFront, OAC, and fallback path required for staging delivery.                                                                                                                                                                                                                                      |
| HTTPS and certificate posture  | Satisfied      | `Current Review Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/modules/portal-static-site/variables.tf](infra/modules/portal-static-site/variables.tf) confirm HTTPS redirect and the staging-first certificate integration model.                                                                                                                                            |
| Environment outputs and naming | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [infra/environments/staging/variables.tf](infra/environments/staging/variables.tf), [infra/environments/staging/locals.tf](infra/environments/staging/locals.tf), [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm environment-specific naming and deploy-facing outputs are organized. |
| Delivery control baseline      | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [infra/modules/portal-static-site/main.tf](infra/modules/portal-static-site/main.tf), and [infra/modules/portal-static-site/README.md](infra/modules/portal-static-site/README.md) confirm the baseline response headers policy and HTTPS delivery controls.                                                                                                                            |
| Handoff to Issue 18            | Satisfied      | `Current Status`, `Spot Check Evidence`, [infra/environments/staging/outputs.tf](infra/environments/staging/outputs.tf), and [infra/environments/staging/README.md](infra/environments/staging/README.md) confirm that the staging delivery foundation exposes the handoff surface required by the deploy workflow.                                                                                                                                            |

## Current Status

- staging entrypoint と reusable module は配置済みで、portal static delivery foundation の code-first path を持つ
- S3、CloudFront、optional ACM integration point、environment outputs は実装済み
- response headers policy と artifact handoff expectation を加え、Issue 18 が参照する delivery 接続点を明確化した
- tofu fmt -check、tofu validate、implementation file review、README handoff review を根拠として final checkbox review を完了した
- Issue close 承認は Process Review Notes に記録済みであり、現時点では close 実行可能な状態として扱う

## Dependencies

- Issue 4
- Issue 9
- Issue 11
- Issue 15
- Issue 16
