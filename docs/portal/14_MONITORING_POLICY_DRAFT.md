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

## Current Production Monitoring Baseline

- The current production monitoring baseline should reuse the evidence already emitted by `portal-production-deploy` instead of introducing a separate monitoring stack before the response path is agreed
- The first-response route should be the production deploy run URL, the step summary, and the `portal-production-deployment-record` artifact kept on the same workflow path as promotion
- Production health confirmation should start with `https://www.aws.ashnova.jp` plus smoke paths `/`, `/overview`, and `/guidance`, because these are the current public routes and the workflow already records route-by-route HTTP results for them
- CloudFront distribution state and external DNS resolution are supporting diagnostics, not the primary health signal; user-facing reachability and reviewed deploy evidence remain the declaration baseline
- Verification ownership should stay explicit on the production deploy record so the small team can tell who is expected to confirm restoration before incident close

## First-Response Triage Direction

- Treat failed `portal-production-deploy`, custom-domain reachability failure, or route-level smoke failure as the primary production monitoring signals for the first release
- Use the production deploy record together with the linked build and staging evidence to decide whether the fault is promotion-related, rollback-related, or external to the reviewed artifact path
- Distinguish artifact restore needs from DNS propagation wait and CloudFront propagation wait before escalating to rollback or external DNS change
- Keep alert routing tied to the operator path that can actually respond; do not enable broader alert tooling until the response owner and channel are recorded tightly enough
- Keep 24x7 on-call design, dashboard depth, SLO/SLI thresholds, and provider-specific alert products outside the current first-release monitoring baseline

## Decision Statement

The first release should implement lightweight monitoring focused on reachability, deploy success, and user-facing health, with alerts limited to failures the team is prepared to act on.
