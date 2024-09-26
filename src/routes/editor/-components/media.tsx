import { isImagePath, upload } from "@/commons";
import { Spinner } from "@/components";
import { Images } from "@phosphor-icons/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useTransition,
} from "react";

export function MediaButton({
	setText,
	setAttaches,
}: {
	setText: Dispatch<SetStateAction<string>>;
	setAttaches: Dispatch<SetStateAction<string[]>>;
}) {
	const [isPending, startTransition] = useTransition();

	const uploadMedia = () => {
		startTransition(async () => {
			try {
				const image = await upload();
				setText((prev) => `${prev}\n${image}`);
				setAttaches((prev) => [...prev, image]);
				return;
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
						setText((prev) => `${prev}\n${image}`);
						setAttaches((prev) => [...prev, image]);
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
