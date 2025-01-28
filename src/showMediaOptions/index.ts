import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: ".CONTEXT_MENU_LINK_OPENED,{",
    replace: [
      {
        match:
          /if\((!\i\.isPlatformEmbedded\|\|null==\i\|\|""===\i\|\|\i)\|\|.+?\)return null;/,
        replacement: "if($1)return null;",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
