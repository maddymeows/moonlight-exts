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
      match:
        /\{className:(\i\(\)\(\i\.total,\{\[\i\.extraLong]:\i>=100}\)),children:(\i)\.toString\(\)\.padStart\(2,"0"\)}/,
      replacement:
        '{className:$1,children:$2>0?$2.toString().padStart(2,"0"):"\\u221e"}',
    },
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
