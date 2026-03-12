import { chromium } from "playwright";

const defaultTargets = [
  {
    name: "aws-sns-surface",
    url: "https://www.aws.ashnova.jp/",
    expectedRoutePath: "/",
    expectedEntryHref: "/status#sns-request-response-surface",
    expectedSurfaceSelector: '[data-sns-surface="request-response"]',
    expectedPostingCtaHref: "/status#sns-posting-cta-guidance",
    expectedPostingTargetSelector: '[data-sns-posting-target="true"]'
  },
  {
    name: "gcp-sns-surface",
    url: "https://www.gcp.ashnova.jp/",
    expectedRoutePath: "/",
    expectedEntryHref: "/status#sns-request-response-surface",
    expectedSurfaceSelector: '[data-sns-surface="request-response"]',
    expectedPostingCtaHref: "/status#sns-posting-cta-guidance",
    expectedPostingTargetSelector: '[data-sns-posting-target="true"]'
  },
  {
    name: "gcp-preview-sns-surface",
    url: "https://preview.gcp.ashnova.jp/",
    expectedRoutePath: "/",
    expectedEntryHref: "/status#sns-request-response-surface",
    expectedSurfaceSelector: '[data-sns-surface="request-response"]',
    expectedPostingCtaHref: "/status#sns-posting-cta-guidance",
    expectedPostingTargetSelector: '[data-sns-posting-target="true"]'
  }
];

const targets = process.env.SNS_SURFACE_TARGETS_JSON
  ? JSON.parse(process.env.SNS_SURFACE_TARGETS_JSON)
  : defaultTargets;

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function renderMarkdownTable(rows) {
  const lines = [
    "SNS surface reachability verification",
    "",
    "| Target | Surface Mount | Entry Link | CTA Reachability | Result |",
    "| --- | --- | --- | --- | --- |"
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.target} | ${row.surfaceMount} | ${row.entryLink} | ${row.ctaReachability} | ${row.result} |`
    );
  }

  return lines.join("\n");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const rows = [];
let currentTargetName = "setup";
let currentStepStatus = {
  surfaceMount: "unknown",
  entryLink: "unknown",
  ctaReachability: "unknown"
};

try {
  for (const target of targets) {
    currentTargetName = target.name;
    currentStepStatus = {
      surfaceMount: "unknown",
      entryLink: "unknown",
      ctaReachability: "unknown"
    };

    await page.goto(target.url, { waitUntil: "networkidle" });
    await page.locator(".page-shell").waitFor({ state: "visible" });

    const routePath = await page.locator(".page-shell").getAttribute("data-route-path");
    assertCondition(routePath?.trim() === target.expectedRoutePath, `${target.name}: route path mismatch`);

    const entryLink = page.locator(`a[data-link="internal"][href="${target.expectedEntryHref}"]`).first();
    await entryLink.waitFor({ state: "visible" });
    const entryLinkHref = await entryLink.getAttribute("href");
    assertCondition(entryLinkHref === target.expectedEntryHref, `${target.name}: entry link href mismatch`);
    currentStepStatus.entryLink = "passed";

    await entryLink.click();
    const surface = page.locator(target.expectedSurfaceSelector).first();
    await surface.waitFor({ state: "visible" });
    const surfaceRoutePath = await page.locator(".page-shell").getAttribute("data-route-path");
    assertCondition(surfaceRoutePath?.trim() === "/status", `${target.name}: surface did not mount on /status`);
    currentStepStatus.surfaceMount = "passed";

    const ctaLink = page.locator(`a[data-sns-posting-cta="true"][href="${target.expectedPostingCtaHref}"]`).first();
    await ctaLink.waitFor({ state: "visible" });

    await ctaLink.click();
    const postingTarget = page.locator(target.expectedPostingTargetSelector).first();
    await postingTarget.waitFor({ state: "visible" });
    const ctaRoutePath = await page.locator(".page-shell").getAttribute("data-route-path");
    assertCondition(ctaRoutePath?.trim() === "/status", `${target.name}: CTA did not stay on /status`);
    currentStepStatus.ctaReachability = "passed";

    rows.push({
      target: target.name,
      surfaceMount: currentStepStatus.surfaceMount,
      entryLink: currentStepStatus.entryLink,
      ctaReachability: currentStepStatus.ctaReachability,
      result: "passed"
    });
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  rows.push({
    target: currentTargetName,
    surfaceMount: currentStepStatus.surfaceMount,
    entryLink: currentStepStatus.entryLink,
    ctaReachability: currentStepStatus.ctaReachability,
    result: message.replace(/\|/g, "/")
  });
  process.exitCode = 1;
} finally {
  await browser.close();
}

console.log(renderMarkdownTable(rows));