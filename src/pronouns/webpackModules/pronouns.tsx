import Messages from "@moonlight-mod/wp/componentEditor_messages";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { PronounsStore } from "@moonlight-mod/wp/pronouns_store";
import React, { useEffect, useRef, useState } from "@moonlight-mod/wp/react";

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

  const ref = useRef<HTMLSpanElement>(null);
  const [hasRoleIcon, setHasRoleIcon] = useState(false);
  const addDelimiter = moonlight.getConfigOption<boolean>("pronouns", "addDelimiter");
  const delimiter = moonlight.getConfigOption<string>("pronouns", "delimiter");

  useEffect(() => {
    if (!addDelimiter || !ref.current) return;

    const container = ref.current.parentElement;
    if (!container) return;

    const check = () => {
        setHasRoleIcon(!!container.className.includes("hasRoleIcon"));
    };

    check();

    // Observe for asynchronously-added hasRoleIcon class
    const observer = new MutationObserver(check);
    observer.observe(container, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const delimiterMarginRight = hasRoleIcon ? "0" : "-0.25rem";

  return (
    <span ref={ref} className="pronouns-badge">
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
        {" ("}
      </span>
      {pronouns}
      {addDelimiter && <span style={{ marginLeft: "0.25rem", marginRight: delimiterMarginRight }}>{delimiter}</span>}
      <span style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
        {")"}
      </span>
    </span>
  );
}

Messages.addToUsername("pronouns", Pronouns, "username");
