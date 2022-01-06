import { join } from "https://deno.land/std@0.105.0/path/mod.ts";

export async function loadCSV(): Promise<string> {
  console.log("Loading statement....");
  const { readTextFile } = Deno;
  const __dirname = new URL(".", import.meta.url).pathname;
  const path = join(__dirname, "../load/Transactions.csv");
  const csv = await readTextFile(path);
  return csv;
}
