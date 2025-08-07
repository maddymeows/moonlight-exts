import { Heading } from "@moonlight-mod/wp/discord/components/common/index";
import React, { lazy, Suspense } from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const intl = spacepack.require("discord/intl");

const NoteInput = lazy(async () => {
  await spacepack.lazyLoad(
    '"USER_PROFILE_MODAL_KEY:"' + ".concat",
    /n\.e\("(\d+)"\)/g,
    /n\.bind\(n,(\d+)\)/,
  );

  return {
    default: spacepack.findByCode(
      /"aria-label":\i\.intl\.string\(\i\.t\.PbMNh4\)/,
    )[0].exports.Z as React.ComponentType<{
      userId: string;
      className: string;
    }>,
  };
});

let profileNoteClassName = "";

type NoteProps = {
  user: string;
  className?: string;
};

export function Note(props: NoteProps) {
  let className = "moonlight-showNote";
  if (props.className) className += ` ${props.className}`;

  if (!profileNoteClassName) {
    profileNoteClassName = spacepack.findByCode(
      "profileNote:" + '"profileNote_',
    )[0].exports.profileNote;
  }

  return (
    <Suspense>
      <section className={className}>
        <Heading
          variant="text-xs/semibold"
          className="moonlight-showNote-heading"
        >
          {intl.intl.string(intl.t["mQKv+v"])}
        </Heading>
        <NoteInput
          userId={props.user}
          className={`${profileNoteClassName} moonlight-showNote-text`}
        />
      </section>
    </Suspense>
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
