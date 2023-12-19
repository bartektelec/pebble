type SignalGetter<T> = () => T;
type SignalSetter<T> = (newValue: T) => void;

type Signal<T> = SignalGetter<T> &
  SignalSetter<T> & {
    get: SignalGetter<T>;
    set: SignalSetter<T>;
  };

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

const effect = (cb: RunningEffect) => {
  runningFx = cb;
  cb();
  runningFx = null;
};


const count = $(0);

effect(() => document.body.innerText = count().toString());

document.body.onclick = () => {
  count.set(count() + 1);
}


export { $, effect, };

