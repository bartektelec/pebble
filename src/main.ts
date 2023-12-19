import { ctx } from "./ctx";

const { $signal, $effect } = ctx();

const counter = $signal(0);
const multiplier = $signal(1);

$effect(() => {
  document.body.textContent = `Adding ${
    multiplier.value
  } each second = ${counter.value.toString()}`;
});

document.body.onclick = () => {
  multiplier.value *= 2;
};

setInterval(() => {
  counter.value += multiplier.value;
}, 1000);
