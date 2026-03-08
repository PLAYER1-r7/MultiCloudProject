# Security Baseline Draft

## Purpose

Define the minimum security baseline that must be present in the first portal implementation so that MVP delivery does not leave obvious gaps to patch later.

## Working Recommendation

- Enforce HTTPS from the first release
- Keep frontend security headers explicit and minimal but non-optional
- Keep secrets out of the repository and out of frontend runtime code
- Add only the minimum security controls that fit the current public-first architecture, while leaving room for stronger controls later

## HTTPS Policy

- All public access should use HTTPS
- HTTP should redirect to HTTPS where relevant in the delivery path
- Certificates should be managed through ACM in the AWS baseline architecture

## CORS Policy

- If no custom API exists in the first release, CORS scope should remain minimal
- Do not enable permissive wildcard policies for future convenience unless truly needed
- Revisit CORS only when API-backed interactions are introduced

## Security Header Policy

- Add baseline browser security headers appropriate for a public static site
- Prefer explicit header configuration through the delivery layer rather than ad hoc app behavior
- Include a conservative posture for framing, content type handling, and transport security where supported

## WAF Direction

- WAF is not automatically required for the first static informational release
- Reevaluate WAF if traffic profile, compliance needs, or protected interactions change
- Keep the decision documented rather than leaving it implicit

## Secret Management Policy

- Secrets must not be committed into the repository
- Frontend builds must not depend on embedding sensitive secrets
- Operational credentials and sensitive values should be stored in appropriate secret stores and CI/CD controls

## Audit And Logging Policy

- Infrastructure and deployment actions should be traceable through platform-native logs and CI/CD history
- Security-relevant changes should be reviewable through repository history and workflow execution logs
- Logging expectations should stay proportional to the first-release scope but must not be absent

## First-Release Checklist Direction

- HTTPS enabled
- No secrets in repository
- Baseline security headers defined
- CORS minimized to actual need
- WAF decision explicitly recorded
- Deployment and infra changes auditable

## Decision Statement

The first portal release should launch with HTTPS, explicit baseline headers, minimal CORS exposure, no repository-stored secrets, and documented security decisions that can scale with later requirements.
