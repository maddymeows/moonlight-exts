import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '"reply-other"',
    replace: [
      {
        match: /\(0,\i\.jsx\)\(\i\.\i\,\{[^}]+},"reply-self"\)/,
        replacement: "null",
      },
      {
        match:
          /(\i)&&!\i\?(\(0,\i\.jsx\)\(\i\.\i\,\{[^}]+},"reply-other"\)):null/,
        replacement: "$1?$2:null",
      },
      {
        match:
          /(\i\?\(0,\i\.jsx\)\(\i\.\i\,\{[^}]+},"reply-other"\):null),(\i\?\(0,\i\.jsx\)\(\i\.\i\,\{[^}]+},"edit"\):null)/,
        replacement: "$2,$1",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
