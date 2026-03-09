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
- Google-managed certificate for the reviewed preview hostname
- HTTP redirect path to keep HTTPS as the canonical route

## Output Contract For Workflow And Operator Handoff

- `preview_public_url`: reviewed public URL for the preview path
- `reviewed_target_reference`: DNS operator-facing target reference, expected to be recorded as an `A <global_ip_address>` style handoff
- `certificate_related_reference`: certificate name and reviewed domain reference for operator follow-up
- `preview_asset_origin_identifier`: asset origin identifier for deploy and rollback evidence
- `selected_environment_entrypoint_reference`: fixed reference to this environment path
- `url_map_name`: optional Cloud CDN invalidation target for the preview deploy workflow

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

## tfvars Example

See [infra/environments/gcp-preview/terraform.tfvars.example](infra/environments/gcp-preview/terraform.tfvars.example) for the reviewed input skeleton.
