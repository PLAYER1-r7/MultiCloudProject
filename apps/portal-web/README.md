# portal-web

Initial static-first frontend scaffold for the MultiCloudProject portal.

## Current Scope

- Vite plus TypeScript application seed
- Public route shells rewritten around the current AWS and GCP delivery state
- Build output intended for static deployment to S3 and CloudFront
- No framework runtime dependency yet
- Cloud-status summary routing that points readers back to canonical repository docs
- Source-of-truth driven portal update workflow documented under docs/portal

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Route Seed

- `/`
- `/overview`
- `/guidance`
- `/platform`
- `/delivery`
- `/operations`
- `/status`

## Route Intent

- `/` is the cross-cloud entry view for the current AWS production and GCP production-equivalent snapshot
- `/overview` explains the current reader and scope boundary for the portal
- `/guidance` routes readers to status, delivery, or operations depending on intent
- `/platform` summarizes AWS production and GCP delivery surfaces side by side
- `/delivery` describes portal-web validation plus cloud-specific evidence paths
- `/operations` summarizes current operator paths and follow-up boundaries
- `/status` summarizes AWS and GCP current state, remaining tasks, closed-reference entry points, and links to canonical docs

## Notes

- `VITE_BASE_PATH` can be set at build time if the app is hosted below `/`
- Secrets must not be embedded into the frontend
- This directory is the implementation target introduced by Issue 16
- `/status` opens the canonical cloud summary and closed parent-map docs from the current route surface
- `/status` also renders AWS and GCP remaining-task cards so the next batch split can be compared at a glance
- `/status` treats the AWS DNS verification chain through Issue 95 as a closed reference, not an active follow-up queue
- Portal copy is a summary layer only; canonical state remains in repository docs and closed issue records
- `/delivery` now points to the portal update workflow so future content changes follow the same task-contract and validation loop

## Update Workflow

- Read docs_agent rules and the current docs/portal source-of-truth before editing portal copy
- Create a task contract before changing route metadata or README wording
- Update apps/portal-web/src/main.ts and this README in the same task when route intent changes
- Run `npm run test:baseline` and `npm run build` after each portal update
- Keep portal-web as a summary layer; do not let route copy become the primary record for cloud state
