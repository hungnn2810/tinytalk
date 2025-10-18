export function parseQuery<T extends Record<string, any>>(
  query: any,
  defaults: Partial<T> = {}
): T {
  const result: any = { ...defaults };
  for (const key in query) {
    const value = query[key];
    if (value === undefined || value === null || value === "") continue;

    if (!isNaN(value)) result[key] = Number(value);
    else result[key] = value.toString();
  }
  return result as T;
}
