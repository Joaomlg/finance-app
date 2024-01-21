import { Account, Connection, Investment, Transaction } from '../../models';
import { IProviderService } from '../providerService.interface';
import { PluggyClient } from './client';
import { Item } from './types';

export * from './client';
export * from './types';

const DEFAULT_PAGE_SIZE = 500;

export class PluggyService implements IProviderService {
  constructor(private client: PluggyClient) {}

  createAccessToken = async (connectionId?: string) => {
    const { accessToken } = await this.client.createConnectToken(connectionId);
    return accessToken;
  };

  fetchConnectionById = async (connectionId: string) => {
    const item = await this.client.fetchItem(connectionId);
    return this.itemToConnection(item);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateConnectionById = async (connectionId: string, lastUpdateDate: string) => {
    const item = await this.client.updateItem(connectionId);
    return this.itemToConnection(item);
  };

  deleteConnectionById = async (connectionId: string) => {
    await this.client.deleteItem(connectionId);
  };

  fetchAccounts = async (connection: Connection) => {
    const accounts = await this.client.fetchAccounts(connection.id);
    return accounts.results.map(
      (account) =>
        ({
          id: account.id,
          type: account.type,
          subtype: account.subtype,
          balance: account.balance,
          connectionId: connection.id,
          provider: 'PLUGGY',
        } as Account),
    );
  };

  fetchInvestments = async (connection: Connection) => {
    const investments = await this.client.fetchInvestments(connection.id);
    return investments.results.map(
      (investment) =>
        ({
          id: investment.id,
          balance: investment.balance,
          provider: 'PLUGGY',
        } as Investment),
    );
  };

  fetchTransactions = async (account: Account, filters: { from: string; to: string }) => {
    const transactions = await this.client.fetchTransactions(account.id, {
      pageSize: DEFAULT_PAGE_SIZE,
      from: filters.from,
      to: filters.to,
    });
    return transactions.results.map(
      (transaction) =>
        ({
          id: transaction.id,
          description: transaction.description,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
          accountId: account.id,
          provider: 'PLUGGY',
        } as Transaction),
    );
  };

  private itemToConnection = (item: Item) => {
    return {
      id: item.id,
      connector: {
        name: item.connector.name,
        imageUrl: item.connector.imageUrl,
        primaryColor: item.connector.primaryColor,
      },
      status: item.status,
      createdAt: item.createdAt,
      lastUpdatedAt: item.lastUpdatedAt,
      provider: 'PLUGGY',
    } as Connection;
  };
}
