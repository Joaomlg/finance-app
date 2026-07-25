import { Wallet, WalletGroup } from '../../models';

export type WalletGroupItem = {
  group: WalletGroup;
  wallets: Wallet[];
};
