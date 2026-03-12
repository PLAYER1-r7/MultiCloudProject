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

type StatusTaskCard = {
  title: string;
  state: string;
  entryPoint: string;
  referenceChain: string;
  remainingTasks: string[];
  nextMove: string;
};

type SnsSurfaceDefinition = {
  surfaceId: string;
  title: string;
  summary: string;
  checks: string[];
  entryLink: ActionLink;
  postingCta: ActionLink;
};

type SnsAuthState = "guest" | "member" | "operator";

type SnsFlowState = "idle" | "blocked" | "success" | "failure";

type SnsReadbackEntry = {
  id: number;
  body: string;
  author: Exclude<SnsAuthState, "guest">;
  sequenceLabel: string;
};

type SnsDemoState = {
  authState: SnsAuthState;
  draft: string;
  shouldFailSubmission: boolean;
  flowState: SnsFlowState;
  feedbackTone: "neutral" | "success" | "error";
  feedbackMessage: string;
  lastSubmittedBody: string;
  readbackEntries: SnsReadbackEntry[];
  nextEntryId: number;
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
  statusCards?: StatusTaskCard[];
  snsSurface?: SnsSurfaceDefinition;
  actions: ActionLink[];
  note: string;
};

type NavGroup = {
  title: string;
  paths: string[];
};

type PortalVariant = "aws" | "gcp" | "local";

type RouteDefinitions = Record<string, RouteDefinition>;

type RouteDefinitionOverride = Partial<RouteDefinition>;

type PortalVariantMetadata = {
  label: string;
  heroBadge: string;
  hostnames: string[];
  fallbackLabel: string;
  titleSegment: string;
  descriptionPrefix: string;
};

const requiredMajorFlowRoutes = ["/", "/overview", "/guidance", "/status"] as const;
const portalVariants: PortalVariant[] = ["aws", "gcp", "local"];
const portalVariantMetadata: Record<PortalVariant, PortalVariantMetadata> = {
  aws: {
    label: "AWS portal variant",
    heroBadge: "AWS variant",
    hostnames: ["www.aws.ashnova.jp"],
    fallbackLabel: "AWS production host",
    titleSegment: "AWS host view",
    descriptionPrefix: "AWS-oriented portal view"
  },
  gcp: {
    label: "GCP portal variant",
    heroBadge: "GCP variant",
    hostnames: ["www.gcp.ashnova.jp", "preview.gcp.ashnova.jp"],
    fallbackLabel: "GCP public hosts",
    titleSegment: "GCP host view",
    descriptionPrefix: "GCP-oriented portal view"
  },
  local: {
    label: "Local preview variant",
    heroBadge: "Local preview",
    hostnames: [],
    fallbackLabel: "localhost or unknown host",
    titleSegment: "Local preview host view",
    descriptionPrefix: "Generic local preview portal view"
  }
};
const importMetaEnv = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env;
const browserRuntimeAvailable = typeof window !== "undefined" && typeof document !== "undefined";

function createInitialSnsDemoState(): SnsDemoState {
  return {
    authState: "guest",
    draft: "",
    shouldFailSubmission: false,
    flowState: "idle",
    feedbackTone: "neutral",
    feedbackMessage: "No submission executed yet. Use the SNS demo controls to exercise the major flow states.",
    lastSubmittedBody: "",
    readbackEntries: [],
    nextEntryId: 1
  };
}

let snsDemoState = createInitialSnsDemoState();

