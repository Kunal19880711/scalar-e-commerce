export function camelCaseToSpaceCase(s: string): string {
  return s.replace(/([A-Z])/g, " $1").trim();
}

export function isInEnumList<T extends Object>(
  val: string,
  list: T[]
): boolean {
  return list.map((item) => item.toString()).includes(val);
}
