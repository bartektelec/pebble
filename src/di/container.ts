import type {
  ScopedEvent,
  ServiceProvider,
} from "./container.type";

const singletons = new Map();

type AnyClass<T> = { new (...args: any[]): T };
type AnyFn<T> = { (...args: any[]): T };
type DepInput<T> = AnyClass<T> | AnyFn<T>;
type ScopedClass<T> = { new (...args: [ScopedEvent]): T };

const isClassConstructor = <T>(
  Input: DepInput<T>,
): Input is AnyClass<T> => {
  try {
    new (Input as AnyClass<T>)();
  } catch {
    return false;
  }
  return true;
};

const instantiate = <T>(Input: DepInput<T>) => {
  if (isClassConstructor(Input)) return new Input();
  return Input();
};

export const scoped = <K extends any>(
  C: ScopedClass<K>,
): (() => (e: ScopedEvent) => K) => {
  return () => (e: ScopedEvent) => new C(e);
};

export const transient = <K extends any>(
  C: DepInput<K>,
): (() => K) => {
  return () => instantiate(C);
};

export const singleton = <K extends any>(
  C: DepInput<K>,
): (() => K) => {
  return () => {
    if (!singletons.has(C)) {
      singletons.set(C, instantiate(C));
    }
    return singletons.get(C);
  };
};

type ServiceProviderContainer = {
  [P in keyof ServiceProvider]: () => ServiceProvider[P];
};

export const container = {} as ServiceProviderContainer;

export const register = <T extends keyof ServiceProvider>(
  key: T,
  value: ServiceProviderContainer[T],
) => {
  container[key] = value;
};
