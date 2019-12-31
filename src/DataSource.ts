//import defaults from 'lodash/defaults';
import { isEmpty } from 'lodash';
import { Observable, from, of, merge } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { map, mergeMap, catchError } from 'rxjs/operators';
import { BackendSrv } from '@grafana/runtime';
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, LoadingState } from '@grafana/data';
import { LiveStreamsTarget, LiveStreamsQuery, LiveStreamsDataSourceOptions, DatasourceRequestOptions } from './Types';
import { parseParam, serializeParams, convertToWebSocketUrl } from './Utils';
import { LiveStreams } from './LiveStreams';

export class DataSource extends DataSourceApi<LiveStreamsQuery, LiveStreamsDataSourceOptions> {
  private streams = new LiveStreams();

  /** @ngInject */
  constructor(private instanceSettings: DataSourceInstanceSettings<LiveStreamsDataSourceOptions>, private backendSrv: BackendSrv) {
    super(instanceSettings);
  }
  query(options: DataQueryRequest<LiveStreamsQuery>): Observable<DataQueryResponse> {
    const subQueries: Array<Observable<DataQueryResponse>> = [];
    const filteredTargets = options.targets
      .filter(target => target.queryText && !target.hide)
      .map(target => ({
        ...target,
      }));

    filteredTargets.forEach(target => subQueries.push(this.runStream(target, options)));
    // No valid targets, return the empty result to save a round trip.
    if (isEmpty(subQueries)) {
      return of({
        data: [],
        state: LoadingState.Done,
      });
    }
    return merge(...subQueries);
  }
  testDatasource() {
    return this.request('/api/v1/test', {})
      .pipe(
        map(res => {
          return { status: 'success', message: 'Live streams data source connected' };
        }),
        catchError((err: any) => {
          return of({ status: 'error', message: 'Cannot connect to stream' });
        })
      )
      .toPromise();
  }
  private request(apiUrl: string, data?: any, options?: DatasourceRequestOptions): Observable<Record<string, any>> {
    const baseUrl = this.instanceSettings.url;
    const params = data ? serializeParams(data) : '';
    const url = `${baseUrl}${apiUrl}${params.length ? `?${params}` : ''}`;
    const req = {
      ...options,
      url,
    };

    return from(this.backendSrv.datasourceRequest(req));
  }

  private createLiveTarget(target: LiveStreamsQuery, options: { maxDataPoints?: number }): LiveStreamsTarget {
    const { type, query } = parseParam(target);
    const baseUrl = this.instanceSettings.url;
    const params = serializeParams({ type, query });

    return {
      type,
      query,
      url: convertToWebSocketUrl(`${baseUrl}/api/v1/live?${params}`),
      refId: target.refId,
      size: Math.min(options.maxDataPoints || Infinity, 2048),
    };
  }

  // private runStream = (target: LiveStreamsQuery, options: { maxDataPoints?: number }): Observable<DataQueryResponse> => {
  //   const liveTarget = this.createLiveTarget(target, options);

  //   let stream = from('1').pipe(
  //     mergeMap(() => this.streams.getStream(liveTarget)),
  //     map(data => ({
  //       data: data,
  //       key: `ls-${liveTarget.refId}`,
  //       state: LoadingState.Streaming,
  //     }))
  //   );
  //   console.log(stream);
  //   return stream;
  // };
  private runStream = (target: LiveStreamsQuery, options: { maxDataPoints?: number }): Observable<DataQueryResponse> => {
    const liveTarget = this.createLiveTarget(target, options);

    let stream = this.streams.getStream(liveTarget).pipe(
      map(data => ({
        data: data,
        key: `ls-${liveTarget.refId}`,
        state: LoadingState.Streaming,
      }))
    );
    return stream;
  };
}
