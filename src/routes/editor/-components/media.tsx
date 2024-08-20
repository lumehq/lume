import { insertImage, isImagePath } from "@/commons";
import { Spinner } from "@/components";
import { NostrQuery } from "@/system";
import { Images } from "@phosphor-icons/react";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { useSlateStatic } from "slate-react";

export function MediaButton() {
	const editor = useSlateStatic();
	const [loading, setLoading] = useState(false);

	const upload = async () => {
		try {
			// start loading
			setLoading(true);

			const image = await NostrQuery.upload();
			insertImage(editor, image);

			// reset loading
			setLoading(false);
		} catch (e) {
			setLoading(false);
			await message(String(e), { title: "Upload", kind: "error" });
		}
	};

	useEffect(() => {
		let unlisten: UnlistenFn = undefined;

		async function listenFileDrop() {
			const window = getCurrentWindow();
			if (!unlisten) {
				unlisten = await window.listen("tauri://file-drop", async (event) => {
					// @ts-ignore, lfg !!!
					const items: string[] = event.payload.paths;
					// start loading
					setLoading(true);
					// upload all images
					for (const item of items) {
						if (isImagePath(item)) {
							const image = await NostrQuery.upload(item);
							insertImage(editor, image);
						}
					}
					// stop loading
					setLoading(false);
				});
			}
		}

		listenFileDrop();

		return () => {
			if (unlisten) unlisten();
		};
	}, []);

	return (
		<button
			type="button"
			onClick={() => upload()}
			disabled={loading}
			className="inline-flex items-center h-8 gap-2 px-2.5 text-sm rounded-lg text-black/70 dark:text-white/70 w-max hover:bg-black/10 dark:hover:bg-white/10"
		>
			{loading ? <Spinner className="size-4" /> : <Images className="size-4" />}
			Add media
		</button>
	);
}
