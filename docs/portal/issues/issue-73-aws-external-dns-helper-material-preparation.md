## Summary

Issue 70 で current phase の external DNS assistive automation は credential-free、read-only な helper material preparation から始めるべきだと固定した。一方で、reviewed target、certificate-related reference、TTL baseline、public DNS resolution evidence をどの format で束ね、どこに review path を置き、stale helper output をどう fail-closed に扱うかは未固定である。このままだと helper automation を導入しても、転記揺れを減らす前に evidence path が増えるだけになりやすい。

## Goal

read-only helper material preparation の format、review path、staleness handling、operator-facing template、usage example、review checklist、execution-ready gate、non-goals を固定し、external DNS governance を崩さない execution-preparation issue にする。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-73
- Title: AWS external DNS helper material preparation を整理する
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS helper preparation
- Priority: medium
- Predecessor: Issue 42 closed, Issue 46 closed, Issue 70 open

Objective
- Problem to solve: read-only helper material を使う判断はできたが、何を 1 つの helper material に束ねるか、どこを canonical review path にするか、stale output をどう fail-closed に扱うかが未固定である
- Expected value: helper material format と review discipline を固定し、credential を持たない evidence assembly だけで transcription drift を減らせる

Scope
- In scope: helper material field set、canonical review path、staleness handling、fallback rule、operator-facing template、usage example、review checklist、operator paste-back procedure、execution-ready gate、future split condition
- Out of scope: live DNS write、provider credentials live registration、provider API execution、Route 53 migration、workflow implementation、incident-time emergency automation
- Editable paths: docs/portal/issues/issue-73-aws-external-dns-helper-material-preparation.md, docs/portal/issues/issue-70-aws-external-dns-assistive-automation-follow-up.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: helper material に含める field set と canonical review path が読める
- [x] AC-2: stale helper output の fail-closed rule と fallback が current DNS governance と矛盾しない
- [x] AC-3: operator が current review path に貼り戻せる template、usage example、review checklist が読める
- [x] AC-4: execution-ready に進める前の operator paste-back procedure と gate が読める
- [x] AC-5: credentials、API execution、live DNS change を含めない preparation issue に留まっている

Implementation Plan
- Files likely to change: issue-73, issue-70
- Approach: Issue 42 の operator memo と Issue 70 の follow-up direction を入力に、helper material を field set / review path / stale handling / template / usage example / review checklist / execution-ready gate の 8 観点で具体化する
- Alternative rejected and why: helper script implementation を先に決める案は format と review path が固まる前に implementation drift を招くため採らない

Validation Plan
- Commands to run: get_errors on issue-73 and issue-70 markdown
- Expected results: helper material format、usage example、review checklist、operator paste-back procedure、execution-ready gate が明示される
- Failure triage path: Issue 42 と Issue 70 の evidence / helper wording を再照合し、field set、review path、template、checklist、gate 欠落のどこに不足があるかを切り分ける

