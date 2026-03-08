# Docset Improvement Proposals

## Purpose

This document records improvement proposals identified after a full read of all 34 files in `docs_agent/`.
Each proposal includes the source document, the observed issue, and a concrete recommended change.

Proposals are grouped into five categories:

- **A. Ambiguous Definitions** — rules that exist but lack precise boundaries
- **B. Contradictions** — rules that conflict with each other across documents
- **C. Structural Redundancy** — content that is duplicated and risks diverging
- **D. Missing Content** — mandatory gates or procedures with no executable guidance
- **E. Structural Issues** — document organization that creates navigation gaps

---

## Category A: Ambiguous Definitions

### A-1: "Small reversible changes" has no size boundary

- **Source documents:** `02_AUTONOMOUS_DEV_PROTOCOL.md`, `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **Issue:** The rule "make small, reversible changes" appears in both documents but neither defines what counts as small. Agents can interpret this arbitrarily and make large edits while still claiming to follow the rule.
- **Proposed change:** Add a concrete boundary to `02_AUTONOMOUS_DEV_PROTOCOL.md` under the Implement step:
  - A single change should touch no more than 5 files.
  - Net line delta should not exceed 200 lines unless the task contract explicitly scopes a larger surface.
  - Multiple files are acceptable when they form one logically cohesive unit (for example, a config change and its matching test).

---

### A-2: Test baseline 88% has no measurement method

- **Source document:** `32_TEST_EXECUTION_GATE.md`
- **Issue:** The rule states "keep or improve the current project test baseline; if coverage drops below the current reference baseline of 88%, explain why." No tool, command, or metric type is specified, so agents cannot actually verify compliance.
- **Proposed change:** Add the canonical coverage command to `32_TEST_EXECUTION_GATE.md` under the Gate Sequence section:
  ```bash
  cd services/<app>
  pytest --cov=. --cov-report=term-missing tests/
  ```
  State that line coverage is the measurement type and that the 88% threshold applies per changed service, not across the entire repository.

---

### A-3: "Rollback path documented" has no minimum content requirement

- **Source documents:** `04_DEFINITION_OF_DONE.md`, `03_TASK_CONTRACT_TEMPLATE.md`
- **Issue:** The DoD mandatory gate "Rollback path documented" can technically be satisfied by a single line such as "restart the service." This is insufficient for a reviewer or approval owner to act on during an incident.
- **Proposed change:** Add a minimum rollback definition to `04_DEFINITION_OF_DONE.md`:
  A rollback entry must include at least:
  1. The exact revert command or step sequence.
  2. The expected recovery time.
  3. The validation command that confirms the rollback succeeded.

---

### A-4: "Smallest safe mitigation" has no tiebreaker when multiple candidates exist

- **Source documents:** `20_MANUAL_DEPLOY_DECISION_CRITERIA.md`, `21_AWS_INCIDENT_PATTERN_PLAYBOOK.md`, `22_AZURE_INCIDENT_PATTERN_PLAYBOOK.md`, `23_GCP_INCIDENT_PATTERN_PLAYBOOK.md`, `30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md`
- **Issue:** Each cloud-specific playbook instructs agents to apply the "smallest safe mitigation," but when two or more mitigations look equally scoped, there is no rule for which to choose first.
- **Proposed change:** Add a tiebreaker priority rule to `30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md`:
  When choosing between mitigations of similar scope, prefer in this order:
  1. The mitigation that affects the fewest system components.
  2. The mitigation that is fully reversible without a deploy.
  3. The mitigation that does not require production approval.
     If no clear winner exists, escalate rather than guess.

---

## Category B: Contradictions

### B-1: Manual deploy for emergencies conflicts with the "unknown root cause" stop rule

- **Source documents:** `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` vs `02_AUTONOMOUS_DEV_PROTOCOL.md`, `14_CRITICAL_GUARDRAILS_EXTRACT.md`
- **Issue:** Doc 20 permits manual deploy for "emergency recovery," but docs 02 and 14 require a hard stop when the root cause is unknown. These rules can both apply at the same time during an incident, with no bridge between them.
- **Proposed change:** Add an explicit bridge rule to `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` under the Manual Deploy Allowed Only If section:
  Emergency manual deploy is permitted only when the failure origin is scoped to a specific layer (configuration, deploy artifact, or environment variable). If the failure origin cannot be narrowed to a specific layer, classify the situation as "root cause unknown" and apply the hard stop rule from `02_AUTONOMOUS_DEV_PROTOCOL.md` instead.

---

### B-2: Test baseline 88% cannot be applied if the codebase is already below it

- **Source document:** `32_TEST_EXECUTION_GATE.md`
- **Issue:** The rule "if coverage drops below 88%, explain why" implies 88% is already the current state. If the project currently sits at 75%, the rule cannot be applied as written and agents have no guidance.
- **Proposed change:** Replace the absolute floor with a relative rule in `32_TEST_EXECUTION_GATE.md`:
  Keep or improve the coverage level that exists at task start. The long-term target is 88%. If the starting coverage is below 88%, do not reduce it further and note the current baseline in the evidence record.

---

### B-3: Approval owner response has no wait limit

- **Source documents:** `ROLE_HANDOFF_OWNERSHIP.md`, `08_ESCALATION_AND_HANDOFF.md`, `05_PR_TASK_CONTRACT_TEMPLATE.md`
- **Issue:** After the agent submits a handoff with `Outcome: Handoff ready`, there is no defined timeout before a re-escalation is triggered. An agent can wait indefinitely with no action rule.
- **Proposed change:** Add a default wait window to `ROLE_HANDOFF_OWNERSHIP.md` under Approval Owner Responsibilities:
  - Non-production work: re-escalate after 24 hours with `Outcome: Re-escalation requested - approval not received`.
  - Production incident: re-escalate after 2 hours.
    The re-escalation payload should reuse the same execution record from the original handoff.

---

### B-4: Shared infrastructure changes have no boundary rule

- **Source document:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`
- **Issue:** Doc 15 defines boundaries for exam-solver and sns separately, but does not address changes to `infrastructure/pulumi/` or other paths that affect both apps simultaneously. Agents must make boundary decisions for these paths without guidance.
- **Proposed change:** Add a third boundary tier to `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`:
  - **Shared infrastructure** (`infrastructure/`, `scripts/`, `.github/workflows/` outside app-specific deploy files): edits here require an explicit cross-app coordination contract and must use `platform-reviewer` and `platform-approval-owner` roles defined in `ROLE_HANDOFF_OWNERSHIP.md`.
  - Single-app changes that happen to touch a shared path must be split into a separate shared-infrastructure contract before proceeding.

