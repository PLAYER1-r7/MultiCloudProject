# gcp-preview environment seed

This directory is reserved for the GCP preview entrypoint of the portal delivery infrastructure.

## Expected Contents

- environment-level OpenTofu configuration
- current backend-family wiring for the GCP preview path
- module wiring for the reviewed static delivery path
- usage-oriented outputs for workflow and DNS/operator handoff

## Reviewed Input Baseline

- preview hostname: `preview.gcp.ashnova.jp`
- environment entrypoint: `infra/environments/gcp-preview`
- backend family: current repo S3 backend family is retained for first-step preview proof
- backend key: `portal/gcp-preview/terraform.tfstate`
- backend bootstrap responsibility: backend bucket remains outside the protected delivery stack
- required reviewed input before apply:
  - `project_id`
  - `preview_hostname`
  - optional `additional_hostnames` when the same delivery surface must also present a dedicated production-equivalent hostname
  - `resource_name_suffix`
  - `site_bucket_name` override or acceptance of the computed bucket pattern
  - backend config source
  - state key / workspace identity
  - bootstrap completion confirmation

## Current Resource Shape

- Cloud Storage bucket as the preview asset origin
- backend bucket with Cloud CDN enabled
- global external HTTPS load balancer with shared global IP
- Cloud Armor security policy attached to the backend bucket path
- Google-managed certificate for the reviewed preview hostname and any reviewed additional hostnames on the same delivery surface
- HTTP redirect path to keep HTTPS as the canonical route

## Output Contract For Workflow And Operator Handoff

- `preview_public_url`: reviewed public URL for the primary preview hostname
- `reviewed_target_reference`: DNS operator-facing target reference, expected to be recorded as an `A <global_ip_address>` style handoff
- `certificate_related_reference`: certificate name and reviewed domain set for operator follow-up
- `preview_asset_origin_identifier`: asset origin identifier for deploy and rollback evidence
- `selected_environment_entrypoint_reference`: fixed reference to this environment path
- `url_map_name`: optional Cloud CDN invalidation target for the preview deploy workflow

## Monitoring Implementation Snapshot

- Current primary monitoring target: `https://preview.gcp.ashnova.jp`
- Current monitored paths: `/`, `/overview`, `/guidance`, `/status`
- Current monitoring resources: Cloud Monitoring uptime checks per reviewed path and matching alert policies per path
- Current content matcher baseline: `MultiCloudProject Portal.*<div id="app"></div>` の regex matcher を SPA shell marker として扱う
- Current notification destination baseline: default は external delivery channel を持たず、issue / deploy evidence path を first-response route とする。`monitoring_notification_email` が設定された場合のみ owner-bound email channel を追加できる

## Monitoring First-Response Sequence

- Alert trigger が起きたら、最新の reviewed `portal-gcp-preview-deploy` run URL を先に開く
- step summary と `portal-gcp-preview-deployment-record` artifact を確認し、preview public URL、resource execution reference、reviewed target reference、certificate-related reference を突き合わせる
- provider control-plane や DNS diagnostics は supporting evidence としてのみ使い、reviewed deploy evidence path を飛ばして開始しない
- recovery が必要なら Issue 59 の runbook / drill baseline に接続する

## Monitoring Scope Boundary

- この環境 entrypoint は Cloud Monitoring uptime checks と alert policies の first-pass 実装だけを持ち、24x7 on-call、broad dashboard、numeric SLO/SLI、automatic remediation は含めない
- owner-bound external destination を使わない場合でも、deploy run URL と deployment record artifact が canonical first-response path のままである

## Security Hardening Snapshot

- Current browser-facing hardening delta beyond the initial baseline: `Permissions-Policy` と `X-Permitted-Cross-Domain-Policies` を追加し、preview static delivery に不要な browser capability と legacy cross-domain policy exposure を絞っている
- Current Cloud Armor stance: backend bucket path には reviewed Cloud Armor policy を維持し、rule-depth の大幅変更は separate follow-up に残す
- Current credential governance: preview deploy に必要な credential surface は `gcp-preview` GitHub environment に限定し、repository secret や frontend bundle に GCP credential を置かない
- Current audit evidence baseline: latest reviewed `portal-gcp-preview-deploy` run URL、`portal-gcp-preview-deployment-record` artifact、`resource_execution_reference`、Cloud Monitoring alert policy / uptime check state を同じ operator review path に残す

## Preview Credential Governance Baseline

- Required GCP preview credential variables remain owner-bound inside the `gcp-preview` GitHub environment and are reviewed under repository-owner ownership
- Do not duplicate `GCP_PREVIEW_WORKLOAD_IDENTITY_PROVIDER`、`GCP_PREVIEW_SERVICE_ACCOUNT_EMAIL`、`GCP_PREVIEW_PROJECT_ID`、`GCP_PREVIEW_SITE_BUCKET_NAME` into repository-wide plaintext configuration
- Treat `monitoring_notification_email` as optional and owner-bound; if unset, the workflow evidence path remains the only approved first-response destination
- If credential rotation or cleanup becomes necessary before `2026-03-31`, handle the change through a reviewed follow-up issue rather than ad hoc edits

