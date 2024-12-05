import _ from 'lodash';

import { stringify } from './json';

export function log(...args: unknown[]): void {
  console.log(...args.map(format));
}
export function logError(...args: unknown[]): void {
  console.error(...args.map(format));
}

function format(x: unknown): unknown {
  if (_.isPlainObject(x) || Array.isArray(x)) {
    return stringify(x, 2);
  }
  return x;
}
