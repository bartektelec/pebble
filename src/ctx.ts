import { effect } from "./effect";
import { mut } from "./mutable";
import { CtxInternal } from "./types";
/**
 * Context is a wrapper around an app or a piece of logic that acts as a
 * manager around currently running effects and signal subscriptions.
 */

export const create_internal_context = (): CtxInternal => ({
  running_effect: null,
});

export const ctx = (debug = false) => {
  const _ctx = create_internal_context();

  const $signal = mut(_ctx);
  const $effect = effect(_ctx);

  return { $signal, $effect };
};
