export const getRepositoryName = (baseName: string) => {
  return __DEV__ ? '__dev_' + baseName : baseName;
};
