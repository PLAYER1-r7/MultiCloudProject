# GitHub 運用コマンド

## この文書を使う場面

- GitHub の認証、作業項目、workflow を最短で確認したいときに使う
- 障害対応中や release 中に、その場で新しい `gh` コマンドを組み立てる代わりに使う
- Issue のタグを付ける、または未整備のタグを基準に沿って揃えたいときにも使う

## 典型手順

1. GitHub 認証を確認する
2. 関連する issue または PR 状態を確認する
3. Issue メタデータを編集する前にタグ付与基準を確認する
4. workflow を起動または確認する
5. 実行環境側へ移る前に run ID を記録する

## 認証

```bash
gh auth login
gh auth status
```

## Issue / PR

```bash
gh issue list --state open
gh pr list --state open
```

## Issue タグ付与基準

- `portal`: portal-web 実装、portal 文書、portal ガバナンス Issue に付ける。portal 系スコープでないことが明確な場合は付けない
- `sns`: SNS 固有の planning、implementation、regression、operations Issue に付ける。主題が SNS track にある場合は `portal` だけを唯一のアプリ軸ラベルとして残さない
- `planning`: judgment、baseline、gate、decision、preparation、handoff、memo のように、前提条件、非対象、判断境界を固定する Issue に付ける
- `infrastructure`: IaC、resource execution、backend wiring、deploy surface、rollback implementation、recovery operations、delivery path の Issue に付ける
- `cicd`: workflow、build、artifact、deploy automation、provenance、release evidence の Issue に付ける
- `testing`: validation、reachability、alerting、monitoring checks、drill、verification の Issue に付ける。専用の monitoring ラベルがない前提で使う
- `security`: auth、certificate、WAF / Cloud Armor、credential governance、rotation、security baseline の Issue に付ける
- `architecture`: architecture、topology、boundary、design structure を主題にする Issue に付ける
- `documentation`: docs-only、process、summary、sync、cleanup、operator memo の Issue に付ける
- `aws`: AWS 経路または AWS production governance を明示的に扱う Issue にだけ付ける。GCP 専用ラベルはないため、GCP Issue は機能軸のラベルで表す
- タイトル、本文、canonical issue record から直接裏づけできるタグだけを付ける。近接 Issue と似ているだけで推測付与しない

## Issue タグ操作コマンド

```bash
scripts/create-github-issue.sh --title "..." --body-file docs/portal/issues/issue-XX.md --label planning --label portal
gh issue list --limit 100 --state all --json number,title,labels
gh issue view <N> --json number,title,labels
gh issue edit <N> --add-label "portal,planning"
gh issue edit <N> --remove-label "documentation"
```

## Issue タグ確認ルール

- タグは Issue 作成後の任意 cleanup ではなく、作成手順の一部として扱う
- Issue を作成したら、次の Issue に移る前にタグを確認する
- タグなしで作成された場合は、未ラベル debt として残さずその場で修正する
- Issue 作成とタグ確認を分離しないため、可能な限り `scripts/create-github-issue.sh` を使う

```bash
gh issue view <N> --json number,title,labels
gh issue list --limit 200 --state all --json number,title,labels \
	| jq -r '.[] | select((.labels | length) == 0) | [.number, .title] | @tsv'
```

## ワークフロー

```bash
gh workflow run deploy-sns-aws.yml --ref develop -f environment=staging
gh run list --workflow=deploy-sns-aws.yml --limit 5
```

## 実行記録

`08_ESCALATION_AND_HANDOFF.md` で定義された正規 Execution Record 形式を使って記入します。

`Next action` で reviewer / approval owner の境界を書くときは `ROLE_HANDOFF_OWNERSHIP.md` に合わせます。

## 記入例

```text
Document: 27_GITHUB_OPERATIONS_COMMANDS
Scope: Issue #487 に対する sns のリリース候補レビュー用 PR と workflow 状態収集
Outcome: 実行コマンドを選定した
Actions taken: sns の PR 状態、deploy-sns-aws.yml checks、直近デプロイ履歴を取るコマンドを選んだ
Evidence: Issue #487 の sns release review では repository 状態と CI 結果をまとめて確認する必要がある
Risks or blockers: 古い手元認識のまま sns の承認判断をすると誤る可能性がある
Next action: 選んだ GitHub コマンドを実行し、結果を sns-reviewer と sns-approval-owner 向けの引き継ぎへ添付する
```