export const routeDefinitions: Record<string, RouteDefinition> = {
  "/": {
    title: "MultiCloudProject Portal",
    eyebrow: "AWS production | GCP production-equivalent",
    summary:
      "AWS production custom domain と GCP production-equivalent / retained preview の現在地を一つの入口に集約し、live surface と後続 hardening を混同せずに読める portal とする。",
    audience:
      "主対象は current live state と次の hardening batch をすばやく確認したい stakeholder、operator、reviewer であり、public-facing route から同じ前提を共有できることを重視する。",
    outcome:
      "トップページから AWS/GCP の現状、delivery baseline、operations path、canonical docs へ短く辿れる。",
    bullets: [
      "AWS production custom domain は live であり、現行の browser-facing production surface として扱う。",
      "GCP は retained preview と production-equivalent hostname の 2 面を持ち、今後の中心は hardening と lifecycle follow-up である。",
      "この portal は closed issue records の要約面であり、source of truth そのものは canonical docs に残す。"
    ],
    checklist: [
      "トップページから status route へ遷移できる。",
      "AWS/GCP の current state を誤読しない文言になっている。",
      "delivery と operations の導線が generic scaffold のまま残っていない。"
    ],
    sections: [
      {
        title: "Current cross-cloud snapshot",
        body:
          "現時点では AWS production と GCP production-equivalent のどちらも live であり、portal はその current state と next batch の境界を読む入口として機能する。",
        points: [
          "AWS production custom domain is live on the current delivery path",
          "GCP retained preview remains live while production-equivalent hostname is also live",
          "remaining work is follow-up hardening and lifecycle depth, not missing public delivery"
        ]
      },
      {
        title: "How to read this portal",
        body:
          "各 route は cloud status の source of truth ではなく、summary と routing を担う。判断や follow-up の詳細は status route から canonical docs へ進んで確認する。",
        points: [
          "use Overview for scope and intended readers",
          "use Platform and Release Path for delivery framing",
          "use Cloud Status for AWS/GCP current state and next batches"
        ]
      }
    ],
    actions: [
      {
        label: "Cloud Status を見る",
        href: "/status",
        hint: "AWS/GCP の現状と次の batch を確認する。",
        emphasis: "primary"
      },
      {
        label: "SNS surface へ",
        href: "/status#sns-request-response-surface",
        hint: "専用 SNS surface mount と posting CTA の入口を開く。"
      },
      {
        label: "Platform Outline を見る",
        href: "/platform",
        hint: "AWS production と GCP delivery surface の役割を確認する。"
      },
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "cloud ごとの運用導線と follow-up 境界を見る。"
      },
      {
        label: "Overview を見る",
        href: "/overview",
        hint: "portal の役割とスコープを短く確認する。"
      }
    ],
    note:
      "このトップページは live confirmation の代替ではなく、AWS/GCP の current repository state へ入る最短導線として扱う。"
  },
  "/overview": {
    title: "Overview",
    eyebrow: "Current scope and readers",
    summary:
      "portal-web を generic MVP seed ではなく、AWS/GCP の current delivery state と operator-managed follow-up を説明する summary surface として位置付け直す。",
    audience:
      "このページは、repository owner、reviewer、operator、status を確認したい stakeholder が portal の読み方を揃えるために使う。",
    outcome:
      "portal の route 群が AWS-first scaffold から cross-cloud current-state portal へ変わった理由を短く共有できる。",
    bullets: [
      "portal は public route shell を保ちながら、現在は cloud status summary の役割を強く持つ。",
      "AWS は current production surface、GCP は retained preview と production-equivalent follow-up の整理対象として扱う。",
      "closed issue records を reopening せず、summary route から次 batch を切れることを優先する。"
    ],
    checklist: [
      "portal の primary readers が読み取れる。",
      "current scope と out-of-scope が読み取れる。",
      "source of truth が canonical docs であることが崩れていない。"
    ],
    sections: [
      {
        title: "Primary readers",
        body:
          "この portal の primary readers は marketing visitor ではなく、AWS/GCP の現行状態、運用境界、次の hardening batch を見たい project-side readers である。",
        points: ["repository owner", "operator and reviewer", "cloud status stakeholder"]
      },
      {
        title: "Current scope boundary",
        body:
          "この app は current state の説明、delivery baseline の確認、operations path への routing を担うが、issue close judgment や live execution approval はここでは行わない。",
        points: ["summary and routing", "delivery and operations framing", "no live approval or issue-state mutation"]
      }
    ],
    actions: [
      {
        label: "Cloud Status へ",
        href: "/status",
        hint: "AWS/GCP の summary route を開く。",
        emphasis: "primary"
      },
      {
        label: "Guidance へ",
        href: "/guidance",
        hint: "reader 別の導線を確認する。"
      },
      {
        label: "Home に戻る",
        href: "/",
        hint: "cross-cloud snapshot の入口へ戻る。"
      }
    ],
    note:
      "Overview は product marketing copy ではなく、portal の運用上の読み方を合わせるための短い説明面として保つ。"
  },
  "/guidance": {
    title: "Guidance",
    eyebrow: "Where to look next",
    summary:
      "reader の目的が current state 確認、delivery 理解、operations 確認のどれかを素早く分岐できるように、portal 内の導線を AWS/GCP 前提で整理する。",
    audience:
      "このページは、repository を初めて開いた collaborator と current batch を再開する operator の両方に向けた route guide である。",
    outcome:
      "どの route が AWS/GCP の何を説明しているかを迷わず判断できる。",
    bullets: [
      "Cloud Status は current live state と remaining tasks の要約面である。",
      "Platform Outline と Release Path は cloud delivery の枠組みを見るページである。",
      "Operations View は monitoring、rollback、follow-up boundary を読むページである。"
    ],
    checklist: [
      "目的別の route が明示されている。",
      "status route が canonical docs へつながる前提が崩れていない。",
      "generic contact page のような誤読を招かない。"
    ],
    sections: [
      {
        title: "If you need current state",
        body:
          "AWS/GCP の現在地、remaining tasks、next execution batch を知りたい場合は、まず status route を開き、その後 canonical docs へ進む。",
        points: ["read Cloud Status", "open the cloud summary doc", "use issue maps only as closed references"]
      },
      {
        title: "If you need implementation framing",
        body:
          "delivery や operations の説明が必要なら、Platform Outline、Release Path、Operations View の順で読むと AWS/GCP の責務分離を追いやすい。",
        points: ["platform first", "delivery second", "operations for handoff and rollback context"]
      }
    ],
    actions: [
      {
        label: "Cloud Status へ",
        href: "/status",
        hint: "current state と next batches を確認する。",
        emphasis: "primary"
      },
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "monitoring と rollback の導線を見る。"
      },
      {
        label: "Platform Outline へ",
        href: "/platform",
        hint: "cloud 別の delivery surface を確認する。"
      }
    ],
    note:
      "Guidance は support form の代替ではなく、reader がどの route を読むべきかを揃えるための lightweight index として扱う。"
  },
  "/platform": {
    title: "Platform Outline",
    eyebrow: "AWS production | GCP delivery surfaces",
    summary:
      "AWS production custom domain と GCP retained preview / production-equivalent hostname を並べて、cloud ごとの browser-facing surface と delivery role を読みやすく整理する。",
    audience:
      "このページは、cloud ごとの公開面がどう分かれているかを確認したい開発者と運用担当に向けた platform summary である。",
    outcome:
      "AWS が current production path を担い、GCP が retained preview と production-equivalent hardening follow-up を抱える理由を route 文脈で共有できる。",
    bullets: [
      "AWS は production custom domain を持つ current production surface である。",
      "GCP は retained preview と production-equivalent hostname の 2 系統を維持している。",
      "どちらの cloud も現在の論点は new surface creation ではなく hardening depth と operator path である。"
    ],
    checklist: [
      "AWS の production role が読める。",
      "GCP の preview と production-equivalent の違いが読める。",
      "cloud ごとの remaining concerns が delivery 不足ではないとわかる。"
    ],
    sections: [
      {
        title: "AWS production surface",
        body:
          "AWS は production custom domain、monitoring baseline、external DNS cutover / reversal memo まで current production path に接続済みであり、現在の primary live surface を担う。",
        points: [
          "https://www.aws.ashnova.jp is the current production domain",
          "monitoring baseline and first-response path are fixed",
          "DNS verification chain through Issue 95 is already closed as a reference set",
          "remaining work is DNS automation depth beyond that closed chain, alert tooling depth, and rollback depth"
        ]
      },
      {
        title: "GCP retained preview and production-equivalent",
        body:
          "GCP は preview surface を retained しつつ production-equivalent hostname も live にしており、今後の中心は retained preview の lifecycle 判断と hardening branch の扱いになる。",
        points: [
          "https://preview.gcp.ashnova.jp remains available as retained preview",
          "https://www.gcp.ashnova.jp passed certificate and route verification close gates",
          "retained preview shutdown should only start from a fresh trigger before the 2026-03-31 retention deadline",
          "notification, Cloud Armor, credential rotation, and destructive rollback remain separate follow-up concerns"
        ]
      }
    ],
    actions: [
      {
        label: "Cloud Status を見る",
        href: "/status",
        hint: "platform summary から remaining tasks の view へ進む。",
        emphasis: "primary"
      },
      {
        label: "Release Path を見る",
        href: "/delivery",
        hint: "delivery と verification の整理へ進む。"
      },
      {
        label: "Home に戻る",
        href: "/",
        hint: "cross-cloud snapshot の入口へ戻る。"
      }
    ],
    note:
      "Platform Outline は cloud topology の完全記録ではなく、AWS/GCP の live surface と hardening の境界を読むための要約面として保つ。"
  },
  "/delivery": {
    title: "Release Path",
    eyebrow: "Build, verification, and live evidence",
    summary:
      "portal-web の build から validation、cloud-specific verification、さらに content update の標準手順までを整理し、AWS production と GCP production-equivalent の evidence path を同じ route で読めるようにする。",
    audience:
      "このページは、変更がどの順序で build され、どの evidence を伴って AWS/GCP の surface へ反映されるかを見たい開発者向けである。",
    outcome:
      "shared build と cloud-specific verification の違いを short route copy で追える。",
    bullets: [
      "route validation と build は portal-web の baseline evidence である。",
      "AWS は current production path の verification を持ち、GCP は retained preview と production-equivalent の evidence path を持つ。",
      "新しい portal update も source-of-truth docs と fresh task contract を起点にし、README と route copy を同一タスクで揃える。"
    ],
    checklist: [
      "local build / route validation の baseline が読める。",
      "cloud ごとの verification path の違いが読める。",
      "execution issue と closed reference chain を混同しない。"
    ],
    sections: [
      {
        title: "Shared portal-web baseline",
        body:
          "portal-web 自体は static-first の TypeScript application であり、route validation と build success が UI 変更の最小 evidence になる。",
        points: [
          "npm run test:baseline checks type safety and route metadata",
          "npm run build verifies the static bundle still compiles",
          "route copy changes should stay aligned with cloud status docs"
        ]
      },
      {
        title: "Cloud-specific evidence paths",
        body:
          "AWS と GCP はどちらも live surface を持つが、今後の変更は hardening batch ごとに evidence path を分けて扱う必要がある。",
        points: [
          "AWS production path emphasizes DNS, alerting, and rollback depth",
          "GCP path emphasizes retained preview lifecycle and hardening branches",
          "closed records remain references while new work starts from a fresh task contract"
        ]
      },
      {
        title: "Portal update loop",
        body:
          "portal-web 自体を更新するときは、canonical docs 確認、task contract 作成、route copy 更新、README 同期、validation の順を毎回同じ流れで踏む。これにより、portal が source-of-truth を追い越さず summary layer に留まる。",
        points: [
          "read docs_agent and docs/portal before editing route copy",
          "create a task contract before touching main.ts or README",
          "run npm run test:baseline and npm run build after every portal update"
        ]
      }
    ],
    actions: [
      {
        label: "Portal Update Workflow を開く",
        href: "https://github.com/PLAYER1-r7/MultiCloudProject/blob/main/docs/portal/21_PORTAL_UPDATE_WORKFLOW.md",
        hint: "portal 更新の標準手順と validation baseline を確認する。",
        emphasis: "primary"
      },
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "cloud ごとの monitoring と rollback の導線を見る。"
      },
      {
        label: "Cloud Status へ",
        href: "/status",
        hint: "current state と remaining tasks の view に戻る。"
      },
      {
        label: "Platform Outline へ",
        href: "/platform",
        hint: "cloud surfaces の整理に戻る。"
      }
    ],
    note:
      "Release Path は deploy workflow の完全仕様ではなく、portal-web の更新が cloud status summary と矛盾しないこと、そして update workflow が validation まで閉じていることを確認するための整理面である。"
  },
  "/operations": {
    title: "Operations View",
    eyebrow: "Monitoring, rollback, and follow-up boundaries",
    summary:
      "AWS と GCP の現行 operator path を短く並べ、monitoring baseline、rollback readiness、follow-up hardening の責務境界を route copy で読めるようにする。",
    audience:
      "運用担当と開発者が、どこまでが current path で、どこからが separate follow-up issue なのかを共有するための route である。",
    outcome:
      "current path と future hardening batch の境界を UI 上で読み分けやすくする。",
    bullets: [
      "AWS current path には production monitoring baseline と DNS reversal memo が含まれる。",
      "GCP current path には retained preview と production-equivalent verification close gate が含まれる。",
      "AWS DNS verification chain は closed reference に移行済みであり、alert tooling depth、credential rotation、destructive rollback などは separate follow-up として残る。"
    ],
    checklist: [
      "AWS の current operator path が読める。",
      "GCP の current operator path が読める。",
      "future follow-up と current path の境界が読める。"
    ],
    sections: [
      {
        title: "AWS operations baseline",
        body:
          "AWS 側では production monitoring baseline、first-response path、external DNS cutover / reversal memo、rollback readiness が current path に含まれる。",
        points: [
          "production custom domain reachability is already part of the current path",
          "deploy evidence path is the current first-response anchor",
          "DNS verification chain through Issue 95 is closed and remains reference-only",
          "deeper DNS automation, alert tooling, and rollback automation remain future work"
        ]
      },
      {
        title: "GCP operations baseline",
        body:
          "GCP 側では retained preview を維持しつつ production-equivalent hostname の verification を通しており、今後は retained preview shutdown 判断と hardening branch の深度整理が中心になる。",
        points: [
          "retained preview is still an active surface until a new shutdown issue is cut",
          "production-equivalent verification is completed and closed as a reference chain",
          "shutdown planning stays conditional on fresh trigger evidence before the retention deadline",
          "notification uplift, Cloud Armor tuning, credential rotation, and destructive rollback stay separate"
        ]
      }
    ],
    actions: [
      {
        label: "Cloud Status へ",
        href: "/status",
        hint: "current state と next batch の summary に戻る。",
        emphasis: "primary"
      },
      {
        label: "Release Path へ",
        href: "/delivery",
        hint: "validation と evidence path を見直す。"
      },
      {
        label: "Guidance へ",
        href: "/guidance",
        hint: "route guide に戻る。"
      }
    ],
    note:
      "Operations View は incident runbook の代替ではなく、current operator path と separate follow-up issue の境界を短く示す面として保つ。"
  },
  "/status": {
    title: "Cloud Status",
    eyebrow: "AWS live | GCP live",
    summary:
      "AWS production と GCP production-equivalent / retained preview の current state を同じ view に置き、closed reference chain と future follow-up batch を切り分けて読めるようにする。",
    audience:
      "このページは、どの cloud が live で、どの follow-up が closed reference で、次に何を fresh task contract から始めるべきかを確認したい stakeholder 向けの summary route である。",
    outcome:
      "AWS と GCP の current live state、cloud ごとの remaining tasks、canonical docs への参照導線を 1 画面で確認できる。",
    bullets: [
      "AWS と GCP はどちらも browser-facing portal surface を持つ。",
      "残タスクは delivery 不足ではなく、hardening と lifecycle follow-up が中心である。",
      "closed issue records を source of truth にしつつ、次の execution batch は fresh task contract から分けて起こす。"
    ],
    checklist: [
      "AWS current live state が読める。",
      "GCP current live state が読める。",
      "canonical docs と next batches への導線が見える。"
    ],
    sections: [
      {
        title: "AWS current state",
        body:
          "production custom domain は live であり、cutover、monitoring baseline、external DNS cutover / reversal memo は current production path に接続済みである。",
        points: [
          "https://www.aws.ashnova.jp is live on the current production surface",
          "production monitoring baseline and first-response path are fixed",
          "external DNS cutover and reversal memo are documented as the operator path",
          "remaining work is DNS automation depth beyond the closed DNS verification chain, alert tooling depth, and rollback depth"
        ]
      },
      {
        title: "GCP current state",
        body:
          "retained preview を維持しつつ、production-equivalent hostname も live になっている。今後の中心は live display ではなく retained preview の lifecycle 判断と hardening follow-up である。",
        points: [
          "https://preview.gcp.ashnova.jp remains the retained preview surface",
          "https://www.gcp.ashnova.jp passed certificate and route verification close gates",
          "remaining work is retained preview shutdown planning and hardening depth",
          "notification routing, Cloud Armor tuning, credential rotation, and destructive rollback remain separate follow-up work"
        ]
      },
      {
        title: "Next execution batches",
        body:
          "次の作業は closed records を reopen せず、AWS hardening と GCP lifecycle / hardening を別 batch に分けた方が review と rollback の境界が保ちやすい。",
        points: [
          "AWS: DNS automation, alert tooling depth, rollback and runbook depth",
          "GCP: retained preview shutdown decision, external notification uplift, Cloud Armor, credential rotation, and destructive rollback depth",
          "start each batch from a fresh task contract instead of editing closed records",
          "use Issue 69 and Issue 91 only as closed parent-map references"
        ]
      },
      {
        title: "Canonical references",
        body:
          "この route 自体は summary であり、最終的な確認は cloud summary doc と parent-map docs を開いて行う。",
        points: [
          "cloud summary doc is the top-level source for current live state and remaining tasks",
          "Issue 69 is the closed parent map for AWS hardening references",
          "Issue 91 is the closed parent map for GCP hardening references"
        ]
      }
    ],
    statusCards: [
      {
        title: "AWS hardening batch",
        state: "production custom domain live | follow-up hardening only",
        entryPoint:
          "Issue 69 closed parent map | latest references Issue 75, Issue 77, Issue 79 | DNS verification chain Issue 92-95 closed reference",
        referenceChain:
          "DNS assistive automation | alert tooling depth | rollback and runbook depth | DNS verification chain closed at Issue 95",
        remainingTasks: [
          "external DNS provider credentials, provider API boundary, and full DNS automation remain separate follow-up work beyond the closed DNS verification chain",
          "automatic rollback, emergency override depth, and deeper incident runbook execution remain separate batches",
          "24x7 on-call, automatic remediation, broad chat fan-out, and dashboard or SLO design remain outside the current baseline"
        ],
        nextMove:
          "新しい AWS follow-up は Issue 69 chain と DNS verification chain Issue 92-95 を reopen せず、fresh task contract から起こす。"
      },
      {
        title: "GCP lifecycle and hardening batch",
        state: "production-equivalent live | retained preview still active",
        entryPoint: "Issue 91 closed parent map | latest references Issue 80, Issue 84, Issue 86, Issue 88, Issue 90",
        referenceChain: "retained preview decisioning | notification uplift | Cloud Armor | credential rotation | destructive rollback",
        remainingTasks: [
          "retained preview shutdown planning remains conditional on fresh trigger evidence before the 2026-03-31 retention deadline",
          "Cloud Armor tuning, credential rotation execution, and destructive rollback execution remain review-only references today",
          "owner-bound external notification uplift remains separate from live delivery automation",
          "new GCP execution should start from a fresh task contract rather than extending the closed reference chain"
        ],
        nextMove:
          "新しい GCP follow-up は Issue 80 から 91 を再利用せず、新しい task contract と新しい follow-up issue chain で開始する。"
      }
    ],
    snsSurface: {
      surfaceId: "sns-request-response-surface",
      title: "SNS request-response surface",
      summary:
        "Issue 119 と Issue 120 で固定した contract baseline を browser-facing route に接続し、surface mount、entry link integrity、posting CTA reachability を narrow scope で検証する専用 panel とする。",
      checks: [
        "surface panel が /status route 上で mount している",
        "top/root から専用 surface anchor へ内部遷移できる",
        "posting CTA から次の browser-side flow target へ reachability を残せる"
      ],
      entryLink: {
        label: "Root からこの surface を開く",
        href: "/status#sns-request-response-surface",
        hint: "entry link integrity を root route から確認する。"
      },
      postingCta: {
        label: "Posting CTA target を開く",
        href: "/status#sns-posting-cta-guidance",
        hint: "auth-post-readback 実装前に CTA reachability の固定 target を確認する。",
        emphasis: "primary"
      }
    },
    actions: [
      {
        label: "Cloud Summary Doc を開く",
        href: "https://github.com/PLAYER1-r7/MultiCloudProject/blob/main/docs/portal/18_CLOUD_STATUS_AND_REMAINING_TASKS.md",
        hint: "AWS/GCP current state と remaining tasks の canonical doc を開く。",
        emphasis: "primary"
      },
      {
        label: "AWS Parent Map を開く",
        href: "https://github.com/PLAYER1-r7/MultiCloudProject/blob/main/docs/portal/issues/issue-69-aws-hardening-batch-follow-up-map.md",
        hint: "AWS hardening batch の closed parent map を確認する。"
      },
      {
        label: "GCP Parent Map を開く",
        href: "https://github.com/PLAYER1-r7/MultiCloudProject/blob/main/docs/portal/issues/issue-91-gcp-hardening-batch-follow-up-map.md",
        hint: "GCP lifecycle and hardening batch の closed parent map を確認する。"
      },
      {
        label: "Operations View へ",
        href: "/operations",
        hint: "monitoring と rollback の route に戻る。"
      }
    ],
    note:
      "この route は closed issue records の summary であり、新しい approval や live execution を代行するものではない。"
  }
};

