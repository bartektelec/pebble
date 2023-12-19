export const SYMBOL_MUT = Symbol("MUTABLE");
export const SYMBOL_READONLY = Symbol("READONLY");

export type DerivedSignal<T extends object> = T & {
  [SYMBOL_READONLY]: true;
};
export type DerivedPrimitiveSignal<T> = DerivedSignal<{
  value: T;
}>;

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
