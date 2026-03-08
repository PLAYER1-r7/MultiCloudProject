# staging environment seed

This directory is reserved for the staging entrypoint of the portal delivery infrastructure.

## Expected Contents Later

- environment-level OpenTofu configuration
- backend and provider settings
- module wiring for the portal static delivery path
- staging-specific variables and outputs

## Current Naming Direction

- Default bucket naming is computed from `project_slug`, `site_slug`, `environment_name`, and `bucket_name_suffix`
- `site_bucket_name` can still override the computed value when a fixed bucket name is required