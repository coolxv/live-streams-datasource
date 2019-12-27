import { config } from '@grafana/runtime';
import { LiveStreamsExpression, LiveStreamsQuery } from './Types';

export function parseParam(input: LiveStreamsQuery): LiveStreamsExpression {
  input = input || '';
  let query = input.queryText.trim();
  let type = input.queryType.trim();
  return { type, query };
}

export function serializeParams(data: Record<string, any>) {
  return Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');
}
export const convertToWebSocketUrl = (url: string) => {
  const requestIsLocal = url.match(/^http/);
  if (requestIsLocal) {
    return url.replace('http', 'ws');
  } else {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let backend = `${protocol}${window.location.host}${config.appSubUrl}`;
    if (backend.endsWith('/')) {
      backend = backend.slice(0, -1);
    }
    return `${backend}${url}`;
  }
};
