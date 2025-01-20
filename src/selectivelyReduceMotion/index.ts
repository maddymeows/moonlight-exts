import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: /\{canAnimate:\i}=/,
    replace: {
      match: /\{canAnimate:(\i)}=(\(0,\i\.\i\)\(\i,\i\))/,
      replacement: '$1=$2.canAnimate&&!moonlight.getConfigOption("selectivelyReduceMotion","avatarDecorations")'
    }
  },
  {
    find: /\{[^}]*autoPlay:\i[^}]*profileEffectConfig:\i[^}]*}=/,
    replace: {
      match: /\(0,\i\.\i\)\(\[\i\.\i],\(\)=>\i\.\i\.useReducedMotion\)/,
      replacement: '$&||moonlight.getConfigOption("selectivelyReduceMotion","profileEffects")'
    }
  }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
