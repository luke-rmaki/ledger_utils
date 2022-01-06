export function csvToJson(csv: string) {
  const split = csv.split("\n");
  const formattedList = split.map((item) => item.split(","));
  const json = formattedList.map((item) => ({
    date: item[0],
    description: item[1],
    credit: item[2],
    debit: item[3],
    balance: item[4],
  }));
  return json;
}
