## Summary

Issue 76 で primary email pointer の current favorite は local text generator に絞られ、required inputs、allowed derived data、required output、operator invocation shape は固定できた。次段では、その contract を崩さない single-run local generator draft を execution issue として切り出し、manual compose fallback、validation shape、template compatibility を fail-closed に追跡する必要がある。

## Goal

AWS primary email pointer local text generator の execution issue を管理し、Issue 71 の primary email pointer template に適合する stdout-only generator draft、operator invocation rule、fallback condition、validation shape を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-77
- Title: AWS primary email pointer local text generator execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production alert pointer generator execution
- Priority: medium
- Predecessor: Issue 41 closed, Issue 44 closed, Issue 45 closed, Issue 69 closed, Issue 71 closed, Issue 76 closed

Objective
- Problem to solve: Issue 76 で local text generator の boundary は fixed したが、operator が local shell で single-run 実行できる generator text、manual compose fallback、validation shape、template compatibility はまだ execution issue として追跡されていない
- Expected value: Issue 71 の primary email pointer template に貼り付けられる subject と body text block を stdout に生成する generator draft と operator rule を 1 件で追跡し、current canonical first-response path を崩さずに next implementation review を進められる

Scope
- In scope: local generator draft、required inputs の受け渡し形、fixed Alert Type validation、subject/body output、manual compose fallback、validation steps、operator usage note
- Out of scope: live email sending automation、provider-native integration、CloudWatch/SNS implementation、mail client automation、approval log migration、24x7 staffing expansion
- Editable paths: docs/portal/issues/issue-77-aws-primary-email-pointer-local-text-generator-execution.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: generator draft が Issue 76 contract と矛盾せず、required inputs と allowed derived data を明示している
- [x] AC-2: generator output が Issue 71 の primary email pointer template と fixed Alert Type rule に接続できる
- [x] AC-3: operator invocation rule、manual compose fallback、validation shape が読める
- [x] AC-4: live sending automation、provider integration、approval log migration を含まない execution issue に留まっている

Implementation Plan
- Files likely to change: issue-77 only
- Approach: Issue 76 の local text generator contract をそのまま引き継ぎ、single-run shell generator draft、operator invocation note、expected output block、fallback rule、validation steps を execution record として固定する
- Alternative rejected and why: provider-native send へ直行する案は live delivery boundary と retention responsibility を広げすぎるため採らない。manual compose のまま据え置く案も Alert Type label と Issue / Reference Path の drift を十分に下げられないため第一候補にしない

Validation Plan
- Commands to run: get_errors on issue-77 markdown; local dry-run of the generator with reviewed sample inputs only; read back the output shape against Issue 71 template order and fixed Alert Type rule
- Expected results: generator が subject と body text block を出力し、Issue 71 template 順序、fixed Alert Type rule、stdout-only boundary が読み取れる
- Failure triage path: Issue 71 の primary email pointer template と Issue 76 の generator contract を再照合し、input validation、field order、template wording のどこが崩れたか切り分ける

Risk and Rollback
- Risks: generator draft が live send path や approval log の代替に誤読されること
- Impact area: alert routing discipline, incident traceability, operator review path
- Mitigation: generator を stdout-only、single-run、operator-invoked に限定し、manual compose fallback と non-goals を併記する
- Rollback: generator output が Issue 71 template と fixed Alert Type rule を満たさない場合は generator candidate を保留し、manual compose on fixed email template を fallback として維持する
```

## Tasks

- [x] local generator draft を current contract に沿って固定する
- [x] expected output block と field order を Issue 71 template に接続する
- [x] manual compose fallback と operator usage note を固定する
- [x] local dry-run の validation evidence を記録する

## Definition of Done

- [x] current favorite draft と contract boundary が 1 文書で読める
- [x] output shape と field order が predecessor template / rule set に接続している
- [x] operator invocation、fallback、validation shape が読める
- [x] live integration、provider access、automation expansion が非対象のまま維持されている

## Initial Notes

- Issue 71 は current phase の live candidate を repository owner-managed email destination のみに絞り、primary email pointer template と fixed Alert Type labels を固定した
- Issue 76 は local text generator for email pointer を current favorite とし、required inputs、allowed derived data、required output、operator invocation shape、gate を固定した
- current phase で許容されるのは reviewed inputs を operator が明示的に与え、subject と body text block を stdout に出して mail client へ貼り付ける single-run generator までである

## Execution Baseline Draft

- generator は local shell invocation のみを前提とし、mail client、workflow trigger、background service を前提にしない
- generator への入力は operator が reviewed values として明示的に与える
- generator は stdout に subject と body text block を出力するだけとし、issue record、run record、mail client を直接編集しない
- current issue record と deploy evidence path は generator 実行前に operator が開いて確認済みであることを前提にする
- output が Issue 71 template と fixed Alert Type rule を満たさない場合は generator candidate を保留し、manual compose on fixed email template へ戻る

## Local Text Generator Draft

```sh
alert_type="${alert_type:?set alert_type}"
run_url="${run_url:?set run_url}"
issue_reference_path="${issue_reference_path:?set issue_reference_path}"
artifact_pointer="${artifact_pointer:-N/A}"

