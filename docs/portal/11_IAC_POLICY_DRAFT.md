# IaC Policy Draft

## Purpose

Define how infrastructure should be managed with OpenTofu so that the first AWS release is reproducible and later expansion to Azure and GCP remains manageable.

## Working Recommendation

- Use OpenTofu as the default infrastructure definition tool
- Separate environment-specific state from reusable infrastructure definitions
- Keep staging and production isolated from the beginning
- Favor explicit outputs and environment configuration over manual console-driven wiring

## Management Unit

- Infrastructure should be managed as code by responsibility and environment rather than as a single manual setup
- A practical starting structure is reusable modules plus environment directories

## Suggested Repository Structure

```text
infra/
  environments/
    staging/
    production/
  modules/
```

## Stack Separation Direction

- Keep DNS, CDN, static hosting, and optional future app services separable where practical
- Avoid one oversized stack that couples every future change together
- Start with the smallest number of stacks that still keeps environments isolated and reviewable

## Environment Separation

- Staging and production should have separate state and configuration
- Production should not depend on ad hoc values created in staging
- Promotion should be based on reviewed code changes, not manual re-entry of infrastructure settings

## Output Management

- Important outputs such as bucket names, distribution identifiers, domain values, and certificate references should be explicit
- Application-facing values should be exported in a controlled way rather than copied manually from the console

## Variable And Difference Handling

- Environment differences should be represented through variables or per-environment configuration files
- Do not fork module logic unnecessarily between staging and production
- Keep provider, region, domain, and environment naming configurable

## Operational Rules

- Avoid manual drift by treating console changes as exceptional and back-porting them into code if they occur
- Review OpenTofu changes before apply
- Keep secrets and sensitive values outside versioned frontend code and outside hard-coded infrastructure files

## Decision Statement

The initial portal infrastructure should be managed with OpenTofu using reusable modules and isolated environment definitions so that staging and production remain reproducible and future multi-cloud expansion stays tractable.
