import { useArk } from "@lume/ark";
import { AddMediaIcon, LoaderIcon } from "@lume/icons";
import { useState } from "react";
import { useSlateStatic } from "slate-react";
import { toast } from "sonner";
import { insertImage } from "./utils";

export function EditorAddMedia() {
	const ark = useArk();
	const editor = useSlateStatic();

	const [loading, setLoading] = useState(false);

	const uploadToNostrBuild = async () => {
		try {
			setLoading(true);

			const image = await ark.upload({
				fileExts: ["mp4", "mp3", "webm", "mkv", "avi", "mov"],
			});

			if (image) {
				insertImage(editor, image);
				setLoading(false);
			}
		} catch (e) {
			setLoading(false);
			toast.error(`Upload failed, error: ${e}`);
		}
	};

	return (
		<button
			type="button"
			onClick={() => uploadToNostrBuild()}
			className="inline-flex items-center justify-center text-sm font-medium rounded-lg size-9 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
		>
			{loading ? (
				<LoaderIcon className="size-5 animate-spin" />
			) : (
				<AddMediaIcon className="size-5" />
			)}
		</button>
	);
}
