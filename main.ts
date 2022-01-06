import { loadCSV } from "./utils/loadCSV.ts";
import { csvToJson } from "./utils/csvToJson.ts";
import { format } from "./utils/format.ts";
import { output } from "./utils/output.ts";

async function main() {
  console.clear();
  const csv = await loadCSV();
  const json = csvToJson(csv);
  const formatted = await format(json);
  await output(formatted)
}

main();
