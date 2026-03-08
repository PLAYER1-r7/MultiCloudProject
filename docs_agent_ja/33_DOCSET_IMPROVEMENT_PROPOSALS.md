# ドキュメントセット改善提案

## 目的

このドキュメントは、`docs_agent/` 配下の全34ファイルを通読した結果として特定された改善提案を記録します。
各提案には、根拠となるドキュメント、観察された問題点、および具体的な推奨変更内容を含みます。

提案は5つのカテゴリに分類されています。

- **A. 定義の曖昧さ** — ルールは存在するが、境界が明確に規定されていないもの
- **B. ドキュメント間の矛盾** — 複数のドキュメントにわたってルールが衝突しているもの
- **C. 構造的重複** — 内容が重複しており、将来的な乖離リスクがあるもの
- **D. 欠落コンテンツ** — 必須ゲートや手順に実行可能な指示がないもの
- **E. 構造的問題** — ナビゲーション上のギャップを生むドキュメント構成

---

## カテゴリ A: 定義の曖昧さ

### A-1: 「小さく可逆な変更」にサイズの境界定義がない

- **根拠ドキュメント:** `02_AUTONOMOUS_DEV_PROTOCOL.md`、`07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **問題点:** 「小さく可逆な変更を行う」というルールが両ドキュメントに存在するが、何が「小さい」かを定義していない。エージェントは任意に解釈でき、大規模な編集を行いながらルールに従っていると主張できてしまう。
- **推奨変更:** `02_AUTONOMOUS_DEV_PROTOCOL.md` の Implement ステップに具体的な境界を追記する:
  - 1件の変更が触れるファイルは最大5ファイルとする。
  - タスク契約で明示的に大きなスコープが定義されていない限り、差分行数は200行以内とする。
  - 複数ファイルの変更は、論理的に1つのまとまりを形成する場合（設定変更とそれに対応するテストなど）に限り許容する。

---

### A-2: テストカバレッジ基準値88%に測定方法が指定されていない

- **根拠ドキュメント:** `32_TEST_EXECUTION_GATE.md`
- **問題点:** 「カバレッジが現在の基準値88%を下回った場合は理由を説明する」とあるが、使用すべきツール、コマンド、メトリクスの種類が指定されていない。エージェントはコンプライアンスを実際に確認できない。
- **推奨変更:** `32_TEST_EXECUTION_GATE.md` のゲートシーケンスセクションに標準コマンドを追記する:
  ```bash
  cd services/<app>
  pytest --cov=. --cov-report=term-missing tests/
  ```
  行カバレッジを測定種別とし、88%の閾値はリポジトリ全体ではなく変更対象サービスごとに適用することを明記する。

---

### A-3: 「ロールバック手順の文書化」に最低記載要件がない

- **根拠ドキュメント:** `04_DEFINITION_OF_DONE.md`、`03_TASK_CONTRACT_TEMPLATE.md`
- **問題点:** DoDの必須ゲート「ロールバック手順が文書化されている」は、技術的には「サービスを再起動する」の1行でも満たせてしまう。これではインシデント発生時にレビュアーや承認オーナーが実際に行動できるには不十分。
- **推奨変更:** `04_DEFINITION_OF_DONE.md` にロールバック記載の最低要件を追記する:
  ロールバックエントリには以下を必ず含める:
  1. 正確なリバートコマンドまたは手順のシーケンス。
  2. 想定される復旧時間。
  3. ロールバックが成功したことを確認するための検証コマンド。

---

### A-4: 複数の候補がある場合に「最小安全対処」の選択基準がない

- **根拠ドキュメント:** `20_MANUAL_DEPLOY_DECISION_CRITERIA.md`、`21_AWS_INCIDENT_PATTERN_PLAYBOOK.md`、`22_AZURE_INCIDENT_PATTERN_PLAYBOOK.md`、`23_GCP_INCIDENT_PATTERN_PLAYBOOK.md`、`30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md`
- **問題点:** 各クラウド固有のプレイブックに「最小安全対処を適用する」という指示があるが、スコープが同程度に見える複数の対処が存在する場合、どれを先に選ぶかのルールがない。
- **推奨変更:** `30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md` に優先順位のタイブレーカーを追記する:
  スコープが同程度の対処を選ぶ際は、次の優先順で選択する:
  1. 影響するシステムコンポーネントが最も少ない対処。
  2. デプロイなしで完全に元に戻せる対処。
  3. 本番承認が不要な対処。
     明確な優先候補が存在しない場合は、推測せずにエスカレーションする。

---

## カテゴリ B: ドキュメント間の矛盾

### B-1: 緊急時のマニュアルデプロイが「根本原因不明時の停止」ルールと衝突する

- **根拠ドキュメント:** `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` vs `02_AUTONOMOUS_DEV_PROTOCOL.md`、`14_CRITICAL_GUARDRAILS_EXTRACT.md`
- **問題点:** doc 20 は「緊急復旧」時のマニュアルデプロイを許可しているが、docs 02 と 14 は根本原因不明時のハードストップを要求している。インシデント対応中に両ルールが同時に適用される状況になっても、その橋渡しとなるルールがない。
- **推奨変更:** `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` の「マニュアルデプロイが許可される条件」セクションに橋渡しルールを追記する:
  緊急マニュアルデプロイが許可されるのは、障害の発生源が特定のレイヤー（設定、デプロイアーティファクト、環境変数）に絞り込めている場合のみ。特定のレイヤーに絞り込めない場合は「根本原因不明」として分類し、`02_AUTONOMOUS_DEV_PROTOCOL.md` のハードストップルールを適用する。

---

### B-2: コードベースが既に88%未満の場合、テスト基準値ルールを適用できない

- **根拠ドキュメント:** `32_TEST_EXECUTION_GATE.md`
- **問題点:** 「カバレッジが88%を下回ったら理由を説明する」というルールは、現時点で88%が達成済みであることを前提としている。プロジェクトが現在75%であれば、このルールは文字通りには適用できず、エージェントに指針がない。
- **推奨変更:** `32_TEST_EXECUTION_GATE.md` の絶対的な下限ルールを相対ルールに置き換える:
  タスク開始時点のカバレッジを維持または改善する。長期目標は88%。開始時点が88%未満の場合は、さらに低下させないようにし、現在の基準値を証拠レコードに記録する。

---

### B-3: 承認オーナーの応答に待機上限時間が定義されていない

- **根拠ドキュメント:** `ROLE_HANDOFF_OWNERSHIP.md`、`08_ESCALATION_AND_HANDOFF.md`、`05_PR_TASK_CONTRACT_TEMPLATE.md`
- **問題点:** エージェントが `Outcome: Handoff ready` のハンドオフを提出した後、再エスカレーションが発動するタイムアウトが定義されていない。エージェントはアクションルールがないまま無期限に待機できてしまう。
- **推奨変更:** `ROLE_HANDOFF_OWNERSHIP.md` の承認オーナーの責務セクションにデフォルトの待機上限を追記する:
  - 非本番作業: 24時間後に `Outcome: Re-escalation requested - approval not received` で再エスカレーション。
  - 本番インシデント: 2時間後に再エスカレーション。
    再エスカレーションのペイロードは元のハンドオフと同じ実行レコードを再利用する。

---

### B-4: 共有インフラストラクチャの変更に境界ルールがない

- **根拠ドキュメント:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`
- **問題点:** doc 15 は exam-solver と sns の境界を個別に定義しているが、`infrastructure/pulumi/` など両アプリに同時に影響するパスの変更については言及がない。エージェントはこれらのパスに対する境界判断を指針なしに行わなければならない。
- **推奨変更:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md` に第3の境界階層を追加する:
  - **共有インフラストラクチャ**（`infrastructure/`、`scripts/`、アプリ固有のデプロイファイル以外の `.github/workflows/`）: ここへの編集は明示的なクロスアプリ調整契約を必要とし、`ROLE_HANDOFF_OWNERSHIP.md` で定義された `platform-reviewer` と `platform-approval-owner` ロールを使用しなければならない。
  - 共有パスに触れてしまう単一アプリの変更は、着手前に別の共有インフラストラクチャ契約として分割しなければならない。

---

## カテゴリ C: 構造的重複

### C-1: タスク契約テンプレートが同一ファイル内に2回定義されている

- **根拠ドキュメント:** `03_TASK_CONTRACT_TEMPLATE.md`
- **問題点:** このドキュメントにはタスク契約が2回記載されている。1回目はフェンスで囲まれたコピー用コードブロック、2回目はレンダリングされたMarkdownセクションヘッダー形式。後半部分だけを読んだエージェントは構造的に異なるフォーマットを受け取る。どちらかを変更してももう一方に反映されないため、長期的な乖離が生じる。
- **推奨変更:** `03_TASK_CONTRACT_TEMPLATE.md` のレンダリングされたMarkdownセクション版を削除する。フェンスで囲まれたコピー用ブロックのみを残す。ブロックの直後に1行追加する: 「上記のブロックをそのままコピーすること。Markdownヘッダー形式に変換しないこと。」

---

### C-2: ハンドオフペイロードフォーマットが doc 05 と doc 08 の両方で定義されている

- **根拠ドキュメント:** `05_PR_TASK_CONTRACT_TEMPLATE.md`、`08_ESCALATION_AND_HANDOFF.md`
- **問題点:** 両ドキュメントが独立してハンドオフペイロードブロックを定義している。doc 05 のみを読んだエージェントは doc 08 のエスカレーション variant を見落とし、doc 08 の正規フォーマットへの変更が doc 05 に反映されない可能性がある。
- **推奨変更:** `05_PR_TASK_CONTRACT_TEMPLATE.md` のインラインペイロードブロックを明示的な参照に置き換える: 「`08_ESCALATION_AND_HANDOFF.md` で定義された共有ペイロードフォーマットを使用すること。PRを提出する際は `Outcome: Handoff ready` をセットする。」

---

### C-3: doc 16 が doc 32 のテストゲートシーケンスを証拠ルールなしで重複している

- **根拠ドキュメント:** `16_TEST_AND_DEPLOY_QUICK_REF.md`、`32_TEST_EXECUTION_GATE.md`
- **問題点:** doc 16 は doc 32 と同じスモーク → 対象テスト → デプロイというシーケンスを列挙しているが、証拠ルール、合格条件、基準値要件が含まれていない。doc 16 だけを使用するエージェントは正しいコマンドを実行しても不完全な証拠レコードを作成してしまう。
- **推奨変更:** `16_TEST_AND_DEPLOY_QUICK_REF.md` を、高速コマンドのみを含む1ページのクイックスタートに縮小し、次の1行ポインターを追加する: 「証拠要件、合格条件、基準値ルールについては `32_TEST_EXECUTION_GATE.md` が正規ドキュメントである。」

---

## カテゴリ D: 欠落コンテンツ

### D-1: 本番CORS検証に実行可能なコマンドが存在しない

- **根拠ドキュメント:** `14_CRITICAL_GUARDRAILS_EXTRACT.md`、`31_PRODUCTION_READINESS_GATE.md`
- **問題点:** 両ドキュメントがCORS検証を必須ステップとして要求しているが、どちらもコマンドや期待される出力フォーマットを提供していない。エージェントはこのゲートを検証可能な形で充足できない。
- **推奨変更:** `31_PRODUCTION_READINESS_GATE.md` のセキュリティ検証ポイントセクションに標準検証コマンドを追記する:
  ```bash
  curl -s -I -X OPTIONS \
    -H "Origin: https://<allowed-domain>" \
    -H "Access-Control-Request-Method: GET" \
    <endpoint-url> | grep -i "access-control"
  ```
  期待される出力: `Access-Control-Allow-Origin: https://<allowed-domain>`（`*` は不可）。
  Azureの場合は、Function App URLとBlob StorageエンドポイントのURLに対してそれぞれ1回ずつ実行する。

