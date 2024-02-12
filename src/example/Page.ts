import { component, html } from "./helpers";
import Card from "./Card";

const SecretButton = (props: { min: number; max: number }) => {
  const handle = () => {
    alert(123);
  };

  return component(
    `<button
      class="sec-button"
      onclick={handle}
    >
      This is other button {props.min} - ${props.max}
    </button>`,
    { handle },
  );
};

console.log(SecretButton({ min: 0, max: 100 }));

export default () =>
  component(
    html`
      <style>
        button {
          color: white;
        }

        .cool-button {
          background: blue;
        }

        .sec-button {
          background: green;
        }

        .card {
          border: 1px solid red;
        }

        .bold {
          font-weight: 700;
          font-size: 18px;
        }
      </style>

      <main>
        <div>This is a full page</div>
        <section>
          <Card />
          <div>
            Doubled counter is :
            <span class="bold" data-appid="abc2">0</span>
          </div>
        </section>
        <footer>
          This button only applies to page
          <AppButton min="123" max="999" />
        </footer>
      </main>
    `,
    {
      Card,
      AppButton: SecretButton,
    },
  );
