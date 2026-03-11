export type ContractIssue = {
  scope: string;
  message: string;
};

export type ContractCheckResult = {
  label: string;
  issues: ContractIssue[];
};

export function findDuplicates(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}