---

### D-2: `check-app-boundary.sh` が存在しない場合のフォールバックがない

- **根拠ドキュメント:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`
- **問題点:** 境界ガードコマンドは編集前後に必須として記載されているが、スクリプトが存在しないか実行に失敗した場合の代替手段がドキュメントに記載されていない。
- **推奨変更:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md` にフォールバック手順を追記する:
  ```bash
  # exam-solver用: snsのパスが触られていないことを確認
  git diff --name-only | grep -E "sns-api|frontend_react"
  # sns用: exam-solverのパスが触られていないことを確認
  git diff --name-only | grep -E "exam-solver-api|frontend_exam"
  ```
  どちらかのコマンドが結果を返した場合は作業を止めて分割する。証拠フィールドに「manual boundary check used」と記録する。

---

### D-3: doc 18 のシビリティ分類にP0が欠落している

- **根拠ドキュメント:** `18_INCIDENT_TRIAGE_RUNBOOK.md`、`19_RECOVERY_PRIORITY_RUNBOOK.md`
- **問題点:** doc 19 はP0を「大規模な本番停止またはセキュリティリスク」と定義しているが、doc 18 のトリアージランブックにはP1、P2、P3しかリストされていない。トリアージドキュメントだけを参照するエージェントはP0のイベントを正しく分類できない。
- **推奨変更:** `18_INCIDENT_TRIAGE_RUNBOOK.md` の「最初の15分」ステップ3にP0を追記する:
  - P0: 大規模な本番停止またはアクティブなセキュリティ侵害 — 完全なトリアージを待たずに即時エスカレーション。
  - P1: 回避策が存在する大規模な機能停止。
  - P2: ステージングまたは非クリティカルパスの障害。
  - P3: 外観上の問題またはブロックしない不具合。

