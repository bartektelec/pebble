import { effect } from "../signals/effect";

/**
 * classname is a method used to one-way bind a signal value to a HTMLElement classes using a conditional check
 */
export const classname =
  (on: ReturnType<typeof effect>) =>
  <E extends Element>(
    element: E,
    classname: string,
    cb: () => boolean,
  ) => {
    on(() => {
      const ok = cb();
      if (ok) {
        element.classList.add(classname);
      } else {
        element.classList.remove(classname);
      }
    });
  };
