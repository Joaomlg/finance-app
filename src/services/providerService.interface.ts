import { Transaction, Wallet, WalletGroup } from '../models';
import { RecursivePartial } from '../utils/type';

export interface IProviderService {
  /** Create an access token to provider */
  createAccessToken: (connectionId?: string) => Promise<string>;

  /** Fetch new connection wallet group, wallets and transactions */
  fetchConnection: (
    connectionId: string,
    createWalletGroupCallback: (walletGroup: WalletGroup) => Promise<void>,
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Fetch connection and new transactions in order to update wallet group, wallets and create transactions */
  syncConnection: (
    connectionId: string,
    lastUpdateDate: Date,
    shouldUpdate: boolean,
    updateWalletGroupCallback: (values: RecursivePartial<WalletGroup>) => Promise<void>,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Delete connection from provider */
  deleteConnection: (connectionId: string) => Promise<void>;
}
