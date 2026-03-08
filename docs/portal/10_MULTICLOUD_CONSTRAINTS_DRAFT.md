# Multicloud Design Constraints Draft

## Purpose

Define constraints that keep the AWS-first portal extensible to Azure and GCP later without forcing unnecessary redesign.

## Core Principle

The first release may be implemented on AWS, but product structure, route design, configuration handling, and observability naming should avoid hard-coding assumptions that block future expansion.

## Naming Constraints

- Avoid cloud-vendor specific names in user-facing routes and product terminology
- Prefer neutral names for application modules, environments, and deployment artifacts where practical
- Keep infrastructure-specific names inside infrastructure layers rather than frontend-visible identifiers

## URL Constraints

- Public URL structure should describe product areas, not cloud provider details
- Avoid route names that expose AWS service concepts
- Keep future expansion possible without changing the visible information architecture

## Authentication Constraints

- The initial no-auth choice must not assume AWS-specific identity coupling in frontend route design
- If authentication is introduced later, it should be possible to replace the identity provider without rewriting the user-facing app model
- Keep protected-area concepts abstract rather than bound to a specific vendor implementation

## Configuration Constraints

- Frontend configuration should use environment-driven values rather than provider-specific literals spread across the app
- Secrets must remain outside the frontend and outside the repository
- Runtime assumptions about domains, APIs, or assets should be configurable rather than hard-coded to AWS identifiers

## Observability Constraints

- Monitoring labels and dashboards should favor app-level names over cloud-specific names where possible
- Health and release checks should describe user-facing outcomes, not only provider internals
- Alert design should remain portable enough to map onto later Azure and GCP monitoring workflows

## Frontend Boundary Constraint

- Frontend code should not directly depend on cloud-vendor SDKs unless a validated feature requires it
- The initial portal should treat infrastructure as a deployment target, not as part of the UI architecture

## Practical First-Release Interpretation

- AWS-specific delivery choices are acceptable in infrastructure
- Cloud-neutral product and app-layer abstractions should be preferred in planning and code organization
- Future multi-cloud support should expand by replacing infrastructure adapters, not by redesigning the portal concept

## Decision Statement

The first release may be AWS-specific in deployment, but product structure, routes, configuration, and frontend architecture should remain cloud-neutral enough to support later Azure and GCP adoption.
