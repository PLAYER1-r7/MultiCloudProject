import "./styles.css";

type RouteDefinition = {
  title: string;
  eyebrow: string;
  summary: string;
  bullets: string[];
  checklist: string[];
  note: string;
};

const routeDefinitions: Record<string, RouteDefinition> = {
  "/": {
    title: "Public Portal Seed",
    eyebrow: "Static-first foundation",
    summary:
      "This first page shell establishes the public-facing entry point, release framing, and implementation tone for the AWS-first portal.",
    bullets: [
      "Expose a small public route surface that fits the MVP plan.",
      "Keep the first release compatible with static delivery on S3 and CloudFront.",
      "Prepare the app structure so CI, staging deploy, and smoke checks can attach without a rewrite."
    ],
    checklist: [
      "Top page shell exists.",
      "Primary navigation is visible.",
      "Content blocks are stable enough for smoke verification."
    ],
    note: "Use this page as the first smoke-check target after every build and staging deploy."
  },
  "/platform": {
    title: "Platform Outline",
    eyebrow: "Delivery architecture",
    summary:
      "This route frames the AWS delivery path, clarifies the static asset model, and provides a home for later infrastructure-facing explanations.",
    bullets: [
      "Describe the S3 and CloudFront delivery baseline.",
      "Show where HTTPS and security headers enter the path.",
      "Keep language compatible with future Azure and GCP expansion."
    ],
    checklist: [
      "Route renders through the same build artifact as the top page.",
      "Navigation between public routes works.",
      "The page is safe to link from deploy verification."
    ],
    note: "Issue 17 can later replace this shell with implementation-backed delivery details."
  },
  "/delivery": {
    title: "Release Path",
    eyebrow: "Staging-first workflow",
    summary:
      "This route reserves a place for explaining how validation, staging deploy, and production approval will fit together once workflow automation is in place.",
    bullets: [
      "Keep the release path understandable from the UI shell alone.",
      "Align wording with the CI and staging deploy issue set.",
      "Provide a stable route for smoke checks and post-deploy confirmation."
    ],
    checklist: [
      "Route is reachable via direct navigation.",
      "Page shell survives refresh once CDN routing is added.",
      "Copy is short enough to remain maintainable during early implementation."
    ],
    note: "Issue 18 will later connect this route to actual workflow outputs and deploy status references."
  },
  "/operations": {
    title: "Operations View",
    eyebrow: "Monitoring and rollback hooks",
    summary:
      "This route gives the initial frontend a place to connect later monitoring, rollback, and operational readiness work without redesigning the navigation model.",
    bullets: [
      "Preserve a home for monitoring and rollback documentation links.",
      "Keep route naming vendor-neutral for later cloud expansion.",
      "Make post-deploy and recovery checks easy to anchor in the UI."
    ],
    checklist: [
      "Operations route is part of the initial route set.",
      "The route can be used as a smoke-check target.",
      "Future monitoring and rollback work can extend this page without moving paths."
    ],
    note: "This route exists now so later monitoring and rollback work can plug into a stable page structure."
  }
};

const routeOrder = ["/", "/platform", "/delivery", "/operations"] as const;

const applicationRoot = document.querySelector<HTMLDivElement>("#app");

if (!applicationRoot) {
  throw new Error("Application root was not found.");
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname || "/";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderList(items: string[], className: string): string {
  return items
    .map((item) => `<li class="${className}">${escapeHtml(item)}</li>`)
    .join("");
}

function renderNavigation(currentPath: string): string {
  return routeOrder
    .map((path) => {
      const route = routeDefinitions[path];
      const currentClass = currentPath === path ? "nav-link current" : "nav-link";

      return `<a class="${currentClass}" href="${path}" data-link="internal">${escapeHtml(route.title)}</a>`;
    })
    .join("");
}

function renderRoute(): void {
  const currentPath = normalizePath(window.location.pathname);
  const route = routeDefinitions[currentPath] ?? routeDefinitions["/"];

  document.title = `${route.title} | MultiCloudProject Portal`;

  applicationRoot.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>
      <header class="hero">
        <p class="eyebrow">${escapeHtml(route.eyebrow)}</p>
        <div class="hero-topline">
          <span class="badge">AWS first</span>
          <span class="badge">Static delivery</span>
          <span class="badge">TypeScript scaffold</span>
        </div>
        <h1>${escapeHtml(route.title)}</h1>
        <p class="hero-summary">${escapeHtml(route.summary)}</p>
      </header>

      <nav class="main-nav" aria-label="Portal routes">
        ${renderNavigation(currentPath)}
      </nav>

      <main class="content-grid">
        <section class="panel panel-primary">
          <h2>Implementation direction</h2>
          <ul class="panel-list">
            ${renderList(route.bullets, "panel-item")}
          </ul>
        </section>

        <section class="panel">
          <h2>Smoke-check baseline</h2>
          <ul class="check-list">
            ${renderList(route.checklist, "check-item")}
          </ul>
        </section>

        <section class="panel panel-wide">
          <h2>Operational note</h2>
          <p class="panel-note">${escapeHtml(route.note)}</p>
          <p class="panel-note subdued">The app uses a tiny route table so the first release can stay buildable as static assets without adding framework runtime complexity.</p>
        </section>
      </main>
    </div>
  `;
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const link = target.closest<HTMLAnchorElement>('a[data-link="internal"]');

  if (!link) {
    return;
  }

  const href = link.getAttribute("href");

  if (!href) {
    return;
  }

  event.preventDefault();
  window.history.pushState({}, "", href);
  renderRoute();
});

window.addEventListener("popstate", () => {
  renderRoute();
});

renderRoute();