---

## Category C: Structural Redundancy

### C-1: Task contract template is defined twice in the same file

- **Source document:** `03_TASK_CONTRACT_TEMPLATE.md`
- **Issue:** The document contains the task contract twice: once as a fenced copy-ready code block and again as rendered Markdown section headers below it. An agent that reads only the lower half gets a structurally different format. Changes to one version will not automatically update the other, creating long-term drift.
- **Proposed change:** Remove the rendered Markdown section version from `03_TASK_CONTRACT_TEMPLATE.md`. Keep only the fenced copy-ready block. Add a single line after the block: "Copy the block above exactly; do not reformat into Markdown headers."

---

### C-2: Handoff payload format is defined in both doc 05 and doc 08

- **Source documents:** `05_PR_TASK_CONTRACT_TEMPLATE.md`, `08_ESCALATION_AND_HANDOFF.md`
- **Issue:** Both documents independently define a handoff payload block. An agent that reads only doc 05 will miss the escalation variant in doc 08, and changes to the canonical format in doc 08 may not be reflected in doc 05.
- **Proposed change:** In `05_PR_TASK_CONTRACT_TEMPLATE.md`, replace the inline payload block with an explicit reference: "Use the shared payload format defined in `08_ESCALATION_AND_HANDOFF.md`. Set `Outcome: Handoff ready` when submitting a PR."

