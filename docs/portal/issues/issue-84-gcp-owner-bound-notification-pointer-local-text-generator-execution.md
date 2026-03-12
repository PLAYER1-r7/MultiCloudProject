## Summary

Issue 83 で owner-bound external notification uplift の current favorite は local text generator に絞られ、required inputs、allowed derived data、required output、operator invocation shape は固定できた。次段では、その contract を崩さない single-run local generator draft を execution issue として切り出し、manual compose fallback、validation shape、Issue 55 compatibility を fail-closed に追跡する必要がある。

## Goal

GCP owner-bound notification pointer local text generator の execution issue を管理し、Issue 55 の first-response path に適合する stdout-only generator draft、operator invocation rule、fallback condition、validation shape を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-84
- Title: GCP owner-bound notification pointer local text generator execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: GCP preview / retained preview notification pointer generator execution
- Priority: medium
- Predecessor: Issue 55 closed, Issue 68 closed, Issue 80 open, Issue 83 open

Objective
- Problem to solve: Issue 83 で local text generator の boundary は fixed したが、operator が local shell で single-run 実行できる generator text、manual compose fallback、validation shape、Issue 55 compatibility はまだ execution issue として追跡されていない
- Expected value: Issue 55 の first-response path と notification owner rule に貼り付けられる subject と body text block を stdout に生成する generator draft と operator rule を 1 件で追跡し、current canonical first-response path を崩さずに next implementation review を進められる

Scope
- In scope: local generator draft、required inputs の受け渡し形、signal type validation、subject/body output、manual compose fallback、validation steps、operator usage note
- Out of scope: live external delivery automation、provider-native integration、Cloud Monitoring notification channel implementation、mail client automation、approval log migration、24x7 staffing expansion
- Editable paths: docs/portal/issues/issue-84-gcp-owner-bound-notification-pointer-local-text-generator-execution.md, docs/portal/issues/issue-83-gcp-owner-bound-external-notification-uplift-comparison.md, docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/, closed issue records except explicit evidence references

Acceptance Criteria
- [x] AC-1: generator draft が Issue 83 contract と矛盾せず、required inputs と allowed derived data を明示している
- [x] AC-2: generator output が Issue 55 の first-response path と notification owner rule に接続できる
- [x] AC-3: operator invocation rule、manual compose fallback、validation shape が読める
- [x] AC-4: live delivery automation、provider integration、approval log migration を含まない execution issue に留まっている

Implementation Plan
- Files likely to change: issue-84, issue-83, cloud status summary
- Approach: Issue 83 の local text generator contract をそのまま引き継ぎ、single-run shell generator draft、operator invocation note、expected output block、fallback rule、validation steps を execution record として固定する
- Alternative rejected and why: provider-native send へ直行する案は live delivery boundary と retention responsibility を広げすぎるため採らない。manual compose のまま据え置く案も signal label と issue reference の drift を十分に下げられないため第一候補にしない

Validation Plan
- Commands to run: get_errors on issue-84, updated issue-83, updated cloud status summary; local dry-run of the generator with reviewed sample inputs only; read back the output shape against Issue 55 first-response path order and notification owner rule
- Expected results: generator が subject と body text block を出力し、Issue 55 path order、signal type validation、stdout-only boundary が読み取れる
- Failure triage path: Issue 55 の first-response path と Issue 83 の generator contract を再照合し、input validation、field order、template wording のどこが崩れたか切り分ける

Risk and Rollback
- Risks: generator draft が live send path や approval log の代替に誤読されること
- Impact area: monitoring routing discipline, incident traceability, operator review path
- Mitigation: generator を stdout-only、single-run、operator-invoked に限定し、manual compose fallback と non-goals を併記する
- Rollback: generator output が Issue 55 first-response path と notification owner rule を満たさない場合は generator candidate を保留し、manual compose on fixed notification template を fallback として維持する
```

## Tasks

- [x] local generator draft を current contract に沿って固定する
- [x] expected output block と field order を Issue 55 path に接続する
- [x] manual compose fallback と operator usage note を固定する
- [x] local dry-run の validation evidence を記録する

## Definition of Done

- [x] current favorite draft と contract boundary が 1 文書で読める
- [x] output shape と field order が predecessor path / rule set に接続している
- [x] operator invocation、fallback、validation shape が読める
- [x] live integration、provider access、automation expansion が非対象のまま維持されている

## Initial Notes

- Issue 55 は current phase の monitoring primary signal、first-response path、notification owner を固定した
- Issue 83 は local text generator for owner-bound notification pointer を current favorite とし、required inputs、allowed derived data、required output、operator invocation shape、gate を固定した
- current phase で許容されるのは reviewed inputs を operator が明示的に与え、subject と body text block を stdout に出して external destination へ貼り付ける single-run generator までである

## Execution Baseline Draft

- generator は local shell invocation のみを前提とし、mail client、workflow trigger、background service を前提にしない
- generator への入力は operator が reviewed values として明示的に与える
- generator は stdout に subject と body text block を出力するだけとし、issue record、run record、notification destination を直接更新しない
- current issue record と deploy evidence path は generator 実行前に operator が開いて確認済みであることを前提にする
- output が Issue 55 path と signal rule を満たさない場合は generator candidate を保留し、manual compose on fixed notification template へ戻る

## Local Text Generator Draft

```sh
signal_type="${signal_type:?set signal_type}"
run_url="${run_url:-N/A}"
issue_reference_path="${issue_reference_path:?set issue_reference_path}"
artifact_pointer="${artifact_pointer:-N/A}"

