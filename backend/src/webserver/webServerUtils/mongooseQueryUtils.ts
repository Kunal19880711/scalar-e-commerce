import { ExtraOptions } from "../types";

export function changeQueryForExtraOptions(
  query: any,
  extraOptions?: ExtraOptions
) {
  if (!extraOptions) {
    return query;
  }
  if (extraOptions.populate) {
    for (const keyPath of extraOptions.populate) {
      query = query.populate(keyPath);
    }
  }
  return query;
}
