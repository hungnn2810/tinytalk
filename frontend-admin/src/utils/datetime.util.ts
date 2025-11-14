import { format, parse } from "date-fns";

export function formatDate(date: string | Date, formatStr: string): string {
  let parsedDate: Date;

  if (typeof date === "string") {
    parsedDate = parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date()); // parse ISO string
  } else {
    parsedDate = date;
  }

  return format(parsedDate, formatStr);
}
