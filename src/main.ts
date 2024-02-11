import { ctx } from "./signals/ctx";
import { MutPrimitiveSignal } from "./signals/types";

const { $signal, $bind, $html, $each } = ctx();

const $bindInput = (
  a: HTMLElement,
  signal: MutPrimitiveSignal<string>,
) => $bind(a as HTMLInputElement, "value", signal, "value");

// -------------------- APPLICATION STATE --------------------

type Todo = {
  title: string;
  checked: boolean;
};

const todos = $signal<Todo[]>([]);
const current = $signal("");

function addTodo() {
  const newTodo = {
    title: current.value,
    checked: false,
  };

  todos.push(newTodo);
  current.value = "";
}

// TODO: declaring everything below and binding manually to state and handlers won't be neccessary when templating feature is done
// -------------------- CREATE DOM NODES --------------------

// Create DOM Nodes
document.body.innerHTML = `
<input type='text' id="todo-text"/>
<button type="button" id="add-button">Add</button>
<div id="todo-list"></div>
`;

// Create derived signal that returns a each'd DOM node (raw html) list
const elements = $each(
  todos,
  // @ts-expect-error typing be hard
  (t, i) => `<li>${i + 1}: ${t.title}</li>`,
);

// Grab references to DOM nodes
const [inputRef, btnRef, listRef] = (
  ["#todo-text", "#add-button", "#todo-list"] as const
).map((x) => document.querySelector(x) as HTMLElement);

// Render each list item
// $html(
//   listRef!,
//   () => `
//     <p>Here is your list</p>
//     <ul>
//       ${elements.value.join("")}
//     </ul>
//   `,
// );
// -------------------- COMBINE SIGNALS WITH DOM NODES --------------------

$bindInput(inputRef!, current); // two-way bind signal with input value
btnRef!.onclick = addTodo; // attach an event handler
