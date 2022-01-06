import { parse } from "https://deno.land/std@0.82.0/encoding/yaml.ts";
import { join } from "https://deno.land/std@0.105.0/path/mod.ts";
import { ParsedTransaction, RawTransaction, CommonTransaction } from "../types.ts";
import { formatDate } from "./formatDate.ts";

export async function parseTransaction(
  transaction: RawTransaction,
  source: string,
): Promise<ParsedTransaction> {
  // read common.yaml
  const __dirname = new URL(".", import.meta.url).pathname;
  const path = join(__dirname, "../common.yaml");
  const common = parse(await Deno.readTextFile(path)) as {commonTransactions: CommonTransaction[]};
  let assetLine: string;

  // create assetLine from passed account name. Defaults to everyday
  switch (source) {
    case "everyday":
      assetLine = `Assets:Bank:Checking:Everyday`;
      break;

    case "splurge":
      assetLine = `Assets:Bank:Checking:Splurge`;
      break;

    case "house":
      assetLine = `Assets:Bank:Savings:House&Car`;
      break;

    case "work":
      assetLine = `Assets:Bank:Checking:WorkAccount`;
      break;
    default:
      assetLine = `Assets:Bank:Checking:Everyday`;
      break;
  }

  // Add asset line amount
  assetLine = `${assetLine}       $${transaction.debit.length === 0 ? transaction.credit : transaction.debit}`;

  // set defaults
  let header = `${formatDate(transaction.date)} Payee`;
  let expenseLine = `Expenses:        $${transaction.debit.length === 0 ? `-${transaction.credit}` : `${Math.abs(parseFloat(transaction.debit))}`}`

  // See if any common transactions match
  common.commonTransactions.forEach((commonTransaction: CommonTransaction) => {
    const {name, match, dest} = commonTransaction;
    const regex = new RegExp(match, 'gmi');
    if (regex.test(transaction.description)) {
      header = `${formatDate(transaction.date)} ${name}`;
      expenseLine = `${dest}      $${transaction.debit.length === 0 ? `-${transaction.credit}` : `${Math.abs(parseFloat(transaction.debit))}`}`;
    }
  });

  return {
    header,
    assetLine,
    expenseLine,
  };
}
