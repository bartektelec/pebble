const RUNES = {
  HTML_LT: "<",
  HTML_HT: ">",
  HTML_CLOSE: "</",
  HTML_SELFCLOSE: "/>",
};

export const parse_node = (node_string: string) => {
  return { html: node_string.trim() };
};
