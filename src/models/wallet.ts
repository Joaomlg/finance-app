import { Connection } from './connection';

export const WalletTypeList = ['SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT'] as const; // CREDIT_CARD

export type WalletType = typeof WalletTypeList[number];

export type WalletStyles = {
  imageUrl: string;
  primaryColor: string;
};

export type Wallet = {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  type: WalletType;
  styles: WalletStyles;
  createdAt: Date;
  institutionId?: number;
  connection?: Connection;
};
