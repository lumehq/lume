import { useArk } from "@lume/ark";
import { LoaderIcon, TrashIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { cn, editorValueAtom } from "@lume/utils";
import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Descendant,
  Editor,
  Node,
  Range,
  Transforms,
  createEditor,
} from "slate";
import {
  Editable,
  ReactEditor,
  Slate,
  useFocused,
  useSelected,
  useSlateStatic,
  withReact,
} from "slate-react";
import { toast } from "sonner";
import { EditorAddMedia } from "./addMedia";
import {
  Portal,
  insertImage,
  insertMention,
  insertNostrEvent,
  isImageUrl,
} from "./utils";
import { MentionNote } from "../note/mentions/note";

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

export function EditorForm() {
  const ref = useRef<HTMLDivElement | null>();

  const [editorValue, setEditorValue] = useAtom(editorValueAtom);
  const [contacts, setContacts] = useState<NDKCacheUserProfile[]>([]);
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editor] = useState(() =>
    withMentions(withNostrEvent(withImages(withReact(createEditor())))),
  );

  const { t } = useTranslation();

  const filters = contacts
    ?.filter((c) => c?.name?.toLowerCase().startsWith(search.toLowerCase()))
    ?.slice(0, 10);

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

  const submit = async () => {
    try {
      setLoading(true);

      const content = serialize(editor.children);
      const publish = await invoke("publish", { content });

      if (publish) {
        console.log(publish);
        toast.success(t("editor.successMessage"));

        return reset();
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(String(e));
    }
  };

  /*
	useEffect(() => {
		async function loadContacts() {
			const res = await storage.getAllCacheUsers();
			if (res) setContacts(res);
		}

		loadContacts();
	}, []);
	*/

  useEffect(() => {
    if (target && filters.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [filters.length, editor, index, search, target]);

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/10">
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
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 bg-neutral-50 pl-7 pr-3 dark:border-neutral-900 dark:bg-neutral-950">
          <div>
            <h3 className="font-medium">{t("editor.title")}</h3>
          </div>
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2">
              <EditorAddMedia />
            </div>
            <div className="mx-3 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <button
              type="button"
              onClick={submit}
              className="inline-flex h-9 w-20 items-center justify-center rounded-lg border-t border-neutral-900 bg-neutral-950 pb-[2px] font-semibold text-neutral-50 hover:bg-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              {loading ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                t("global.post")
              )}
            </button>
          </div>
        </div>
        <div className="h-full overflow-y-auto px-7 py-6">
          <Editable
            key={JSON.stringify(editorValue)}
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect="none"
            spellCheck={false}
            renderElement={(props) => <Element {...props} />}
            placeholder={t("editor.placeholder")}
            className="focus:outline-none"
          />
          {target && filters.length > 0 && (
            <Portal>
              <div
                ref={ref}
                className="absolute left-[-9999px] top-[-9999px] z-10 w-[250px] rounded-xl border border-neutral-50 bg-white p-2 shadow-lg dark:border-neutral-900 dark:bg-neutral-950"
              >
                {filters.map((contact, i) => (
                  <button
                    key={contact.npub}
                    type="button"
                    onClick={() => {
                      Transforms.select(editor, target);
                      insertMention(editor, contact);
                      setTarget(null);
                    }}
                    className="flex w-full flex-col rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  >
                    <User.Provider pubkey={contact.npub}>
                      <User.Root className="flex w-full items-center gap-2.5">
                        <User.Avatar className="size-8 shrink-0 rounded-lg object-cover" />
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
      </Slate>
    </div>
  );
}
