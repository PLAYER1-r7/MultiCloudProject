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
  - presents the primary call to action
  - links to the most important destination pages
- Overview page
  - explains intended users and use cases
  - states what this first release covers
- Contact or guidance page
  - provides next-step guidance, support contact, or operational notice if needed

## Proposed In-Scope Functions

- Static content delivery over a stable public URL
- Basic navigation across the initial page set
- Simple content update flow through repository change and deployment process
- Minimal observability and release validation needed for staging

## Proposed Out-of-Scope Functions

- Personalized dashboards
- User-generated content
- Complex member management
- Real-time notifications
- Admin console beyond repository-driven content updates
- Cross-cloud runtime deployment in the first release

## Deferred To Later Phases

- Login-protected user area if Issue 3 concludes it is necessary
- API-driven content or backend workflows if Issue 7 concludes they are necessary
- Cloud-portable operational abstraction beyond the minimum needed for AWS-first delivery
- Production hardening beyond the initial staging path

## MVP Boundary

The MVP succeeds if a user can reach the portal, understand its purpose, navigate the initial information architecture, and reach the intended next action without requiring a custom backend or complex operations.

## Decision Inputs Required

- Product definition from `docs/portal/03_PRODUCT_DEFINITION_DRAFT.md`
- Authentication direction from Issue 3
- AWS architecture decision from Issue 4

## Open Questions

- Is public access sufficient for the first release?
- Is the contact or guidance page necessary on day one?
- Does the first release need any form of inquiry submission?
- Should the MVP include a single primary call to action or multiple entry paths?

## One-Page Summary

The first release should be an AWS-hosted, low-complexity portal with a limited page set, static-first delivery, and no unnecessary backend coupling. Its role is to validate the portal concept, not to deliver the full long-term platform.
