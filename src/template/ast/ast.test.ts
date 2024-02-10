import { Tokens } from "../types";
import { NodeTypes, ast } from "./ast";

describe("ast", () => {
  it("should compose one ASTNode", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual("<div />");
  });

  it("should compose sibling ASTNode", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual("<div />");
    expect(result[1]!.toString()).toEqual("<span />");
  });

  it("should allow adding text content", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.String, content: "Hello world" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual(
      "<div>Hello world</div>",
    );
  });

  it("should allow adding attributes", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Ident, content: "class" },
      { type: Tokens.Eq, content: "=" },
      { type: Tokens.String, content: "header" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.String, content: "Hello world" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual(
      `<div class="header">Hello world</div>`,
    );
  });

  it("should work with nested nodes", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Ident, content: "class" },
      { type: Tokens.Eq, content: "=" },
      { type: Tokens.String, content: "header" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.String, content: "Hello" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.String, content: "world" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual(
      `<div class="header"><span>Hello</span>world</div>`,
    );
  });

  it("should work with nested sibling nodes", () => {
    const input = [
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Ident, content: "class" },
      { type: Tokens.Eq, content: "=" },
      { type: Tokens.String, content: "header" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.String, content: "Hello" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "span" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Ident, content: "img" },
      { type: Tokens.Ident, content: "src" },
      { type: Tokens.Eq, content: "=" },
      { type: Tokens.String, content: "pathToFile.png" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Gt, content: ">" },
      { type: Tokens.Lt, content: "<" },
      { type: Tokens.Slash, content: "/" },
      { type: Tokens.Ident, content: "div" },
      { type: Tokens.Gt, content: ">" },
    ];

    const result = ast(input);

    expect(result[0]!.toString()).toEqual(
      `<div class="header"><span>Hello</span><img src="pathToFile.png" /></div>`,
    );
  });
});
