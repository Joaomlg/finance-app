export const getRepositoryName = (baseName: string) => {
  return __DEV__ ? baseName : baseName;
};
