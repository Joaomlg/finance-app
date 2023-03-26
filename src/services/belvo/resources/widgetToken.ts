import Resource from './resources';

export type Token = {
  refresh: string;
  access: string;
};

export type WidgetTokenOptions = {
  link?: string;
  widget?: unknown;
  scopes?: string;
};

/**
 * A WidgetToken provides access and refresh keys to allow users to
 * initialize and embed our Connect Widget into their own apps.
 * @extends Resource
 */
class WidgetTokenResource extends Resource<Token> {
  protected endpoint = 'api/token/';

  /**
   * Request a new token
   * @async
   * @param {object} options - Optional parameters (link, scopes)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async create(options: WidgetTokenOptions = {}) {
    const { link, widget } = options;

    const scopes = options.scopes || 'read_institutions,write_links,read_links';

    const result = await this.session.post<Token>(this.endpoint, {
      id: this.session._keyId,
      password: this.session._keyPassword,
      link_id: link,
      scopes,
      widget,
    });

    return result;
  }
}

export default WidgetTokenResource;
