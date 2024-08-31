import moment from 'moment';
import {
  TransactionType as CommonTransactionType,
  ConnectionStatus,
  Transaction,
  Wallet,
} from '../../models';
import { IProviderService } from '../providerService.interface';
import { BelvoClient } from './client';
import {
  Account,
  AccountCategory,
  Transaction as BelvoTransaction,
  Institution,
  Link,
  LinkStatus,
  TransactionType,
} from './types';

export * from './client';
export * from './types';

const DEFAULT_PAGE_SIZE = 100;

const ALLOWED_ACCOUNT_CATEGORIES: AccountCategory[] = [
  'CHECKING_ACCOUNT',
  'CREDIT_CARD',
  'SAVINGS_ACCOUNT',
];

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
    const wallets = await this.fetchWallets(connectionId);

    await createWalletsCallback(wallets);

    await Promise.all(
      wallets.map(({ id }) =>
        this.fetchAndCreateTransactions(connectionId, id, createTransactionsCallback),
      ),
    );
  };

  updateConnection = async (
    connectionId: string,
    lastUpdateDate: Date,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const wallets = await this.fetchWallets(connectionId);

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

  private fetchWallets = async (connectionId: string) => {
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

    const filteredAccounts = accounts.filter(({ category }) =>
      ALLOWED_ACCOUNT_CATEGORIES.includes(category),
    );

    return filteredAccounts.map((account) => this.buildWallet(link, institution, account));
  };

  fetchAndCreateTransactions = async (
    connectionId: string,
    accountId: string,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
    startDate?: Date,
  ) => {
    let transactions: BelvoTransaction[];
    let page = 1;

    const from = startDate ? moment(startDate).format('YYYY-MM-dd') : undefined;

    do {
      transactions = await this.client.transactions.list({
        filters: {
          link: connectionId,
          page_size: DEFAULT_PAGE_SIZE,
          page,
          account: accountId,
          accounting_date__gt: from,
        },
      });

      await createTransactionsCallback(
        transactions.map((transaction) => this.buildTransaction(transaction)),
      );

      page++;
    } while (transactions.length !== 0);
  };

  private buildWallet = (link: Link, institution: Institution, account: Account) =>
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
      amount: transaction.amount,
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
}
