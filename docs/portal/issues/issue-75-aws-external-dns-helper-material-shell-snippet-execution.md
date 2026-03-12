## Summary

Issue 74 で operator-invoked shell snippet が current favorite として絞り込まれ、required inputs、allowed derived data、required output、operator invocation shape は固定できた。次段では、その contract を崩さない single-run shell snippet draft を execution issue として切り出し、manual fill fallback、validation shape、paste-back compatibility を fail-closed に追跡する必要がある。

## Goal

AWS external DNS helper material shell snippet の execution issue を管理し、Issue 73 の helper template と review checklist に適合する read-only snippet draft、operator invocation rule、fallback condition、validation shape を一件で固定する。

## Task Contract

```text
Task Contract

Metadata
- Task ID: ISSUE-75
- Title: AWS external DNS helper material shell snippet execution を進める
- Requester: repository owner
- Target App: portal-web
- Environment: AWS production DNS helper shell snippet execution
- Priority: medium
- Predecessor: Issue 42 closed, Issue 46 closed, Issue 70 open, Issue 73 open, Issue 74 open

Objective
- Problem to solve: Issue 74 で shell snippet の boundary は fixed したが、operator が local shell で single-run 実行できる snippet text、manual fill fallback、validation shape、paste-back compatibility はまだ execution issue として追跡されていない
- Expected value: Issue 73 helper template に貼り戻せる text block を read-only に生成する shell snippet draft と operator rule を 1 件で追跡し、current DNS governance を崩さずに next implementation review を進められる

Scope
- In scope: shell snippet draft、required inputs の受け渡し形、public DNS resolution の read-only 取得、Issue 73 template と同順序の出力、manual fill fallback、validation steps、operator usage note
- Out of scope: live DNS write、provider credentials、provider API integration、workflow automation、scheduled execution、issue record direct editing、Route 53 migration
- Editable paths: docs/portal/issues/issue-75-aws-external-dns-helper-material-shell-snippet-execution.md
- Restricted paths: infra/, .github/workflows/, apps/portal-web/

Acceptance Criteria
- [x] AC-1: shell snippet draft が Issue 74 contract と矛盾せず、required inputs と allowed derived data を明示している
- [x] AC-2: snippet output が Issue 73 helper material template と review checklist に接続できる field order を満たしている
- [x] AC-3: operator invocation rule、manual fill fallback、validation shape が読める
- [x] AC-4: provider credentials、API、workflow automation、live DNS write を含まない execution issue に留まっている

Implementation Plan
- Files likely to change: issue-75 only
- Approach: Issue 74 の shell snippet contract をそのまま引き継ぎ、single-run shell snippet draft、operator invocation note、expected output block、fallback rule、validation steps を execution record として固定する
- Alternative rejected and why: repo-local script skeleton へ直行する案は contract surface と maintenance owner を増やしすぎるため採らない。manual fill のまま据え置く案も transcription drift を十分に下げられないため第一候補にしない

Validation Plan
- Commands to run: get_errors on issue-75 markdown; local dry-run of the shell snippet with reviewed sample inputs and public DNS read-only resolution only; read back the output shape against Issue 73 template order and fallback wording
- Expected results: snippet が text block を生成し、Issue 73 template 順序、fallback rule、stdout-only boundary が読み取れる
- Failure triage path: Issue 73 helper template と Issue 74 shell snippet contract を再照合し、input boundary、derived data、output order のどこが崩れたか切り分ける

Risk and Rollback
- Risks: snippet draft が approved live change path や direct issue editing を含むように誤読されること
- Impact area: DNS governance, operator review discipline, execution planning
- Mitigation: snippet を credential-free、read-only、single-run、stdout-only に限定し、manual fill fallback と non-goals を併記する
- Rollback: snippet output が Issue 73 review checklist を満たさない場合は snippet candidate を保留し、manual fill on fixed template を fallback として維持する
```

## Tasks

