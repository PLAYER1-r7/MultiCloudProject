# AWS Architecture Draft

## Purpose

Select a smallest viable AWS architecture for the first release that matches the current public-first, static-first portal direction.

## Working Recommendation

- S3 for static asset hosting behind CloudFront
- CloudFront for CDN delivery, HTTPS entry, and the default staging access path
- ACM for certificate management when a custom domain is connected through CloudFront
- External DNS remains the current operating model for the production custom domain

## Recommended Baseline Architecture

```text
User
  -> External DNS or CloudFront domain
  -> CloudFront
  -> S3
```

## Service Decision Table

- S3: adopt
  - reason: matches static-first portal delivery with low operational overhead
- CloudFront: adopt
  - reason: provides caching, HTTPS integration, and stable public delivery
- ACM: adopt
  - reason: required for certificate management with CloudFront and custom domain usage
- Route 53: do not adopt in the current baseline
  - reason: the current production operating model assumes external DNS rather than AWS-managed authoritative DNS
- Cognito: do not adopt in the baseline
  - reason: current auth decision is public-first with no end-user login
- API Gateway: do not adopt in the baseline
  - reason: no confirmed first-release API requirement exists
- Lambda: do not adopt in the baseline
  - reason: no confirmed backend processing requirement exists
- DynamoDB: do not adopt in the baseline
  - reason: no confirmed first-release persistent user or app data exists

## Working Answers To The Current Architecture Questions

- Staging entrypoint: use the CloudFront default domain first
  - reason: the first release is staging-first, and a custom domain should not be treated as a prerequisite for validating the MVP architecture
- Production custom domain model: connect the approved production custom-domain path that remains owned outside AWS through the external DNS operating model when production entry criteria are satisfied
  - reason: authoritative DNS already lives outside AWS, so Route 53 is not required, and the repository only needs an approved custom-domain path rather than in-AWS domain control
- ACM responsibility boundary: use an AWS-managed ACM public certificate in us-east-1 for the CloudFront custom-domain path, keep certificate request and renewal in AWS, and treat external DNS validation plus cutover approval as explicit operator-managed production steps
  - reason: CloudFront requires ACM integration for the custom-domain path, while external DNS remains the source of truth for validation records and cutover timing
- Origin model: keep CloudFront in front of S3 and do not use S3 website hosting as the primary public entry model
  - reason: this keeps HTTPS delivery, caching behavior, and request routing consistent between staging and production-oriented operation
- Backend assumption: treat guidance, contact direction, and operational notice as static-first content for the first release
  - reason: the current MVP scope does not validate a need for API-backed inquiry handling or server-side business processing

## Why This Fits The Current Plan

- Aligns with the product definition baseline of a public entry portal
- Aligns with the MVP scope direction of a small, low-complexity release
- Keeps deployment, rollback, and monitoring scope narrow
- Preserves room to add authenticated or API-backed features later without forcing them now
- Lets staging validate the user journey before production domain coordination and approval-specific work is introduced

## What This Architecture Supports

- Public landing and overview pages
- Static guidance or contact information pages
- Repository-driven content updates followed by deployment
- Basic staging validation through the CloudFront default domain before production hardening
- A future custom domain connection coordinated through external DNS without changing the application model

## What This Architecture Does Not Yet Support

- End-user login flows
- Personalized dashboards
- API-backed business workflows
- Persistent application state tied to individual users
- Production approval and operator-step details for DNS cutover or emergency override

## Change Triggers

- Requirement for protected routes or authenticated users
- Requirement for dynamic inquiry processing inside the portal
- Requirement for user-specific data persistence
- Requirement for server-side business logic that cannot be handled externally
- Requirement to move authoritative DNS management into AWS

## Decision Statement

Unless a later issue introduces a validated need for authentication or backend logic, the first release should use an S3 plus CloudFront based public architecture with ACM, while keeping external DNS as the current custom-domain operating model.

## Downstream Implication

- Issue 7 should remain the decision point for any later backend or persistence introduction
- Production rollback target and cutover approval stay governed by the product-definition design gate rather than being forced into the first-release baseline
- Infrastructure and delivery work can optimize for staging-first validation without adding speculative Route 53, API Gateway, Lambda, or DynamoDB resources

## Current Coverage Notes For Issue 4

- The baseline request path is External DNS or CloudFront domain to CloudFront to S3
- S3, CloudFront, and ACM are adopted in the first-release baseline
- Route 53, Cognito, API Gateway, Lambda, and DynamoDB are not part of the current baseline
- Staging starts from the CloudFront default domain, while production custom-domain coordination remains compatible with external DNS
- This architecture aligns with the current public-first auth decision and static-first MVP scope
- This document now provides the accepted evidence baseline for Issue 4 final review and downstream AWS delivery planning
