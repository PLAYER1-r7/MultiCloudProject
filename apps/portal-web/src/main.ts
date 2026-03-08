import "./styles.css";

type ActionLink = {
  label: string;
  href: string;
  hint: string;
  emphasis?: "primary" | "secondary";
};

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
  actions: ActionLink[];
  note: string;
};

type NavGroup = {
  title: string;
  paths: string[];
};

const routeDefinitions: Record<string, RouteDefinition> = {
  "/": {
    title: "MultiCloudProject Portal",
    eyebrow: "Public entry experience",
    summary:
      "AWS から小さく始める公開ポータルとして、プロジェクトの目的、想定ユーザー、配信と運用の導線を静的フロントエンドで明快に届ける。",
    audience:
      "主対象は public に到達する初回訪問者であり、同時に運用担当と技術関係者が staging-first の delivery baseline を共有できることを重視する。",
    outcome:
      "トップページ自体が smoke check の第一確認点となり、staging deploy 後に最初に開く public route として機能する。",
    bullets: [
      "公開ファーストの小さな portal として、認証なしで主要情報へ到達できること。",
      "S3 と CloudFront にそのまま配備できる static build を維持すること。",
      "CI、staging deploy、monitoring、rollback の導線が後から接続しやすい構成にすること。"
    ],
    checklist: [
      "トップページが安定表示できる。",
      "主要ナビゲーションから他の公開 route へ遷移できる。",
      "hero、導入説明、次アクション導線が崩れず見える。"
    ],
    sections: [
      {
        title: "この portal が担う役割",
        body:
          "初回リリースでは、プロダクトの入口、MVP の説明、公開配信の安定性を一つの小さな surface で検証する。",
        points: ["what the portal is", "who it is for", "what the next action is"]
      },
      {
        title: "最初に確認すべきこと",
        body:
          "build 成功後はトップページ、主要 nav、主要 static asset が正常に表示されることを確認する。",
        points: ["top page reachability", "navigation visibility", "static asset delivery"]
      }
    ],
    actions: [
      {
        label: "Overview を見る",
        href: "/overview",
        hint: "想定ユーザー、利用シーン、提供価値を確認する。",
        emphasis: "primary"
      },
      {
        label: "Guidance を見る",
        href: "/guidance",
        hint: "次アクションと公開導線のまとめを見る。"
      },
      {
        label: "Platform Outline へ",
        href: "/platform",
        hint: "AWS 静的配信の delivery baseline を確認する。"
      }
    ],
    note:
      "staging deploy 後は、このページ、主要ナビゲーション、主要 route の到達性を最優先で確認する。"
  },
  "/overview": {
    title: "Overview",
    eyebrow: "Product and MVP context",
    summary:
      "portal の目的、対象ユーザー、コア利用シーン、MVP の境界を短く共有し、公開エントリとしての価値を先に固定する。",
    audience:
      "このページは、訪問者と関係者の両方に対して first release の狙いと範囲を同じ言葉で伝えるために使う。",
    outcome:
      "Issue 1 と Issue 2 で整理した product definition と MVP scope を UI 上の説明へ接続できる。",
    bullets: [
      "初回リリースは public-first である。",
      "MVP は小さなページ集合と明快な導線に絞る。",
      "backend persistence や user-specific workflow は初回には含めない。"
    ],
    checklist: [
      "target users が読み取れる。",
      "MVP の境界が読み取れる。",
      "この portal が何をしないかも説明されている。"
    ],
    sections: [
      {
        title: "想定ユーザー",
        body:
          "primary user は公開 URL から入る visitor、secondary user は release と content freshness を担う internal operator である。",
        points: ["public visitor", "internal operator", "future platform stakeholder"]
      },
      {
        title: "MVP の成立条件",
        body:
          "ユーザーが portal の目的を理解し、主要情報へ辿り着き、意図した next action を取れることが最小の成功条件になる。",
        points: ["stable public URL", "small page set", "clear next action"]
      }
    ],
    actions: [
      {
        label: "Home に戻る",
        href: "/",
        hint: "トップページの public entry view に戻る。",
        emphasis: "primary"
      },
      {
        label: "Guidance へ",
        href: "/guidance",
        hint: "visitor が次に取る行動の整理を見る。"
      }
    ],
    note:
      "このページの説明は product definition と MVP scope の要約面として保ち、後で文章量を増やしすぎない。"
  },
  "/guidance": {
    title: "Guidance",
    eyebrow: "Next action and support path",
    summary:
      "visitor が portal 上で迷わないように、次に取るべき action、参照先、運用上の案内を短く整理する。",
    audience:
      "このページは visitor の next step と operator の support path を橋渡しする最小の guidance page として使う。",
    outcome:
      "Contact or guidance page の候補を route として固定し、MVP の page set を具体化できる。",
    bullets: [
      "visitor に次の action を明示する。",
      "operator が更新・案内を追加しやすい page にする。",
      "inquiry backend を持たない前提でも guidance と notice を載せられるようにする。"
    ],
    checklist: [
      "next step が明示されている。",
      "support or operational notice の置き場がある。",
      "public route として単独表示できる。"
    ],
    sections: [
      {
        title: "初回 release の guidance",
        body:
          "first release では complex inquiry form を持たず、guidance text と link を中心に next action を示す。",
        points: ["learn more", "operational notice", "release-friendly content updates"]
      },
      {
        title: "後続拡張の余地",
        body:
          "later phase で contact flow や richer support path が必要になれば、この route を起点に拡張する。",
        points: ["contact detail", "support channel", "future inquiry workflow"]
      }
    ],
    actions: [
      {
        label: "Overview を見る",
        href: "/overview",
        hint: "portal の目的と scope を再確認する。",
        emphasis: "primary"
      },
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "運用導線と monitoring/rollback の位置づけを見る。"
      }
    ],
    note:
      "この route は初回では text 中心でもよいが、visitor が次に何をすべきか不明な状態を残さないことを優先する。"
  },
  "/platform": {
    title: "Platform Outline",
    eyebrow: "AWS static delivery baseline",
    summary:
      "external DNS または CloudFront domain、CloudFront、S3 を軸にした AWS 静的配信の前提を説明し、Issue 17 の IaC 実装へ自然につなぐ。",
    audience:
      "このページは、構成判断を確認したい開発者と運用担当に向けた delivery baseline の要約面として使う。",
    outcome:
      "frontend の route shell から infrastructure 実装方針へ飛べる状態を作り、CloudFront 配信前提の UI 文脈を先に固定する。",
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
        body:
          "first release では User から CloudFront を経由し、S3 の静的 asset を配信する流れを基本とする。",
        points: [
          "custom domain を使う場合は external DNS または CloudFront domain の運用前提を先に確認する",
          "ACM は HTTPS の証明書管理に使用",
          "backend runtime は baseline に含めない"
        ]
      },
      {
        title: "実装への接続",
        body:
          "Issue 17 ではこの route に対応する OpenTofu 雛形を staging から実装し、後で出力値と deploy 先を接続する。",
        points: [
          "infra/modules で reusable module 化",
          "infra/environments/staging で最初の wiring",
          "production は staging の後に追従"
        ]
      }
    ],
    actions: [
      {
        label: "Delivery を見る",
        href: "/delivery",
        hint: "artifact から staging deploy までの流れへ進む。",
        emphasis: "primary"
      },
      {
        label: "Home に戻る",
        href: "/",
        hint: "public entry view に戻る。"
      }
    ],
    note:
      "Issue 17 の OpenTofu 雛形は、この route の説明を実インフラ構成へ落とし込む最初の足場になる。"
  },
  "/delivery": {
    title: "Release Path",
    eyebrow: "Build to staging route",
    summary:
      "build、validation、artifact、staging deploy の流れを視覚的に固定し、Issue 18 の workflow 実装とずれない導線を先に用意する。",
    audience:
      "このページは、変更がどの順序で build され staging へ届くかを確認したい開発者向けの release outline として使う。",
    outcome:
      "最小 workflow 実装後に、build artifact と staging deploy の結果説明を結び付けやすい route になる。",
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
        body:
          "最初に追加するのは build workflow であり、staging deploy は artifact を受け取る別 workflow として分ける。",
        points: [
          "pull request と push で build を検証",
          "artifact を upload して deploy workflow が取得",
          "production 承認は別 workflow に残す"
        ]
      },
      {
        title: "staging までの流れ",
        body:
          "frontend build 成功後に artifact を staging bucket へ反映し、必要に応じて CloudFront invalidation を実行する。",
        points: ["build success", "artifact download", "S3 sync and optional invalidation"]
      }
    ],
    actions: [
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "deploy 後の確認と rollback 導線を見る。",
        emphasis: "primary"
      },
      {
        label: "Platform Outline へ",
        href: "/platform",
        hint: "配信基盤の前提に戻る。"
      }
    ],
    note:
      "Issue 18 では build artifact を staging deploy workflow へ引き継ぎ、後で verification と approval flow を足せるように保つ。"
  },
  "/operations": {
    title: "Operations View",
    eyebrow: "Monitoring and rollback hooks",
    summary:
      "監視、rollback、運用判断の導線を置くための route として、Issue 12 と 14 の成果を後で UI に接続しやすい形を保つ。",
    audience:
      "運用担当と開発者が、monitoring と rollback の確認導線をどこに置くかを共有するための route である。",
    outcome:
      "今は説明中心でも、後で staging health や rollback checklist を差し込める route として生かせる。",
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
        body:
          "first release の operations は、サイト到達性、deploy の成否、復旧判断を短い確認フローにまとめることを重視する。",
        points: ["top page reachability", "primary route health", "rollback decision path"]
      },
      {
        title: "後続の拡張余地",
        body:
          "後で health summary、monitoring link、rollback checklist をここへ追加できるように UI の位置だけ先に確保する。",
        points: ["monitoring summary", "deploy verification links", "rollback readiness notes"]
      }
    ],
    actions: [
      {
        label: "Guidance へ",
        href: "/guidance",
        hint: "visitor 向け next action の view に戻る。",
        emphasis: "primary"
      },
      {
        label: "Release Path へ",
        href: "/delivery",
        hint: "workflow と deploy の導線を見直す。"
      }
    ],
    note:
      "Issue 12 と 14 の具体実装が入ってきたら、この route に monitoring と rollback の要点を集約する。"
  }
};

