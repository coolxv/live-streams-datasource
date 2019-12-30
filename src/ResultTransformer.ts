import _ from 'lodash';

import { DataFrame, CircularDataFrame, FieldType } from '@grafana/data';
import { LiveStreamsTarget } from './Types';
// import { LiveStreamsResponse } from './Types';

export function createResponseBufferedData(target: LiveStreamsTarget): DataFrame {
  // Should we do anything with: response.dropped_entries?
  console.log(target);
  const data = new CircularDataFrame({ capacity: target.size });
  (<any>data).target = target;
  data.addField({ name: 'value', type: FieldType.string });
  return data;
}
export function appendResponseToBufferedData(rsp: any, data: DataFrame) {
  // Should we do anything with: response.dropped_entries?
  console.log(rsp);
  let value = Math.random() * 100;
  (data as CircularDataFrame).values.value.add(`${value}`);
  console.log(data);
}
