// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cloneObject = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export const flattenObject = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  parentKey: string = '',
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  result: Record<string, any> = {},
) => {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key]) &&
      !(obj[key] instanceof Date)
    ) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
};
