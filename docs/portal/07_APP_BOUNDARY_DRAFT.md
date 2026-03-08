# App Boundary Draft

## Purpose

Define what is currently inside the portal planning work, what is outside it, and how future implementation directories should be separated to avoid accidental scope creep.

## Current Repository Reality

- The current repository is a planning repository centered on `docs/portal`
- No application runtime directories such as `apps/`, `infra/`, or `services/` exist yet in this repository
- The repository also contains `docs_agent` and `docs_agent_ja`, which are operational handoff documents and not portal application code

## Current Working Boundary

- In scope now
  - portal planning documents under `docs/portal`
  - issue source files under `docs/portal/issues`
  - planning drafts that define product, scope, auth, architecture, and future implementation boundaries
- Out of scope now
  - implementing frontend application code in this repository before Issue 6 and Issue 5 are settled
  - adding backend services before Issue 7 and Issue 4 establish the need
  - editing `docs_agent` and `docs_agent_ja` as part of portal product work unless a documentation handoff change is explicitly required
  - using `.tmp-home` as any project-owned directory

## Recommended Future Directory Boundary

```text
docs/
  portal/
apps/
  portal-web/
infra/
  environments/
    staging/
    production/
  modules/
```

## Editing Rules

- `docs/portal` is the current source of truth for planning decisions
- Future portal frontend code should live under `apps/portal-web`
- Future infrastructure code should live under `infra/`
- Operational agent handoff documents should remain under `docs_agent` and `docs_agent_ja`
- Local machine or credential artifacts must not be tracked from `.tmp-home`

## Shared Foundation Versus Portal-Specific Work

- Shared foundation
  - repository-level README and high-level planning references
  - future infra modules intended for reuse across environments
- Portal-specific work
  - portal page structure
  - portal content model
  - portal deployment path
  - portal runtime code once implementation starts

## Change Triggers

- If frontend implementation begins, create `apps/portal-web` rather than placing app code under `docs/`
- If infrastructure implementation begins, create `infra/` rather than mixing infrastructure files into the planning docs tree
- If shared modules emerge across future applications, document them separately from portal-specific code

## Decision Statement

Until implementation issues are resolved, this repository should remain planning-first, with portal work confined to `docs/portal` and explicit separation preserved between future app code, infrastructure code, and agent handoff documentation.
