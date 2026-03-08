# Auth Decision Draft

## Purpose

Define whether the first portal release needs user authentication, what should be protected, and what downstream architectural impact that choice creates.

## Working Recommendation

- The first release should not require end-user login
- The first release should be treated as a public portal with no protected user area
- Administrative changes should happen through repository and deployment workflows, not through an in-portal admin screen
- Authentication should be deferred until a concrete user-specific workflow requires it

## Why This Direction Fits The Current Plan

- The product definition currently favors a public entry point with low operational complexity
- The MVP scope favors static-first delivery and a small page set
- Introducing login in the first release would expand AWS architecture, test surface, and rollback complexity
- There is no confirmed first-release requirement yet for user-specific data, personalized actions, or protected transactions

## Public Scope In The First Release

- Home page
- Overview page
- Contact or guidance page if included in the MVP
- Links to external destinations or next actions that do not require authenticated session state

## Protected Scope In The First Release

- None for end users
- Repository, deployment workflow, and cloud console access remain operational controls outside the portal itself

## Triggers That Would Reopen This Decision

- Need for user-specific dashboard or saved state
- Need for protected resources only visible to approved users
- Need for self-service profile or member function
- Need for server-side authorization decisions tied to user identity

## AWS Impact Of The Current Recommendation

- Cognito is not required for the first release unless a later issue changes the decision
- Static-first hosting remains the preferred starting point
- Monitoring and rollback scope stay smaller because no login flow or token handling is introduced

## Risks And Tradeoffs

- Public-first delivery may limit future protected workflows in the short term
- A later shift to authenticated access will require revisiting navigation, testing, and architecture decisions
- If hidden protected requirements exist today, deferring auth could create rework

## Decision Statement

Unless a blocking requirement is identified during MVP scoping, the first release should launch as a public portal without end-user authentication.

## Open Questions

- Is any page required to be accessible only to internal users from day one?
- Is any user-specific data expected in the first release?
- Is inquiry submission sufficient without authenticated identity?
- Does any compliance requirement force authentication earlier than planned?
