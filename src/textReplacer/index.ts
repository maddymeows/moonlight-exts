// https://moonlight-mod.github.io/ext-dev/webpack/#patching
import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  replacer: {
    dependencies: [{ ext: "commands", id: "commands" }],
    entrypoint: true,
  },
};
