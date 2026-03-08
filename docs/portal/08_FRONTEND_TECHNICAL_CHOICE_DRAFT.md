# Frontend Technical Choice Draft

## Purpose

Choose the frontend delivery model that best matches the current AWS-first, public-first, static-first portal plan.

## Current Inputs

- Issue 2 keeps the first release public-first, small in scope, and oriented around a limited set of informational pages
- Issue 4 keeps the baseline delivery architecture on S3 plus CloudFront, without adding backend or compute runtime by default
- Issue 5 fixes `apps/portal-web` as the portal frontend implementation root, so this issue should choose the technical model inside that boundary rather than reopen placement
- The first release still assumes no end-user login, no confirmed API requirement, and no need to hold secret values in frontend code

## Current Repository Evidence

- `apps/portal-web` already exists as the implementation seed directory
- The current seed uses Vite with TypeScript and exposes `dev`, `build`, `preview`, and `typecheck` scripts
- The current README already frames the frontend as static-first and S3 plus CloudFront deployable
- The seeded route set is still public informational routing rather than authenticated application workflow routing

## Options Under Review

- Static site generation or static web app
- Single Page Application
- Server-Side Rendering

## Current Recommendation

- Prefer a static-first frontend built with TypeScript
- Use a modern build toolchain that can emit deployable static assets for S3 and CloudFront
- Avoid SSR in the first release because it introduces unnecessary runtime complexity for the current scope

## Option Assessment

### Static Site

- Strengths
  - best fit for S3 plus CloudFront delivery
  - lowest hosting and rollback complexity
  - aligns with public informational portal use cases
  - simplest path for staging delivery
- Weaknesses
  - less suitable if later requirements demand rich authenticated workflows or server-side personalization
  - requires discipline to avoid over-engineering with framework features that are not needed for a small first release

### SPA

- Strengths
  - flexible client-side routing and interaction model
  - still deployable as static assets when backend needs are limited
  - can evolve from a public-first portal into richer client interactions later
- Weaknesses
  - can add unnecessary client complexity if the first release remains mostly informational
  - requires deliberate handling of client-side routes on CloudFront
  - may encourage early component and state patterns that outpace the current MVP content needs

### SSR

- Strengths
  - useful for dynamic or personalized experiences
  - can improve certain SEO and runtime content scenarios
- Weaknesses
  - requires compute runtime beyond the current baseline architecture
  - increases deployment, monitoring, and rollback scope
  - does not fit the current no-backend, no-auth baseline

## Evaluation Lens

- Delivery fit: can the model be shipped cleanly to S3 plus CloudFront without adding speculative runtime infrastructure
- Operational fit: does the model preserve low-complexity staging delivery, rollback, and verification
- Product fit: does the model match a public informational portal with a small initial route set
- Routing fit: can the model support simple public routes without introducing avoidable rewrite or hydration complexity
- Expansion fit: can the model grow later if Issue 7 or later product issues introduce dynamic requirements

## Option Comparison Table

| Option      | Delivery fit | Operational fit | Product fit | Routing fit | Expansion fit | Current judgment                 |
| ----------- | ------------ | --------------- | ----------- | ----------- | ------------- | -------------------------------- |
| Static site | Strong       | Strong          | Strong      | Strong      | Moderate      | Best default for first release   |
| SPA         | Moderate     | Moderate        | Moderate    | Moderate    | Strong        | Acceptable only with constraints |
| SSR         | Weak         | Weak            | Weak        | Moderate    | Strong        | Defer for first release          |

## Why The Current Judgment Looks This Way

- Static site scores strongest because it matches the existing AWS baseline, keeps staging and rollback simple, and fits a small informational page set
- SPA remains viable only when it behaves operationally like static delivery and does not force the initial portal into a heavier app-shell model than the product currently needs
- SSR scores poorly for the first release because its runtime benefits are not matched by a validated requirement for personalization, protected workflows, or server-side data access

## Working Decision

