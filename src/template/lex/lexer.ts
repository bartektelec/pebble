/**
 * lex is a simplified lexer
 * it should not do more than needed to build a new DOM tree
 */

import { ValueOf } from "../../common/valueof";
import { LexToken, Tokens } from "../types";

const is_whitespace = (ch: string) => {
  if ([" ", "\t", "\n"].includes(ch)) return true;
  return false;
};

const is_letter = (ch: string) => {
  return ch.match(/[a-z]/i);
};

const is_ident_char = (ch: string) => {
  if (is_whitespace(ch)) return false;
  if (ch === "=") return false;
  if (ch === '"') return false;
  if (ch === ">") return false;
  if (ch === "<") return false;

  return true;
};

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

  const read_ident = () => {
    let from = pos;
    next_char();

    while (is_ident_char(get_ch())) {
      next_char();
    }

    pos--;

    return input.slice(from, pos + 1);
  };

  const read_string = () => {
    let from = pos;
    next_char();

    while (!finished() && !['"', "'"].includes(get_ch())) {
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

    next_char();

    while (!finished()) {
      output += get_ch();
      if (output.toLowerCase().endsWith(exitTag.toLowerCase()))
        break;

      next_char();
    }

    pos -= exitTag.length;
    in_script_or_style_tag = null;

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

    if (ch === '"' || ch === "'") {
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

    if (
      token.type === Tokens.Illegal &&
      in_script_or_style_tag &&
      !in_tag_braces
    ) {
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

  return result;
};
