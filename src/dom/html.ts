import { effect } from "../signals/effect";

/**
 * text is a method used to one-way bind a signal value to a HTMLElement textContent using a template
 */

export const html =
  (on: ReturnType<typeof effect>) =>
  <E extends Element>(element: E, cb: () => string) => {
    on(() => {
      element.innerHTML = cb();
    });
  };
