import { findDuplicates, type ContractCheckResult, type ContractIssue } from "./snsContractShared.ts";

type PermissionExpectation = {
  role: "guest" | "member" | "operator";
  canSubmitPost: boolean;
  expectedOutcome: string;
};

type WriteFailureVisibilitySpec = {
  expectedStatus: number;
  expectedErrorCode: string;
  surfaceFields: string[];
};

type AuthErrorContractSpec = {
  permissionMatrix: PermissionExpectation[];
  writeFailureVisibility: WriteFailureVisibilitySpec;
};

// This baseline validates the intended SNS failure contract shape only.
// It does not assert that the local demo surface performs a real HTTP request.
const snsAuthErrorContractSpec: AuthErrorContractSpec = {
  permissionMatrix: [
    {
      role: "guest",
      canSubmitPost: false,
      expectedOutcome: "guest-blocked"
    },
    {
      role: "member",
      canSubmitPost: true,
      expectedOutcome: "member-allowed"
    },
    {
      role: "operator",
      canSubmitPost: true,
      expectedOutcome: "operator-allowed"
    }
  ],
  writeFailureVisibility: {
    expectedStatus: 500,
    expectedErrorCode: "SNS_POST_WRITE_FAILED",
    surfaceFields: ["errorCode", "message", "retryable"]
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
  }

  const guestEntry = permissionMatrix.find((entry) => entry.role === "guest");

  if (guestEntry?.canSubmitPost) {
    issues.push({
      scope: "permission-mapping:guest",
      message: "guest must remain blocked from post submission"
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

export function validateSnsAuthErrorContract(): ContractIssue[] {
  return [validatePermissionMapping(), validateWriteFailureVisibility()].flatMap((result) => result.issues);
}

export function buildSnsAuthErrorContractReport(): string {
  const checkResults = [validatePermissionMapping(), validateWriteFailureVisibility()];
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