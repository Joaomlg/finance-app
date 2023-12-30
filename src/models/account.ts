export type AccountType = 'BANK' | 'CREDIT';

export type AccountSubtype = 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'CREDIT_CARD';

export type Account = {
  id: string;
  type: AccountType;
  subtype: AccountSubtype;
  balance: number;
  connectionId: string;
};
