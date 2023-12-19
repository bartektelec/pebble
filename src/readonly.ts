const SYMBOL_READONLY = Symbol("READONLY");

type DerivedSignal<T extends object> = T & { [SYMBOL_READONLY]: true };
type DerivedPrimitiveSignal<T> = DerivedSignal<{ value: T }>;
