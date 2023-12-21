import { ValueOf } from "../common/valueof";

export const Tokens = {
  None: Symbol("none"),
  Lt: Symbol("lt"),
  Gt: Symbol("Gt"),
  Slash: Symbol("slash"),
  Ident: Symbol("ident"),
  String: Symbol("string"),
  Eq: Symbol("eq"),
  LCurl: Symbol("lcurl"),
  RCurl: Symbol("rcurl"),
  Text: Symbol("text"),
  Excl: Symbol("exclamation"),
  Illegal: Symbol("illegal"),
} as const;

export type LexToken = {
  type: ValueOf<typeof Tokens>;
  content: string;
};
