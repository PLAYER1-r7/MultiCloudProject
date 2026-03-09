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
- Distinguish certificate continuity faults from artifact and DNS faults by checking the current ACM certificate state, `NotAfter`, `RenewalEligibility`, and validation CNAME retention whenever custom-domain HTTPS fails unexpectedly
- Keep alert routing tied to the operator path that can actually respond; do not enable broader alert tooling until the response owner and channel are recorded tightly enough
- Keep 24x7 on-call design, dashboard depth, SLO/SLI thresholds, and provider-specific alert products outside the current first-release monitoring baseline

## Current Production Certificate Renewal Watchpoint

- The current production certificate watchpoint is ACM certificate ARN `arn:aws:acm:us-east-1:278280499340:certificate/fafdb594-5de6-4072-9576-e4af6b6e3487` for `www.aws.ashnova.jp`, attached to CloudFront distribution `E34CI3F0M5904O`
- The current live renewal baseline is `ISSUED`, `ELIGIBLE`, and `NotAfter=2026-09-06T23:59:59+00:00`, with DNS validation CNAME `_f02889f0b607223c221b8b35338f4793.www.aws.ashnova.jp -> _490fda060ddd8ee1bdd8cea81aa90467.jkddzztszm.acm-validations.aws`
- Production monitoring should treat unexpected custom-domain TLS failure, non-`ISSUED` certificate state, non-`ELIGIBLE` renewal state, or validation CNAME drift away from the reviewed `acm-validations.aws` target as certificate watchpoint failures even if artifact delivery still looks healthy
- Certificate renewal watch should stay on the same small-team operator path as deploy and rollback evidence; do not assume broader alert tooling or automatic escalation exists yet

## Decision Statement

The first release should implement lightweight monitoring focused on reachability, deploy success, and user-facing health, with alerts limited to failures the team is prepared to act on.
