export const is_proxifyable = (input: unknown) =>
  typeof input === "object" && input !== null;
