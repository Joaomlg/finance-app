import { BaseApi } from './baseApi';
import {
  Account,
  AccountType,
  Connector,
  ConnectorFilters,
  CreateItemOptions,
  Investment,
  InvestmentType,
  Item,
  PageResponse,
} from './types';

export class PluggyClient extends BaseApi {
  async createConnectToken() {
    return this.postRequest<{ accessToken: string }>('/connect_token');
  }

  async fetchConnectors(filters: ConnectorFilters = {}) {
    return this.getRequest<PageResponse<Connector>>('/connectors', filters);
  }

  async fetchConnector(id: number) {
    return this.getRequest<Connector>(`/connectors/${id}`);
  }

  async createItem(
    connectorId: number,
    parameters: Record<string, string>,
    options?: CreateItemOptions,
  ) {
    return this.postRequest<Item>('/items', {
      connectorId,
      parameters,
      ...(options || {}),
    });
  }

  async updateItem(id: string, parameters?: Record<string, string>) {
    return this.patchRequest<Item>(`items/${id}`, {
      id,
      parameters,
    });
  }

  async fetchItem(id: string) {
    return this.getRequest<Item>(`items/${id}`);
  }

  async deleteItem(id: string) {
    await this.deleteRequest<void>(`items/${id}`);
  }

  async fetchAccounts(itemId: string, type?: AccountType) {
    return this.getRequest<PageResponse<Account>>('/accounts', { itemId, type });
  }

  async fetchInvestments(itemId: string, type?: InvestmentType) {
    return this.getRequest<PageResponse<Investment>>('/investments', { itemId, type });
  }
}
