export async function output(data: string[]) {
  const { writeTextFile } = Deno;

  try {
    await writeTextFile("./output.txt", data.join("\n"));
  } catch (error) {
    console.log(`Error writing output ${error}`);
  }
}
