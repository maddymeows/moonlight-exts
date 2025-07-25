import { CloneExpressionModal } from "@moonlight-mod/wp/cloneExpressions_core";
import { EmojiStore } from "@moonlight-mod/wp/common_stores";
import ContextMenu, {
  MenuItem,
} from "@moonlight-mod/wp/contextMenu_contextMenu";
import { FormItem } from "@moonlight-mod/wp/discord/components/common/index";
import { openModal } from "@moonlight-mod/wp/discord/modules/modals/Modals";
import {
  statesWillNeverBeEqual,
  useStateFromStores,
} from "@moonlight-mod/wp/discord/packages/flux";
import { Button } from "@moonlight-mod/wp/discord/uikit/legacy/Button";
import TextInput from "@moonlight-mod/wp/discord/uikit/TextInput";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

type UploadEmoji = (options: {
  guildId: string;
  image: string;
  name: string;
}) => Promise<void>;
const uploadEmoji = spacepack.findFunctionByStrings(
  spacepack.findByCode(
    `.dispatch({type:${JSON.stringify("EMOJI_UPLOAD_START")},`,
  )[0].exports,
  `.dispatch({type:${JSON.stringify("EMOJI_UPLOAD_START")},`,
) as UploadEmoji;

const EMOJI_SLOTS_PER_TIER = [50, 100, 150, 250];

type Emoji = {
  id: string;
  name: string;
  animated: boolean;
  managed: boolean;
};

type GuildEmoji = {
  emojis: Emoji[];
};

type CloneEmojiModalProps = {
  transitionState: unknown;
  onClose: () => void;
  emoji: Emoji;
};

function CloneEmojiModal(props: CloneEmojiModalProps) {
  const [name, setName] = React.useState(props.emoji.name);

  const guildEmojis = useStateFromStores<{ [_ in string]?: GuildEmoji }>(
    [EmojiStore],
    () => EmojiStore.getGuilds(),
    [],
    statesWillNeverBeEqual,
  );

  return (
    <CloneExpressionModal
      {...props}
      title="Clone Emoji"
      footer={
        <FormItem
          title="Name"
          required
          error={
            /\W/.test(name)
              ? "Name can only contain alphanumeric characters or underscores"
              : 2 > name.length || name.length > 32
                ? "Name must be between 2 and 32 characters long"
                : undefined
          }
          style={{ flexGrow: "1" }}
        >
          <TextInput value={name} onChange={setName} />
        </FormItem>
      }
      getSlotsCount={(guild) => EMOJI_SLOTS_PER_TIER[guild.premiumTier]}
      getSlotsUsed={(guild) =>
        guildEmojis[guild.id]?.emojis
          .filter((it: Emoji) => !it.managed)
          .filter((it: Emoji) => it.animated === props.emoji.animated).length ??
        0
      }
      onClone={async (guild) => {
        const response = await fetch(
          `https://cdn.discordapp.com/emojis/${props.emoji.animated ? "a_" : ""}${props.emoji.id}${props.emoji.animated ? ".gif" : ".png"}`,
        );
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const data = await new Promise<string>((resolve, reject) => {
          reader.addEventListener("load", function onLoad() {
            reader.removeEventListener("load", onLoad);
            resolve(reader.result as string);
          });
          reader.addEventListener("error", function onError() {
            reader.removeEventListener("error", onError);
            reject(reader.error);
          });
        });

        await uploadEmoji({
          guildId: guild.id,
          image: data,
          name,
        });
      }}
    />
  );
}

export function injectPopout(
  _: unknown,
  jsxs: (...args: unknown[]) => React.ReactElement<any>,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    const { emojiId, emojiName, animated } =
      element.props.children[0].props.children[0].props;

    element.props.children.push(
      <Button
        size={Button.Sizes.SMALL}
        fullWidth
        style={{ marginTop: "16px" }}
        onClick={() => {
          openModal((props) => {
            return (
              <CloneEmojiModal
                {...props}
                emoji={{
                  id: emojiId,
                  name: emojiName.replaceAll(":", ""),
                  animated,
                  managed: false,
                }}
              />
            );
          });
        }}
      >
        Clone Emoji
      </Button>,
    );
    return element;
  };
}

type CloneEmojiMenuItemProps = {
  target: HTMLElement;
};

function CloneEmojiMenuItem(props: CloneEmojiMenuItemProps) {
  const image =
    props.target instanceof HTMLImageElement
      ? props.target
      : props.target.firstElementChild;

  if (
    !(image instanceof HTMLImageElement) ||
    props.target.dataset.type !== "emoji" ||
    !props.target.dataset.id
  ) {
    return;
  }

  const emoji = useStateFromStores<Emoji>([EmojiStore], () =>
    EmojiStore.getCustomEmojiById(props.target.dataset.id),
  ) ?? {
    id: props.target.dataset.id,
    name: image.alt.replaceAll(":", ""),
    animated:
      new URL(image.src).pathname.endsWith(".gif") ||
      new URL(image.src).searchParams.get("animated") === "true",
  };

  return (
    <MenuItem
      id="clone"
      label="Clone Emoji"
      action={() => {
        openModal((props) => {
          return <CloneEmojiModal {...props} emoji={emoji} />;
        });
      }}
    />
  );
}

ContextMenu.addItem(
  "expression-picker",
  CloneEmojiMenuItem,
  /^(?:un)?favorite$/,
);
ContextMenu.addItem("message", CloneEmojiMenuItem, "copy-native-link", true);
