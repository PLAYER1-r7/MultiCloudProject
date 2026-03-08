# Annual Review Template

## Reuse Rules

- Copy the fenced template below for year-end review.
- Keep major wins and failures limited to the few items that changed future direction.
- Use incident learnings only for events with durable process or architecture impact.

## Copy-Ready Template

```text
Annual Review

Executive Summary
- Year:
- Major wins:
- Major failures:
- Main theme for next year:

Annual KPIs
- Delivery:
- Quality:
- Reliability:
- Security:

Major Incident Learnings
1. Incident / impact / permanent fix
2. Incident / impact / permanent fix
3. Incident / impact / permanent fix

Next Year Plan
- Strategic priorities:
- Investment priorities:
- Process upgrades:
```

## Short Example

```text
Annual Review

Executive Summary
- Year: 2026
- Major wins: exam-solver and sns operating docs became structured and reusable
- Major failures: some bilingual drift required repeated cleanup before release reviews
- Main theme for next year: reduce rework across exam-solver and sns through stricter template discipline

Annual KPIs
- Delivery: reusable templates across exam-solver and sns contracts and reviews
- Quality: shared record format standardized across both app tracks
- Reliability: clearer incident and release flow for exam-solver and sns
- Security: production checks clarified in guardrails and go/no-go docs for both apps

Major Incident Learnings
1. exam-solver callback drift / staging release risk / keep exam-solver-reviewer and exam-solver-approval-owner explicit in deploy-exam-solver-aws.yml handoffs
2. sns /sns/ base-path regression / frontend route impact / keep sns-reviewer and sns-approval-owner explicit in deploy-sns-aws.yml handoffs
3. bilingual handoff ambiguity / delayed reviewer action / preserve identical reviewer and approval owner naming in both languages

Next Year Plan
- Strategic priorities: keep reviewer and approval owner naming fixed across exam-solver and sns examples
- Investment priorities: improve reviewer packets around deploy-exam-solver-gcp.yml and deploy-sns-azure.yml
- Process upgrades: require named approval-owner evidence before release handoff is considered ready
```

Copy the fenced block above to start a new review entry.