Risk and Rollback
- Risks: helper material の議論が automation implementation や approval shortcut と誤読されること
- Impact area: DNS governance, operator review discipline
- Mitigation: helper material を read-only evidence assembly に限定し、approval boundary と live write authority を明示的に除外する
- Rollback: scope が広がりすぎた場合は field set と stale handling だけを残し、future implementation split は別 issue に移す
```

## Tasks

- [x] helper material field set を整理する
- [x] canonical review path を整理する
- [x] stale helper output の fail-closed rule を整理する
- [x] operator-facing template を整理する
- [x] usage example を整理する
- [x] review checklist を整理する
- [x] operator paste-back procedure を整理する
- [x] execution-ready gate を整理する
- [x] future implementation split 条件を整理する

## Definition of Done

- [x] helper material の field set が 1 文書で読める
- [x] review path と stale fallback が current operator path に接続されている
- [x] operator が貼り戻しに使える template、usage example、review checklist が 1 文書で読める
- [x] operator paste-back procedure と execution-ready gate が 1 文書で読める
- [x] credentials、API execution、live DNS write が非対象のまま維持されている

## Initial Notes

- Issue 42 は current operator memo として before/after target、TTL、verification evidence の記録を要求している
- Issue 46 は external DNS source-of-truth 維持、operator-assist only automation、authoritative write prohibition を current judgment として固定している
- Issue 70 は read-only helper material preparation を next execution split として切り出すべきだと固定している

## Issue 73 Discussion Draft

### 1. helper material の最小 field set

提案:

- helper material には reviewed CloudFront target、certificate-related reference、TTL baseline、public DNS resolution result、current timestamp、source evidence reference を含める
- live change を伴う場合に必要な before/after target comparison は field として持てても、helper 自体は値の提案や record write を行わない
- output format は operator が current review path にそのまま貼り戻せる markdown か plain text block を前提にする

### 2. canonical review path の第一案

提案:

- canonical review path は既存の operator review path、すなわち issue record と related deploy / DNS evidence path に戻す
- helper material は独立した source-of-truth を名乗らず、reviewed values を current operator memo に再掲するための補助に留める
- helper output を保存する場所は separate datastore ではなく issue / handoff record を第一候補にする

### 3. stale handling の第一案

提案:

- helper output には generation timestamp と source evidence reference を必須にする
- reviewed evidence path と値が衝突した場合、helper output は stale と判断して破棄し、manual reviewed values を優先する
- stale 判定時に live DNS change や approval path を止める fail-closed rule を明記する

### 4. future implementation split の第一案

提案:

- この issue の後続は helper script 実装ではなく、helper material template と operator usage example を定義するかどうかの比較に留める
- provider credential registration、provider API read、live write integration はさらに別 issue と approval boundary を要求する

### 5. Open Questions

Resolution を書く段階では、この表の `Resolution 確定文言` 列を埋めてから使うこと。

| 論点                                      | 判断方向（Discussion 時点の仮）                                                   | Resolution 確定文言                                                                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| helper material に何を含めるか            | target、certificate、TTL、public resolution、timestamp、source reference を含める | `helper material は reviewed CloudFront target、certificate-related reference、TTL baseline、public DNS resolution result、generation timestamp、source evidence reference を含む`  |
| canonical review path をどこに置くか      | current operator review path に戻す                                               | `helper material の canonical review path は current operator review path に置き、issue record と related evidence path へ貼り戻せる補助出力として扱う`                             |
| stale helper output をどう扱うか          | reviewed evidence と衝突したら破棄し fail-closed に止める                         | `helper output が reviewed evidence path と衝突した場合は stale と判断して破棄し、manual reviewed values を優先したうえで live DNS change や approval path を fail-closed に止める` |
| before/after target comparison を含めるか | field として持てるが write proposal にしない                                      | `before/after target comparison は helper material の field として持てても、live write proposal や automatic change batch には使わない`                                             |
| 次の implementation split をどう置くか    | template/example と credentialed integration を分ける                             | `future implementation split は helper material template / usage example と、provider credentials / API / live write integration を含む separate issue に分ける`                    |

## Resolution

Issue 73 の判断結果は次の通りとする。

- helper material は reviewed CloudFront target、certificate-related reference、TTL baseline、public DNS resolution result、generation timestamp、source evidence reference を含む
- helper material の canonical review path は current operator review path に置き、issue record と related evidence path へ貼り戻せる補助出力として扱う
- helper output が reviewed evidence path と衝突した場合は stale と判断して破棄し、manual reviewed values を優先したうえで live DNS change や approval path を fail-closed に止める
- before/after target comparison は helper material の field として持てても、live write proposal や automatic change batch には使わない
- future implementation split は helper material template / usage example と、provider credentials / API / live write integration を含む separate issue に分ける

この合意で明確になること:

- current phase の helper material は evidence assembly のみを担い、operator memo や approval boundary を置き換えない
- helper output の timestamp と source evidence を必須にすることで、古い値を incident や cutover に持ち込むリスクを減らせる
- field set を固定してから template / example へ進めるため、実装前に review path を安定させられる
- credentials や provider API を含む deeper automation はこの issue の外に残り、別承認でしか進まない

## Helper Material Template Draft

helper material は current operator review path に貼り戻せる最小フォーマットとして、次の markdown block を基準に扱う。

```text
AWS External DNS Helper Material

- Record Name: www.aws.ashnova.jp
- Reviewed CloudFront Target: <distribution-domain>
- Certificate-Related Reference: <reviewed-certificate-reference>
- TTL Baseline: <seconds>
- Public DNS Resolution Result: <resolver result summary>
- Before Target Comparison: <optional current-public-target-or-N/A>
- Generation Timestamp: <UTC timestamp>
- Source Evidence Reference: <issue/evidence path or command log reference>
- Review Note: helper output only; authoritative DNS write and approval remain manual
```

Template rule:

- Record Name は current change target を 1 行で識別できる値に固定する
- Reviewed CloudFront Target、Certificate-Related Reference、TTL Baseline は reviewed values の再掲に限り、proposal 値を含めない
- Public DNS Resolution Result は resolver、返却値、観測時点が読める summary にする
- Before Target Comparison は comparison 用の任意欄とし、unknown なら `N/A` のまま残す
- Generation Timestamp と Source Evidence Reference は stale 判定の必須欄とする
- Review Note は helper output が approval boundary ではないことを毎回明示する

## Operator Usage Example

operator が issue record や handoff note に貼り戻す usage example は次の形を基準にする。

```text
AWS External DNS Helper Material

