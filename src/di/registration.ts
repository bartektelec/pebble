import { register, scoped, singleton } from "./container";

let registered = false;

export const registerServices = () => {
  if (registered) return;

  // register("dateTime", singleton(DateTimeProvider));

  registered = true;
};
