import Commands from "@moonlight-mod/wp/commands_commands";

const REGEXP_REGEXP = /^\/(.+)\/(\w*)$/s;

function apply(message: string) {
  const ignore = moonlight.getConfigOption<string>("textReplacer", "ignore");
  if (ignore && message.startsWith(ignore)) {
    return message.replace(ignore, "").trim();
  }

  const patterns = moonlight.getConfigOption<{ [_ in string]?: string }>("textReplacer", "patterns") ?? {};

  for (const [search, replace = ""] of Object.entries(patterns)) {
    const match = REGEXP_REGEXP.exec(search);
    if (match) {
      message = message.replace(new RegExp(match[1], match[2]), replace);
    } else {
      message = message.replaceAll(search, replace);
    }
  }

  return message.trim();
}

Commands.registerLegacyCommand("textReplacer", {
  match: {
    // @ts-expect-error: https://github.com/moonlight-mod/moonlight/pull/194
    regex: /^/
  },
  action: (content) => {
    return {
      content: apply(content)
    };
  }
});
