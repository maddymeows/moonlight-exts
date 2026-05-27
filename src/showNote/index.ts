import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: 'layout:"POPOUT"',
    replace: [
      {
        match: /\(\i\.id,\i\?\.id\);return/,
        replacement: '$& require("showNote_components").injectPopout',
      },
    ],
  },
  {
    find: '["high","medium","low"]',
    replace: [
      {
        match:
          /\i=\(0,\i\.\i\)\(\[\i\.\i],\(\)=>\i\.\i\.hidePersonalInformation\)[^;]*;return/,
        replacement: '$& require("showNote_components").injectSidebar',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  components: {
    dependencies: [
      "USER_PROFILE_MODAL_KEY",
      { id: "discord/design/components/Heading/Heading" },
      { id: "discord/intl" },
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
    ],
  },
};
