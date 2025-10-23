import { format, parse } from "date-fns";
import * as tz from "date-fns-tz";

export function parseToZonedDate(
  date: string | Date,
  formatStr: string,
  timeZone: string = "Asia/Bangkok"
): string {
  let parsedDate: Date;

  if (typeof date === "string") {
    parsedDate = parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date()); // parse ISO string
  } else {
    parsedDate = date;
  }

  const zonedDate = tz.toZonedTime(parsedDate, timeZone);

  if (isNaN(zonedDate.getTime())) {
    return "Invalid date"; // hiển thị an toàn
  }

  return format(zonedDate, formatStr);
}
