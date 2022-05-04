import "https://deno.land/x/dotenv/load.ts";
import { LedgerUtils } from "./lib/LedgerUtils.ts";

function main() {
  console.clear();
  const ledgerUtils = new LedgerUtils();

  // get the csv data
  // const csv = await loadCSV();
  // const json = csvToJson(csv);
  // if (!json) {
  //   console.log("No data found");
  //   return;
  // }
  // const sorted = sort(json as RawTransaction[]);
  // const formatted = await format(sorted);

  // await output(formatted);
}

main();
