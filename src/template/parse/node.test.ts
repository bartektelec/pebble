import { parse_node } from "./node";

describe("parse_node", () => {
  it("should return exactly the same node html if raw", () => {
    const input = "<div>Hello world</div>";

    expect(parse_node(input)).toEqual({ html: input });
  });

  it("should trim the html", () => {
    const input = " <div>Hello world</div>  ";

    expect(parse_node(input)).toEqual({ html: input.trim() });
  });

  it("should replace ");
});
