import { effect } from "./effect";
import { mut } from "./mutable";
import { CtxInternal, ReadSignal } from "./types";

export const computed =
  (ctx: CtxInternal) =>
  <T>(fx: () => T): ReadSignal<T> => {
    const state = mut(ctx)({ value: null });
    effect(ctx)(() => {
      // @ts-expect-error no worries
      state.value = fx();
    });

    // @ts-expect-error this is fine
    return new Proxy(state, {
      set() {
        return false;
      },
    });
  };
