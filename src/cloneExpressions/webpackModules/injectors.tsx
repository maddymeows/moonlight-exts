import { EmojiStore, GuildStore, PermissionStore, SortedGuildStore } from "@moonlight-mod/wp/common_stores";
import {
  Button,
  FormItem,
  Heading,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  openModal,
  Scroller,
  Text,
  TextInput
} from "@moonlight-mod/wp/discord/components/common/index";
import { Permissions } from "@moonlight-mod/wp/discord/Constants";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const GuildIcon = spacepack.findByCode(`SMOL:${JSON.stringify("Smol")},`)[0].exports.Z;

type UploadEmoji = (options: { guildId: string; image: string; name: string }) => Promise<void>;
const uploadEmoji = spacepack.findFunctionByStrings(
  spacepack.findByCode(`.dispatch({type:${JSON.stringify("EMOJI_UPLOAD_START")},`)[0].exports,
  `.dispatch({type:${JSON.stringify("EMOJI_UPLOAD_START")},`
) as UploadEmoji;

type Guild = {
  id: string;
  name: string;
  getIconURL(resolution: number): string;
  getMaxEmojiSlots(): number;
};

type Emoji = {
  animated: boolean;
};

type GuildEmoji = {
  emojis: Emoji[];
};

type CloneExpressionModalProps = {
  transitionState: unknown;
  onClose: () => void;
  title: string;
  name: string;
  onChangeName: (name: string) => void;
  nameValidationError: string | undefined;
  getSlotsCount: (guild: Guild) => number;
  getSlotsUsed: (guild: Guild) => number;
  onClone: (guild: Guild) => void;
};

function CloneExpressionModal(props: CloneExpressionModalProps) {
  const guilds = useStateFromStores<Guild[]>([GuildStore, SortedGuildStore, PermissionStore], () =>
    SortedGuildStore.getFlattenedGuildIds()
      .map((id: string) => GuildStore.getGuild(id))
      .filter((guild: Guild) => PermissionStore.getGuildPermissions(guild) & Permissions.CREATE_GUILD_EXPRESSIONS)
  );

  return (
    <ModalRoot transitionState={props.transitionState}>
      <ModalHeader>
        <div style={{ flexGrow: "1" }}>
          <Heading variant="heading-lg/semibold">{props.title}</Heading>
        </div>
        <ModalCloseButton onClick={() => props.onClose()} />
      </ModalHeader>
      <Scroller>
        <div style={{ height: "8px" }} />
        {guilds.map((guild) => (
          <div key={guild.id} style={{ height: "48px", display: "flex", alignItems: "center", padding: "0 16px" }}>
            <GuildIcon guild={guild} iconSrc={guild.getIconURL(96)} size={GuildIcon.Sizes.SMALL} />
            <div style={{ flexGrow: "1", marginLeft: "16px", display: "flex", flexDirection: "column" }}>
              <Text variant="heading-md/semibold" style={{ color: "var(--header-primary)" }}>
                {guild.name}
              </Text>
              <Text variant="text-xs/normal" style={{ color: "var(--text-muted)" }}>
                {props.getSlotsCount(guild) - props.getSlotsUsed(guild)}/{props.getSlotsCount(guild)} slots available
              </Text>
            </div>
            <Button
              size={Button.Sizes.SMALL}
              disabled={props.getSlotsUsed(guild) > props.getSlotsCount(guild)}
              onClick={() => {
                props.onClone(guild);
              }}
            >
              Clone
            </Button>
          </div>
        ))}
        <div style={{ height: "8px" }} />
      </Scroller>
      <ModalFooter>
        <FormItem title="Name" error={props.nameValidationError} style={{ flexGrow: "1" }}>
          <TextInput value={props.name} onChange={props.onChangeName} />
        </FormItem>
      </ModalFooter>
    </ModalRoot>
  );
}

type CloneEmojiModalProps = {
  transitionState: unknown;
  onClose: () => void;
  emojiId: string;
  emojiName: string;
  animated: boolean;
};

function CloneEmojiModal(props: CloneEmojiModalProps) {
  const [name, setName] = React.useState(props.emojiName.replaceAll(":", ""));

  const guilds = useStateFromStores<{ [_ in string]?: Guild }>([GuildStore], () => GuildStore.getGuilds());
  const guildEmojis = useStateFromStores<{ [_ in string]?: GuildEmoji }>([EmojiStore], () => EmojiStore.getGuilds());

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
        guildEmojis[guild.id]?.emojis.filter((it: { animated: boolean }) => it.animated === props.animated).length ?? 0
      }
      onClone={async (guild) => {
        const response = await fetch(
          `https://cdn.discordapp.com/emojis/${props.animated ? "a_" : ""}${props.emojiId}${props.animated ? ".gif" : ".png"}`
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
          image: `data:${response.headers.get("content-type")};base64` + data.slice(data.indexOf(",")),
          name
        });

        forceRerender();
      }}
    />
  );
}

export function injectEmoji(_: unknown, jsxs: (...args: unknown[]) => React.ReactElement) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    const { emojiId, emojiName, animated } = element.props.children[0].props.children[0].props;

    element.props.children.push(
      <Button
        size={Button.Sizes.SMALL}
        fullWidth
        style={{ marginTop: "16px" }}
        onClick={() => {
          openModal((props) => {
            return <CloneEmojiModal {...props} emojiId={emojiId} emojiName={emojiName} animated={animated} />;
          });
        }}
      >
        Clone Emoji
      </Button>
    );
    return element;
  };
}
