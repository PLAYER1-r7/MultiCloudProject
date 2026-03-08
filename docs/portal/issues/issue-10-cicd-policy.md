## Summary

build、test、deploy の流れを事前に設計しないと、後から品質と承認フローを組み込むのが難しくなる。

## Goal

GitHub Actions を前提にした最小の CI/CD フローを定義する。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-10
- タイトル: CI/CD 方針の初期整理
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: planning
- 優先度: 高

目的
- 解決する問題: build、test、staging deploy、production deploy の責務と接続順を先に定め、後続の workflow 実装と承認運用が場当たり化しないようにする
- 期待する価値: Issue 11、Issue 12、Issue 13、Issue 18 が同じ delivery flow を前提に議論できるようにする

スコープ
- 含むもの: GitHub Actions を前提にした validation と deploy の分離、branch 起点、approval gate、state locking decision checkpoint、workflow 設計メモの議論たたき台
- 含まないもの: 実 workflow 実装、クラウド credential 設定、実 deploy 実行、production release 実施
- 編集可能パス: docs/portal/issues/issue-10-cicd-policy.md
- 制限パス: apps/, infra/, .github/workflows/

受け入れ条件
- [x] 条件 1: CI/CD の最小フローについて、branch、trigger、gate、stop condition を分けて議論開始できる状態になっている

実装計画
- 変更見込みファイル: docs/portal/issues/issue-10-cicd-policy.md
- アプローチ: Issue 9 の IaC 前提と docs/portal/12_CICD_POLICY_DRAFT.md の方針を束ね、staging 先行かつ production gate 維持の最小 flow を issue ローカルの議論記録として整理する
- 採用しなかった代替案と理由: workflow 名や YAML 詳細を先に固定する案は、まだ未確定の branch/gate/state locking 判断を隠しやすいため採らない

検証計画
- 実行するテスト: git status --short; GH_PAGER=cat gh issue view 10 --repo PLAYER1-r7/MultiCloudProject --json number,state,title,updatedAt,url
- 確認するログ/メトリクス: TBD
- 失敗時の切り分け経路: Issue 9 と docs/portal/12_CICD_POLICY_DRAFT.md に戻り、IaC 前提・production hold 条件・workflow_run 制約の読み違いがないかを確認する

