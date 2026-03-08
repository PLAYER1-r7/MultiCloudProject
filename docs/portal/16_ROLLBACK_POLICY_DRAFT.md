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

## Decision Statement

The first portal release should adopt a lightweight rollback policy centered on restoring the last known good application and infrastructure state quickly, with explicit delivery-path recovery steps and a mandatory post-rollback verification checklist.