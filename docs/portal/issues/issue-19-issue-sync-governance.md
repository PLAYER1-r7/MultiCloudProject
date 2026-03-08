## Summary

checklist 駆動の GitHub Issue を安全に運用するには、ローカル issue ファイルを正本として扱い、close 前の同期手順を明文化する必要がある。

## Goal

portal 作業における Issue 本文同期と close 手順の運用ルールを文書化する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-19
- タイトル: checklist-driven Issue の同期と close 手順を標準化する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal docs / agent docs
- 対象環境: repository workflow
- 優先度: 中
- 先行条件: none

目的
- 解決する問題: checklist を含む Issue を close する際に、GitHub 側の本文とローカル issue ファイルがずれると、完了判定と監査経路が不整合になる
- 期待する価値: ローカル正本、GitHub 同期、close 前確認の順序を文書化することで、今後の Issue 作成・更新・close を再現可能な手順に固定できる

スコープ
- 含むもの: GitHub Issue workflow の明文化、start guide の追記、repo README の補足、agent docset の同期ルール補強
- 含まないもの: GitHub Actions 実装変更、既存 Issue の再レビュー、issue コメント運用の全面刷新
- 編集可能パス: README.md, docs/portal/01_AWS_PORTAL_START_GUIDE.md, docs/portal/02_GITHUB_ISSUE_WORKFLOW.md, docs_agent/09_DOCSET_SYNC_RULES.md, docs_agent_ja/09_DOCSET_SYNC_RULES.md, docs/portal/issues/issue-19-issue-sync-governance.md
- 制限パス: apps/, infra/, closed issue implementation records

受け入れ条件
- [ ] 条件 1: ローカル issue ファイルが canonical source であることが portal workflow 文書に明記されている
- [ ] 条件 2: checklist-driven Issue の close 前に GitHub body sync を行う手順が文書化されている
- [ ] 条件 3: agent 向け docset に human re-agreement と close approval を混同しないルールが追記されている

実装計画
- 変更見込みファイル: README.md, docs/portal/01_AWS_PORTAL_START_GUIDE.md, docs/portal/02_GITHUB_ISSUE_WORKFLOW.md, docs_agent/09_DOCSET_SYNC_RULES.md, docs_agent_ja/09_DOCSET_SYNC_RULES.md, docs/portal/issues/issue-19-issue-sync-governance.md
- アプローチ: recent issue close flow で確立した実運用を README、portal docs、agent docs に分散反映し、close sequence を repository standard として残す
- 採用しなかった代替案と理由: close 手順を agent docs のみに閉じる案は、repository user が portal docs だけ読んだ場合に再現できないため採らない

検証計画
- 実行するテスト: read-through review of updated docs; get_errors on edited markdown files
- 確認するログ/メトリクス: wording consistency across README, portal docs, and agent docs; command examples for gh issue edit/close
- 失敗時の切り分け経路: docs/portal/02_GITHUB_ISSUE_WORKFLOW.md を canonical workflow として見直し、README と docset 側の文言差分を是正する