---

### D-4: 認証リクエスト後の待機タイムアウトが定義されていない

- **根拠ドキュメント:** `17_AUTH_REQUEST_PLAYBOOK.md`
- **問題点:** プレイブックには「再認証が確認されるまで再開しない」とあるが、タイムアウトが指定されていない。エージェントは再エスカレーションのトリガーがないまま無期限に待機できてしまう。
- **推奨変更:** `17_AUTH_REQUEST_PLAYBOOK.md` の「即時アクション順序」に待機上限を追記する:
  - 非本番タスク: 最大30分待機。
  - アクティブな本番インシデント: 最大15分待機。
    上限内に確認が得られない場合は、`08_ESCALATION_AND_HANDOFF.md` を使って `Outcome: Re-escalation requested - authentication still missing` で再エスカレーションする。

---

## カテゴリ E: 構造的問題

### E-1: Execution Record フォーマットが19のドキュメントにコピーされており、正規の定義が存在しない

- **根拠ドキュメント:** `14_CRITICAL_GUARDRAILS_EXTRACT.md` から `32_TEST_EXECUTION_GATE.md`（19ファイル）
- **問題点:** すべての運用ドキュメントが独自のExecution Recordブロックのコピーを持っている。正規の定義が存在しない。フォーマット変更（新しいフィールドの追加など）が必要になった場合、19箇所すべてを手動で更新しなければならず、乖離は避けられない。
- **推奨変更:** `08_ESCALATION_AND_HANDOFF.md` に新しいセクション「正規 Execution Record フォーマット」としてExecution Recordを1回だけ定義する。docs 14〜32の各ドキュメントでは、インラインブロックを次の1行に置き換える: 「`08_ESCALATION_AND_HANDOFF.md` で定義された Execution Record フォーマットを使用して記入する。」コピー用のリマインダーは doc 08 にのみ残す。

