import { RawTransaction } from "../types.ts";

export function sort(load: RawTransaction[]) {
  // sort by date
  return load.sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split("/").map((item) =>
      parseInt(item)
    );
    const aDate = new Date(aYear, aMonth - 1, aDay);
    const [bDay, bMonth, bYear] = b.date.split("/").map((item) =>
      parseInt(item)
    );
    const bDate = new Date(bYear, bMonth - 1, bDay);
    return aDate.getTime() - bDate.getTime();
  });
}