- [x] shell snippet draft を current contract に沿って固定する
- [x] expected output block と field order を Issue 73 template に接続する
- [x] manual fill fallback と operator usage note を固定する
- [x] local dry-run の validation evidence を記録する

## Definition of Done

- [x] current favorite draft と contract boundary が 1 文書で読める
- [x] output shape と field order が predecessor template / rule set に接続している
- [x] operator invocation、fallback、validation shape が読める
- [x] live integration、provider access、automation expansion が非対象のまま維持されている

## Initial Notes

- Issue 73 は helper material template、review checklist、operator paste-back procedure、execution-ready gate を固定した
- Issue 74 は operator-invoked shell snippet を current favorite とし、required inputs、allowed derived data、required output、operator invocation shape、gate を固定した
- current phase で許容されるのは reviewed inputs を operator が明示的に与え、public DNS resolution を read-only command で補助取得し、Issue 73 互換の text block を stdout に出す single-run snippet までである

## Execution Baseline Draft

- snippet は local shell invocation のみを前提とし、workflow trigger、scheduled execution、background service を前提にしない
- snippet への入力は operator が reviewed values として明示的に与える
- snippet は stdout に helper material text block を出力するだけとし、issue record や handoff file を直接編集しない
- source evidence path は snippet 実行前に operator が開いて確認済みであることを前提にする
- output が Issue 73 review checklist を満たさない場合は snippet candidate を保留し、manual fill on fixed template へ戻る

## Shell Snippet Draft

```sh
record_name="${record_name:?set record_name}"
reviewed_cloudfront_target="${reviewed_cloudfront_target:?set reviewed_cloudfront_target}"
certificate_reference="${certificate_reference:?set certificate_reference}"
ttl_baseline="${ttl_baseline:?set ttl_baseline}"
source_evidence_reference="${source_evidence_reference:?set source_evidence_reference}"

generated_at_utc="$(date -u '+%Y-%m-%d %H:%M UTC')"

if command -v dig >/dev/null 2>&1; then
  current_cname="$(dig +short CNAME "$record_name" @8.8.8.8 | tail -n 1 | sed 's/\.$//')"
  current_a_records="$(dig +short A "$record_name" @8.8.8.8 | paste -sd ', ' -)"
  resolver_status="public-dns-check-available"
else
  current_cname=""
  current_a_records=""
  resolver_status="manual-public-dns-check-required"
fi

if [ "$resolver_status" = "manual-public-dns-check-required" ]; then
  public_dns_resolution_result="manual public DNS check required"
elif [ -n "$current_cname" ]; then
  public_dns_resolution_result="CNAME ${current_cname}"
else
  public_dns_resolution_result="A ${current_a_records:-unresolved}"
fi

if [ "$resolver_status" = "manual-public-dns-check-required" ]; then
  before_target_comparison="manual public DNS check required"
elif [ "$current_cname" = "$reviewed_cloudfront_target" ]; then
  before_target_comparison="matches reviewed target"
elif [ -n "$current_cname" ]; then
  before_target_comparison="differs from reviewed target: ${current_cname}"
else
  before_target_comparison="no public CNAME answer"
fi

cat <<EOF
Helper Material Draft

- Record Name: ${record_name}
- Reviewed CloudFront Target: ${reviewed_cloudfront_target}
- Certificate Reference: ${certificate_reference}
- TTL Baseline: ${ttl_baseline}
- Source Evidence Reference: ${source_evidence_reference}
- Public DNS Resolution Result: ${public_dns_resolution_result}
- Before Target Comparison: ${before_target_comparison}
- Generated At UTC: ${generated_at_utc}
EOF
```

Snippet rule:

- required inputs は reviewed values が揃っている場合にだけ与える
- snippet は `date` と、利用可能なら `dig` を使う read-only local command composition に留める
- snippet output は helper material draft であり、approval suggestion や live change proposal を含めない
- `dig` がない場合は public DNS resolution result を推測で補わず、manual public DNS check required を返して manual fill fallback を促す
- public DNS resolution が unresolved でも snippet は evidence として unresolved を出力し、target value を推測で補わない

