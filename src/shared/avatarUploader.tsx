import { createBlobFromFile } from "@utils/createBlobFromFile";

import { LoaderIcon } from "./icons";
import { open } from "@tauri-apps/api/dialog";
import { Body, fetch } from "@tauri-apps/api/http";
import { useState } from "react";

export function AvatarUploader({ valueState }: { valueState: any }) {
	const [loading, setLoading] = useState(false);

	const openFileDialog = async () => {
		const selected: any = await open({
			multiple: false,
			filters: [
				{
					name: "Image",
					extensions: ["png", "jpeg", "jpg", "gif"],
				},
			],
		});
		if (Array.isArray(selected)) {
			// user selected multiple files
		} else if (selected === null) {
			// user cancelled the selection
		} else {
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
			const webpImage = `https://void.cat/d/${res.data.file.id}.webp`;

			valueState(webpImage);
			setLoading(false);
		}
	};

	return (
		<button
			onClick={() => openFileDialog()}
			type="button"
			className="inline-flex h-7 items-center justify-center rounded bg-zinc-900 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
		>
			{loading ? (
				<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
			) : (
				<span className="leading-none">Upload</span>
			)}
		</button>
	);
}