---

### E-2: インシデント対応の入口ドキュメントが docs 18、28、29 にわたって曖昧

- **根拠ドキュメント:** `18_INCIDENT_TRIAGE_RUNBOOK.md`、`28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`、`29_ONCALL_MONITORING_ONEPAGE.md`
- **問題点:** 3つのドキュメントがいずれもインシデントまたはアラート発生時の初動対応を説明している。アラートを受信したエージェントは、3つ全部を読まなければどのドキュメントを最初に開くべきか判断できない。`01_START_HERE.md` のルーティングテーブルには「`18_INCIDENT_TRIAGE_RUNBOOK.md` を最初に読む」とあるが、docs 28 と 29 はどちらも自身を「最初の5分」ドキュメントとして説明している。
- **推奨変更:** `01_START_HERE.md` のファストルーティングテーブルに3方向の判断ルールを追記する:
  - アラート発生から5分未満で症状が特定されていない場合 → `29_ONCALL_MONITORING_ONEPAGE.md`
  - 症状が特定されているアクティブなインシデント → `18_INCIDENT_TRIAGE_RUNBOOK.md`
  - 単一の明確な原因がないアラートストーム → `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`

---

## 第2回レビュー追加項目: ドキュメント間の矛盾

### B-5: `19_RECOVERY_PRIORITY_RUNBOOK.md` のシビリティガイドに P3 がなく doc 18 と不一致

- **根拠ドキュメント:** `18_INCIDENT_TRIAGE_RUNBOOK.md`、`19_RECOVERY_PRIORITY_RUNBOOK.md`
- **問題点:** D-3 対応で doc 18 に P0/P1/P2/P3 の4段階を追加したが、doc 19 の Severity Guide は P0/P1/P2 の3段階のままである。P3 が doc 18 では「外観上の問題またはブロックしない不具合」と定義されているのに、doc 19 には存在しないため一貫性がない。
- **推奨変更:** `19_RECOVERY_PRIORITY_RUNBOOK.md` の Severity Guide に P3 を追記する:
  - P3: 外観上の問題またはブロックしない不具合。P0〜P2 がすべて安定したあとに対処する。

---

## 第2回レビュー追加項目: 構造的重複

### C-4: `02_AUTONOMOUS_DEV_PROTOCOL.md` の "Required Task Record" フィールドが doc 08 の正規フォーマットと乖離している

