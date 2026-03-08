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

## User Model Connection To This Decision

- The primary user is an external visitor who needs to understand the portal and find the next action without training or login
- The current operator role is the content owner working through repository-driven updates, not an in-portal administrative user
- Because the first-release visitor journey does not depend on user identity, no login-required route is needed inside the portal MVP

## Public Scope In The First Release

- Home page
- Overview page
- Guidance page
- Links to external destinations or next actions that do not require authenticated session state
- FAQ and News or Updates are deferred because the initial release does not yet have enough stable public content to justify them as MVP pages

## Protected Scope In The First Release

- None for end users
- No portal page, route, or call to action requires login in the first release
- Repository, deployment workflow, and cloud console access remain operational controls outside the portal itself

## Triggers That Would Reopen This Decision

- Need for protected resources only visible to approved users
- Need for self-service profile or member function

## AWS Impact Of The Current Recommendation

- Cognito is not part of the first-release baseline and should not be introduced preemptively
- Static-first hosting remains the preferred starting point
- Monitoring and rollback scope stay smaller because no login flow or token handling is introduced

## Risks And Tradeoffs

- Public-first delivery may limit future protected workflows in the short term
- A later shift to authenticated access will require revisiting navigation, testing, and architecture decisions
- If hidden protected requirements exist today, deferring auth could create rework

## Decision Statement

The first release should launch as a public portal without end-user authentication, with no protected end-user area inside the portal and no Cognito dependency in the baseline AWS architecture.

## Confirmed Working Answers

- No first-release page is currently planned as internal-only within the portal itself
- The initial public page set is Home, Overview, and Guidance
- FAQ and News or Updates remain outside the MVP and can be reconsidered after the first publication creates stable content for them
- No user-specific data is assumed in the first release
- Inquiry or contact handling, if needed, should avoid authenticated identity in the first release
- Repository, deployment workflow, and cloud access controls are sufficient for first-release operational protection
- No current compliance requirement has been identified that forces authentication into the first release

## Current Coverage Notes For Issue 3

- The first release is explicitly public and does not require end-user login
- Public pages are Home, Overview, and Guidance, with no protected end-user area inside the portal
- FAQ and News or Updates are intentionally deferred and should not be treated as hidden MVP pages
- Protected operations remain outside the portal in repository, deployment, and cloud access controls
- The primary user and the operator role are separated, and only the operator side requires protected operational access
- Cognito and other authentication services are not part of the baseline AWS architecture for the first release
- Authentication should only be reopened if a concrete protected user workflow appears
- This document contains candidate material for Issue 3, but the checklist should stay open until the team explicitly agrees that each Task and Definition of Done item is satisfied

## Downstream Implication

- Issue 4 should assume no Cognito dependency in the baseline AWS architecture
- Issue 6 should prefer frontend choices that work cleanly with public-first routing
- Issue 7 should only introduce backend identity coupling if a later requirement invalidates this decision
