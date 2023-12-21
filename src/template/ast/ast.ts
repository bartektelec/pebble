import { ValueOf } from "../../common/valueof";
import { LexToken, Tokens } from "../types";

/*
 * ast is a simplified token to AST (DOM) tree builder
 */
export const NodeTypes = {
  element: Symbol("element"),
  text: Symbol("text"),
} as const;

type ASTNode = {
  block: ValueOf<typeof NodeTypes>;
  tag: string;
  attributes: Record<string, string>;
  children: ASTNode[];
};

const get_empty_ast_node = () => ({
  block: NodeTypes.text,
  tag: "TextNode",
  attributes: {},
  children: [],
});

export const ast = (input: LexToken[]): ASTNode[] => {
  let current_tag: string | null = null;
  let opened_tag_brackets = false;
  let in_html_tag = false;
  let opened_nodes: ASTNode[] = [];
  let current_ast_node = {
    block: NodeTypes.text,
    attributes: {},
    children: [],
  };
  let output: ASTNode[] = [];

  input.forEach((token) => {
    if (token.type === Tokens.Lt) {
      opened_tag_brackets = true;
      return;
    }

    if (
      token.type === Tokens.Ident &&
      opened_tag_brackets &&
      !current_tag
    ) {
      const node = get_empty_ast_node();
      node.block = NodeTypes.element;
      node.tag = token.content;
      opened_nodes.push(node);
      return;
    }

    if (token.type === Tokens.Gt && opened_tag_brackets) {
      opened_tag_brackets = false;
    }
  });

  return output;
};
