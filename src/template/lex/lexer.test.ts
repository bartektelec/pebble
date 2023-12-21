import { lexer, Tokens } from "./lexer";

const openBracket = (
  bracketName: string,
  attributes: Record<string, string> = {},
) => {
  const result = [
    { type: Tokens.Lt, content: "<" },
    { type: Tokens.Ident, content: bracketName },
  ];

  Object.entries(attributes).forEach(([key, val]) => {
    result.push({ type: Tokens.Ident, content: key });
    result.push({ type: Tokens.Eq, content: "=" });
    result.push({ type: Tokens.String, content: val });
  });

  result.push({ type: Tokens.Gt, content: ">" });

  return result;
};

const closeBracket = (bracketName: string) => {
  return [
    { type: Tokens.Lt, content: "<" },
    { type: Tokens.Slash, content: "/" },
    { type: Tokens.Ident, content: bracketName },
    { type: Tokens.Gt, content: ">" },
  ];
};

describe("lexer", () => {
  it("should return empty array for empty input", () => {
    const result = lexer("");
    expect(result.length).toEqual(0);
  });

  it("should return a set of tokens for a simple node", () => {
    const result = lexer("<div></div>");

    const expected = [
      Tokens.Lt,
      Tokens.Ident,
      Tokens.Gt,
      Tokens.Lt,
      Tokens.Slash,
      Tokens.Ident,
      Tokens.Gt,
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]);
    }
  });

  it("should read the contents of a ident", () => {
    const result = lexer("<div></div>");

    const expected = ["<", "div", ">", "<", "/", "div", ">"];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.content).toEqual(expected[i]);
    }
  });

  it("should read attribute in a tag", () => {
    const result = lexer(
      '<div id="abc" max="1" data-testid="this is a long string"></div>',
    );
    const expected = [
      ...openBracket("div", {
        id: "abc",
        max: "1",
        "data-testid": "this is a long string",
      }),
      ...closeBracket("div"),
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });

  it("should read plain text node content", () => {
    const result = lexer("<div>this is just a plain text</div>");

    const expected = [
      ...openBracket("div"),
      {
        type: Tokens.Text,
        content: "this is just a plain text",
      },
      ...closeBracket("div"),
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });

  it("should read nested nodes", () => {
    const result = lexer(
      '<div>this is <span class="bold">just</span> a plain text</div>',
    );

    const expected = [
      ...openBracket("div"),
      {
        type: Tokens.Text,
        content: "this is ",
      },

      ...openBracket("span", {
        class: "bold",
      }),
      {
        type: Tokens.Text,
        content: "just",
      },
      ...closeBracket("span"),
      {
        type: Tokens.Text,
        content: " a plain text",
      },
      ...closeBracket("div"),
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });
  it("should handle trailing and leading whitespace", () => {
    const result = lexer(`

  
  <div>This is something new</div>  `);

    const expected = [
      ...openBracket("div"),
      { type: Tokens.Text, content: "This is something new" },
      ...closeBracket("div"),
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });

  it("should tokenize complex html structure", () => {
    const result = lexer(`
      <div>This is something new</div>
      <main>
        <header class="app-header">
          <h1>Hello world</h1>
        </header>

        <button type="button">Click me</button>

      <p>This is a text <span>bold</span></p>
      </main>
    Trailing text
      `);

    const expected = [
      ...openBracket("div"),
      { type: Tokens.Text, content: "This is something new" },
      ...closeBracket("div"),
      ...openBracket("main"),
      ...openBracket("header", { class: "app-header" }),
      ...openBracket("h1"),
      { type: Tokens.Text, content: "Hello world" },
      ...closeBracket("h1"),
      ...closeBracket("header"),
      ...openBracket("button", { type: "button" }),
      { type: Tokens.Text, content: "Click me" },
      ...closeBracket("button"),

      ...openBracket("p"),
      { type: Tokens.Text, content: "This is a text " },
      ...openBracket("span"),
      { type: Tokens.Text, content: "bold" },
      ...closeBracket("span"),
      ...closeBracket("p"),
      ...closeBracket("main"),

      {
        type: Tokens.Text,
        content: "\n    Trailing text\n     ",
      },
    ];

    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });

  it("should not tokenize script and style tags", () => {
    const result = lexer(`
      <script lang="ts">
        let x = 10;
        let name = "adam"

        function sum = (a,b) => a + b;
        const isLower = (a,b) => a < b;
      </script>

      <div>This is something new</div>
    Trailing text

      <style>
        .app-header {
          color: red;
          border-width: 20px;
        }
      </style>
      `);

    const expected = [
      ...openBracket("script", { lang: "ts" }),
      {
        type: Tokens.Text,
        content: `
                let x = 10;
        let name = "adam"

        function sum = (a,b) => a + b;
        const isLower = (a,b) => a < b;
`,
      },
      ...closeBracket("script"),
      ...openBracket("div"),
      { type: Tokens.Text, content: "This is something new" },
      ...closeBracket("div"),
      {
        type: Tokens.Text,
        content: "\n    Trailing text\n     ",
      },
    ];

    console.log(JSON.stringify(result, null, 3));
    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });
  it.only("should not tokenize script and style tags", () => {
    const result = lexer(`<script lang="ts">
        let x = 10;
        let name = "adam"

        function sum = (a,b) => a + b;
        const isLower = (a,b) => a < b;
      </script>`);

    const expected = [
      ...openBracket("script", { lang: "ts" }),
      {
        type: Tokens.Text,
        content: `
                let x = 10;
        let name = "adam"

        function sum = (a,b) => a + b;
        const isLower = (a,b) => a < b;
`,
      },
      ...closeBracket("script"),
    ];

    console.log(JSON.stringify(result, null, 3));
    console.log(JSON.stringify(expected, null, 3));
    expect(expected.length).toEqual(result.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.type).toEqual(expected[i]!.type);
      expect(result[i]?.content).toEqual(expected[i]!.content);
    }
  });
});
