import { SvgKey } from '../utils/svg';
import { NewConnection } from './connection';

export type WalletType = 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'CREDIT_CARD';

export type WalletStyles = {
  logoSvg: SvgKey;
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
  connection?: NewConnection;
};