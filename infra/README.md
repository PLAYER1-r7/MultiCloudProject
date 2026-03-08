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