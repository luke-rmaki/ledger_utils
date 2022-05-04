# LEDGER TOOLS

Some basic utilities to work with a ledger compatable journal file.

```bash
$ ./ledger_utils
```

## Features:

- Import bank statement to journal
- Sort journal by date
- Automatically assign common transactions

_**NOTE: This is a WIP, so make a copy of journal file just in case**_

<br />

### Import bank statement

Takes in a bank statement in CSV format and converts to
[ledger-cli](https://www.ledger-cli.org/) readable format and inserts into
journal.

The parser expects a CSV formatted as follows:

> Date | Description | Credit | Debit | Balance |

with Date formatted as "DD/MM/YYYY", and credit, debit, and balance as a
floating point number with no currency symbol.

This option will prompt for a source account (the bank account the transactions
relates to)

<br />
<br />

### Common transactions

When running the program for the first time you can choose to create a
common.yaml file to enable parsing common/frequent transactions.

The file is created in the same directory as the config.json file:

- Unix: ~/.stl
- Windows: C:/users/User/.stl

E.g

```yaml
- name: "Netflix Subscription"
  match: "netflix"
  dest: "Expenses:Subscriptions:Netflix"
```

would match a transaction with a description containing the word "netflix" (case
insensitive) and output the following (assume the date is 2022/05/04, the source
account provided is Assets:Bank:Checking:Everyday, and the amount on the
statement is $16):

```
2022/05/04   Netflix Subscription
  Assets:Bank:Checking:Everyday     $-16.00
  Expenses:Subscriptions:Netflix     $16.00
```

<br />

---

<br />

## TODO

- [ ] Make a copy of the ledger file before running if needing to revert
- [ ] Allow user to change journal path programmatically
- [ ] Flag duplicate transactions (ID by date, amount, and account)
- [ ] Add common transactions via CLI
