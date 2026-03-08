# AWS Incident Pattern Playbook

## Use This When

- Use this after triage identifies AWS as the likely failure domain.
- Use it to pick the first AWS-specific check instead of exploring ad hoc.

## First Action Order

1. Match the symptom to the closest pattern.
2. Run the core commands.
3. Compare runtime evidence with the last deploy or config change.
4. Apply only the smallest AWS-specific mitigation first.

## Common Patterns

- Blank SNS page or MIME error: rebuild the SNS frontend with `/sns/` base path and redeploy static assets.
- API 5xx spike: check Lambda logs and last deploy diff.
- CloudFront certificate errors: verify production Pulumi certificate and domain config.
- Image URL expiry: ensure signed URL is generated at response time.

## Core Commands

```bash
aws logs tail /aws/lambda/multicloud-auto-deploy-staging-api --since 10m --follow --region ap-northeast-1
aws cloudwatch describe-alarms --state-value ALARM
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 21_AWS_INCIDENT_PATTERN_PLAYBOOK
Scope: Issue #487 AWS production blank sns page under /sns/
Outcome: AWS pattern matched
Actions taken: checked the sns CloudFront path, recent deploy-sns-aws.yml asset deploy, and origin policy changes
Evidence: /sns/ assets return failures while sns API health remains green after Issue #487 rollout
Risks or blockers: sns users remain impacted until edge or asset-path cause is isolated
Next action: verify /sns/ base-path build output, WebACL, and origin access policy with sns-reviewer before sns-approval-owner approves rollback
```
