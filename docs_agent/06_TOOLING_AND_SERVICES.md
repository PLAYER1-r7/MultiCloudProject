# Tooling and Services Baseline

## Required Tooling

- Git
- Python
- Node.js and npm
- Docker
- AWS CLI
- Azure CLI
- gcloud CLI
- Pulumi CLI
- GitHub CLI (`gh`)
- Project validation scripts: `./scripts/test-endpoints.sh` and `./scripts/test-e2e.sh`

## Required Platform Services

- GitHub Issues / PRs / Actions
- Branch protection and environment gates
- Cloud-native logs and monitoring
- Cloud-native identity services: Cognito, Azure AD, Firebase Auth

## Reference Priority

1. Pulumi outputs and deployed resource state
2. Workflow execution results and runtime logs
3. Existing scripts and validated runbooks
4. Narrative documentation

## Operating Rules

- Do not invent config values.
- Prefer existing scripts over manual sequences.
- Keep manual operations limited and reversible.

## Placement Rules

- Put cloud authentication architecture and operator auth expectations in `17_AUTH_REQUEST_PLAYBOOK.md`.
- Put app-specific operational tuning decisions, such as timeout increases, in `20_MANUAL_DEPLOY_DECISION_CRITERIA.md`.
- Keep product implementation details in `docs/`; only import stable decision rules or operating baselines here.

## Quick Verification

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
```
