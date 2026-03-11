export type ContractIssue = {
  scope: string;
  message: string;
};

export type ContractCheckResult = {
  label: string;
  issues: ContractIssue[];
};

export function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  return Array.from(duplicates);
}