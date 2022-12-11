import { BaseApi } from './baseApi';
import { Connector, ConnectorFilters, PageResponse } from './types';

export class PluggyClient extends BaseApi {
  async fetchConnectors(filters: ConnectorFilters = {}) {
    return this.getRequest<PageResponse<Connector>>('/connectors', filters);
  }
}
