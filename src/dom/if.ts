import { computed } from "../signals/computed";
import { effect } from "../signals/effect";

/**
 * ifBlock is a method used to one-way bind a signal value to conditionally render a HTML element
 */
export const ifBlock =
  (
    $effect: ReturnType<typeof effect>,
    $computed: ReturnType<typeof computed>,
  ) =>
  <E extends Element, E2 extends Element>(
    cb: () => boolean,
    element: string,
    elseElement: string = "",
  ) => {
    const block = $computed(() => {
      if (cb()) {
        return element;
      } else {
        return elseElement;
      }
    });

    return block;
  };
