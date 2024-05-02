import { AddMediaIcon } from "@lume/icons";
import { Spinner } from "@lume/ui";
import { cn, insertImage, isImagePath } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useRouteContext } from "@tanstack/react-router";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { useSlateStatic } from "slate-react";
import { toast } from "sonner";

export function MediaButton({ className }: { className?: string }) {
	const { ark } = useRouteContext({ strict: false });
	const editor = useSlateStatic();

	const [loading, setLoading] = useState(false);

	const uploadToNostrBuild = async () => {
		try {
			// start loading
			setLoading(true);

			const image = await ark.upload();
			insertImage(editor, image);

			// reset loading
			setLoading(false);
		} catch (e) {
			setLoading(false);
			toast.error(`Upload failed, error: ${e}`);
		}
	};

	useEffect(() => {
		let unlisten: UnlistenFn = undefined;

		async function listenFileDrop() {
			const window = getCurrent();
			if (!unlisten) {
				unlisten = await window.listen("tauri://file-drop", async (event) => {
					// @ts-ignore, lfg !!!
					const items: string[] = event.payload.paths;
					// start loading
					setLoading(true);
					// upload all images
					for (const item of items) {
						if (isImagePath(item)) {
							const image = await ark.upload(item);
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
		<Tooltip.Provider>
			<Tooltip.Root delayDuration={150}>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						onClick={() => uploadToNostrBuild()}
						disabled={loading}
						className={cn("inline-flex items-center justify-center", className)}
					>
						{loading ? (
							<Spinner className="size-4" />
						) : (
							<AddMediaIcon className="size-4" />
						)}
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
						Upload media
						<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
