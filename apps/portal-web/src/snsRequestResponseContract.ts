type ContractIssue = {
  scope: string;
  message: string;
};

type ContractCheckResult = {
  label: string;
  issues: ContractIssue[];
};

type RequestContractSpec = {
  endpoint: string;
  method: "POST";
  requiredFields: string[];
  optionalFields: string[];
  maxMessageLength: number;
};

type InvalidPayloadRuleSpec = {
  rejectedCases: string[];
  expectedStatus: number;
  expectedErrorCode: string;
};

type TimelineReadResponseSpec = {
  endpoint: string;
  method: "GET";
  collectionField: string;
  requiredItemFields: string[];
  ordering: string;
};

type RequestResponseContractSpec = {
  requestShape: RequestContractSpec;
  invalidPayloadRule: InvalidPayloadRuleSpec;
  timelineReadResponse: TimelineReadResponseSpec;
};

const snsRequestResponseContractSpec: RequestResponseContractSpec = {
  requestShape: {
    endpoint: "/api/sns/posts",
    method: "POST",
    requiredFields: ["authorId", "message"],
    optionalFields: ["replyToPostId"],
    maxMessageLength: 280
  },
  invalidPayloadRule: {
    rejectedCases: ["missing-authorId", "empty-message", "message-too-long"],
    expectedStatus: 400,
    expectedErrorCode: "INVALID_POST_PAYLOAD"
  },
  timelineReadResponse: {
    endpoint: "/api/sns/timeline",
    method: "GET",
    collectionField: "items",
    requiredItemFields: ["id", "authorId", "message", "createdAt"],
    ordering: "createdAt-desc"
  }
};

function findDuplicates(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

function validateRequestShape(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { endpoint, method, requiredFields, optionalFields, maxMessageLength } = snsRequestResponseContractSpec.requestShape;

  if (!endpoint.startsWith("/api/")) {
    issues.push({ scope: "request-shape", message: "endpoint must stay on an app-facing /api/ path" });
  }

  if (method !== "POST") {
    issues.push({ scope: "request-shape", message: "request contract must use POST" });
  }

  if (requiredFields.length === 0) {
    issues.push({ scope: "request-shape", message: "requiredFields must not be empty" });
  }

  if (!requiredFields.includes("message")) {
    issues.push({ scope: "request-shape", message: "requiredFields must include message" });
  }

  const duplicateRequiredFields = findDuplicates(requiredFields);

  if (duplicateRequiredFields.length > 0) {
    issues.push({
      scope: "request-shape",
      message: `requiredFields contains duplicates: ${duplicateRequiredFields.join(", ")}`
    });
  }

  const overlappingFields = requiredFields.filter((field) => optionalFields.includes(field));

  if (overlappingFields.length > 0) {
    issues.push({
      scope: "request-shape",
      message: `requiredFields and optionalFields overlap: ${overlappingFields.join(", ")}`
    });
  }

  if (maxMessageLength <= 0) {
    issues.push({ scope: "request-shape", message: "maxMessageLength must be greater than zero" });
  }

  return {
    label: "Request shape compatibility",
    issues
  };
}

function validateInvalidPayloadRule(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { rejectedCases, expectedStatus, expectedErrorCode } = snsRequestResponseContractSpec.invalidPayloadRule;

  if (rejectedCases.length === 0) {
    issues.push({ scope: "invalid-payload", message: "rejectedCases must not be empty" });
  }

  const duplicateRejectedCases = findDuplicates(rejectedCases);

  if (duplicateRejectedCases.length > 0) {
    issues.push({
      scope: "invalid-payload",
      message: `rejectedCases contains duplicates: ${duplicateRejectedCases.join(", ")}`
    });
  }

  if (expectedStatus < 400) {
    issues.push({ scope: "invalid-payload", message: "expectedStatus must be a client or server error status" });
  }

  if (!expectedErrorCode.trim()) {
    issues.push({ scope: "invalid-payload", message: "expectedErrorCode must not be empty" });
  }

  return {
    label: "Invalid payload rejection",
    issues
  };
}

function validateTimelineReadResponse(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { endpoint, method, collectionField, requiredItemFields, ordering } = snsRequestResponseContractSpec.timelineReadResponse;

  if (!endpoint.startsWith("/api/")) {
    issues.push({ scope: "timeline-read-response", message: "endpoint must stay on an app-facing /api/ path" });
  }

  if (method !== "GET") {
    issues.push({ scope: "timeline-read-response", message: "timeline read contract must use GET" });
  }

  if (!collectionField.trim()) {
    issues.push({ scope: "timeline-read-response", message: "collectionField must not be empty" });
  }

  if (requiredItemFields.length === 0) {
    issues.push({ scope: "timeline-read-response", message: "requiredItemFields must not be empty" });
  }

  const duplicateRequiredFields = findDuplicates(requiredItemFields);

  if (duplicateRequiredFields.length > 0) {
    issues.push({
      scope: "timeline-read-response",
      message: `requiredItemFields contains duplicates: ${duplicateRequiredFields.join(", ")}`
    });
  }

  if (!requiredItemFields.includes("message")) {
    issues.push({ scope: "timeline-read-response", message: "requiredItemFields must include message" });
  }

  if (!requiredItemFields.includes("createdAt")) {
    issues.push({ scope: "timeline-read-response", message: "requiredItemFields must include createdAt" });
  }

  if (!ordering.trim()) {
    issues.push({ scope: "timeline-read-response", message: "ordering must not be empty" });
  }

  return {
    label: "Timeline read response mapping",
    issues
  };
}

export function validateSnsRequestResponseContract(): ContractIssue[] {
  return [validateRequestShape(), validateInvalidPayloadRule(), validateTimelineReadResponse()].flatMap(
    (result) => result.issues
  );
}

export function buildSnsRequestResponseContractReport(): string {
  const checkResults = [validateRequestShape(), validateInvalidPayloadRule(), validateTimelineReadResponse()];
  const allIssues = checkResults.flatMap((result) => result.issues);
  const lines = [
    "SNS request-response contract baseline",
    "- Command: validate-sns-request-response-contract"
  ];

  for (const result of checkResults) {
    lines.push(`- ${result.label}: ${result.issues.length === 0 ? "passed" : "failed"}`);
  }

  lines.push(`- Result: ${allIssues.length === 0 ? "passed" : "failed"}`);

  if (allIssues.length === 0) {
    lines.push("- Issues: none");
    return lines.join("\n");
  }

  lines.push("- Issues:");

  for (const issue of allIssues) {
    lines.push(`  - [${issue.scope}] ${issue.message}`);
  }

  return lines.join("\n");
}