---

### C-3: Doc 16 duplicates the test gate sequence from doc 32 without the evidence rules

- **Source documents:** `16_TEST_AND_DEPLOY_QUICK_REF.md`, `32_TEST_EXECUTION_GATE.md`
- **Issue:** Doc 16 lists the same smoke → target test → deploy sequence as doc 32, but without the evidence rules, pass conditions, and baseline requirements. An agent using only doc 16 will run the right commands but produce an incomplete evidence record.
- **Proposed change:** Reduce `16_TEST_AND_DEPLOY_QUICK_REF.md` to a one-page quick start that covers only the fast commands and a single pointer: "For evidence requirements, pass conditions, and baseline rules, `32_TEST_EXECUTION_GATE.md` is the authority."

---

## Category D: Missing Content

### D-1: Production CORS verification has no executable command

- **Source documents:** `14_CRITICAL_GUARDRAILS_EXTRACT.md`, `31_PRODUCTION_READINESS_GATE.md`
- **Issue:** Both documents require CORS verification as a mandatory step, but neither provides a command or expected output format. Agents cannot satisfy this gate in a verifiable way.
- **Proposed change:** Add canonical verification commands to `31_PRODUCTION_READINESS_GATE.md` under Security Verification Points:
  ```bash
  curl -s -I -X OPTIONS \
    -H "Origin: https://<allowed-domain>" \
    -H "Access-Control-Request-Method: GET" \
    <endpoint-url> | grep -i "access-control"
  ```
  Expected output: `Access-Control-Allow-Origin: https://<allowed-domain>` (never `*`).
  For Azure, run once against the Function App URL and once against the Blob Storage endpoint.

---

### D-2: No fallback when `check-app-boundary.sh` is absent

- **Source document:** `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`
- **Issue:** The boundary guard command is listed as mandatory before and after edits, but the document provides no alternative if the script does not exist or fails to run.
- **Proposed change:** Add a fallback procedure to `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`:
  ```bash
  # For exam-solver: confirm no sns paths were touched
  git diff --name-only | grep -E "sns-api|frontend_react"
  # For sns: confirm no exam-solver paths were touched
  git diff --name-only | grep -E "exam-solver-api|frontend_exam"
  ```
  If either command returns results, stop and split the work. Record "manual boundary check used" in the evidence field.

---

### D-3: Severity classification in doc 18 omits P0

- **Source documents:** `18_INCIDENT_TRIAGE_RUNBOOK.md`, `19_RECOVERY_PRIORITY_RUNBOOK.md`
- **Issue:** Doc 19 defines P0 as "major production outage or security risk," but doc 18's triage runbook only lists P1, P2, and P3. An agent performing triage cannot correctly classify a P0 event using the triage document alone.
- **Proposed change:** Add P0 to step 3 of `18_INCIDENT_TRIAGE_RUNBOOK.md`:
  - P0: major production outage or active security breach — escalate immediately, do not wait for full triage.
  - P1: major degradation with a known workaround.
  - P2: staging or non-critical path failure.
  - P3: cosmetic or non-blocking issue.

---

### D-4: No timeout for authentication request wait

- **Source document:** `17_AUTH_REQUEST_PLAYBOOK.md`
- **Issue:** The playbook says "resume only after re-authentication is confirmed" but gives no timeout. An agent can wait indefinitely with no re-escalation trigger.
- **Proposed change:** Add wait limits to `17_AUTH_REQUEST_PLAYBOOK.md` under Immediate Action Order:
  - Non-production task: wait maximum 30 minutes.
  - Active production incident: wait maximum 15 minutes.
    If not confirmed within the window, re-escalate using `08_ESCALATION_AND_HANDOFF.md` with `Outcome: Re-escalation requested - authentication still missing`.