- **根拠ドキュメント:** `02_AUTONOMOUS_DEV_PROTOCOL.md`、`08_ESCALATION_AND_HANDOFF.md`
- **問題点:** doc 02 の末尾に `Required Task Record` として「Scope in / out / Changed files / Validation commands and results / Risks / Rollback method」というフィールドセットが記載されているが、doc 08 の正規 Execution Record は `Document / Scope / Outcome / Actions taken / Evidence / Risks or blockers / Next action` という異なるフィールドセットである。エージェントが両方を読むと、どちらのフィールドで記録すべきか曖昧になる。
- **推奨変更:** `02_AUTONOMOUS_DEV_PROTOCOL.md` の Required Task Record セクションを doc 08 の正規フォーマットへの参照1行に置き換える:
  「タスクの記録には `08_ESCALATION_AND_HANDOFF.md` で定義した正規 Execution Record フォーマットを使用すること。」

---

### C-5: `03_TASK_CONTRACT_TEMPLATE.md` の完了ハンドオフルールが2フォーマットを「OR」で並べているが実質同一

- **根拠ドキュメント:** `03_TASK_CONTRACT_TEMPLATE.md`、`08_ESCALATION_AND_HANDOFF.md`
- **問題点:** doc 03 末尾の "Completion Hand-off Rule" が「docs 14-32 の Execution Record フォーマット OR doc 08 の Handoff Payload フォーマット」と記述しているが、docs 14-32 はすでに doc 08 を参照するよう変更済みであり実質同一フォーマットである。OR表記が残っていると、エージェントが別の形式を誤解するリスクがある。
- **推奨変更:** `03_TASK_CONTRACT_TEMPLATE.md` の Completion Hand-off Rule を次の1行に簡略化する:
  「`08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record フォーマットを使用してタスクを締めくくること。」

---

## 第2回レビュー追加項目: 欠落コンテンツ

### D-5: `04_DEFINITION_OF_DONE.md` の必須ゲートにドキュメント参照がない

- **根拠ドキュメント:** `04_DEFINITION_OF_DONE.md`
- **問題点:** DoD の必須ゲートはチェックリスト形式だが、各ゲートをどのドキュメントで満たすかの参照がない。例えば「テストが合格している」に対して `32_TEST_EXECUTION_GATE.md`、「ロールバック手順が文書化されている」に対して最低要件が同ファイル内にあることなど、エージェントが各ゲートを充足する方法を独力で発見しなければならない。
- **推奨変更:** `04_DEFINITION_OF_DONE.md` の各必須ゲートに最短の参照を追記する:
  - **テスト合格**: `32_TEST_EXECUTION_GATE.md` でゲートシーケンスを確認する
  - **セキュリティ回帰なし**: `14_CRITICAL_GUARDRAILS_EXTRACT.md` の停止条件を確認する
  - **ロールバック手順の文書化**: この文書の Minimum Rollback Content セクションの3要件を満たすこと
  - **変更サマリーの明確さ**: `05_PR_TASK_CONTRACT_TEMPLATE.md` のパッケージングルールに従うこと

---

### D-6: `06_TOOLING_AND_SERVICES.md` に検証スクリプトが記載されていない

- **根拠ドキュメント:** `06_TOOLING_AND_SERVICES.md`
- **問題点:** doc 06 は必要ツールとして Git・Python・Node.js・Docker・各 CLI を列挙しているが、ドキュメントセット全体で多用される `./scripts/test-endpoints.sh` と `./scripts/test-e2e.sh` がツール一覧に含まれていない。エージェントはこれらスクリプトが存在することを doc 18・29・32 など複数の運用ドキュメントを読んで初めて気づく形になっている。
- **推奨変更:** `06_TOOLING_AND_SERVICES.md` の Required Tooling セクション末尾に一項目追加する:
  - Project validation scripts: `./scripts/test-endpoints.sh` および `./scripts/test-e2e.sh`（スモーク検証と E2E 検証に使用）

---

### D-7: `09_DOCSET_SYNC_RULES.md` の Done Check に検証コマンドがない

- **根拠ドキュメント:** `09_DOCSET_SYNC_RULES.md`
- **問題点:** Done Check の項目は「ファイル数が一致している」「番号付けが一致している」という記述のみで、実行可能な確認コマンドがない。エージェントはディレクトリを目視で比較するか、独自にコマンドを作成しなければならず、確認精度が実行するエージェントによって異なる。
- **推奨変更:** `09_DOCSET_SYNC_RULES.md` の Done Check セクションに検証コマンドを追記する:
  ```bash
  # 両フォルダのファイル数が一致することを確認
  diff <(ls docs_agent/ | sort) <(ls docs_agent_ja/ | sort)
  ```
  差分がないことが期待される出力とする。

---

## 第2回レビュー追加項目: 構造的問題

### E-3: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` が `01_START_HERE.md` の読み込み順序と参照マップから欠落している

