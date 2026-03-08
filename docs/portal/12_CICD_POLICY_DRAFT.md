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
- Deployment to staging should happen from a controlled branch flow rather than manual ad hoc operations
- The first safe execution path should be a manual dispatch that targets a reviewed commit on `main`
- Additional trigger chaining can be introduced later only after workflow behavior and environment configuration have been validated on the default branch

## Production Deploy Policy

- Production deployment should remain approval-gated
- Production should only be promoted after staging validation succeeds
- Manual approval is acceptable and preferred in the early phase
- The initial production promotion unit should be a staging-validated commit on `main`, not a release tag workflow

## Branch And Trigger Direction

- Main branch should stay review-oriented and deployment-aware
- Pull requests should be the default review path for meaningful changes
- Workflow triggers should distinguish validation from deployment actions
- Feature branches should reach environments through pull requests and reviewed `main` commits rather than direct deploy paths

## Workflow Definition Constraint

- GitHub Actions workflow behavior must be designed with the default-branch execution model in mind
- When deployment is triggered by `workflow_run`, changes to the downstream workflow definition are not validated from a feature branch in the same way as normal application code
- Early-phase workflow design should therefore keep a manual dispatch path and document which checks can be tested before merge versus only after merge

## Approval Gate Direction

- Build and basic validation can run automatically
- Staging should not require a reviewer approval gate, but deploy permissions and environment secret access should stay restricted
- Production deploy should require an explicit approval step

## Artifact Retention Direction

- Deploy candidate artifacts should be retained in a commit-addressable store
- At minimum, keep the current candidate and the latest known-good artifact until the next healthy version is confirmed
- Production enablement should not proceed until the artifact retention expectation is explicit enough to support rollback

## Production Promotion Preconditions

- Production automation should not be added before the approver role is explicitly assigned
- Production promotion should require a defined rollback target, artifact retention expectation, and post-deploy verification owner
- If the domain and certificate operating model are still undecided, the pipeline should stop at staging rather than introducing a speculative production workflow
- If the selected state locking strategy is not wired into the target backend, the workflow should fail closed before any production apply path
- External DNS and certificate cutover should remain explicit operator-managed steps rather than assumed workflow-complete automation

## Current Decision Status

- The current production approval model can assume a single named approver rather than a committee
- The production domain will not assume Route 53 ownership, so certificate validation and cutover steps must allow for external DNS coordination
- The first production promotion candidate should be a staging-validated `main` commit selected explicitly for promotion
- Staging should use a controlled manual dispatch path before deeper trigger automation is enabled
- Native S3 state locking via `use_lockfile = true` is now the selected backend locking strategy
- Monthly cost ceiling is fixed at USD 15/month before tax for the initial production footprint
- The pipeline policy should continue to stop at staging until the remaining production entry conditions are completed, even though the selected backend strategy is now wired into the production backend configuration

## First-Release Practical Flow

```text
change -> review -> build -> test -> staging deploy -> staging check -> approval -> production deploy
```

## Decision Statement

The initial CI/CD policy should use GitHub Actions with automated build and staging validation, while keeping production deployment behind an explicit approval gate.
