const createCustomEl = (text: string) => {
  class CustomElement extends HTMLElement {
    counter = 1;
    constructor() {
      super();
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: "closed" });
      const wrapper = document.createElement("span");

      wrapper.innerText = text;
      wrapper.onclick = () => {
        wrapper.textContent = (this.counter++).toString();
      };
      shadow.appendChild(wrapper);
    }
  }

  return CustomElement;
};

const components = {
  HelloWorld: createCustomEl("This is hello world"),
  Counter: createCustomEl("COUNTER"),
} as const;

const templ = `
<style>
  .header {
  font-size: 1px;
  }
  </style>
<style type="scoped">
.footer {
  color: red;
}
</style>
<body>
<div>
<Counter></Counter>
<HelloWorld></HelloWorld>
</div>
</body>
`;

const change = (
  components: Record<string, typeof HTMLElement>,
  domstring: string,
) => {
  let output = domstring;

  // Object.entries(components).forEach(([k,v]) => {
  //
  //
  // })
  //
  Object.entries(components).forEach(([k, v]) => {
    customElements.define(`app-${k}`, v);
  });
};

change(components, templ);

const parser = new DOMParser();
const html = parser.parseFromString(templ, "text/html");

console.log(html);
document.body.innerHTML = html.body.innerHTML;
