# CI/CD Policy Draft

## Purpose

Define the minimum CI/CD policy that supports reliable staging delivery first, while preserving a clear path to production approval later.

## Working Recommendation

- Use GitHub Actions as the default automation platform
- Treat build, test, and deploy as separate but connected stages
- Optimize the first release flow for staging deployment before production automation depth
- Keep production deployment gated by explicit approval

## Build Policy

- Every relevant change should run a build workflow
- The frontend build should verify static asset generation for S3 and CloudFront delivery
- Infrastructure validation should be introduced where infrastructure code begins to exist

## Test Policy

- Minimum automated checks should include build success and essential validation for the first release scope
- Add lightweight tests before deeper test matrices
- Do not block progress on unrealistic full-suite ambitions before the product surface exists

## Staging Deploy Policy

- Staging is the first deployment target
- Staging deployment should be automated once the app and infrastructure paths exist
- Deployment to staging should happen from a controlled branch flow rather than manual ad hoc operations

## Production Deploy Policy

- Production deployment should remain approval-gated
- Production should only be promoted after staging validation succeeds
- Manual approval is acceptable and preferred in the early phase

## Branch And Trigger Direction

- Main branch should stay review-oriented and deployment-aware
- Pull requests should be the default review path for meaningful changes
- Workflow triggers should distinguish validation from deployment actions

## Approval Gate Direction

- Build and basic validation can run automatically
- Staging deploy can be automated after validation success
- Production deploy should require an explicit approval step

## First-Release Practical Flow

```text
change -> review -> build -> test -> staging deploy -> staging check -> approval -> production deploy
```

## Decision Statement

The initial CI/CD policy should use GitHub Actions with automated build and staging validation, while keeping production deployment behind an explicit approval gate.
