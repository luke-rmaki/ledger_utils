import { loadCSV } from "./lib/loadCSV.ts";
import { csvToJson } from "./lib/csvToJson.ts";
import { format } from "./lib/format.ts";
import { output } from "./lib/output.ts";
import { sort } from "./lib/sort.ts";
import { RawTransaction } from "./types.ts";
import "https://deno.land/x/dotenv/load.ts";

async function main() {
  console.clear();
  // get the csv data
  const csv = await loadCSV();
  const json = csvToJson(csv);
  if (!json) {
    console.log("No data found");
    return;
  }
  const sorted = sort(json as RawTransaction[]);
  const formatted = await format(sorted);

  await output(formatted);
}

main();
