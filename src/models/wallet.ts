export const WalletTypeList = ['SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT', 'CREDIT_CARD'] as const;

export type WalletType = typeof WalletTypeList[number];

export type Wallet = {
  id: string;
  balance: number;
  initialBalance: number;
  type: WalletType;
  walletGroupId: string;
};
