import { Confirm, ensureDir, explorer, homeDir, parse } from "../deps.ts";
import { CommonTransaction, Return } from "../types.ts";
import { outputMessage } from "./utils.ts";

export class FileManager {
  journalPath: string;
  csv: string;
  home: string;

  constructor() {
    this.journalPath = "";
    const { success: isConfig, body: config } = this.getConfig();
    if (isConfig) {
      this.journalPath = config.journalPath;
    }
    this.csv = "";
    this.home = homeDir() || "";
  }

  /**
   * Create config dir and file. Prompt user for journal path, and if to create a common.yaml file
   */
  async createConfig() {
    // Get path to config
    const path = `${homeDir()}/.stl/config.json`;

    outputMessage(`Creating config file at ${path}`);
    await Confirm.prompt({ message: "Press enter to continue", default: true });

    // Create .stl dir if not exists
    await ensureDir(`${homeDir()}/.stl`);
    await Deno.writeTextFile(path, "", { create: true });

    // Prompt user for journal path
    await Confirm.prompt({
      message: "Select the path to your Ledger journal",
      default: true,
    });
    const journalPath = await explorer(true) as string;

    // Prompt if to create a common.yaml file and populate with instructions
    const isCommonFile = await Confirm.prompt(
      "Do you want to create a common transaction file?",
    );
    if (isCommonFile) {
      await Deno.writeTextFile(
        `${homeDir()}/.stl/common.yaml`,
        `commonTransactions:
  - name: "Transaction name"
    match: "String to match in bank statement description"
    dest: "The account the transaction is made to"
      `,
      );
      outputMessage(`${homeDir()}/.stl/common.yaml created`);
    }

    // Save config
    await Deno.writeTextFile(
      path,
      JSON.stringify({ journalPath, commonFile: true }),
    );
  }

  /**
   * Prompt user to select statement csv
   */
  async loadCSV() {
    const { readTextFile } = Deno;
    console.log("Loading statement....");
    // prompt user to select file
    const choice = await explorer() as string;
    // read the file
    this.csv = await readTextFile(choice);
  }

  /**
   * Get config object from file
   * @returns {Promise<Return>}
   */
  getConfig(): Return {
    try {
      return {
        body: JSON.parse(
          Deno.readTextFileSync(`${homeDir()}/.stl/config.json`),
        ),
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        body: error.message,
      };
    }
  }

  /**
   * Get common.yaml and returns as json
   * @returns {Promise<Return>}
   */
  async getCommon(): Promise<Return> {
    try {
      return {
        body: parse(
          await Deno.readTextFile(`${this.home}/.stl/common.yaml`),
        ) as {
          commonTransactions: CommonTransaction[];
        },
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        body: error.message,
      };
    }
  }

  async outputToJournal(output: string[], overwrite = false): Promise<Return> {
    const { writeTextFile } = Deno;
    const { journalPath } = this;
    try {
      if (overwrite) {
        await writeTextFile(journalPath, output.join("\n\n\n"));
      } else {
        await writeTextFile(journalPath, output.join("\n\n\n"), {
          append: true,
        });
      }
      return {
        body: overwrite ? "Sorted journal" : "Successfully wrote to journal",
        success: true,
      };
    } catch (error) {
      return {
        body: error.message,
        success: false,
      };
    }
  }
}
