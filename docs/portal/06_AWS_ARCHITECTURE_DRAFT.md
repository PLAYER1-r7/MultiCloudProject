# AWS Architecture Draft

## Purpose

Select a smallest viable AWS architecture for the first release that matches the current public-first, static-first portal direction.

## Working Recommendation

- S3 for static asset hosting
- CloudFront for CDN delivery and TLS termination path
- ACM for certificate management
- Route 53 for DNS if the project uses a custom domain

## Recommended Baseline Architecture

```text
User
  -> Route 53
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
- Route 53: adopt when custom domain is used
  - reason: simplest AWS-native DNS option for the first release
- Cognito: do not adopt in the baseline
  - reason: current auth decision is public-first with no end-user login
- API Gateway: do not adopt in the baseline
  - reason: no confirmed first-release API requirement exists
- Lambda: do not adopt in the baseline
  - reason: no confirmed backend processing requirement exists
- DynamoDB: do not adopt in the baseline
  - reason: no confirmed first-release persistent user or app data exists

## Why This Fits The Current Plan

- Aligns with the product definition baseline of a public entry portal
- Aligns with the MVP scope direction of a small, low-complexity release
- Keeps deployment, rollback, and monitoring scope narrow
- Preserves room to add authenticated or API-backed features later without forcing them now

## What This Architecture Supports

- Public landing and overview pages
- Static guidance or contact information pages
- Repository-driven content updates followed by deployment
- Basic staging validation before production hardening

## What This Architecture Does Not Yet Support

- End-user login flows
- Personalized dashboards
- API-backed business workflows
- Persistent application state tied to individual users

## Change Triggers

- Requirement for protected routes or authenticated users
- Requirement for dynamic inquiry processing inside the portal
- Requirement for user-specific data persistence
- Requirement for server-side business logic that cannot be handled externally

## Decision Statement

Unless a later issue introduces a validated need for authentication or backend logic, the first release should use an S3 plus CloudFront based public architecture with ACM and optional Route 53.
