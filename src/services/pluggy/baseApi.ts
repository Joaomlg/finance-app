import { ApisauceInstance, create } from 'apisauce';
import jwtDecode from 'jwt-decode';

export type PluggyClientParams = {
  clientId: string;
  clientSecret: string;
};

type QueryParameters = {
  [key: string]: number | number[] | string | string[] | boolean | undefined;
};

export class BaseApi {
  private client: ApisauceInstance;
  private clientId: string;
  private clientSecret: string;
  private apiKey: string;
  private defaultHeaders: Record<string, string>;

  constructor({ clientId, clientSecret }: PluggyClientParams) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.client = create({
      baseURL: 'https://api.pluggy.ai',
    });

    this.apiKey = '';

    this.defaultHeaders = {
      accept: 'application/json',
      'content-type': 'application/json',
    };
  }

  protected async getRequest<T>(url: string, params?: QueryParameters): Promise<T> {
    try {
      const response = await this.client.get<T>(url, params, {
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': await this.getApiKey(),
        },
      });

      if (!response.ok) {
        throw response.problem;
      }

      return Promise.resolve(response.data as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async postRequest<T>(url: string, body?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.post<T>(url, body, {
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': await this.getApiKey(),
        },
      });

      if (!response.ok) {
        throw response.problem;
      }

      return Promise.resolve(response.data as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async patchRequest<T>(url: string, body?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, body, {
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': await this.getApiKey(),
        },
      });

      if (!response.ok) {
        throw response.problem;
      }

      return Promise.resolve(response.data as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async deleteRequest<T>(url: string, params?: QueryParameters): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, params, {
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': await this.getApiKey(),
        },
      });

      if (!response.ok) {
        throw response.problem;
      }

      return Promise.resolve(response.data as T);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async getApiKey(): Promise<string> {
    if (this.apiKey == '' || this.isApiKeyExpired(this.apiKey)) {
      this.apiKey = await this.createApiKey();
    }

    return this.apiKey;
  }

  protected isApiKeyExpired(token: string): boolean {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now_seconds = Date.now() / 1000;
    const expired = exp <= Math.floor(now_seconds);
    return expired;
  }

  public async createApiKey(): Promise<string> {
    const response = await this.client.post<{ apiKey: string }>('/auth', {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    if (!response.ok) {
      throw response.problem;
    }

    if (!response.data) {
      throw 'Could not create an apiKey';
    }

    return response.data.apiKey;
  }
}
