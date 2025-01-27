import {
  CloneExpressionModal,
  Guild,
} from "@moonlight-mod/wp/cloneExpressions_core";
import { EmojiStore, GuildStore } from "@moonlight-mod/wp/common_stores";
import {
  Button,
  openModal,
} from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
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
  animated: boolean;
};

type GuildEmoji = {
  emojis: Emoji[];
};

type CloneEmojiModalProps = {
  transitionState: unknown;
  onClose: () => void;
  emojiId: string;
  emojiName: string;
  animated: boolean;
};

function CloneEmojiModal(props: CloneEmojiModalProps) {
  const [name, setName] = React.useState(props.emojiName.replaceAll(":", ""));

  const guilds = useStateFromStores<{ [_ in string]?: Guild }>(
    [GuildStore],
    () => GuildStore.getGuilds(),
  );
  const guildEmojis = useStateFromStores<{ [_ in string]?: GuildEmoji }>(
    [EmojiStore],
    () => EmojiStore.getGuilds(),
  );

  const [, forceRerender] = React.useReducer((it) => it + 1, 0);

  return (
    <CloneExpressionModal
      {...props}
      title="Clone Emoji"
      name={name}
      onChangeName={setName}
      nameValidationError={
        /\W/.test(name)
          ? "Name can only contain alphanumeric characters or underscores"
          : 2 > name.length || name.length > 32
            ? "Name must be between 2 and 32 characters long"
            : undefined
      }
      getSlotsCount={(guild) => guilds[guild.id]?.getMaxEmojiSlots() ?? 0}
      getSlotsUsed={(guild) =>
        guildEmojis[guild.id]?.emojis.filter(
          (it: { animated: boolean }) => it.animated === props.animated,
        ).length ?? 0
      }
      onClone={async (guild) => {
        const response = await fetch(
          `https://cdn.discordapp.com/emojis/${props.animated ? "a_" : ""}${props.emojiId}${props.animated ? ".gif" : ".png"}`,
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

        forceRerender();
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
                emojiId={emojiId}
                emojiName={emojiName}
                animated={animated}
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