---

## Category E: Structural Issues

### E-1: Execution Record format is copy-pasted into 19 documents with no single source of truth

- **Source documents:** `14_CRITICAL_GUARDRAILS_EXTRACT.md` through `32_TEST_EXECUTION_GATE.md` (19 files)
- **Issue:** Every operational document contains its own copy of the Execution Record block. There is no canonical definition. When the format needs to change (for example, adding a new field), all 19 copies must be updated manually, and divergence is inevitable.
- **Proposed change:** Define the Execution Record once in `08_ESCALATION_AND_HANDOFF.md` under a new section "Canonical Execution Record Format." In each of docs 14–32, replace the inline block with: "Fill using the Execution Record format defined in `08_ESCALATION_AND_HANDOFF.md`." Include a copy-ready reminder only in doc 08.

---

### E-2: Incident response entry point is ambiguous across docs 18, 28, and 29

- **Source documents:** `18_INCIDENT_TRIAGE_RUNBOOK.md`, `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`, `29_ONCALL_MONITORING_ONEPAGE.md`
- **Issue:** All three documents describe first-response behavior during an incident or alert. An agent receiving an alert cannot determine which document to open first without reading all three. The routing table in `01_START_HERE.md` says "read `18_INCIDENT_TRIAGE_RUNBOOK.md` first" but docs 28 and 29 both describe themselves as first-5-minute documents.
- **Proposed change:** Add a one-line decision rule to the Fast Routing Table in `01_START_HERE.md`:
  - Alert active for less than 5 minutes with no identified symptom → `29_ONCALL_MONITORING_ONEPAGE.md`
  - Active incident with an identified symptom → `18_INCIDENT_TRIAGE_RUNBOOK.md`
  - Alert storm with no single clear cause → `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`

---

## Additional Review Items: Contradictions

### B-5: Severity Guide in `19_RECOVERY_PRIORITY_RUNBOOK.md` omits P3, conflicting with doc 18

- **Source documents:** `18_INCIDENT_TRIAGE_RUNBOOK.md`, `19_RECOVERY_PRIORITY_RUNBOOK.md`
- **Issue:** The D-3 fix added P0/P1/P2/P3 four-level severity to doc 18, but doc 19's Severity Guide still lists only P0/P1/P2. P3 is defined in doc 18 as "cosmetic or non-blocking issue," but it does not exist in doc 19. This leaves an inconsistency between the two documents.
- **Proposed change:** Add P3 to the Severity Guide in `19_RECOVERY_PRIORITY_RUNBOOK.md`:
  - P3: cosmetic or non-blocking issue. Address only after P0, P1, and P2 are all stable.

---

## Additional Review Items: Structural Redundancy

### C-4: "Required Task Record" in `02_AUTONOMOUS_DEV_PROTOCOL.md` uses a different field set than the canonical format in doc 08

- **Source documents:** `02_AUTONOMOUS_DEV_PROTOCOL.md`, `08_ESCALATION_AND_HANDOFF.md`
- **Issue:** Doc 02 ends with a "Required Task Record" listing the fields "Scope in / out", "Changed files", "Validation commands and results", "Risks", and "Rollback method". The canonical Execution Record in doc 08 uses a different set: "Document / Scope / Outcome / Actions taken / Evidence / Risks or blockers / Next action". An agent reading both documents cannot determine which field set to use for its record.
- **Proposed change:** Replace the Required Task Record section in `02_AUTONOMOUS_DEV_PROTOCOL.md` with a single reference line:
  "Use the canonical Execution Record format defined in `08_ESCALATION_AND_HANDOFF.md` for task records."

---

### C-5: "Completion Hand-off Rule" in `03_TASK_CONTRACT_TEMPLATE.md` presents two formats as OR when they are effectively the same

