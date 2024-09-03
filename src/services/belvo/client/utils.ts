export type Environment = 'sandbox' | 'development' | 'production';

const EnvironmentUrl: Record<Environment, string> = {
  sandbox: 'https://sandbox.belvo.com',
  development: 'https://development.belvo.com',
  production: 'https://api.belvo.com',
};

export const urlResolver = (environment: Environment) => {
  return EnvironmentUrl[environment];
};
