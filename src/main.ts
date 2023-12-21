import { ctx } from "./signals/ctx";

const {
  $signal,
  $computed,
  $bind,
  $text,
  $effect,
  $attr,
  $class,
  $if,
  $html,
  $each,
} = ctx();

// Create DOM Nodes
document.body.innerHTML = `
<input type='text' id="todo-text"/>
<button type="button" id="add-button">Add</button>
<div id="todo-list"></div>`;

// Grab references to DOM nodes
const [inputRef, btnRef, listRef] = (
  ["#todo-text", "#add-button", "#todo-list"] as const
).map((x) => document.querySelector(x) as HTMLElement);

type Todo = {
  title: string;
  checked: boolean;
};

// Declare application state
const todos = $signal<Todo[]>([]);
const current = $signal("");
const addTodo = () => {
  const newTodo = {
    title: current.value,
    checked: false,
  };

  todos.push(newTodo);
  current.value = "";
};

// Assign state and event handlers to DOM nodes
$bind(inputRef as HTMLInputElement, "value", current, "value");
btnRef!.onclick = addTodo;

const elements = $each(
  () => todos,
  (t) => `<li>Title: ${t.title}</li>`,
);

const conditionalText = $if(
  () => todos.length >= 5,
  "Wow list is getting long man",
  "Not long list",
);

const cond = $if;

$html(
  listRef!,
  () => `
<p>Here is your list</p>
${conditionalText.value}
<ul>
${elements.value.join("")}
</ul>
`,
);

const h = (temp: string) => console.log(temp);

h(`
<div>This is a test: {count}</div>
<input type="number" bind:value={count}/>
<button onclick={() => count.value *= 2}>Click</button>
`);
