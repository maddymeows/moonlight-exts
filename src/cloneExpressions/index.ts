import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: ".EMOJI_UPSELL_POPOUT_MORE_EMOJIS_OPENED,",
    replace: {
      match:
        /\i=\i\.type===\i\.\i\.JOIN_GUILD,\i=\i\.type===\i\.\i\.GET_PREMIUM,[^;]*;return/,
      replacement: '$& require("cloneExpressions_emoji").injectPopout',
    },
  },
  {
    find: "Custom Sticker Popout",
    replace: [
      {
        match:
          /(\(0,\i\.jsxs\)\("div",\{className\:\i\.\i,children:\[\(0,\i.jsx\)\(\i,\{description:\i,sticker:)/,
        replacement: 'require("cloneExpressions_sticker").injectPopout$1',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  core: {
    dependencies: [
      'SMOL:"Smol",',
      '"vertical",' + "paddingFix:",
      { id: "discord/Constants" },
      { id: "discord/design/components/Heading/Heading" },
      { id: "discord/design/components/Modal/web/LegacyModal" },
      { id: "discord/design/components/Text/Text" },
      { id: "discord/packages/flux" },
      { id: "discord/uikit/legacy/Button" },
      { id: "react" },
      { ext: "common", id: "stores" },
      { ext: "spacepack", id: "spacepack" },
    ],
  },
  emoji: {
    dependencies: [
      '.dispatch({type:"EMOJI_UPLOAD_START",',
      { id: "discord/design/components/Form/web/Field" },
      { id: "discord/modules/modals/Modals" },
      { id: "discord/packages/flux" },
      { id: "discord/uikit/legacy/Button" },
      { id: "discord/uikit/TextInput" },
      { id: "react" },
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
      { id: "discord/design/components/Form/web/Field" },
      { id: "discord/design/mana/components/TextArea/web/TextArea" },
      { id: "discord/modules/modals/Modals" },
      { id: "discord/packages/flux" },
      { id: "discord/uikit/legacy/Button" },
      { id: "discord/uikit/TextInput" },
      { id: "react" },
      { ext: "cloneExpressions", id: "core" },
      { ext: "common", id: "stores" },
      { ext: "contextMenu", id: "contextMenu" },
      { ext: "spacepack", id: "spacepack" },
    ],
    entrypoint: true,
  },
};
