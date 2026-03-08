# Infrastructure Seed

This directory is the implementation starting point for Issue 17 and later AWS delivery work.

## Planned Layout

```text
infra/
  environments/
    staging/
    production/
  modules/
    portal-static-site/
```

## Current Intent

- `environments/` will hold environment-specific entrypoints
- `modules/` will hold reusable AWS delivery building blocks
- Implementation should stay aligned with the OpenTofu policy documented in the planning issues

## Staging Variable Checklist

- `project_slug`: defaults to `multicloudproject`
- `site_slug`: defaults to `portal`
- `environment_name`: defaults to `staging`
- `bucket_name_suffix`: defaults to `web`
- `site_bucket_name`: optional explicit override for bucket naming
- `aliases`: optional CloudFront aliases
- `acm_certificate_arn`: optional ACM certificate ARN when not using the default certificate
- `common_tags`: optional extra tags

## State Management

- staging OpenTofu state is stored in the S3 backend bucket `multicloudproject-tfstate-apne1`
- staging state key is `portal/staging/terraform.tfstate`
- backend bootstrap is intentionally kept outside the staging module itself to avoid self-managing the state bucket
