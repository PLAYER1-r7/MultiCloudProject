import { findDuplicates, type ContractCheckResult, type ContractIssue } from "./snsContractShared.ts";

type PermissionExpectation = {
  role: "guest" | "member" | "operator";
  canSubmitPost: boolean;
  expectedOutcome: string;
  expectedStatus: number;
};

type WriteFailureVisibilitySpec = {
  expectedStatus: number;
  expectedErrorCode: string;
  surfaceFields: string[];
};

type FailClosedErrorSpec = {
  errorCodes: string[];
  completionFields: string[];
};

type AuthErrorContractSpec = {
  permissionMatrix: PermissionExpectation[];
  writeFailureVisibility: WriteFailureVisibilitySpec;
  failClosedErrors: FailClosedErrorSpec;
};

// This baseline validates the intended SNS auth/error contract shape only.
// It asserts that the service-backed SNS slice remains fail-closed and exposes completion-state metadata.
const snsAuthErrorContractSpec: AuthErrorContractSpec = {
  permissionMatrix: [
    {
      role: "guest",
      canSubmitPost: false,
      expectedOutcome: "guest-blocked",
      expectedStatus: 403
    },
    {
      role: "member",
      canSubmitPost: true,
      expectedOutcome: "member-allowed",
      expectedStatus: 201
    },
    {
      role: "operator",
      canSubmitPost: true,
      expectedOutcome: "operator-allowed",
      expectedStatus: 201
    }
  ],
  writeFailureVisibility: {
    expectedStatus: 500,
    expectedErrorCode: "SNS_POST_WRITE_FAILED",
    surfaceFields: ["errorCode", "message", "retryable"]
  },
  failClosedErrors: {
    errorCodes: ["SNS_POST_FORBIDDEN", "SNS_AUTH_CONTEXT_MISSING", "SNS_ACTOR_MISMATCH", "SNS_WRITE_DISABLED"],
    completionFields: ["errorCode", "retryable", "readbackState", "completionSignal", "fallbackPolicy"]
  }
};

function validatePermissionMapping(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { permissionMatrix } = snsAuthErrorContractSpec;

  if (permissionMatrix.length === 0) {
    issues.push({ scope: "permission-mapping", message: "permissionMatrix must not be empty" });
  }

  const roles = permissionMatrix.map((entry) => entry.role);
  const duplicateRoles = findDuplicates(roles);

  if (duplicateRoles.length > 0) {
    issues.push({
      scope: "permission-mapping",
      message: `permissionMatrix contains duplicate roles: ${duplicateRoles.join(", ")}`
    });
  }

  for (const requiredRole of ["guest", "member", "operator"] as const) {
    if (!roles.includes(requiredRole)) {
      issues.push({
        scope: "permission-mapping",
        message: `permissionMatrix must include ${requiredRole}`
      });
    }
  }

  for (const entry of permissionMatrix) {
    if (!entry.expectedOutcome.trim()) {
      issues.push({
        scope: `permission-mapping:${entry.role}`,
        message: "expectedOutcome must not be empty"
      });
    }

    if (entry.canSubmitPost && entry.expectedStatus < 200) {
      issues.push({
        scope: `permission-mapping:${entry.role}`,
        message: "allowed submit roles must keep a success-class expectedStatus"
      });
    }
  }

  const guestEntry = permissionMatrix.find((entry) => entry.role === "guest");

  if (guestEntry?.canSubmitPost) {
    issues.push({
      scope: "permission-mapping:guest",
      message: "guest must remain blocked from post submission"
    });
  }

  if (guestEntry && guestEntry.expectedStatus !== 403) {
    issues.push({
      scope: "permission-mapping:guest",
      message: "guest blocked path must keep 403 as the service-side rejection status"
    });
  }

  return {
    label: "Guest/member/operator permission mapping",
    issues
  };
}

function validateWriteFailureVisibility(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { expectedStatus, expectedErrorCode, surfaceFields } = snsAuthErrorContractSpec.writeFailureVisibility;

  if (expectedStatus < 400) {
    issues.push({
      scope: "write-failure-visibility",
      message: "expectedStatus must be a client or server error status"
    });
  }

  if (!expectedErrorCode.trim()) {
    issues.push({
      scope: "write-failure-visibility",
      message: "expectedErrorCode must not be empty"
    });
  }

  if (surfaceFields.length === 0) {
    issues.push({
      scope: "write-failure-visibility",
      message: "surfaceFields must not be empty"
    });
  }

  const duplicateSurfaceFields = findDuplicates(surfaceFields);

  if (duplicateSurfaceFields.length > 0) {
    issues.push({
      scope: "write-failure-visibility",
      message: `surfaceFields contains duplicates: ${duplicateSurfaceFields.join(", ")}`
    });
  }

  for (const requiredField of ["errorCode", "message"] as const) {
    if (!surfaceFields.includes(requiredField)) {
      issues.push({
        scope: "write-failure-visibility",
        message: `surfaceFields must include ${requiredField}`
      });
    }
  }

  return {
    label: "Write failure error visibility",
    issues
  };
}

function validateFailClosedErrorContract(): ContractCheckResult {
  const issues: ContractIssue[] = [];
  const { errorCodes, completionFields } = snsAuthErrorContractSpec.failClosedErrors;

  if (errorCodes.length === 0) {
    issues.push({
      scope: "fail-closed-errors",
      message: "errorCodes must not be empty"
    });
  }

  const duplicateErrorCodes = findDuplicates(errorCodes);

  if (duplicateErrorCodes.length > 0) {
    issues.push({
      scope: "fail-closed-errors",
      message: `errorCodes contains duplicates: ${duplicateErrorCodes.join(", ")}`
    });
  }

  for (const requiredErrorCode of [
    "SNS_POST_FORBIDDEN",
    "SNS_AUTH_CONTEXT_MISSING",
    "SNS_ACTOR_MISMATCH",
    "SNS_WRITE_DISABLED"
  ] as const) {
    if (!errorCodes.includes(requiredErrorCode)) {
      issues.push({
        scope: "fail-closed-errors",
        message: `errorCodes must include ${requiredErrorCode}`
      });
    }
  }

  const duplicateCompletionFields = findDuplicates(completionFields);

  if (duplicateCompletionFields.length > 0) {
    issues.push({
      scope: "fail-closed-errors",
      message: `completionFields contains duplicates: ${duplicateCompletionFields.join(", ")}`
    });
  }

  for (const requiredField of ["errorCode", "completionSignal", "fallbackPolicy"] as const) {
    if (!completionFields.includes(requiredField)) {
      issues.push({
        scope: "fail-closed-errors",
        message: `completionFields must include ${requiredField}`
      });
    }
  }

  return {
    label: "Fail-closed auth and completion visibility",
    issues
  };
}

export function validateSnsAuthErrorContract(): ContractIssue[] {
  return [validatePermissionMapping(), validateWriteFailureVisibility(), validateFailClosedErrorContract()].flatMap(
    (result) => result.issues
  );
}

export function buildSnsAuthErrorContractReport(): string {
  const checkResults = [validatePermissionMapping(), validateWriteFailureVisibility(), validateFailClosedErrorContract()];
  const allIssues = checkResults.flatMap((result) => result.issues);
  const lines = ["SNS auth-error contract baseline", "- Command: validate-sns-auth-error-contract"];

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