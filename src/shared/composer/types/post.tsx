import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Button } from "@shared/button";
import { ImageUploader } from "@shared/composer/imageUploader";
import { TrashIcon } from "@shared/icons";
import { MentionNote } from "@shared/notes/mentions/note";
import { RelayContext } from "@shared/relayProvider";
import { useComposer } from "@stores/composer";
import { dateToUnix } from "@utils/date";
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
					<TrashIcon width={14} height={14} className="text-zinc-100" />
				</button>
			</div>
		</figure>
	);
};

export function Post({ pubkey, privkey }: { pubkey: string; privkey: string }) {
	const ndk = useContext(RelayContext);
	const [repost, toggle] = useComposer((state: any) => [
		state.repost,
		state.toggle,
	]);
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

		const signer = new NDKPrivateKeySigner(privkey);
		ndk.signer = signer;

		const event = new NDKEvent(ndk);
		event.content = serializedContent;
		event.created_at = dateToUnix();
		event.pubkey = pubkey;
		if (repost.id && repost.pubkey) {
			event.kind = 6;
			event.tags = [
				["e", repost.id],
				["p", repost.pubkey],
			];
		} else {
			event.kind = 1;
			event.tags = [];
		}

		// publish event
		event.publish();

		// close modal
		toggle(false);
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
					<div className="w-full">
						<Editable
							autoFocus
							placeholder="What's on your mind?"
							spellCheck="false"
							className={`${
								repost.id ? "!min-h-42" : "!min-h-[86px]"
							} markdown`}
							renderElement={renderElement}
						/>
						{repost.id && <MentionNote id={repost.id} />}
					</div>
				</div>
				<div className="mt-4 flex items-center justify-between">
					<ImageUploader />
					<Button onClick={() => submit} preset="publish">
						Publish
					</Button>
				</div>
			</div>
		</Slate>
	);
}
