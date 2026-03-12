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

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      repo="$2"
      shift 2
      ;;
    --title)
      title="$2"
      shift 2
      ;;
    --body-file)
      body_file="$2"
      shift 2
      ;;
    --label)
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

gh auth status >/dev/null

create_cmd=(gh issue create --title "$title" --body-file "$body_file")
if [[ -n "$repo" ]]; then
  create_cmd+=(--repo "$repo")
fi

for label in "${labels[@]}"; do
  create_cmd+=(--label "$label")
done

issue_url="$(${create_cmd[@]})"
issue_number="${issue_url##*/}"

view_cmd=(gh issue view "$issue_number" --json number,title,labels)
if [[ -n "$repo" ]]; then
  view_cmd+=(--repo "$repo")
fi

label_count="$(${view_cmd[@]} | jq '.labels | length')"

if [[ "$label_count" -eq 0 ]]; then
  label_csv="$(IFS=,; echo "${labels[*]}")"
  edit_cmd=(gh issue edit "$issue_number" --add-label "$label_csv")
  if [[ -n "$repo" ]]; then
    edit_cmd+=(--repo "$repo")
  fi
  "${edit_cmd[@]}" >/dev/null
  label_count="$(${view_cmd[@]} | jq '.labels | length')"
fi

if [[ "$label_count" -eq 0 ]]; then
  echo "Issue created without labels and automatic repair failed: $issue_url" >&2
  exit 1
fi

echo "Created issue: $issue_url"
${view_cmd[@]} | jq -r '[.number, .title, (.labels | map(.name) | join(","))] | @tsv'