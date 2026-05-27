import Heading from "@moonlight-mod/wp/discord/design/components/Heading/Heading";
import React, { lazy, Suspense } from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import intl from "@moonlight-mod/wp/discord/intl";

const NoteInput = lazy(async () => {
  await spacepack.lazyLoad(
    "USER_PROFILE_MODAL_KEY",
    /n\.e\("(\d+)"\)/g,
    /n\.bind\(n,(\d+)\)/,
  );

  return {
    default: spacepack.findByCode(
      /"aria-label":\i\.intl\.string\(\i\.t\.PbMNh2\)/,
    )[0].exports.A as React.ComponentType<{
      userId: string;
      className: string;
    }>,
  };
});

type NoteProps = {
  user: string;
  className?: string;
};

export function Note(props: NoteProps) {
  let className = "moonlight-showNote";
  if (props.className) className += ` ${props.className}`;

  return (
    <Suspense>
      <section className={className}>
        <Heading
          variant="text-xs/semibold"
          className="moonlight-showNote-heading"
        >
          {
            // @ts-expect-error whatever
            intl.intl.string(intl.t["mQKv+v"])
          }
        </Heading>
        <NoteInput
          userId={props.user}
          className="note_eb110a moonlight-showNote-text"
        />
      </section>
    </Suspense>
  );
}

export function injectPopout(
  _: unknown,
  jsxs: (...args: unknown[]) => React.ReactElement<any>,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    element.props.children.push(
      <Note
        user={
          element.props.children[0].props.userId ??
          element.props.children[0].props.user.id
        }
      />,
    );

    return element;
  };
}

export function injectSidebar(
  _: unknown,
  jsxs: (...args: unknown[]) => React.ReactElement<any>,
) {
  return (...args: unknown[]) => {
    const element = jsxs(...args);

    element.props.children
      .at(-1)
      .props.children.push(
        <Note
          user={
            element.props.children[0].props.userId ??
            element.props.children[0].props.user.id
          }
          className="moonlight-showNote-sidebar"
        />,
      );

    return element;
  };
}
