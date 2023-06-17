import { MediaIcon } from "@shared/icons";
import { Tooltip } from "@shared/tooltip";
import { open } from "@tauri-apps/api/dialog";
import { Body, fetch } from "@tauri-apps/api/http";
import { createBlobFromFile } from "@utils/createBlobFromFile";
import { useState } from "react";

export function MediaUploader({ setState }: { setState: any }) {
	const [loading, setLoading] = useState(false);

	const openFileDialog = async () => {
		const selected: any = await open({
			multiple: false,
			filters: [
				{
					name: "Image & Video",
					extensions: ["png", "jpeg", "jpg", "gif", "mp4", "mov"],
				},
			],
		});
		if (Array.isArray(selected)) {
			// user selected multiple files
		} else if (selected === null) {
			// user cancelled the selection
		} else {
			// start loading
			setLoading(true);

			const filename = selected.split("/").pop();
			const file = await createBlobFromFile(selected);
			const buf = await file.arrayBuffer();

			const res: { data: { file: { id: string } } } = await fetch(
				"https://void.cat/upload?cli=false",
				{
					method: "POST",
					timeout: 5,
					headers: {
						accept: "*/*",
						"Content-Type": "application/octet-stream",
						"V-Filename": filename,
						"V-Description": "Upload from https://lume.nu",
						"V-Strip-Metadata": "true",
					},
					body: Body.bytes(buf),
				},
			);

			const image = `https://void.cat/d/${res.data.file.id}.webp`;

			// update state
			setState((prev: string) => `${prev}\n${image}`);
			// stop loading
			setLoading(false);
		}
	};

	return (
		<Tooltip message="Upload media">
			<button
				type="button"
				onClick={() => openFileDialog()}
				className="group inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600"
			>
				{loading ? (
					<svg
						className="h-4 w-4 animate-spin text-black dark:text-zinc-100"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<title id="loading">Loading</title>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				) : (
					<MediaIcon
						width={14}
						height={14}
						className="text-zinc-400 group-hover:text-zinc-200"
					/>
				)}
			</button>
		</Tooltip>
	);
}
