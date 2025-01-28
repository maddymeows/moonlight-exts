import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: ".KEYBOARD_SHORTCUT_USED,{",
    replace: {
      match:
        /function (\i)\((\i),(\i)\)\{return\([^)]+\)=>\(\i\.default\.track\([^)]+\),\3\([^)]+\)\)}/,
      replacement:
        'function $1($2,$3){return require("keybindTweaks_tweaks").handleKeyboardShortcut($2,$3)}',
    },
  },
  {
    find: "withVoiceChannels:!0",
    replace: [
      {
        match: /\i\.\i\.getVoiceChannelId\(\)===\i/,
        replacement:
          '(!require("keybindTweaks_tweaks").getNavigateUnreadChannelBehavior().skipVoice&&$&)',
      },
      {
        match: /\i\.\i\.isMuteScheduledEventsEnabled\(\i\)/,
        replacement:
          '(require("keybindTweaks_tweaks").getNavigateUnreadChannelBehavior().skipEvents||$&)',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  tweaks: {},
};
