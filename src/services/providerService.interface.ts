import { BankAccount, Transaction, TransactionalAccount } from '../models';

export interface IProviderService {
  /** Create an access token to provider */
  createAccessToken: (connectionId?: string) => Promise<string>;

  /** Fetch new connection accounts and transactions */
  fetchConnection: (
    connectionId: string,
    createBankAccountCallback: (account: BankAccount) => Promise<void>,
    createTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Fetch connection and new transactions in order to update wallet and create transactions */
  syncConnection: (
    connectionId: string,
    lastUpdateDate: Date,
    shouldUpdate: boolean,
    updateBankAccountsCallback: (account: BankAccount) => Promise<void>,
    updateTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => Promise<void>;

  /** Delete connection from provider */
  deleteConnection: (connectionId: string) => Promise<void>;
}
