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

- [ ] README に close 前同期ルールを追加する
- [ ] start guide に checklist-driven Issue の close 条件を追加する
- [ ] GitHub Issue workflow 文書に canonical source と close sequence を追加する
- [ ] agent docset に human re-agreement と close approval の区別を追加する
- [ ] 英語版と日本語版の docset 同期ルールを揃える
- [ ] issue 記録として本タスクの判断根拠を残す

## Definition of Done

- [ ] repository README に Issue close 前の同期ルールが記載されている
- [ ] portal workflow 文書だけ読んでも close sequence を再現できる
- [ ] agent docset が close approval と再合意コメントの違いを説明している
- [ ] 英語版と日本語版の docset が同じ運用ルールを表している
- [ ] 今後の checklist-driven Issue close に使える具体例が少なくとも 1 つ含まれている
- [ ] 本 issue ファイルが更新対象と検証方針を追跡できる状態になっている

## Current Draft Focus

- recent issue close flow で得た learnings を repository standard に変換する
- GitHub Issue 本文の同期を comment や ad-hoc web edit より優先する運用に揃える
- close approval と review 再合意を別イベントとして扱うルールを agent docs に残す

## Dependencies

- Issue 17
- Issue 18
