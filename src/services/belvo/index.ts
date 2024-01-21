import moment from 'moment';
import {
  Account,
  Connection,
  ConnectionStatus,
  Investment,
  Transaction,
  TransactionType as CommonTransactionType,
} from '../../models';
import { IProviderService } from '../providerService.interface';
import { BelvoClient } from './client';
import { AccountCategory, Institution, Link, LinkStatus, TransactionType } from './types';

export * from './client';
export * from './types';

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

  fetchConnectionById = async (connectionId: string) => {
    const link = await this.client.links.detail(connectionId);

    const institution = (
      await this.client.institutions.list({
        filters: {
          name: link.institution,
        },
      })
    )[0];

    return this.linkAndInstitutionToConnection(link, institution);
  };

  updateConnectionById = async (connectionId: string, lastUpdateDate: string) => {
    const accountRetrievePromise = this.client.accounts.retrieve(connectionId, {
      saveData: true,
    });

    const dateFrom = moment(lastUpdateDate).format('YYYY-MM-DD');

    const transactionRetrievePromise = this.client.transactions.retrieve(connectionId, dateFrom, {
      saveData: true,
    });

    await Promise.all([accountRetrievePromise, transactionRetrievePromise]);

    return this.fetchConnectionById(connectionId);
  };

  deleteConnectionById = async (connectionId: string) => {
    await this.client.links.delete(connectionId);
  };

  fetchAccounts = async (connection: Connection) => {
    const accounts = await this.client.accounts.list({
      filters: {
        link: connection.id,
      },
    });

    return accounts
      .filter(({ category }) => ALLOWED_ACCOUNT_CATEGORIES.includes(category))
      .map(
        (account) =>
          ({
            id: account.id,
            type: account.category === 'CREDIT_CARD' ? 'CREDIT' : 'BANK',
            subtype: account.category,
            balance: account.balance.available,
            connectionId: connection.id,
            provider: 'BELVO',
          } as Account),
      );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchInvestments = async (connection: Connection) => {
    return [] as Investment[];
  };

  fetchTransactions = async (account: Account, filters: { from: string; to: string }) => {
    const transactions = await this.client.transactions.list({
      filters: {
        link: account.connectionId,
        account: account.id,
        accounting_date__range: `${filters.from},${filters.to}`,
      },
    });

    return transactions.map(
      (transaction) =>
        ({
          id: transaction.id,
          description: transaction.description,
          type: this.transactionTypeMap(transaction.type),
          amount: transaction.amount,
          category: transaction.category,
          date: new Date(transaction.value_date),
          accountId: account.id,
          provider: 'BELVO',
        } as Transaction),
    );
  };

  private linkAndInstitutionToConnection = (link: Link, institution: Institution) => {
    return {
      id: link.id,
      connector: {
        name: institution.display_name || link.institution,
        imageUrl: institution.icon_logo,
        primaryColor: institution.primary_color.slice(1),
      },
      status: this.linkStatusToConnectionStatus(link.status),
      createdAt: new Date(link.created_at),
      lastUpdatedAt: new Date(link.last_accessed_at),
      provider: 'BELVO',
    } as Connection;
  };

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

  private transactionTypeMap: (type: TransactionType) => CommonTransactionType = (
    type: TransactionType,
  ) => {
    switch (type) {
      case 'INFLOW':
        return 'CREDIT';
      case 'OUTFLOW':
        return 'DEBIT';
      default:
        return 'DEBIT';
    }
  };
}
