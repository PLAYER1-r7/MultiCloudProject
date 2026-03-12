# 自律ワークフローチェックリスト

## 受領前ゲート（Pre-Task Gate）

前提 Issue がある場合、`gh issue view <N> --json state` が `"state": "CLOSED"` を返すことを確認してから、この受領を受け付ける。

- [ ] この作業に前提 Issue は存在しない、または `gh issue view <N> --json state` で前提 Issue の closed を確認した
- [ ] 前提 Issue の close 承認がまだ得られていない場合は、ここで停止して人間のレビューを要求した
- [ ] ユーザーが明示的なスコープなしに「残タスク」や「次タスク」を求めた場合は、全体プロジェクト前提にせず、直近の active task contract、issue chain、または current app context に係留した
- [ ] 曖昧な task-list 要求に対して、もっともらしいスコープ候補が複数ある場合は、inventory を広げる前にどのスコープかをユーザーへ確認した
- [ ] リポジトリ全体の残タスク一覧を出す前に、「project-wide」「リポジトリ全体」などの明示的な全体化指示があった
- [ ] 曖昧な task-list 要求への最初の応答で、エージェントがどのスコープで解釈しているかを明記した
- [ ] この受領が child issue または follow-up issue の提案を含む場合は、先に親 Issue の terminal condition を記載した
- [ ] この受領が child issue または follow-up issue の提案を含む場合は、新しい Issue が次のいずれかを少なくとも 1 つ追加することを確認した: 新しい証拠採取、新しい固定判断、新しい実行境界
- [ ] 提案中の Issue が、親スコープの packaging-only な言い換えや再記述ではないことを確認した
- [ ] 同じ chain で連続する 2 件の Issue が、新しい証拠、新しい固定判断、新しい実行境界のいずれも増やしていない場合は、分解を停止し、close を優先すべきか見直した
- [ ] 提案中の Issue が同じ chain の 4 件目になる場合は、受領前に明示的な人間確認を記録した

### 30秒 child issue チェック

提案中の child issue または follow-up issue を受け付ける前に、次の定型文をそのまま使う。

```text
30秒 child issue チェック

1. この Issue はどんな新しい証拠を追加するか？
2. この Issue はどんな新しい固定判断を追加するか？
3. この Issue はどんな新しい実行境界を追加するか？
4. 親 Issue の terminal condition は何か？
5. この Issue を作らなくても、現行 Issue 内解決または close で済ませられないか？

1-3 がすべて「なし」なら、その Issue は作成しない。
4 が未記載なら、そこで停止して terminal condition を先に書く。
5 が「はい」なら、新しい child issue より close または現行 Issue 内解決を優先する。
```

### 30秒 曖昧タスクリスト チェック

「残タスク」や「次タスク」のような曖昧な要求へ答える前に、次の定型文をそのまま使う。

```text
30秒 曖昧タスクリスト チェック

1. このチャットで最も狭い active scope は何か？
2. ユーザーが聞いているのは、その scope か、current app か、current issue chain か、プロジェクト全体か？
3. リポジトリ全体へ広げてよいと判断できる明示語は何か？
4. 明示語がない場合、現在の active scope の中だけで回答できないか？

2 が曖昧なら、列挙前に確認する。
3 が「なし」なら、全体プロジェクトへ拡張しない。
4 が「はい」なら、現在の active scope に限定して答え、その scope を明記する。
```

## 開始前

