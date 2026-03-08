## Summary

closed 済み issue の周辺文書に open 状態を前提にした文言や表記ゆれが残ると、監査経路と downstream reference の読み取りがぶれる。

## Goal

closed issue records と supporting docs の状態表記を現行状態に揃え、review table の可読性を整える。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-21
- タイトル: closed issue records の状態表記と review tables を整える
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal docs
- 対象環境: repository documentation
- 優先度: 中
- 先行条件: Issue 1 closed, Issue 12 closed, Issue 20 closed

目的
- 解決する問題: closed 済み issue の周辺文書に open 前提の文言や review table の読みにくさが残ると、完了済み判断と根拠参照が不安定になる
- 期待する価値: closed issue records と supporting docs を現行状態へ揃えることで、後続 issue が参照する evidence baseline を安定させる

スコープ
- 含むもの: Issue 1 関連文言の close 後整合、Issue 12 review table の可読性整理、closed issue state wording の是正
- 含まないもの: Issue 1 / 12 の結論変更、未完了 issue の再レビュー、新しい policy 決定の追加
- 編集可能パス: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/issues/issue-01-product-definition.md, docs/portal/issues/issue-12-monitoring-policy.md, docs/portal/issues/issue-21-closed-issue-record-cleanup.md
- 制限パス: apps/, infra/, closed issue 以外の implementation records

受け入れ条件
- [ ] 条件 1: Issue 1 関連文書が closed 済み状態に合う文言へ更新されている
- [ ] 条件 2: Issue 12 の review table が意味変更なしに読みやすい表記へ整形されている
- [ ] 条件 3: local issue record で変更対象、根拠、review 方針を追跡できる

実装計画
- 変更見込みファイル: docs/portal/03_PRODUCT_DEFINITION_DRAFT.md, docs/portal/issues/issue-01-product-definition.md, docs/portal/issues/issue-12-monitoring-policy.md, docs/portal/issues/issue-21-closed-issue-record-cleanup.md
- アプローチ: close 済み issue の周辺文書に残る open 前提表現を実際の完了状態へ合わせ、Issue 12 は review table の幅と整列のみを調整して意味変更を避ける
- 採用しなかった代替案と理由: formatting-only changes と wording updates を分離する案は、いずれも closed issue record cleanup という単一目的に対して分割コストが高いため採らない

検証計画
- 実行するテスト: read-through review of edited docs; get_errors on edited markdown files
- 確認するログ/メトリクス: wording consistency between Issue 1 supporting doc and issue record; no semantic drift in Issue 12 review tables
- 失敗時の切り分け経路: Issue 1 は docs/portal/03_PRODUCT_DEFINITION_DRAFT.md を primary evidence として照合し、Issue 12 は table formatting が内容変更を含んでいないか diff で見直す

リスクとロールバック
- 主なリスク: cleanup の範囲で意味変更まで混入し、closed issue の確定内容を意図せず書き換えること
- 影響範囲: downstream issue references, issue audit trail, documentation readability
- 緩和策: wording updates は closed state への整合に限定し、Issue 12 は formatting-only の確認を明示する
- ロールバック手順: semantic drift が見つかった場合は cleanup 変更を戻し、closed issue record の最終確定文言に合わせて最小差分で再編集する
```

## Tasks

- [ ] Issue 1 supporting doc の close 後文言を整える
- [ ] Issue 1 issue record の current status を closed 状態に揃える
- [ ] Issue 12 review tables を意味変更なしに整形する
- [ ] cleanup 対象と非対象を issue 記録に残す
- [ ] closed issue records の参照根拠を明示する
- [ ] final review に使う確認観点を issue 記録へ残す

## Definition of Done

- [ ] Issue 1 関連文書が closed 済み状態として読める
- [ ] Issue 12 の table 整形が意味変更を含んでいない
- [ ] cleanup 対象外のファイルがスコープから除外されている
- [ ] local issue record が evidence source を示している
- [ ] final review で使う確認観点が issue 記録に残っている
- [ ] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Current Draft Focus

- closed issue record cleanup を意味変更ではなく state alignment と readability improvement に限定する
- Issue 1 の supporting doc と issue record が closed 済み状態を同じ言い方で示すように揃える
- Issue 12 の review tables は semantic drift を入れずに可読性だけを改善する

## Dependencies

- Issue 1
- Issue 12
- Issue 20