import { CtxInternal } from "./types";
import { bind } from "./bind";
import { classname } from "./classname";
import { computed } from "./computed";
import { effect } from "./effect";
import { mut } from "./mutable";
import { attr } from "./attr";
import { text } from "./text";
import { prop } from "./prop";

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
  const $computed = computed(_ctx);

  const $text = text($effect);
  const $class = classname($effect);
  const $attr = attr($effect);
  const $prop = prop($effect);

  const $bind = bind($prop);

  return {
    $signal,
    $effect,
    $computed,
    $bind,
    $text,
    $class,
    $attr,
    $prop,
  };
};
