import {
  CtxInternal,
  CtxEffect,
  MutPrimitiveSignal,
  MutObjectSignal,
  MutSignal,
} from "./types";

const is_key = (target: object, p: string | symbol) =>
  Object.keys(target).includes(p as string);

const is_proxifyable = (input: unknown) =>
  typeof input === "object" && input !== null;

const recur_proxify =
  (ctx: CtxInternal) =>
  <T>(input: T): T => {
    // @ts-expect-error types be hard
    return Object.entries(input).reduce((curr, [key, val]) => {
      if (is_proxifyable(val)) {
        // @ts-expect-error yeah it does shut up
        curr[key] = mut(ctx)(val);
      }
      return curr;
    }, input);
  };

export const mut =
  (ctx: CtxInternal) =>
  <T>(input: T): MutSignal<T> => {
    const key_subs: Record<string | symbol, Set<CtxEffect>> = {};
    const subs: Set<CtxEffect> = new Set([]);

    const wrapped = is_proxifyable(input)
      ? (recur_proxify(ctx)(input) as MutObjectSignal<T>)
      : ({
          value: input,
        } as MutPrimitiveSignal<T>);

    // @ts-expect-error conditional typing be hard
    return new Proxy(wrapped, {
      get(target, p, receiver) {
        const fx = ctx.running_effect;
        if (fx) {
          if (is_key(target, p)) {
            if (!key_subs[p]) key_subs[p] = new Set();

            key_subs[p]?.add(fx);
          } else {
            subs.add(fx);
          }
        }
        return Reflect.get(target, p, receiver);
      },
      set(target, p, newValue) {
        const old = Reflect.get(target, p);
        let _val = newValue;

        if (old === undefined && is_proxifyable(newValue)) {
          _val = recur_proxify(newValue);
        }

        const changed = Reflect.set(target, p, _val);

        if (old === changed) return false;

        if (is_key(target, p) && key_subs[p]) {
          key_subs[p]!.forEach((fx) => fx());
        }

        subs.forEach((fx) => fx());

        return changed;
      },
    });
  };