- **Source documents:** `03_TASK_CONTRACT_TEMPLATE.md`, `08_ESCALATION_AND_HANDOFF.md`
- **Issue:** The "Completion Hand-off Rule" at the end of doc 03 says to close the task with "either the shared execution record format from docs 14-32, OR the shared handoff payload format in `08_ESCALATION_AND_HANDOFF.md`." However, docs 14-32 were already updated to reference doc 08, so both options are effectively identical. The OR phrasing may mislead an agent into thinking there are two distinct formats.
- **Proposed change:** Simplify the Completion Hand-off Rule in `03_TASK_CONTRACT_TEMPLATE.md` to a single line:
  "Close the task using the canonical Execution Record format in `08_ESCALATION_AND_HANDOFF.md`."

---

## Additional Review Items: Missing Content

### D-5: Mandatory gates in `04_DEFINITION_OF_DONE.md` have no document references

- **Source document:** `04_DEFINITION_OF_DONE.md`
- **Issue:** The DoD mandatory gates are a checklist, but none of the items include a pointer to the document that governs how that gate is satisfied. For example, there is no reference to `32_TEST_EXECUTION_GATE.md` for the test gate, or to the Minimum Rollback Content section within the same file. An agent must independently discover which document covers each gate.
- **Proposed change:** Add a brief reference after each mandatory gate in `04_DEFINITION_OF_DONE.md`:
  - **Required tests passed**: use `32_TEST_EXECUTION_GATE.md` for the gate sequence.
  - **No security regression**: check stop conditions in `14_CRITICAL_GUARDRAILS_EXTRACT.md`.
  - **Rollback path documented**: satisfy the three requirements in the Minimum Rollback Content section of this document.
  - **Change summary is clear**: follow the packaging rule in `05_PR_TASK_CONTRACT_TEMPLATE.md`.

---

### D-6: Validation scripts are missing from the tooling list in `06_TOOLING_AND_SERVICES.md`

- **Source document:** `06_TOOLING_AND_SERVICES.md`
- **Issue:** Doc 06 lists Git, Python, Node.js, Docker, and cloud CLIs as required tooling, but does not mention `./scripts/test-endpoints.sh` and `./scripts/test-e2e.sh`, which appear in docs 18, 28, 29, and 32. An agent reading doc 06 alone has no indication that these scripts exist.
- **Proposed change:** Add one item at the end of the Required Tooling section in `06_TOOLING_AND_SERVICES.md`:
  - Project validation scripts: `./scripts/test-endpoints.sh` and `./scripts/test-e2e.sh` (used for smoke and end-to-end validation).

---

### D-7: Done Check in `09_DOCSET_SYNC_RULES.md` has no verification command

- **Source document:** `09_DOCSET_SYNC_RULES.md`
- **Issue:** The Done Check at the end of doc 09 lists "numbering matches" and "file count matches" as checkboxes only. No executable command is provided. Each agent must independently decide how to verify these conditions, leading to inconsistent verification quality.
- **Proposed change:** Add a verification command to the Done Check section in `09_DOCSET_SYNC_RULES.md`:
  ```bash
  # Confirm both folders contain the same file set
  diff <(ls docs_agent/ | sort) <(ls docs_agent_ja/ | sort)
  ```
  Expected output: no diff output (empty result means the folders are in sync).

---

## Additional Review Items: Structural Issues

### E-3: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` is absent from the reading order and reference map in `01_START_HERE.md`

- **Source documents:** `01_START_HERE.md`, `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **Issue:** Doc 07 provides a three-phase checklist (Before Coding / During Coding / Before Handoff) that acts as a safety net for autonomous work. However, doc 01 lists only eight documents in its reading order and doc 07 is not among them, nor does the reference map mention it. An agent that completes the core reading set has no indication that doc 07 exists.
- **Proposed change:** Add doc 07 to the Reference Map in `01_START_HERE.md`:
  "Self-check before and after coding: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`"

