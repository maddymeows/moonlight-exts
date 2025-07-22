import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '"displayName","ChannelRTCStore"',
    replace: [
      {
        match: /(\i)(\?\i\.\i\.NO_CHAT:\i\.\i\.NORMAL)/,
        replacement:
          '$1&&(require("common_stores").ChannelStore.getChannel($1)?.isGuildVoice()&&!this.isFullscreenInContext(arguments[1]??"APP"))$2',
      },
    ],
  },
  {
    find: 'location:"ChannelCall"',
    replace: [
      {
        match: /\i!==\i.\i.VOICE&&\i.isPrivate\(\)&&(!this\.inPopout&&\i)/,
        replacement: "$1",
      },
    ],
  },
  {
    find: '"Missing channel in Channel.renderChat"',
    replace: [
      {
        match: /if\((\i)\.isGuildVocal\(\)\)return null;/,
        replacement: "if($1.isGuildVocal()&&!$1.isGuildVoice())return null;",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
