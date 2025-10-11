import { BankAccount, Transaction, TransactionalAccount, WalletTypeList } from '../../models';
import { IProviderService } from '../providerService.interface';
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
    createAccountCallback: (account: BankAccount) => Promise<void>,
    createTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    await createAccountCallback(this.buildNewBankAccount(item));

    await createTransactionalAccountsCallback(accounts.map(this.buildNewFinancialAccount));

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
    updateBankAccountCallback: (account: BankAccount) => Promise<void>,
    updateTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    if (shouldUpdate) {
      await this.client.updateItem(connectionId);
    }

    const [item, accounts] = await this.fetchItemAndAccounts(connectionId);

    await updateBankAccountCallback(this.buildUpdateBankAccount(item));

    await updateTransactionalAccountsCallback(accounts.map(this.buildUpdateTransactionalAccount));

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
        transactions.results
          .filter(
            (transaction) => startDate === undefined || new Date(transaction.date) > startDate,
          )
          .map(this.buildTransaction),
      );

      page++;
    } while (transactions.results.length === DEFAULT_PAGE_SIZE);
  };

  private computeAccountBalance = (account: Account) => {
    return account.balance + (account.bankData?.automaticallyInvestedBalance || 0);
  };

  private buildNewBankAccount = (item: Item) =>
    ({
      id: item.id,
      name: item.connector.name,
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
        updateDisabled: CONNECTORS_WITHOUT_UPDATE.includes(item.connector.name),
      },
    } as BankAccount);

  private buildNewFinancialAccount = (account: Account) =>
    ({
      id: account.id,
      type: 'TRANSACTIONAL_ACCOUNT',
      subtype: account.subtype,
      balance: this.computeAccountBalance(account),
      initialBalance: this.computeAccountBalance(account),
      bankAccountId: account.itemId,
    } as TransactionalAccount);

  private buildUpdateBankAccount = (item: Item) =>
    ({
      id: item.id,
      connection: {
        id: item.id,
        status: item.status,
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : new Date(),
      },
    } as BankAccount);

  private buildUpdateTransactionalAccount = (account: Account) =>
    ({
      id: account.id,
      balance: this.computeAccountBalance(account),
    } as TransactionalAccount);

  private buildTransaction = (transaction: PluggyTransaction) =>
    ({
      id: transaction.id,
      description: transaction.description,
      date: new Date(transaction.date),
      amount: Math.abs(transaction.amount),
      type: transaction.type === 'CREDIT' ? 'INCOME' : 'EXPENSE',
      accountId: transaction.accountId,
      updateAccountBalance: false,
    } as Transaction);
}