const portalVariantRouteOverrides: Record<PortalVariant, Partial<Record<string, RouteDefinitionOverride>>> = {
  aws: {
    "/": {
      eyebrow: "AWS portal variant | production custom domain",
      summary:
        "AWS production custom domain の current state と follow-up hardening を primary context として表示し、GCP の live surface は secondary cross-cloud reference として残す。"
    },
    "/overview": {
      eyebrow: "AWS-facing scope and readers",
      summary:
        "この hostname では AWS production state、AWS operator path、AWS hardening queue を primary lens に置いたうえで、GCP は cross-cloud comparison reference として読む。"
    },
    "/guidance": {
      eyebrow: "AWS-oriented route guidance",
      summary:
        "AWS current state、DNS and alert follow-up、rollback depth を先に追いたい reader 向けに、shared route の中で AWS 側の読み順を優先表示する。"
    },
    "/platform": {
      eyebrow: "AWS production primary | GCP secondary reference",
      summary:
        "AWS production custom domain を primary surface として表示し、GCP retained preview と production-equivalent hostname は secondary reference として並べる。"
    },
    "/delivery": {
      eyebrow: "AWS candidate build | live split follows",
      summary:
        "local implementation candidate を AWS-facing portal copy として整えつつ、public reflection evidence 自体は separate AWS and GCP execution issue に残す。"
    },
    "/operations": {
      eyebrow: "AWS operator path primary",
      summary:
        "AWS production monitoring baseline、external DNS reversal path、rollback depth を primary operator context として表示し、GCP operations は comparative reference として残す。"
    },
    "/status": {
      eyebrow: "AWS primary live | GCP secondary reference",
      summary:
        "AWS production current state と next hardening queue を primary に表示しつつ、GCP retained preview と production-equivalent surface は cross-cloud reference として追えるようにする。"
    }
  },
  gcp: {
    "/": {
      eyebrow: "GCP portal variant | production-equivalent and retained preview",
      summary:
        "GCP production-equivalent hostname と retained preview の current state を primary context として表示し、AWS production surface は secondary cross-cloud reference として残す。"
    },
    "/overview": {
      eyebrow: "GCP-facing scope and readers",
      summary:
        "この hostname では GCP production-equivalent state、retained preview lifecycle、GCP hardening follow-up を primary lens に置いたうえで、AWS は comparison reference として読む。"
    },
    "/guidance": {
      eyebrow: "GCP-oriented route guidance",
      summary:
        "GCP current state、retained preview shutdown decisioning、Cloud Armor and notification follow-up を先に追いたい reader 向けに、shared route の中で GCP 側の読み順を優先表示する。"
    },
    "/platform": {
      eyebrow: "GCP public surfaces primary | AWS secondary reference",
      summary:
        "GCP retained preview と production-equivalent hostname を primary surface として表示し、AWS production custom domain は secondary reference として並べる。"
    },
    "/delivery": {
      eyebrow: "GCP candidate build | live split follows",
      summary:
        "local implementation candidate を GCP-facing portal copy として整えつつ、public reflection evidence 自体は separate AWS and GCP execution issue に残す。"
    },
    "/operations": {
      eyebrow: "GCP operator path primary",
      summary:
        "retained preview lifecycle judgment、production-equivalent verification reference、Cloud Armor and credential rotation follow-up を primary operator context として表示し、AWS operations は comparative reference として残す。"
    },
    "/status": {
      eyebrow: "GCP primary live | AWS secondary reference",
      summary:
        "GCP production-equivalent current state と retained preview follow-up を primary に表示しつつ、AWS production surface は cross-cloud reference として追えるようにする。"
    }
  },
  local: {
    "/": {
      eyebrow: "Local preview variant | generic cross-cloud view",
      summary:
        "local dev または unknown host では AWS/GCP のどちらにも寄せず、generic preview として cross-cloud summary を表示し、runtime hostname 判定が明示的に確認できるようにする。"
    },
    "/overview": {
      eyebrow: "Local preview scope and readers",
      summary:
        "local preview では AWS/GCP のどちらにも擬態せず、shared route structure と variant split 自体を確認するための generic portal view として扱う。"
    },
    "/guidance": {
      eyebrow: "Local preview route guidance",
      summary:
        "local validation では cloud-specific public claim を避けつつ、AWS/GCP のどちらへ進む route かを generic preview から比較できるようにする。"
    },
    "/platform": {
      eyebrow: "Generic preview | compare AWS and GCP surfaces",
      summary:
        "local preview では AWS production と GCP public surfaces を並列比較し、unknown host がどちらか一方に暗黙で寄らないことを明示する。"
    },
    "/delivery": {
      eyebrow: "Local candidate build | no live claim",
      summary:
        "local preview は runtime hostname-aware split の検証面であり、この時点では browser-facing live reflection claim を伴わない build candidate として扱う。"
    },
    "/operations": {
      eyebrow: "Generic preview | compare operator paths",
      summary:
        "local preview では AWS/GCP の current operator path を比較表示し、variant split 後も shared route structure が壊れていないことを確認する。"
    },
    "/status": {
      eyebrow: "Generic preview | compare AWS and GCP status",
      summary:
        "local preview では AWS/GCP の remaining tasks を並列比較し、unknown host fallback が cloud-specific public wording を誤って名乗らないことを確認する。"
    }
  }
};

