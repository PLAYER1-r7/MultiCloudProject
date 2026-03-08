# workflow seed

This directory is reserved for Issue 18 and later GitHub Actions workflow implementation.

## Expected Workflow Areas Later

- frontend build validation
- essential test or smoke validation
- staging deployment
- production approval-gated promotion

## Current Constraint

- Keep workflow responsibilities split between validation and deployment
- Do not embed secrets in workflow files