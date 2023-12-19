import { mut } from "./mutable";
import { CtxEffect, CtxInternal } from "./types";
/**
 * Context is a wrapper around an app or a piece of logic that acts as a
 * manager around currently running effects and signal subscriptions.
 */

export const create_internal_context = (): CtxInternal => ({
  running_effect: null,
});

export const ctx = () => {
  const _ctx = create_internal_context();

  const $ = mut(_ctx);

  return { $ };
};