export const navGroups: NavGroup[] = [
  {
    title: "Public Pages",
    paths: ["/", "/overview", "/guidance"]
  },
  {
    title: "Delivery Pages",
    paths: ["/platform", "/delivery", "/operations", "/status"]
  }
];

const applicationBasePath = normalizeBasePath(importMetaEnv?.BASE_URL || "/");

function resolvePortalVariant(hostname: string): PortalVariant {
  const normalizedHostname = hostname.trim().toLowerCase();

  if (portalVariantMetadata.aws.hostnames.includes(normalizedHostname)) {
    return "aws";
  }

  if (portalVariantMetadata.gcp.hostnames.includes(normalizedHostname)) {
    return "gcp";
  }

  return "local";
}

function getVariantDisplayHost(hostname: string, variant: PortalVariant): string {
  const normalizedHostname = hostname.trim().toLowerCase();

  if (normalizedHostname) {
    return normalizedHostname;
  }

  return portalVariantMetadata[variant].fallbackLabel;
}

function getHeroBadges(variant: PortalVariant, hostname: string): string[] {
  return [
    portalVariantMetadata[variant].heroBadge,
    getVariantDisplayHost(hostname, variant),
    "Static delivery",
    "TypeScript scaffold"
  ];
}

function upsertMetaTag(attributeName: "name" | "property", attributeValue: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function buildDocumentDescription(route: RouteDefinition, variant: PortalVariant, hostname: string): string {
  const variantMetadata = portalVariantMetadata[variant];
  const displayHost = getVariantDisplayHost(hostname, variant);

  return `${variantMetadata.descriptionPrefix} on ${displayHost}. ${route.summary}`;
}

function syncDocumentMetadata(route: RouteDefinition, variant: PortalVariant, hostname: string): void {
  const variantMetadata = portalVariantMetadata[variant];
  const description = buildDocumentDescription(route, variant, hostname);

  document.title = `${route.title} | ${variantMetadata.titleSegment} | MultiCloudProject Portal`;
  upsertMetaTag("name", "description", description);
  upsertMetaTag("property", "og:title", document.title);
  upsertMetaTag("property", "og:description", description);
}

function getVariantStatusCards(variant: PortalVariant): StatusTaskCard[] {
  const sharedStatusCards = routeDefinitions["/status"].statusCards ?? [];

  if (variant === "gcp" && sharedStatusCards.length >= 2) {
    return [sharedStatusCards[1], sharedStatusCards[0]];
  }

  return sharedStatusCards;
}

function getRouteDefinitionsForVariant(variant: PortalVariant): RouteDefinitions {
  const overrides = portalVariantRouteOverrides[variant];

  return Object.fromEntries(
    Object.entries(routeDefinitions).map(([path, route]) => {
      const override = overrides[path];
      const resolvedRoute = override ? { ...route, ...override } : { ...route };

      if (path === "/status") {
        resolvedRoute.statusCards = getVariantStatusCards(variant);
      }

      return [path, resolvedRoute];
    })
  );
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

const routeValidationContext = {
  applicationBasePath: applicationBasePath || "/",
  routeDefinitions,
  portalVariants,
  requiredMajorFlowRoutes,
  navGroups,
  getRouteDefinitionsForVariant: (variant: string) => getRouteDefinitionsForVariant(variant as PortalVariant),
  roundTripPath: (routePath: string) => normalizePath(toApplicationPath(routePath))
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderList(items: string[], className: string): string {
  return items
    .map((item) => `<li class="${className}">${escapeHtml(item)}</li>`)
    .join("");
}

function renderActionLinks(actions: ActionLink[], className: string): string {
  return actions
    .map((action, index) => {
      const emphasis = action.emphasis === "primary" ? `${className} primary` : `${className} secondary`;
      const external = /^https?:\/\//.test(action.href);
      const destination = escapeHtml(external ? action.href : toApplicationPath(action.href));
      const interactionAttributes = external
        ? 'target="_blank" rel="noreferrer"'
        : 'data-link="internal"';
      const actionAttributes = [
        `data-route-action-index="${index}"`,
        `data-route-action-kind="${className}"`,
        `data-route-action-emphasis="${action.emphasis ?? "secondary"}"`,
        `data-route-action-href="${escapeHtml(action.href)}"`
      ].join(" ");

      return `
        <a class="${emphasis}" href="${destination}" ${interactionAttributes} ${actionAttributes}>
          <span>${escapeHtml(action.label)}</span>
          <small>${escapeHtml(action.hint)}</small>
        </a>
      `;
    })
    .join("");
}

function renderBadges(badges: string[]): string {
  return badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("");
}

function renderNavigation(currentPath: string, definitions: RouteDefinitions): string {
  return navGroups
    .map((group) => {
      const links = group.paths
        .map((path) => {
          const route = definitions[path];
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

function renderStatusCards(statusCards: StatusTaskCard[]): string {
  return statusCards
    .map(
      (card) => `
        <article class="status-card">
          <div class="status-card-header">
            <p class="status-card-kicker">Closed reference summary</p>
            <h3>${escapeHtml(card.title)}</h3>
          </div>
          <dl class="status-metadata">
            <div>
              <dt>Current state</dt>
              <dd>${escapeHtml(card.state)}</dd>
            </div>
            <div>
              <dt>Entry point</dt>
              <dd>${escapeHtml(card.entryPoint)}</dd>
            </div>
            <div>
              <dt>Reference chain</dt>
              <dd>${escapeHtml(card.referenceChain)}</dd>
            </div>
          </dl>
          <div class="status-card-body">
            <h4>Remaining tasks</h4>
            <ul class="status-task-list">
              ${renderList(card.remainingTasks, "status-task-item")}
            </ul>
          </div>
          <p class="status-next-move">${escapeHtml(card.nextMove)}</p>
        </article>
      `
    )
    .join("");
}

function renderSnsAuthStateOptions(activeState: SnsAuthState): string {
  const states: SnsAuthState[] = ["guest", "member", "operator"];

  return states
    .map(
      (state) =>
        `<option value="${state}" ${state === activeState ? "selected" : ""}>${escapeHtml(state)}</option>`
    )
    .join("");
}

function getSnsFlowSummaryText(flowState: SnsFlowState): string {
  switch (flowState) {
    case "blocked":
      return "Signed-out blocked flow is active. The surface keeps the submit blocked and exposes the reason.";
    case "success":
      return "Signed-in submit succeeded. The latest local readback is visible on the same surface.";
    case "failure":
      return "Signed-in submit failed. The error state stays visible without pretending the write succeeded.";
    default:
      return "The SNS surface is mounted and waiting for the next auth-post-readback interaction.";
  }
}

function renderSnsAuthPostReadbackDemo(): string {
  const timelineEntries = snsDemoState.readbackEntries.length
    ? snsDemoState.readbackEntries
        .map(
          (entry) => `
            <li class="sns-readback-item" data-sns-readback-item="true" data-sns-entry-id="${entry.id}">
              <div class="sns-readback-meta">
                <span data-sns-readback-author="true">${escapeHtml(entry.author)}</span>
                <span>${escapeHtml(entry.sequenceLabel)}</span>
              </div>
              <p data-sns-readback-body="true">${escapeHtml(entry.body)}</p>
            </li>
          `
        )
        .join("")
    : `
        <li class="sns-readback-empty" data-sns-readback-empty="true">
          No local readback entry yet. Successful signed-in posts will appear here.
        </li>
      `;

  return `
    <div class="sns-flow-grid" data-sns-auth-flow="true">
      <article class="story-card sns-flow-card">
        <h3>Auth and submit controls</h3>
        <div class="sns-field-stack">
          <label class="sns-field">
            <span class="meta-label">Auth state</span>
            <select class="sns-select" data-sns-auth-select="true">
              ${renderSnsAuthStateOptions(snsDemoState.authState)}
            </select>
          </label>
          <label class="sns-checkbox-row">
            <input type="checkbox" data-sns-failure-toggle="true" ${snsDemoState.shouldFailSubmission ? "checked" : ""}>
            <span>Simulate write failure</span>
          </label>
          <label class="sns-field">
            <span class="meta-label">Draft message</span>
            <textarea
              class="sns-textarea"
              rows="4"
              placeholder="Post a local SNS flow note"
              data-sns-composer-input="true"
            >${escapeHtml(snsDemoState.draft)}</textarea>
          </label>
          <div class="sns-button-row">
            <button class="sns-button primary" type="button" data-sns-submit-button="true">Submit SNS post</button>
            <button class="sns-button secondary" type="button" data-sns-reset-button="true">Reset demo state</button>
          </div>
        </div>
      </article>
      <article class="story-card sns-flow-card">
        <h3>Flow result</h3>
        <p class="panel-note" data-sns-flow-result="true" data-sns-flow-state="${escapeHtml(snsDemoState.flowState)}">${escapeHtml(
          getSnsFlowSummaryText(snsDemoState.flowState)
        )}</p>
        <p class="sns-feedback ${snsDemoState.feedbackTone}" data-sns-feedback="true">${escapeHtml(
          snsDemoState.feedbackMessage
        )}</p>
        <dl class="status-metadata">
          <div>
            <dt>Current auth</dt>
            <dd data-sns-current-auth="true">${escapeHtml(snsDemoState.authState)}</dd>
          </div>
          <div>
            <dt>Submission mode</dt>
            <dd data-sns-submission-mode="true">${snsDemoState.shouldFailSubmission ? "failure" : "normal"}</dd>
          </div>
          <div>
            <dt>Last submitted body</dt>
            <dd data-sns-last-submitted-body="true">${escapeHtml(snsDemoState.lastSubmittedBody || "none")}</dd>
          </div>
        </dl>
      </article>
      <article class="story-card sns-flow-card">
        <h3>Readback timeline</h3>
        <ul class="sns-readback-list" data-sns-readback-list="true">
          ${timelineEntries}
        </ul>
      </article>
    </div>
  `;
}

function renderSnsSurface(surface: SnsSurfaceDefinition): string {
  return `
    <section
      class="panel panel-wide panel-sns-surface"
      id="${escapeHtml(surface.surfaceId)}"
      data-sns-surface="request-response"
    >
      <div class="sns-surface-header">
        <p class="status-card-kicker">SNS reachability baseline</p>
        <h2>${escapeHtml(surface.title)}</h2>
        <p class="panel-note">${escapeHtml(surface.summary)}</p>
      </div>
      <div class="story-grid">
        <article class="story-card" data-sns-surface-mount="true">
          <h3>Surface checks</h3>
          <ul class="story-list">
            ${renderList(surface.checks, "story-item")}
          </ul>
        </article>
        <article class="story-card" id="sns-posting-cta-guidance" data-sns-posting-target="true">
          <h3>Posting CTA target</h3>
          <p>Issue 121 の full auth-post-readback flow 前に、posting CTA が到達すべき narrow target をこの panel で固定する。</p>
          <ul class="story-list">
            ${renderList(
              [
                "first keep the target on /status so mount failure and CTA failure can be split",
                "promote this target to a richer SNS interaction surface only after auth-post-readback flow lands",
                "reuse the stable data-sns-* hooks in browser suites before broadening selectors"
              ],
              "story-item"
            )}
          </ul>
        </article>
      </div>
      <div class="action-grid">
        <a
          class="route-link secondary"
          href="${escapeHtml(toApplicationPath(surface.entryLink.href))}"
          data-link="internal"
          data-sns-entry-link="true"
        >
          <span>${escapeHtml(surface.entryLink.label)}</span>
          <small>${escapeHtml(surface.entryLink.hint)}</small>
        </a>
        <a
          class="route-link primary"
          href="${escapeHtml(toApplicationPath(surface.postingCta.href))}"
          data-link="internal"
          data-sns-posting-cta="true"
        >
          <span>${escapeHtml(surface.postingCta.label)}</span>
          <small>${escapeHtml(surface.postingCta.hint)}</small>
        </a>
      </div>
      ${renderSnsAuthPostReadbackDemo()}
    </section>
  `;
}

function scrollToHashTarget(): void {
  const hash = window.location.hash;

  if (!hash) {
    return;
  }

  const targetId = decodeURIComponent(hash.slice(1));

  if (!targetId) {
    return;
  }

  window.requestAnimationFrame(() => {
    document.getElementById(targetId)?.scrollIntoView({ block: "start" });
  });
}

function renderCurrentRoute(applicationRoot: HTMLDivElement): void {
  renderRoute(applicationRoot);
  scrollToHashTarget();
}

function renderRoute(applicationRoot: HTMLDivElement): void {
  const currentPath = normalizePath(window.location.pathname);
  const portalVariant = resolvePortalVariant(window.location.hostname);
  const resolvedRouteDefinitions = getRouteDefinitionsForVariant(portalVariant);
  const route = resolvedRouteDefinitions[currentPath] ?? resolvedRouteDefinitions["/"];
  const variantHost = getVariantDisplayHost(window.location.hostname, portalVariant);
  const heroBadges = getHeroBadges(portalVariant, window.location.hostname);

  syncDocumentMetadata(route, portalVariant, window.location.hostname);

  applicationRoot.innerHTML = `
    <div class="page-shell" data-portal-variant="${escapeHtml(portalVariant)}" data-route-path="${escapeHtml(currentPath)}">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>
      <header class="hero">
        <p class="eyebrow">${escapeHtml(route.eyebrow)}</p>
        <div class="hero-topline">
          ${renderBadges(heroBadges)}
        </div>
        <h1 data-portal-field="route-title">${escapeHtml(route.title)}</h1>
        <p class="hero-summary" data-portal-field="route-summary">${escapeHtml(route.summary)}</p>
        <div class="hero-meta">
          <div class="meta-block">
            <span class="meta-label">Active variant</span>
            <p data-portal-field="active-variant">${escapeHtml(portalVariantMetadata[portalVariant].label)}</p>
            <p data-portal-field="active-host">${escapeHtml(variantHost)}</p>
          </div>
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
        ${renderNavigation(currentPath, resolvedRouteDefinitions)}
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

        ${route.statusCards?.length
          ? `
        <section class="panel panel-wide panel-status-cards">
          <h2>Remaining task cards</h2>
          <div class="status-grid">
            ${renderStatusCards(route.statusCards)}
          </div>
        </section>
        `
          : ""}

        ${route.snsSurface ? renderSnsSurface(route.snsSurface) : ""}

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

function submitSnsDemoState(): void {
  const submittedBody = snsDemoState.draft.trim();
  snsDemoState.lastSubmittedBody = submittedBody;

  if (!submittedBody) {
    snsDemoState.flowState = "failure";
    snsDemoState.feedbackTone = "error";
    snsDemoState.feedbackMessage = "A draft body is required before the SNS demo can submit.";
    return;
  }

  if (snsDemoState.authState === "guest") {
    snsDemoState.flowState = "blocked";
    snsDemoState.feedbackTone = "error";
    snsDemoState.feedbackMessage = "Signed-out users remain blocked from posting to the SNS demo surface.";
    return;
  }

  if (snsDemoState.shouldFailSubmission) {
    snsDemoState.flowState = "failure";
    snsDemoState.feedbackTone = "error";
    snsDemoState.feedbackMessage = "Simulated write failure remained visible. No new readback entry was added.";
    return;
  }

  snsDemoState.readbackEntries = [
    {
      id: snsDemoState.nextEntryId,
      body: submittedBody,
      author: snsDemoState.authState,
      sequenceLabel: `local preview entry #${snsDemoState.nextEntryId}`
    },
    ...snsDemoState.readbackEntries
  ];
  snsDemoState.nextEntryId += 1;
  snsDemoState.flowState = "success";
  snsDemoState.feedbackTone = "success";
  snsDemoState.feedbackMessage = "Signed-in submit path completed. Local readback is now visible on the SNS surface.";
  snsDemoState.draft = "";
}

function resetSnsDemoState(): void {
  snsDemoState = createInitialSnsDemoState();
}

async function bootstrapBrowserApplication(): Promise<void> {
  await import("./styles.css");

  const applicationRoot = document.querySelector<HTMLDivElement>("#app");

  if (!applicationRoot) {
    throw new Error("Application root was not found.");
  }

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    if (target.matches('[data-sns-composer-input="true"]')) {
      snsDemoState.draft = target.value;
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement && target.matches('[data-sns-auth-select="true"]')) {
      snsDemoState.authState = target.value as SnsAuthState;
      renderCurrentRoute(applicationRoot);
      return;
    }

    if (target instanceof HTMLInputElement && target.matches('[data-sns-failure-toggle="true"]')) {
      snsDemoState.shouldFailSubmission = target.checked;
      renderCurrentRoute(applicationRoot);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const submitButton = target.closest<HTMLButtonElement>('button[data-sns-submit-button="true"]');

    if (submitButton) {
      event.preventDefault();
      submitSnsDemoState();
      renderCurrentRoute(applicationRoot);
      return;
    }

    const resetButton = target.closest<HTMLButtonElement>('button[data-sns-reset-button="true"]');

    if (resetButton) {
      event.preventDefault();
      resetSnsDemoState();
      renderCurrentRoute(applicationRoot);
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
    renderCurrentRoute(applicationRoot);
  });

  window.addEventListener("popstate", () => {
    renderCurrentRoute(applicationRoot);
  });

  renderCurrentRoute(applicationRoot);
}

async function runRouteValidationCli(): Promise<void> {
  const { buildRouteValidationReport, validateRouteMetadata } = await import("./routeValidation.ts");
  const report = buildRouteValidationReport(routeValidationContext);

  if (validateRouteMetadata(routeValidationContext).length > 0) {
    console.error(report);
    process.exitCode = 1;
    return;
  }

  console.log(report);
}

async function runSnsRequestResponseContractCli(): Promise<void> {
  const { buildSnsRequestResponseContractReport, validateSnsRequestResponseContract } = await import(
    "./snsRequestResponseContract.ts"
  );
  const report = buildSnsRequestResponseContractReport();

  if (validateSnsRequestResponseContract().length > 0) {
    console.error(report);
    process.exitCode = 1;
    return;
  }

  console.log(report);
}

async function runSnsAuthErrorContractCli(): Promise<void> {
  const { buildSnsAuthErrorContractReport, validateSnsAuthErrorContract } = await import(
    "./snsAuthErrorContract.ts"
  );
  const report = buildSnsAuthErrorContractReport();

  if (validateSnsAuthErrorContract().length > 0) {
    console.error(report);
    process.exitCode = 1;
    return;
  }

  console.log(report);
}

function getCliCommand():
  | "validate-routes"
  | "validate-sns-request-response-contract"
  | "validate-sns-auth-error-contract"
  | null {
  if (typeof process === "undefined" || !Array.isArray(process.argv)) {
    return null;
  }

  if (process.argv.includes("--validate-routes")) {
    return "validate-routes";
  }

  if (process.argv.includes("--validate-sns-request-response-contract")) {
    return "validate-sns-request-response-contract";
  }

  if (process.argv.includes("--validate-sns-auth-error-contract")) {
    return "validate-sns-auth-error-contract";
  }

  return null;
}

function runCliCommand(
  command:
    | "validate-routes"
    | "validate-sns-request-response-contract"
    | "validate-sns-auth-error-contract"
): Promise<void> {
  switch (command) {
    case "validate-routes":
      return runRouteValidationCli();
    case "validate-sns-request-response-contract":
      return runSnsRequestResponseContractCli();
    case "validate-sns-auth-error-contract":
      return runSnsAuthErrorContractCli();
  }
}

async function bootstrapApplication(): Promise<void> {
  const cliCommand = getCliCommand();

  if (cliCommand) {
    await runCliCommand(cliCommand);
    return;
  }

  if (browserRuntimeAvailable) {
    void bootstrapBrowserApplication();
  }
}

void bootstrapApplication();