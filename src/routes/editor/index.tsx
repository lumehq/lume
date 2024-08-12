import { cn, insertImage, insertNostrEvent, isImageUrl } from "@/commons";
import { Spinner } from "@/components";
import { ComposeFilledIcon } from "@/components";
import { Note } from "@/components/note";
import { MentionNote } from "@/components/note/mentions/note";
import { User } from "@/components/user";
import { LumeEvent, useEvent } from "@/system";
import { createFileRoute } from "@tanstack/react-router";
import { nip19 } from "nostr-tools";
import { useEffect, useState } from "react";
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
import { PowButton } from "./-components/pow";
import { WarningButton } from "./-components/warning";

type EditorSearch = {
	reply_to: string;
	quote: string;
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
			quote: search.quote,
		};
	},
	beforeLoad: ({ search }) => {
		let initialValue: EditorElement[];

		if (search?.quote?.length) {
			const eventId = nip19.noteEncode(search.quote);
			initialValue = [
				{
					type: "paragraph",
					children: [{ text: "" }],
				},
				{
					type: "event",
					eventId: `nostr:${eventId}`,
					children: [{ text: "" }],
				},
			];
		} else {
			initialValue = [
				{
					type: "paragraph",
					children: [{ text: "" }],
				},
			];
		}

		return { initialValue };
	},
	component: Screen,
});

function Screen() {
	const { reply_to } = Route.useSearch();
	const { initialValue } = Route.useRouteContext();

	const [editorValue, setEditorValue] = useState<EditorElement[]>(null);
	const [loading, setLoading] = useState(false);
	const [warning, setWarning] = useState({ enable: false, reason: "" });
	const [difficulty, setDifficulty] = useState({ enable: false, num: 21 });
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
				warning.enable && warning.reason.length ? warning.reason : null,
				difficulty.enable && difficulty.num > 0 ? difficulty.num : null,
				reply_to,
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

	useEffect(() => {
		setEditorValue(initialValue);
	}, [initialValue]);

	if (!editorValue) return null;

	return (
		<div className="flex flex-col w-full h-full">
			<Slate editor={editor} initialValue={editorValue}>
				<div data-tauri-drag-region className="h-9 shrink-0" />
				<div className="flex flex-col flex-1 overflow-y-auto">
					{reply_to?.length ? (
						<div className="flex items-center gap-3 px-2.5 pb-3 border-b border-black/5 dark:border-white/5">
							<div className="text-sm font-semibold shrink-0">Reply to:</div>
							<ChildNote id={reply_to} />
						</div>
					) : null}
					<div className="px-4 py-4 overflow-y-auto">
						<Editable
							key={JSON.stringify(editorValue)}
							autoFocus={true}
							autoCapitalize="none"
							autoCorrect="none"
							spellCheck={false}
							renderElement={(props) => <Element {...props} />}
							placeholder={
								reply_to ? "Type your reply..." : "What're you up to?"
							}
							className="focus:outline-none"
						/>
					</div>
				</div>
				{warning.enable ? (
					<div className="flex items-center w-full px-4 border-t h-11 shrink-0 border-black/5 dark:border-white/5">
						<span className="text-sm shrink-0 text-black/50 dark:text-white/50">
							Reason:
						</span>
						<input
							type="text"
							placeholder="NSFW..."
							value={warning.reason}
							onChange={(e) =>
								setWarning((prev) => ({ ...prev, reason: e.target.value }))
							}
							className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-black/50 dark:placeholder:text-white/50"
						/>
					</div>
				) : null}
				{difficulty.enable ? (
					<div className="flex items-center w-full px-4 border-t h-11 shrink-0 border-black/5 dark:border-white/5">
						<span className="text-sm shrink-0 text-black/50 dark:text-white/50">
							Difficulty:
						</span>
						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]"
							onKeyDown={(event) => {
								if (!/[0-9]/.test(event.key)) {
									event.preventDefault();
								}
							}}
							placeholder="21"
							defaultValue={difficulty.num}
							onChange={(e) =>
								setWarning((prev) => ({ ...prev, num: Number(e.target.value) }))
							}
							className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-black/50 dark:placeholder:text-white/50"
						/>
					</div>
				) : null}
				<div
					data-tauri-drag-region
					className="flex items-center w-full h-16 gap-4 px-4 border-t divide-x divide-black/5 dark:divide-white/5 shrink-0 border-black/5 dark:border-white/5"
				>
					<button
						type="button"
						onClick={() => publish()}
						className="inline-flex items-center justify-center h-8 gap-1 px-2.5 text-sm font-medium rounded-lg bg-black/10 w-max hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
					>
						{loading ? (
							<Spinner className="size-4" />
						) : (
							<ComposeFilledIcon className="size-4" />
						)}
						Publish
					</button>
					<div className="inline-flex items-center flex-1 gap-2 pl-4">
						<MediaButton />
						<WarningButton setWarning={setWarning} />
						<PowButton setDifficulty={setDifficulty} />
					</div>
				</div>
			</Slate>
		</div>
	);
}

function ChildNote({ id }: { id: string }) {
	const { isLoading, isError, data } = useEvent(id);

	if (isLoading) {
		return <Spinner className="size-5" />;
	}

	if (isError || !data) {
		return <div>Event not found with your current relay set.</div>;
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="flex items-center gap-2">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="shrink-0">
						<User.Avatar className="rounded-full size-8" />
					</User.Root>
				</User.Provider>
				<div className="content-break line-clamp-1">{data.content}</div>
			</Note.Root>
		</Note.Provider>
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

		if (text.startsWith("nevent") || text.startsWith("note")) {
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
			<div
				contentEditable={false}
				className="relative my-2 user-select-none"
				onClick={() => Transforms.removeNodes(editor, { at: path })}
				onKeyDown={() => Transforms.removeNodes(editor, { at: path })}
			>
				<MentionNote eventId={element.eventId} openable={false} />
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
