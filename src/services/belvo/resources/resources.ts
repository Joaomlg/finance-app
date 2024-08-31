import APISession from '../client/http';

/** Represents a Belvo API resource */
abstract class Resource<T> {
  protected abstract endpoint: string;
  protected session: APISession;

  /**
   * Instantiate a resource.
   * @param {APISession} session - Belvo API session.
   */
  constructor(session: APISession) {
    this.session = session;
  }

  /**
   * Get a list of resources.
   * @async
   * @param {Object} params - Receives two parameters.
   * @param {number} [params.limit=100] - Maximum number of results.
   * @param {Object} [params.filters={}] - Filters to get custom results.
   * @returns {array} List of results.
   * @throws {RequestError}
   */
  async list({ limit = 100, filters = {} } = {}) {
    const result = await this.session.list<T>(this.endpoint, limit, filters);
    return result;
  }

  /**
   * Get specific record details.
   * @async
   * @param {string} id - UUID4 representation of the resource Id.
   * @returns {object}
   * @throws {RequestError}
   */
  async detail(id: string) {
    const result = await this.session.get<T>(this.endpoint, id);
    return result;
  }

  /**
   * Delete specific record.
   * @async
   * @param {string} id - UUID4 representation of the resource Id.
   * @returns {boolean} When the record is successfuly deleted returns true, otherwise false.
   */
  async delete(id: string) {
    const result = await this.session.delete(this.endpoint, id);
    return result;
  }

  /**
   * Resume a "pending" session that requires an OTP token.
   * Use this function to resume sessions that returned HTTP 428 status code.
   * @async
   * @param {string} session - UUID4 representation of a "pending" session.
   * @param {string} token - OTP token.
   * @param {string} link - UUID4 representation of the link being used.
   * @returns {object} Response.
   * @throws {RequestError}
   */
  async resume(session: string, token: string, link: string) {
    const result = await this.session.patch<T>(this.endpoint, { session, token, link });
    return result;
  }
}

export default Resource;