## Resource Execution Record Template

The GCP preview deploy workflow expects a committed markdown file referenced by `resource_execution_reference` that contains these lines exactly once:

- `- Resource execution status: ready`
- `- Preview public URL: ...`
- `- Reviewed target reference: ...`
- `- Certificate-related reference: ...`
- `- Selected environment entrypoint reference: infra/environments/gcp-preview`

Use `blocked pending state` as the status value when certificate or target readiness remains operator-hold only. The workflow fails closed when that status is recorded.

## Example Computed Bucket Pattern

- `multicloudproject-portal-gcp-preview-web`
- use `site_bucket_name` only when that computed pattern is not acceptable or not globally unique

## Fail-Closed Rules

- Do not treat provider credentials, backend bootstrap, or DNS authority changes as part of this environment entrypoint
- Do not run deploy workflow automation from this environment without a reviewed resource execution record containing the output contract fields above
- Do not treat pending certificate or target state as execution completed; keep it in `blocked pending state` until operator hold is cleared
- Do not use ad hoc console fixes as the steady-state baseline; return changes to reviewed OpenTofu state and outputs instead

## Current Preview Recovery Snapshot

- Current retained preview deadline: `2026-03-31`
- Current recovery owner baseline: repository owner is the primary owner, deploy operator is the triggering actor on the latest reviewed `portal-gcp-preview-deploy` run, and verification owner defaults to repository owner unless explicitly recorded otherwise
- Current recovery evidence path: latest reviewed `portal-gcp-preview-deploy` run URL, its step summary, the `portal-gcp-preview-deployment-record` artifact, the committed `resource_execution_reference`, and the Cloud Monitoring uptime check / alert policy state added in Issue 58
- Current safe-stop baseline: if the preview path has no previous live baseline, or the current state is still `blocked pending state`, do not force rollback or DNS progression; keep the incident in safe stop until the owner records the next action

## Preview Recovery Operator Sequence

- Classify the trigger as artifact-path failure, resource-path failure, or DNS/operator-path failure before changing anything
- Open the latest reviewed `portal-gcp-preview-deploy` run first and inspect the step summary plus `portal-gcp-preview-deployment-record` artifact before using provider dashboards or DNS tools
- If the failure is artifact-path only, re-dispatch `portal-gcp-preview-deploy` with the last known-good `source_build_run_id` and the reviewed `resource_execution_reference`; do not rebuild a new artifact during the incident unless the evidence path is already broken
- If the failure is resource-path related, return changes through reviewed OpenTofu state in `infra/environments/gcp-preview`; do not treat ad hoc console edits as the recovery baseline
- If the failure is DNS/operator-path related, compare the recorded `reviewed_target_reference` and `certificate_related_reference` first, and reverse the external DNS manual step only after the reviewed deploy and resource evidence show the artifact and resource paths are healthy

## Preview Post-Recovery Verification Checklist

- Confirm `https://preview.gcp.ashnova.jp` and the major routes `/`, `/overview`, `/guidance`, `/status` return the expected SPA shell markers again
- Confirm the latest reviewed `portal-gcp-preview-deploy` run URL and `portal-gcp-preview-deployment-record` artifact are attached to the same recovery path
- Confirm the selected known-good build reference, the current `resource_execution_reference`, the `reviewed_target_reference`, and the `certificate_related_reference` are recorded together before declaring recovery complete
- Confirm any Cloud Monitoring alert that triggered the recovery has returned to normal state or has been explicitly acknowledged in the same operator review path

## Preview Recovery Drill Baseline

- While the preview remains retained through `2026-03-31`, record at least one operator-reviewed recovery walkthrough against the current evidence path before the retention deadline
- Record an additional walkthrough whenever the preview monitoring surface, security hardening scope, or delivery resource topology changes materially enough that the old recovery notes are stale
- Treat the walkthrough as an evidence and decision exercise first; automatic rollback, destructive DNS reversal, or live destroy are not part of this baseline unless a separate execution issue explicitly authorizes them

## Preview Recovery Walkthrough Execution Aid

- Use [infra/environments/gcp-preview/recovery-walkthrough-template.md](infra/environments/gcp-preview/recovery-walkthrough-template.md) to record the minimum operator-reviewed walkthrough before `2026-03-31`
- Start from the latest reviewed `portal-gcp-preview-deploy` run URL and keep the step summary, deployment record artifact, `resource_execution_reference`, monitoring state, reviewed target reference, and certificate-related reference on the same review path
- Select one of the approved trigger classes first: artifact-path failure, resource-path failure, DNS/operator-path failure, or blocked pending state safe-stop
- Record any additional follow-up separately if the walkthrough identifies a real implementation change rather than a runbook or evidence-path gap

## tfvars Example

See [infra/environments/gcp-preview/terraform.tfvars.example](infra/environments/gcp-preview/terraform.tfvars.example) for the reviewed input skeleton.
