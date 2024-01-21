import Resource from './resources';
import { Account } from '../types';

export type AccountRetrieveOptions = {
  token?: string;
  saveData?: boolean;
};

/**
 * An Account is the representation of a bank account inside a financial institution.
 * @extends Resource
 */
class AccountResource extends Resource<Account> {
  protected endpoint = 'api/accounts/';

  /**
   * Retrieve accounts from an existing link.
   * @async
   * @param {string} link UUID4 representation of a Link Id.
   * @param {object} options - Optional parameters (token, saveData)
   * @return {object} Response
   * @throws {RequestError}
   */
  async retrieve(link: string, options: AccountRetrieveOptions = {}) {
    const { token, saveData } = options;

    const result = await this.session.post<Account[]>(this.endpoint, {
      link,
      token,
      save_data: saveData,
    });

    return result;
  }
}

export default AccountResource;
