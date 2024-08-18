export type WalletType = 'BANK' | 'CREDIT';

export type WalletSubType = 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'CREDIT_CARD';

export type Wallet = {
  id: string;
  type: WalletType;
  subtype: WalletSubType;
  initialBalance: number;
  balance: number;
};
