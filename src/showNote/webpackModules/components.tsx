import { NoteStore } from "@moonlight-mod/wp/common_stores";
import {
  Text,
  Heading,
} from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";

type NoteProps = {
  user: string;
  className?: string;
};

export function Note(props: NoteProps) {
  const note = useStateFromStores([NoteStore], () =>
    props.user ? NoteStore.getNote(props.user) : undefined,
  );
  if (!note || note.loading || !note.note) return null;

  let className = "moonlight-showNote";
  if (props.className) className += " " + props.className;

  return (
    <section className={className}>
      <Heading
        variant="text-xs/semibold"
        className="moonlight-showNote-heading"
      >
        Note
      </Heading>
      <Text variant="text-sm/normal" className="moonlight-showNote-text">
        {note.note}
      </Text>
    </section>
  );
}

export function injectPopout(
  jsxs: (...args: unknown[]) => React.ReactElement<any>,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    element.props.children.push(
      <Note user={element.props.children[0].props.user.id} />,
    );

    return element;
  };
}

export function injectSidebar(
  jsxs: (...args: unknown[]) => React.ReactElement<any>,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    element.props.children
      .at(-1)
      .props.children.push(
        <Note
          user={element.props.children[0].props.user.id}
          className="moonlight-showNote-sidebar"
        />,
      );

    return element;
  };
}