リスクとロールバック
- 主なリスク: automation 可能な範囲と human approval が必要な範囲を混同し、production 前提を早く確定しすぎること
- 影響範囲: CI/CD 実装方針、Issue 11/12/13 の前提条件、Issue 18 の staging foundation 具体化
- 緩和策: staging 先行、production gate 維持、未確定事項の明示、stop condition の先出しを徹底する
- ロールバック手順: 提案が過剰または実装前提に寄りすぎると判明した場合は、production 部分を placeholder に戻し、validation と staging path だけを残して再整理する
```

## Tasks

- [x] build フローを定義する
- [x] test フローを定義する
- [x] staging deploy フローを定義する
- [x] production deploy フローを定義する
- [x] branch 起点を整理する
- [x] approval gate を整理する
- [x] production apply 前提の state locking decision checkpoint を整理する
- [x] workflow 設計メモを作成する

## Definition of Done

- [x] build と test の最小実行フローが分離して説明されている
- [x] staging deploy の起動条件と対象ブランチ方針が整理されている
- [x] production deploy に承認ゲートがあることが明示されている
- [x] validation と deploy の workflow 役割分担が説明されている
- [x] Issue 9 から引き継いだ state locking の decision checkpoint と stop condition が明示されている
- [x] GitHub Actions を前提にした運用フローが 1 本の流れとして説明できる
- [x] Issue 11 と Issue 12 の前提条件として参照できる

## Issue 10 Discussion Draft

このセクションは、Issue 10 の議論を始めるためのたたき台である。Issue 9 により、reviewable な IaC change、environment 分離、production gate 維持、state locking の後続判断という前提はすでに固定されている。したがって Issue 10 の主題は「何でも自動化すること」ではなく、「どこまでを GitHub Actions で自動化し、どこからを approval-gated に止めるか」を staging 起点で整理することである。

### 1. 現時点の前提整理

- 初回リリースの実装対象は portal-web と AWS-first delivery path であり、runtime multi-cloud deploy はまだスコープ外である
- Issue 7 の結論により、初回リリースは static-first であり、custom API と application persistence は前提にしない
- Issue 9 の結論により、infrastructure change は reviewable な code change を基本経路とし、production は gate 条件が揃うまで staging 停止線を越えない
- [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) では GitHub Actions、stage 分離、manual production approval、workflow_run 制約、state locking 未解決による staging 止まりがすでに示されている
- docs_agent の guardrail では main を通常の開発ブランチとして扱わず、production 影響や rollback 不明の作業は hard stop になる

### 2. 今回まず固定したい CI/CD の分離軸

提案:

- validation と deploy を別 workflow に分ける
- staging と production を別 workflow に分ける
- build artifact と deploy approval を別の責務として扱う
- branch policy と environment gate を同じ論点として混ぜない

この切り分けを採る理由:

- build と test は code change の妥当性確認であり、deploy は environment 変更の責務を持つため、同一 workflow に押し込むと失敗原因と承認境界が曖昧になる
- staging と production は rollback expectation、approval owner、state handling が異なるため、最初から同一 workflow にしない方が安全である
- artifact を一度固定してから deploy へ渡す形にしておくと、Issue 14 の rollback policy や Issue 18 の staging foundation に接続しやすい

### 3. build フローのたたき台

提案:

- pull request を既定の review 経路とし、relevant change では build を必ず走らせる
- 初回リリースの build は portal-web の static asset 生成成功を最低条件とする
- infrastructure code が deploy workflow と結び付き始めた時点で、infra validate は build/test とは別に導入する

現時点の第一案:

- build workflow は application artifact を作る責務に絞る
- build 成功は deploy 可能性の必要条件だが、deploy 実行そのものとは分離する
- rollback を見据えて build artifact の保持期間と参照元を後続で定義する

### 4. test フローのたたき台

提案:

- test は build とは別に扱い、minimum validation signal を返す workflow とする
- 初期段階では full-suite を前提にせず、build success、静的検証、最小 smoke 相当へ寄せる
- test の pass 結果が staging deploy 候補 commit を作るが、それだけで production promotion は許可しない

現時点の第一案:

- pull_request では build と最低限の validation を自動実行する
- staging 合格条件や deploy 後確認の詳細は Issue 13 と接続し、Issue 10 では「validation workflow と deploy workflow を分ける」ことを先に固定する

### 5. branch 起点と trigger のたたき台

提案:

- feature branch からの pull request を既定の変更導線とする
- main は review 済み変更を集約する integration branch として扱い、任意 feature branch から直接 deploy しない
- staging deploy の起点は main 上の review 済み commit に限定する
- production deploy は main 上の staging 検証済み commit だけを候補にする

trigger 方向の第一案:

- pull_request to main: build と validation のみ
- push to main: deploy 候補 commit の確定、必要に応じて artifact publish
- workflow_dispatch on main: staging deploy の手動起点として当面維持する
- workflow_run or equivalent chained trigger: default-branch 制約を理解した上で、main 上の成功済み validation を staging deploy に接続する候補として検討する
- production deploy: manual dispatch または environment approval を伴う明示的起動のみ

この案で避けたいこと:

- feature branch でそのまま staging/production を触ること
- validation workflow と deploy workflow を一体化し、default-branch 上でしか再現できない振る舞いを見えにくくすること

### 6. staging deploy フローのたたき台

提案:

- 初回の自動化目標は staging delivery までに留める
- staging deploy は review 済み main commit からだけ起動する
- 初期段階では manual dispatch path を残し、workflow behavior と environment secret の検証が済んだ後に自動化度を上げる

現時点の第一案:

- staging deploy は validation success の後段に置く
- deploy 後に最低限の到達性確認または smoke confirmation を要求する
- deploy と post-deploy check の証跡は、Issue 12 と Issue 13 が要求する monitoring/test 基準へ接続できる形で残す

### 7. production deploy フローのたたき台

提案:

- production deploy workflow は staging とは別責務で定義する
- production promotion は explicit approval がある場合だけ許可する
- 初期段階では production workflow を「存在させるが常用しない guarded path」または「placeholder document path」に留める

production で追加したい gate:

- 単一の named approver が明示されていること
- rollback target と artifact retention expectation が決まっていること
- post-deploy verification owner が明示されていること
- domain と certificate の運用モデルが external DNS coordination を含めて説明できること
- state locking decision checkpoint が close していること

### 8. approval gate と責務分離のたたき台

提案:

- build と basic validation は自動実行でよい
- staging deploy は automation 寄りでよいが、environment secret と deploy 権限は制御する
- production deploy は GitHub Environment などで approval gate を強制する

現時点の第一案:

- reviewer は code と workflow 変更の妥当性を確認する
- approver は production promotion 実行の判断を担う
- human re-agreement と issue close approval は別物として扱う
- Issue 10 では committee ではなく single named approver 前提でよい

### 9. state locking decision checkpoint と stop condition のたたき台

Issue 9 から引き継ぐ前提:

- state locking の最終方式はこの issue ではまだ固定されていない
- ただし production entry 前の必須決定事項として扱うことは合意済みである

提案する checkpoint:

- production apply を workflow に載せる前に、remote state backend と locking mechanism を明示する
- locking の未解決状態では、production workflow は存在しても apply 実行不可にする
- staging は remote state 分離が確認できていれば先行できる

現時点での stop condition:

- state locking decision が未確定
- production rollback target が未定義
- production artifact retention rule が未定義
- approver role が未割当
- external DNS と certificate cutover 手順が未整理
- production secrets / environment gate が未構成

### 10. Issue 11 / 12 / 13 への接続観点

- Issue 11 では secret の置き場所、GitHub Environment、監査可能な approval trail を CI/CD 前提として扱う
- Issue 12 では deploy 後確認、failure notification、一次対応経路を staging / production の workflow 境界に沿って設計する
- Issue 13 では pull_request validation、staging 合格条件、post-deploy check をどこまで automation に含めるかを具体化する
- Issue 18 では Issue 10 で分けた validation / staging deploy / production gate の責務をそのまま workflow 実装へ落とし込む

### 11. workflow 設計メモのたたき台

最小構成の第一案:

- validation workflow: pull_request で build と最小 test を実行する
- artifact workflow または main integration step: main 上の review 済み commit を deploy 候補として固定する
- staging deploy workflow: main の成功済み候補を staging へ反映する
- production deploy workflow: explicit approval 後にだけ起動可能とする

初期リリースの流れ:

```text
feature branch -> pull request -> build -> validation -> merge to main -> staging deploy -> staging check -> explicit approval -> production deploy
```

### 12. この場で確認したい論点

| Question                                                                                                      | Provisional direction (at draft time)                                                 | Resolution confirmed wording                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| staging deploy は main への merge 後に自動実行まで進めるか、それとも当面は manual dispatch を正規経路とするか | 当面は main 起点の manual dispatch を正規経路として残し、自動連結は後続で段階導入する | `staging deploy の正規経路は main 上の review 済み commit を対象にした manual dispatch とし、自動連結は workflow 検証後に段階導入する`                      |
| production の起動単位は main 上の特定 commit か release tag か                                                | 初期段階は main 上の staging 検証済み commit を明示指定する方向が単純                 | `初期段階の production promotion 単位は release tag ではなく、staging 検証済みの main commit とする`                                                        |
| staging 環境にも reviewer gate を入れるか                                                                     | 初期段階は reviewer gate なしでよいが、権限と secrets は絞る                          | `staging には reviewer approval gate を置かず、代わりに deploy 権限と environment secret へのアクセスを制御する`                                            |
| artifact retention をどの期間・どの保存先で持つか                                                             | rollback の参照元になる最小保持期間を production 導入前に決める                       | `deploy candidate artifact は commit 単位で再取得可能な保存先に保持し、少なくとも current candidate と latest known-good artifact を次の正常版確認まで残す` |
| state locking はどの方式を採り、production apply のどの gate に結び付けるか                                   | production 前の必須 checkpoint とし、Issue 10 では未決のまま stop condition へ置く    | `state locking 方式の最終選定は infra 実装側で確定するが、production apply 前の必須 gate とし、未確定の間は workflow から apply を許可しない`               |
| external DNS と certificate cutover を production workflow にどこまで織り込むか                               | workflow 完結を前提にせず、初期段階は手順と approval gate の明示を優先する            | `external DNS と certificate cutover は workflow 完結を前提にせず、production 承認後の明示的な operator step と確認記録を必須にする`                        |

## Resolution

Issue 10 の判断結果は次の通りとする。

- initial CI/CD policy は GitHub Actions を標準 automation path とし、build、validation、deploy を分離した stage 構成を採る
- validation workflow は pull_request to main を既定起点とし、portal-web の build 成功と最小 validation signal を返す責務を持つ
- build workflow は deploy 実行ではなく application artifact 生成を担当し、deploy 可能性の前提条件として扱う
- staging deploy の正規経路は main 上の review 済み commit を対象にした manual dispatch とし、自動連結は workflow behavior と environment 設定の検証後に段階導入する
- production promotion 単位は release tag ではなく、staging 検証済みの main commit とする
- staging には reviewer approval gate を置かず、deploy 権限と environment secret へのアクセス制御で安全性を担保する
- production deploy は staging と別 workflow に分離し、explicit approval がある場合だけ起動可能とする
- production promotion 前には single named approver、rollback target、artifact retention expectation、post-deploy verification owner、external DNS coordination、state locking decision checkpoint がそろっていなければならない
- deploy candidate artifact は commit 単位で再取得可能な保存先に保持し、少なくとも current candidate と latest known-good artifact を次の正常版確認まで残す
- state locking 方式の最終選定は infra 実装側で確定するが、production apply 前の必須 gate とし、未確定の間は workflow から apply を許可しない
- external DNS と certificate cutover は workflow 完結を前提にせず、production 承認後の明示的な operator step と確認記録を必須にする
- first-release の実用 flow は `feature branch -> pull request -> build -> validation -> merge to main -> staging deploy -> staging check -> explicit approval -> production deploy` とする

この合意案で明確になること:

- Issue 18 は validation workflow、artifact handoff、staging deploy を main 起点で実装できる
- Issue 11 は GitHub Environment、secret 配置、approval trail を production gate 前提で設計できる
- Issue 12 と Issue 13 は staging check、post-deploy verification、failure notification を workflow 境界に沿って具体化できる
- Issue 14 は artifact retention と rollback target の詳細を production 導入前提の必須条件として扱える

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 10 final review, the local issue record is the primary evidence source. [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) is supporting background and synchronized policy text, not the sole proof of checklist completion.

### Task Mapping

| Checklist item                                                         | Primary evidence section                                                                                                                                                                                        | Why this is the evidence                                                                                                                                                               | Review state              |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `build フローを定義する`                                               | `3. build フローのたたき台`, `Resolution`, and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                                                                                       | These sections define build as an artifact-producing workflow, separate it from deploy execution, and tie it to the minimum static delivery requirements.                              | Accepted for final review |
| `test フローを定義する`                                                | `4. test フローのたたき台`, `11. workflow 設計メモのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                                     | These sections define validation as a separate workflow, keep it lightweight for the first release, and connect it to the candidate commit flow without granting production promotion. | Accepted for final review |
| `staging deploy フローを定義する`                                      | `5. branch 起点と trigger のたたき台`, `6. staging deploy フローのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                       | These sections define main as the staging source, keep manual dispatch as the first safe path, and connect staging checks to downstream monitoring and test work.                      | Accepted for final review |
| `production deploy フローを定義する`                                   | `7. production deploy フローのたたき台`, `8. approval gate と責務分離のたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                  | These sections define production as a separate approval-gated workflow with explicit preconditions rather than a continuation of staging automation.                                   | Accepted for final review |
| `branch 起点を整理する`                                                | `5. branch 起点と trigger のたたき台`, `11. workflow 設計メモのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                          | These sections define feature branch to pull request as the review path, main as the integration branch, and main commit selection as the deployment source.                           | Accepted for final review |
| `approval gate を整理する`                                             | `7. production deploy フローのたたき台`, `8. approval gate と責務分離のたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                  | These sections define where approval is required, distinguish reviewer from approver responsibilities, and keep staging and production risk controls separate.                         | Accepted for final review |
| `production apply 前提の state locking decision checkpoint を整理する` | `9. state locking decision checkpoint と stop condition のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md) | These sections keep state locking as a required production gate, define fail-closed behavior, and preserve staging progress without allowing speculative production apply.             | Accepted for final review |
| `workflow 設計メモを作成する`                                          | `Issue 10 Discussion Draft`, `11. workflow 設計メモのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                                    | Together these sections provide the minimum workflow split, trigger model, approval boundary, and first-release sequence needed as a design memo for implementation.                   | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                                   | Primary evidence section                                                                                                                                                                                        | Why this is the evidence                                                                                                                                   | Review state              |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `build と test の最小実行フローが分離して説明されている`                                         | `3. build フローのたたき台`, `4. test フローのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                                           | These sections separate artifact generation from validation and show how each contributes to the release path.                                             | Accepted for final review |
| `staging deploy の起動条件と対象ブランチ方針が整理されている`                                    | `5. branch 起点と trigger のたたき台`, `6. staging deploy フローのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                       | These sections define main as the controlled source branch and manual dispatch as the initial safe execution path.                                         | Accepted for final review |
| `production deploy に承認ゲートがあることが明示されている`                                       | `7. production deploy フローのたたき台`, `8. approval gate と責務分離のたたき台`, and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                                                | These sections explicitly require named approval and separate production execution from staging automation.                                                | Accepted for final review |
| `validation と deploy の workflow 役割分担が説明されている`                                      | `2. 今回まず固定したい CI/CD の分離軸`, `11. workflow 設計メモのたたき台`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md)                         | These sections describe validation, artifact handoff, and deploy as distinct responsibilities with separate triggers.                                      | Accepted for final review |
| `Issue 9 から引き継いだ state locking の decision checkpoint と stop condition が明示されている` | `9. state locking decision checkpoint と stop condition のたたき台`, `12. この場で確認したい論点`, and `Resolution` in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md) | These sections map the unresolved locking decision to a mandatory production precondition and list the stop conditions that keep the workflow fail-closed. | Accepted for final review |
| `GitHub Actions を前提にした運用フローが 1 本の流れとして説明できる`                             | `11. workflow 設計メモのたたき台`, `Resolution`, and `First-Release Practical Flow` in [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                                               | These sections provide one continuous sequence from feature branch through production promotion.                                                           | Accepted for final review |
| `Issue 11 と Issue 12 の前提条件として参照できる`                                                | `10. Issue 11 / 12 / 13 への接続観点`, `Resolution`, and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md)                                                                             | These sections connect CI/CD boundaries to security, monitoring, and test planning inputs.                                                                 | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-10-cicd-policy.md](docs/portal/issues/issue-10-cicd-policy.md), with [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) used as synchronized supporting policy text. The table below records the document-level validation judgment. Human close approval remains a separate action.

