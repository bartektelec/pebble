import { ValueOf } from "../../common/valueof";
import { LexToken, Tokens } from "../types";

/*
 * ast is a simplified token to AST (DOM) tree builder
 */
export const NodeTypes = {
  element: Symbol("element"),
  text: Symbol("text"),
} as const;

export type ASTChildNode = ASTNode | string;

export class ASTNode {
  attributes: Record<string, string>;
  children: (ASTNode | string)[];
  private attr_name: string = "";

  constructor(
    readonly parent: ASTNode | null,
    readonly tag: string | null,
  ) {
    this.attributes = {};
    this.children = [];
  }

  open(tag: string) {
    const n = new ASTNode(this, tag);
    this.children.push(n);

    return n;
  }

  attr(str: string) {
    this.attr_name = str;

    return this;
  }

  attr_val(val: string) {
    this.attributes[this.attr_name] = val;
    this.attr_name = "";

    return this;
  }

  close() {
    if (!this.parent) return this; // should never happen if html is valid
    return this.parent;
  }

  text(n: string) {
    this.children.push(n);
    return this;
  }

  private stringAttributes() {
    return Object.entries(this.attributes).map(
      ([k, v]) => `${k}="${v}"`,
    );
  }

  private stringChildren() {
    return this.children.map((x) => x.toString()).join("");
  }

  private stringOpenTag() {
    if (this.tag === null) return "";
    const tagContent = [
      this.tag,
      ...this.stringAttributes(),
    ].join(" ");
    return `<${tagContent}>`;
  }

  private stringCloseTag() {
    if (this.tag === null) return "";
    return `</${this.tag}>`;
  }

  toString(): string {
    if (this.children.length) {
      return `${this.stringOpenTag()}${this.stringChildren()}${this.stringCloseTag()}`;
    }

    if (this.tag === null) return "";

    // self-closing tag
    return `${this.stringOpenTag().slice(0, -1)} />`;
  }
}

export const ast = (input: LexToken[]): (ASTNode | string)[] => {
  let current_node = new ASTNode(null, null);
  let opened_tag_brackets = false;
  let in_closing_tag = false;

  input.forEach((token, i) => {
    const last_token = input[i - 1]!;
    if (token.type === Tokens.Lt) {
      opened_tag_brackets = true;
      return;
    }

    if (
      token.type === Tokens.Ident &&
      opened_tag_brackets &&
      !in_closing_tag
    ) {
      if (last_token.type === Tokens.Lt) {
        current_node = current_node.open(token.content);
      }
      current_node.attr(token.content);

      return;
    }

    if (token.type === Tokens.Gt && opened_tag_brackets) {
      if (in_closing_tag) {
        current_node = current_node.close();
        in_closing_tag = false;
      }

      opened_tag_brackets = false;
      return;
    }

    if (token.type === Tokens.Slash && opened_tag_brackets) {
      in_closing_tag = true;
      return;
    }

    if (
      token.type === Tokens.String ||
      token.type === Tokens.Text
    ) {
      if (opened_tag_brackets && !in_closing_tag) {
        current_node.attr_val(token.content);
      } else {
        current_node.text(token.content);
      }
      return;
    }
  });

  return current_node.close().children;
};
