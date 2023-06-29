import * as Tooltip from "@radix-ui/react-tooltip";
import { LoaderIcon, MediaIcon } from "@shared/icons";
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
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() => openFileDialog()}
						className="group inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600"
					>
						{loading ? (
							<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
						) : (
							<MediaIcon
								width={14}
								height={14}
								className="text-zinc-400 group-hover:text-zinc-200"
							/>
						)}
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="-left-10 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none text-sm rounded-md text-zinc-100 bg-zinc-800/80 backdrop-blur-lg px-3.5 py-1.5 leading-none will-change-[transform,opacity]"
						sideOffset={5}
					>
						Upload media
						<Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
