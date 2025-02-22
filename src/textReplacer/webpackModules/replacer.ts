const REGEXP_REGEXP = /^\/(.+)\/(\w*)$/s;

export function apply(message: string) {
  const ignore = moonlight.getConfigOption<string>("textReplacer", "ignore");
  if (ignore && message.startsWith(ignore)) {
    return message.replace(ignore, "").trim();
  }

  const patterns =
    moonlight.getConfigOption<{ [_ in string]?: string }>(
      "textReplacer",
      "patterns",
    ) ?? {};

  for (const [search, replace = ""] of Object.entries(patterns)) {
    const match = REGEXP_REGEXP.exec(search);
    if (match) {
      message = message.replace(new RegExp(match[1], match[2]), replace);
    } else {
      message = message.replace(
        new RegExp(search.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&"), "giu"),
        replace,
      );
    }
  }

  return message.trim();
}
