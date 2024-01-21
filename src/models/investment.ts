import Provider from './provider';

export type Investment = {
  id: string;
  balance: number;
  provider: Provider;
};
