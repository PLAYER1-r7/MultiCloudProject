# Implementation Backlog Draft

## Purpose

Define the first implementation backlog shape so the planning decisions can be translated into directly actionable work items.

## Working Recommendation

- Split implementation work by delivery concern rather than by abstract document topic
- Keep tasks small enough that one owner can complete and verify them
- Make every task carry a clear output, completion signal, and dependency hint
- Order backlog items so foundational delivery paths unblock later work

## Frontend Workstream

- Create the portal frontend application scaffold aligned with the chosen frontend approach
- Implement the initial public routes and page structure required for MVP
- Add static asset handling, environment configuration, and build output alignment for delivery
- Include a task for integrating the minimum smoke-checkable navigation and content surface

## Infrastructure Workstream

- Create the initial AWS delivery infrastructure tasks for static hosting and secure delivery
- Add IaC tasks for environment separation, shared modules, and essential outputs
- Include tasks for baseline security headers, HTTPS delivery path, and required configuration plumbing
- Separate foundation tasks from environment-specific rollout tasks

## CI/CD Workstream

- Add workflow tasks for build validation and essential test execution
- Add staging deployment automation tasks before production automation depth
- Include approval-gated production promotion as a separate backlog item
- Make deployment verification and artifact handling explicit tasks rather than assumptions

## Monitoring And Operations Workstream

- Add tasks for reachability checks, deploy confirmation, and alert routing
- Include rollback preparation and post-deploy verification checklist tasks
- Separate observability basics from later enhancement work
- Ensure every operations task has an operational owner and trigger condition

## Test Workstream

- Add tasks for smoke coverage, major user-flow checks, and selected module tests
- Include staging acceptance checklist tasks tied to release decisions
- Separate immediate release-blocking test work from later coverage expansion
- Keep the first test backlog aligned with actual MVP routes and assets

## Prioritization Direction

- Start with repo and application scaffolding that unblock implementation
- Follow with infrastructure foundation and CI validation
- Add staging deployment and smoke verification before broader operational hardening
- Schedule monitoring, rollback, and deeper test expansion after the first deployable path exists

## Backlog Item Shape

- Task title
- Goal or deliverable
- Dependencies
- Completion criteria
- Owner or responsible workstream

## First-Release Practical Sequence

- Bootstrap frontend app and build path
- Stand up AWS static delivery foundation
- Add CI validation and staging deployment path
- Implement MVP routes and content
- Add smoke checks, monitoring basics, and rollback readiness
- Prepare production approval and follow-on hardening tasks

## Decision Statement

The first implementation backlog should be organized by frontend, infrastructure, CI/CD, monitoring, and test workstreams, with small executable tasks ordered to create a deployable staging path before broader hardening work.

## Post-Static Expansion Boundary

- If a future feature adds end-user authentication, custom API, or application persistence, do not extend the first-release static backlog in place; start a fresh expansion planning track
- Treat stateful expansion work as a separate backlog family with its own product, auth, data, security, monitoring, test, and rollback decisions
- Prefer a single-cloud first execution boundary for the first stateful slice, while keeping app-facing contracts cloud-neutral enough for later Azure and GCP adoption
- For the current next major expansion candidate, use [docs/portal/24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md](24_SIMPLE_SNS_AND_AZURE_PREPARATION_PLAN.md) as the planning entry point rather than reopening the static-first backlog baseline
