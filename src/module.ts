import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { LiveStreamsQuery, LiveStreamsDataSourceOptions } from './Types';

export const plugin = new DataSourcePlugin<DataSource, LiveStreamsQuery, LiveStreamsDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
