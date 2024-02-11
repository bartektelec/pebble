import { ast } from "../ast/ast";
import { lexer } from "../lex/lexer";
import { traverse } from "./traverse";

const make = (template: string) => ast(lexer(template));

describe("traverse", () => {
  it("should map over components", () => {
    const HelloWorld = make("<div>Hello world</div>");
    const template = make("<h1><HelloWorld /></h1>");

    const result = traverse(template, { HelloWorld });

    expect(result.toString()).toEqual(
      "<h1><div>Hello world</div></h1>",
    );
  });

  it("should map over nested components ", () => {
    const HelloWorld = make("<div>Hello world</div>");
    const template = make(
      "<h1><span><HelloWorld /></span></h1>",
    );

    const result = traverse(template, { HelloWorld });

    expect(result.toString()).toEqual(
      "<h1><span><div>Hello world</div></span></h1>",
    );
  });

  it("should map over nested nested nested components and text nodes", () => {
    const Hello = make("<div>Hello</div>");
    const World = make("<div>World</div>");
    const Text = make(`Boop`);
    const template = ast(
      lexer(`
<h1>
  <span>
    <h2>
      <Hello />
    </h2>
    <World />
    <Text />
  </span>
</h1>`),
    );

    const result = traverse(template, { Hello, World, Text });

    expect(result.toString()).toEqual(
      "<h1><span><h2><div>Hello</div></h2><div>World</div>Boop</span></h1>",
    );
  });

  it("should not leak injected components down", () => {
    const Button = make(
      '<button class="cool-button">Click</button>',
    );
    const Button2 = make(
      '<button class="secondary-button">This button is secret</button>',
    );
    const Card = traverse(make("Please <Button /> the button"), {
      Button,
    });

    const NotInjected = make(
      "<div>This component didnt inject <Button /></div>",
    );

    const Page = traverse(
      make(
        "<div><h1>This is a text</h1><Card /> and also this is a <Button /><NotInjected /><div>This is nested<span><Button /></span></div>",
      ),
      { Button: Button2, Card, NotInjected },
    );

    expect(Page.toString()).toMatchInlineSnapshot(`"<div><h1>This is a text</h1>Please <button class="cool-button">Click</button> the button and also this is a <button class="secondary-button">This button is secret</button><div>This component didnt inject <Button /></div><div>This is nested<span><button class="secondary-button">This button is secret</button></span></div></div>"`);
  });
});