詰まった場合: 認証 -> `17_AUTH_REQUEST_PLAYBOOK.md`、コントラクトまたはスコープ -> `03_TASK_CONTRACT_TEMPLATE.md`、境界確認 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`。

- [ ] 対象アプリを宣言した
- [ ] 対象環境を宣言した
- [ ] タスク契約を完了した
- [ ] 詳細が未確定でも、最初の編集前に最小着手版の契約を書き、未確定項目を `TBD` と明示した
- [ ] レビュー是正または文書修正の作業である場合、その是正範囲専用のタスク契約がある
- [ ] スコープと受け入れ条件を固定した
- [ ] 必要な認証を確認した

## 実装中

詰まった場合: 境界違反 -> `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`、ハードストップ条件 -> `14_CRITICAL_GUARDRAILS_EXTRACT.md`。

- [ ] 変更が小さく巻き戻せる
- [ ] 無関係なパスに触れていない
- [ ] 残差分が意味変更と formatting-only cleanup に分かれる場合は、review または close の前に別スコープへ切り分けた
- [ ] 境界チェックがクリーンである
- [ ] ロールバック経路が維持されている

## Resolution 作成前

詰まった場合: 論点処理 -> `02_AUTONOMOUS_DEV_PROTOCOL.md` Step 2（契約）。

- [ ] Discussion Draft に論点テーブルがある場合、全行の `Resolution 確定文言` 列（英語表記なら `Resolution confirmed wording` 列）が埋まっており、3 列目が `Candidate wording for confirmation` のような draft-only 表現のまま残っていない
- [ ] 論点を逐次回答せずに直接決定した場合は、その事実を `direct-decision` と明記して Process Review Notes に記録した

## 引き継ぎ前

詰まった場合: テストゲート -> `32_TEST_EXECUTION_GATE.md`、DoD ゲート -> `04_DEFINITION_OF_DONE.md`、PR パッケージング -> `05_PR_TASK_CONTRACT_TEMPLATE.md`。

## PR作成前

- [ ] PR を作る前に、対象スコープの実装、必要テスト、関連ドキュメント更新、Issue 状態同期が完了していることを確認した
- [ ] PR の対象が close 済み chain の packaging-only な継続ではなく、完了済み active scope か fresh record 起点の follow-up であることを確認した
- [ ] AI 支援で PR を準備する場合は、stage 済みファイルが意図したスコープに限定され、無関係なローカル差分が除外されていることを確認した
- [ ] PR タイトル、本文、self-review メモを AI 支援で準備した場合は、最終提出または merge 前に人間がスコープ、検証証跡、merge リスクを確認する前提が PR 上で明示されており、実際に確認が得られていないのに確認済みとは記載していない
- [ ] スコープが曖昧、無関係な差分が混在、または merge 安全性が判断依存である場合は、自律的な PR 実行を止めて作成前に確認を求めた
- [ ] PR タイトルは何を完了または追加したかが一読で分かり、コード変更と docs 同期が混在する場合も曖昧な総称だけで済ませていない
- [ ] PR 本文は Summary、What Changed、Validation を最低限の固定セクションとして記載した
- [ ] What Changed では、実装変更、検証追加、Issue またはドキュメント同期を混同せず区別して記載した
- [ ] Validation では、実際に実行した確認だけを記載し、関連する確認を未実施ならその事実を明記した
- [ ] child issue を close した場合は、対応する parent baseline または summary 記録にも完了状態を反映した
- [ ] スコープに高レベル summary 文書がある場合は、実装チェーン完了後にその summary 側も更新した
- [ ] reviewer が重点的に見るべき差分を 2 から 3 点の具体的な review point に絞って記載した
- [ ] PR 本文の記述がローカル差分、Issue 状態、summary 文書の記述と矛盾していないことを確認した

- [ ] テスト結果を記録した
- [ ] DoD の必須ゲートを満たした
- [ ] Issue close または引き継ぎの流れに、無関係な未コミット変更を混ぜていない
- [ ] ローカルの根拠文書、リモートの Issue または PR 本文、status の記述が一致している
- [ ] 根拠文書内のレビュー状態セクションが揃っており、異なる段階を指していない
- [ ] 最後の review pass、承認やり取り、またはツール警告の後に根拠文書が変わっている可能性がある場合は、Process Review Notes、close 承認記録、その他の最終状態向け編集の前に現行ファイルを読み直した
- [ ] 外部レビュー対象が最新の公開状態であることを確認した、またはローカルのみの差分を明示した
- [ ] 新しい Final Review Result や同等の完了表現を含むリモート Issue または PR 本文を、対応する commit の公開前に更新していない
- [ ] 根拠文書が最後のリモート同期後に変わった場合は、close または引き継ぎ前にリモートの Issue または PR 本文を再同期した
- [ ] リモート本文がリポジトリ内ファイルを正本としている場合、最終同期は手作業で再構成した本文ではなく、そのファイルを使う body-file ベースの経路で実施した
- [ ] 最終同期後に GitHub 上の本文を spot-check し、`<...>` 記法の破損、表崩れ、コードフェンス崩れなどの Markdown drift がないことを確認した
- [ ] 人間の再合意を得た場合は、agent validation と分けて記録し、close 承認と混同していない
- [ ] Issue close などの最終状態変更について、明示的な人間承認を記録した。承認形式（個別 Issue 承認または連続処理一括承認）と、承認根拠となる発言の引用または参照を Process Review Notes に記録している
- [ ] PR テンプレートを埋めた
- [ ] 残存リスクと後続作業を記録した