- **根拠ドキュメント:** `01_START_HERE.md`、`07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **問題点:** `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` は Before Coding / During Coding / Before Handoff の3段階チェックリストを持ち、エージェントが誤りなく作業を進めるための重要な安全ネットである。しかし `01_START_HERE.md` の読み込み順序にも参照マップにも doc 07 が含まれていない。エージェントはコア8ドキュメントを読んだ後でも doc 07 の存在に気づかない。
- **推奨変更:** `01_START_HERE.md` の参照マップに doc 07 を追記する:
  「実行前後のセルフチェックリスト: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`」

---

## 第3回レビュー追加項目: 構造的重複

### C-6: `05_PR_TASK_CONTRACT_TEMPLATE.md` の fenced ブロック後にテンプレートフィールドが Markdown ヘッダーとして重複している

- **根拠ドキュメント:** `05_PR_TASK_CONTRACT_TEMPLATE.md`
- **問題点:** コピー用 fenced ブロックとショートサンプルの後に、Summary・Contract Alignment・Validation・Risk・Reviewer Notes の各フィールドが空の Markdown セクションヘッダーとして繰り返されている。その位置から読み始めたエージェントは fenced ブロックのコピー指示なしに空フィールドだけを見ることになる。C-1 の修正で `03_TASK_CONTRACT_TEMPLATE.md` には同様の対処が施されたが、doc 05 は当時対象外となっていた。
- **推奨変更:** `05_PR_TASK_CONTRACT_TEMPLATE.md` の末尾にある重複した Summary・Contract Alignment・Validation・Risk・Reviewer Notes の Markdown セクションを削除する。fenced テンプレート、ショートサンプル、および固有の「Connection to Shared Record Format」「Packaging Rule」セクションは残す。fenced ブロックの直後に一行追加する:「上記ブロックをそのままコピーすること。Markdown ヘッダーに変換しないこと。」

---

### C-7: レビューテンプレート（10〜13）でもコピー用 fenced ブロックの後に空フィールドが重複している

- **根拠ドキュメント:** `10_WEEKLY_REVIEW_TEMPLATE.md`、`11_MONTHLY_REVIEW_TEMPLATE.md`、`12_QUARTERLY_REVIEW_TEMPLATE.md`、`13_ANNUAL_REVIEW_TEMPLATE.md`
- **問題点:** 各レビューテンプレートは、コピー用 fenced ブロック、ショートサンプルに続けて、同じフィールド名の空 Markdown セクションヘッダーを再掲している。末尾の空セクションは固有の説明を持たず、テンプレートのブランクコピーとして機能しているだけである。fenced ブロックを使ったエージェントとレンダリング済みセクションを使ったエージェントで構成が異なる状態が生まれる。
- **推奨変更:** 各レビューテンプレート（10〜13）の末尾にある重複した空 Markdown セクションヘッダーを削除する。コピー用 fenced ブロックとショートサンプルのみを残す。各サンプルの後に一行追加する:「新しいレビューエントリーを作成するときは、上記の fenced ブロックをコピーすること。」

---

## 第3回レビュー追加項目: 欠落コンテンツ

### D-8: `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` の後続ルーティングに `24_CROSS_CLOUD_INCIDENT_MATRIX.md` が含まれていない

- **根拠ドキュメント:** `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`、`24_CROSS_CLOUD_INCIDENT_MATRIX.md`
- **問題点:** doc 28 はアラートが到着したが障害クラウドがまだ特定できていない状況（アラートストーム）で使用される。初期対応セクションの後続先として docs 18、21、22、23、29 がリストされているが、doc 24（クロスクラウドインシデントマトリクス）が含まれていない。doc 24 はクラウドドメインが未確定の場合に症状からクラウドを絞り込むために設計されており、アラートストームのシナリオに最も適したドキュメントである。doc 28 からのルーティングがなければ、エージェントは参照マップを独自に確認しない限り doc 24 を発見できない。
- **推奨変更:** `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` の Initial Response セクションにルーティング注記を追加する:「障害クラウドがまだ特定できていない場合は、プロバイダー固有のプレイブックへ移る前に `24_CROSS_CLOUD_INCIDENT_MATRIX.md` でドメインを絞り込む。」

---

### D-9: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` のチェックリスト項目に失敗時の参照先が記載されていない