case "$signal_type" in
  reachability|deploy-failure|hold-condition)
    ;;
  *)
    echo "invalid signal_type: $signal_type" >&2
    exit 1
    ;;
esac

subject_prefix="[portal-web][gcp-preview] notification pointer"
operator_next_check="open the current issue record and first-response evidence path"
generated_at_utc="$(date -u '+%Y-%m-%d %H:%M UTC')"

cat <<EOF
Subject: ${subject_prefix}

Signal Type: ${signal_type}
Run URL: ${run_url}
Issue / Reference Path: ${issue_reference_path}
Artifact Pointer: ${artifact_pointer}
Operator Next Check: ${operator_next_check}
Note: this notification is a pointer only; canonical first-response evidence remains in the current issue path
Generated At UTC: ${generated_at_utc}
EOF
```

Generator rule:

- required inputs は reviewed values が揃っている場合にだけ与える
- `signal_type` は `reachability`、`deploy-failure`、`hold-condition` 以外を許容しない
- generator output は pointer draft であり、approval suggestion、incident diagnosis、acknowledgement request を含めない
- `artifact_pointer` が未確定でも推測値を書かず、`N/A` のまま出力する

## Expected Output Shape

Issue 55 の first-response path に接続する出力は次の順序を維持する。

1. Subject
2. Signal Type
3. Run URL
4. Issue / Reference Path
5. Artifact Pointer
6. Operator Next Check
7. Note
8. Generated At UTC

Usage rule:

- operator は generator output をそのまま canonical incident record として使わず、current issue record と first-response evidence path を確認したうえで external destination に貼り付ける
- field が欠ける場合や Signal Type が fixed labels に一致しない場合は generator output を採用せず、manual compose on fixed notification template に戻る

## Operator Invocation Note

operator は次の順で実行する。

1. current issue record と first-response evidence path を開き、reviewed values が確定していることを確認する
2. local shell で required inputs を明示的に設定する
3. generator を single-run 実行し、stdout に出た subject と body text block を確認する
4. Issue 55 の first-response path rule と notification owner rule に照合する
5. external destination に貼り付けるか、条件未達なら manual compose fallback に切り替える

Invocation example:

```sh
signal_type="reachability" \
run_url="https://github.com/PLAYER1-r7/MultiCloudProject/actions/runs/22850625525" \
issue_reference_path="docs/portal/issues/issue-84-gcp-owner-bound-notification-pointer-local-text-generator-execution.md" \
artifact_pointer="portal-gcp-preview-deployment-record" \
sh -c '
signal_type="${signal_type:?set signal_type}"
run_url="${run_url:-N/A}"
issue_reference_path="${issue_reference_path:?set issue_reference_path}"
artifact_pointer="${artifact_pointer:-N/A}"
case "$signal_type" in
  reachability|deploy-failure|hold-condition)
    ;;
  *)
    echo "invalid signal_type: $signal_type" >&2
    exit 1
    ;;
esac
subject_prefix="[portal-web][gcp-preview] notification pointer"
operator_next_check="open the current issue record and first-response evidence path"
generated_at_utc="$(date -u "+%Y-%m-%d %H:%M UTC")"
cat <<EOF
Subject: ${subject_prefix}

