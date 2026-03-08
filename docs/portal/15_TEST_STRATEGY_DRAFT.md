# Test Strategy Draft

## Purpose

Define the minimum test strategy needed to judge whether the first portal release is shippable and safe to promote beyond staging.

## Working Recommendation

- Start with a small, explicit test set tied to the MVP surface
- Separate smoke checks, major user-flow checks, and module-level validation
- Keep staging acceptance criteria concrete enough to support release decisions
- Make post-deploy verification part of the test strategy rather than a separate afterthought

## Smoke Test Policy

- Smoke tests should confirm that the portal can load and serve the main experience after build and deployment
- The first release should at minimum verify the top page, key static assets, and core navigation entry points
- Smoke coverage should stay small, fast, and mandatory for every release candidate

## Primary Flow Test Policy

- Major user-flow checks should cover the public routes that define MVP value
- The first release should test only the flows the team promises to users, not speculative future paths
- If an interaction is release-critical, it should appear in the major flow checklist

## Module Test Policy

- Module-level tests should focus on logic that can break independently of full-page checks
- Prioritize utility, rendering, and configuration behavior that is easy to validate repeatedly
- Avoid broad test volume before stable modules exist

## Post-Deploy Verification Policy

- Every deployment should have a defined post-deploy verification checklist
- Post-deploy checks should confirm reachability, expected route behavior, and absence of obvious broken assets
- Verification should be simple enough to run consistently during the early phase

## Staging Exit Criteria

- Build and essential validation must pass
- Smoke tests must pass in the staging environment
- Major MVP routes must behave as expected in staging
- Blocking defects found in staging must be resolved before promotion

## First-Release Practical Scope

- Build success confirmation
- Top page reachability check
- Main navigation and primary route checks
- Lightweight module tests where business logic exists
- Post-deploy checklist for staging

## Decision Statement

The first portal release should use a lightweight test strategy centered on fast smoke coverage, explicit major-flow checks, limited module tests, and a repeatable staging acceptance checklist.
