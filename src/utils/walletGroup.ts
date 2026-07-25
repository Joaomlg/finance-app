import { Wallet, WalletGroup } from '../models';

export const getWalletGroup = (wallet: Wallet, walletGroups: WalletGroup[]) =>
  walletGroups.find((walletGroup) => walletGroup.id === wallet.walletGroupId);
