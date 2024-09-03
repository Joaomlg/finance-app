import axios, { AxiosInstance } from 'axios';
import base64 from 'react-native-base64';
import { PageResponse } from '../types';

type Parameters = {
  [key: string]: number | number[] | string | string[] | boolean | undefined;
};

/** Class representing an active Belvo API session */
class APISession {
  public session: AxiosInstance;
  public _keyId?: string;
  public _keyPassword?: string;

  /**
   * Create a session.
   * @param {string} url - Belvo API host URL.
   */
  constructor(url: string, secretKeyId: string, secretKeyPassword: string) {
    this._keyId = secretKeyId;
    this._keyPassword = secretKeyPassword;

    const authHeader = 'Basic ' + base64.encode(`${secretKeyId}:${secretKeyPassword}`);

    this.session = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
  }

  /**
   * Get all results from a paginated response
   * @async
   * @param {string} url - API endpoint
   * @param {object} params - Params to filter results in get.
   * @yields {object} The next result in the response.
   */
  async *getAll<T>(url: string, params: Parameters = {}): AsyncGenerator<T> {
    const {
      data: { results, next },
    } = await this.session.get<PageResponse<T>>(url, { params });

    for (const item of results) {
      yield item;
    }

    if (next) {
      yield* this.getAll<T>(next);
    }
  }

  /**
   * Get a list of resources.
   * @async
   * @param {string} url - API endpoint
   * @param {number} limit - Maximum number of results to get.
   * @param {object} params - Params to filter results in get.
   * @returns {array} List of resources.
   */
  async list<T>(url: string, limit = 100, params: Parameters = {}): Promise<T[]> {
    const results = [];

    const pageSizeFilter =
      limit !== 100 ? { page_size: Math.max(limit, (params.page_size as number) || 0) } : {};

    const generator = await this.getAll<T>(url, { ...params, ...pageSizeFilter });

    for (let index = 0; index < limit; index += 1) {
      const next = await generator.next();

      if (next.done) {
        break;
      }

      results.push(next.value);
    }

    return results;
  }

  /**
   * Get details of a specific resource.
   * @async
   * @param {str} url - API endpoint
   * @param {string} id - UUID4 representing the resource id.
   * @returns {object}
   */
  async get<T>(url: string, id: string): Promise<T> {
    const response = await this.session.get<T>(`${url}${id}/`);
    return response.data;
  }

  /**
   * Do a POST request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {object} payload - JSON request payload.
   * @returns {object} Response
   * @throws {RequestError}
   */
  async post<T>(url: string, payload?: object): Promise<T> {
    const response = await this.session.post<T>(url, payload);
    return response.data;
  }

  /**
   * Do a PATCH request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {object} payload - Response
   * @returns {object} Response
   * @throws {RequestError}
   */
  async patch<T>(url: string, payload: object): Promise<T> {
    const response = await this.session.patch<T>(url, payload);
    return response.data;
  }

  /**
   * Do a PUT request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {string} id - UUID4 representing the resource Id.
   * @param {object} payload - JSON request payload.
   * @throws {RequestError}
   */
  async put<T>(url: string, id: string, payload: object): Promise<T> {
    const composedUrl = `${url}${id}/`;
    const response = await this.session.put<T>(composedUrl, payload);
    return response.data;
  }

  /**
   * Do a DELETE request to the API.
   * @async
   * @param {stroing} url - API endpoint.
   * @param {string} id - UUID4 representing the resource Id.
   * @returns {boolean}
   * @throws {RequestError}
   */
  async delete(url: string, id: string): Promise<boolean> {
    const composedUrl = `${url}${id}/`;
    try {
      await this.session.delete(composedUrl);
    } catch (error) {
      return false;
    }
    return true;
  }
}

export default APISession;
