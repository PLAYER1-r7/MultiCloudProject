# Backend And Persistence Draft

## Purpose

Determine whether the first portal release needs backend processing or persistent data storage, and avoid introducing them unless there is a validated product requirement.

## Current Recommendation

- The first release should avoid a custom backend unless a concrete workflow requires server-side logic
- The first release should avoid persistent application data unless a concrete data ownership need is identified
- Repository-driven content updates should remain the default operating model

## Functional Review

### Inquiry Handling

- If the portal only needs to show contact guidance, no backend is required
- If the portal must accept structured inquiry submissions inside the site, backend processing may become necessary
- Current recommendation: prefer guidance or external contact path over in-app submission for the first release

### Member Or User Data

- No current requirement indicates user profiles or member-specific records
- Current recommendation: do not store user-specific records in the first release

### Notification Function

- No current requirement indicates in-app notification delivery
- Current recommendation: do not add notification backend logic in the first release

### CMS-Like Update Needs

- Current content update model is repository and deployment driven
- Current recommendation: do not add a CMS backend in the first release

## API Decision

- Baseline decision: no custom API in the first release
- Reopen this only if a later issue confirms a user action that cannot be satisfied by static content or external workflow

## Persistence Decision

- Baseline decision: no application database in the first release
- No DynamoDB or equivalent persistence should be introduced unless a validated data model appears

## AWS Impact

- API Gateway is not required in the baseline architecture
- Lambda is not required in the baseline architecture
- DynamoDB is not required in the baseline architecture
- The current S3 plus CloudFront architecture remains valid under this recommendation

## Triggers That Would Reopen This Decision

- Need to accept and process inquiry submissions inside the portal
- Need to store user-specific or workflow-specific data
- Need for authenticated user actions with server-side authorization
- Need for administrative content editing from inside the portal itself

## Decision Statement

Unless a concrete user workflow requires backend logic or stored application data, the first release should remain static-first with no custom API and no persistence layer.
