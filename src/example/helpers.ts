import { ast } from "../template/ast/ast";
import { lexer } from "../template/lex/lexer";
import { traverse } from "../template/traverse/traverse";

export const component = (template: string, imports = {}) =>
  traverse(ast(lexer(template)), imports);

// this does literally nothing, just triggers the LSP
export const html = (a: TemplateStringsArray): string =>
  a.join();
