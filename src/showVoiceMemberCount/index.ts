import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: "considerMaxStageVoiceUserLimit:",
    replace: {
      match: /return function\(\i\)\{/,
      replacement: "$&return!0;",
    },
  },
  {
    find: "videoLimit:",
    replace: {
      match: /children:(\i)\.toString\(\)\.padStart\(2,"0"\)/,
      replacement: 'children:$1>0?$1.toString().padStart(2,"0"):"\\u221e"',
    },
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