- The first release should use a static-first frontend approach
- If a framework is used, it should support static export cleanly
- SPA behavior can be introduced selectively, but the deployment target should remain static assets for the first release
- SSR should remain deferred unless a later issue introduces a validated runtime need

## Routing Direction

- Prefer simple public routes for a small set of content pages
- Avoid route structures that assume protected user areas in the first release
- Keep route design compatible with future expansion without requiring current SSR
- If client-side routing is used, document the CloudFront fallback behavior explicitly rather than assuming it later

## Build Direction

- TypeScript-based build pipeline
- Output should be static files suitable for S3 deployment
- Environment handling should stay minimal and avoid embedding secret values in the frontend
- The default output assumption is a deployable `dist/` style artifact generated from `apps/portal-web`

## Environment Variable Direction

- Treat frontend environment variables as public configuration only
- Do not place secrets, private tokens, or approval-sensitive values in the frontend build
- Prefer build-time configuration when the value is stable per environment and safe to expose to the browser
- Keep environment-specific secret handling in infrastructure or deployment systems rather than in application code

## Candidate Tooling Direction

- Vite with TypeScript is a strong default candidate for the first release
- React is acceptable if interactive needs justify it, but the initial page set should stay small
- Heavier SSR-oriented frameworks should be deferred unless future issues prove they are needed

## Provisional Recommendation Summary

- Prefer a static-first TypeScript delivery model as the default decision path for Issue 6
- Keep SPA as a constrained fallback option only when it still produces static assets and does not introduce unnecessary route complexity
- Defer SSR for the first release because it conflicts with the current no-auth, no-backend, low-operations baseline
- Keep route design shallow and public-first for Home, Overview, and Guidance
- Treat frontend environment variables as public configuration only, with secret handling left outside the frontend codebase

## Adoption Decision

- Adopt a static-first TypeScript frontend built with Vite as the first-release implementation path
- Keep framework choice intentionally light unless later issues prove a stronger interactive requirement
- Treat the current seed as evidence that the repository is already aligned with static delivery rather than as a reason to broaden scope prematurely

## Working Answers To The Current Questions

- Static-first should remain the default recommendation unless a concrete first-release requirement appears that cannot be met cleanly without SPA behavior
  - reason: the current product and architecture decisions optimize for low operational overhead and static delivery
- SPA can remain an acceptable implementation shape only if it still emits static assets and keeps route handling simple enough for CloudFront delivery
  - reason: client-side interactivity is not forbidden, but it should not redefine the hosting model for the first release
- SSR should stay out of scope for the first release
  - reason: there is no current requirement for server-side rendering, personalization, or runtime data fetching that justifies added runtime infrastructure
- Routing should stay content-first and public-first, with a shallow route tree for the initial pages
  - reason: the MVP boundary is understanding the portal and reaching the next action, not navigating a complex app shell
- The current seed route set may remain broader than the initial MVP route policy, but first-release implementation should prioritize Home, Overview, and Guidance as the primary public route set
  - reason: the existing scaffold can include exploratory or supporting routes without changing the agreed MVP navigation policy
- Frontend environment variables should be limited to browser-safe public values
  - reason: the portal currently has no approved need to expose secrets or move deployment approvals into frontend code

## Current Coverage Notes For Issue 6

- The comparison set is static site, SPA, and SSR
- The current recommendation is static-first TypeScript delivery that emits static assets for S3 and CloudFront
- SSR is presently misaligned with the first-release scope because it would add runtime complexity without a validated product need
- SPA remains a secondary option only if it preserves static deployment and does not force unnecessary route or state complexity
- Routing should remain public-first and shallow for the initial page set
- The current seed may contain additional exploratory routes, but the MVP route policy still centers on Home, Overview, and Guidance
- Environment variable policy should remain public-only and secret-free on the frontend side

## Decision Statement

Unless Issue 7 or a later product decision introduces meaningful dynamic or authenticated requirements, the first portal release should use a static-first TypeScript frontend optimized for deployment to S3 and CloudFront.