| Checklist area                    | Final judgment | Evidence basis                                                                                                                                                                                                                       |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build and validation split        | Satisfied      | `3. build フローのたたき台`, `4. test フローのたたき台`, and `Resolution` confirm that build and validation are distinct workflows with separate responsibilities.                                                                   |
| Staging trigger and branch policy | Satisfied      | `5. branch 起点と trigger のたたき台`, `6. staging deploy フローのたたき台`, and `Resolution` confirm main-based staging dispatch after review.                                                                                      |
| Production gate policy            | Satisfied      | `7. production deploy フローのたたき台`, `8. approval gate と責務分離のたたき台`, and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) confirm explicit production approval and separate responsibilities. |
| Workflow role separation          | Satisfied      | `2. 今回まず固定したい CI/CD の分離軸`, `11. workflow 設計メモのたたき台`, and `Resolution` confirm separate validation, artifact, staging, and production paths.                                                                    |
| State locking checkpoint          | Satisfied      | `9. state locking decision checkpoint と stop condition のたたき台`, `12. この場で確認したい論点`, and `Resolution` confirm that state locking is a fail-closed production gate.                                                     |
| End-to-end operational flow       | Satisfied      | `11. workflow 設計メモのたたき台`, `Resolution`, and the synchronized first-release flow in [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) define one continuous path.                                   |
| Downstream planning readiness     | Satisfied      | `10. Issue 11 / 12 / 13 への接続観点`, `Resolution`, and [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) confirm that later security, monitoring, rollback, and workflow work can build on this policy.   |

## Current Status

- [docs/portal/12_CICD_POLICY_DRAFT.md](docs/portal/12_CICD_POLICY_DRAFT.md) を CI/CD 判断の同期先として扱う
- local issue file には task contract、discussion draft、resolution、evidence mapping、final review result を追加済み
- staging deploy は main 起点の manual dispatch を正規経路とし、自動連結は後続の workflow 検証後に段階導入する方針で確定した
- production promotion 単位は staging 検証済み main commit とし、release tag 前提にはしない
- staging reviewer gate は不要だが、environment secret と deploy 権限の制御は必須とした
- artifact retention は current candidate と latest known-good artifact を commit 単位で再取得可能に保持する前提で確定した
- state locking は production apply 前の必須 gate とし、未確定の間は apply 不可とする方針を明記した
- external DNS と certificate cutover は workflow の外にある明示的 operator step として扱う方針で確定した
- final checkbox review は完了し、Tasks と Definition of Done は満了と判断した

## Dependencies

- Issue 6
- Issue 7
- Issue 9
