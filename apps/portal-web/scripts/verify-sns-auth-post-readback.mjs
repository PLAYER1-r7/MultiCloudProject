import { chromium } from "playwright";

const defaultTargets = [
  {
    name: "local-sns-auth-flow",
    url: "http://127.0.0.1:4174/",
    expectedEntryHref: "/status#sns-request-response-surface",
    expectedSurfaceSelector: '[data-sns-surface="request-response"]'
  }
];

const targets = process.env.SNS_AUTH_FLOW_TARGETS_JSON
  ? JSON.parse(process.env.SNS_AUTH_FLOW_TARGETS_JSON)
  : defaultTargets;

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function renderMarkdownTable(rows) {
  const lines = [
    "SNS auth-post-readback verification",
    "",
    "| Flow State | Result | Note |",
    "| --- | --- | --- |"
  ];

  for (const row of rows) {
    lines.push(`| ${row.flowState} | ${row.result} | ${row.note} |`);
  }

  return lines.join("\n");
}

async function recordStep(rows, flowState, step) {
  try {
    await step();
    rows.push({ flowState, result: "passed", note: "expected flow preserved" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    rows.push({ flowState, result: "failed", note: message.replace(/\|/g, "/") });
    throw error;
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const rows = [];

try {
  assertCondition(Array.isArray(targets) && targets.length > 0, "SNS auth flow targets must include at least one entry");

  for (const target of targets) {
    await page.goto(target.url, { waitUntil: "networkidle" });
    await page.locator(`a[data-link="internal"][href="${target.expectedEntryHref}"]`).first().click();
    await page.locator(target.expectedSurfaceSelector).first().waitFor({ state: "visible" });

    await recordStep(rows, `${target.name}: signed-out blocked`, async () => {
      const readbackCountBefore = await page.locator('[data-sns-readback-item="true"]').count();

      await page.locator('[data-sns-composer-input="true"]').fill("guest attempt should remain blocked");
      await page.locator('[data-sns-submit-button="true"]').click();

      await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="blocked"]').waitFor({ state: "visible" });
      const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
      const feedbackCode = await page.locator('[data-sns-feedback-code="true"]').textContent();
      const completionSignal = await page.locator('[data-sns-completion-signal="true"]').textContent();
      assertCondition(
        feedback?.includes("Signed-out users remain blocked") ?? false,
        "blocked flow feedback was not visible"
      );
      assertCondition(feedbackCode?.includes("SNS_POST_FORBIDDEN") ?? false, "blocked flow error code was not visible");
      assertCondition(completionSignal?.trim() === "wired-awaiting-confirmation", "blocked flow unexpectedly reported completion");

      const readbackCountAfter = await page.locator('[data-sns-readback-item="true"]').count();
      assertCondition(readbackCountAfter === readbackCountBefore, "blocked flow unexpectedly changed readback state");
    });

    let successfulBody = "";

    await recordStep(rows, `${target.name}: signed-in post success`, async () => {
      successfulBody = `member success body ${Date.now()}`;

      await page.locator('[data-sns-auth-select="true"]').selectOption("member");
      await page.locator('[data-sns-failure-toggle="true"]').setChecked(false);
      await page.locator('[data-sns-composer-input="true"]').fill(successfulBody);
      await page.locator('[data-sns-submit-button="true"]').click();

      await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="success"]').waitFor({ state: "visible" });
      const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
      const completionSignal = await page.locator('[data-sns-completion-signal="true"]').textContent();
      const readbackState = await page.locator('[data-sns-readback-state="true"]').textContent();
      assertCondition(
        feedback?.includes("Signed-in submit path completed") ?? false,
        "success feedback was not visible"
      );
      assertCondition(completionSignal?.trim() === "contract-confirmed", "success flow did not reach contract-confirmed completion");
      assertCondition(readbackState?.trim() === "Readback confirmed", "success flow did not expose confirmed readback state");
    });

    await recordStep(rows, `${target.name}: failure visibility`, async () => {
      await page.locator('[data-sns-auth-select="true"]').selectOption("operator");
      await page.locator('[data-sns-failure-toggle="true"]').setChecked(true);
      await page.locator('[data-sns-composer-input="true"]').fill("operator failure body should stay visible");
      await page.locator('[data-sns-submit-button="true"]').click();

      await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="failure"]').waitFor({ state: "visible" });
      const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
      const feedbackCode = await page.locator('[data-sns-feedback-code="true"]').textContent();
      const retryable = await page.locator('[data-sns-feedback-retryable="true"]').textContent();
      assertCondition(
        feedback?.includes("Simulated write failure remained visible") ?? false,
        "failure visibility feedback was not visible"
      );
      assertCondition(feedbackCode?.includes("SNS_POST_WRITE_FAILED") ?? false, "failure flow error code was not visible");
      assertCondition(retryable?.includes("yes") ?? false, "failure flow retryable marker was not visible");
    });

    await recordStep(rows, `${target.name}: readback consistency`, async () => {
      const latestBody = await page.locator('[data-sns-readback-item="true"] [data-sns-readback-body="true"]').first().textContent();
      const latestAuthor = await page.locator('[data-sns-readback-item="true"] [data-sns-readback-author="true"]').first().textContent();

      assertCondition(latestBody?.trim() === successfulBody, "latest readback body did not match the successful submit");
      assertCondition(latestAuthor?.trim() === "member", "latest readback author did not match the successful submit");
    });
  }
} catch {
  process.exitCode = 1;
} finally {
  await browser.close();
}

console.log(renderMarkdownTable(rows));