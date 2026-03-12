type ActionLinkLike = {
  href: string;
};

type RouteDefinitionLike = {
  title: string;
  summary: string;
  checklist: unknown[];
  sections: unknown[];
  actions: ActionLinkLike[];
};

type RouteDefinitionsLike = Record<string, RouteDefinitionLike>;

type NavigationGroupLike = {
  title: string;
  paths: string[];
};

export type RouteValidationIssue = {
  scope: string;
  message: string;
};

export type RouteValidationContext = {
  applicationBasePath: string;
  routeDefinitions: RouteDefinitionsLike;
  portalVariants: string[];
  requiredMajorFlowRoutes: readonly string[];
  navGroups: NavigationGroupLike[];
  getRouteDefinitionsForVariant: (variant: string) => RouteDefinitionsLike;
  roundTripPath: (routePath: string) => string;
};

function normalizeReferencedRoutePath(href: string): string {
  return href.split("#", 1)[0]?.split("?", 1)[0] ?? href;
}

function getReferencedRoutePaths(definitions: RouteDefinitionsLike): string[] {
  return Object.values(definitions).flatMap((route) =>
    route.actions
      .map((action) => action.href)
      .filter((href) => !/^https?:\/\//.test(href))
      .map((href) => normalizeReferencedRoutePath(href))
  );
}

function validateRouteMetadataForVariant(
  context: RouteValidationContext,
  variant: string
): RouteValidationIssue[] {
  const issues: RouteValidationIssue[] = [];
  const definitions = context.getRouteDefinitionsForVariant(variant);

  for (const path of context.requiredMajorFlowRoutes) {
    const route = definitions[path];

    if (!route) {
      issues.push({
        scope: `${variant}:${path}`,
        message: "required major-flow route definition is missing"
      });
      continue;
    }

    if (!route.title.trim()) {
      issues.push({ scope: `${variant}:${path}`, message: "title must not be empty" });
    }

    if (!route.summary.trim()) {
      issues.push({ scope: `${variant}:${path}`, message: "summary must not be empty" });
    }

    if (route.checklist.length === 0) {
      issues.push({ scope: `${variant}:${path}`, message: "checklist must include at least one baseline item" });
    }

    if (route.sections.length === 0) {
      issues.push({ scope: `${variant}:${path}`, message: "sections must include at least one major-flow explanation" });
    }

    if (route.actions.length === 0) {
      issues.push({ scope: `${variant}:${path}`, message: "actions must include at least one next-route link" });
    }
  }

  for (const group of context.navGroups) {
    if (group.paths.length === 0) {
      issues.push({ scope: `${variant}:${group.title}`, message: "navigation group must not be empty" });
    }

    for (const path of group.paths) {
      if (!definitions[path]) {
        issues.push({
          scope: `${variant}:${group.title}`,
          message: `navigation path ${path} does not have a route definition`
        });
      }
    }
  }

  for (const referencedPath of getReferencedRoutePaths(definitions)) {
    if (!definitions[referencedPath]) {
      issues.push({
        scope: `${variant}:${referencedPath}`,
        message: "action link points to a route that is not defined"
      });
    }
  }

  for (const path of context.requiredMajorFlowRoutes) {
    const roundTripPath = context.roundTripPath(path);

    if (roundTripPath !== path) {
      issues.push({
        scope: `${variant}:${path}`,
        message: `base-path round trip failed: received ${roundTripPath}`
      });
    }
  }

  return issues;
}

export function validateRouteMetadata(context: RouteValidationContext): RouteValidationIssue[] {
  return context.portalVariants.flatMap((variant) => validateRouteMetadataForVariant(context, variant));
}

export function buildRouteValidationReport(context: RouteValidationContext): string {
  const issues = validateRouteMetadata(context);
  const evidenceLines = [
    "Route validation baseline",
    `- Base path: ${context.applicationBasePath}`,
    `- Route definitions: ${Object.keys(context.routeDefinitions).length}`,
    `- Variants: ${context.portalVariants.join(", ")}`,
    `- Required major-flow routes: ${context.requiredMajorFlowRoutes.join(", ")}`,
    `- Navigation groups: ${context.navGroups.map((group) => group.title).join(", ")}`,
    `- Result: ${issues.length === 0 ? "passed" : "failed"}`
  ];

  if (issues.length === 0) {
    evidenceLines.push("- Issues: none");
    return evidenceLines.join("\n");
  }

  evidenceLines.push("- Issues:");

  for (const issue of issues) {
    evidenceLines.push(`  - [${issue.scope}] ${issue.message}`);
  }

  return evidenceLines.join("\n");
}