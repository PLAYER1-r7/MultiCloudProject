# MultiCloudProject

Planning repository for a new portal project that starts on AWS and is designed to expand to Azure and GCP later without unnecessary rewrites.

## Repository Purpose

- Define the product and MVP for the new portal
- Document architectural and operational decisions
- Manage planning work as GitHub Issues
- Prepare the project for staged implementation from the devcontainer

## Structure

```text
docs/
  portal/
apps/
  portal-web/
infra/
  environments/
    staging/
    production/
  modules/
.github/
  workflows/
docs_agent/
docs_agent_ja/
```

## Start Here

- Read `docs/portal/01_AWS_PORTAL_START_GUIDE.md`
- Follow `docs/portal/02_GITHUB_ISSUE_WORKFLOW.md`
- Use the issue bodies under `docs/portal/issues/`
- Before closing any checklist issue, sync the GitHub Issue body from the matching local file and verify the checklist state on GitHub

## GitHub Resources

- Project: [MultiCloudProject Portal](https://github.com/users/PLAYER1-r7/projects/2)
- Issue list: [Open planning issues](https://github.com/PLAYER1-r7/MultiCloudProject/issues)

## Planning Issues

1. [#1 新規ポータルのプロダクト定義を確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/1)
2. [#2 MVP スコープを確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/2)
3. [#3 認証方針と保護範囲を確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/3)
4. [#4 初期 AWS アーキテクチャを決定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/4)
5. [#5 既存アプリとの境界を定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/5)
6. [#6 フロントエンド技術選定を確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/6)
7. [#7 バックエンドと永続化方針を決定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/7)
8. [#8 マルチクラウド設計制約を定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/8)
9. [#9 IaC 方針を確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/9)
10. [#10 CI/CD 方針を確定する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/10)
11. [#11 セキュリティ ベースラインを定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/11)
12. [#12 監視方針を定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/12)
13. [#13 テスト戦略を定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/13)
14. [#14 ロールバック方針を定義する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/14)
15. [#15 実装バックログを作成する](https://github.com/PLAYER1-r7/MultiCloudProject/issues/15)

## Notes

- Initial cloud target: AWS
- Planned expansion target: Azure and GCP
- GitHub operations are expected to run from the devcontainer using GitHub CLI
- Implementation now starts under `apps/portal-web`, `infra/`, and `.github/workflows`

## Implementation Seeds

- Frontend scaffold: `apps/portal-web`
- AWS delivery foundation placeholder: `infra/`
- CI and staging workflow placeholder: `.github/workflows`
