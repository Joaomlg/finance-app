// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cloneObject = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};
