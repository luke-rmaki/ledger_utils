export async function output(data: string[]) {
  const { writeTextFile } = Deno;

  try {
    await writeTextFile(
      Deno.env.get("JOURNAL") || "",
      `\n\n${data.join("\n")}`,
      {
        append: true,
      },
    );
  } catch (error) {
    console.log(`Error writing output ${error}`);
  }
}