- **根拠ドキュメント:** `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **問題点:** 各チェックリスト項目にはそれぞれ対応する規定ドキュメントが存在するが（例: 「認証確認済み」 → `17_AUTH_REQUEST_PLAYBOOK.md`、「DoD 必須ゲート通過」 → `04_DEFINITION_OF_DONE.md`）、ドキュメント内に参照先が記載されていない。エージェントが未チェックの項目を見つけた場合、次にどのドキュメントへ進むべきかを独自に判断しなければならない。
- **推奨変更:** `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` の各フェーズ見出しの直後に「詰まった場合」ポインタを追加する:
  - Before Coding:「詰まった場合: 認証 → `17_AUTH_REQUEST_PLAYBOOK.md`；コントラクトまたはスコープ → `03_TASK_CONTRACT_TEMPLATE.md`；境界確認 → `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`。」
  - During Coding:「詰まった場合: 境界違反 → `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`；ハードストップ条件 → `14_CRITICAL_GUARDRAILS_EXTRACT.md`。」
  - Before Handoff:「詰まった場合: テストゲート → `32_TEST_EXECUTION_GATE.md`；DoD ゲート → `04_DEFINITION_OF_DONE.md`；PR パッケージング → `05_PR_TASK_CONTRACT_TEMPLATE.md`。」

---

### D-10: `04_DEFINITION_OF_DONE.md` の納品ゲートに参照先ドキュメントが記載されていない

- **根拠ドキュメント:** `04_DEFINITION_OF_DONE.md`
- **問題点:** D-5 の修正で必須ゲートと最初の納品ゲート（「変更サマリーが明確 → `05_PR_TASK_CONTRACT_TEMPLATE.md`」）には参照先が追加されたが、残りの3つの納品ゲート（「リスクとトレードオフが明示されている」「レビュー担当者向けの指示が含まれている」「必要に応じてフォローアップタスクが記録されている」）には参照先がない。エージェントはこれらのゲートをどのドキュメントで満たすかを独自に判断しなければならない。
- **推奨変更:** `04_DEFINITION_OF_DONE.md` の残りの納品ゲートに参照先を追加する:
  - **リスクとトレードオフが明示されている**: `03_TASK_CONTRACT_TEMPLATE.md` の Risk and Rollback セクションに記録する。
  - **レビュー担当者向けの指示が含まれている**: `05_PR_TASK_CONTRACT_TEMPLATE.md` の Reviewer Notes 形式に従う。
  - **フォローアップタスクが記録されている**: `08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record の `Next action` に記録する。

---

## 実装ステータス

今回のドキュメント改訂で、次の提案は反映済みです。

- 完了した P1 項目: `D-3`、`B-1`、`A-2`、`C-1`、`E-2`、`B-5`、`E-3`
- 完了した P2 項目: `D-1`、`B-4`、`A-1`、`B-2`、`B-3`、`A-3`、`D-2`、`D-4`、`C-4`、`D-5`、`D-6`、`D-8`、`D-9`
- 完了した P3 項目: `E-1`、`C-2`、`A-4`、`C-3`、`C-5`、`D-7`、`C-6`、`C-7`、`D-10`

この提案セットに残っている未完了項目はありません。

---

## 優先度マトリクス

| ID   | カテゴリ       | 影響度 | 対応コスト | 優先度 | 状態 |
| ---- | -------------- | ------ | ---------- | ------ | ---- |
| D-3  | 欠落コンテンツ | 高     | 低         | P1     | 完了 |
| B-1  | 矛盾           | 高     | 低         | P1     | 完了 |
| A-2  | 定義の曖昧さ   | 高     | 低         | P1     | 完了 |
| C-1  | 構造的重複     | 中     | 低         | P1     | 完了 |
| E-2  | 構造的問題     | 高     | 低         | P1     | 完了 |
| B-5  | 矛盾           | 中     | 低         | P1     | 完了 |
| E-3  | 構造的問題     | 中     | 低         | P1     | 完了 |
| D-1  | 欠落コンテンツ | 高     | 中         | P2     | 完了 |
| B-4  | 矛盾           | 高     | 中         | P2     | 完了 |
| A-1  | 定義の曖昧さ   | 中     | 低         | P2     | 完了 |
| B-2  | 矛盾           | 中     | 低         | P2     | 完了 |
| B-3  | 矛盾           | 中     | 中         | P2     | 完了 |
| A-3  | 定義の曖昧さ   | 中     | 低         | P2     | 完了 |
| D-2  | 欠落コンテンツ | 中     | 低         | P2     | 完了 |
| D-4  | 欠落コンテンツ | 中     | 低         | P2     | 完了 |
| C-4  | 構造的重複     | 中     | 低         | P2     | 完了 |
| D-5  | 欠落コンテンツ | 中     | 低         | P2     | 完了 |
| D-6  | 欠落コンテンツ | 低     | 低         | P2     | 完了 |
| E-1  | 構造的問題     | 中     | 高         | P3     | 完了 |
| C-2  | 構造的重複     | 低     | 低         | P3     | 完了 |
| A-4  | 定義の曖昧さ   | 中     | 中         | P3     | 完了 |
| C-3  | 構造的重複     | 低     | 低         | P3     | 完了 |
| C-5  | 構造的重複     | 低     | 低         | P3     | 完了 |
| D-7  | 欠落コンテンツ | 低     | 低         | P3     | 完了 |
| D-8  | 欠落コンテンツ | 中     | 低         | P2     | 完了 |
| D-9  | 欠落コンテンツ | 中     | 低         | P2     | 完了 |
| C-6  | 構造的重複     | 低     | 低         | P3     | 完了 |
| C-7  | 構造的重複     | 低     | 低         | P3     | 完了 |
| D-10 | 欠落コンテンツ | 低     | 低         | P3     | 完了 |

