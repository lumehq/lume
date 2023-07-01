import { LoaderIcon, PlusIcon } from "@shared/icons";
import { open } from "@tauri-apps/api/dialog";
import { Body, fetch } from "@tauri-apps/api/http";
import { createBlobFromFile } from "@utils/createBlobFromFile";
import { useState } from "react";

export function BannerUploader({ setBanner }: { setBanner: any }) {
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
			const image = `https://void.cat/d/${res.data.file.id}.jpg`;

			// update parent state
			setBanner(image);

			// disable loader
			setLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={() => openFileDialog()}
			className="w-full h-full inline-flex items-center justify-center bg-zinc-900/40"
		>
			{loading ? (
				<LoaderIcon className="h-8 w-8 animate-spin text-zinc-100" />
			) : (
				<PlusIcon className="h-8 w-8 text-zinc-100" />
			)}
		</button>
	);
}
