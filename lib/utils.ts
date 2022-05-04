import { colors } from "../deps.ts";

export function outputMessage(message: string) {
  console.log(colors.green(message));
}

export function outputError(message: string) {
  console.log(colors.bgRed.white(`ERROR:`));
  console.log(colors.red(message));
}

/**
 * @param dateStr string date as a string
 * @param reversed boolean true = "YYYY/MM/DD". False = "DD/MM/YYYY". Default = false
 * @returns date
 */
export function createDate(dateStr: string, reversed = false): Date {
  let date = dateStr;
  if (reversed) {
    date = dateStr.split("/").reverse().join("/");
  }
  const [day, month, year] = date.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
