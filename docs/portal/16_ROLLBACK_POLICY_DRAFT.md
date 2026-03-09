# Rollback Policy Draft

## Purpose

Define the minimum rollback policy needed so the first portal release can recover safely from failed application, infrastructure, or delivery changes.

## Working Recommendation

- Keep rollback paths simple, documented, and executable by a small team
- Separate application rollback, infrastructure rollback, and delivery-path rollback so failures can be isolated
- Prefer rollback methods that restore the last known good state quickly over elaborate but unproven recovery flows
- Require a short verification checklist after every rollback action

## Application Artifact Rollback Policy

- Static site delivery should support restoring the last known good build artifact quickly
- The rollback unit for the first release should be a previously validated application package or deployment version
- Operators should know where the prior release artifact is stored before promoting a new release

## Infrastructure Rollback Policy

- Infrastructure rollback should follow the same IaC control path used for forward changes
- Emergency manual fixes may be acceptable for containment, but the steady-state configuration must be reconciled back into IaC
- Rollback scope should distinguish full environment reversion from limited resource correction

## DNS And Delivery Path Policy

- DNS or delivery-layer changes should have a defined reversal path before they are applied
- Changes affecting the public route should include a clear fallback to the last known good delivery target
- TTL and propagation considerations should be included in the rollback decision, not discovered during the incident

## Auth And Access Policy

- If no end-user authentication exists in the first release, the auth rollback scope should focus on operator access and deployment credentials
- Any later auth-related rollout should define a separate rollback unit and validation checklist
- Access restoration must avoid introducing unmanaged emergency credentials

## Recovery Verification Policy

- Every rollback action should be followed by a minimum verification flow
- Verification should confirm public reachability, primary route health, and absence of obvious asset breakage
- The same responsible path that triggers rollback should confirm service restoration

## Recovery Time Direction

- The first release should define a practical target for restoring service rather than an abstract SLA
- Recovery time expectations should reflect the lightweight MVP architecture and team size
- Long-running rollback steps should be identified explicitly before production rollout

## First-Release Practical Scope

- Restore previous static artifact
- Reapply last known good infrastructure state
- Reverse risky DNS or CDN setting changes
- Run a short post-rollback verification checklist
- Record the incident and chosen recovery path

## Current Production Operations Snapshot

- The current production release is the portal artifact built in GitHub Actions run `22839426762`, staging-validated in run `22839434387`, and promoted by `portal-production-deploy` run `22839461795`
- The current custom-domain path is `https://www.aws.ashnova.jp`, backed by production bucket `multicloudproject-portal-production-web` and CloudFront distribution `E34CI3F0M5904O`
- For the next production change, this current release becomes the last known-good rollback target unless a newer release is promoted and verified successfully
- Production rollback should re-dispatch the reviewed artifact through the same promotion path instead of rebuilding a fresh artifact during the incident

## Current Production Recovery Direction

- Select the last known-good production artifact by build run id, matching staging verification run id, production deploy run URL, and operator verification note
- Re-run `portal-production-deploy` with the selected known-good build and staging evidence so bucket contents and CloudFront invalidation stay on the same audited path as forward promotion
- Keep DNS reversal decisions separate from artifact restore; only change DNS when artifact restore cannot recover service on the current production distribution path
- Treat service restoration as incomplete until custom-domain reachability, smoke paths `/`, `/overview`, and `/guidance`, and rollback evidence synchronization are all confirmed

## Current External DNS Reversal Direction

- Record the pre-change external DNS target, previous known-good target, and TTL before any DNS reversal decision so the team is not reconstructing the path during the incident
- Prefer waiting through normal DNS or CloudFront propagation windows before reversing DNS unless the current target is clearly wrong for the reviewed production distribution path
- If DNS reversal is required, verify that the previous target still maps to a known-good delivery path and keep the reversal evidence with the same operator record used for artifact rollback decisions
- Treat DNS reversal as incomplete until public DNS resolution, custom-domain HTTPS, and smoke paths `/`, `/overview`, and `/guidance` have all been re-verified

## Current Certificate Incident Separation Direction

- Treat certificate continuity as a separate failure class from artifact rollback and DNS reversal; if custom-domain HTTPS fails while deploy evidence, bucket sync, and CloudFront deployment still look healthy, inspect ACM certificate state first
- Before any rollback or DNS action, confirm the current certificate ARN, `NotAfter`, `RenewalEligibility`, and validation CNAME retention so the recovery path is not chosen from incomplete certificate state
- If the ACM certificate is no longer `ISSUED`, no longer `ELIGIBLE`, or the validation CNAME no longer matches the reviewed `acm-validations.aws` target, escalate as a certificate incident before changing artifact or DNS state
- Treat certificate recovery as incomplete until custom-domain HTTPS, smoke paths `/`, `/overview`, and `/guidance`, and the reviewed certificate attachment on the production distribution have all been re-verified

## Decision Statement

The first portal release should adopt a lightweight rollback policy centered on restoring the last known good application and infrastructure state quickly, with explicit delivery-path recovery steps and a mandatory post-rollback verification checklist.