---

## 推奨アクションプラン

### 完了済み項目

1. `18_INCIDENT_TRIAGE_RUNBOOK.md` に `P0/P1/P2/P3` の重要度分類を追加した。
2. `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` に、緊急手動デプロイと根本原因不明時停止をつなぐルールを追加した。
3. `32_TEST_EXECUTION_GATE.md` に標準カバレッジコマンドと相対基準ルールを追加した。
4. `03_TASK_CONTRACT_TEMPLATE.md` の fenced ブロックを正本テンプレートとして固定した。
5. `01_START_HERE.md` にインシデント入口の判断ルールを追加した。
6. `31_PRODUCTION_READINESS_GATE.md`、`15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`、`02_AUTONOMOUS_DEV_PROTOCOL.md`、`04_DEFINITION_OF_DONE.md`、`17_AUTH_REQUEST_PLAYBOOK.md`、`ROLE_HANDOFF_OWNERSHIP.md` に承認済み改善を反映した。
7. `08_ESCALATION_AND_HANDOFF.md` を正規 Execution Record の定義元にし、docs 14-32 と `05_PR_TASK_CONTRACT_TEMPLATE.md` を参照型へ移行した。
8. `30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md` に、複数候補がある場合の対処選択タイブレーカーを追加した。
9. `16_TEST_AND_DEPLOY_QUICK_REF.md` を、`32_TEST_EXECUTION_GATE.md` へ戻るクイックスタート中心の文書へ整理した。
10. `19_RECOVERY_PRIORITY_RUNBOOK.md` の重要度目安に `P3` を追加した。
11. `01_START_HERE.md` の参照マップに `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` を追加した。
12. `02_AUTONOMOUS_DEV_PROTOCOL.md` の必須記録を `08_ESCALATION_AND_HANDOFF.md` の正規 Execution Record 形式へ統一した。
13. `04_DEFINITION_OF_DONE.md` の必須ゲートと納品ゲートに参照先文書を追加した。
14. `06_TOOLING_AND_SERVICES.md` に共通検証スクリプトを追加した。
15. `03_TASK_CONTRACT_TEMPLATE.md` の完了時引き渡しルールを単一の正規フォーマット参照へ整理した。
16. `09_DOCSET_SYNC_RULES.md` の完了確認に `diff` 検証コマンドを追加した。
17. `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` に、障害クラウド未確定時は `24_CROSS_CLOUD_INCIDENT_MATRIX.md` へ進むルーティングを追加した。
18. `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` に、各フェーズで詰まった場合の参照先を追加した。
19. `05_PR_TASK_CONTRACT_TEMPLATE.md` は fenced テンプレートのみを残し、重複した空セクションを削除した。
20. `10_WEEKLY_REVIEW_TEMPLATE.md` から `13_ANNUAL_REVIEW_TEMPLATE.md` は、fenced テンプレートと記入例のみを残し、重複した空セクションを削除した。
21. `04_DEFINITION_OF_DONE.md` に、残りの納品ゲートの参照先を追加した。

### 次に残っている対応

現時点で、この提案セットに残っている対応はありません。

---

## 同期ノート

`09_DOCSET_SYNC_RULES.md` に従い、このドキュメントは `docs_agent/33_DOCSET_IMPROVEMENT_PROPOSALS.md` の完全なミラーです。英語版になんらかの変更が加えられた場合は、このファイルに同じ変更を適用してください。
