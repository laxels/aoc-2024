/*
  eslint no-restricted-imports: ["error", {"patterns": ["*"]}]
  -----
  This file should not import anything because it is imported by files that
  must be imported/run before anything else is imported/run (initialization code).

  If an import NEEDS to be added, first ensure that it plays nicely with the considerations above.
  If it does, then add it and disable this specific ESLint rule for that import line only.
*/

export type Fn<In extends any[] = any[], Out = unknown> = (...args: In) => Out;
export type AsyncFn<In extends any[] = any[], Out = unknown> = (...args: In) => Promise<Out>;

export type MayReturnVoid<F extends AsyncFn> = (
  ...args: Parameters<F>
) => Promise<Awaited<ReturnType<F>> | void>;

export type TypeofResult =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

export type FromTypeofResult<T extends TypeofResult> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'bigint'
      ? bigint
      : T extends 'boolean'
        ? boolean
        : T extends 'symbol'
          ? symbol
          : T extends 'undefined'
            ? undefined
            : T extends 'object'
              ? object | null
              : T extends 'function'
                ? Fn
                : never;

export type Nullable<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type EmptyObject = Record<string, never>;

export type PartialNullable<T> = Nullable<{
  [K in keyof T]?: Nullable<T[K]>;
}>;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
      ? RecursivePartial<T[P]>
      : T[P];
};

export type ReplaceTypes<T, Source, Target> = T extends Source
  ? Target
  : T extends object
    ? { [K in keyof T]: ReplaceTypes<T[K], Source, Target> }
    : T;

export function isStringRecord(obj: unknown): obj is Record<string, string> {
  if (obj == null) {
    return false;
  }
  if (typeof obj !== 'object') {
    return false;
  }
  if (Array.isArray(obj)) {
    return false;
  }
  if (Object.getOwnPropertySymbols(obj).length > 0) {
    return false;
  }
  return Object.getOwnPropertyNames(obj).every((prop) => typeof (obj as any)[prop] === 'string');
}

export function assertNever(...args: never[]): void {}
