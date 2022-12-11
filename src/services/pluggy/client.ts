import { BaseApi } from './baseApi';
import { Connector, PageResponse } from './types';

export class PluggyClient extends BaseApi {
  async fetchConnectors() {
    return this.getRequest<PageResponse<Connector>>('/connectors');
  }
}
