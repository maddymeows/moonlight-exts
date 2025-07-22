import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: '"VoiceChannel, transitionTo: Channel does not have a guildId"',
    replace: [
      {
        match: /async handleVoiceConnect\((\i)\)\{let\{([^}]+)}=\1/,
        replacement:
          "async handleVoiceConnect($1){let{$2}={...$1,connected:true}",
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
