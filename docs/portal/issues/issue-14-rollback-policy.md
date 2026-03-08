## Summary

MVP でも失敗時に安全に戻せることが必要であり、アプリとインフラの切り戻し方法を事前に定める必要がある。

## Goal

配信物、インフラ、DNS、認証設定の切り戻し方針を定義する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-14
- タイトル: ロールバック方針を定義する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: planning
- 優先度: 高

目的
- 解決する問題: 初回リリースで障害や誤設定が起きたときに、何をどの単位で戻し、何を確認すれば復旧と判断できるかが曖昧なままだと、production gate と incident response が場当たり化する
- 期待する価値: application artifact、IaC、DNS/delivery path、operator access の rollback unit と trigger を整理し、Issue 18 と後続運用判断が参照できる最小 rollback baseline を固定できる

スコープ
- 含むもの: application artifact rollback、infrastructure rollback、DNS/delivery path rollback、operator access / deployment credential rollback、post-rollback verification、recovery time 目線、rollback 手順の議論たたき台
- 含まないもの: 実 rollback 実装、runbook 自動化、DNS/certificate 本番操作、incident command 体制設計、production release 実施
- 編集可能パス: docs/portal/issues/issue-14-rollback-policy.md
- 制限パス: apps/, infra/, .github/workflows/

受け入れ条件
- [ ] 条件 1: first-release rollback baseline が artifact / infrastructure / delivery path / access / verification / recovery target の層で整理され、Issue 18 と Issue 15 の判断基準として参照できる状態になっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-14-rollback-policy.md
- アプローチ: docs/portal/16_ROLLBACK_POLICY_DRAFT.md を基礎に、Issue 9 の IaC rollback 前提、Issue 10 の production gate、Issue 11 の secret and audit baseline、Issue 12 の monitoring signal、Issue 13 の acceptance failure を接続して issue ローカルの議論記録へ整理する
- 採用しなかった代替案と理由: 障害対応手順を製品や CLI レベルまで先に詳細化する案は、first-release で何を rollback unit として扱うかより先に実装詳細へ寄りやすいため採らない

検証計画
- 実行するテスト: git status --short; GH_PAGER=cat gh issue view 14 --repo PLAYER1-r7/MultiCloudProject --json number,state,title,updatedAt,url
- 確認するログ/メトリクス: TBD
- 失敗時の切り分け経路: docs/portal/16_ROLLBACK_POLICY_DRAFT.md、docs/portal/issues/issue-09-iac-policy.md、docs/portal/issues/issue-10-cicd-policy.md、docs/portal/issues/issue-12-monitoring-policy.md、docs/portal/issues/issue-13-test-strategy.md に戻り、rollback trigger・acceptance failure・production gate の責務境界を混同していないかを確認する

