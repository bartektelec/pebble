import { effect } from "./effect";

/**
 * text is a method used to one-way bind a signal value to a HTMLElement textContent using a template
 */
export const text =
  (on: ReturnType<typeof effect>) =>
  <E extends Element>(element: E, cb: () => string) => {
    on(() => {
      element.textContent = cb();
    });
  };
