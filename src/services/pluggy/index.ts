import { Transaction, Wallet, WalletTypeList } from '../../models';
import { IProviderService } from '../providerService.interface';
import { PluggyClient } from './client';
import { Account, Item, PageResponse, Transaction as PluggyTransaction } from './types';

export * from './client';
export * from './types';

const DEFAULT_PAGE_SIZE = 100;

export class PluggyService implements IProviderService {
  constructor(private client: PluggyClient) {}

  createAccessToken = async (connectionId?: string) => {
    const { accessToken } = await this.client.createConnectToken(connectionId);
    return accessToken;
  };

  fetchConnection = async (
    connectionId: string,
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    await createWalletsCallback(accounts.map((account) => this.buildNewWallet(item, account)));

    await Promise.all(
      accounts.map(({ id: accountId }) =>
        this.fetchAndCreateTransactions(accountId, createTransactionsCallback),
      ),
    );
  };

  syncConnection = async (
    connectionId: string,
    lastUpdateDate: Date,
    shouldUpdate: boolean,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    if (shouldUpdate) {
      await this.client.updateItem(connectionId);
    }

    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    await updateWalletsCallback(accounts.map((account) => this.buildUpdateWallet(item, account)));

    await Promise.all(
      accounts.map(({ id: accountId }) =>
        this.fetchAndCreateTransactions(accountId, createTransactionsCallback, lastUpdateDate),
      ),
    );
  };

  deleteConnection = async (connectionId: string) => {
    await this.client.deleteItem(connectionId);
  };

  private fetchItemAndAccounts = async (connectionId: string) => {
    const [item, accounts] = await Promise.all([
      this.client.fetchItem(connectionId),
      this.client.fetchAccounts(connectionId),
    ]);

    const filteredAccounts = accounts.results.filter((account) =>
      //@ts-expect-error WalletTypeList is a string list
      WalletTypeList.includes(account.subtype),
    );

    return [item, filteredAccounts] as [Item, Account[]];
  };

  private fetchAndCreateTransactions = async (
    accountId: string,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
    startDate?: Date,
  ) => {
    let transactions: PageResponse<PluggyTransaction>;
    let page = 1;

    do {
      transactions = await this.client.fetchTransactions(accountId, {
        pageSize: DEFAULT_PAGE_SIZE,
        page,
        from: startDate?.toISOString(),
      });

      await createTransactionsCallback(
        transactions.results
          .filter(
            (transaction) => startDate === undefined || new Date(transaction.date) > startDate,
          )
          .map((transaction) => this.buildTransaction(transaction, accountId)),
      );

      page++;
    } while (transactions.results.length !== 0);
  };

  private buildNewWallet = (item: Item, account: Account) =>
    ({
      id: account.id,
      name: item.connector.name,
      type: account.subtype,
      balance: account.balance,
      initialBalance: account.balance,
      createdAt: new Date(item.createdAt),
      styles: {
        imageUrl: item.connector.imageUrl,
        primaryColor: '#' + item.connector.primaryColor,
      },
      connection: {
        id: item.id,
        status: item.status,
        provider: 'PLUGGY',
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : new Date(),
      },
    } as Wallet);

  private buildUpdateWallet = (item: Item, account: Account) =>
    ({
      id: account.id,
      balance: account.balance,
      connection: {
        id: item.id,
        status: item.status,
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : new Date(),
      },
    } as Wallet);

  private buildTransaction = (transaction: PluggyTransaction, accountId: string) =>
    ({
      id: transaction.id,
      description: transaction.description,
      date: new Date(transaction.date),
      amount: Math.abs(transaction.amount),
      type: transaction.type === 'CREDIT' ? 'INCOME' : 'EXPENSE',
      walletId: accountId,
    } as Transaction);
}
