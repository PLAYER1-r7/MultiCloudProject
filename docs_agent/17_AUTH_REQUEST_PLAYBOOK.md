# Authentication Request Playbook

## Use This When

- Use this when any cloud command, GitHub operation, or protected runtime path depends on missing auth.
- Use it before debugging auth-related code so you do not confuse expired operator auth with application defects.

## Immediate Action Order

1. Verify current auth state.
2. Stop work if the needed auth is missing.
3. Send the request message with the exact missing provider and command.
4. Resume only after re-authentication is confirmed.

Use these default wait limits after sending the request:

- Non-production task: wait a maximum of 30 minutes.
- Active production incident: wait a maximum of 15 minutes.
- If re-authentication is still missing after the wait window, re-escalate with `Outcome: Re-escalation requested - authentication still missing` using `08_ESCALATION_AND_HANDOFF.md`.

## Rule

If required authentication is missing, stop and request authentication immediately.

## Minimum Auth Posture

- Use the native provider auth model already adopted by the platform: Cognito, Azure AD, and Firebase Auth.
- Expect MFA on operator accounts for GitHub, AWS, Azure, and GCP.
- Do not work around missing auth with temporary code changes or disabled checks.

## Cloud Auth Baseline

| Cloud | Service       | Default auth flow         | Token posture              |
| ----- | ------------- | ------------------------- | -------------------------- |
| AWS   | Cognito       | Authorization Code + PKCE | Secure session cookie      |
| Azure | Azure AD      | Authorization Code + PKCE | Secure session cookie      |
| GCP   | Firebase Auth | Authorization Code + PKCE | JWT idToken / refreshToken |

## Agent Handling Rule

- Treat the cloud auth model above as the expected baseline unless the task explicitly changes auth architecture.
- If auth behavior differs from this baseline, confirm the deployed configuration before editing code.
- Request operator re-authentication rather than weakening validation or bypassing the login flow.

## Verify

```bash
gh auth status
aws sts get-caller-identity
az account show
gcloud auth list
```

## Request Message

```text
Work paused due to missing authentication.
Task: <task>
Required auth: <gh/aws/az/gcloud>
Please run: <command>
```

## Execution Record

Fill the canonical execution record format defined in `08_ESCALATION_AND_HANDOFF.md`.

For reviewer and approval-owner boundaries in `Next action`, use `ROLE_HANDOFF_OWNERSHIP.md`.

## Short Example

```text
Document: 17_AUTH_REQUEST_PLAYBOOK
Scope: Issue #451 staging auth update for exam-solver frontend callback URL
Outcome: Auth request prepared
Actions taken: identified the exam-solver provider path, listed the redirect URI change, captured the approval owner, and noted the follow-up deploy-exam-solver-aws.yml
Evidence: current exam-solver callback mismatch reproduced in staging; target URL documented for Issue #451
Risks or blockers: production exam-solver auth must not change without separate approval
Next action: submit the staged exam-solver auth change request to exam-solver-approval-owner and copy exam-solver-reviewer before any deploy-exam-solver-aws.yml execution
```
