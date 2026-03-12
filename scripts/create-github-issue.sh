#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/create-github-issue.sh --title <title> --body-file <path> --label <label> [--label <label> ...] [--repo <owner/repo>]

Required:
  --title       Issue title
  --body-file   Path to the markdown file used as the issue body
  --label       At least one label; repeat the flag for multiple labels

Optional:
  --repo        Target repository in owner/repo form

Behavior:
  - creates the GitHub Issue
  - verifies the created issue has labels
  - if the created issue has zero labels, reapplies the requested labels and verifies again
EOF
}

repo=""
title=""
body_file=""
labels=()

resolve_repo() {
  local resolved_repo

  resolved_repo="$(gh repo view --json nameWithOwner --jq '.nameWithOwner' 2>/dev/null || true)"
  if [[ -n "$resolved_repo" ]]; then
    echo "$resolved_repo"
    return 0
  fi

  echo "Could not determine the GitHub repository automatically. Pass --repo <owner/repo>." >&2
  exit 1
}

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
    --repo)
      require_option_value "$1" "${2-}"
      repo="$2"
      shift 2
      ;;
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
    --label)
      require_option_value "$1" "${2-}"
      labels+=("$2")
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

if [[ -z "$title" || -z "$body_file" || ${#labels[@]} -eq 0 ]]; then
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

gh auth status >/dev/null

if [[ -z "$repo" ]]; then
  repo="$(resolve_repo)"
fi

create_cmd=(gh issue create --title "$title" --body-file "$body_file")
create_cmd+=(--repo "$repo")

for label in "${labels[@]}"; do
  create_cmd+=(--label "$label")
done

issue_url="$("${create_cmd[@]}")"

view_cmd=(gh issue view "$issue_url" --repo "$repo" --json number,title,labels)

label_count="$("${view_cmd[@]}" --jq '.labels | length')"

if [[ "$label_count" -eq 0 ]]; then
  edit_cmd=(gh issue edit "$issue_url" --repo "$repo")
  for label in "${labels[@]}"; do
    edit_cmd+=(--add-label "$label")
  done
  "${edit_cmd[@]}" >/dev/null
  label_count="$("${view_cmd[@]}" --jq '.labels | length')"
fi

if [[ "$label_count" -eq 0 ]]; then
  echo "Issue created without labels and automatic repair failed: $issue_url" >&2
  exit 1
fi

echo "Created issue: $issue_url"
"${view_cmd[@]}" --jq '[.number, .title, (.labels | map(.name) | join(","))] | @tsv'