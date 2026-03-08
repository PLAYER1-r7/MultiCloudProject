# portal-web

Initial static-first frontend scaffold for the MultiCloudProject portal.

## Current Scope

- Vite plus TypeScript application seed
- Minimal public route shells for the first release
- Build output intended for static deployment to S3 and CloudFront
- No framework runtime dependency yet

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

## Notes

- `VITE_BASE_PATH` can be set at build time if the app is hosted below `/`
- Secrets must not be embedded into the frontend
- This directory is the implementation target introduced by Issue 16
- Current route cards include direct links to the active GitHub project, issues, docs, and workflow definitions
