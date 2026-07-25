import Provider from './provider';

export type WalletGroupType = 'AUTOMATIC' | 'MANUAL';

export type WalletGroupStatus =
  | 'UPDATED'
  | 'UPDATING'
  | 'LOGIN_ERROR'
  | 'WAITING_USER_INPUT'
  | 'OUTDATED';

export type WalletGroupStyles = {
  imageUrl: string;
  primaryColor: string;
};

type BaseWalletGroup = {
  id: string;
  name: string;
  styles: WalletGroupStyles;
  institutionId?: number;
  createdAt: Date;
};

export type AutomaticWalletGroup = BaseWalletGroup & {
  type: 'AUTOMATIC';
  provider: Provider;
  status: WalletGroupStatus;
  lastUpdatedAt: Date;
  updateDisabled: boolean;
  investmentAmount?: number;
};

export type ManualWalletGroup = BaseWalletGroup & {
  type: 'MANUAL';
};

export type WalletGroup = AutomaticWalletGroup | ManualWalletGroup;
