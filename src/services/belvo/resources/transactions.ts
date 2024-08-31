import moment from 'moment';
import Resource from './resources';
import { Transaction } from '../types';

export type TransactionRetrieveOptions = {
  account?: string;
  token?: string;
  saveData?: boolean;
  dateTo?: string;
};

export type TransactionListProps = {
  limit?: number;
  filters: {
    link: string;
    [key: string]: number | number[] | string | string[] | boolean | undefined;
  };
};

/**
 * A Transaction contains the detailed information of each movement inside an Account.
 * @extends Resource
 */
class TransactionResource extends Resource<Transaction> {
  protected endpoint = 'api/transactions/';

  /**
   * Retrieve transactions from a specific account or all accounts from a specific link.
   * @async
   * @param {string} link - UUID4 representation of a Link Id.
   * @param {string} dateFrom - Required date from, format is YYYY-MM-DD.
   * @param {object} options - Optional parameters (dateTo, token, saveData, account)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link: string, dateFrom: string, options: TransactionRetrieveOptions = {}) {
    const { token, saveData, account } = options;

    const dateTo = options.dateTo || moment().format('YYYY-MM-DD');

    const result = await this.session.post<Transaction[]>(this.endpoint, {
      link,
      token,
      date_from: dateFrom,
      date_to: dateTo,
      account,
      save_data: saveData,
    });

    return result;
  }

  /**
   * Get a list of transactions.
   * @param {Object} params - Receives two parameters.
   * @param {number} [params.limit=100] - Maximum number of results.
   * @param {Object} [params.filters={}] - Filters to get custom results. Link ID is required
   * @returns {array} List of results.
   * @throws {RequestError}
   */
  async list({ limit = 100, filters }: TransactionListProps) {
    const result = await this.session.list<Transaction>(this.endpoint, limit, filters);
    return result;
  }
}

export default TransactionResource;
