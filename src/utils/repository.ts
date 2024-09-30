const USE_PRODUCTION_DATA = process.env.DATA_SOURCE === 'production';

export const getRepositoryName = (baseName: string) => {
  return __DEV__ && !USE_PRODUCTION_DATA ? '__dev_' + baseName : baseName;
};
