import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '.dispatch({type:"LOCAL_MESSAGE_CREATE",',
    replace: [
      {
        match: /async sendMessage\(\i,(\i)\)\{/,
        replacement:
          '$&if($1.content)$1={...$1,content:require("textReplacer_replacer").apply($1.content)};',
      },
      {
        match: /async editMessage\(\i,\i,(\i)\)\{/,
        replacement:
          '$&if($1.content)$1={...$1,content:require("textReplacer_replacer").apply($1.content)};',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  replacer: {},
};
