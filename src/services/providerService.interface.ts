import { Account, Connection, Investment, Transaction } from '../models';

export interface IProviderService {
  createAccessToken: (connectionId?: string) => Promise<string>;

  fetchConnection: (connectionId: string) => Promise<Connection>;
  updateConnection: (connectionId: string) => Promise<Connection>;
  deleteConnection: (connectionId: string) => Promise<void>;

  fetchAccounts: (connectionId: string) => Promise<Account[]>;

  fetchInvestments: (connectionId: string) => Promise<Investment[]>;

  fetchTransactions: (
    accountId: string,
    filters: { from: string; to: string },
  ) => Promise<Transaction[]>;
}
