import { CheckCircleIcon, DownloadIcon } from "@lume/icons";
import { downloadDir } from "@tauri-apps/api/path";
import { Window } from "@tauri-apps/api/window";
import { download } from "@tauri-apps/plugin-upload";
import { SyntheticEvent, useState } from "react";

export function ImagePreview({ url }: { url: string }) {
	const [downloaded, setDownloaded] = useState(false);

	const downloadImage = async (e: { stopPropagation: () => void }) => {
		try {
			e.stopPropagation();

			const downloadDirPath = await downloadDir();
			const filename = url.substring(url.lastIndexOf("/") + 1);
			await download(url, downloadDirPath + `/${filename}`);

			setDownloaded(true);
		} catch (e) {
			console.error(e);
		}
	};

	const open = async () => {
		const name = new URL(url).pathname.split("/").pop();
		return new Window("image-viewer", {
			url,
			title: name,
		});
	};

	const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.src = "/fallback-image.jpg";
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={open} className="relative my-1 group">
			<img
				src={url}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				onError={fallback}
				className="object-cover w-full h-auto border rounded-lg border-neutral-200/50 dark:border-neutral-800/50"
			/>
			<button
				type="button"
				onClick={(e) => downloadImage(e)}
				className="absolute z-10 items-center justify-center hidden size-8 bg-white/10 text-white backdrop-blur-xl rounded-lg right-2 top-2 group-hover:inline-flex hover:bg-blue-500"
			>
				{downloaded ? (
					<CheckCircleIcon className="size-4" />
				) : (
					<DownloadIcon className="size-4" />
				)}
			</button>
		</div>
	);
}
