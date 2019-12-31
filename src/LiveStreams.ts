//import { FieldType, DataQueryResponse, CircularDataFrame } from '@grafana/data';
import { KeyValue, DataFrame } from '@grafana/data';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { LiveStreamsTarget } from './Types';
import { map, finalize } from 'rxjs/operators';
import { createResponseBufferedData, appendResponseToBufferedData } from './ResultTransformer';

export class LiveStreams {
  /**
   * Cache of websocket streams that can be returned as observable. In case there already is a stream for particular
   * target it is returned and on subscription returns the latest dataFrame.
   */
  private streams: KeyValue<Observable<DataFrame[]>> = {};

  getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
    let stream = this.streams[target.url];
    if (!stream) {
      console.log('new webSocket');
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
          },
        },
        openObserver: {
          next() {
            console.log('openObserver');
          },
        },
      }).pipe(
        finalize(() => {
          console.log('delete finalize ws');
          // delete this.streams[target.url];
        }),
        map(rsp => {
          appendResponseToBufferedData(rsp, data);
          return [data];
        })
      );
      this.streams[target.url] = stream;
    }
    let obs = new Observable<DataFrame[]>(subscriber => {
      console.log('new subscribing');
      let observer = {
        next: (msg: any) => subscriber.next(msg),
        error: (err: any) => {
          console.log('Observer got an error: ' + err);
          subscriber.error(err);
        },
        complete: () => {
          console.log('Observer got a complete notification');
          subscriber.complete();
        },
      };
      let subscription = stream.subscribe(observer);
      console.log(this.streams);
      return () => {
        subscription.unsubscribe();
        console.log('delete unsubscribing');
        console.log(this.streams);
      };
    });
    console.log(this.streams);
    return obs;
  }
  // getStream(target: LiveStreamsTarget): Observable<DataFrame[]> {
  //   let stream = this.streams[target.url];
  //   if (stream) {
  //     return stream;
  //   }
  //   const data = createResponseBufferedData(target);
  //   stream = webSocket(target.url).pipe(
  //     finalize(() => {
  //       console.log('delete');
  //       delete this.streams[target.url];
  //     }),
  //     map(rsp => {
  //       appendResponseToBufferedData(rsp, data);
  //       return [data];
  //     })
  //   );
  //   this.streams[target.url] = stream;
  //   return stream;
  // }
}