---

## Third Review Items: Structural Redundancy

### C-6: `05_PR_TASK_CONTRACT_TEMPLATE.md` repeats template fields as Markdown headers after the copy-ready block

- **Source document:** `05_PR_TASK_CONTRACT_TEMPLATE.md`
- **Issue:** After the copy-ready fenced block and the short example, the document repeats the fields — Summary, Contract Alignment, Validation, Risk, and Reviewer Notes — as empty rendered Markdown section headers. An agent reading from that point sees unfenced blank fields without the copy-once note from the fenced block. The C-1 fix applied the same correction to `03_TASK_CONTRACT_TEMPLATE.md` but doc 05 was not updated at the same time.
- **Proposed change:** Remove the duplicate Summary, Contract Alignment, Validation, Risk, and Reviewer Notes Markdown sections from the bottom of `05_PR_TASK_CONTRACT_TEMPLATE.md`. Keep the fenced template, the short example, and the unique "Connection to Shared Record Format" and "Packaging Rule" sections. Add a note after the fenced block: "Copy the block above exactly; do not reformat into Markdown headers."

---

### C-7: Review templates (10–13) repeat blank field headers after the copy-ready block

- **Source documents:** `10_WEEKLY_REVIEW_TEMPLATE.md`, `11_MONTHLY_REVIEW_TEMPLATE.md`, `12_QUARTERLY_REVIEW_TEMPLATE.md`, `13_ANNUAL_REVIEW_TEMPLATE.md`
- **Issue:** Each review template contains a fenced copy-ready block, a short example, and then the same field names repeated as empty rendered Markdown section headers. The bottom sections add no unique guidance and function as a second blank copy of the template. An agent using the rendered sections gets a structurally different view than one using the fenced block.
- **Proposed change:** Remove the duplicate blank Markdown section headers from the bottom of each review template (10–13). Keep the fenced copy-ready block and the short example only. Add a line after each example: "Copy the fenced block above to start a new review entry."

---

## Third Review Items: Missing Content

### D-8: `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` does not route to `24_CROSS_CLOUD_INCIDENT_MATRIX.md`

- **Source documents:** `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`, `24_CROSS_CLOUD_INCIDENT_MATRIX.md`
- **Issue:** Doc 28 is used when the failing cloud is not yet identified (alert storm scenario). Its initial response section routes to docs 18, 21, 22, 23, or 29 as follow-up destinations. Doc 24 (Cross-Cloud Incident Matrix) is specifically designed for the situation where the cloud domain is unknown and a symptom-to-cloud mapping is needed, but doc 24 is absent from the routing list. An agent triaging an alert storm will not discover doc 24 without independently checking the reference map.
- **Proposed change:** Add a routing note to the Initial Response section of `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md`: "If the failing cloud is not yet certain, use `24_CROSS_CLOUD_INCIDENT_MATRIX.md` to narrow down the domain before switching to a provider-specific playbook."

---

### D-9: `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` checklist items have no failure pointers

- **Source document:** `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`
- **Issue:** Each checklist item corresponds to a governing document (for example, "Required authentication confirmed" → `17_AUTH_REQUEST_PLAYBOOK.md`; "DoD mandatory gates passed" → `04_DEFINITION_OF_DONE.md`), but no pointers appear in the document. An agent that finds an item unchecked must independently determine where to go next.
- **Proposed change:** Add a brief "If blocked" pointer after each checklist phase heading in `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md`:
  - Before Coding: "If blocked: auth → `17_AUTH_REQUEST_PLAYBOOK.md`; contract or scope → `03_TASK_CONTRACT_TEMPLATE.md`; boundary → `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`."
  - During Coding: "If blocked: boundary violation → `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`; hard stop condition → `14_CRITICAL_GUARDRAILS_EXTRACT.md`."
  - Before Handoff: "If blocked: test gate → `32_TEST_EXECUTION_GATE.md`; DoD gate → `04_DEFINITION_OF_DONE.md`; PR packaging → `05_PR_TASK_CONTRACT_TEMPLATE.md`."