case "$alert_type" in
  deploy-failure|post-deploy-verification-failure|manual-check-required|delivery-path-warning)
    ;;
  *)
    echo "invalid alert_type: $alert_type" >&2
    exit 1
    ;;
esac

subject_prefix="[portal-web][aws-production] alert pointer"
operator_next_check="open deploy evidence path and verify current status"
generated_at_utc="$(date -u '+%Y-%m-%d %H:%M UTC')"

cat <<EOF
Subject: ${subject_prefix}

Alert Type: ${alert_type}
Run URL: ${run_url}
Issue / Reference Path: ${issue_reference_path}
Artifact Pointer: ${artifact_pointer}
Operator Next Check: ${operator_next_check}
Note: this email is a pointer only; canonical incident truth and approval remain in deploy evidence path
Generated At UTC: ${generated_at_utc}
EOF
```

Generator rule:

- required inputs は reviewed values が揃っている場合にだけ与える
- `alert_type` は Issue 71 の fixed labels 以外を許容しない
- generator output は pointer draft であり、approval suggestion、incident diagnosis、acknowledgement request を含めない
- `artifact_pointer` が未確定でも推測値を書かず、`N/A` のまま出力する

## Expected Output Shape

Issue 71 の primary email pointer template に接続する出力は次の順序を維持する。

1. Subject
2. Alert Type
3. Run URL
4. Issue / Reference Path
5. Artifact Pointer
6. Operator Next Check
7. Note
8. Generated At UTC

Usage rule:

- operator は generator output をそのまま canonical incident record として使わず、current issue record と deploy evidence path を確認したうえで mail client に貼り付ける
- field が欠ける場合や Alert Type が fixed labels に一致しない場合は generator output を採用せず、manual compose on fixed email template に戻る

## Operator Invocation Note

operator は次の順で実行する。

1. current issue record と deploy evidence path を開き、reviewed values が確定していることを確認する
2. local shell で required inputs を明示的に設定する
3. generator を single-run 実行し、stdout に出た subject と body text block を確認する
4. Issue 71 の primary email pointer template と fixed Alert Type rule に照合する
5. mail client に貼り付けるか、条件未達なら manual compose fallback に切り替える

Invocation example:

```sh
alert_type="deploy-failure" \
run_url="https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/12345678901" \
issue_reference_path="docs/portal/issues/issue-77-aws-primary-email-pointer-local-text-generator-execution.md" \
artifact_pointer="portal-production-deployment-record" \
sh -c '
alert_type="${alert_type:?set alert_type}"
run_url="${run_url:?set run_url}"
issue_reference_path="${issue_reference_path:?set issue_reference_path}"
artifact_pointer="${artifact_pointer:-N/A}"
case "$alert_type" in
  deploy-failure|post-deploy-verification-failure|manual-check-required|delivery-path-warning)
    ;;
  *)
    echo "invalid alert_type: $alert_type" >&2
    exit 1
    ;;
esac
subject_prefix="[portal-web][aws-production] alert pointer"
operator_next_check="open deploy evidence path and verify current status"
generated_at_utc="$(date -u "+%Y-%m-%d %H:%M UTC")"
cat <<EOF
Subject: ${subject_prefix}

