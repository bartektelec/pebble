import { computed } from "../signals/computed";

/**
 * each is a method used to one-way bind a signal value to iteratively render  HTML elements
 */
export const each =
  ($computed: ReturnType<typeof computed>) =>
  <E extends Element, E2 extends Element>(
    of: () => any[],
    cb: (x: any) => Element,
  ) => {
    // TODO add optimization to update one by one DOM node
    const block = $computed(() => {
      return of().map(cb);
    });

    return block;
  };
