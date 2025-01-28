import {
  GuildStore,
  PermissionStore,
  SortedGuildStore,
} from "@moonlight-mod/wp/common_stores";
import {
  Button,
  Heading,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  Scroller,
  Text,
} from "@moonlight-mod/wp/discord/components/common/index";
import { Permissions } from "@moonlight-mod/wp/discord/Constants";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const GuildIcon = spacepack.findByCode(`SMOL:${JSON.stringify("Smol")},`)[0]
  .exports.Z;

export type Guild = {
  id: string;
  name: string;
  getIconURL(resolution: number): string;
  getMaxEmojiSlots(): number;
  premiumTier: number;
};

export type CloneExpressionModalProps = {
  transitionState: unknown;
  onClose: () => void;
  title: string;
  footer: React.ReactNode;
  getSlotsCount: (guild: Guild) => number;
  getSlotsUsed: (guild: Guild) => number;
  onClone: (guild: Guild) => void;
};

export function CloneExpressionModal(props: CloneExpressionModalProps) {
  const guilds = useStateFromStores<Guild[]>(
    [GuildStore, SortedGuildStore, PermissionStore],
    () =>
      SortedGuildStore.getFlattenedGuildIds()
        .map((id: string) => GuildStore.getGuild(id))
        .filter(
          (guild: Guild) =>
            PermissionStore.getGuildPermissions(guild) &
            Permissions.CREATE_GUILD_EXPRESSIONS,
        ),
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
          <div
            key={guild.id}
            style={{
              height: "48px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
          >
            <GuildIcon
              guild={guild}
              iconSrc={guild.getIconURL(96)}
              size={GuildIcon.Sizes.SMALL}
            />
            <div
              style={{
                flexGrow: "1",
                marginLeft: "16px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                variant="heading-md/semibold"
                style={{ color: "var(--header-primary)" }}
              >
                {guild.name}
              </Text>
              <Text
                variant="text-xs/normal"
                style={{ color: "var(--text-muted)" }}
              >
                {props.getSlotsCount(guild) - props.getSlotsUsed(guild)}/
                {props.getSlotsCount(guild)} slots available
              </Text>
            </div>
            <Button
              size={Button.Sizes.SMALL}
              disabled={props.getSlotsUsed(guild) >= props.getSlotsCount(guild)}
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
      <ModalFooter>{props.footer}</ModalFooter>
    </ModalRoot>
  );
}
