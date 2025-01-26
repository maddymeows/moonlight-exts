import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  pronouns: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "react" },
      { ext: "componentEditor", id: "messages" },
      { ext: "pronouns", id: "store" },
    ],
    entrypoint: true,
  },
  store: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "discord/Dispatcher" },
    ],
  },
};
