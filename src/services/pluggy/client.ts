import { BaseApi } from './baseApi';
import { Connector, ConnectorFilters, CreateItemOptions, Item, PageResponse } from './types';

export class PluggyClient extends BaseApi {
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
}