## Expected Output Shape

Issue 73 の helper material template と review checklist に接続する出力は次の順序を維持する。

1. Record Name
2. Reviewed CloudFront Target
3. Certificate Reference
4. TTL Baseline
5. Source Evidence Reference
6. Public DNS Resolution Result
7. Before Target Comparison
8. Generated At UTC

Usage rule:

- operator は snippet output をそのまま approval material として使わず、Issue 73 review checklist に照らして reviewed values の整合を確認してから current issue record に paste-back する
- field が欠ける場合は snippet output を採用せず、manual fill on fixed template に戻る

## Operator Invocation Note

operator は次の順で実行する。

1. source evidence path を開き、reviewed values が確定していることを確認する
2. local shell で required inputs を明示的に設定する
3. snippet を single-run 実行し、stdout に出た text block を確認する
4. Issue 73 review checklist と照合する
5. current issue record へ paste-back するか、条件未達なら manual fill fallback に切り替える

Invocation example:

```sh
record_name="www.aws.ashnova.jp" \
reviewed_cloudfront_target="d168agpgcuvdqq.cloudfront.net" \
certificate_reference="acm arn or current reviewed certificate reference" \
ttl_baseline="3600" \
source_evidence_reference="docs/portal/issues/issue-75-aws-external-dns-helper-material-shell-snippet-execution.md" \
sh -c '
generated_at_utc="$(date -u "+%Y-%m-%d %H:%M UTC")"
if command -v dig >/dev/null 2>&1; then
  current_cname="$(dig +short CNAME "$record_name" @8.8.8.8 | tail -n 1 | sed "s/\.$//")"
  current_a_records="$(dig +short A "$record_name" @8.8.8.8 | paste -sd ", " -)"
  resolver_status="public-dns-check-available"
else
  current_cname=""
  current_a_records=""
  resolver_status="manual-public-dns-check-required"
fi
if [ "$resolver_status" = "manual-public-dns-check-required" ]; then
  public_dns_resolution_result="manual public DNS check required"
elif [ -n "$current_cname" ]; then
  public_dns_resolution_result="CNAME ${current_cname}"
else
  public_dns_resolution_result="A ${current_a_records:-unresolved}"
fi
if [ "$resolver_status" = "manual-public-dns-check-required" ]; then
  before_target_comparison="manual public DNS check required"
elif [ "$current_cname" = "$reviewed_cloudfront_target" ]; then
  before_target_comparison="matches reviewed target"
elif [ -n "$current_cname" ]; then
  before_target_comparison="differs from reviewed target: ${current_cname}"
else
  before_target_comparison="no public CNAME answer"
fi
cat <<EOF
Helper Material Draft

- Record Name: ${record_name}
- Reviewed CloudFront Target: ${reviewed_cloudfront_target}
- Certificate Reference: ${certificate_reference}
- TTL Baseline: ${ttl_baseline}
- Source Evidence Reference: ${source_evidence_reference}
- Public DNS Resolution Result: ${public_dns_resolution_result}
- Before Target Comparison: ${before_target_comparison}
- Generated At UTC: ${generated_at_utc}
EOF
'
```

## Manual Fill Fallback

- reviewed values のいずれかが未確定なら snippet を実行しない
- local shell に `dig` がない、または public DNS resolution が current review path と整合しない場合は manual fill on fixed template に戻る
- output field order が崩れた場合、または review checklist で fail した場合は snippet candidate を current phase では採用しない

## Operator Validation Checklist

operator は snippet 実行後、current issue record へ paste-back する前に次を順に確認する。

- [ ] required inputs が reviewed values として揃っている
- [ ] `dig` がある場合は public DNS resolution を read-only で取得できている
- [ ] `dig` がない場合は manual public DNS check required を確認し、manual fill fallback へ切り替える判断ができている
- [ ] output field order が Issue 73 helper material template と一致している
- [ ] output に approval suggestion、provider API action、live DNS write proposal が含まれていない
- [ ] unresolved や mismatch が出た場合も推測で補完せず、そのまま表示されている