const navGroups: NavGroup[] = [
  {
    title: "Public Pages",
    paths: ["/", "/overview", "/guidance"]
  },
  {
    title: "Delivery Pages",
    paths: ["/platform", "/delivery", "/operations"]
  }
];

const applicationRoot = document.querySelector<HTMLDivElement>("#app");
const applicationBasePath = normalizeBasePath(import.meta.env.BASE_URL || "/");

if (!applicationRoot) {
  throw new Error("Application root was not found.");
}

function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath === "/") {
    return "";
  }

  const normalizedLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;

  return normalizedLeadingSlash.endsWith("/")
    ? normalizedLeadingSlash.slice(0, -1)
    : normalizedLeadingSlash;
}

function toApplicationPath(routePath: string): string {
  if (routePath === "/") {
    return applicationBasePath ? `${applicationBasePath}/` : "/";
  }

  return `${applicationBasePath}${routePath}`;
}

function toRoutePath(pathname: string): string {
  if (!applicationBasePath) {
    return pathname;
  }

  if (pathname === applicationBasePath || pathname === `${applicationBasePath}/`) {
    return "/";
  }

  if (pathname.startsWith(`${applicationBasePath}/`)) {
    return pathname.slice(applicationBasePath.length) || "/";
  }

  return pathname;
}

