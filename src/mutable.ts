import {
  CtxInternal,
  CtxEffect,
  MutPrimitiveSignal,
  MutObjectSignal,
  MutSignal,
} from "./types";

export const mut =
  (ctx: CtxInternal) =>
  <T>(input: T): MutSignal<T> => {
    const subs: CtxEffect[] = [];

    const wrapped =
      typeof input === "object" && input !== null
        ? (input as MutObjectSignal<T>)
        : ({ value: input } as MutPrimitiveSignal<T>);

    // @ts-expect-error conditional typing be hard
    return new Proxy(wrapped, {
      get(target, p, receiver) {
        const fx = ctx.running_effect;
        if (fx) {
          subs.push(fx);
        }
        return Reflect.get(target, p, receiver);
      },
      set(target, p, newValue) {
        const old = Reflect.get(target, p);
        const changed = Reflect.set(target, p, newValue);

        if (old === changed) return false;

        subs.forEach((fx) => fx());

        return changed;
      },
    });
  };
