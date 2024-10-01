import moment from 'moment';
import {
  TransactionType as CommonTransactionType,
  ConnectionStatus,
  Transaction,
  Wallet,
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
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const wallets = await this.fetchWallets(connectionId, this.buildNewWallet);

    await createWalletsCallback(wallets);

    await Promise.all(
      wallets.map(({ id }) =>
        this.fetchAndCreateTransactions(connectionId, id, createTransactionsCallback),
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
      await this.updateAccountAndTransactions(connectionId, lastUpdateDate);
    }

    const wallets = await this.fetchWallets(connectionId, this.buildUpdateWallet);

    await updateWalletsCallback(wallets);

    await Promise.all(
      wallets.map(({ id }) =>
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

  private fetchWallets = async (
    connectionId: string,
    walletFactory: (link: Link, institution: Institution, account: Account) => Wallet,
  ) => {
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

    //@ts-expect-error WalletTypeList is a string list
    const filteredAccounts = accounts.filter(({ category }) => WalletTypeList.includes(category));

    return filteredAccounts.map((account) => walletFactory(link, institution, account));
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

  private buildNewWallet = (link: Link, institution: Institution, account: Account) =>
    ({
      id: account.id,
      name: institution.display_name || link.institution,
      type: account.category,
      balance: account.balance.available,
      initialBalance: account.balance.available,
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
    } as Wallet);

  private buildUpdateWallet = (link: Link, institution: Institution, account: Account) =>
    ({
      id: account.id,
      balance: account.balance.available,
      connection: {
        id: link.id,
        status: this.linkStatusToConnectionStatus(link.status),
        lastUpdatedAt: new Date(link.last_accessed_at),
      },
    } as Wallet);

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
