import { effect } from "./effect";

/**
 * attr is a method used to one-way bind a signal value to a HTMLElement attribute using a conditional check
 */

export const attr =
  (on: ReturnType<typeof effect>) =>
  <E extends Element>(
    element: E,
    attributeName: string,
    cb: () => string,
  ) => {
    on(() => {
      element.setAttribute(attributeName, cb());
    });
  };
