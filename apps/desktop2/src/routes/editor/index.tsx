import { ComposeFilledIcon, TrashIcon } from "@lume/icons";
import {
  Portal,
  cn,
  insertImage,
  insertMention,
  insertNostrEvent,
  isImageUrl,
  sendNativeNotification,
} from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MediaButton } from "./-components/media";
import { MentionNote } from "@lume/ui/src/note/mentions/note";
import {
  Descendant,
  Editor,
  Node,
  Range,
  Transforms,
  createEditor,
} from "slate";
import {
  ReactEditor,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  Slate,
  Editable,
} from "slate-react";
import { Contact } from "@lume/types";
import { Spinner, User } from "@lume/ui";
import { nip19 } from "nostr-tools";
import { invoke } from "@tauri-apps/api/core";
import { NsfwToggle } from "./-components/nsfw";

type EditorSearch = {
  reply_to: string;
  quote: boolean;
};

export const Route = createFileRoute("/editor/")({
  validateSearch: (search: Record<string, string>): EditorSearch => {
    return {
      reply_to: search.reply_to,
      quote: search.quote === "true" ?? false,
    };
  },
  beforeLoad: async ({ search }) => {
    const contacts: Contact[] = await invoke("get_contact_metadata");

    return {
      contacts,
      initialValue: search.quote
        ? [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
            {
              type: "event",
              eventId: `nostr:${nip19.noteEncode(search.reply_to)}`,
              children: [{ text: "" }],
            },
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ]
        : [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
    };
  },
  component: Screen,
  pendingComponent: Pending,
});

function Screen() {
  const ref = useRef<HTMLDivElement | null>();
  const { reply_to, quote } = Route.useSearch();
  const { ark, initialValue, contacts } = Route.useRouteContext();

  const [t] = useTranslation();
  const [editorValue, setEditorValue] = useState(initialValue);
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [editor] = useState(() =>
    withMentions(withNostrEvent(withImages(withReact(createEditor())))),
  );

  const filters = contacts
    ?.filter((c) =>
      c?.profile.name?.toLowerCase().startsWith(search.toLowerCase()),
    )
    ?.slice(0, 5);

  const reset = () => {
    // @ts-expect-error, backlog
    editor.children = [{ type: "paragraph", children: [{ text: "" }] }];
    setEditorValue([{ type: "paragraph", children: [{ text: "" }] }]);
  };

  const serialize = (nodes: Descendant[]) => {
    return nodes
      .map((n) => {
        // @ts-expect-error, backlog
        if (n.type === "image") return n.url;
        // @ts-expect-error, backlog
        if (n.type === "event") return n.eventId;

        // @ts-expect-error, backlog
        if (n.children.length) {
          // @ts-expect-error, backlog
          return n.children
            .map((n) => {
              if (n.type === "mention") return n.npub;
              return Node.string(n).trim();
            })
            .join(" ");
        }

        return Node.string(n);
      })
      .join("\n");
  };

  const publish = async () => {
    try {
      // start loading
      setLoading(true);

      const content = serialize(editor.children);
      const eventId = await ark.publish(content, reply_to, quote);

      if (eventId) {
        await sendNativeNotification("You've publish new post successfully.");
      }

      // stop loading
      setLoading(false);
      // reset form
      reset();
    } catch (e) {
      setLoading(false);
      await sendNativeNotification(String(e));
    }
  };

  useEffect(() => {
    if (target && filters.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.scrollY + 24}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
    }
  }, [filters.length, editor, index, search, target]);

  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <Slate
        editor={editor}
        initialValue={editorValue}
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText?.match(/^@(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(null);
        }}
      >
        <div
          data-tauri-drag-region
          className="flex h-14 w-full shrink-0 items-center justify-end gap-2 px-2"
        >
          <NsfwToggle
            nsfw={nsfw}
            setNsfw={setNsfw}
            className="size-8 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          />
          <MediaButton className="size-8 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700" />
          <button
            type="button"
            onClick={publish}
            className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            {loading ? (
              <Spinner className="size-4" />
            ) : (
              <ComposeFilledIcon className="size-4" />
            )}
            {t("global.post")}
          </button>
        </div>
        <div className="flex h-full min-h-0 w-full">
          <div className="flex h-full w-full flex-1 flex-col gap-2 px-2 pb-2">
            {reply_to && !quote ? <MentionNote eventId={reply_to} /> : null}
            <div className="h-full w-full flex-1 overflow-hidden overflow-y-auto rounded-xl bg-white p-5 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
              <Editable
                key={JSON.stringify(editorValue)}
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect="none"
                spellCheck={false}
                renderElement={(props) => <Element {...props} />}
                placeholder={
                  reply_to ? "Type your reply..." : t("editor.placeholder")
                }
                className="focus:outline-none"
              />
              {target && filters.length > 0 && (
                <Portal>
                  <div
                    ref={ref}
                    className="absolute left-[-9999px] top-[-9999px] z-10 w-[250px] rounded-xl border border-neutral-50 bg-white p-2 shadow-lg dark:border-neutral-900 dark:bg-neutral-950"
                  >
                    {filters.map((contact) => (
                      <button
                        key={contact.pubkey}
                        type="button"
                        onClick={() => {
                          Transforms.select(editor, target);
                          insertMention(editor, contact);
                          setTarget(null);
                        }}
                        className="flex w-full flex-col rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      >
                        <User.Provider pubkey={contact.pubkey}>
                          <User.Root className="flex w-full items-center gap-2">
                            <User.Avatar className="size-7 shrink-0 rounded-full object-cover" />
                            <div className="flex w-full flex-col items-start">
                              <User.Name className="max-w-[8rem] truncate text-sm font-medium" />
                            </div>
                          </User.Root>
                        </User.Provider>
                      </button>
                    ))}
                  </div>
                </Portal>
              )}
            </div>
          </div>
        </div>
      </Slate>
    </div>
  );
}

