//import { FieldType, DataQueryResponse, CircularDataFrame } from '@grafana/data';
import { KeyValue, DataFrame } from '@grafana/data';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { LiveStreamsTarget } from './Types';
import { map, finalize } from 'rxjs/operators';
import { createResponseBufferedData, appendResponseToBufferedData } from './ResultTransformer';

/**
 * Cache of websocket streams that can be returned as observable. In case there already is a stream for particular
 * target it is returned and on subscription returns the latest dataFrame.
 */
export class LiveStreams {
  private streams: KeyValue<Observable<DataFrame[]>> = {};

  getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
    let stream = this.streams[target.url];
    if (stream) {
      return stream;
    }
    const data = createResponseBufferedData(target);
    stream = webSocket(target.url).pipe(
      finalize(() => {
        console.log('delete');
        delete this.streams[target.url];
      }),
      map(rsp => {
        appendResponseToBufferedData(rsp, data);
        return [data];
      })
    );
    this.streams[target.url] = stream;
    return stream;
  }
  // getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
  //   const data = new CircularDataFrame({ capacity: target.size });
  //   data.addField({ name: 'value', type: FieldType.string });
  //   let stream: WebSocketSubject<any> = webSocket(target.url);
  //   const observableA = stream.multiplex(
  //     () => ({ subscribe: 'A' }), // When server gets this message, it will start sending messages for 'A'...
  //     () => ({ unsubscribe: 'A' }), // ...and when gets this one, it will stop.
  //     message => true // If the function returns `true` message is passed down the stream. Skipped if the function returns false.
  //   );
  //   let obj = observableA.pipe(
  //     map(rsp => {
  //       console.log(rsp);
  //       let value = Math.random() * 100;
  //       data.values.value.add(`${value}`);
  //       return [data];
  //     })
  //   );
  //   return obj;
  // }
}
