import { ctx } from "../signals/ctx";
import Page from "./Page";

// helper
const get = <T extends HTMLElement>(x: string) =>
  document.querySelector<T>(x)!;

// create app context
const { $signal, $effect, $computed } = ctx();

// render parsed template
document.body.innerHTML = Page.toString();

// GRAB REFERENCES TO HTML OBJECTS, TODO: DO THIS IN TEMPLATING
const counterOutput = get(`[data-appid="abcd"]`)!;
const doubledOutput = get(`[data-appid="abc2"]`)!;
const counterButton = get<HTMLButtonElement>(".cool-button")!;

// DECLARE STATE
const counter = $signal(0);
const doubled = $computed(() => counter.value * 2);

// BIND STATE AND EVENT HANDLERS TO HTML TODO: DO THIS IN TEMPLATING
counterButton.onclick = () => {
  counter.value++;
};

$effect(() => {
  counterOutput.textContent = counter.value.toString();
});
$effect(() => {
  doubledOutput.textContent = doubled.value.toString();
});
