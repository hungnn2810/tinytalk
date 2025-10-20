import { DateTime } from "luxon";

export function toGmt7(
  utcDate: string | Date,
  formatString: string = "yyyy-MM-dd HH:mm:ss"
): string {
  const dt =
    typeof utcDate === "string"
      ? DateTime.fromISO(utcDate, { zone: "utc" })
      : DateTime.fromJSDate(utcDate, { zone: "utc" });

  const gmt7 = dt.setZone("Asia/Bangkok");

  return gmt7.toFormat(formatString);
}
