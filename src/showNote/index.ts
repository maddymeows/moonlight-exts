import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: 'location:"UserProfilePopoutBody"',
    replace: [
      {
        match: /return\(0,(\i\.jsxs)\)/,
        replacement: 'return require("showNote_components").injectPopout($1)',
      },
    ],
  },
  {
    find: 'location:"UserProfileSidebarBody"',
    replace: [
      {
        match: /return\(0,(\i\.jsxs)\)/,
        replacement: 'return require("showNote_components").injectSidebar($1)',
      },
    ],
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  components: {
    dependencies: [
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { id: "react" },
      { ext: "common", id: "stores" },
    ],
  },
};