Checklist rule:

- 1 項目でも満たせない場合は snippet output を paste-back せず、manual fill on fixed template に戻る
- checklist 完了は DNS change approval を意味せず、review-ready helper material の確認完了だけを意味する

## Operator Comment Template

GitHub issue comment に貼る場合は、最低でも次の形を使う。

```text
DNS Helper Material Validation

- Issue: #75
- Validation Timestamp: YYYY-MM-DD HH:MM UTC
- Reviewed Inputs Ready: yes | no
- Public DNS Check Status: dig-available | manual-public-dns-check-required
- Field Order Match: yes | no
- Non-Goal Content Excluded: yes | no
- Unresolved Or Mismatch Preserved As-Is: yes | no
- Result: pass | fallback-to-manual-fill
- Note: checklist completion confirms review-ready helper material only; it does not approve live DNS change
```

Combined completed comment:

```text
DNS Helper Material Validation

- Issue: #75
- Validation Timestamp: 2026-03-10 07:05 UTC
- Reviewed Inputs Ready: yes
- Public DNS Check Status: manual-public-dns-check-required
- Field Order Match: yes
- Non-Goal Content Excluded: yes
- Unresolved Or Mismatch Preserved As-Is: yes
- Result: pass
- Note: checklist completion confirms review-ready helper material only; it does not approve live DNS change
```

## Parent Map Alignment Refresh Comment

Issue 69 追加後の DNS branch alignment を GitHub issue comment に 1 回で残す場合は、次の block を使う。

```text
DNS Helper Material Parent Map Alignment Refresh

- Issue: #75
- Refresh Timestamp: 2026-03-10 12:30 UTC
- Parent Map Issue: #69
- Parent Map Entry Point Confirmed: yes
- Stdout-Only Snippet Boundary Preserved: yes
- Manual Fill Fallback Preserved: yes
- Live DNS Write Still Out Of Scope: yes
- Result: pass
- Note: parent map alignment confirms Issue 75 remains the DNS execution entry point; it does not authorize live DNS change
```

## Dry-Run Evidence

- local dry-run は sample reviewed inputs を用いて実行し、Issue 73 helper material template と同順序の text block を stdout に出力できることを確認した
- current dev container には `dig` が存在しないため、snippet は `Public DNS Resolution Result: manual public DNS check required` と `Before Target Comparison: manual public DNS check required` を返し、fail-closed fallback wording を維持した
- この結果により、resolver tooling 非搭載環境でも snippet が target value を推測で補完せず、manual fill fallback に戻せることを確認した

## Non-Goals

- live DNS write automation
- provider credentials registration
- provider API integration
- workflow automation or scheduled execution
- issue record direct editing
- Route 53 migration

## Current Sync State

- GitHub body | dry-run evidence、primary validation comment、parent-map alignment refresh comment を含む current local record | synced 状態
- Boundary | stdout-only snippet と manual fill fallback | 維持中

## Current Status

- CLOSED
- GitHub Issue: #75
- GitHub URL: https://github.com/PLAYER1-r7/MultiCloudProject/issues/75
- Sync Status: synced to GitHub; closed after CloudSonnet review confirmation
- Recorded primary comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/75#issuecomment-4030314544
- Recorded alignment refresh comment: https://github.com/PLAYER1-r7/MultiCloudProject/issues/75#issuecomment-402997011

- Issue 74 の shell snippet contract を execution issue として切り出した
- snippet draft、output shape、operator invocation note、manual fill fallback、validation checklist を current phase boundary 内で整理した
- local dry-run で `dig` 非搭載時の fail-closed wording を確認した
- current phase では stdout-only の local single-run snippet に限定し、repo-local script skeleton への拡張は保留している
