import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '(this,"nsfwAllowed",void 0)',
    replace: [
      {
        match: /Object\.defineProperties\(this,\{/,
        replacement:
          "$&nsfwAllowed:{get(){return!0},set(){}},ageVerificationStatus:{get(){return 3},set(){}},",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
