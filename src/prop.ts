import { effect } from "./effect";

/**
 * prop is a method used to one-way bind a signal value to a HTMLElement property using a conditional check
 */

export const prop =
  (on: ReturnType<typeof effect>) =>
  <E extends Element, P extends keyof E>(
    element: E,
    propertyName: P,
    cb: () => E[P],
  ) => {
    on(() => {
      element[propertyName] = cb();
    });
  };
