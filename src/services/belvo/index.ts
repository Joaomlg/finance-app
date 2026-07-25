import moment from 'moment';
import {
  AutomaticWalletGroup,
  TransactionType as CommonTransactionType,
  Transaction,
  Wallet,
  WalletGroup,
  WalletGroupStatus,
  WalletTypeList,
} from '../../models';
import { IProviderService } from '../providerService.interface';
import { RecursivePartial } from '../../utils/type';
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
    createWalletGroupCallback: (walletGroup: WalletGroup) => Promise<void>,
    createWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    const [link, institution, accounts] = await this.fetchLinkAndAccounts(connectionId);

    if (accounts.length === 0) {
      return;
    }

    await createWalletGroupCallback(this.buildNewWalletGroup(link, institution));

    await createWalletsCallback(accounts.map((account) => this.buildNewWallet(link, account)));

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
    updateWalletGroupCallback: (values: RecursivePartial<WalletGroup>) => Promise<void>,
    updateWalletsCallback: (wallets: Wallet[]) => Promise<void>,
    createTransactionsCallback: (transactions: Transaction[]) => Promise<void>,
  ) => {
    if (shouldUpdate) {
      await this.updateAccountAndTransactions(connectionId, lastUpdateDate);
    }

    const [link, , accounts] = await this.fetchLinkAndAccounts(connectionId);

    await updateWalletGroupCallback(this.buildUpdateWalletGroup(link));

    await updateWalletsCallback(accounts.map((account) => this.buildUpdateWallet(account)));

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

  private fetchLinkAndAccounts = async (connectionId: string) => {
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

    return [link, institution, filteredAccounts] as [Link, Institution, Account[]];
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
        transactions.map((transaction) => this.buildTransaction(transaction)),
      );

      page++;
    } while (transactions.length !== 0);
  };

  private buildNewWalletGroup = (link: Link, institution: Institution) =>
    ({
      id: link.id,
      name: institution.display_name || link.institution,
      type: 'AUTOMATIC',
      provider: 'BELVO',
      status: this.linkStatusToConnectionStatus(link.status),
      lastUpdatedAt: new Date(link.last_accessed_at),
      updateDisabled: false,
      styles: {
        imageUrl: institution.icon_logo,
        primaryColor: institution.primary_color,
      },
      createdAt: new Date(link.created_at),
    } as AutomaticWalletGroup);

  private buildUpdateWalletGroup = (link: Link) =>
    ({
      status: this.linkStatusToConnectionStatus(link.status),
      lastUpdatedAt: new Date(link.last_accessed_at),
    } as RecursivePartial<WalletGroup>);

  private buildNewWallet = (link: Link, account: Account) =>
    ({
      id: account.id,
      type: account.category,
      balance: account.balance.available,
      initialBalance: account.balance.available,
      walletGroupId: link.id,
    } as Wallet);

  private buildUpdateWallet = (account: Account) =>
    ({
      id: account.id,
      balance: account.balance.available,
    } as Wallet);

  private linkStatusToConnectionStatus: (status: LinkStatus) => WalletGroupStatus = (
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
