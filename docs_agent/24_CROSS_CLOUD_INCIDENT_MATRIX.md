# Cross-Cloud Incident Matrix

## Use This When

- Use this when the symptom is known but the failing cloud is not yet certain.
- Use it to choose the first cloud-specific check without reading all three playbooks in full.

## Execution Pattern

1. Pick the symptom row.
2. Run the first confirmation in the most likely cloud column.
3. If evidence does not match, move horizontally to the next cloud.
4. Once one cloud clearly matches, switch to its dedicated playbook.

## Symptom-Oriented Use

Pick a symptom and execute the cloud-specific check and mitigation quickly.

| Symptom       | AWS                         | Azure                           | GCP                                   |
| ------------- | --------------------------- | ------------------------------- | ------------------------------------- |
| API 5xx       | Lambda logs + redeploy diff | Function metrics + app settings | Run or Functions logs + revision diff |
| API 404       | API path or base check      | `routePrefix` check             | URL map or service route check        |
| CORS error    | API and storage CORS        | Function CORS + Blob CORS       | Run or Storage CORS                   |
| Blank UI      | `/sns/` asset path          | Front Door route or rules       | CDN or GCS path and cache             |
| Auth failures | Cognito config or token     | AAD config or token             | Firebase domain or token              |

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 24_CROSS_CLOUD_INCIDENT_MATRIX
Scope: Issue #487 compare sns login failures across AWS, Azure, and GCP staging paths
Outcome: Cross-cloud split identified
Actions taken: mapped sns symptom presence by provider and compared deploy-sns-aws.yml, deploy-sns-azure.yml, and deploy-sns-gcp.yml rollout paths
Evidence: AWS and Azure fail on sns callback after Issue #487 rollout; GCP remains healthy under the same test
Risks or blockers: assuming one shared sns root cause could waste recovery time
Next action: route sns AWS and Azure paths into provider playbooks, share the split with sns-reviewer, and keep GCP as a control path until sns-approval-owner decides on rollout
```
