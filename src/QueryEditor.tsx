import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import { FormField } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { LiveStreamsQuery, LiveStreamsDataSourceOptions, defaultQuery } from './Types';

type Props = QueryEditorProps<DataSource, LiveStreamsQuery, LiveStreamsDataSourceOptions>;

interface State {}

export class QueryEditor extends PureComponent<Props, State> {
  onComponentDidMount() {}

  onQueryTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryType: event.target.value });
  };

  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryType, queryText } = query;

    return (
      <div className="gf-form">
        <FormField labelWidth={8} value={queryType || ''} onChange={this.onQueryTypeChange} label="Query Type"></FormField>
        <FormField labelWidth={8} value={queryText || ''} onChange={this.onQueryTextChange} label="Query Text"></FormField>
      </div>
    );
  }
}
