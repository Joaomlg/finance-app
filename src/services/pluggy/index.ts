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

  fetchConnection = async (connectionId: string) => {
    const item = await this.client.fetchItem(connectionId);
    return this.itemToConnector(item);
  };

  updateConnection = async (connectionId: string) => {
    const item = await this.client.updateItem(connectionId);
    return this.itemToConnector(item);
  };

  deleteConnection = async (connectionId: string) => {
    await this.client.deleteItem(connectionId);
  };

  fetchAccounts = async (connectionId: string) => {
    const accounts = await this.client.fetchAccounts(connectionId);
    return accounts.results.map(
      (account) =>
        ({
          id: account.id,
          type: account.type,
          subtype: account.subtype,
          balance: account.balance,
          connectionId,
        } as Account),
    );
  };

  fetchInvestments = async (connectionId: string) => {
    const investments = await this.client.fetchInvestments(connectionId);
    return investments.results.map(
      (investment) =>
        ({
          id: investment.id,
          balance: investment.balance,
        } as Investment),
    );
  };

  fetchTransactions = async (accountId: string, filters: { from: string; to: string }) => {
    const transactions = await this.client.fetchTransactions(accountId, {
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
          accountId,
        } as Transaction),
    );
  };

  private itemToConnector = async (item: Item) => {
    return {
      id: item.id,
      connector: item.connector,
      status: item.status,
      createdAt: item.createdAt,
      lastUpdatedAt: item.lastUpdatedAt,
      provider: 'PLUGGY',
    } as Connection;
  };
}
