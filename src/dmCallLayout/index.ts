import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: 'static displayName="ChannelRTCStore"',
    replace: [
      {
        match: /(\i)(\?\i\.\i\.NO_CHAT:\i\.\i\.NORMAL)/,
        replacement:
          '$1&&require("common_stores").ChannelStore.getChannel($1)?.isGuildVoice()&&!this.isFullscreenInContext(arguments[1]??"APP")$2',
      },
    ],
  },
  {
    find: '"auto open screen width"',
    replace: [
      {
        match: /\i!==\i.\i.VOICE&&\i.isPrivate\(\)&&(!this\.inPopout&&\i)/,
        replacement: "$1",
      },
      {
        match: /render\(\)\{let\{([^}]+)}=this\.props/,
        replacement:
          'render(){let{$1}={...this.props,chatOpen:this.props.chatOpen&&(this.inPopout||this.props.layout!=="normal")}',
      },
    ],
  },
  {
    find: '"Missing channel in Channel.renderChat"',
    replace: [
      {
        match:
          /if\((\i)\.isGuildVocal\(\)\|\|(\i&&\i.isVocalThread\(\)&&\i)\)return null;/,
        replacement:
          "if($1.isGuildVocal()&&!$1.isGuildVoice()||$2)return null;",
      },
    ],
  },
  {
    find: 'tutorialId:"voice-conversations"',
    replace: [
      {
        match: /renderOpenChatButton=\(\)=>\{/,
        replacement: "$&return null;",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