Signal Type: ${signal_type}
Run URL: ${run_url}
Issue / Reference Path: ${issue_reference_path}
Artifact Pointer: ${artifact_pointer}
Operator Next Check: ${operator_next_check}
Note: this notification is a pointer only; canonical first-response evidence remains in the current issue path
Generated At UTC: ${generated_at_utc}
EOF
'
```

## Manual Compose Fallback

- reviewed values のいずれかが未確定なら generator を実行しない
- `signal_type` が fixed labels に一致しない場合は generator を使わず、manual compose on fixed notification template に戻る
- output field order が崩れた場合、または path rule で fail した場合は generator candidate を current phase では採用しない

## Operator Validation Checklist

operator は generator 実行後、external destination へ貼り付ける前に次を順に確認する。

- [ ] required inputs が reviewed values として揃っている
- [ ] `signal_type` が fixed labels のいずれか 1 つに一致する
- [ ] output が Issue 55 の first-response path と同順序になっている
- [ ] output に approval suggestion、provider-specific raw payload、acknowledgement request が含まれていない
- [ ] `artifact_pointer` 未確定時に `N/A` を維持し、推測で補完していない

Checklist rule:

- 1 項目でも満たせない場合は generator output を通知用下書きに使わず、manual compose on fixed notification template に戻る
- checklist 完了は incident acknowledgement や approval log を意味せず、pointer-only notification draft の確認完了だけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
Notification Pointer Generator Validation

- Issue: #84
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed Inputs Ready: yes | no
- Signal Type Valid: yes | no
- Field Order Match: yes | no
- Non-Goal Content Excluded: yes | no
- Artifact Pointer Preserved: yes | no
- Result: pass | fallback-to-manual-compose
- Note: checklist completion confirms pointer-only notification draft readiness; it does not acknowledge the incident or replace approval logging
```

Sample completed comment:

```text
Notification Pointer Generator Validation

- Issue: #84
- Validation Timestamp: 2026-03-10 09:40 UTC
- Reviewed Inputs Ready: yes
- Signal Type Valid: yes
- Field Order Match: yes
- Non-Goal Content Excluded: yes
- Artifact Pointer Preserved: yes
- Result: pass
- Note: checklist completion confirms pointer-only notification draft readiness; it does not acknowledge the incident or replace approval logging
```

## Combined Completed Comment

GitHub issue comment に 1 回で残す場合は、次の completed block をそのまま使う。

```text
Notification Pointer Generator Validation

- Issue: #84
- Validation Timestamp: 2026-03-10 09:50 UTC
- Reviewed Inputs Ready: yes
- Signal Type Valid: yes
- Field Order Match: yes
- Non-Goal Content Excluded: yes
- Artifact Pointer Preserved: yes
- Result: pass
- Note: checklist completion confirms pointer-only notification draft readiness; it does not acknowledge the incident or replace approval logging
```

## Parent Map Alignment Refresh Comment

Issue 91 追加後の notification branch alignment を GitHub issue comment に 1 回で残す場合は、次の block を使う。

```text
Notification Pointer Parent Map Alignment Refresh

- Issue: #84
- Refresh Timestamp: 2026-03-10 11:45 UTC
- Parent Map Issue: #91
- Parent Map Entry Point Confirmed: yes
- Stdout-Only Boundary Preserved: yes
- Manual Compose Fallback Preserved: yes
- Provider-Native Delivery Still Out Of Scope: yes
- Result: pass
- Note: parent map alignment confirms Issue 84 remains the notification execution entry point; it does not authorize live external delivery or approval logging changes
```

## Dry-Run Evidence

- local dry-run は sample reviewed inputs を用いて実行し、Issue 55 の first-response path と同順序の subject と body text block を stdout に出力できることを確認した
- `signal_type=reachability`、sample run URL、current issue record path、artifact pointer を与えた dry-run では fixed subject prefix、Issue / Reference Path、pointer-only note、Generated At UTC footer がすべて出力された
- terminal 表示上の折り返しはあっても generator 自体は shell built-ins と `date` だけで完結し、notification destination や issue record を直接更新しない stdout-only boundary を維持した

## Non-Goals

- live external delivery automation
- provider-native notification integration
- Cloud Monitoring notification channel implementation
- mail client automation
- approval log migration
- staffing expansion or acknowledgement SLA

## Current Sync State

- GitHub body | completed validation comment、recorded primary comment、parent-map alignment refresh comment を含む current local record | synced 状態
- Boundary | stdout-only generator と manual compose fallback | 維持中

## Current Status

- CLOSED
- GitHub Issue: #84
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/84
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/84#issuecomment-402924411
- Recorded alignment refresh comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/84#issuecomment-402992521

- Issue 83 の local text generator contract を execution issue として切り出した
- generator draft、output shape、operator invocation note、manual compose fallback、validation checklist を current phase boundary 内で整理した
- local dry-run evidence を current issue に記録し、stdout-only single-run generator の shape を固定した
- current phase では stdout-only の local single-run generator に限定し、live sending や provider-native integration への拡張は保留している
