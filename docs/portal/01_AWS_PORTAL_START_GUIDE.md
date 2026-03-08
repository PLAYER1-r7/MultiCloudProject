# AWS Portal Start Guide

## Purpose

This document is the handoff guide for building the first portal site on AWS from the devcontainer environment.
Use it as the default execution order when resuming work inside the container.

## Target

- Goal: launch a small-start portal site on AWS first
- App style: TypeScript-based web app
- IaC: OpenTofu
- Cloud scope now: AWS only
- Cloud scope later: expand to Azure and GCP without rewriting the app model unnecessarily

## Current Decisions

- Development environment is the repository devcontainer
- Main application language is TypeScript
- Infrastructure as code is OpenTofu
- GitHub operations are performed with GitHub CLI
- AWS operations are performed with AWS CLI
- The first delivery target should be staging, not production

## Working Rules

- Do not start implementation before the MVP scope is fixed
- Keep changes small and reversible
- Avoid mixing the new portal with existing app boundaries unless explicitly planned
- Do not place secrets in the repository
- Use staging as the first deployment target
- Do not close checklist-driven GitHub Issues until the GitHub body is synchronized from the local issue file and the checklist state is verified on GitHub

## Recommended Execution Order

### 1. Verify tool access in the container

Run the following after the container is ready.

```bash
gh auth status
aws sts get-caller-identity
tofu version
node --version
npm --version
docker version
```

Expected result:

- GitHub CLI is authenticated or ready for login
- AWS account identity is available
- OpenTofu is installed
- Node.js is available

### 2. Fix the portal MVP definition

Decide the following before coding.

- Who the portal is for
- Whether the site is public or login-required
- What the first release includes
- What is explicitly out of scope

Minimum output:

- purpose
- target users
- page list
- core flows
- non-goals

### 3. Choose the initial AWS architecture

Start from the smallest architecture that satisfies the MVP.

Default recommendation:

- S3
- CloudFront
- ACM
- External DNS or CloudFront domain during the current planning phase

Add only if required:

- Cognito for login
- API Gateway for HTTP API
- Lambda for backend logic
- DynamoDB for persistence

### 4. Prepare the repository structure

Recommended future layout:

```text
apps/
  portal-web/
infra/
  environments/
    staging/
    production/
  modules/
docs/
  portal/
```

Notes:

- Keep the web app and infrastructure separated
- Keep environment-specific OpenTofu code isolated
- Store portal planning and decision records under docs/portal

### 5. Create GitHub Issues from the prepared backlog

Create the planning issues in this order.

Reference workflow:

- docs/portal/02_GITHUB_ISSUE_WORKFLOW.md

1. product definition
2. MVP scope
3. auth decision
4. AWS architecture
5. app boundary
6. frontend technical choice
7. backend and persistence decision
8. multi-cloud design constraints
9. IaC policy
10. CI/CD policy
11. security baseline
12. monitoring policy
13. test strategy
14. rollback policy
15. implementation backlog

### 6. Start implementation only after planning gates are satisfied

Implementation should begin only when the following are true.

- MVP scope is fixed
- auth requirement is decided
- initial AWS architecture is selected
- app boundary is clear
- IaC direction is selected
- test and rollback expectations are written down

## First Build Recommendation

If no additional requirements exist, start with this shape.

- frontend: TypeScript web app
- hosting: S3 + CloudFront
- domain: external DNS or CloudFront domain + ACM when a custom domain is connected
- auth: add Cognito only if required
- backend: defer until a real MVP use case needs it
- infra: OpenTofu for staging first

## Container Workflow

Use this flow after reopening the workspace in the container.

1. verify GitHub and AWS authentication
2. review this guide
3. finalize planning issues
4. create the initial app and infra directories
5. implement staging-first infrastructure
6. add CI validation and deployment flow

## Immediate Next Actions

1. authenticate GitHub CLI if needed
2. verify AWS identity in the container
3. choose public site or login-required portal
4. create the first GitHub Issues from the prepared templates
5. scaffold the TypeScript app and OpenTofu layout
