import { Account, Connection, Investment, Transaction } from '../models';

export interface IProviderService {
  createAccessToken: (connectionId?: string) => Promise<string>;

  fetchConnectionById: (connectionId: string) => Promise<Connection>;
  deleteConnectionById: (connectionId: string) => Promise<void>;
  updateConnectionById: (connectionId: string, lastUpdateDate: string) => Promise<Connection>;

  fetchAccounts: (connection: Connection) => Promise<Account[]>;

  fetchInvestments: (connection: Connection) => Promise<Investment[]>;

  fetchTransactions: (
    account: Account,
    filters: { from: string; to: string },
  ) => Promise<Transaction[]>;
}
