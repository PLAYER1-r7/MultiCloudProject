# Docset Sync Rules

## Purpose

Keep `docs_agent/` and `docs_agent_ja/` structurally aligned so agents can switch language without losing document order, scope, or intent.

## Source of Truth

- `docs_agent/` is the default operational source for agent-facing structure.
- `docs_agent_ja/` must mirror the same numbering and document intent.
- A rename in one folder requires the same rename in the other folder.

## Mandatory Sync Rules

- Keep identical numeric prefixes in both folders.
- Keep the same document count in both folders.
- Keep section purpose aligned even when wording differs by language.
- Keep template fields aligned one-to-one across both languages.
- Update both `01_START_HERE.md` files whenever reading order changes.
- If only one language is updated, record the mismatch and fix it in the same task when possible.
- If a local issue definition is used as the source for a GitHub issue or PR body, sync the remote body in the same task whenever possible.
- Before requesting external review based on GitHub content, commit and push the review target or explicitly state that the review is against a local-only draft.
- If a review-remediation pass changes a local source document, create a dedicated task contract or execution record for that remediation scope.
- If work starts before every contract detail is known, use the minimum starter contract format and mark unknown fields as `TBD` in both languages instead of omitting the contract.
- Keep completion wording aligned across checklist sections, status sections, and remote issue state.
- Keep review-state sections inside the local source document aligned. Do not leave Current Draft Focus, Final Review Result, and Current Status pointing to different stages.
- If the local source document may have been changed by a formatter, another editor, or a resumed session after the latest review pass, reread the current file before adding approval records or other final-state edits.
- Do not sync a remote issue or PR body with new Final Review Result, completion wording, or equivalent final-state language until the commit and push containing that wording are already published.
- If human re-agreement is obtained after review remediation, record it separately from agent validation and do not treat it as issue close approval.
- When recording human re-agreement in a comment, mark it as a concise record, point canonical wording to the issue or PR body's Resolution or equivalent section, and state explicitly that the comment is not close approval.
- If the local source document changes after the last remote sync, sync the remote issue or PR body again before close or any equivalent final-state transition.

## Preferred Structured Formats

| Need                                        | Preferred format                           | Reason                                                     |
| ------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| Routing between documents                   | Markdown table                             | Easy for agents to scan and compare                        |
| Fixed execution loop                        | Mermaid flowchart plus nearby text summary | Keeps order explicit while remaining machine-readable text |
| Input or output fields                      | Markdown bullets or fenced text template   | Field names stay stable across languages                   |
| Cross-cloud or cross-environment comparison | Markdown table                             | Low ambiguity for row and column lookup                    |

## Format Rules

- Prefer Markdown tables for stable mappings, decisions, and comparisons.
- Use Mermaid only for simple directional flows that also have a nearby text summary.
- Do not use image-only diagrams or layout-dependent ASCII art that depends on exact spacing.
- If a table or diagram is added in one language, add the same structure in the other language.

## Fixed Example Allocation

Use the same example roster in both languages so example-driven handoff stays predictable.

| Example track           | Issue  | App                   | Canonical workflows                                                | Reviewer role          | Approval owner role          | Default example docs                                                                     |
| ----------------------- | ------ | --------------------- | ------------------------------------------------------------------ | ---------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml`, `deploy-exam-solver-gcp.yml`         | `exam-solver-reviewer` | `exam-solver-approval-owner` | `03`, `10`, `14`, `15`, `17`, `18`, `23`, `28`, `31`                                     |
| SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`, `deploy-sns-azure.yml`, `deploy-sns-gcp.yml` | `sns-reviewer`         | `sns-approval-owner`         | `05`, `08`, `11`, `16`, `19`, `20`, `21`, `22`, `24`, `25`, `26`, `27`, `29`, `30`, `32` |
| Shared governance track | mixed  | `exam-solver` + `sns` | use the workflow set that matches the sentence                     | `platform-reviewer`    | `platform-approval-owner`    | `12`, `13`                                                                               |

Role definitions for `reviewer` and `approval owner` are maintained in `ROLE_HANDOFF_OWNERSHIP.md`. Keep example naming aligned with that document instead of redefining the roles here.

## Canonical Example By Document

Use this table when editing one document at a time and you need the exact canonical example tuple.

| Doc  | Example track           | Issue  | App                   | Canonical workflow set       | Reviewer role          | Approval owner role          | Primary example fields in priority order                        |
| ---- | ----------------------- | ------ | --------------------- | ---------------------------- | ---------------------- | ---------------------------- | --------------------------------------------------------------- |
| `03` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Requester 2) Expected value 3) In scope`                    |
| `05` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Mitigation 2) Rollback 3) Reviewer Notes`                   |
| `08` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Evidence 3) Next action`                         |
| `10` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Summary 2) What Worked 3) Next Week Actions`                |
| `11` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) KPI Rollup 2) Root Causes 3) Next Month Plan`               |
| `12` | Shared governance track | mixed  | `exam-solver` + `sns` | sentence-specific workflow   | `platform-reviewer`    | `platform-approval-owner`    | `1) KPI Rollup 2) Governance Decisions 3) Next Quarter Roadmap` |
| `13` | Shared governance track | mixed  | `exam-solver` + `sns` | sentence-specific workflow   | `platform-reviewer`    | `platform-approval-owner`    | `1) Annual KPIs 2) Major Incident Learnings 3) Next Year Plan`  |
| `14` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `15` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `16` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `17` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `18` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `19` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `20` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `21` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `22` | SNS track               | `#487` | `sns`                 | `deploy-sns-azure.yml`       | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `23` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-gcp.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `24` | SNS track               | `#487` | `sns`                 | `deploy-sns-gcp.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `25` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `26` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `27` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `28` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `29` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `30` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `31` | Exam-solver track       | `#451` | `exam-solver`         | `deploy-exam-solver-aws.yml` | `exam-solver-reviewer` | `exam-solver-approval-owner` | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |
| `32` | SNS track               | `#487` | `sns`                 | `deploy-sns-aws.yml`         | `sns-reviewer`         | `sns-approval-owner`         | `1) Outcome 2) Actions taken 3) Evidence 4) Next action`        |

## Example Naming Rule

- Keep the same issue number, reviewer role, and approval owner role in the matching English and Japanese example.
- If an example mentions a workflow in one language, mention the corresponding workflow in the other language.
- Put reviewer or approval owner names inside existing example fields such as `Requester`, `Reviewer Notes`, `Actions taken`, `Evidence`, or `Next action`; do not create a language-only field.
- If you need role behavior, responsibilities, or handoff boundaries, refer to `ROLE_HANDOFF_OWNERSHIP.md` rather than duplicating the rule in another document.

## Change Procedure

1. Edit or add the English document.
2. Apply the same structural change to the Japanese document.
3. Update both start files if references changed.
4. Verify both folders contain the same numbered set.

## Done Check

- [ ] Numbering matches
- [ ] File count matches
- [ ] Reading order matches
- [ ] Section structure matches
- [ ] Meaning matches across languages

```bash
# Confirm both folders contain the same file set
diff <(ls docs_agent/ | sort) <(ls docs_agent_ja/ | sort)
```

Expected output: no diff output.