function Pending() {
  return (
    <div
      data-tauri-drag-region
      className="flex h-full w-full items-center justify-center gap-2.5"
    >
      <button type="button" disabled>
        <Spinner className="size-5" />
      </button>
      <p>Loading cache...</p>
    </div>
  );
}

const withNostrEvent = (editor: ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    // @ts-expect-error, wtf
    return element.type === "event" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text.startsWith("nevent1") || text.startsWith("note1")) {
      insertNostrEvent(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withMentions = (editor: ReactEditor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    // @ts-expect-error, wtf
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    // @ts-expect-error, wtf
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    // @ts-expect-error, wtf
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    // @ts-expect-error, wtf
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor as ReactEditor, element);

  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative my-2">
        <img
          src={element.url}
          alt={element.url}
          className={cn(
            "h-auto w-full rounded-lg border border-neutral-100 object-cover ring-2 dark:border-neutral-900",
            selected && focused ? "ring-blue-500" : "ring-transparent",
          )}
          contentEditable={false}
        />
        <button
          type="button"
          contentEditable={false}
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

const Mention = ({ attributes, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor as ReactEditor, element);

  return (
    <span
      {...attributes}
      type="button"
      contentEditable={false}
      onClick={() => Transforms.removeNodes(editor, { at: path })}
      className="inline-block align-baseline text-blue-500 hover:text-blue-600"
    >{`@${element.name}`}</span>
  );
};

const Event = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor as ReactEditor, element);

  return (
    <div {...attributes}>
      {children}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        contentEditable={false}
        onClick={() => Transforms.removeNodes(editor, { at: path })}
        className="user-select-none relative my-2"
      >
        <MentionNote
          eventId={element.eventId.replace("nostr:", "")}
          openable={false}
        />
      </div>
    </div>
  );
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "image":
      return <Image {...props} />;
    case "mention":
      return <Mention {...props} />;
    case "event":
      return <Event {...props} />;
    default:
      return (
        <p {...attributes} className="text-lg">
          {children}
        </p>
      );
  }
};
