## Summary
MVP をどの AWS 構成で支えるかを早期に絞り込む必要がある。

## Goal
AWS 上での最小構成を 1 案に決定し、採用理由を説明可能にする。

## Tasks
- [ ] S3 の要否を判定する
- [ ] CloudFront の要否を判定する
- [ ] Route 53 の要否を判定する
- [ ] ACM の要否を判定する
- [ ] Cognito の要否を判定する
- [ ] API Gateway の要否を判定する
- [ ] Lambda の要否を判定する
- [ ] DynamoDB の要否を判定する
- [ ] 初期構成図を作成する
- [ ] 採用理由を文書化する

## Definition of Done
- [ ] 初期 AWS 構成が 1 案に絞られ、主要リクエスト経路が説明できる
- [ ] 採用サービスと不採用サービスが理由付きで整理されている
- [ ] S3、CloudFront、ACM、Route 53 の要否が個別に判断されている
- [ ] Cognito、API Gateway、Lambda、DynamoDB を現時点で採用しない理由が整理されている
- [ ] 構成図または同等の構成表現が存在する
- [ ] MVP スコープと認証方針の前提に整合している

## Dependencies
- Issue 2
- Issue 3