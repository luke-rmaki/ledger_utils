import open from "https://deno.land/x/deno_explorer@v1.0.0/mod.ts";

export async function loadCSV(): Promise<string> {
  const { readTextFile } = Deno;
  console.log("Loading statement....");
  // prompt user to select file
  const choice = await open() as string;
  // read the file
  const csv = await readTextFile(choice);
  return csv;
}
