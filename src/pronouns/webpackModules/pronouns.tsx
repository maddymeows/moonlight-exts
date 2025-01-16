import { UserProfileStore } from "@moonlight-mod/wp/common_stores";
import Messages from "@moonlight-mod/wp/componentEditor_messages";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";

type PronounsBadgeProps = {
  guildId: string;
  message: {
    author: {
      id: string;
    };
  };
};

function PronounsBadge(props: PronounsBadgeProps): React.ReactNode {
  const { pronouns } = useStateFromStores(
    [UserProfileStore],
    () => ({
      pronouns:
        UserProfileStore.getGuildMemberProfile(props.message.author.id, props.guildId)?.pronouns ||
        UserProfileStore.getUserProfile(props.message.author.id)?.pronouns
    }),
    [props.message.author.id, props.guildId]
  );

  if (!pronouns) return null;

  return (
    <span
      style={{
        display: "inline-block",
        marginLeft: ".5rem",
        fontSize: ".75rem",
        lineHeight: 1
      }}
    >
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>{" ("}</span>
      {pronouns}
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>{")"}</span>
    </span>
  );
}

Messages.addUsernameBadge("pronouns", PronounsBadge);