function normalizePath(pathname: string): string {
  const routePath = toRoutePath(pathname);

  if (routePath.length > 1 && routePath.endsWith("/")) {
    return routePath.slice(0, -1);
  }

  return routePath || "/";
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

function renderActionLinks(actions: ActionLink[], className: string): string {
  return actions
    .map((action) => {
      const emphasis = action.emphasis === "primary" ? `${className} primary` : `${className} secondary`;
      const destination = toApplicationPath(action.href);

      return `
        <a class="${emphasis}" href="${destination}" data-link="internal">
          <span>${escapeHtml(action.label)}</span>
          <small>${escapeHtml(action.hint)}</small>
        </a>
      `;
    })
    .join("");
}

function renderNavigation(currentPath: string): string {
  return navGroups
    .map((group) => {
      const links = group.paths
        .map((path) => {
          const route = routeDefinitions[path];
          const currentClass = currentPath === path ? "nav-link current" : "nav-link";
          const destination = toApplicationPath(path);

          return `<a class="${currentClass}" href="${destination}" data-link="internal">${escapeHtml(route.title)}</a>`;
        })
        .join("");

      return `
        <div class="nav-group">
          <span class="nav-group-title">${escapeHtml(group.title)}</span>
          <div class="nav-group-links">${links}</div>
        </div>
      `;
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
        <div class="hero-actions">
          ${renderActionLinks(route.actions, "action-link")}
        </div>
      </header>

      <nav class="main-nav" aria-label="Portal routes">
        ${renderNavigation(currentPath)}
      </nav>

      <main class="content-grid">
        <section class="panel panel-primary">
          <h2>Core direction</h2>
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
          <h2>Next routes</h2>
          <div class="action-grid">
            ${renderActionLinks(route.actions, "route-link")}
          </div>
        </section>

        <section class="panel panel-wide">
          <h2>Operational note</h2>
          <p class="panel-note">${escapeHtml(route.note)}</p>
          <p class="panel-note subdued">The portal keeps a small route map so the first release can stay static-first while still carrying real product and delivery meaning.</p>
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