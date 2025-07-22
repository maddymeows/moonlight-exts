import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '"displayName","ChannelRTCStore"',
    replace: [
      {
        match: /getLayout\((\i)\)\{/,
        replacement:
          '$&if(require("common_stores").ChannelStore.getChannel($1)?.isGuildVoice()&&!this.isFullscreenInContext(arguments[1]??"APP"))return"normal";',
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
