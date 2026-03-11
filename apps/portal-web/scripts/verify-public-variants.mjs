import { chromium } from "playwright";

const defaultTargets = [
  {
    name: "aws-root",
    url: "https://www.aws.ashnova.jp/",
    expectedVariant: "AWS portal variant",
    expectedHost: "www.aws.ashnova.jp",
    expectedTitleSegment: "AWS host view"
  },
  {
    name: "gcp-root",
    url: "https://www.gcp.ashnova.jp/",
    expectedVariant: "GCP portal variant",
    expectedHost: "www.gcp.ashnova.jp",
    expectedTitleSegment: "GCP host view"
  },
  {
    name: "gcp-preview-root",
    url: "https://preview.gcp.ashnova.jp/",
    expectedVariant: "GCP portal variant",
    expectedHost: "preview.gcp.ashnova.jp",
    expectedTitleSegment: "GCP host view"
  },
  {
    name: "aws-status",
    url: "https://www.aws.ashnova.jp/status",
    expectedVariant: "AWS portal variant",
    expectedHost: "www.aws.ashnova.jp",
    expectedTitleSegment: "AWS host view"
  },
  {
    name: "gcp-status",
    url: "https://www.gcp.ashnova.jp/status",
    expectedVariant: "GCP portal variant",
    expectedHost: "www.gcp.ashnova.jp",
    expectedTitleSegment: "GCP host view"
  },
  {
    name: "gcp-preview-status",
    url: "https://preview.gcp.ashnova.jp/status",
    expectedVariant: "GCP portal variant",
    expectedHost: "preview.gcp.ashnova.jp",
    expectedTitleSegment: "GCP host view"
  }
];

const targets = process.env.PORTAL_VARIANT_TARGETS_JSON
  ? JSON.parse(process.env.PORTAL_VARIANT_TARGETS_JSON)
  : defaultTargets;

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function renderMarkdownTable(rows) {
  const lines = [
    "Runtime variant verification",
    "",
    "| Target | Variant | Host | Title | Description | Route |",
    "| --- | --- | --- | --- | --- | --- |"
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.target} | ${row.variant} | ${row.host} | ${row.title} | ${row.description} | ${row.routePath} |`
    );
  }

  return lines.join("\n");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const rows = [];

try {
  for (const target of targets) {
    await page.goto(target.url, { waitUntil: "networkidle" });
    await page.locator('[data-portal-field="active-variant"]').waitFor({ state: "visible" });

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const variantLabel = await page.locator('[data-portal-field="active-variant"]').textContent();
    const hostLabel = await page.locator('[data-portal-field="active-host"]').textContent();
    const routePath = await page.locator(".page-shell").getAttribute("data-route-path");
    const routeTitle = await page.locator('[data-portal-field="route-title"]').textContent();

    assertCondition(title?.includes(target.expectedTitleSegment), `${target.name}: title did not include ${target.expectedTitleSegment}`);
    assertCondition(description?.includes(target.expectedHost), `${target.name}: description did not include ${target.expectedHost}`);
    assertCondition(variantLabel?.trim() === target.expectedVariant, `${target.name}: variant label mismatch`);
    assertCondition(hostLabel?.trim() === target.expectedHost, `${target.name}: host label mismatch`);
    assertCondition(Boolean(routePath), `${target.name}: route path attribute missing`);
    assertCondition(Boolean(routeTitle?.trim()), `${target.name}: route title missing`);

    rows.push({
      target: target.name,
      variant: variantLabel.trim(),
      host: hostLabel.trim(),
      title: title.trim(),
      description: description.trim(),
      routePath: routePath.trim()
    });
  }
} finally {
  await browser.close();
}

console.log(renderMarkdownTable(rows));