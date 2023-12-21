/**
 * lex is a simplified lexer
 * it should not do more than needed to build a new DOM tree
 */

import { ValueOf } from "../../common/valueof";

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

type LexToken = {
  type: ValueOf<typeof Tokens>;
  content: string;
};

const is_whitespace = (ch: string) => {
  console.log("checking whitespace for :", ch, '"');
  if ([" ", "\t", "\n"].includes(ch)) return true;
  return false;
};

const is_newline_or_tab = (ch: string) => {
  return ch === "\n" || ch === "\t";
};

const is_letter = (ch: string) => {
  return ch.match(/[a-z]/i);
};

const is_ident_char = (ch: string) => {
  console.log("from is ident, :", ch);
  if (is_whitespace(ch)) return false;
  if (ch === "=") return false;
  if (ch === '"') return false;
  if (ch === ">") return false;
  if (ch === "<") return false;

  return true;
};

const str_from_to = (
  str: string,
  from: number,
  to: number,
) => {};

export const lexer = (input: string): LexToken[] => {
  const result: LexToken[] = [];

  let pos = -1;
  let finished = () => pos == input.length - 1;
  let get_ch = () => input[pos]!;
  let in_tag_braces = false;
  let in_closing_tag = false;
  let in_script_or_style_tag: "script" | "style" | null = null;

  const next_char = () => {
    if (finished()) return;
    pos++;
  };

  const peek_back = () => {
    if (pos <= 0) return "";
    return input[pos - 1]!;
  };

  const peek_next = () => {
    if (pos + 1 >= input.length) return "";
    return input[pos + 1]!;
  };

  const read_ident = () => {
    let from = pos;
    console.log("read ident", get_ch());
    next_char();

    while (is_ident_char(get_ch())) {
      next_char();
    }

    pos--;

    return input.slice(from, pos + 1);
  };

  const read_string = () => {
    let from = pos;
    console.log("read string", get_ch());
    next_char();

    while (!finished() && get_ch() !== '"') {
      next_char();
    }

    return input.slice(from + 1, pos);
  };

  const read_text_node = () => {
    let from = pos;
    if (finished()) return "";

    next_char();

    while (!finished() && get_ch() !== "<") {
      next_char();
    }

    pos--;

    return input.substring(from, pos + 1);
  };

  const read_until_closed_with = (
    closing_tag: typeof in_script_or_style_tag,
  ) => {
    let output = "";
    if (finished()) return "";
    const exitTag = `</${closing_tag}`;
    console.log("exit tag is ", exitTag);

    next_char();

    while (!finished()) {
      output += get_ch();
      if (output.toLowerCase().endsWith(exitTag.toLowerCase()))
        break;
      next_char();
    }
    // pos--;

    pos -= exitTag.length + 1;

    return output.slice(0, -exitTag.length);
  };

  const skip_whitespace = () => {
    while (in_tag_braces && is_whitespace(get_ch())) {
      next_char();
    }
  };

  const is_script_or_style_tag = (token: LexToken) => {
    const is_ident = token.type === Tokens.Ident;

    return (
      is_ident &&
      ["style", "script"].includes(token.content.toLowerCase())
    );
  };

  const next_token = () => {
    next_char();
    skip_whitespace();

    let token: LexToken = {
      type: Tokens.Illegal,
      content: get_ch(),
    };

    const ch = get_ch();
    console.log('scanning letter: "', ch, '".');

    switch (ch) {
      case "=":
        token.type = Tokens.Eq;
        break;
      case "{":
        token.type = Tokens.LCurl;
        break;
      case "}":
        token.type = Tokens.RCurl;
        break;
      case "!":
        token.type = Tokens.Excl;
        break;
      case "<":
        token.type = Tokens.Lt;
        break;
      case ">":
        token.type = Tokens.Gt;
        break;
      case "/":
        token.type = Tokens.Slash;
        break;
    }

    if (token.type === Tokens.Lt) in_tag_braces = true;
    if (token.type === Tokens.Gt) in_tag_braces = false;
    if (token.type === Tokens.Slash && peek_back() === "<")
      in_closing_tag = true;
    if (token.type === Tokens.Gt && in_closing_tag)
      in_closing_tag = false;
    if (in_tag_braces && is_letter(ch)) {
      token.type = Tokens.Ident;
      token.content = read_ident();
    }
    if (in_tag_braces && is_script_or_style_tag(token)) {
      if (in_closing_tag) {
        in_script_or_style_tag = null;
      } else {
        in_script_or_style_tag =
          token.content as typeof in_script_or_style_tag;
      }
    }
    //
    if (ch === '"') {
      token.type = Tokens.String;
      token.content = read_string();
    }

    if (
      !in_script_or_style_tag &&
      !in_tag_braces &&
      token.type === Tokens.Illegal
    ) {
      token.type = Tokens.Text;
      token.content = read_text_node();

      // skip if empty text node
      if (!token.content.trim()) return;
    }

    if (in_script_or_style_tag && !in_tag_braces) {
      token.type = Tokens.Text;
      token.content = read_until_closed_with(
        in_script_or_style_tag,
      );
    }

    result.push(token);
  };

  while (true) {
    if (finished()) break;

    next_token();
  }

  const read_word = () => {
    let from = pos;
    next_char();

    while (!is_whitespace(get_ch())) {
      next_char();
    }

    return input.slice(from, pos);
  };

  return result;
};
