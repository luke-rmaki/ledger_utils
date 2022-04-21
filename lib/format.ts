import { RawTransaction } from "../types.ts";
import { parseTransaction } from "./parseTransaction.ts";

export async function format(json: RawTransaction[]) {
  const parsedTransactions = json.map(async (item: RawTransaction) => {
    const { header, assetLine, expenseLine } = await parseTransaction(
      item,
      Deno.args[0],
    );
    return `
${header}
  ${assetLine}
  ${expenseLine}

`;
  });

  return await Promise.all(parsedTransactions);
}
