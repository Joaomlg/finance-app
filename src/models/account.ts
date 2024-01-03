import Provider from './provider';

export type AccountType = 'BANK' | 'CREDIT';

export type AccountSubType = 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'CREDIT_CARD';

export type Account = {
  id: string;
  type: AccountType;
  subtype: AccountSubType;
  balance: number;
  connectionId: string;
  provider: Provider;
};
