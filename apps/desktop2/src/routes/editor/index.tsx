import { ComposeFilledIcon, TrashIcon } from "@lume/icons";
import { Spinner } from "@lume/ui";
import {
	cn,
	insertImage,
	insertNostrEvent,
	isImageUrl,
	sendNativeNotification,
} from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { nip19 } from "nostr-tools";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Descendant, Node, Transforms, createEditor } from "slate";
import {
	Editable,
	ReactEditor,
	Slate,
	useFocused,
	useSelected,
	useSlateStatic,
	withReact,
} from "slate-react";
import { MediaButton } from "./-components/media";
import { NsfwToggle } from "./-components/nsfw";
import { MentionButton } from "./-components/mention";
import { MentionNote } from "@/components/note/mentions/note";

type EditorSearch = {
	reply_to: string;
	quote: boolean;
};

export const Route = createFileRoute("/editor/")({
	validateSearch: (search: Record<string, string>): EditorSearch => {
		return {
			reply_to: search.reply_to,
			quote: search.quote === "true" || false,
		};
	},
	beforeLoad: async ({ search }) => {
		return {
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
});

function Screen() {
	const { reply_to, quote } = Route.useSearch();
	const { ark, initialValue } = Route.useRouteContext();

	const [t] = useTranslation();
	const [editorValue, setEditorValue] = useState(initialValue);
	const [loading, setLoading] = useState(false);
	const [nsfw, setNsfw] = useState(false);
	const [editor] = useState(() =>
		withMentions(withNostrEvent(withImages(withReact(createEditor())))),
	);

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
				await sendNativeNotification(
					"Your note has been published successfully.",
					"Lume",
				);
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

	return (
		<div className="w-full h-full">
			<Slate editor={editor} initialValue={editorValue}>
				<div
					data-tauri-drag-region
					className="flex h-14 w-full shrink-0 items-center justify-end gap-2 px-2 border-b border-black/10 dark:border-white/10"
				>
					<NsfwToggle
						nsfw={nsfw}
						setNsfw={setNsfw}
						className="size-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					/>
					<MentionButton className="size-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" />
					<MediaButton className="size-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" />
					<button
						type="button"
						onClick={() => publish()}
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
				<div className="flex h-full w-full flex-1 flex-col">
					{reply_to && !quote ? (
						<div className="px-4 py-2">
							<MentionNote eventId={reply_to} />
						</div>
					) : null}
					<div className="overflow-y-auto p-4">
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
					</div>
				</div>
			</Slate>
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
				<p {...attributes} className="text-[15px]">
					{children}
				</p>
			);
	}
};