---

### D-10: Delivery gates in `04_DEFINITION_OF_DONE.md` lack document references

- **Source document:** `04_DEFINITION_OF_DONE.md`
- **Issue:** The D-5 fix added document references to mandatory gates and the first delivery gate ("Change summary is clear → `05_PR_TASK_CONTRACT_TEMPLATE.md`"), but the remaining three delivery gates ("Risks and trade-offs are explicit", "Reviewer instructions are included", "Follow-up work is logged if needed") have no pointers. An agent cannot determine where to go to satisfy these gates.
- **Proposed change:** Add references to the remaining delivery gates in `04_DEFINITION_OF_DONE.md`:
  - **Risks and trade-offs are explicit**: record in the Risk and Rollback section of `03_TASK_CONTRACT_TEMPLATE.md`.
  - **Reviewer instructions are included**: follow the Reviewer Notes format in `05_PR_TASK_CONTRACT_TEMPLATE.md`.
  - **Follow-up work is logged if needed**: record in `Next action` of the canonical execution record in `08_ESCALATION_AND_HANDOFF.md`.

---

## Implementation Status

The following proposals have been implemented in the current docset revision:

- Completed P1 items: `D-3`, `B-1`, `A-2`, `C-1`, `E-2`, `B-5`, `E-3`
- Completed P2 items: `D-1`, `B-4`, `A-1`, `B-2`, `B-3`, `A-3`, `D-2`, `D-4`, `C-4`, `D-5`, `D-6`, `D-8`, `D-9`
- Completed P3 items: `E-1`, `C-2`, `A-4`, `C-3`, `C-5`, `D-7`, `C-6`, `C-7`, `D-10`

There are no remaining open items from this proposal set.

---

## Priority Matrix

| ID   | Category              | Impact | Effort | Priority | Status    |
| ---- | --------------------- | ------ | ------ | -------- | --------- |
| D-3  | Missing Content       | High   | Low    | P1       | Completed |
| B-1  | Contradiction         | High   | Low    | P1       | Completed |
| A-2  | Ambiguous Definition  | High   | Low    | P1       | Completed |
| C-1  | Structural Redundancy | Medium | Low    | P1       | Completed |
| E-2  | Structural Issue      | High   | Low    | P1       | Completed |
| B-5  | Contradiction         | Medium | Low    | P1       | Completed |
| E-3  | Structural Issue      | Medium | Low    | P1       | Completed |
| D-1  | Missing Content       | High   | Medium | P2       | Completed |
| B-4  | Contradiction         | High   | Medium | P2       | Completed |
| A-1  | Ambiguous Definition  | Medium | Low    | P2       | Completed |
| B-2  | Contradiction         | Medium | Low    | P2       | Completed |
| B-3  | Contradiction         | Medium | Medium | P2       | Completed |
| A-3  | Ambiguous Definition  | Medium | Low    | P2       | Completed |
| D-2  | Missing Content       | Medium | Low    | P2       | Completed |
| D-4  | Missing Content       | Medium | Low    | P2       | Completed |
| C-4  | Structural Redundancy | Medium | Low    | P2       | Completed |
| D-5  | Missing Content       | Medium | Low    | P2       | Completed |
| D-6  | Missing Content       | Low    | Low    | P2       | Completed |
| E-1  | Structural Issue      | Medium | High   | P3       | Completed |
| C-2  | Structural Redundancy | Low    | Low    | P3       | Completed |
| A-4  | Ambiguous Definition  | Medium | Medium | P3       | Completed |
| C-3  | Structural Redundancy | Low    | Low    | P3       | Completed |
| C-5  | Structural Redundancy | Low    | Low    | P3       | Completed |
| D-7  | Missing Content       | Low    | Low    | P3       | Completed |
| D-8  | Missing Content       | Medium | Low    | P2       | Completed |
| D-9  | Missing Content       | Medium | Low    | P2       | Completed |
| C-6  | Structural Redundancy | Low    | Low    | P3       | Completed |
| C-7  | Structural Redundancy | Low    | Low    | P3       | Completed |
| D-10 | Missing Content       | Low    | Low    | P3       | Completed |

