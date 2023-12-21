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

    expect(result.length).toEqual(1);
    expect(result[0]!).toEqual({
      type: NodeTypes.element,
      attributes: {},
      children: [],
    });
  });
});
