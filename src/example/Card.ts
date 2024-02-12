import { component, html } from "./helpers";
import AppButton from "./Button.ts";

export default () =>
  component(
    html` <div class="card">
      <h1>This is a card</h1>
      <span
        >This is a counter
        <div data-appid="abcd" class="bold">0</div></span
      >
      <p>
        This is a long text Lorem ipsum dolor sit amet, qui minim
        labore adipisicing minim sint cillum sint consectetur
        cupidatat.
      </p>
      <AppButton from="2" />
    </div>`,
    { AppButton },
  );
