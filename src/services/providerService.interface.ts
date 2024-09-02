import { Transaction, Wallet } from '../models';

export interface IProviderService {
  /** Create an access token to provider */
  createAccessToken: (connectionId?: string) => Promise<string>;

  /** Fetch new connection wallets and transactions */
  fetchConnection: (
    connectionId: string,
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Fetch connection and new transactions in order to update wallet and create transactions */
  syncConnection: (
    connectionId: string,
    lastUpdateDate: Date,
    shouldUpdate: boolean,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Delete connection from provider */
  deleteConnection: (connectionId: string) => Promise<void>;
}
