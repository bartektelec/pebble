import { CtxInternal } from "./types";
import { bind } from "../dom/bind";
import { classname } from "../dom/classname";
import { computed } from "./computed";
import { effect } from "./effect";
import { mut } from "./mutable";
import { attr } from "../dom/attr";
import { text } from "../dom/text";
import { prop } from "../dom/prop";
import { ifBlock } from "../dom/if";
import { html } from "../dom/html";
import { each } from "../dom/each";

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
  const $if = ifBlock($effect, $computed);
  const $html = html($effect);
  const $each = each($computed);

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
    $if,
    $html,
    $each,
  };
};
