import {
  CloneExpressionModal,
  Guild,
} from "@moonlight-mod/wp/cloneExpressions_core";
import { EmojiStore, GuildStore } from "@moonlight-mod/wp/common_stores";
import ContextMenu, {
  MenuItem,
} from "@moonlight-mod/wp/contextMenu_contextMenu";
import {
  Button,
  FormItem,
  openModal,
  TextInput,
} from "@moonlight-mod/wp/discord/components/common/index";
import {
  statesWillNeverBeEqual,
  useStateFromStores,
} from "@moonlight-mod/wp/discord/packages/flux";
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

type Emoji = {
  id: string;
  name: string;
  animated: boolean;
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

  const guilds = useStateFromStores<{ [_ in string]?: Guild }>(
    [GuildStore],
    () => GuildStore.getGuilds(),
  );
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
      getSlotsCount={(guild) => guilds[guild.id]?.getMaxEmojiSlots() ?? 0}
      getSlotsUsed={(guild) =>
        guildEmojis[guild.id]?.emojis.filter(
          (it: { animated: boolean }) => it.animated === props.emoji.animated,
        ).length ?? 0
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
          image:
            `data:${response.headers.get("content-type")};base64` +
            data.slice(data.indexOf(",")),
          name,
        });
      }}
    />
  );
}

export function injectEmoji(
  _: unknown,
  jsxs: (...args: unknown[]) => React.ReactElement,
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
  if (
    !(props.target instanceof HTMLImageElement) ||
    props.target.dataset.type !== "emoji" ||
    !props.target.dataset.id
  )
    return;

  const emoji = useStateFromStores<Emoji>([EmojiStore], () =>
    EmojiStore.getCustomEmojiById(props.target.dataset.id),
  ) ?? {
    id: props.target.dataset.id,
    name: props.target.alt.replaceAll(":", ""),
    animated:
      new URL(props.target.src).pathname.endsWith(".gif") ||
      new URL(props.target.src).searchParams.get("animated") === "true",
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
