# Production Readiness Gate

## Use This When

- Use this immediately before production release, approval, or post-incident re-enable.
- Treat this as the final gate, not as a design discussion document.

## Decision Procedure

1. Check every mandatory go criterion.
2. Run the security verification points for the affected path.
3. Record any explicit risk acceptance.
4. Conclude GO or NO-GO in one sentence.

## Mandatory Go Criteria

- CORS restricted to real domains
- Secrets managed in cloud secret stores
- Monitoring and alerts active
- Core flow tests pass
- Rollback plan documented
- Approval-gated production workflows are fully completed
- Target health endpoints were verified on the affected cloud paths
- Provider security posture matches the project policy baseline

For GCP production-equivalent live execution, also require all of the following before GO:

- The reviewed execution package is completed and points to one evidence path for reviewer and approval-owner handoff
- A dedicated hostname candidate, DNS source-of-truth, and operator-managed authoritative DNS write owner are explicitly recorded
- The live execution is tracked in a separate execution issue rather than being embedded in a summary or preparation record
- Rollback branches, evidence-retention inputs, and external notification or escalation destinations are fixed before release-sensitive execution starts
- Every hostname included on the shared Google-managed certificate is publicly resolvable and has certificate `domainStatus=ACTIVE`; one active hostname is not sufficient if another remains `FAILED_NOT_VISIBLE` or equivalent
- Post-change monitoring state is acknowledged on the same evidence path, including uptime-check presence or status and alert-policy enablement, rather than relying only on route-level curls

## Security Verification Points

- Verify production CORS with the actual deployed origins. For Azure, confirm both Function App CORS and Blob Storage CORS.
- Use a request-level check to verify the returned CORS header on the production path:

```bash
curl -s -I -X OPTIONS \
	-H "Origin: https://<allowed-domain>" \
	-H "Access-Control-Request-Method: GET" \
	<endpoint-url> | grep -i "access-control"
```

- Expected result: `Access-Control-Allow-Origin: https://<allowed-domain>`, never `*`.
- For Azure, run the check against both the Function App URL and the Blob Storage endpoint.
- Verify the required WAF or equivalent protection is active on the affected cloud path and remains policy-compliant.
- Verify secrets live in the intended cloud secret store and that a rotation owner or rotation policy is defined.
- If recent secret exposure or emergency credential replacement occurred, confirm the rotated value is deployed before declaring GO.
- Verify HTTPS redirect and required security headers on the exposed production path, or record the cloud-specific gap explicitly before release.
- Verify audit logging is active on the affected provider path and that recent deployment or admin events are queryable.
- If a logging gap, disabled audit source, or missing retention policy is discovered, treat the release as NO-GO until the risk is accepted explicitly.
- For GCP shared Google-managed certificates, verify both the served certificate SAN set and the provider-reported `domainStatus` for every included hostname before declaring GO.
- For close-gate or post-change approval on GCP production-equivalent execution, record monitoring acknowledgment on the same evidence path by confirming the expected uptime checks still exist and the referenced alert policies remain enabled.

If any mandatory item fails, the decision is NO-GO.

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 31_PRODUCTION_READINESS_GATE
Scope: Issue #451 GO or NO-GO decision for exam-solver production release
Outcome: NO-GO
Actions taken: checked mandatory criteria, security verification points, and rollback readiness for exam-solver before deploy-exam-solver-aws.yml
Evidence: exam-solver tests passed and monitoring is active, but production CORS validation is still incomplete for Issue #451
Risks or blockers: incomplete exam-solver origin verification could break live traffic after release
Next action: finish production CORS verification for exam-solver, hand the evidence to exam-solver-reviewer, and then request deploy-exam-solver-aws.yml approval from exam-solver-approval-owner again
```
