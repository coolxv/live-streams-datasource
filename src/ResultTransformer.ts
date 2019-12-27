import _ from 'lodash';

import { MutableDataFrame } from '@grafana/data';

import { LiveStreamsResponse } from './Types';

export function appendResponseToBufferedData(response: LiveStreamsResponse, data: MutableDataFrame) {
  // Should we do anything with: response.dropped_entries?
  data.values.id.add(`test`);
}
