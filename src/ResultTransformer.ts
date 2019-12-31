import _ from 'lodash';

import { DataFrame, CircularDataFrame, FieldType } from '@grafana/data';
import { LiveStreamsTarget } from './Types';

export function createResponseBufferedData(target: LiveStreamsTarget): DataFrame {
  const data = new CircularDataFrame({ capacity: target.size });
  (<any>data).target = target;
  data.addField({ name: 'value', type: FieldType.string });
  return data;
}
export function appendResponseToBufferedData(rsp: any, data: DataFrame) {
  let value = Math.random() * 100;
  (data as CircularDataFrame).values.value.add(`${value}`);
}
