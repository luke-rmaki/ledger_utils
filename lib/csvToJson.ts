export function csvToJson(csv: string) {
  // Split string by new line
  const split = csv.split("\n");
  // Format array of lines into an array of arrays where each array is a transaction
  const formattedList = split.map((item) => item.split(","));
  // Format subarray into object
  const json = formattedList.map((item) => ({
    date: item[0],
    description: item[1],
    credit: item[2],
    debit: item[3],
    balance: item[4],
  }));
  // remove first item
  const items = [, ...json];
  // filter out stuff
  return items.filter((item) =>
    item !== undefined && item?.date !== "Date" && item?.date !== ""
  );
}
