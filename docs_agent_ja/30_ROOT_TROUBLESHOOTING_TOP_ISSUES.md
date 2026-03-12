# ルート Troubleshooting 上位問題

## この文書を使う場面

- 深掘り前に、症状から安全な緩和策候補を素早く引きたいときに使う
- 初動後で、クラウド別の深いプレイブックへ入る前に使う

## 実行パターン

1. 観測した症状から始める
2. 最初の確認を実行する
3. 最小の安全な緩和策を適用する
4. 次の緩和策へ進む前に health を再確認する

## 頻出問題

1. Azure で一部失敗だがランタイムは稼働しているデプロイ
2. AWS Lambda 更新競合
3. Pulumi stack path の不一致
4. GitHub Actions YAML 構文エラー
5. API 層と storage 層の CORS 設定不整合
6. hostname 追加後に GCP managed certificate が `PROVISIONING` のまま止まる

## 症状から最初の安全対応へ

| 症状                                                                                          | 最初の確認                                                                   | 安全な緩和策                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azure デプロイが一部失敗と表示される                                                          | まず health endpoint を確認する                                              | ランタイムが健全なら成功扱いとし、ヘルスベースで検証を続ける                                                                                                                       |
| Lambda 更新中に AWS `ResourceConflictException` が出る                                        | 関数がまだ更新中か確認する                                                   | 関数が `Active` に戻るまで待ち、1 回だけ再試行する                                                                                                                                 |
| `tofu` が workspace または state なしと出す                                               | 対象 environment ディレクトリと state/workspace の選択を確認する            | 対応する `infra/environments/<env>/` へ移動し、その environment 用の `tofu` コマンドをやり直して正しい IaC entrypoint から state を扱う                                                                         |
| GitHub Actions で YAML parse/scanner エラーが出る                                             | 変更した heredoc や複数行ブロックを特定する                                  | 壊れやすい heredoc を安全な quoting または単純な echo ベース生成へ置き換える                                                                                                       |
| ブラウザで preflight/CORS エラーが出る                                                        | API 層と storage 層の両方の CORS を確認する                                  | 欠けている層を修正し、本番 origin は実ドメインに限定する                                                                                                                           |
| hostname 追加後に GCP managed certificate が `PROVISIONING` のまま、または古い SAN だけを返す | 証明書に含まれる全 hostname の `domainStatus` と public DNS 可視性を確認する | 全 hostname が public に見え、`ACTIVE` になるまで block 扱いにする。固定名 certificate の IaC 置換に失敗した場合は、一意な certificate 名と `create_before_destroy` で rotate する |

## ルール

症状から入り、ログで裏付け、小さく安全な緩和策を適用します。

同程度に小さく見える緩和策が複数ある場合は、次の優先順で選びます。

1. 影響するシステムコンポーネントが最も少ない対処。
2. デプロイなしで完全に元へ戻せる対処。
3. 本番承認を必要としない対処。

この優先順を適用しても明確な候補が決まらない場合は、推測せずにエスカレーションします。

GCP の hostname expansion では、1 つの hostname だけが `ACTIVE` でも十分とはみなさないでください。shared Google-managed certificate は、含まれる全 hostname が public に見え、`ACTIVE` になるまで完了しません。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 30_ROOT_TROUBLESHOOTING_TOP_ISSUES
Scope: Issue #487 の sns リリースで frontend_react の build は通るが sns-api の staging health check が失敗する事象
Outcome: 根本原因候補を絞った
Actions taken: deploy-sns-aws.yml 後の sns 障害を config drift、auth mismatch、endpoint 誤経路の既知パターンと照合した
Evidence: Issue #487 では frontend_react のビルド成果物は正常だが sns-api のヘルスエンドポイントが失敗している
Risks or blockers: フロントエンド側だけを見ると sns-api または設定起因を見落とす
Next action: 可能性が高い sns の根本原因から順に検証し、候補一覧を sns-reviewer へ送り、sns-approval-owner の次判断材料にする
```
