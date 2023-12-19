const SYMBOL_MUT = Symbol("MUTABLE");
const SYMBOL_READONLY = Symbol("READONLY");

type DerivedSignal<T extends object> = T & { [SYMBOL_READONLY]: true };
type DerivedPrimitiveSignal<T> = DerivedSignal<{ value: T }>;

type MutSignal<T extends object> = T & { [SYMBOL_MUT]: true };
type MutPrimitiveSignal<T> = MutSignal<{ value: T }>

type RunningEffect = () => void;


let runningFx: null | RunningEffect = null;

const $ = <T>(value: T): Signal<T> => {
  let _val = value;
  const subs: (() => void)[] = [];

  const getter = () => {
    const fx = runningFx;
    if (fx) {
      subs.push(fx);
    }

    return _val;
  };

  const setter = (newValue: T) => {
    _val = newValue;
    subs.forEach((fx) => fx());
  };

  // @ts-expect-error boop
  const result: Signal<T> = (...args: [T]) => {
    if (args.length) {
      return setter(args[0]);
    } else {
      return getter();
    }
  };

  result.get = getter;
  result.set = setter;

  return result;
};

const proxified = <T>(input: T) => {
  const subs: RunningEffect[] = [];

  return new Proxy<T>(input, {
    get(target, p, receiver) {
      const fx = runningFx;
      if (fx) {
        subs.push(fx);
      };
      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue) {
      const old = Reflect.get(target, p);
      const changed = Reflect.set(target, p, newValue);
      if (old === changed) return old;

      subs.forEach(fx => fx());

      return changed;
    }
  })
}

const effect = (cb: RunningEffect) => {
  runningFx = cb;
  cb();
  runningFx = null;
};


const count = proxified({ value: 0 });

effect(() => document.body.innerText = count.value.toString());

document.body.onclick = () => {
  count.value++;
}


export { $, effect, };

