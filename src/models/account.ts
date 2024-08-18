import { SvgKey } from '../utils/svg';
import { NewConnection } from './connection';
import Provider from './provider';
import { Wallet } from './wallet';

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

export type NewAccount = {
  id: string;
  name: string;
  logoSvg: SvgKey;
  primaryColor: string;
  createdAt: Date;
  connection?: NewConnection;
  wallets: Wallet[];
};
