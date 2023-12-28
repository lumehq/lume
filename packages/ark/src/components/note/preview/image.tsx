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

	const open = () => {
		return new Window("image-viewer", { url, title: "Image Viewer" });
	};

	const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.src = "/fallback-image.jpg";
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={open} className="group relative">
			<img
				src={url}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				onError={fallback}
				className="h-auto w-full rounded-lg border border-neutral-200/50 object-cover dark:border-neutral-800/50"
			/>
			<button
				type="button"
				onClick={(e) => downloadImage(e)}
				className="absolute right-2 top-2 z-10 hidden h-10 w-10 items-center justify-center rounded-lg bg-blue-500 group-hover:inline-flex hover:bg-blue-600"
			>
				{downloaded ? (
					<CheckCircleIcon className="h-5 w-5 text-white" />
				) : (
					<DownloadIcon className="h-5 w-5 text-white" />
				)}
			</button>
		</div>
	);
}
