# MVP Scope Draft

## Purpose

Define a first release scope that is small enough to ship quickly on AWS staging, but complete enough to validate the portal concept and future multi-cloud direction.

## Scope Principle

- Prefer the smallest releasable slice over a feature-complete portal
- Keep the first release easy to host, observe, and roll back
- Avoid features that require backend persistence unless they are proven necessary
- Treat multi-cloud expansion as a design constraint, not a first-release deliverable

## Proposed In-Scope Pages

- Home page
  - explains what the portal is
  - presents the single primary call to action for the first release
  - links to the most important destination pages
- Overview page
  - explains intended users and use cases
  - states what this first release covers
- Guidance page
  - provides next-step guidance, support contact, and operational notice for the first release

## Proposed In-Scope User-Facing Functions

- Reach the public portal from a stable URL
- Move across the initial page set without confusion
- Understand what this first release covers and what it does not cover
- Identify the intended next action, support contact, and operational notice from public guidance

## Operational Capabilities Required For MVP

- Simple content update flow through repository change and deployment process
- Minimal observability and release validation needed for staging

## Proposed Out-of-Scope Functions

- Personalized dashboards
- User-generated content
- Complex member management
- Real-time notifications
- Admin console beyond repository-driven content updates
- Cross-cloud runtime deployment in the first release

## Explicitly Deferred To Later Phases

- Login-protected user area is deferred unless Issue 3 concludes it is necessary
- API-driven content or backend workflows are deferred unless Issue 7 concludes they are necessary; this is a later-phase dependency and not a completion condition for Issue 2
- Cloud-portable operational abstraction beyond the minimum needed for AWS-first delivery is deferred because Issue 2 defines an AWS-first MVP boundary rather than a multi-cloud runtime target
- Production hardening beyond the initial staging path is deferred because the first release should validate scope and visitor journey before expanding operational investment

## Confirmed Scope Decisions

- Public access is sufficient for the first release
- Guidance page is a required MVP page because the initial portal must tell visitors what to do next without requiring a backend workflow
- Inquiry submission is out of scope for the first release and should not introduce a custom form backend yet
- The first release should emphasize one primary call to action, with supporting navigation available as secondary paths
- User-facing functions and operational capabilities should be described separately when judging MVP scope
- Login and backend workflow are explicitly deferred and should not be treated as hidden MVP requirements

## MVP Boundary

The MVP succeeds if a user can reach the public portal URL, understand its purpose, navigate the initial information architecture, and reach the intended next action without requiring login, a custom backend, or complex operations.

## Decision Inputs Required

- Product definition from `docs/portal/03_PRODUCT_DEFINITION_DRAFT.md`
- Authentication direction from Issue 3
- AWS architecture decision from Issue 4

## Open Questions

- No unresolved scope blockers remain for Issue 2 final checkbox review; any later changes should be treated as downstream refinement rather than MVP boundary definition.

## Current Coverage Notes For Issue 2

- Initial MVP pages are Home, Overview, and Guidance
- Initial MVP user-facing functions are reaching the portal, navigating the initial page set, understanding first-release scope, and identifying the next action from public guidance
- MVP operational capabilities are repository-driven updates and minimal release verification
- Out-of-scope items are personalized dashboards, user-generated content, member management, real-time notifications, admin console features, and cross-cloud runtime deployment
- Later-phase items are explicitly deferred protected areas, API-backed workflows, deeper cloud-portable abstractions, and production hardening, each with a stated reason for deferral
- This document now provides the accepted evidence baseline for Issue 2 final review and downstream Issue 3 to Issue 4 planning

## One-Page Summary

The first release should be an AWS-hosted, low-complexity portal with a limited page set, static-first delivery, and no unnecessary backend coupling. Its role is to validate the portal concept, not to deliver the full long-term platform.
