import Messages from "@moonlight-mod/wp/componentEditor_messages";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { PronounsStore } from "@moonlight-mod/wp/pronouns_store";
import React from "@moonlight-mod/wp/react";

type PronounsProps = {
  guildId: string | null;
  message: {
    author: {
      id: string;
    };
  };
};

function Pronouns(props: PronounsProps): React.ReactNode {
  const { pronouns } = useStateFromStores(
    [PronounsStore],
    () => ({
      pronouns: PronounsStore.getPronouns(
        props.message.author.id,
        props.guildId,
      ),
    }),
    [props.message.author.id, props.guildId],
  );

  if (!pronouns) return null;

  return (
    <span className="pronouns-badge">
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
        {" ("}
      </span>
      {pronouns}
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
        {")"}
      </span>
    </span>
  );
}

Messages.addToUsername("pronouns", Pronouns, "username");
