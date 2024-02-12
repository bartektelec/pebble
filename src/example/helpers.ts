import { ctx } from "../signals/ctx";
import { ast } from "../template/ast/ast";
import { lexer } from "../template/lex/lexer";
import { traverse } from "../template/traverse/traverse";

export const context = ctx();
export const component = (template: string, imports = {}) =>
  traverse(ast(lexer(template)), imports).join("");

// this does literally nothing, just triggers the LSP
export const html = (
  a: TemplateStringsArray,
  ...b: string[]
): string => {
  console.log(a, b);
  const result = a.map((x, i) => x + (b[i] ?? "")).join("");

  return result;
};
