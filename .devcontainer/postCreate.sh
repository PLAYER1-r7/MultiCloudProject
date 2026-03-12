#!/usr/bin/env bash
set -euo pipefail

echo "Verifying toolchain..."
node --version
npm --version
corepack enable
corepack --version
gh --version
aws --version
tofu version
docker version
rg --version | head -n 1
dig -v | head -n 1

echo "Corepack enabled. You can now use pnpm or npm."
echo "ripgrep is available via rg for fast file and text search."
echo "DNS verification tools are available via dnsutils; use dig for authoritative/public DNS checks."
echo "Recommended next steps:"
echo "1. gh auth login"
echo "2. aws sts get-caller-identity"
echo "3. tofu version"
echo "4. Review docs/portal/01_AWS_PORTAL_START_GUIDE.md"
echo "5. Review docs/portal/02_GITHUB_ISSUE_WORKFLOW.md"