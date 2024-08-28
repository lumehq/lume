import { insertImage, isImagePath, upload } from "@/commons";
import { Spinner } from "@/components";
import { Images } from "@phosphor-icons/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useTransition } from "react";
import { useSlateStatic } from "slate-react";

export function MediaButton() {
	const editor = useSlateStatic();
	const [isPending, startTransition] = useTransition();

	const uploadMedia = () => {
		startTransition(async () => {
			try {
				const image = await upload();
				return insertImage(editor, image);
			} catch (e) {
				await message(String(e), { title: "Upload", kind: "error" });
				return;
			}
		});
	};

	useEffect(() => {
		const unlisten = getCurrentWindow().listen("tauri://file-drop", (event) => {
			startTransition(async () => {
				// @ts-ignore, lfg !!!
				const items: string[] = event.payload.paths;

				// upload all images
				for (const item of items) {
					if (isImagePath(item)) {
						const image = await upload(item);
						insertImage(editor, image);
					}
				}

				return;
			});
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<button
			type="button"
			onClick={() => uploadMedia()}
			disabled={isPending}
			className="inline-flex items-center h-8 gap-2 px-2.5 text-sm rounded-lg text-black/70 dark:text-white/70 w-max hover:bg-black/10 dark:hover:bg-white/10"
		>
			{isPending ? (
				<Spinner className="size-4" />
			) : (
				<Images className="size-4" />
			)}
			Add media
		</button>
	);
}
