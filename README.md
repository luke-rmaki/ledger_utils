# BANK STATEMENT TO LEDGER

Takes in a bank statement in CSV format and converts to
[ledger-cli](https://www.ledger-cli.org/) readable format and inserts into
journal.

```bash
$ deno run --allow-read --allow-env --unstable --allow-write main.ts "account:name"
```

where account name is the name of the account the bank statement relates to

## CSV Statement Headers

The parser expects a CSV formatted as follows:

> Date | Description | Credit | Debit | Balance |

with Date formatted as "DD/MM/YYYY", and credit, debit, and balance as a
floating point number with no currency symbol.

## Config

Create a .env file at the project root directory with the following values:

```
COMMON="path to your common.yaml file (optional)"
JOURNAL="path to your ledger journal (required)"
```

## Common.yaml

You can optionally provide a common.yaml file in the .env file that list common
transactions to autocomplete. The yaml file must be formatted as follows:

```yaml
commonTransactions:
  - name: "Transaction name"
    match: "String to match in bank statement description"
    dest: "The account the transaction is made to"
```
