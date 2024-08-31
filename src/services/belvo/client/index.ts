import APISession from './http';
import AccountResource from '../resources/accounts';
import InstitutionResource from '../resources/institutions';
import LinkResource from '../resources/links';
import TransactionResource from '../resources/transactions';
import WidgetTokenResource from '../resources/widgetToken';
import { Environment, urlResolver } from './utils';

export class BelvoClient {
  private session: APISession;

  public institutions: InstitutionResource;
  public links: LinkResource;
  public accounts: AccountResource;
  public transactions: TransactionResource;
  public widgetToken: WidgetTokenResource;

  constructor(secretKeyId: string, secretKeyPassword: string, env: Environment = 'sandbox') {
    const belvoUrl = urlResolver(env);

    if (!belvoUrl) {
      throw new Error('You need to provide a URL or a valid environment.');
    }

    this.session = new APISession(belvoUrl, secretKeyId, secretKeyPassword);

    this.institutions = new InstitutionResource(this.session);
    this.links = new LinkResource(this.session);
    this.accounts = new AccountResource(this.session);
    this.transactions = new TransactionResource(this.session);
    this.widgetToken = new WidgetTokenResource(this.session);
  }
}
