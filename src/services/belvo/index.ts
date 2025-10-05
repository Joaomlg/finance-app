import moment from 'moment';
import {
  BankAccount,
  TransactionType as CommonTransactionType,
  ConnectionStatus,
  Transaction,
  TransactionalAccount,
  WalletTypeList,
} from '../../models';
import { IProviderService } from '../providerService.interface';
import { BelvoClient } from './client';
import {
  Account,
  Transaction as BelvoTransaction,
  Institution,
  Link,
  LinkStatus,
  TransactionType,
} from './types';

export * from './client';
export * from './types';

const DEFAULT_PAGE_SIZE = 100;

export class BelvoService implements IProviderService {
  constructor(private client: BelvoClient) {}

  createAccessToken = async (connectionId?: string | undefined) => {
    const { access: accessToken } = await this.client.widgetToken.create({
      link: connectionId,
    });
    return accessToken;
  };

  fetchConnection = async (
    connectionId: string,
    createBankAccountCallback: (account: BankAccount) => Promise<void>,
    createTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const [link, institution, accounts] = await this.fetchConnectionData(connectionId);

    await createBankAccountCallback(this.buildNewBankAccount(link, institution));

    await createTransactionalAccountsCallback(
      accounts
        //@ts-expect-error WalletTypeList is a string list
        .filter(({ category }) => WalletTypeList.includes(category))
        .map(this.buildNewTransactionalAccount),
    );

    await Promise.all(
      accounts.map(({ id }) =>
        this.fetchAndCreateTransactions(connectionId, id, createTransactionsCallback),
      ),
    );
  };

  syncConnection = async (
    connectionId: string,
    lastUpdateDate: Date,
    shouldUpdate: boolean,
    updateBankAccountCallback: (bankAccount: BankAccount) => Promise<void>,
    updateTransactionalAccountsCallback: (accounts: TransactionalAccount[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    if (shouldUpdate) {
      await this.updateAccountAndTransactions(connectionId, lastUpdateDate);
    }

    const [link, , accounts] = await this.fetchConnectionData(connectionId);

    await updateBankAccountCallback(this.buildUpdateBankAccount(link));

    await updateTransactionalAccountsCallback(
      accounts
        //@ts-expect-error WalletTypeList is a string list
        .filter(({ category }) => WalletTypeList.includes(category))
        .map(this.buildUpdateTransactionalAccount),
    );

    await Promise.all(
      accounts.map(({ id }) =>
        this.fetchAndCreateTransactions(
          connectionId,
          id,
          createTransactionsCallback,
          lastUpdateDate,
        ),
      ),
    );
  };

  deleteConnection = async (connectionId: string) => {
    await this.client.links.delete(connectionId);
  };

  private fetchConnectionData = async (connectionId: string) => {
    const link = await this.client.links.detail(connectionId);

    const institution = (
      await this.client.institutions.list({
        filters: {
          name: link.institution,
        },
      })
    )[0];

    const accounts = await this.client.accounts.list({
      filters: {
        link: connectionId,
      },
    });

    return [link, institution, accounts] as [Link, Institution, Account[]];
  };

  private fetchAndCreateTransactions = async (
    connectionId: string,
    accountId: string,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
    startDate?: Date,
  ) => {
    let transactions: BelvoTransaction[];
    let page = 1;

    do {
      transactions = await this.client.transactions.list({
        filters: {
          link: connectionId,
          page_size: DEFAULT_PAGE_SIZE,
          page,
          account: accountId,
          collected_at__gt: startDate?.toISOString(),
        },
      });

      await createTransactionsCallback(
        transactions
          .filter(
            (transaction) =>
              startDate === undefined || new Date(transaction.value_date) > startDate,
          )
          .map((transaction) => this.buildTransaction(transaction)),
      );

      page++;
    } while (transactions.length !== 0);
  };

  private buildNewBankAccount = (link: Link, institution: Institution) =>
    ({
      id: link.id,
      name: institution.display_name || link.institution,
      createdAt: new Date(link.created_at),
      styles: {
        imageUrl: institution.icon_logo,
        primaryColor: institution.primary_color,
      },
      connection: {
        id: link.id,
        status: this.linkStatusToConnectionStatus(link.status),
        provider: 'BELVO',
        lastUpdatedAt: new Date(link.last_accessed_at),
      },
    } as BankAccount);

  private buildNewTransactionalAccount = (account: Account) =>
    ({
      id: account.id,
      type: 'TRANSACTIONAL_ACCOUNT',
      subtype: account.category,
      balance: account.balance.available,
      initialBalance: account.balance.available,
      bankAccountId: account.link,
    } as TransactionalAccount);

  private buildUpdateBankAccount = (link: Link) =>
    ({
      id: link.id,
      connection: {
        id: link.id,
        status: this.linkStatusToConnectionStatus(link.status),
        lastUpdatedAt: new Date(link.last_accessed_at),
      },
    } as BankAccount);

  private buildUpdateTransactionalAccount = (account: Account) =>
    ({
      id: account.id,
      balance: account.balance.available,
    } as TransactionalAccount);

  private linkStatusToConnectionStatus: (status: LinkStatus) => ConnectionStatus = (
    status: LinkStatus,
  ) => {
    switch (status) {
      case 'valid':
        return 'UPDATED';
      case 'invalid':
        return 'LOGIN_ERROR';
      case 'token_required':
        return 'WAITING_USER_INPUT';
      case 'unconfirmed':
        return 'OUTDATED';
    }
  };

  private buildTransaction = (transaction: BelvoTransaction) =>
    ({
      id: transaction.id,
      description: transaction.description,
      date: new Date(transaction.value_date),
      amount: Math.abs(transaction.amount),
      type: this.transactionTypeMap(transaction.type),
      walletId: transaction.account.id,
      updateWalletBalance: false,
    } as Transaction);

  private transactionTypeMap: (type: TransactionType) => CommonTransactionType = (
    type: TransactionType,
  ) => {
    switch (type) {
      case 'INFLOW':
        return 'INCOME';
      case 'OUTFLOW':
        return 'EXPENSE';
      default:
        return 'EXPENSE';
    }
  };

  private updateAccountAndTransactions = async (connectionId: string, lastUpdateDate: Date) => {
    const accountRetrievePromise = this.client.accounts.retrieve(connectionId, {
      saveData: true,
    });

    const dateFrom = moment(lastUpdateDate).format('YYYY-MM-DD');

    const transactionRetrievePromise = this.client.transactions.retrieve(connectionId, dateFrom, {
      saveData: true,
    });

    await Promise.all([accountRetrievePromise, transactionRetrievePromise]);
  };
}
