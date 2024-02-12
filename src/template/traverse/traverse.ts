/**
 *
 * walk ast tree and map nodes
 *
 */

import { ASTChildNode, ASTNode } from "../ast/ast";

export const traverse = (
  node: ASTChildNode[],
  components: Record<
    string,
    (props: Record<string, string>) => ASTChildNode[]
  >,
): ASTChildNode[] => {
  return node
    .map((x) => traverseRecurrsive(x, components))
    .flat();
};

export const traverseRecurrsive = (
  node: ASTChildNode,
  components: Record<
    string,
    (props: Record<string, string>) => ASTChildNode[]
  >,
): ASTChildNode => {
  if (typeof node === "string") return node;

  node.children = node.children
    .map((x) => traverseRecurrsive(x, components))
    .flat();
  return mapNode(node, components);
};

const mapNode = (
  node: ASTChildNode,
  mappers: Record<
    string,
    (params: Record<string, string>) => ASTChildNode[]
  >,
): ASTChildNode => {
  if (typeof node === "string") return node;
  const mapTo = mappers[node.tag!];
  if (mapTo) {
    return `<!--${node.tag}-->${mapTo(node.attributes)}`;
  }

  return node;
};
