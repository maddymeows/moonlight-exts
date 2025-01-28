const SHORTCUT_NAME_TO_CONFIG_KEY_MAP = {
  CALL_START: "disableCallStart",
  TOGGLE_CATEGORY_COLLAPSED: "disableToggleCategoryCollapsed",
} as const;

export function handleKeyboardShortcut(
  name: string,
  action: (event: KeyboardEvent, shortcut: string) => boolean,
) {
  return (event: KeyboardEvent, shortcut: string) => {
    if (name in SHORTCUT_NAME_TO_CONFIG_KEY_MAP) {
      if (
        moonlight.getConfigOption(
          "keybindTweaks",
          SHORTCUT_NAME_TO_CONFIG_KEY_MAP[
            name as keyof typeof SHORTCUT_NAME_TO_CONFIG_KEY_MAP
          ],
        )
      ) {
        return false;
      }
    }

    return action(event, shortcut);
  };
}

export function getNavigateUnreadChannelBehavior() {
  const options =
    moonlight.getConfigOption<string[]>(
      "keybindTweaks",
      "navigateUnreadChannelBehavior",
    ) ?? [];

  return {
    skipVoice: options.includes("Skip current voice channel"),
    skipEvents: options.includes("Skip event channels with unseen events"),
  };
}