- Record Name: www.aws.ashnova.jp
- Reviewed CloudFront Target: d168agpgcuvdqq.cloudfront.net
- Certificate-Related Reference: ACM certificate review recorded in production distribution evidence
- TTL Baseline: 3600
- Public DNS Resolution Result: Google Public DNS observed www.aws.ashnova.jp -> d168agpgcuvdqq.cloudfront.net
- Before Target Comparison: d168agpgcuvdqq.cloudfront.net
- Generation Timestamp: 2026-03-10T00:00:00Z
- Source Evidence Reference: Issue 42 production DNS evidence and current operator review note
- Review Note: helper output only; authoritative DNS write and approval remain manual
```

Usage rule:

- helper material は separate datastore に保存せず、issue record、handoff note、related evidence path のいずれかへ貼り戻す
- operator は helper material を貼る前に reviewed values と source evidence reference の一致を確認する
- helper output と reviewed evidence が衝突した場合は stale と判断し、helper output を破棄して manual reviewed values に戻す
- stale 判定が発生した時点で live DNS change と approval path は停止し、helper material の再生成より先に current evidence path を更新する
- helper material は cutover shortcut や live write proposal の代替として使わない

## Review Checklist Draft

helper material を current operator review path に貼り戻す前に、次の checklist を上から順に確認する。

- Record Name が current change target と一致している
- Reviewed CloudFront Target が reviewed distribution evidence と一致している
- Certificate-Related Reference が current review note で追跡できる
- TTL Baseline が current operator memo の記録値と一致している
- Public DNS Resolution Result に resolver、返却値、観測時点が含まれている
- Generation Timestamp が stale でないと判断できる時刻である
- Source Evidence Reference が current issue record か related evidence path を指している
- Before Target Comparison が unknown の場合は `N/A` のままで、推定値で埋められていない
- Review Note に helper output only と manual approval boundary が明記されている
- helper output と reviewed evidence に差分がない、または差分があれば stale として破棄済みである
- live DNS change、approval、incident shortcut に転用される wording が含まれていない

Checklist rule:

- 1 項目でも不一致があれば helper material は未承認の補助出力として扱い、manual reviewed values を優先する
- stale 判定が出た場合は helper material を evidence として保持せず、re-generated output より先に source evidence を再確認する
- checklist は helper script の成功判定ではなく、operator review の fail-closed gate として使う

## Operator Paste-Back Procedure Draft

operator が current issue record へ helper material を貼り戻す場合は、次の最小手順を順に使う。

1. reviewed distribution evidence、TTL baseline、source evidence reference を先に開く
2. helper material template に reviewed values だけを転記する
3. review checklist を上から順に確認し、不一致があれば helper material を破棄する
4. current issue record の所定位置へ helper material block を貼り戻す
5. paste-back 後に helper material が pointer only であり、manual approval boundary を置き換えていないことを再確認する

Procedure rule:

- paste-back 先は current issue record を第一優先とし、handoff note は current issue record が未整備の場合にのみ一時的に使う
- paste-back 前に reviewed values が未確定なら helper material を作らず、source evidence path の更新を先に行う
- paste-back 後に stale が判明した場合は helper material block を evidence として残さず、current issue record から除外または stale 扱いを明示する
- procedure 完了は DNS change approval を意味せず、review-ready material の準備完了だけを意味する

## Execution-Ready Gate Draft

Issue 73 が execution-ready に進めるのは、次の gate をすべて満たした場合に限る。

- helper material template が current issue record に貼り戻せる形で確定している
- review checklist の全項目を満たす reviewed values が source evidence path から取得できる
- current issue record が Issue / Reference Path として使える状態に整っている
- helper material が pointer only であり、manual approval boundary を置き換えないことが確認できる
- credentials、provider API、live DNS write を要求しないまま execution-ready step に進める

Gate outcome:

- gate を満たした場合は read-only helper material preparation を execution-ready candidate とみなす
- gate を満たさない場合は implementation へ進まず、source evidence path または current issue record の不足を先に解消する
- gate 通過後も live DNS write や provider API execution は separate issue と separate approval boundary に残す

Current child follow-up:

- Issue 74: helper material implementation comparison

## Current Status

- CLOSED
- GitHub Issue: #73
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/73
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation

- read-only helper material preparation を Issue 70 の後続として切り出した
- helper material field set、review path、stale handling、future split condition を current DNS governance と整合する形で固定した
- operator が current review path に貼り戻せる helper material template と usage example を追加した
- operator review の fail-closed gate として使う checklist を追加した
- execution-ready に進む前の operator paste-back procedure と gate 条件を追加した
- implementation comparison の child follow-up として Issue 74 を追加した
