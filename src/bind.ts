import { effect } from "./effect";
import { prop } from "./prop";
import { CtxInternal, MutSignal } from "./types";

/**
 * bind is a method used to two-way bind a signal value to a HTML element
 */
export const bind =
  ($prop: ReturnType<typeof prop>) =>
  <
    E extends Element,
    K extends keyof E,
    T,
    S extends MutSignal<T>,
    KS extends keyof S,
  >(
    element: E,
    property: K,
    signal: S,
    signalProp: KS,
  ) => {
    if (element instanceof HTMLInputElement) {
      $prop(element, property, () => signal[signalProp]);

      element.addEventListener("change", (e) => {
        signal[signalProp] = e.target[property];
      });
    }
  };
