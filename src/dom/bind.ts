import { prop } from "./prop";
import { MutSignal } from "../signals/types";

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
      // @ts-expect-error ??
      $prop(element, property, () => signal[signalProp]);

      // TODO: handle all cases
      element.addEventListener("change", (e) => {
        // @ts-expect-error ??
        signal[signalProp] = e.target[property];
      });
    }
  };
