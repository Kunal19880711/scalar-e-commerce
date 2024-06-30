export type MaybeMandatory = {
  required?: boolean;
};

export interface hasMandatoryPaths {
  [key: string]: MaybeMandatory;
}

export function getMandatoryPaths(obj: hasMandatoryPaths): string[] {
  return Object.keys(obj).filter((key) => obj[key].required);
}
