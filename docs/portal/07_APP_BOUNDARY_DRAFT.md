# App Boundary Draft

## Purpose

Define what is currently inside the portal planning work, what is outside it, and how future implementation directories should be separated to avoid accidental scope creep.

## Current Repository Reality

- The current repository is a planning repository centered on `docs/portal`
- `apps/portal-web` already exists as the current portal frontend seed directory
- `infra/` already exists as the current infrastructure seed directory, with environment entrypoints and reusable modules
- No unrelated application runtime directories such as `exam-solver` or `sns` exist inside this repository snapshot
- The repository also contains `docs_agent` and `docs_agent_ja`, which are operational handoff documents and not portal application code

## Current Working Boundary

- In scope now
  - portal planning documents under `docs/portal`
  - issue source files under `docs/portal/issues`
  - planning drafts that define product, scope, auth, architecture, and future implementation boundaries
  - deciding how `apps/portal-web` and `infra/` should be treated as portal-owned implementation roots
- Out of scope now
  - broad frontend implementation changes outside the agreed portal boundary while planning is still the source of truth
  - adding backend services before Issue 7 and Issue 4 establish the need
  - changing unrelated applications outside this repository scope, even if they are mentioned as context such as `exam-solver` or `sns`
  - editing `docs_agent` and `docs_agent_ja` as part of portal product work unless a documentation handoff change is explicitly required
  - using `.tmp-home` as any project-owned directory

## Recommended Directory Boundary

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
- Portal frontend runtime code should live under `apps/portal-web`
- Portal infrastructure code should live under `infra/`
- `apps/portal-web` may exist before all planning issues are complete, but planning decisions should not be moved into application code files
- `infra/environments/production` should remain reserved for production-gated work rather than early speculative changes
- Operational agent handoff documents should remain under `docs_agent` and `docs_agent_ja`
- Local machine or credential artifacts must not be tracked from `.tmp-home`
- Repository-root shared documents may be updated only when they are genuinely shared across portal work, not as a way to hide portal-specific changes outside the agreed directories

## Working Answers To The Current Boundary Questions

- `apps/portal-web` should be treated as the confirmed implementation root for the portal frontend
  - reason: the directory already exists as the portal frontend seed, and Issue 6 should refine the technical choice within that path rather than reopen the placement itself
- `infra/environments/production` should remain effectively reserved until the production design gate is satisfied, but planning-aligned README or skeleton maintenance is acceptable
  - reason: production implementation should stay blocked, while minimal structure and documentation can still remain consistent with the agreed repository layout
- Repository-root `README.md` may be edited only for genuinely shared repository navigation, planning index, or cross-cutting workflow guidance
  - reason: portal-specific requirements, boundary rules, and delivery decisions should stay in `docs/portal`, `apps/portal-web`, or `infra/` rather than expanding root-level documents unnecessarily
- `infra/modules/` should not be treated as automatically shared foundation in all cases
  - reason: modules may be reusable across environments while still remaining portal-specific, so reusability and ownership should be judged module by module
- References to `exam-solver` and `sns` should be kept only as boundary-awareness context, not as current editing scope for this repository
  - reason: those names explain why boundary discipline matters, but they do not describe directories or workloads that the current portal planning task should modify here

## Shared Foundation Versus Portal-Specific Work

- Shared foundation
  - repository-level README and high-level planning references
  - infra modules that are explicitly designed for reuse beyond a single portal-specific delivery concern
- Portal-specific work
  - portal page structure
  - portal content model
  - portal deployment path
  - portal runtime code once implementation starts
  - portal delivery modules such as a portal-only static site module, even when they are reused across staging and production

## Change Triggers

- If frontend implementation expands, keep it under `apps/portal-web` rather than placing app code under `docs/`
- If infrastructure implementation expands, keep it under `infra/` rather than mixing infrastructure files into the planning docs tree
- If shared modules emerge across future applications, document them separately from portal-specific code
- If a task requires touching a workload outside this repository, treat that as a separate boundary decision rather than assuming it is part of portal scope

## Decision Statement

Until implementation issues are resolved, this repository should remain planning-first, with portal work confined to `docs/portal` and explicit separation preserved between future app code, infrastructure code, and agent handoff documentation.

## Current Coverage Notes For Issue 5

- `docs/portal` and `docs/portal/issues` are the current planning source of truth
- `apps/portal-web` is the intended portal frontend implementation root
- `infra/` is the intended portal infrastructure implementation root
- `apps/portal-web` can be treated as a fixed placement while Issue 6 decides the frontend technical shape inside that boundary
- `infra/environments/production` stays production-gated, with only planning-aligned structural maintenance allowed before the gate is satisfied
- `docs_agent`, `docs_agent_ja`, and `.tmp-home` are outside normal portal product edits
- Repository-level shared material and portal-specific work are separated conceptually, and `infra/modules/` must be judged module by module rather than treated as globally shared by default
- References to `exam-solver` and `sns` remain contextual boundary rationale only, and the checklist should stay open until the team explicitly agrees that each Task and Definition of Done item is satisfied
