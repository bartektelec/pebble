import { ctx } from "../signals/ctx";
import { component, html } from "./helpers";

export default () => {
  const { $signal } = ctx();

  return component(
    html`<button class="cool-button">Increase counter</button>`,
  );
};
