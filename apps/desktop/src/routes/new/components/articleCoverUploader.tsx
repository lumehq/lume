import { ImageIcon, LoaderIcon } from "@lume/icons";
import { message, open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";

export function ArticleCoverUploader({ setCover }) {
	const [loading, setLoading] = useState(false);

	const uploadToNostrBuild = async () => {
		try {
			// start loading
			setLoading(true);

			const selected = await open({
				multiple: false,
				filters: [
					{
						name: "Media",
						extensions: [
							"png",
							"jpeg",
							"jpg",
							"gif",
							"mp4",
							"mp3",
							"webm",
							"mkv",
							"avi",
							"mov",
						],
					},
				],
			});

			if (!selected) {
				setLoading(false);
				return;
			}

			const file = await readFile(selected.path);
			const blob = new Blob([file]);

			const data = new FormData();
			data.append("fileToUpload", blob);
			data.append("submit", "Upload Image");

			const res = await fetch("https://nostr.build/api/v2/upload/files", {
				method: "POST",
				body: data,
			});

			if (res.ok) {
				const json = await res.json();
				const content = json.data[0];
				setCover(content.url);

				// stop loading
				setLoading(false);
			}
		} catch (e) {
			// stop loading
			setLoading(false);
			await message(`Upload failed, error: ${e}`, {
				title: "Lume",
				type: "error",
			});
		}
	};

	return (
		<button
			type="button"
			onClick={uploadToNostrBuild}
			className="inline-flex h-9 w-max items-center justify-center gap-2 rounded-lg bg-neutral-100 px-2.5 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-800"
		>
			{loading ? (
				<LoaderIcon className="h-4 w-4 animate-spin" />
			) : (
				<>
					<ImageIcon className="h-4 w-4" />
					Add cover
				</>
			)}
		</button>
	);
}
