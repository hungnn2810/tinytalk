// Cách này an toàn với mọi môi trường
import { parse } from "date-fns";
import * as tz from "date-fns-tz";

export function parseToZonedDate(
  date: string | Date,
  formatStr: string,
  timeZone: string = "Asia/Bangkok"
): Date {
  const parsed =
    typeof date === "string" ? parse(date, formatStr, new Date()) : date;
  return tz.toZonedTime(parsed, timeZone);
}
