export const SYMBOL_MUT = Symbol("MUTABLE");
export const SYMBOL_READONLY = Symbol("READONLY");

export type ReadObjectSignal<T extends object> = T;
export type ReadPrimitiveSignal<T> = ReadObjectSignal<{
  value: T;
}>;
export type ReadSignal<T> = T extends object
  ? ReadObjectSignal<T>
  : ReadPrimitiveSignal<T>;

export type MutObjectSignal<T> = T;
export type MutPrimitiveSignal<T> = {
  value: T;
};
export type MutSignal<T> = T extends object
  ? MutObjectSignal<T>
  : MutPrimitiveSignal<T>;

export type CtxEffect = () => void;
export type CtxInternal = {
  running_effect: CtxEffect | null;
};