リスクとロールバック
- 主なリスク: close 手順だけを強く書きすぎて issue creation/update 手順とのつながりが見えにくくなること
- 影響範囲: repository collaboration flow, future issue close operations, docset guidance
- 緩和策: create/update/close の流れの中に同期ルールを位置付け、agent docs では close approval distinction を明記する
- ロールバック手順: 文言が過剰または重複した場合は docs/portal/02_GITHUB_ISSUE_WORKFLOW.md を主、他文書を補足に戻す
```

## Tasks

- [x] README に close 前同期ルールを追加する
- [x] start guide に checklist-driven Issue の close 条件を追加する
- [x] GitHub Issue workflow 文書に canonical source と close sequence を追加する
- [x] agent docset に human re-agreement と close approval の区別を追加する
- [x] 英語版と日本語版の docset 同期ルールを揃える
- [x] issue 記録として本タスクの判断根拠を残す

## Definition of Done

- [x] repository README に Issue close 前の同期ルールが記載されている
- [x] portal workflow 文書だけ読んでも close sequence を再現できる
- [x] agent docset が close approval と再合意コメントの違いを説明している
- [x] 英語版と日本語版の docset が同じ運用ルールを表している
- [x] 今後の checklist-driven Issue close に使える具体例が少なくとも 1 つ含まれている
- [x] 本 issue ファイルが更新対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [README.md](README.md) には Start Here セクションの補足として、checklist issue を close する前にローカル issue ファイルから GitHub Issue 本文を同期し、GitHub 上の checklist state を確認するルールを追加した
- [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md) の Working Rules には checklist-driven Issue close の前提条件を追加し、実行順ドキュメント側でも同じ guardrail を読めるようにした
- [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) では local issue file を source of truth と定義し、`gh issue edit --body-file ...` を使う update path と、checklist sync 後に close する 6-step sequence を追加した
- [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md) と [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) には、human re-agreement comment が concise record であり close approval ではないことを明記するルールを追記した

## Current Review Notes

- repository README、portal start guide、portal issue workflow の 3 層に同じ close guardrail を配置し、agent docs のみを読まない利用者にも運用ルールが届く構成にした
- close sequence は create/update flow の後続として [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) に配置し、issue creation/update guidance と切り離されないようにした
- human re-agreement と close approval の区別は英語版・日本語版 docset の両方で同じ位置に追記し、language drift を防いでいる

## Process Review Notes

- Issue 19 は repository-facing docs と agent-facing docs の両方に運用ルールを追加し、local issue record、spot check、evidence mapping、final review result の順で close 判断に必要な記録を揃えた。
- final checkbox review は [README.md](README.md)、[docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md)、[docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md)、[docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md)、[docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) を根拠に完了している。
- 承認形式: 連続処理一括承認。
- 一括承認根拠: ユーザー発言「１をお願いします。」および Issue 19 の review-ready 化に向けた連続指示（2026-03-08 セッション）
- Issue 19 close 実行承認: ユーザー発言「Closeに向けて続けてください。」（2026-03-08 セッション）

## Spot Check Evidence

Issue 19 の final review 前に、運用ルール文書が想定どおり揃っているかを spot check した結果を残す。

- repository entrypoint: [README.md](README.md) の Start Here に close 前同期ルールが追加されており、repo 直下から同ルールへ到達できる
- start guide rule: [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md) の Working Rules に checklist-driven Issue close 条件が追加されている
- canonical workflow update: [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) は local issue file を source of truth とし、`gh issue edit --body-file ...` の更新手順と close sequence を記載している
- workflow example coverage: [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) には `gh issue edit`、`gh issue view`、`gh issue close` を含む具体例があり、DoD の example requirement を満たしている
- docset sync alignment: [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md) と [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) には human re-agreement comment の扱いについて対応するルールが存在する
- diagnostics: [README.md](README.md)、[docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md)、[docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md)、[docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md)、[docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 19 final review, the local issue record is the primary evidence source. [README.md](README.md), [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md), and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) provide the repository-facing workflow evidence, while [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md) and [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) provide the agent-facing sync rule evidence.

### Task Mapping

| Checklist item                                                               | Primary evidence section                                                                                                                                                                                                            | Why this is the evidence                                                                                                | Review state              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `README に close 前同期ルールを追加する`                                     | `Implementation Notes`, `Spot Check Evidence`, and [README.md](README.md)                                                                                                                                                           | These sources show the repository root guidance now includes the checklist close sync rule.                             | Accepted for final review |
| `start guide に checklist-driven Issue の close 条件を追加する`              | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md)                                                                                             | These sources show the operational start guide now carries the same close guardrail.                                    | Accepted for final review |
| `GitHub Issue workflow 文書に canonical source と close sequence を追加する` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md)                                                                       | These sources show the source-of-truth wording, sync command, and explicit close sequence.                              | Accepted for final review |
| `agent docset に human re-agreement と close approval の区別を追加する`      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md)                                                                                 | These sources show the explicit distinction for comment-based re-agreement versus close approval in the English docset. | Accepted for final review |
| `英語版と日本語版の docset 同期ルールを揃える`                               | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md), and [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) | These sources show the same rule was added in both language variants.                                                   | Accepted for final review |
| `issue 記録として本タスクの判断根拠を残す`                                   | `Implementation Notes`, `Spot Check Evidence`, `Evidence Mapping Table`, and [docs/portal/issues/issue-19-issue-sync-governance.md](docs/portal/issues/issue-19-issue-sync-governance.md)                                           | These sections capture the implementation scope, validation basis, and review mapping inside the issue record itself.   | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                    | Primary evidence section                                                                                                                                                                                                            | Why this is the evidence                                                                                    | Review state              |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------- |
| `repository README に Issue close 前の同期ルールが記載されている`                 | `Implementation Notes`, `Spot Check Evidence`, and [README.md](README.md)                                                                                                                                                           | These sources confirm the repository entrypoint now includes the close-before-sync rule.                    | Accepted for final review |
| `portal workflow 文書だけ読んでも close sequence を再現できる`                    | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md)                                                                       | These sources confirm the workflow doc contains the update command, verification step, and close sequence.  | Accepted for final review |
| `agent docset が close approval と再合意コメントの違いを説明している`             | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md)                                                                                 | These sources confirm the English docset states that re-agreement comments are records, not close approval. | Accepted for final review |
| `英語版と日本語版の docset が同じ運用ルールを表している`                          | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md), and [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) | These sources confirm the same rule exists in both language variants.                                       | Accepted for final review |
| `今後の checklist-driven Issue close に使える具体例が少なくとも 1 つ含まれている` | `Spot Check Evidence` and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md)                                                                                                                        | These sources confirm the issue workflow doc contains a concrete `gh issue edit`/`gh issue close` example.  | Accepted for final review |
| `本 issue ファイルが更新対象と検証方針を追跡できる状態になっている`               | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-19-issue-sync-governance.md](docs/portal/issues/issue-19-issue-sync-governance.md)                        | These sections keep the scope, validation path, and evidence mapping inside the issue record.               | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-19-issue-sync-governance.md](docs/portal/issues/issue-19-issue-sync-governance.md), with [README.md](README.md), [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md), and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) used as the primary repository-facing evidence. [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md) and [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) were used as supporting evidence for the human re-agreement versus close approval distinction. Explicit issue close approval is recorded in Process Review Notes.

| Checklist area                            | Final judgment | Evidence basis                                                                                                                                                                                                                                                              |
| ----------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository close rule visibility          | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [README.md](README.md) confirm the root entrypoint now tells operators to sync the GitHub body before closing checklist issues.                                                                                          |
| Start guide alignment                     | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [docs/portal/01_AWS_PORTAL_START_GUIDE.md](docs/portal/01_AWS_PORTAL_START_GUIDE.md) confirm the staging-first operating guide carries the same close guardrail.                                                         |
| Canonical workflow definition             | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) confirm the local file source-of-truth rule, sync command, verification step, and close sequence.             |
| Comment versus close approval distinction | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md) confirm re-agreement comments are recorded separately and not treated as close approval.                                |
| English/Japanese docset parity            | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, [docs_agent/09_DOCSET_SYNC_RULES.md](docs_agent/09_DOCSET_SYNC_RULES.md), and [docs_agent_ja/09_DOCSET_SYNC_RULES.md](docs_agent_ja/09_DOCSET_SYNC_RULES.md) confirm the same operational rule exists in both language sets. |
| Reusable close example coverage           | Satisfied      | `Spot Check Evidence` and [docs/portal/02_GITHUB_ISSUE_WORKFLOW.md](docs/portal/02_GITHUB_ISSUE_WORKFLOW.md) confirm the workflow doc contains a concrete example of syncing and closing a checklist-driven issue.                                                          |

## Current Status

- repository README、portal start guide、portal issue workflow、agent docset EN/JA に Issue 19 対応の運用ルール追加が入っている
- editor diagnostics は対象 5 ファイルで発生していない
- local issue record 上の Tasks、Definition of Done、evidence mapping、final review result は更新済みである
- Issue close 承認は Process Review Notes に記録済みであり、現時点では close 実行可能な状態として扱う

## Dependencies

- Issue 17
- Issue 18
