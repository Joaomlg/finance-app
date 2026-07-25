import {
  AutomaticWalletGroup,
  Transaction,
  Wallet,
  WalletGroup,
  WalletTypeList,
} from '../../models';
import { IProviderService } from '../providerService.interface';
import { RecursivePartial } from '../../utils/type';
import { PluggyClient } from './client';
import { Account, Item, PageResponse, Transaction as PluggyTransaction } from './types';

export * from './client';
export * from './types';

const DEFAULT_PAGE_SIZE = 100;

const CONNECTORS_WITHOUT_UPDATE = ['MeuPluggy'];

export class PluggyService implements IProviderService {
  constructor(private client: PluggyClient) {}

  createAccessToken = async (connectionId?: string) => {
    const { accessToken } = await this.client.createConnectToken(connectionId);
    return accessToken;
  };

  fetchConnection = async (
    connectionId: string,
    createWalletGroupCallback: (walletGroup: WalletGroup) => Promise<void>,
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    if (accounts.length === 0) {
      return;
    }

    const totalInvestmentsAmount = await this.getInvestmentsTotalAmount(connectionId);

    await createWalletGroupCallback(this.buildNewWalletGroup(item, totalInvestmentsAmount));

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
    updateWalletGroupCallback: (values: RecursivePartial<WalletGroup>) => Promise<void>,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    if (shouldUpdate) {
      await this.client.updateItem(connectionId);
    }

    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    const totalInvestmentsAmount = await this.getInvestmentsTotalAmount(connectionId);

    await updateWalletGroupCallback(this.buildUpdateWalletGroup(item, totalInvestmentsAmount));

    await updateWalletsCallback(accounts.map((account) => this.buildUpdateWallet(account)));

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
      WalletTypeList.includes(account.subtype),
    );

    return [item, filteredAccounts] as [Item, Account[]];
  };

  private getInvestmentsTotalAmount = async (connectionId: string) => {
    const investments = await this.client.fetchInvestments(connectionId);
    return investments.results
      .filter((inv) => inv.status === 'ACTIVE')
      .reduce((sum, inv) => sum + (inv.amountWithdrawal || 0), 0);
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
        createdAtFrom: startDate?.toISOString(),
      });

      await createTransactionsCallback(
        transactions.results.map((transaction) => this.buildTransaction(transaction, accountId)),
      );

      page++;
    } while (transactions.results.length !== 0);
  };

  private buildNewWalletGroup = (item: Item, totalInvestmentsAmount?: number) =>
    ({
      id: item.id,
      name: item.connector.name,
      type: 'AUTOMATIC',
      provider: 'PLUGGY',
      status: item.status,
      lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : new Date(),
      updateDisabled: CONNECTORS_WITHOUT_UPDATE.includes(item.connector.name),
      investmentAmount: totalInvestmentsAmount || 0,
      styles: {
        imageUrl: item.connector.imageUrl,
        primaryColor: '#' + item.connector.primaryColor,
      },
      createdAt: new Date(item.createdAt),
    } as AutomaticWalletGroup);

  private buildUpdateWalletGroup = (item: Item, totalInvestmentsAmount?: number) =>
    ({
      status: item.status,
      lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : new Date(),
      investmentAmount: totalInvestmentsAmount || 0,
    } as RecursivePartial<WalletGroup>);

  private buildNewWallet = (item: Item, account: Account) =>
    ({
      id: account.id,
      type: account.subtype,
      balance: account.balance,
      initialBalance: account.balance,
      walletGroupId: item.id,
    } as Wallet);

  private buildUpdateWallet = (account: Account) =>
    ({
      id: account.id,
      balance: account.balance,
    } as Wallet);

  private buildTransaction = (transaction: PluggyTransaction, accountId: string) =>
    ({
      id: transaction.id,
      description: transaction.description,
      date: new Date(transaction.date),
      amount: Math.abs(transaction.amount),
      type: transaction.type === 'CREDIT' ? 'INCOME' : 'EXPENSE',
      walletId: accountId,
      updateWalletBalance: false,
    } as Transaction);
}
