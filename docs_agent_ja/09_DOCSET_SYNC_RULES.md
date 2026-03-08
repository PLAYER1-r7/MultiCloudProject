# 文書セット同期ルール

## 目的

`docs_agent/` と `docs_agent_ja/` の構造を揃え、言語を切り替えても文書順、役割、意図が崩れないようにします。

## 正本

- エージェント向けの運用構造の基準は `docs_agent/` とします。
- `docs_agent_ja/` は同じ番号と同じ文書意図を保って追従します。
- 片方でリネームしたら、もう片方も同じ変更を行います。

## 必須同期ルール

- 両フォルダで同じ番号を使う
- 両フォルダで同じ文書数を保つ
- 言語差があっても章の役割を揃える
- テンプレートの入力項目は英日で1対1に対応させる
- 読書順が変わったら両方の `01_START_HERE.md` を更新する
- 片言語だけ更新した場合は、その差分を把握し、可能なら同一タスク内で解消する
- ローカルの Issue 定義文書を GitHub Issue または PR 本文の正本として使う場合は、可能な限り同一タスク内でリモート本文も同期する
- GitHub 上の内容を前提に外部レビューを依頼する前に、レビュー対象を commit と push で公開するか、ローカルのみの草案に対するレビューであることを明示する
- レビュー是正でローカル根拠文書を更新する場合は、その是正範囲専用のタスク契約または Execution Record を作成する
- 契約の詳細がすべて固まる前に作業を始める場合でも、契約を省略せず、英日両方で最小着手版を使い未確定項目を `TBD` と明示する
- checklist、status セクション、リモート Issue 状態の完了表現を揃える
- ローカル根拠文書内のレビュー状態セクションも揃える。Current Draft Focus、Final Review Result、Current Status のような節が異なる段階を指してはならない
- 新しい Final Review Result、完了表現、または同等の最終状態文言を含むリモート Issue または PR 本文は、その文言を含む commit と push が公開済みになるまで同期してはならない
- レビュー是正後に人間の再合意を得た場合は、agent validation と分けて記録し、Issue close 承認として扱ってはならない
- 人間の再合意をコメントで記録する場合は、そのコメントが簡潔な記録であること、正式文言の正本は Issue または PR 本文の Resolution または同等セクションにあること、そして close 承認ではないことを明記する
- ローカル根拠文書が最後のリモート同期後に変わった場合は、close や同等の最終状態変更の前に、リモートの Issue または PR 本文を再同期する

## 推奨する構造化形式

| 用途                     | 推奨形式                                         | 理由                                 |
| ------------------------ | ------------------------------------------------ | ------------------------------------ |
| 文書間の振り分け         | Markdown 表                                      | エージェントが比較しやすい           |
| 固定された実行ループ     | Mermaid フローチャート + 近接した文章要約        | 順序を明示しつつテキストとして読める |
| 入出力項目               | Markdown 箇条書きまたは fenced text テンプレート | 項目名を英日で安定させやすい         |
| クラウド間、環境間の比較 | Markdown 表                                      | 行列参照の曖昧さが少ない             |

## 形式ルール

- 安定した対応関係、判断、比較には Markdown 表を優先する
- Mermaid は、近くに文章要約も置く単純な一方向フローだけに使う
- 画像だけの図や、空白幅に依存する複雑な ASCII 図は使わない
- 表や図を片言語に追加した場合は、もう片方にも同じ構造を追加する

## 固定する記入例配分

記入例ベースの引き継ぎを予測しやすくするため、英日で同じ題材配分を使います。

| 記入例トラック   | Issue  | アプリ                | 正式な workflow 名                                                 | reviewer 役名          | approval owner 役名          | 既定の対象文書                                                                           |
| ---------------- | ------ | --------------------- | ------------------------------------------------------------------ | ---------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml`, `deploy-exam-solver-gcp.yml`         | `exam-solver-reviewer` | `exam-solver-approval-owner` | `03`, `10`, `14`, `15`, `17`, `18`, `23`, `28`, `31`                                     |
| SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`, `deploy-sns-azure.yml`, `deploy-sns-gcp.yml` | `sns-reviewer`         | `sns-approval-owner`         | `05`, `08`, `11`, `16`, `19`, `20`, `21`, `22`, `24`, `25`, `26`, `27`, `29`, `30`, `32` |
| 共有ガバナンス系 | mixed  | `exam-solver` + `sns` | 文脈に合う workflow を使う                                         | `platform-reviewer`    | `platform-approval-owner`    | `12`, `13`                                                                               |

`reviewer` と `approval owner` の役割定義は `ROLE_HANDOFF_OWNERSHIP.md` にまとめます。この文書では役名の固定だけを扱い、役割説明は重複記載しません。

## 文書番号ごとの canonical example 一覧

1 文書単位で編集するときは、次の表をそのまま正本として使います。

| 文書番号 | 記入例トラック   | Issue  | アプリ                | 正式な workflow 名           | reviewer 役名          | approval owner 役名          | 優先順つき example field                                  |
| -------- | ---------------- | ------ | --------------------- | ---------------------------- | ---------------------- | ---------------------------- | --------------------------------------------------------- |
| `03`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) 依頼者 2) 期待する価値 3) 含むもの`                   |
| `05`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) 緩和策 2) ロールバック 3) レビュアーメモ`             |
| `08`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Evidence 3) Next action`                   |
| `10`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) 概要 2) うまくいったこと 3) 翌週アクション`           |
| `11`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) KPI 集計 2) 根本原因 3) 翌月計画`                     |
| `12`     | 共有ガバナンス系 | mixed  | `exam-solver` + `sns` | 文脈に応じた workflow        | `platform-reviewer`    | `platform-approval-owner`    | `1) KPI 集計 2) ガバナンス判断 3) 次四半期ロードマップ`   |
| `13`     | 共有ガバナンス系 | mixed  | `exam-solver` + `sns` | 文脈に応じた workflow        | `platform-reviewer`    | `platform-approval-owner`    | `1) 年間 KPI 2) 重大インシデントからの学び 3) 来年の計画` |
| `14`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `15`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `16`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `17`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `18`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `19`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `20`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `21`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `22`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-azure.yml`       | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `23`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-gcp.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `24`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-gcp.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `25`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `26`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `27`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `28`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `29`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `30`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `31`     | Exam-solver 系   | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |
| `32`     | SNS 系           | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`  |

## 記入例の命名ルール

- 対応する英語版と日本語版では、同じ issue 番号、reviewer 役名、approval owner 役名を使う
- 片言語で workflow 名を書く場合は、もう片方でも対応する workflow 名を書く
- reviewer や approval owner は、既存の記入例項目に埋め込む。言語片側だけの専用項目は増やさない
- 役割の責務や handoff 境界を確認したい場合は、この文書へ追記せず `ROLE_HANDOFF_OWNERSHIP.md` を参照する

## 変更手順

1. 英語文書を編集または追加する
2. 日本語文書に同じ構造変更を反映する
3. 参照が変わったら両方の開始ファイルを更新する
4. 両フォルダの番号セットが一致しているか確認する

## 完了確認

- [ ] 番号が一致している
- [ ] 文書数が一致している
- [ ] 読書順が一致している
- [ ] 章構成が一致している
- [ ] 文書意図が一致している

```bash
# 両フォルダに同じファイル集合があることを確認
diff <(ls docs_agent/ | sort) <(ls docs_agent_ja/ | sort)
```

期待結果: 差分出力がないこと。
