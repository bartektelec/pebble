import { lexer } from "./lex/lexer";
import { ast } from "./ast/ast";

describe("from string to ast", () => {
  it("should lex a structure and parse it back to the same", () => {
    const template = `
<html>
  <body>
    <header class="header">
      <img src="http://example.com/funny-cat_picture.jpg?width=240" alt="cat picture" />
      <a class="link" href="#">Homepage</a>
    </header>

    <h1>This is <span>cool</span></h1>
  </body>
</html>
`;

    const tokens = lexer(template);
    const tree = ast(tokens);

    expect(tree.toString()).toMatchInlineSnapshot(
      `"<html><body><header class="header"><img src="http://example.com/funny-cat_picture.jpg?width=240" alt="cat picture" /><a class="link" href="#">Homepage</a></header><h1>This is <span>cool</span></h1></body></html>"`,
    );
  });
});
