import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: ".EMOJI_UPSELL_POPOUT_MORE_EMOJIS_OPENED,",
    replace: {
      match: /return(\(0,\i\.jsxs\)\("div",\{className:\i\.emojiSection,)/,
      replacement: 'return require("cloneExpressions_emoji").injectPopout$1',
    },
  },
  {
    find: "Custom Sticker Popout",
    replace: [
      {
        match: /return(\(0,\i\.jsxs\)\("div",\{className:\i\.emojiSection,)/,
        replacement:
          'return require("cloneExpressions_sticker").injectPopout$1',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  core: {
    dependencies: [
      'SMOL:"Smol",',
      { id: "react" },
      { id: "discord/components/common/index" },
      { id: "discord/Constants" },
      { id: "discord/packages/flux" },
      { ext: "common", id: "stores" },
      { ext: "spacepack", id: "spacepack" },
    ],
  },
  emoji: {
    dependencies: [
      '.dispatch({type:"EMOJI_UPLOAD_START",',
      { id: "react" },
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { ext: "cloneExpressions", id: "core" },
      { ext: "common", id: "stores" },
      { ext: "contextMenu", id: "contextMenu" },
      { ext: "spacepack", id: "spacepack" },
    ],
    entrypoint: true,
  },
  sticker: {
    dependencies: [
      '.dispatch({type:"GUILD_STICKERS_CREATE_SUCCESS",',
      { id: "react" },
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { ext: "cloneExpressions", id: "core" },
      { ext: "common", id: "stores" },
      { ext: "contextMenu", id: "contextMenu" },
      { ext: "spacepack", id: "spacepack" },
    ],
    entrypoint: true,
  },
};
