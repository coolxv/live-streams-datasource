//import { FieldType, DataQueryResponse, CircularDataFrame } from '@grafana/data';
import { KeyValue, DataFrame } from '@grafana/data';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { LiveStreamsTarget } from './Types';
import { map, finalize } from 'rxjs/operators';
import { createResponseBufferedData, appendResponseToBufferedData } from './ResultTransformer';

export class LiveStreams {
  /**
   * Cache of websocket streams that can be returned as observable. In case there already is a stream for particular
   * target it is returned and on subscription returns the latest dataFrame.
   */
  private streams: KeyValue<Observable<DataFrame[]>> = {};

  // getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
  //   let stream = this.streams[target.url];
  //   if (!stream) {
  //     const data = createResponseBufferedData(target);
  //     let streams = this.streams;
  //     stream = webSocket({
  //       url: target.url,
  //       closingObserver: {
  //         next() {
  //           console.log('closingObserver');
  //         },
  //       },
  //       closeObserver: {
  //         next(e) {
  //           console.log('closeObserver');
  //           delete streams[target.url];
  //         },
  //       },
  //       openObserver: {
  //         next() {
  //           console.log('openObserver');
  //         },
  //       },
  //     }).pipe(
  //       map(rsp => {
  //         appendResponseToBufferedData(rsp, data);
  //         return [data];
  //       })
  //     );
  //     this.streams[target.url] = stream;
  //   }
  //   let obs = new Observable<DataFrame[]>(subscriber => {
  //     let observer = {
  //       next: (msg: any) => subscriber.next(msg),
  //       error: (err: any) => subscriber.error(err),
  //       complete: () => subscriber.complete(),
  //     };
  //     let subscription: Subscription = stream.subscribe(observer);
  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   });
  //   return obs;
  // }
  getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
    let stream = this.streams[target.url];
    if (stream) {
      return stream;
    }
    let streams = this.streams;
    const data = createResponseBufferedData(target);
    stream = webSocket({
      url: target.url,
      closingObserver: {
        next() {
          console.log('closingObserver');
        },
      },
      closeObserver: {
        next() {
          console.log('closeObserver');
          (<WebSocketSubject<any>>stream).unsubscribe();
          delete streams[target.url];
        },
      },
      openObserver: {
        next() {
          console.log('openObserver');
        },
      },
    }).pipe(
      finalize(() => {
        console.log('finalize');
      }),
      map(rsp => {
        appendResponseToBufferedData(rsp, data);
        return [data];
      })
    );
    this.streams[target.url] = stream;
    return stream;
  }
}
