import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '"displayName","ChannelRTCStore"',
    replace: [
      {
        match: /(\i)(\?\i\.\i\.NO_CHAT:\i\.\i\.NORMAL)/,
        replacement:
          '$1&&require("common_stores").ChannelStore.getChannel($1)?.isGuildVoice()&&!this.isFullscreenInContext(arguments[1]??"APP")$2',
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
      {
        match: /render\(\)\{let\{([^}]+)}=this\.props/,
        replacement:
          'render(){let{$1}={...this.props,chatOpen:this.props.chatOpen&&(this.inPopout||this.props.layout!=="normal")}',
      },
    ],
  },
  {
    find: 'location:"ChannelChat"',
    replace: [
      {
        match: /\.memo\(function\((\i)\)\{/,
        replacement:
          '$&let _moonlight_dmCallLayout_shouldRenderChat=require("discord/packages/flux").useStateFromStores([require("common_stores").ChannelRTCStore],()=>require("common_stores").ChannelRTCStore.getLayout($1.channel.id)==="normal"||$1.chatInputType.analyticsName!=="normal");',
      },
      {
        match: /return\(0,\i\.jsx\)\(\i,\{/,
        replacement: "$&_moonlight_dmCallLayout_shouldRenderChat,",
      },
      {
        match: /let[^;]+?isChatInputBottomAligned[^;]+?;/,
        replacement:
          "$&if(!this.props._moonlight_dmCallLayout_shouldRenderChat)return null;",
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
  {
    find: 'location:"voice_channel"',
    replace: [
      {
        match: /"renderOpenChatButton",\(\)=>\{/,
        replacement: "$&return null;",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
