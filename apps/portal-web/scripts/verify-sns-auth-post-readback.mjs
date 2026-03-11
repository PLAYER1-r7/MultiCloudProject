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
  const [target] = targets;

  if (!target) {
    throw new Error("SNS auth flow targets must include at least one entry");
  }

  await page.goto(target.url, { waitUntil: "networkidle" });
  await page.locator(`a[data-link="internal"][href="${target.expectedEntryHref}"]`).first().click();
  await page.locator(target.expectedSurfaceSelector).first().waitFor({ state: "visible" });

  await recordStep(rows, "signed-out blocked", async () => {
    const readbackCountBefore = await page.locator('[data-sns-readback-item="true"]').count();

    await page.locator('[data-sns-composer-input="true"]').fill("guest attempt should remain blocked");
    await page.locator('[data-sns-submit-button="true"]').click();

    await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="blocked"]').waitFor({ state: "visible" });
    const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
    assertCondition(
      feedback?.includes("Signed-out users remain blocked") ?? false,
      "blocked flow feedback was not visible"
    );

    const readbackCountAfter = await page.locator('[data-sns-readback-item="true"]').count();
    assertCondition(readbackCountAfter === readbackCountBefore, "blocked flow unexpectedly changed readback state");
  });

  let successfulBody = "";

  await recordStep(rows, "signed-in post success", async () => {
    successfulBody = `member success body ${Date.now()}`;

    await page.locator('[data-sns-auth-select="true"]').selectOption("member");
    await page.locator('[data-sns-failure-toggle="true"]').setChecked(false);
    await page.locator('[data-sns-composer-input="true"]').fill(successfulBody);
    await page.locator('[data-sns-submit-button="true"]').click();

    await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="success"]').waitFor({ state: "visible" });
    const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
    assertCondition(
      feedback?.includes("Signed-in submit path completed") ?? false,
      "success feedback was not visible"
    );
  });

  await recordStep(rows, "failure visibility", async () => {
    await page.locator('[data-sns-auth-select="true"]').selectOption("operator");
    await page.locator('[data-sns-failure-toggle="true"]').setChecked(true);
    await page.locator('[data-sns-composer-input="true"]').fill("operator failure body should stay visible");
    await page.locator('[data-sns-submit-button="true"]').click();

    await page.locator('[data-sns-flow-result="true"][data-sns-flow-state="failure"]').waitFor({ state: "visible" });
    const feedback = await page.locator('[data-sns-feedback="true"]').textContent();
    assertCondition(
      feedback?.includes("Simulated write failure remained visible") ?? false,
      "failure visibility feedback was not visible"
    );
  });

  await recordStep(rows, "readback consistency", async () => {
    const latestBody = await page.locator('[data-sns-readback-item="true"] [data-sns-readback-body="true"]').first().textContent();
    const latestAuthor = await page.locator('[data-sns-readback-item="true"] [data-sns-readback-author="true"]').first().textContent();

    assertCondition(latestBody?.trim() === successfulBody, "latest readback body did not match the successful submit");
    assertCondition(latestAuthor?.trim() === "member", "latest readback author did not match the successful submit");
  });
} catch {
  process.exitCode = 1;
} finally {
  await browser.close();
}

console.log(renderMarkdownTable(rows));