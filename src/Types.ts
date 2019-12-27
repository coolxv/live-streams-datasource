import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface LiveStreamsQuery extends DataQuery {
  queryType: string;
  queryText: string;
}

export const defaultQuery: Partial<LiveStreamsQuery> = {
  queryType: '',
  queryText: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface DatasourceRequestOptions {
  retry?: number;
  method?: string;
  requestId?: string;
  url?: string;
  headers?: { [key: string]: any };
  silent?: boolean;
  data?: { [key: string]: any };
}

export interface LiveStreamsDataSourceOptions extends DataSourceJsonData {
  apiKey?: string;
}
export interface LiveStreamsExpression {
  type: string;
  query: string;
}
/**
 * Maps directly to a query in the UI (refId is key)
 */
export interface LiveStreamsTarget {
  type: string;
  query: string;
  url: string;
  refId: string;
  size: number;
}
export interface LiveStreamsResult {
  stream: Record<string, string>;
  values: Array<[string, string]>;
}
export interface LiveStreamsResponse {
  streams: LiveStreamsResult[];
  dropped_entries?: Array<{
    labels: Record<string, string>;
    timestamp: string;
  }>;
}
