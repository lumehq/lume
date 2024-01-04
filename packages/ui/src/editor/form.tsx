import { MentionNote, useArk, useStorage } from "@lume/ark";
import { TrashIcon } from "@lume/icons";
import { NDKCacheUserProfile } from "@lume/types";
import { cn, editorValueAtom } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
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
import { User } from "../user";
import { EditorAddMedia } from "./addMedia";
import {
	Portal,
	insertImage,
	insertMention,
	insertNostrEvent,
	isImageUrl,
} from "./utils";

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
			<div contentEditable={false} className="relative">
				<img
					src={element.url}
					alt={element.url}
					className={cn(
						"object-cover w-full h-auto border rounded-lg border-neutral-100 dark:border-neutral-900 ring-2",
						selected && focused ? "ring-blue-500" : "ring-transparent",
					)}
					contentEditable={false}
				/>
				<button
					type="button"
					contentEditable={false}
					onClick={() => Transforms.removeNodes(editor, { at: path })}
					className="absolute inline-flex items-center justify-center text-white bg-red-500 rounded-lg top-2 right-2 size-8 hover:bg-red-600"
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
			className="inline-block text-blue-500 align-baseline hover:text-blue-600"
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
				className="relative user-select-none"
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
	const ark = useArk();
	const storage = useStorage();
	const ref = useRef<HTMLDivElement | null>();

	const [editorValue, setEditorValue] = useAtom(editorValueAtom);
	const [contacts, setContacts] = useState<NDKCacheUserProfile[]>([]);
	const [target, setTarget] = useState<Range | undefined>();
	const [index, setIndex] = useState(0);
	const [search, setSearch] = useState("");
	const [editor] = useState(() =>
		withMentions(withNostrEvent(withImages(withReact(createEditor())))),
	);

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
		const event = new NDKEvent(ark.ndk);
		event.kind = NDKKind.Text;
		event.content = serialize(editor.children);

		const publish = await event.publish();

		if (!publish) toast.error("Failed to publish event, try again later.");

		toast.success(
			`Event has been published successfully to ${publish.size} relays.`,
		);

		reset();
	};

	useEffect(() => {
		async function loadContacts() {
			const res = await storage.getAllCacheUsers();
			if (res) setContacts(res);
		}

		loadContacts();
	}, []);

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
		<div className="w-full h-full flex flex-col justify-between rounded-xl overflow-hidden bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-[inset_0_0_0.5px_1px_hsla(0,0%,100%,0.075),0_0_0_1px_hsla(0,0%,0%,0.05),0_0.3px_0.4px_hsla(0,0%,0%,0.02),0_0.9px_1.5px_hsla(0,0%,0%,0.045),0_3.5px_6px_hsla(0,0%,0%,0.09)]">
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
				<div className="py-6 overflow-y-auto px-7">
					<Editable
						key={JSON.stringify(editorValue)}
						autoFocus={false}
						autoCapitalize="none"
						autoCorrect="none"
						spellCheck={false}
						renderElement={(props) => <Element {...props} />}
						placeholder="What are you up to?"
						className="focus:outline-none"
					/>
					{target && filters.length > 0 && (
						<Portal>
							<div
								ref={ref}
								className="top-[-9999px] left-[-9999px] absolute z-10 w-[250px] p-1 bg-white border border-neutral-50 dark:border-neutral-900 dark:bg-neutral-950 rounded-lg shadow-lg"
							>
								{filters.map((contact, i) => (
									// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
									<div
										key={contact.npub}
										onClick={() => {
											Transforms.select(editor, target);
											insertMention(editor, contact);
											setTarget(null);
										}}
										className="px-2 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
									>
										<User pubkey={contact.npub} variant="simple" />
									</div>
								))}
							</div>
						</Portal>
					)}
				</div>
				<div className="flex items-center justify-between h-16 px-3 border-t shrink-0 border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950">
					<div />
					<div className="flex items-center">
						<div className="inline-flex items-center gap-2">
							<EditorAddMedia />
						</div>
						<div className="w-px h-6 mx-3 bg-neutral-200 dark:bg-neutral-800" />
						<button
							type="button"
							onClick={submit}
							className="inline-flex items-center justify-center w-20 pb-[2px] font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
						>
							Post
						</button>
					</div>
				</div>
			</Slate>
		</div>
	);
}
