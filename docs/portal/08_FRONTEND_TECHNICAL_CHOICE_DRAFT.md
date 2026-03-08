# Frontend Technical Choice Draft

## Purpose

Choose the frontend delivery model that best matches the current AWS-first, public-first, static-first portal plan.

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

### SPA

- Strengths
  - flexible client-side routing and interaction model
  - still deployable as static assets when backend needs are limited
  - can evolve from a public-first portal into richer client interactions later
- Weaknesses
  - can add unnecessary client complexity if the first release remains mostly informational
  - requires deliberate handling of client-side routes on CloudFront

### SSR

- Strengths
  - useful for dynamic or personalized experiences
  - can improve certain SEO and runtime content scenarios
- Weaknesses
  - requires compute runtime beyond the current baseline architecture
  - increases deployment, monitoring, and rollback scope
  - does not fit the current no-backend, no-auth baseline

## Working Decision

- The first release should use a static-first frontend approach
- If a framework is used, it should support static export cleanly
- SPA behavior can be introduced selectively, but the deployment target should remain static assets for the first release

## Routing Direction

- Prefer simple public routes for a small set of content pages
- Avoid route structures that assume protected user areas in the first release
- Keep route design compatible with future expansion without requiring current SSR

## Build Direction

- TypeScript-based build pipeline
- Output should be static files suitable for S3 deployment
- Environment handling should stay minimal and avoid embedding secret values in the frontend

## Candidate Tooling Direction

- Vite with TypeScript is a strong default candidate for the first release
- React is acceptable if interactive needs justify it, but the initial page set should stay small
- Heavier SSR-oriented frameworks should be deferred unless future issues prove they are needed

## Decision Statement

Unless Issue 7 or a later product decision introduces meaningful dynamic or authenticated requirements, the first portal release should use a static-first TypeScript frontend optimized for deployment to S3 and CloudFront.
