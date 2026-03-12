# 本番準備ゲート

## この文書を使う場面

- 本番リリース、承認、incident 後の再開直前に使う
- 設計議論ではなく、最終ゲートとして使う

## 判断手順

1. 必須 Go 条件をすべて確認する
2. 影響経路に対してセキュリティ確認ポイントを実施する
3. 明示的なリスク受容があれば記録する
4. 1 文で GO または NO-GO を結論づける

## 必須 Go 条件

- CORS が実ドメインに制限されている
- Secrets がクラウドの secret store で管理されている
- 監視とアラートが有効
- 主要フローテストが通過
- ロールバック計画が文書化されている
- 承認ゲート付き production ワークフローがすべて完了している
- 影響対象クラウドの health endpoint を確認済みである
- プロバイダ別のセキュリティ状態がプロジェクト方針の下限を満たしている

GCP production-equivalent の live execution では、さらに次もすべて満たしていることを必須条件とする。

- reviewed execution package が completed 状態で揃い、reviewer と approval owner の handoff が同一 evidence path を指している
- dedicated hostname candidate、DNS source-of-truth、operator-managed な authoritative DNS write owner が明示的に記録されている
- live execution が summary や preparation record に埋め込まれず、separate execution issue として追跡されている
- rollback branches、evidence retention input、external notification / escalation destination が release-sensitive execution 開始前に固定されている
- shared Google-managed certificate に含まれる全 hostname が public に名前解決でき、certificate の `domainStatus=ACTIVE` になっている。1 つだけ `ACTIVE` でも、別 hostname が `FAILED_NOT_VISIBLE` などなら不十分とする
- post-change の monitoring state acknowledgment が同じ evidence path 上に残っており、route-level curl だけでなく uptime check の存在または状態と alert policy の enable 状態まで確認されている

## セキュリティ確認ポイント

- production CORS は実際にデプロイされた origin で確認する。Azure では Function App CORS と Blob Storage CORS の両方を確認する
- production 経路で返る CORS ヘッダーは、次のリクエストレベル検証で確認する

```bash
curl -s -I -X OPTIONS \
	-H "Origin: https://<allowed-domain>" \
	-H "Access-Control-Request-Method: GET" \
	<endpoint-url> | grep -i "access-control"
```

- 期待結果は `Access-Control-Allow-Origin: https://<allowed-domain>` であり、`*` は不可
- Azure では Function App URL と Blob Storage endpoint の両方で実行する
- 影響したクラウド経路で、必要な WAF または同等保護が有効であり、方針違反がないことを確認する
- secrets が意図したクラウド secret store にあり、rotation の担当または rotation policy が定義されていることを確認する
- 直近で secret 露出や緊急 credential 差し替えがあった場合は、rotation 後の値が反映済みであることを確認してから GO と判断する
- 公開された production 経路で HTTPS redirect と必要なセキュリティヘッダーを確認し、未対応ならクラウド固有ギャップとして明示記録する
- 影響したプロバイダ経路で監査ログが有効であり、直近のデプロイまたは管理イベントを検索できることを確認する
- ログ欠落、audit source 無効化、保持方針欠落が見つかった場合は、明示的なリスク受容がない限り NO-GO とする
- GCP の shared Google-managed certificate では、GO 判断前に served certificate の SAN 集合と provider 側が返す各 hostname の `domainStatus` の両方を確認する
- GCP production-equivalent execution の close gate または post-change approval では、期待する uptime check が残っていることと、参照する alert policy が enabled のままであることを同じ evidence path に記録する

1つでも落ちたら判断は NO-GO です。

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 31_PRODUCTION_READINESS_GATE
Scope: Issue #451 に対する exam-solver production リリースの GO / NO-GO 判断
Outcome: NO-GO
Actions taken: deploy-exam-solver-aws.yml 前に exam-solver の必須条件、セキュリティ確認点、ロールバック準備を確認した
Evidence: exam-solver の test は通過し監視も有効だが、Issue #451 では production CORS 検証が未完了だった
Risks or blockers: exam-solver の origin 確認不足のまま出すと本番トラフィックを壊す可能性がある
Next action: exam-solver の production CORS 検証を完了し、証跡を exam-solver-reviewer へ渡してから deploy-exam-solver-aws.yml 承認を exam-solver-approval-owner へ再申請する
```
