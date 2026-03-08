import "./styles.css";

type RouteSection = {
  title: string;
  body: string;
  points: string[];
};

type RouteDefinition = {
  title: string;
  eyebrow: string;
  summary: string;
  audience: string;
  outcome: string;
  bullets: string[];
  checklist: string[];
  sections: RouteSection[];
  note: string;
};

const routeDefinitions: Record<string, RouteDefinition> = {
  "/": {
    title: "MultiCloudProject Portal",
    eyebrow: "Public entry experience",
    summary:
      "AWS から小さく始める公開ポータルとして、プロジェクト概要、配信方針、運用導線を一つの静的フロントエンドでわかりやすく届ける。",
    audience: "初回リリースでは、公開ユーザー、関係者、運用担当が同じ静的ポータルを起点に情報へ到達できることを重視する。",
    outcome: "トップページ自体が smoke check の基準点となり、staging deploy 後に最初に確認する public route になる。",
    bullets: [
      "公開ファーストのポータルとして、複雑な認証導線なしに主要情報へ到達できること。",
      "S3 と CloudFront へそのまま配備できる静的 build を維持すること。",
      "後続の CI、staging deploy、監視導線がこのページを基点に接続できること。"
    ],
    checklist: [
      "トップページが表示できる。",
      "主要ナビゲーションが見える。",
      "hero、導入説明、運用導線の各ブロックが崩れず表示される。"
    ],
    sections: [
      {
        title: "MVP で見せるもの",
        body: "初回リリースでは、ポータルの目的、AWS 上の配信前提、staging-first の運用導線を短く明快に示す。",
        points: [
          "プロジェクトの概要と期待価値",
          "配信アーキテクチャの入口説明",
          "リリースと運用の導線"
        ]
      },
      {
        title: "このページの役割",
        body: "単なる装飾用 shell ではなく、build 成功後にまず開くべき public route として扱う。",
        points: [
          "smoke test の基準ページ",
          "staging 配備後の確認対象",
          "今後の page 拡張の基点"
        ]
      }
    ],
    note: "staging deploy 後は、このページ、主要ナビゲーション、静的 asset の配信状態を最初に確認する。"
  },
  "/platform": {
    title: "Platform Outline",
    eyebrow: "AWS static delivery baseline",
    summary:
      "Route 53、CloudFront、S3 を軸にした AWS 静的配信の前提を説明し、Issue 17 の IaC 実装へ自然につなぐ。",
    audience: "このページは、構成判断を確認したい開発者と運用担当に向けた delivery baseline の要約面として使う。",
    outcome: "frontend の route shell から infrastructure 実装方針へ飛べる状態を作り、CloudFront 配信前提の UI 文脈を先に固定する。",
    bullets: [
      "S3 を静的 asset の配信元とする。",
      "CloudFront で HTTPS と edge 配信を担う。",
      "将来 Azure と GCP に広げても route 命名は維持できるようにする。"
    ],
    checklist: [
      "配信経路の説明が見える。",
      "HTTPS 前提の説明がある。",
      "platform route が直接表示できる。"
    ],
    sections: [
      {
        title: "初期 AWS 経路",
        body: "first release では User から CloudFront を経由し、S3 の静的 asset を配信する流れを基本とする。",
        points: [
          "Route 53 は custom domain 利用時に追加",
          "ACM は HTTPS の証明書管理に使用",
          "backend runtime は baseline に含めない"
        ]
      },
      {
        title: "実装への接続",
        body: "Issue 17 ではこの route に対応する OpenTofu 雛形を staging から実装し、後で出力値と deploy 先を接続する。",
        points: [
          "infra/modules で reusable module 化",
          "infra/environments/staging で最初の wiring",
          "production は staging の後に追従"
        ]
      }
    ],
    note: "Issue 17 の IaC 雛形は、この route の説明を実インフラ構成へ落とし込む最初の足場になる。"
  },
  "/delivery": {
    title: "Release Path",
    eyebrow: "Build to staging route",
    summary:
      "build、validation、artifact、staging deploy の流れを視覚的に固定し、Issue 18 の workflow 実装とずれない導線を先に用意する。",
    audience: "このページは、変更がどの順序で build され staging へ届くかを確認したい開発者向けの release outline として使う。",
    outcome: "最小 workflow 実装後に、build artifact と staging deploy の結果説明を結び付けやすい route になる。",
    bullets: [
      "validation と deploy の責務を分離する。",
      "staging deploy を production より先に固定する。",
      "artifact の生成と受け渡しを workflow の中心に置く。"
    ],
    checklist: [
      "release path の説明が見える。",
      "staging 優先の流れがわかる。",
      "delivery route が smoke check の確認導線として使える。"
    ],
    sections: [
      {
        title: "最小 workflow の分離",
        body: "最初に追加するのは build workflow であり、staging deploy はその次の段階で接続する。",
        points: [
          "push と pull request で build を検証",
          "artifact 化して次段の deploy に受け渡す",
          "production 承認は別 workflow に分ける"
        ]
      },
      {
        title: "確認の流れ",
        body: "frontend build 成功後に staging 配備へ進み、トップページと主要 route を smoke check する前提を維持する。",
        points: [
          "build 成功",
          "artifact 出力",
          "staging 配備後の public route 確認"
        ]
      }
    ],
    note: "Issue 18 の最初の workflow は build と artifact 化だけを担い、staging deploy への接続余地を残す。"
  },
  "/operations": {
    title: "Operations View",
    eyebrow: "Monitoring and rollback hooks",
    summary:
      "監視、rollback、運用判断の導線を置くための route として、Issue 12 と 14 の成果を後で UI に接続しやすい形を保つ。",
    audience: "運用担当と開発者が、monitoring と rollback の確認導線をどこに置くかを共有するための route である。",
    outcome: "今は説明中心でも、後で staging health や rollback checklist を差し込める route として生かせる。",
    bullets: [
      "監視方針への導線を置く。",
      "rollback 判断の入口を固定する。",
      "クラウド固有名に寄りすぎない route を維持する。"
    ],
    checklist: [
      "operations route が表示できる。",
      "将来の monitoring 情報を差し込める余地がある。",
      "rollback 導線を増やしても route を変えずに済む。"
    ],
    sections: [
      {
        title: "運用の最初の責務",
        body: "first release の operations は、サイト到達性、deploy の成否、復旧判断を短い確認フローにまとめることを重視する。",
        points: [
          "トップページの到達性確認",
          "主要 route の表示確認",
          "rollback 判断フローの明文化"
        ]
      },
      {
        title: "後続の拡張余地",
        body: "後で health status、監視リンク、rollback checklist をここへ追加できるように UI の位置だけ先に確保する。",
        points: [
          "monitoring summary",
          "deploy verification links",
          "rollback readiness notes"
        ]
      }
    ],
    note: "Issue 12 と 14 の具体実装が入ってきたら、この route に運用情報を集約する。"
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

function renderSections(sections: RouteSection[]): string {
  return sections
    .map(
      (section) => `
        <article class="story-card">
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.body)}</p>
          <ul class="story-list">
            ${renderList(section.points, "story-item")}
          </ul>
        </article>
      `
    )
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
        <div class="hero-meta">
          <div class="meta-block">
            <span class="meta-label">Audience</span>
            <p>${escapeHtml(route.audience)}</p>
          </div>
          <div class="meta-block">
            <span class="meta-label">Expected outcome</span>
            <p>${escapeHtml(route.outcome)}</p>
          </div>
        </div>
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
          <h2>Route story</h2>
          <div class="story-grid">
            ${renderSections(route.sections)}
          </div>
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