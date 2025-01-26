import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: "search-google",
    replace: [
      {
        match:
          /"https:\/\/www\.google\.com\/search\?q="\.concat\(encodeURIComponent\((\i)\)\)/,
        replacement:
          'moonlight.getConfigOption("customSearchEngine","url").replace("%s",encodeURIComponent($1))',
      },
      {
        match: /label:[^,]+,/,
        replacement:
          'label:moonlight.getConfigOption("customSearchEngine","label"),',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
