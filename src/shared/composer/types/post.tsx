import { ImageUploader } from "@shared/composer/imageUploader";
import { TrashIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { WRITEONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { getEventHash, getSignature } from "nostr-tools";
import { useCallback, useContext, useMemo, useState } from "react";
import { Node, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
	Editable,
	ReactEditor,
	Slate,
	useSlateStatic,
	withReact,
} from "slate-react";

const withImages = (editor) => {
	const { isVoid } = editor;

	editor.isVoid = (element) => {
		return element.type === "image" ? true : isVoid(element);
	};

	return editor;
};

const ImagePreview = ({
	attributes,
	children,
	element,
}: {
	attributes: any;
	children: any;
	element: any;
}) => {
	const editor: any = useSlateStatic();
	const path = ReactEditor.findPath(editor, element);

	return (
		<figure {...attributes} className="m-0 mt-3">
			{children}
			<div contentEditable={false} className="relative">
				<img
					alt={element.url}
					src={element.url}
					className="m-0 h-auto w-full rounded-md"
				/>
				<button
					type="button"
					onClick={() => Transforms.removeNodes(editor, { at: path })}
					className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center gap-0.5 rounded bg-zinc-800 text-base font-medium text-zinc-400 shadow-mini-button hover:bg-zinc-700"
				>
					<TrashIcon width={14} height={14} className="text-white" />
				</button>
			</div>
		</figure>
	);
};

export function Post({ pubkey, privkey }: { pubkey: string; privkey: string }) {
	const pool: any = useContext(RelayContext);

	const editor = useMemo(
		() => withReact(withImages(withHistory(createEditor()))),
		[],
	);
	const [content, setContent] = useState<Node[]>([
		{
			children: [
				{
					text: "",
				},
			],
		},
	]);

	const serialize = useCallback((nodes: Node[]) => {
		return nodes.map((n) => Node.string(n)).join("\n");
	}, []);

	const submit = () => {
		// serialize content
		const serializedContent = serialize(content);
		console.log(serializedContent);

		const event: any = {
			content: serializedContent,
			created_at: dateToUnix(),
			kind: 1,
			pubkey: pubkey,
			tags: [],
		};
		event.id = getEventHash(event);
		event.sig = getSignature(event, privkey);

		// publish note
		pool.publish(event, WRITEONLY_RELAYS);
	};

	const renderElement = useCallback((props: any) => {
		switch (props.element.type) {
			case "image":
				if (props.element.url) {
					return <ImagePreview {...props} />;
				}
			default:
				return <p {...props.attributes}>{props.children}</p>;
		}
	}, []);

	return (
		<Slate editor={editor} value={content} onChange={setContent}>
			<div className="flex h-full flex-col px-4 pb-4">
				<div className="flex h-full w-full gap-2">
					<div className="flex w-8 shrink-0 items-center justify-center">
						<div className="h-full w-[2px] bg-zinc-800" />
					</div>
					<div className="w-full markdown">
						<Editable
							autoFocus
							placeholder="What's on your mind?"
							spellCheck="false"
							className="!min-h-[86px]"
							renderElement={renderElement}
						/>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<ImageUploader />
					<button
						type="button"
						onClick={submit}
						className="inline-flex h-7 w-max items-center justify-center gap-1 rounded-md bg-fuchsia-500 px-3.5 text-base font-medium text-white shadow-button hover:bg-fuchsia-600"
					>
						Post
					</button>
				</div>
			</div>
		</Slate>
	);
}
