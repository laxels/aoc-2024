/*
  eslint no-restricted-imports: ["error", {"patterns": ["*"]}]
  -----
  This file should not import anything because it is imported by files that
  must be imported/run before anything else is imported/run (initialization code).

  If an import NEEDS to be added, first ensure that it plays nicely with the considerations above.
  If it does, then add it and disable this specific ESLint rule for that import line only.
*/

// We use these functions instead of `JSON.stringify`/`JSON.parse` to preserve `Date` types and handle invalid escapes.

import type { Nullable } from '$lib/util/type'; // eslint-disable-line no-restricted-imports

import { sanitizeJsonString } from './sanitize'; // eslint-disable-line no-restricted-imports

// The `value` parameter received by `JSON.stringify`'s `replacer` function is the value AFTER it's been stringified.
// For this reason, we have to refer to `this[key]` to get the original, pre-stringified `Date` object.
// `this` is always the object that contains the `key` property.
// We have to use non-arrow functions here to get the correct `this` binding.

export function stringify(v: any, space?: string | number): string {
  return JSON.stringify(
    v,
    function (key, value) {
      if (this[key] instanceof Date) {
        return { __dateJsonPlaceholder: value };
      }
      return value;
    },
    space
  );
}

export function parse(s: string): any {
  return JSON.parse(sanitizeJsonString(s), function (key, value) {
    return convert(value);
  });
}

// TODO: Test that this actually works properly. I never ended up testing it.
export function convertRecursively(value: any): any {
  value = convert(value);
  if (value == null || value instanceof Date || typeof value !== `object`) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(convertRecursively);
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, convertRecursively(value)])
  );
}

function convert(value: any): any {
  if (
    value != null &&
    typeof value === `object` &&
    typeof value.__dateJsonPlaceholder === `string`
  ) {
    return new Date(value.__dateJsonPlaceholder);
  }
  return value;
}

export function stringifyNonString(v: any, space?: string | number): string {
  if (typeof v === `string`) {
    return v;
  }
  return stringify(v, space);
}

export function parseNonStrict(s: Nullable<string>): any {
  if (!s) {
    return null;
  }
  try {
    return parse(s);
  } catch {
    return null;
  }
}

type JsonSafe =
  | string
  | number
  | boolean
  | null
  | readonly JsonSafe[]
  | { readonly [key: string]: JsonSafe };

export type AssertJsonSafe<T extends JsonSafe> = T;
