export interface QuotaExceededErrorOptions {
  quota?: number;
  requested?: number;
}

export interface QuotaExceededError extends DOMException {
  readonly quota: number | null;
  readonly requested: number | null;
}

export type ArrayBufferView =
  | Int8Array | Int16Array | Int32Array
  | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray
  | BigInt64Array | BigUint64Array
  | Float32Array | Float64Array | DataView;

export type BufferSource = ArrayBufferView | ArrayBuffer;

export type AllowSharedBufferSource =
  | ArrayBuffer
  | SharedArrayBuffer
  | ArrayBufferView;

export type FunctionCallback = (...args: any[]) => any;
export type VoidFunctionCallback = () => void;