---

## Recommended Action Plan

### Completed Items

1. `18_INCIDENT_TRIAGE_RUNBOOK.md` gained explicit `P0/P1/P2/P3` severity handling.
2. `20_MANUAL_DEPLOY_DECISION_CRITERIA.md` now bridges emergency manual deploy and unknown-root-cause hard-stop behavior.
3. `32_TEST_EXECUTION_GATE.md` now includes a canonical coverage command and a relative baseline rule.
4. `03_TASK_CONTRACT_TEMPLATE.md` now uses the fenced block as the canonical template.
5. `01_START_HERE.md` now includes the incident entry decision rule.
6. `31_PRODUCTION_READINESS_GATE.md`, `15_APP_BOUNDARY_AND_WORKFLOW_EXTRACT.md`, `02_AUTONOMOUS_DEV_PROTOCOL.md`, `04_DEFINITION_OF_DONE.md`, `17_AUTH_REQUEST_PLAYBOOK.md`, and `ROLE_HANDOFF_OWNERSHIP.md` now reflect the approved follow-up fixes.
7. `08_ESCALATION_AND_HANDOFF.md` is now the canonical execution-record source, and docs 14-32 plus `05_PR_TASK_CONTRACT_TEMPLATE.md` now reference it.
8. `30_ROOT_TROUBLESHOOTING_TOP_ISSUES.md` now defines a mitigation tiebreaker when multiple options appear equally small.
9. `16_TEST_AND_DEPLOY_QUICK_REF.md` now acts as a launch shortcut that points back to `32_TEST_EXECUTION_GATE.md` for gate logic.
10. `19_RECOVERY_PRIORITY_RUNBOOK.md` now includes `P3` in the Severity Guide.
11. `01_START_HERE.md` now points to `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` in the Reference Map.
12. `02_AUTONOMOUS_DEV_PROTOCOL.md` now routes task records to the canonical Execution Record format in `08_ESCALATION_AND_HANDOFF.md`.
13. `04_DEFINITION_OF_DONE.md` now includes direct document references for mandatory and delivery gates.
14. `06_TOOLING_AND_SERVICES.md` now lists the project validation scripts used across the runbooks.
15. `03_TASK_CONTRACT_TEMPLATE.md` now closes with a single canonical handoff-format rule.
16. `09_DOCSET_SYNC_RULES.md` now includes a concrete `diff` verification command in the Done Check.
17. `28_MONITORING_ALERT_RESPONSE_QUICK_REF.md` now routes cloud-uncertain alert handling to `24_CROSS_CLOUD_INCIDENT_MATRIX.md`.
18. `07_AUTONOMOUS_WORKFLOW_CHECKLIST.md` now includes per-phase failure pointers.
19. `05_PR_TASK_CONTRACT_TEMPLATE.md` now keeps only the fenced template and removes duplicate blank sections.
20. `10_WEEKLY_REVIEW_TEMPLATE.md` through `13_ANNUAL_REVIEW_TEMPLATE.md` now keep only the fenced template plus example, without duplicate blank sections.
21. `04_DEFINITION_OF_DONE.md` now includes references for the remaining delivery gates.

### Remaining next actions

No remaining actions are open from the current proposal set.

---

## Sync Note

Per `09_DOCSET_SYNC_RULES.md`, this document must remain synchronized with `docs_agent_ja/33_DOCSET_IMPROVEMENT_PROPOSALS.md`.
