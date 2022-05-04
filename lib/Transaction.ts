import { CommonTransaction } from "../types.ts";
import { FileManager } from "./FileManager.ts";

export class Transaction {
  // raw data
  date: string;
  description: string;
  credit: string;
  debit: string;
  balance: string;
  sourceAccount: string;

  // output
  output: string;
  assetLine: string;
  expenseLine: string;
  headerLine: string;

  fileManager: FileManager;

  constructor(
    rawTransaction: string,
    sourceAccount: string,
    fileManager: FileManager,
  ) {
    this.fileManager = fileManager;

    // Split line by comma
    const rawArray = rawTransaction.split(",");
    // Create object from array
    this.date = rawArray[0];
    this.description = rawArray[1];
    this.credit = rawArray[2];
    this.debit = rawArray[3];
    this.balance = rawArray[4];
    this.sourceAccount = sourceAccount;
    // Format output items
    this.assetLine = this.formatAssetLine();
    this.expenseLine = this.formatExpenseLine();
    this.headerLine = this.formatHeaderLine();
    this.output = "";
  }

  /**
   * if debit doesn't exists use the credit
   * @returns {string}
   */
  formatAssetLine(): string {
    return `${this.sourceAccount}       $${
      this.debit?.length === 0 ? this.credit : this.debit
    }`;
  }

  /**
   * @returns {string}
   */
  formatHeaderLine(): string {
    return `${this.formatDate(this.date)} Payee`;
  }

  /**
   * @returns {string}
   */
  formatExpenseLine(): string {
    if (this.debit?.length === 0) {
      return `Income:          $-${this.credit}`;
    } else {
      return `Expenses:          $${Math.abs(parseFloat(this.debit))}`;
    }
  }

  formatDate(date: string) {
    return date.split("/").reverse().join("/");
  }

  // check if transaction is in common file
  async checkCommon() {
    const getCommon = await this.fileManager.getCommon();
    const { success, body } = getCommon;
    if (!success) return; // common file doesn't exist
    body?.commonTransactions.forEach((commonTransaction: CommonTransaction) => {
      const { name, match, dest } = commonTransaction;
      const regex = new RegExp(match, "gmi");
      if (regex.test(this.description)) {
        this.headerLine = `${this.formatDate(this.date)} ${name}`;
        this.expenseLine = `${dest}      $${
          this.debit?.length === 0
            ? `-${this.credit}`
            : `${Math.abs(parseFloat(this.debit))}`
        }`;
      }
    });
  }

  getOutput() {
    if (this.description === "Description" || this.description === undefined) {
      return "";
    }
    this.output = `${this.headerLine}
    ${this.assetLine}
    ${this.expenseLine}
    `;
    return this.output;
  }
}
