import { ctx } from "./ctx";

const { $signal, $computed, $bind, $text, $attr, $class } =
  ctx();

const a = $signal(1);
const b = $signal(1);
const result = $computed(() => a.value * b.value);

document.body.innerHTML = `
<input id='a' type='number' />
<input id='b' type='number' />
<div id='result'></div>
`;

const aEl = document.querySelector<HTMLInputElement>("#a");
const bEl = document.querySelector<HTMLInputElement>("#b");
const resEl =
  document.querySelector<HTMLInputElement>("#result");

$bind(aEl!, "value", a, "value");
$bind(bEl!, "value", b, "value");
$text(
  resEl!,
  () =>
    `we combine ${a.value} with ${b.value} and get ${result.value}`,
);

$class(resEl!, "bg-red-500", () => a.value > 10);
$attr(resEl!, "disabled", () => String(a.value > 15));
