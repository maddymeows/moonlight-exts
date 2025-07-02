import { CloneExpressionModal } from "@moonlight-mod/wp/cloneExpressions_core";
import { StickersStore } from "@moonlight-mod/wp/common_stores";
import ContextMenu, {
  MenuItem,
} from "@moonlight-mod/wp/contextMenu_contextMenu";
import {
  Button,
  FormItem,
  TextArea,
  TextInput,
} from "@moonlight-mod/wp/discord/components/common/index";
import { openModal } from "@moonlight-mod/wp/discord/modules/modals/Modals";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

type UploadStickerPayload = {
  guildId: string;
  platform: "web";
  body: FormData;
};
type UploadSticker = (payload: UploadStickerPayload) => Promise<void>;
const uploadSticker = spacepack.findFunctionByStrings(
  spacepack.findByCode(
    `.dispatch({type:${JSON.stringify("GUILD_STICKERS_CREATE_SUCCESS")},`,
  )[0].exports,
  `.dispatch({type:${JSON.stringify("GUILD_STICKERS_CREATE_SUCCESS")},`,
) as UploadSticker;

const STICKER_SLOTS_PER_TIER = [5, 15, 30, 60];

const STICKER_FORMAT_TYPES = {
  PNG: 1,
  APNG: 2,
  LOTTIE: 3,
  GIF: 4,
} as const;

type Sticker = {
  id: string;
  name: string;
  tags?: string;
  description?: string;
  format_type: (typeof STICKER_FORMAT_TYPES)[keyof typeof STICKER_FORMAT_TYPES];
};

type CloneStickerModalProps = {
  transitionState: unknown;
  onClose: () => void;
  sticker: Sticker;
};

function CloneStickerModal(props: CloneStickerModalProps) {
  const [name, setName] = React.useState(props.sticker.name);
  const [tags, setTags] = React.useState(props.sticker.tags ?? "");
  const [description, setDescription] = React.useState(
    props.sticker.description ?? "",
  );

  const guildStickers = useStateFromStores<Map<string, Sticker[]>>(
    [StickersStore],
    () => StickersStore.getAllGuildStickers(),
  );

  return (
    <CloneExpressionModal
      {...props}
      title="Clone Sticker"
      footer={
        <div
          style={{
            flexGrow: "1",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <FormItem
            title="Name"
            required
            error={
              2 > name.length || name.length > 32
                ? "Name must be between 2 and 32 characters long"
                : undefined
            }
          >
            <TextInput value={name} onChange={setName} />
          </FormItem>
          <FormItem
            title="Tags"
            required
            error={
              tags.length > 200
                ? "Tags must not be longer than 200 characters"
                : undefined
            }
          >
            <TextInput value={tags} onChange={setTags} />
          </FormItem>
          <FormItem
            title="Description"
            error={
              description.length !== 0 &&
              (2 > description.length || description.length > 100)
                ? "Description must be between 2 and 100 characters long"
                : undefined
            }
          >
            <TextArea value={description} onChange={setDescription} />
          </FormItem>
        </div>
      }
      getSlotsCount={(guild) => STICKER_SLOTS_PER_TIER[guild.premiumTier]}
      getSlotsUsed={(guild) => guildStickers.get(guild.id)?.length ?? 0}
      onClone={async (guild) => {
        const response = await fetch(
          `https://cdn.discordapp.com/stickers/${props.sticker.id}${props.sticker.format_type === STICKER_FORMAT_TYPES.GIF ? ".gif" : ".png"}?size=4096`,
        );

        const blob = await response.blob();
        const form = new FormData();
        form.set("name", name);
        form.set("tags", tags);
        form.set("description", description);
        form.set("file", blob);

        await uploadSticker({
          guildId: guild.id,
          platform: "web",
          body: form,
        });
      }}
    />
  );
}

export function injectPopout(
  _: unknown,
  jsxs: (...args: unknown[]) => React.ReactElement,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    const sticker = element.props.children[0].props.sticker as Sticker;

    if (sticker.format_type === STICKER_FORMAT_TYPES.LOTTIE) {
      return element;
    }

    element.props.children.push(
      <Button
        size={Button.Sizes.SMALL}
        fullWidth
        style={{ marginTop: "16px" }}
        onClick={() => {
          openModal((props) => {
            return <CloneStickerModal {...props} sticker={sticker} />;
          });
        }}
      >
        Clone Sticker
      </Button>,
    );
    return element;
  };
}

type CloneStickerMenuItemProps = {
  message?: {
    stickerItems: Sticker[];
  };
  target: HTMLElement;
};

function CloneStickerMenuItem(props: CloneStickerMenuItemProps) {
  if (
    !(props.target instanceof HTMLImageElement) ||
    props.target.dataset.type !== "sticker" ||
    !props.target.dataset.id
  )
    return;

  const sticker =
    useStateFromStores<Sticker>([StickersStore], () =>
      StickersStore.getStickerById(props.target.dataset.id),
    ) ??
    props.message?.stickerItems.find(
      (item) => item.id === props.target.dataset.id,
    );

  if (!sticker) return;

  return (
    <MenuItem
      id="clone"
      label="Clone Sticker"
      action={() => {
        openModal((props) => {
          return <CloneStickerModal {...props} sticker={sticker} />;
        });
      }}
    />
  );
}

ContextMenu.addItem(
  "expression-picker",
  CloneStickerMenuItem,
  /^(?:un)?favorite$/,
);
ContextMenu.addItem("message", CloneStickerMenuItem, "copy-text");
