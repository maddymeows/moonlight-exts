import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: ".EMOJI_UPSELL_POPOUT_MORE_EMOJIS_OPENED,",
    replace: {
      match: /return(\(0,\i\.jsxs\)\("div",\{className:\i\.emojiSection,)/,
      replacement: 'return require("cloneExpressions_injectors").injectEmoji$1',
    },
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  injectors: {
    dependencies: [
      'SMOL:"Smol",',
      '.dispatch({type:"EMOJI_UPLOAD_START",',
      { id: "react" },
      { id: "discord/Constants" },
      { id: "discord/packages/flux" },
      { ext: "common", id: "stores" },
      { ext: "spacepack", id: "spacepack" },
    ],
  },
};
