export type RawTransaction = {
  date: string;
  description: string;
  credit: string;
  debit: string;
  balance: string;
};

export type ParsedTransaction = {
  header: string;
  assetLine: string;
  expenseLine: string;
};

export type CommonTransaction = {
  name: string;
  match: string;
  dest: string;
};

export type Return = {
  success: boolean;
  // deno-lint-ignore no-explicit-any
  body?: any | string;
};
