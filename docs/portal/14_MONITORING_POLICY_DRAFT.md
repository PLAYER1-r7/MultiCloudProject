# Monitoring Policy Draft

## Purpose

Define the minimum monitoring and alerting policy needed so the first release can detect obvious failures after deployment.

## Working Recommendation

- Start with essential health visibility before deep observability
- Monitor the user-facing delivery path first
- Keep alerting scoped to actionable failures rather than noisy completeness

## Health Check Policy

- The first release should have a simple way to confirm that the public portal is reachable
- Health confirmation should cover the primary user path, not only underlying infrastructure status
- Post-deploy checks should verify that the main page and key static assets can be served successfully

## Logging Policy

- Keep deployment and infrastructure change logs reviewable through workflow history and provider-native logs
- Add only the logs needed to diagnose first-release failures
- Avoid collecting logs with no operational owner or response plan

## Metrics Policy

- Track basic availability and delivery health first
- Focus on signals that indicate whether the portal is reachable and serving expected content
- Add richer metrics only when the application surface justifies them

## Alert Policy

- Alerts should be tied to actionable failure states such as unreachable site, failed deployment, or broken primary route
- Avoid excessive alert volume in the first release
- Define who receives alerts before enabling them broadly

## Notification Direction

- Notifications should go to the operator path responsible for release and recovery decisions
- Use a channel that the small delivery team will actually monitor

## Monitoring Scope For The First Release

- Portal reachability
- Deployment success or failure
- Static asset delivery integrity for the main experience
- Basic confirmation that the expected public route responds after release

## Decision Statement

The first release should implement lightweight monitoring focused on reachability, deploy success, and user-facing health, with alerts limited to failures the team is prepared to act on.