リスクとロールバック
- 主なリスク: 初回リリースに対して過剰に複雑な rollback flow を要求し、実行可能性の低い机上手順だけが増えること
- 影響範囲: production gate、artifact retention、state handling、incident recovery judgment、Issue 18 workflow design
- 緩和策: small-team で実行可能な last-known-good restore を優先し、artifact / IaC / DNS / access の rollback unit を分けて扱う
- ロールバック手順: rollback baseline が広すぎる、または production 前提を先取りしすぎていると判明した場合は、first-release 必須 rollback unit と later-phase hardening を再分離して整理し直す
```

## Tasks

- [x] アプリ配信物のロールバック方針を定義する
- [x] インフラ変更のロールバック方針を定義する
- [x] DNS 変更のロールバック方針を定義する
- [x] 運用アクセスと credential のロールバック方針を定義する
- [x] 復旧確認方法を定義する
- [x] 想定復旧時間を整理する
- [x] ロールバック手順書を作成する

## Definition of Done

- [x] アプリ配信物を前回の正常版へ戻す手順と単位が整理されている
- [x] IaC を前提にしたインフラ切り戻し方針と例外時の扱いが説明されている
- [x] DNS または配信経路の変更を戻す判断手順が整理されている
- [x] 運用アクセス、deployment credential、environment secret の切り戻し対象範囲が明示されている
- [x] ロールバック後に実施する最小復旧確認フローが説明されている
- [x] 初回リリースにおける実用的な想定復旧時間の目線が整理されている
- [x] インシデント時の復旧判断材料として参照できる状態になっている

## Issue 14 Discussion Draft

このセクションは、Issue 14 の議論を始めるためのたたき台である。Issue 9 により、infrastructure change は reviewable な IaC change を基本経路とし、staging と production は state、config、approval path を分離し、production は rollback target と state locking を含む gate が閉じるまで placeholder に留めることが整理された。Issue 10 では production promotion には explicit approval が必要であり、rollback target、artifact retention、post-deploy verification owner が production gate に含まれることが整理された。Issue 11 では deploy、infra change、approval、operator step を追跡できる audit evidence と、secret exposure 時の rotate and invalidate 優先が確定し、Issue 12 と Issue 13 では monitoring signal、staging smoke、post-deploy verification、acceptance failure の境界が固定された。したがって Issue 14 の主題は「すべてを自動 rollback すること」ではなく、「first-release で何を rollback unit として扱い、どの signal で rollback 開始を判断し、何をもって復旧確認とするか」を整理することである。

### 1. 現時点の前提整理

- 初回リリースは public-first、static-first portal であり、custom API、login-required route、persistent user data は前提にしない
- forward change の主経路は review 済み code change、GitHub Actions、staging deploy、explicit production approval であり、rollback も原則として同じ責務境界に沿って考える必要がある
- Issue 9 により、IaC rollback は ad hoc console operation ではなく、steady state を IaC に戻す経路を前提にする
- Issue 10 により、production へ進む前に rollback target と artifact retention expectation が必要である
- Issue 11 により、auth rollback の対象は end-user login ではなく operator access と deployment credential が中心であり、secret exposure 時は feature work より先に rotate and invalidate を優先する
- Issue 12 により、site unreachable、failed deploy、major route failure、production cutover 後の operator action 必要イベントが first-release の主要 alert signal である
- Issue 13 により、build、pre-deploy validation、staging smoke、post-deploy verification、major flow confirmation の failure は production 候補を止める判断材料である

### 2. 今回まず固定したい rollback baseline の分離軸

提案:

- application artifact rollback と infrastructure rollback を分ける
- delivery path rollback と DNS rollback を分ける
- operator access / deployment credential rollback を end-user auth rollback と混同しない
- rollback trigger、rollback execution、post-rollback verification を分ける

この切り分けを採る理由:

- static-first portal では application artifact の切り戻しと IaC の切り戻しが同じ速度で実行できるとは限らず、unit を分けた方が containment と復旧を判断しやすい
- DNS、certificate、CDN behavior の rollback は application build failure と異なる propagation や operator step を持つため、ひとまとめにすると手順が曖昧になる
- first-release に end-user login がないため、auth rollback の主対象は operator access と deployment credential であり、scope を小さく保てる

### 3. application artifact rollback 方針のたたき台

提案:

- application rollback unit は previously validated artifact または last known-good deployment version とする
- rollback は新 build の再生成を前提にせず、既知の正常版を再適用できることを優先する
- production promotion 前に current candidate と latest known-good artifact の参照先が明示されている必要がある

現時点の第一案:

- static portal の rollback unit は last known-good static artifact とする
- failed deploy、major route failure、obvious asset breakage が application rollback の主 trigger 候補になる
- artifact rollback 実行後は top page、主要 route、主要 static asset の復旧確認を必須にする

### 4. infrastructure rollback 方針のたたき台

提案:

- infrastructure rollback は forward change と同じ IaC control path に戻すことを正規経路とする
- containment のための emergency manual fix は許容しても、steady state は code へ還元する
- rollback scope は full environment reversion と limited resource correction を分けて扱う

現時点の第一案:

- rollback 対象は S3/CloudFront/static delivery baseline を中心とし、resource 単位で correction する場合でも IaC へ戻すことを前提にする
- state locking 未確定の production apply は forward path と同様に guarded path とし、rollback 時も uncontrolled apply を正規手順にしない
- infra rollback 後は deploy path、public reachability、security-relevant config drift が解消したかを確認する

### 5. DNS と delivery path rollback 方針のたたき台

提案:

- DNS、certificate、CDN behavior の変更は適用前に reversal path を持つことを必須にする
- delivery path rollback は public route の到達性を最優先にし、certificate / cache / origin misroute を分けて考える
- TTL や propagation は rollback 実行後ではなく、判断時点で見積もる

現時点の第一案:

- external DNS と certificate cutover は Issue 10 の operator step 前提を引き継ぎ、rollback でも明示的 operator action と確認記録を必須にする
- site unreachable、certificate 問題、wrong origin delivery は delivery-path rollback の主 trigger 候補になる
- cache invalidation や distribution behavior の戻しは artifact rollback と別手順として扱う

### 6. 認証設定とアクセス rollback 方針のたたき台

提案:

- first-release に end-user auth がないため、auth rollback は operator access、deployment credential、environment secret を対象にする
- secret exposure が疑われる場合は availability 回復より先に rotate/invalidate が必要なケースを明示する
- unmanaged emergency credential を増やさず、approved access path を維持する

現時点の第一案:

- GitHub Environment secret、cloud access credential、operator access grant が rollback / recovery 対象になる
- credential rollback は previous secret value へ安易に戻すより、rotate and invalidate を基本経路とする
- access rollback 後は deploy 実行権限、audit trail、operator access の正常性を確認する

### 7. rollback trigger と開始判断のたたき台

提案:

- rollback trigger は monitoring signal、acceptance failure、security incident、operator judgment を分けて扱う
- failed deploy や verification failure が常に即 rollback とは限らないため、containment と restore の判断を分ける
- production rollback は explicit owner が開始判断を行う

現時点の第一案:

- site unreachable、major route failure、wrong content delivery、certificate/DNS 問題、security-relevant secret exposure は rollback 開始候補 signal とする
- staging では Issue 13 の acceptance failure を release stop 条件として扱い、production では rollback 開始候補 signal として再解釈する
- production cutover 後の operator action 必要イベントは rollback 判断を要する signal として扱う

### 8. post-rollback verification と証跡のたたき台

提案:

- rollback 後には短い verification checklist を必須にする
- verification は public reachability、major route health、asset delivery、必要に応じて security baseline を確認する
- rollback の trigger、実行、復旧確認を reviewable な証跡として残す

現時点の第一案:

- `/`、`/overview`、`/guidance` の reachability と major route health を確認する
- obvious asset breakage、wrong delivery target、header/certificate misconfiguration が解消したかを確認する
- GitHub workflow history、cloud-native audit log、operator record を rollback 証跡の中心にする

### 9. recovery time 目線のたたき台

提案:

- first-release では abstract SLA よりも、small-team が実行可能な practical recovery target を置く
- artifact restore、infra correction、DNS propagation の時間特性を同一視しない
- long-running rollback step は production 前に明示する

現時点の第一案:

- artifact rollback は最短で戻せる経路として扱い、IaC correction や DNS propagation はより長い recovery path として分ける
- recovery time の目線は minutes-to-restore と longer propagation window を区別して説明する
- rollback target と owner が未整理の変更は production へ進めない条件として扱う

### 10. Issue 9 / 10 / 11 / 12 / 13 / 18 への接続観点

- Issue 9 の environment isolation と IaC control path を前提に、Issue 14 は rollback でも code-first steady state を維持する
- Issue 10 の production gate は rollback target、artifact retention、operator step を前提にしており、Issue 14 はそれを recovery path として具体化する
- Issue 11 の secret posture と auditability は credential rollback と post-incident traceability の前提になる
- Issue 12 の monitoring signal は rollback 開始候補 signal の入力になる
- Issue 13 の acceptance failure と verification rule は、staging stop 条件と production rollback 判断の境界整理に使う
- Issue 18 は artifact handoff、staging deploy、post-deploy check を実装する際に、Issue 14 の rollback unit と evidence expectation を参照できる必要がある

### 11. この場で確認したい論点

`Resolution 確定文言` 列が埋まっていない行がある場合は Resolution セクションを書いてはならない。

| 論点                                                                 | 判断方向（Discussion 時点の仮）                                                                                                                              | Resolution 確定文言                                                                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| first-release の application rollback unit を何に置くか              | last known-good static artifact または previously validated deployment version を rollback unit とし、新 build 再生成ではなく既知の正常版 restore を優先する | `first-release の application rollback unit は last known-good static artifact または previously validated deployment version とし、新 build 再生成ではなく既知の正常版 restore を優先する`  |
| IaC rollback をどこまで manual fix で許容するか                      | containment のための一時 manual fix は許容しても、steady state は IaC へ還元することを必須にし、manual fix を正規経路にしない                                | `IaC rollback では containment のための一時 manual fix は許容しても、steady state は IaC へ還元することを必須にし、manual fix を正規経路にしない`                                            |
| DNS / certificate / delivery path rollback の主 trigger を何に置くか | site unreachable、wrong content delivery、certificate 問題、wrong origin route、production cutover 後の重大 delivery 異常を主 trigger 候補とする             | `DNS / certificate / delivery path rollback の主 trigger は site unreachable、wrong content delivery、certificate 問題、wrong origin route、production cutover 後の重大 delivery 異常とする` |
| auth rollback の範囲をどこまでに限定するか                           | end-user auth は前提にせず、operator access、deployment credential、environment secret を対象にし、secret exposure は rotate and invalidate を優先する       | `first-release の auth rollback 対象は end-user auth ではなく operator access、deployment credential、environment secret とし、secret exposure では rotate and invalidate を優先する`        |
| post-rollback verification の必須確認を何にするか                    | `/`、`/overview`、`/guidance` の reachability、major route health、asset delivery、必要に応じた security baseline 確認を必須にする                           | `post-rollback verification では `/`、`/overview`、`/guidance` の reachability、major route health、asset delivery、必要に応じた security baseline 確認を必須にする`                         |
| recovery time の目線をどう置くか                                     | artifact restore と longer propagation window を分け、rollback target と owner が未整理の変更は production に進めない条件とする                              | `recovery time は artifact restore と propagation-dependent recovery を分けて扱い、rollback target と owner が未整理の変更は production に進めない条件とする`                                |

## Working Direction

この段階での整理案は次の通り。

- first-release rollback policy は application artifact、infrastructure、delivery path、operator access、post-rollback verification を分けて整理する
- application rollback unit は last known-good static artifact を基本とし、新 build 再生成ではなく既知の正常版 restore を優先する
- infrastructure rollback は forward change と同じ IaC control path を正規経路とし、manual fix は containment に限定して steady state を code に戻す
- DNS / certificate / CDN behavior rollback は explicit operator step と確認記録を必須にし、TTL と propagation を判断時点で考慮する
- auth rollback は end-user login ではなく operator access、deployment credential、environment secret の restore / rotate / invalidate を中心に扱う
- post-rollback verification は public reachability、major route health、asset delivery、必要に応じた security baseline 確認を短い checklist で実施する
- recovery time は artifact restore と propagation-dependent recovery を分け、rollback target と owner が未整理の変更は production へ進めない条件とする

この整理案で議論しやすくなること:

- Issue 10 の production gate に含まれる rollback target と operator step を、recoverable な実行単位として定義できる
- Issue 11 の secret exposure と auditability を rollback policy に接続できる
- Issue 12 の monitoring signal と Issue 13 の acceptance failure を、rollback 開始判断へ接続しやすくなる
- Issue 18 は artifact handoff、deploy、verification の実装時に recovery expectation を前提として残せる

## Resolution

Issue 14 の判断結果は次の通りとする。

- first-release の application rollback unit は last known-good static artifact または previously validated deployment version とし、新 build 再生成ではなく既知の正常版 restore を優先する
- IaC rollback では containment のための一時 manual fix は許容しても、steady state は IaC へ還元することを必須にし、manual fix を正規経路にしない
- DNS / certificate / delivery path rollback の主 trigger は site unreachable、wrong content delivery、certificate 問題、wrong origin route、production cutover 後の重大 delivery 異常とする
- first-release の auth rollback 対象は end-user auth ではなく operator access、deployment credential、environment secret とし、secret exposure では rotate and invalidate を優先する
- post-rollback verification では `/`、`/overview`、`/guidance` の reachability、major route health、asset delivery、必要に応じた security baseline 確認を必須にする
- recovery time は artifact restore と propagation-dependent recovery を分けて扱い、rollback target と owner が未整理の変更は production に進めない条件とする

この合意で明確になること:

- Issue 10 の production gate に含まれる rollback target、artifact retention、operator step を recovery path として参照できる
- Issue 11 の secret exposure、auditability、operator access control を rollback policy に接続できる
- Issue 12 の monitoring signal と Issue 13 の acceptance failure を、rollback 開始判断と post-rollback verification へ接続できる
- Issue 18 は artifact handoff、deploy、verification を実装する際に recovery expectation を前提として残せる

## Process Review Notes

- direct-decision: Section 11 の論点は個別の逐次回答ログではなく、requester が first-release rollback baseline の方向性に合意した後に Resolution へ統合する形で確定した。
- Section 11 の論点テーブルは open question と final wording の対応を後から追跡できるように維持し、3 列目は candidate wording ではなく Resolution に反映された確定文言として扱う。
- Resolution 追加時点では planning / draft 段階として扱い、rollback baseline の方針合意記録と final checkbox review を分離して管理した。その後、Issue 15 の implementation backlog と Issue 18 の staging workflow 実装がこの baseline を参照できることを再確認し、明示的な close 承認に基づいて final review を完了した。

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 14 final review, the local issue record is the primary evidence source. [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) is synchronized supporting background, [docs/portal/issues/issue-15-implementation-backlog.md](docs/portal/issues/issue-15-implementation-backlog.md) shows that rollback readiness remains a tracked follow-on workstream, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirms that delivery automation preserves artifact handoff and post-deploy verification assumptions used by this rollback baseline.

### Task Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `アプリ配信物のロールバック方針を定義する` | `3. application artifact rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) | These sections define the rollback unit as the last known good artifact or deployment version and explain the restore-first policy. | Accepted for final review |
| `インフラ変更のロールバック方針を定義する` | `4. infrastructure rollback 方針のたたき台` and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections define IaC-first rollback, containment-only manual fixes, and steady-state reconciliation back into code. | Accepted for final review |
| `DNS 変更のロールバック方針を定義する` | `5. DNS と delivery path rollback 方針のたたき台` and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections define the trigger set and the operator-confirmed reversal path for DNS, certificate, and delivery-path failures. | Accepted for final review |
| `運用アクセスと credential のロールバック方針を定義する` | `6. 認証設定とアクセス rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) | These sections define the first-release auth rollback scope around operator access and deployment credentials, with rotate-and-invalidate as the default for secret exposure. | Accepted for final review |
| `復旧確認方法を定義する` | `8. post-rollback verification と証跡のたたき台` and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections define the mandatory short verification checklist and the evidence sources required after rollback. | Accepted for final review |
| `想定復旧時間を整理する` | `9. recovery time 目線のたたき台` and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections separate fast artifact restore from longer propagation-dependent recovery and keep owner clarity tied to production readiness. | Accepted for final review |
| `ロールバック手順書を作成する` | `2. 今回まず固定したい rollback baseline の分離軸`, `7. rollback trigger と開始判断のたたき台`, `8. post-rollback verification と証跡のたたき台`, `10. Issue 9 / 10 / 11 / 12 / 13 / 18 への接続観点`, and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections organize the rollback baseline into an executable first-release policy that separates trigger, execution, and verification. | Accepted for final review |

### Definition Of Done Mapping

| Checklist item | Primary evidence section | Why this is the evidence | Review state |
| -------------- | ------------------------ | ------------------------ | ------------ |
| `アプリ配信物を前回の正常版へ戻す手順と単位が整理されている` | `3. application artifact rollback 方針のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) | These sections define the rollback unit and show that artifact handoff remains a concrete delivery assumption for later restore. | Accepted for final review |
| `IaC を前提にしたインフラ切り戻し方針と例外時の扱いが説明されている` | `4. infrastructure rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) | These sections define the IaC control path and limit manual fixes to containment instead of normal rollback execution. | Accepted for final review |
| `DNS または配信経路の変更を戻す判断手順が整理されている` | `5. DNS と delivery path rollback 方針のたたき台`, `7. rollback trigger と開始判断のたたき台`, and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections define when to trigger delivery-path rollback and how operator action and propagation concerns affect the decision. | Accepted for final review |
| `運用アクセス、deployment credential、environment secret の切り戻し対象範囲が明示されている` | `6. 認証設定とアクセス rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) | These sections define the access rollback scope and keep secret recovery aligned to rotate-and-invalidate instead of unsafe restore habits. | Accepted for final review |
| `ロールバック後に実施する最小復旧確認フローが説明されている` | `8. post-rollback verification と証跡のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) | These sections define the minimum recovery verification checklist and keep it consistent with the first-release route and asset checks already implemented for staging. | Accepted for final review |
| `初回リリースにおける実用的な想定復旧時間の目線が整理されている` | `9. recovery time 目線のたたき台` and `Resolution` in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md) | These sections define practical recovery expectations by separating fast restore paths from slower propagation-bound recovery. | Accepted for final review |
| `インシデント時の復旧判断材料として参照できる状態になっている` | `7. rollback trigger と開始判断のたたき台`, `8. post-rollback verification と証跡のたたき台`, `10. Issue 9 / 10 / 11 / 12 / 13 / 18 への接続観点`, `Resolution`, and [docs/portal/issues/issue-15-implementation-backlog.md](docs/portal/issues/issue-15-implementation-backlog.md) | These sections connect rollback triggers, evidence, and follow-on operational backlog so the policy can be used during real incident judgment. | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-14-rollback-policy.md](docs/portal/issues/issue-14-rollback-policy.md), with [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) used as synchronized supporting background, [docs/portal/issues/issue-15-implementation-backlog.md](docs/portal/issues/issue-15-implementation-backlog.md) used to confirm follow-on backlog alignment, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) used to confirm artifact handoff and post-deploy verification assumptions. Explicit human close approval is recorded separately.

| Checklist area | Final judgment | Evidence basis |
| -------------- | -------------- | -------------- |
| Application artifact rollback | Satisfied | `3. application artifact rollback 方針のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirm the last-known-good artifact restore baseline and preserve artifact handoff assumptions. |
| Infrastructure rollback posture | Satisfied | `4. infrastructure rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) confirm the IaC-first rollback path and the containment-only role of manual fixes. |
| Delivery-path rollback judgment | Satisfied | `5. DNS と delivery path rollback 方針のたたき台`, `7. rollback trigger と開始判断のたたき台`, and `Resolution` confirm the trigger set and operator-confirmed reversal path for DNS, certificate, and origin-routing failures. |
| Access and credential recovery | Satisfied | `6. 認証設定とアクセス rollback 方針のたたき台`, `Resolution`, and [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) confirm the operator-access-centered recovery scope and the rotate-and-invalidate rule for secret exposure. |
| Post-rollback verification | Satisfied | `8. post-rollback verification と証跡のたたき台`, `Resolution`, and [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) confirm the minimum verification checklist and keep it aligned with implemented staging route checks. |
| Recovery time direction | Satisfied | `9. recovery time 目線のたたき台` and `Resolution` confirm the practical separation between fast artifact restore and slower propagation-bound recovery. |
| Incident-use readiness | Satisfied | `7. rollback trigger と開始判断のたたき台`, `10. Issue 9 / 10 / 11 / 12 / 13 / 18 への接続観点`, [docs/portal/issues/issue-15-implementation-backlog.md](docs/portal/issues/issue-15-implementation-backlog.md), and `Resolution` confirm that the baseline is usable as a real recovery decision reference. |

## Current Status

- [docs/portal/16_ROLLBACK_POLICY_DRAFT.md](docs/portal/16_ROLLBACK_POLICY_DRAFT.md) を rollback judgment の同期先として扱う
- local issue file には task contract、discussion draft、resolution、evidence mapping、final review result を追加済み
- Section 11 の open questions は Resolution 確定文言列で final wording と対応付けた
- application artifact、IaC、delivery path、operator access、post-rollback verification、recovery time の境界は [docs/portal/issues/issue-18-ci-staging-foundation.md](docs/portal/issues/issue-18-ci-staging-foundation.md) が前提として参照できる粒度で固定した
- rollback readiness の follow-on 実装候補は [docs/portal/issues/issue-15-implementation-backlog.md](docs/portal/issues/issue-15-implementation-backlog.md) に接続できる状態である
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した
- 明示的な close 承認に基づき、GitHub Issue 14 は close 対象として扱う

## Dependencies

- Issue 3
- Issue 9
- Issue 10
- Issue 11
- Issue 12
- Issue 13
