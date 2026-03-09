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

## State Backend And Locking Direction

- Each environment should keep its own remote state key and should not share mutable state with other environments
- S3 remote state is acceptable for the current staging phase, but serialized operation is only a temporary control
- A formal locking mechanism should be decided before production infrastructure changes are made by more than one operator or workflow; native S3 lockfile and a dedicated lock table are both valid options depending on the operating model
- State backend bootstrap resources should remain outside the stack they protect

## Production Entry Criteria

- Production entrypoint work should not begin only because staging infrastructure exists
- Before adding production OpenTofu resources, the team should record decisions for domain ownership, certificate sourcing, rollback target, and monthly cost ceiling
- If any of those items remain undecided, production should stay as a documented placeholder rather than a partial implementation

## Current Decision Status

- The production domain is expected to use an external DNS operating model rather than Route 53 as the primary source of truth
- Certificate sourcing therefore has to be designed together with the external DNS validation flow
- State locking baseline is native S3 locking via `use_lockfile = true`, enabled in staging and now wired into the production backend configuration through a dedicated production state key
- Monthly cost ceiling for the first public release is fixed at USD 15/month before tax for the current small static-site footprint
- The portability boundary is explicit: provider-specific backends, modules, and workflow commands may stay AWS-specific, while user-facing routes, frontend configuration contracts, frontend architecture, and monitoring wording stay cloud-neutral
- Production IaC should still stay blocked until the remaining production entry conditions are recorded, even though the selected backend strategy is now wired into production

## Operational Rules

- Avoid manual drift by treating console changes as exceptional and back-porting them into code if they occur
- Review OpenTofu changes before apply
- Keep secrets and sensitive values outside versioned frontend code and outside hard-coded infrastructure files

## Decision Statement

The initial portal infrastructure should be managed with OpenTofu using reusable modules and isolated environment definitions so that staging and production remain reproducible, while product and app-facing contracts remain cloud-neutral enough to keep future multi-cloud expansion tractable.
