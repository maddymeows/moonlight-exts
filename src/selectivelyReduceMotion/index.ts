import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: /\{canAnimate:\i}=/,
    replace: {
      match: /\{canAnimate:(\i)}=(\(0,\i\.\i\)\(\i,\i\))/,
      replacement:
        '$1=$2.canAnimate&&!moonlight.getConfigOption("selectivelyReduceMotion","avatarDecorations")',
    },
  },
  {
    find: /\{[^}]*autoPlay:\i[^}]*profileEffectConfig:\i[^}]*}=/,
    replace: {
      match: /\(0,\i\.\i\)\(\[\i\.\i],\(\)=>\i\.\i\.useReducedMotion\)/,
      replacement:
        '$&||moonlight.getConfigOption("selectivelyReduceMotion","profileEffects")',
    },
  },
  {
    find: /\{defaultAsset:\i,webmAsset:\i,staticAsset:\i}=/,
    replace: {
      match: /animate:(\i),loop:!0===\1&&!0===(\i)/,
      replacement:
        'animate:$1&&!moonlight.getConfigOption("selectivelyReduceMotion","nameplates"),loop:$1&&$2',
    },
  },
  {
    find: '.dispatch({type:"BURST_REACTION_EFFECT_PLAY"',
    replace: {
      match: /\i\.\i\.dispatch\(\{type:"BURST_REACTION_EFFECT_PLAY"/,
      replacement:
        'if(moonlight.getConfigOption("selectivelyReduceMotion","burstReactions"))return;$&',
    },
  },
  {
    find: '.dispatch({type:"POTIONS_TRIGGER_MESSAGE_CONFETTI"',
    replace: {
      match: /\i\.\i\.useReducedMotion/g,
      replacement:
        '$&||moonlight.getConfigOption("selectivelyReduceMotion","confetti")',
    },
  },
  {
    find: "Message must not be a thread starter message",
    replace: {
      match: /\[\i\.potioned]:/g,
      replacement:
        '"selectivelyReduceMotion-confetti":moonlight.getConfigOption("selectivelyReduceMotion","confetti"),$&',
    },
  },
  {
    find: "isScrolledToTop:()=>",
    replace: {
      match: /(\i)\.to\(\{([^}]*)animate:([^}]*)}\)/,
      replacement:
        '$1.to({$2animate:!moonlight.getConfigOption("selectivelyReduceMotion","scrolling")&&$3})',
    },
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
