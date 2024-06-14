import { ComposeFilledIcon } from "@lume/icons";
import { Spinner } from "@lume/ui";
import { cn, insertImage, insertNostrEvent, isImageUrl } from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
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
import { MentionButton } from "./-components/mention";
import { LumeEvent } from "@lume/system";
import { WarningToggle } from "./-components/warning";
import { MentionNote } from "@/components/note/mentions/note";

type EditorSearch = {
	reply_to: string;
	quote: boolean;
};

type EditorElement = {
	type: string;
	children: Descendant[];
	eventId?: string;
};

export const Route = createFileRoute("/editor/")({
	validateSearch: (search: Record<string, string>): EditorSearch => {
		return {
			reply_to: search.reply_to,
			quote: search.quote === "true" || false,
		};
	},
	component: Screen,
});

const initialValue: EditorElement[] = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

function Screen() {
	const search = Route.useSearch();

	const [t] = useTranslation();
	const [editorValue, setEditorValue] = useState(initialValue);
	const [loading, setLoading] = useState(false);
	const [warning, setWarning] = useState(false);
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
			const eventId = await LumeEvent.publish(
				content,
				search.reply_to,
				search.quote,
				warning,
			);

			if (eventId) {
				// stop loading
				setLoading(false);
				// reset form
				reset();
			}
		} catch (e) {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col w-full h-full">
			<Slate editor={editor} initialValue={editorValue}>
				<div
					data-tauri-drag-region
					className="flex items-center justify-end w-full gap-2 px-2 border-b shrink-0 h-14 border-black/10 dark:border-white/10"
				>
					<WarningToggle
						warning={warning}
						setWarning={setWarning}
						className="rounded-full size-8 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					/>
					<MentionButton className="rounded-full size-8 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" />
					<MediaButton className="rounded-full size-8 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" />
					<button
						type="button"
						onClick={() => publish()}
						className="inline-flex items-center justify-center h-8 gap-1 px-3 text-sm font-medium text-white bg-blue-500 rounded-full w-max hover:bg-blue-600"
					>
						{loading ? (
							<Spinner className="size-4" />
						) : (
							<ComposeFilledIcon className="size-4" />
						)}
						{t("global.post")}
					</button>
				</div>
				<div className="flex flex-col flex-1 overflow-y-auto">
					{search.reply_to ? (
						<div className="px-4 py-2">
							<MentionNote eventId={search.reply_to} />
						</div>
					) : null}
					<div className="p-4 overflow-y-auto scrollbar-none">
						<Editable
							key={JSON.stringify(editorValue)}
							autoFocus={true}
							autoCapitalize="none"
							autoCorrect="none"
							spellCheck={false}
							renderElement={(props) => <Element {...props} />}
							placeholder={
								search.reply_to ? "Type your reply..." : t("editor.placeholder")
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

const Image = ({ attributes, element, children }) => {
	const editor = useSlateStatic();
	const selected = useSelected();
	const focused = useFocused();
	const path = ReactEditor.findPath(editor as ReactEditor, element);

	return (
		<div {...attributes}>
			{children}
			<img
				src={element.url}
				alt={element.url}
				className={cn(
					"my-2 h-auto w-1/2 rounded-lg object-cover ring-2 outline outline-1 -outline-offset-1 outline-black/15",
					selected && focused ? "ring-blue-500" : "ring-transparent",
				)}
				onClick={() => Transforms.removeNodes(editor, { at: path })}
				onKeyDown={() => Transforms.removeNodes(editor, { at: path })}
			/>
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
				className="relative my-2 user-select-none"
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
