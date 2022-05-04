import { Input, Select } from "../deps.ts";
import { Return } from "../types.ts";
import { FileManager } from "./FileManager.ts";
import { Transaction } from "./Transaction.ts";
import { createDate, outputError, outputMessage } from "./utils.ts";

export class LedgerUtils {
  fileManager: FileManager;
  sourceAccount: string;

  /**
   * Run config set up or get config path
   */
  constructor() {
    this.fileManager = new FileManager();
    this.sourceAccount = "";

    // check and create config file
    const { success: isConfig } = this.fileManager.getConfig();
    if (!isConfig) {
      // create config
      this.fileManager.createConfig().then(() => {
        this.startCLI();
      });
    } else {
      this.startCLI();
    }
  }

  /**
   * Start prompt and run selection
   */
  async startCLI() {
    const selection = await this.choice();
    switch (selection) {
      case "Import statement":
        // Prompt for source account
        this.sourceAccount = await this.promptAccount();
        await this.statementToLedger();

        break;

      case "Sort journal":
        await this.sortJournal();
        break;

      case "Show journal path":
        outputMessage(this.fileManager.journalPath || "");
        break;

      default:
        break;
    }
  }

  parseArgs(): Return {
    const arg = Deno.args[0];
    if (arg && arg !== "") {
      return {
        body: arg,
        success: true,
      };
    } else {
      return {
        body: "Please provide a source account as an argument",
        success: false,
      };
    }
  }

  async promptAccount() {
    return await Input.prompt({
      message: "Enter an account for these transactions",
      minLength: 1,
    });
  }

  /**
   * Display choice
   */
  async choice() {
    const selection = await Select.prompt({
      message: "Select an option",
      options: [
        "Import statement",
        "Sort journal",
        "Show journal path",
        "Exit",
      ],
    });
    return selection;
  }

  async statementToLedger() {
    await this.fileManager.loadCSV();
    const load = this.fileManager.csv;
    // Split string by new line
    const split = load.split("\n");
    // Sort by date ascending
    const sorted = this.sortRawTransactions(split);
    // Load transactions
    const transactionPromiseArray = sorted.map(async (rawTransaction) => {
      const transaction = new Transaction(
        rawTransaction,
        this.sourceAccount,
        this.fileManager,
      );
      await transaction.checkCommon();
      return transaction.getOutput();
    });

    const transactions = await Promise.all(transactionPromiseArray);

    // write transactions to ledger
    const { success, body } = await this.fileManager.outputToJournal(
      transactions,
    );

    if (success) {
      outputMessage(body);
      outputMessage("Sorting journal...");
      await this.sortJournal();
    } else {
      outputError(body);
    }
  }

  sortRawTransactions(unsorted: string[]) {
    const sorted = unsorted.sort((a, b) => {
      const aDateStr = a.split(",")[0];
      const bDateStr = b.split(",")[0];
      const aDate = createDate(aDateStr);
      const bDate = createDate(bDateStr);
      return aDate.getTime() - bDate.getTime();
    });
    return sorted;
  }

  async sortJournal() {
    const { readTextFile } = Deno;
    const journal = await readTextFile(this.fileManager.journalPath);
    const raw = journal.split(/[\r\n]{2,}/);
    const sorted = raw.sort((a, b) => {
      const aDateStr = a.split(" ")[0];
      const bDateStr = b.split(" ")[0];
      const aDate = createDate(aDateStr || "", true);
      const bDate = createDate(bDateStr || "", true);
      return aDate.getTime() - bDate.getTime();
    });
    // write sorted to ledger
    const { success, body } = await this.fileManager.outputToJournal(
      sorted,
      true,
    );

    if (success) {
      outputMessage(body);
    } else {
      outputError(body);
    }
  }
}
