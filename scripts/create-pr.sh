#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/create-pr.sh --title <title> --body-file <path> [--repo <owner/repo>] [--base <branch>] [--head <branch>]

Required:
  --title       Pull request title
  --body-file   Path to the markdown file used as the PR body

Optional:
  --repo        Target repository in owner/repo form
  --base        Base branch
  --head        Head branch

Behavior:
  - validates required inputs
  - checks GitHub authentication
  - warns if the current branch is the default branch
  - runs gh pr create with the provided arguments
EOF
}

repo="PLAYER1-r7/MultiCloudProject"
title=""
body_file=""
base_branch=""
head_branch=""

require_option_value() {
  local option_name="$1"
  local option_value="${2-}"

  if [[ -z "$option_value" || "$option_value" == --* ]]; then
    echo "Missing value for $option_name." >&2
    usage >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      require_option_value "$1" "${2-}"
      title="$2"
      shift 2
      ;;
    --body-file)
      require_option_value "$1" "${2-}"
      body_file="$2"
      shift 2
      ;;
    --repo)
      require_option_value "$1" "${2-}"
      repo="$2"
      shift 2
      ;;
    --base)
      require_option_value "$1" "${2-}"
      base_branch="$2"
      shift 2
      ;;
    --head)
      require_option_value "$1" "${2-}"
      head_branch="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$title" || -z "$body_file" ]]; then
  echo "Missing required arguments." >&2
  usage >&2
  exit 1
fi

if [[ ! -f "$body_file" ]]; then
  echo "Body file not found: $body_file" >&2
  exit 1
fi

if [[ ! -s "$body_file" ]]; then
  echo "Body file is empty: $body_file" >&2
  exit 1
fi

current_branch="$(git branch --show-current)"

if [[ -z "$current_branch" ]]; then
  echo "Could not determine current git branch." >&2
  exit 1
fi

if [[ "$current_branch" == "main" && -z "$head_branch" ]]; then
  echo "Warning: current branch is the default branch 'main'." >&2
  echo "Consider creating the PR from a feature branch or pass --head explicitly." >&2
fi

if ! gh auth status; then
  echo "GitHub authentication check failed." >&2
  exit 1
fi

create_cmd=(
  gh pr create
  --repo "$repo"
  --title "$title"
  --body-file "$body_file"
)

if [[ -n "$base_branch" ]]; then
  create_cmd+=(--base "$base_branch")
fi

if [[ -n "$head_branch" ]]; then
  create_cmd+=(--head "$head_branch")
fi

"${create_cmd[@]}"