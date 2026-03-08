# Critical Guardrails Extract

## Use This When

- Use this before editing, deploying, rotating secrets, or approving risky recovery work.
- Treat this document as the stop-condition source for all work in docs 15-32.

## Stop Immediately If

- Branch or environment mapping is unclear.
- The target app boundary is unclear.
- Production auth, secret, or rollback posture cannot be verified.

## Non-Negotiable Rules

- Do not treat `main` as a normal development branch.
- Keep `AUTH_DISABLED=false` in staging and production.
- Respect app boundaries.
- Avoid large one-shot edits.
- Use Pulumi outputs as the config source of truth.
- Use amd64-compatible build paths for deploy artifacts.

## Security Deployment Guardrails

- Enforce MFA on GitHub and all cloud accounts used for deploy or admin work.
- Never use wildcard CORS in production; restrict origins to real domains.
- Keep secrets in managed secret stores or approved GitHub environments, never in the repository.
- Preserve the current cost and policy rules; do not use prohibited Azure Premium paths.

## Security Operations Baseline

- Treat CORS as a cloud-specific control, not a generic toggle. Azure requires separate API-layer and Blob Storage CORS validation.
- Keep the provider WAF posture aligned with project policy: AWS CloudFront WebACL, GCP Cloud Armor, and Azure Front Door Standard with a standalone WAF policy when additional protection is required.
- Keep a rotation path for every secret source. AWS may use automatic rotation, Azure requires a rotation policy, and GCP needs an explicit manual or automated rotation plan.
- If a secret is exposed, rotate and invalidate it immediately before continuing feature work.
- Keep HTTPS enforcement and security headers as part of the baseline security posture. Missing headers are a security gap, not a cosmetic issue.
- Treat audit logging as mandatory infrastructure, not optional observability. AWS CloudTrail, Azure Log Analytics, and GCP Cloud Audit Logs must remain available for security investigation.
- Never disable audit trails or shorten retention casually during feature work or incident response.

## Security Header Baseline

- Enforce HTTPS redirects on public entry points.
- Prefer HSTS, CSP, X-Content-Type-Options, X-Frame-Options, and a strict referrer policy where the platform supports them.
- If one cloud path lacks header support today, treat it as a tracked gap and avoid weakening other clouds to match it.

## Safety Check

- [ ] Branch and environment mapping is correct.
- [ ] Boundary check is clean.
- [ ] Required authentication is available.
- [ ] Rollback is prepared.
- [ ] Production CORS, secrets, and WAF/DDoS posture were verified.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 14_CRITICAL_GUARDRAILS_EXTRACT
Scope: Issue #451 pre-release guardrail check for exam-solver-api staging config change
Outcome: Proceed with caution
Actions taken: verified develop-to-staging mapping, exam-solver boundary, auth access, rollback path, and the planned deploy-exam-solver-aws.yml handoff
Evidence: exam-solver staging credentials available; Pulumi outputs reviewed; previous exam-solver artifact identified for Issue #451
Risks or blockers: production exam-solver release remains blocked until production checks are run separately
Next action: continue with exam-solver staging validation, hand results to exam-solver-reviewer, and keep production untouched until exam-solver-approval-owner reviews deploy-exam-solver-aws.yml
```
