import { parse } from "https://deno.land/std@0.82.0/encoding/yaml.ts";
import {
  CommonTransaction,
  ParsedTransaction,
  RawTransaction,
} from "../types.ts";
import { formatDate } from "./formatDate.ts";

export async function parseTransaction(
  transaction: RawTransaction,
  source: string,
): Promise<ParsedTransaction> {
  // read common.yaml

  let common;
  try {
    common = parse(
      await Deno.readTextFile(Deno.env.get("COMMON") || ""),
    ) as {
      commonTransactions: CommonTransaction[];
    };
  } catch (_err) {
    console.log("");
  }

  // Add asset line amount
  const assetLine = `${source}       $${
    transaction.debit.length === 0 ? transaction.credit : transaction.debit
  }`;

  // set defaults
  let header = `${formatDate(transaction.date)} Payee`;
  let expenseLine = "";
  if (transaction.debit.length === 0) {
    expenseLine = `Income:          $-${transaction.credit}`;
  } else {
    expenseLine = `Expenses:          $${
      Math.abs(parseFloat(transaction.debit))
    }`;
  }

  // See if any common transactions match
  common?.commonTransactions.forEach((commonTransaction: CommonTransaction) => {
    const { name, match, dest } = commonTransaction;
    const regex = new RegExp(match, "gmi");
    if (regex.test(transaction.description)) {
      header = `${formatDate(transaction.date)} ${name}`;
      expenseLine = `${dest}      $${
        transaction.debit.length === 0
          ? `-${transaction.credit}`
          : `${Math.abs(parseFloat(transaction.debit))}`
      }`;
    }
  });

  return {
    header,
    assetLine,
    expenseLine,
  };
}
