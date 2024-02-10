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

const parser = new DOMParser();
const enhance = (
  components: Record<string, typeof HTMLElement>,
  domstring: string,
) => {
  let output = domstring;

  // Object.entries(components).forEach(([k,v]) => {
  //
  //
  // })
  //

  const html = parser.parseFromString(templ, "application/xml");
  console.log(html);

  Object.entries(components).forEach(([k, v]) => {
    console.log(html.body.querySelectorAll(k));
    customElements.define(`app-${k.toLowerCase()}`, v);
  });
};

enhance(components, templ);

// const html = parser.parseFromString(templ, "text/html");
//
// console.log(html);
// document.body.innerHTML = html.body.innerHTML;