Alert Type: ${alert_type}
Run URL: ${run_url}
Issue / Reference Path: ${issue_reference_path}
Artifact Pointer: ${artifact_pointer}
Operator Next Check: ${operator_next_check}
Note: this email is a pointer only; canonical incident truth and approval remain in deploy evidence path
Generated At UTC: ${generated_at_utc}
EOF
'
```

## Manual Compose Fallback

- reviewed values のいずれかが未確定なら generator を実行しない
- `alert_type` が fixed labels に一致しない場合は generator を使わず、manual compose on fixed email template に戻る
- output field order が崩れた場合、または template rule で fail した場合は generator candidate を current phase では採用しない

## Operator Validation Checklist

operator は generator 実行後、mail client へ貼り付ける前に次を順に確認する。

- [ ] required inputs が reviewed values として揃っている
- [ ] `alert_type` が fixed labels のいずれか 1 つに一致する
- [ ] output が Issue 71 の primary email pointer template と同順序になっている
- [ ] output に approval suggestion、provider-specific raw payload、acknowledgement request が含まれていない
- [ ] `artifact_pointer` 未確定時に `N/A` を維持し、推測で補完していない

Checklist rule:

- 1 項目でも満たせない場合は generator output を送信用下書きに使わず、manual compose on fixed email template に戻る
- checklist 完了は incident acknowledgement や approval log を意味せず、pointer-only email draft の確認完了だけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Email Pointer Generator Validation

- Issue: #77
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed Inputs Ready: yes | no
- Alert Type Valid: yes | no
- Field Order Match: yes | no
- Non-Goal Content Excluded: yes | no
- Artifact Pointer Preserved: yes | no
- Result: pass | fallback-to-manual-compose
- Note: checklist completion confirms pointer-only email draft readiness; it does not acknowledge the incident or replace approval logging
```

Combined completed comment:

```text
Email Pointer Generator Validation

- Issue: #77
- Validation Timestamp: 2026-03-10 07:10 UTC
- Reviewed Inputs Ready: yes
- Alert Type Valid: yes
- Field Order Match: yes
- Non-Goal Content Excluded: yes
- Artifact Pointer Preserved: yes
- Result: pass
- Note: checklist completion confirms pointer-only email draft readiness; it does not acknowledge the incident or replace approval logging
```

## Parent Map Alignment Refresh Comment

Issue 69 追加後の alert branch alignment を GitHub issue comment に 1 回で残す場合は、次の block を使う。

```text
Email Pointer Generator Parent Map Alignment Refresh

- Issue: #77
- Refresh Timestamp: 2026-03-10 12:35 UTC
- Parent Map Issue: #69
- Parent Map Entry Point Confirmed: yes
- Stdout-Only Generator Boundary Preserved: yes
- Manual Compose Fallback Preserved: yes
- Live Email Sending Still Out Of Scope: yes
- Result: pass
- Note: parent map alignment confirms Issue 77 remains the alert execution entry point; it does not authorize live email sending or approval logging changes
```

## Dry-Run Evidence

- local dry-run は sample reviewed inputs を用いて実行し、Issue 71 の primary email pointer template と同順序の subject と body text block を stdout に出力できることを確認した
- `alert_type=deploy-failure`、sample run URL、current issue record path、artifact pointer を与えた dry-run では fixed subject prefix、Issue / Reference Path、pointer-only note、Generated At UTC footer がすべて出力された
- terminal 表示上の折り返しはあっても generator 自体は shell built-ins と `date` だけで完結し、mail client や issue record を直接更新しない stdout-only boundary を維持した

## Non-Goals

- live email sending automation
- provider-native alert integration
- CloudWatch/SNS implementation
- mail client automation
- approval log migration
- staffing expansion or acknowledgement SLA

## Current Sync State

- GitHub body | dry-run evidence、primary validation comment、parent-map alignment refresh comment を含む current local record | synced 状態
- Boundary | stdout-only generator と manual compose fallback | 維持中

## Current Status

- CLOSED
- GitHub Issue: #77
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/77
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/77#issuecomment-4030471233
- Recorded alignment refresh comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/77#issuecomment-402997838

- Issue 76 の local text generator contract を execution issue として切り出した
- generator draft、output shape、operator invocation note、manual compose fallback、validation checklist を current phase boundary 内で整理した
- local dry-run で subject と body text block の shape を確認した
- current phase では stdout-only の local single-run generator に限定し、live sending や provider-native integration への拡張は保留している
