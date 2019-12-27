import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { LiveStreamsDataSourceOptions } from './Types';

export type Props = DataSourcePluginOptionsEditorProps<LiveStreamsDataSourceOptions>;
export class ConfigEditor extends PureComponent<Props> {
  render() {
    const { options, onOptionsChange } = this.props;
    return (
      <>
        <DataSourceHttpSettings showAccessOptions={true} dataSourceConfig={options} defaultUrl="http://localhost:5050" onChange={onOptionsChange} />
      </>
    );
  }
}
